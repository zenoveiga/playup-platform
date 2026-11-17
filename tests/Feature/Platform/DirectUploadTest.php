<?php

namespace Tests\Feature\Platform;

use App\Models\Course;
use App\Models\CourseModule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DirectUploadTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $disk = Storage::fake(config('playup.media.disk'));
        $disk->buildTemporaryUploadUrlsUsing(fn ($path) => ['url' => 'https://bucket.test/'.$path, 'headers' => []]);
        $this->admin = User::factory()->create(['role' => 'super_admin']);
    }

    /** Simula o navegador: pede a URL e "envia" o arquivo para a chave temporária. */
    private function directUpload(string $kind, string $name, string $type, int $size = 5000): string
    {
        $key = $this->actingAs($this->admin)->postJson('/administrador/uploads', [
            'kind' => $kind, 'filename' => $name, 'content_type' => $type, 'size' => $size,
        ])->assertOk()->json('key');

        Storage::disk(config('playup.media.disk'))->put($key, str_repeat('x', $size));

        return $key;
    }

    public function test_real_s3_disk_is_recognized_for_direct_uploads(): void
    {
        config([
            'playup.media.disk' => 's3-check',
            'filesystems.disks.s3-check' => [
                'driver' => 's3', 'key' => 'test', 'secret' => 'test', 'region' => 'sa-east-1', 'bucket' => 'play-up',
            ],
        ]);

        $this->assertTrue(\App\Support\Media::supportsDirectUploads());

        $this->actingAs($this->admin)->postJson('/administrador/uploads', [
            'kind' => 'video', 'filename' => 'aula.mp4', 'content_type' => 'video/mp4', 'size' => 1000,
        ])->assertOk()->assertJsonPath('direct', true);
    }

    public function test_presign_returns_url_and_validates_type_and_size(): void
    {
        $this->actingAs($this->admin)->postJson('/administrador/uploads', [
            'kind' => 'video', 'filename' => 'aula.mp4', 'content_type' => 'video/mp4', 'size' => 1000,
        ])->assertOk()->assertJsonStructure(['key', 'url', 'headers']);

        $this->postJson('/administrador/uploads', [
            'kind' => 'video', 'filename' => 'apostila.pdf', 'content_type' => 'application/pdf', 'size' => 1000,
        ])->assertJsonValidationErrors('content_type');

        $this->postJson('/administrador/uploads', [
            'kind' => 'document', 'filename' => 'enorme.pdf', 'content_type' => 'application/pdf',
            'size' => (config('playup.uploads.max_file_kb') + 1) * 1024,
        ])->assertJsonValidationErrors('size');
    }

    public function test_large_video_uploaded_directly_is_attached_to_the_module(): void
    {
        $key = $this->directUpload('video', 'Aula Conceito.mp4', 'video/mp4');
        $doc = $this->directUpload('document', 'Apostila.pdf', 'application/pdf');

        $this->post('/administrador/modulos', [
            'title' => 'Módulo', 'application_minutes' => 10, 'status' => 'published',
            'videos' => [['category' => 'Conceito', 'source' => 'upload', 'upload_key' => $key]],
            'support' => [['type' => 'document', 'title' => 'Apostila', 'upload_key' => $doc]],
        ])->assertSessionHasNoErrors();

        $module = CourseModule::first();
        $video = $module->videos()->first();
        $disk = Storage::disk(config('playup.media.disk'));

        $this->assertStringStartsWith("courses/modules/{$module->id}/", $video->file_path);
        $this->assertSame('Aula Conceito.mp4', $video->file_name);
        $this->assertSame('video/mp4', $video->mime_type);
        $disk->assertExists($video->file_path);
        $disk->assertMissing($key);
        $this->assertSame(1, $module->supportMaterials()->count());
    }

    public function test_free_course_cover_and_materials_can_be_uploaded_directly(): void
    {
        $cover = $this->directUpload('image', 'capa.jpg', 'image/jpeg');
        $video = $this->directUpload('video', 'aula.mp4', 'video/mp4');

        $this->post('/administrador/cursos', [
            'title' => 'Livre', 'level' => 'iniciante', 'status' => 'published', 'structure' => 'free',
            'cover_upload_key' => $cover,
            'materials' => [['type' => 'video', 'title' => 'Aula', 'source' => 'upload', 'upload_key' => $video]],
        ])->assertSessionHasNoErrors();

        $course = Course::first();
        $this->assertStringStartsWith('courses/covers/', $course->cover_path);
        $this->assertSame('aula.mp4', $course->materials->first()->file_name);
    }

    public function test_upload_keys_are_tied_to_their_user_and_kind(): void
    {
        $doc = $this->directUpload('document', 'apostila.pdf', 'application/pdf');

        // Documento não pode ser usado como vídeo.
        $this->post('/administrador/modulos', [
            'title' => 'M', 'application_minutes' => 10, 'status' => 'draft',
            'videos' => [['category' => 'Conceito', 'source' => 'upload', 'upload_key' => $doc]],
        ])->assertSessionHasErrors('videos.0.file');

        // Chave de outro administrador é recusada.
        $other = User::factory()->create(['role' => 'super_admin']);
        $this->actingAs($other)->post('/administrador/modulos', [
            'title' => 'M', 'application_minutes' => 10, 'status' => 'draft',
            'support' => [['type' => 'document', 'title' => 'X', 'upload_key' => $doc]],
        ])->assertSessionHasErrors('support.0.file');

        // Chave inventada também.
        $this->actingAs($this->admin)->post('/administrador/modulos', [
            'title' => 'M', 'application_minutes' => 10, 'status' => 'draft',
            'videos' => [['category' => 'Conceito', 'source' => 'upload', 'upload_key' => 'uploads/x/hack.mp4']],
        ])->assertSessionHasErrors('videos.0.file');
    }

    public function test_oversized_post_returns_to_the_form_with_a_message(): void
    {
        $this->actingAs($this->admin)
            ->from('/administrador/cursos/novo')
            ->call('POST', '/administrador/cursos', [], [], [], ['CONTENT_LENGTH' => 1024 * 1024 * 1024])
            ->assertRedirect('/administrador/cursos/novo')
            ->assertSessionHas('error');
    }
}
