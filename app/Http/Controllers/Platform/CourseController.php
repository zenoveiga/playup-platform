<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\PriceTable;
use App\Services\ExerciseSync;
use App\Services\MaterialSync;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Support\Media;
use Illuminate\Validation\Validator;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Cursos podem ser:
 *  - modular: um compilado ordenado de módulos da biblioteca;
 *  - free (livre): vídeos, apostilas, links, arquivos e exercícios organizados diretamente, sem módulos.
 */
class CourseController extends Controller
{
    public function __construct(private MaterialSync $materials, private ExerciseSync $exercises) {}

    public function index(): Response
    {
        return Inertia::render('Platform/Courses/Index', [
            'courses' => Course::withCount(['modules', 'materials', 'exerciseSets as exercises_count'])->latest()->get(),
            'suggestedPrices' => (object) PriceTable::suggested()->priceMap(),
            'suggestedInstallments' => PriceTable::suggested()->max_installments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Platform/Courses/Form', [
            'course' => null,
            'suggestedInstallments' => PriceTable::suggested()->max_installments,
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
        $course->load(['modules' => fn ($q) => $q->withCount(['exerciseSets as exercises_count', 'videos', 'supportMaterials']), 'materials', 'exerciseSets.questions']);

        return Inertia::render('Platform/Courses/Form', [
            'course' => [
                ...$course->toArray(),
                'suggested_price' => PriceTable::suggested()->items()->where('course_id', $course->id)->value('price'),
            ],
            'suggestedInstallments' => PriceTable::suggested()->max_installments,
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
            Media::delete($course->cover_path);
            $course->delete();
        });

        return redirect()->route('platform.courses.index')->with('success', 'Curso removido.');
    }

    private function availableModules()
    {
        return CourseModule::withCount(['exerciseSets as exercises_count', 'videos', 'supportMaterials'])
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
            'suggested_price' => 'nullable|numeric|min:0|max:9999999',
            'status' => 'required|in:draft,published',
            'structure' => 'required|in:modular,free',
            'cover' => "nullable|image|max:{$maxCover}",
            'cover_upload_key' => 'nullable|string|max:500',
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
            'materials.*.upload_key' => 'nullable|string|max:500',
            'materials.*.file' => "nullable|file|max:{$maxVideo}",
            'materials.*.duration_minutes' => 'nullable|integer|min:1|max:600',

            ...ExerciseSync::rules(),
        ], [], [
            ...ExerciseSync::attributeNames(),
            'title' => 'título',
            'workload_hours' => 'carga horária',
            'suggested_price' => 'valor sugerido',
            'cover' => 'capa',
            'module_ids' => 'módulos',
            'materials.*.title' => 'título do material',
            'materials.*.url' => 'link do material',
            'materials.*.upload_key' => 'nullable|string|max:500',
            'materials.*.file' => 'arquivo do material',
        ]);

        $validator->after(function (Validator $v) use ($request, $course, $maxFile) {
            $published = $request->input('status') === 'published';
            $userId = $request->user()->id;

            if (filled($request->input('cover_upload_key'))) {
                $pending = Media::pendingUpload($request->input('cover_upload_key'), $userId);
                if (! $pending || $pending['kind'] !== 'image') {
                    $v->errors()->add('cover', 'O envio da capa expirou, selecione a imagem novamente.');
                }
            }

            if ($request->input('structure') === Course::STRUCTURE_MODULAR) {
                if ($published && empty($request->input('module_ids'))) {
                    $v->errors()->add('module_ids', 'Adicione ao menos um módulo para publicar o curso.');
                }

                return;
            }

            ExerciseSync::validate($v, $request->input('exercise_sets', []));

            $materials = $request->input('materials', []);
            if ($published && empty($materials) && empty($request->input('exercise_sets'))) {
                $v->errors()->add('materials', 'Adicione ao menos um material ou exercício para publicar o curso.');
            }

            foreach ($materials as $i => $item) {
                $usesUrl = ($item['type'] ?? null) === 'link' || ($item['source'] ?? null) === 'url';
                if ($usesUrl) {
                    if (blank($item['url'] ?? null)) {
                        $v->errors()->add("materials.$i.url", 'Informe o link deste material.');
                    }
                    continue;
                }

                if (filled($item['upload_key'] ?? null)) {
                    $pending = Media::pendingUpload($item['upload_key'], $userId);
                    if (! $pending) {
                        $v->errors()->add("materials.$i.file", 'O envio deste arquivo expirou, selecione-o novamente.');
                    } elseif (($item['type'] ?? null) === 'video' && $pending['kind'] !== 'video') {
                        $v->errors()->add("materials.$i.file", 'O arquivo precisa ser um vídeo.');
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
        // Valor sugerido do curso na tabela de valores sugeridos da plataforma.
        $suggested = PriceTable::suggested();
        if (filled($data['suggested_price'] ?? null)) {
            $suggested->items()->updateOrCreate(['course_id' => $course->id], ['price' => $data['suggested_price']]);
        } else {
            $suggested->items()->where('course_id', $course->id)->delete();
        }

        if (filled($data['cover_upload_key'] ?? null)) {
            Media::delete($course->cover_path);
            $course->update([
                'cover_path' => Media::claimDirectUpload($data['cover_upload_key'], $request->user()->id, 'courses/covers')['file_path'],
            ]);
        } elseif ($request->hasFile('cover')) {
            Media::delete($course->cover_path);
            $course->update(['cover_path' => Media::store($request->file('cover'), 'courses/covers')]);
        } elseif (! empty($data['remove_cover']) && $course->cover_path) {
            Media::delete($course->cover_path);
            $course->update(['cover_path' => null]);
        }

        if ($data['structure'] === Course::STRUCTURE_MODULAR) {
            $course->modules()->sync(
                collect($data['module_ids'] ?? [])
                    ->values()
                    ->mapWithKeys(fn ($id, $position) => [$id => ['position' => $position]])
                    ->all()
            );
            // Curso modular não mantém materiais nem exercícios avulsos.
            $this->materials->sync($course, [], "courses/{$course->id}/materials");
            $this->exercises->sync($course, []);

            return;
        }

        $course->modules()->detach();
        $this->materials->sync(
            $course,
            collect($data['materials'] ?? [])->map(fn ($m) => [
                ...$m,
                'source' => $m['type'] === 'link' ? 'url' : ($m['source'] ?? 'upload'),
            ])->all(),
            "courses/{$course->id}/materials",
            $request->user()->id
        );
        $this->exercises->sync($course, $data['exercise_sets'] ?? []);
    }
}
