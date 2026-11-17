<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use App\Services\MaterialSync;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Validator;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Cursos podem ser:
 *  - modular: um compilado ordenado de módulos da biblioteca;
 *  - free (livre): vídeos, apostilas, links e arquivos organizados diretamente, sem módulos.
 */
class CourseController extends Controller
{
    public function __construct(private MaterialSync $materials) {}

    public function index(): Response
    {
        return Inertia::render('Platform/Courses/Index', [
            'courses' => Course::withCount(['modules', 'materials'])->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Platform/Courses/Form', [
            'course' => null,
            'availableModules' => $this->availableModules(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $course = DB::transaction(function () use ($data, $request) {
            $course = Course::create([
                ...$this->courseAttributes($data),
                'slug' => Course::uniqueSlug($data['title']),
                'created_by' => $request->user()->id,
            ]);
            $this->syncContent($course, $data, $request);

            return $course;
        });

        return redirect()->route('platform.courses.edit', $course)
            ->with('success', 'Curso criado com sucesso.');
    }

    public function edit(Course $course): Response
    {
        $course->load(['modules' => fn ($q) => $q->withCount(['exercises', 'videos', 'supportMaterials']), 'materials']);

        return Inertia::render('Platform/Courses/Form', [
            'course' => $course,
            'availableModules' => $this->availableModules(),
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $data = $this->validated($request, $course);

        DB::transaction(function () use ($course, $data, $request) {
            $attributes = $this->courseAttributes($data);
            if ($attributes['title'] !== $course->title) {
                $attributes['slug'] = Course::uniqueSlug($attributes['title'], $course->id);
            }
            $course->update($attributes);
            $this->syncContent($course, $data, $request);
            $course->touch();
        });

        return back()->with('success', 'Curso atualizado com sucesso.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        DB::transaction(function () use ($course) {
            $course->materials()->get()->each->delete();
            if ($course->cover_path) {
                Storage::disk('public')->delete($course->cover_path);
            }
            $course->delete();
        });

        return redirect()->route('platform.courses.index')->with('success', 'Curso removido.');
    }

    private function availableModules()
    {
        return CourseModule::withCount(['exercises', 'videos', 'supportMaterials'])
            ->orderBy('title')
            ->get(['id', 'title', 'description', 'status', 'application_minutes']);
    }

    private function validated(Request $request, ?Course $course = null): array
    {
        $maxVideo = config('playup.uploads.max_video_kb');
        $maxFile = config('playup.uploads.max_file_kb');
        $maxCover = config('playup.uploads.max_cover_kb');

        $validator = validator($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'category' => 'nullable|string|max:100',
            'level' => 'required|in:iniciante,intermediario,avancado',
            'workload_hours' => 'nullable|integer|min:1|max:10000',
            'status' => 'required|in:draft,published',
            'structure' => 'required|in:modular,free',
            'cover' => "nullable|image|max:{$maxCover}",
            'remove_cover' => 'nullable|boolean',

            'module_ids' => 'nullable|array',
            'module_ids.*' => 'integer|distinct|exists:course_modules,id',

            'materials' => 'nullable|array',
            'materials.*.id' => 'nullable|integer',
            'materials.*.type' => 'required|in:video,document,link,file',
            'materials.*.title' => 'required|string|max:255',
            'materials.*.description' => 'nullable|string|max:2000',
            'materials.*.source' => 'nullable|in:upload,url',
            'materials.*.url' => 'nullable|url|max:1000',
            // Limite geral = vídeo; demais tipos são checados abaixo com o limite de arquivos.
            'materials.*.file' => "nullable|file|max:{$maxVideo}",
            'materials.*.duration_minutes' => 'nullable|integer|min:1|max:600',
        ], [], [
            'title' => 'título',
            'workload_hours' => 'carga horária',
            'cover' => 'capa',
            'module_ids' => 'módulos',
            'materials.*.title' => 'título do material',
            'materials.*.url' => 'link do material',
            'materials.*.file' => 'arquivo do material',
        ]);

        $validator->after(function (Validator $v) use ($request, $course, $maxFile) {
            $published = $request->input('status') === 'published';

            if ($request->input('structure') === Course::STRUCTURE_MODULAR) {
                if ($published && empty($request->input('module_ids'))) {
                    $v->errors()->add('module_ids', 'Adicione ao menos um módulo para publicar o curso.');
                }

                return;
            }

            $materials = $request->input('materials', []);
            if ($published && empty($materials)) {
                $v->errors()->add('materials', 'Adicione ao menos um material para publicar o curso.');
            }

            foreach ($materials as $i => $item) {
                $usesUrl = ($item['type'] ?? null) === 'link' || ($item['source'] ?? null) === 'url';
                if ($usesUrl) {
                    if (blank($item['url'] ?? null)) {
                        $v->errors()->add("materials.$i.url", 'Informe o link deste material.');
                    }
                    continue;
                }

                $file = $request->file("materials.$i.file");
                $hasExisting = $course && ! empty($item['id'])
                    && $course->materials()->whereKey($item['id'])->whereNotNull('file_path')->exists();

                if (! $file && ! $hasExisting) {
                    $v->errors()->add("materials.$i.file", 'Selecione um arquivo para este material.');
                } elseif ($file && ($item['type'] ?? null) === 'video') {
                    if (! str_starts_with((string) $file->getMimeType(), 'video/')) {
                        $v->errors()->add("materials.$i.file", 'O arquivo precisa ser um vídeo.');
                    }
                } elseif ($file && $file->getSize() > $maxFile * 1024) {
                    $v->errors()->add("materials.$i.file", 'O arquivo excede o tamanho máximo permitido.');
                }
            }
        });

        return $validator->validate();
    }

    private function courseAttributes(array $data): array
    {
        return collect($data)->only([
            'title', 'description', 'category', 'level', 'workload_hours', 'status', 'structure',
        ])->all();
    }

    private function syncContent(Course $course, array $data, Request $request): void
    {
        if ($request->hasFile('cover')) {
            if ($course->cover_path) {
                Storage::disk('public')->delete($course->cover_path);
            }
            $course->update(['cover_path' => $request->file('cover')->store('courses/covers', 'public')]);
        } elseif (! empty($data['remove_cover']) && $course->cover_path) {
            Storage::disk('public')->delete($course->cover_path);
            $course->update(['cover_path' => null]);
        }

        if ($data['structure'] === Course::STRUCTURE_MODULAR) {
            $course->modules()->sync(
                collect($data['module_ids'] ?? [])
                    ->values()
                    ->mapWithKeys(fn ($id, $position) => [$id => ['position' => $position]])
                    ->all()
            );
            // Curso modular não mantém materiais avulsos.
            $this->materials->sync($course, [], "courses/{$course->id}/materials");

            return;
        }

        $course->modules()->detach();
        $this->materials->sync(
            $course,
            collect($data['materials'] ?? [])->map(fn ($m) => [
                ...$m,
                'source' => $m['type'] === 'link' ? 'url' : ($m['source'] ?? 'upload'),
            ])->all(),
            "courses/{$course->id}/materials"
        );
    }
}
