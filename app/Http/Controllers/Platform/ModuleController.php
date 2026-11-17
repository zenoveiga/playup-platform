<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\CourseMaterial;
use App\Models\CourseModule;
use App\Services\ExerciseSync;
use App\Services\MaterialSync;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Validator;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Biblioteca de módulos. Cada módulo tem uma lista ordenada de vídeos, cada um com uma
 * categoria livre (Conceito, Exemplo, Erros comuns...), o bloco de aplicação (~10 min),
 * materiais de apoio (apostilas etc.) e exercícios.
 */
class ModuleController extends Controller
{
    public function __construct(private MaterialSync $materials, private ExerciseSync $exercises) {}

    public function index(): Response
    {
        $modules = CourseModule::query()
            ->withCount(['exercises', 'supportMaterials', 'videos', 'courses'])
            ->latest()
            ->get();

        return Inertia::render('Platform/Modules/Index', ['modules' => $modules]);
    }

    public function create(): Response
    {
        return Inertia::render('Platform/Modules/Form', [
            'module' => null,
            'videoCategories' => $this->videoCategories(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $module = DB::transaction(function () use ($data, $request) {
            $module = CourseModule::create([
                ...$this->moduleAttributes($data),
                'created_by' => $request->user()->id,
            ]);
            $this->syncChildren($module, $data);

            return $module;
        });

        return redirect()->route('platform.modules.edit', $module)
            ->with('success', 'Módulo criado com sucesso.');
    }

    public function edit(CourseModule $module): Response
    {
        $module->load(['materials', 'exercises', 'courses:id,title']);

        return Inertia::render('Platform/Modules/Form', [
            'module' => $module,
            'videoCategories' => $this->videoCategories(),
        ]);
    }

    public function update(Request $request, CourseModule $module): RedirectResponse
    {
        $data = $this->validated($request, $module);

        DB::transaction(function () use ($module, $data) {
            $module->update($this->moduleAttributes($data));
            $this->syncChildren($module, $data);
            $module->touch();
        });

        return back()->with('success', 'Módulo atualizado com sucesso.');
    }

    public function destroy(CourseModule $module): RedirectResponse
    {
        DB::transaction(function () use ($module) {
            $module->materials()->get()->each->delete();
            $module->delete();
        });

        return redirect()->route('platform.modules.index')->with('success', 'Módulo removido.');
    }

    private function validated(Request $request, ?CourseModule $module = null): array
    {
        $maxVideo = config('playup.uploads.max_video_kb');
        $maxFile = config('playup.uploads.max_file_kb');

        $validator = validator($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'objectives' => 'nullable|string|max:5000',
            'application_minutes' => 'required|integer|min:1|max:240',
            'application_instructions' => 'nullable|string|max:20000',
            'status' => 'required|in:draft,published',

            'videos' => 'nullable|array',
            'videos.*.id' => 'nullable|integer',
            'videos.*.category' => 'required|string|max:60',
            'videos.*.source' => 'required|in:upload,url',
            'videos.*.title' => 'nullable|string|max:255',
            'videos.*.url' => 'nullable|required_if:videos.*.source,url|url|max:1000',
            'videos.*.file' => "nullable|file|mimetypes:video/mp4,video/webm,video/quicktime,video/x-matroska,video/x-msvideo|max:{$maxVideo}",
            'videos.*.duration_minutes' => 'nullable|integer|min:1|max:600',

            'support' => 'nullable|array',
            'support.*.id' => 'nullable|integer',
            'support.*.type' => 'required|in:document,file,link,video',
            'support.*.title' => 'required|string|max:255',
            'support.*.description' => 'nullable|string|max:2000',
            'support.*.url' => 'nullable|required_if:support.*.type,link|url|max:1000',
            'support.*.file' => "nullable|file|max:{$maxFile}",

            ...ExerciseSync::rules(),
        ], [], [...$this->attributeNames(), ...ExerciseSync::attributeNames()]);

        $validator->after(function (Validator $v) use ($request, $module) {
            $this->validateVideos($v, $request, $module);
            $this->validateSupportFiles($v, $request, $module);
            ExerciseSync::validate($v, $request->input('exercises', []));
        });

        return $validator->validate();
    }

    /** Cada vídeo precisa de arquivo ou link; publicar exige ao menos um vídeo. */
    private function validateVideos(Validator $v, Request $request, ?CourseModule $module): void
    {
        $videos = $request->input('videos', []);

        foreach ($videos as $i => $video) {
            $n = $i + 1;
            if (($video['source'] ?? null) === 'url') {
                continue; // link obrigatório já validado pela regra required_if
            }
            if (! $request->hasFile("videos.$i.file") && ! $this->existingHasFile($module, $video['id'] ?? null)) {
                $v->errors()->add("videos.$i.file", "Vídeo $n: selecione o arquivo ou informe um link.");
            }
        }

        if (empty($videos) && $request->input('status') === 'published') {
            $v->errors()->add('videos', 'Adicione ao menos um vídeo para publicar o módulo.');
        }
    }

    /** Sugestões de categoria: as padrão + as já usadas em outros módulos. */
    private function videoCategories(): array
    {
        return collect(config('playup.video_categories'))
            ->merge(
                CourseMaterial::where('slot', CourseModule::VIDEO_SLOT)
                    ->whereNotNull('category')
                    ->distinct()
                    ->pluck('category')
            )
            ->map(fn ($c) => trim($c))
            ->unique(fn ($c) => mb_strtolower($c))
            ->values()
            ->all();
    }

    private function validateSupportFiles(Validator $v, Request $request, ?CourseModule $module): void
    {
        foreach ($request->input('support', []) as $i => $item) {
            if (($item['type'] ?? null) === 'link') {
                continue;
            }
            if (! $request->hasFile("support.$i.file") && ! $this->existingHasFile($module, $item['id'] ?? null)) {
                $v->errors()->add("support.$i.file", 'Selecione um arquivo para este material.');
            }
        }
    }

    private function existingHasFile(?CourseModule $module, $materialId): bool
    {
        return $module && $materialId
            && $module->materials()->whereKey($materialId)->whereNotNull('file_path')->exists();
    }

    private function moduleAttributes(array $data): array
    {
        return collect($data)->only([
            'title', 'description', 'objectives', 'application_minutes', 'application_instructions', 'status',
        ])->all();
    }

    private function syncChildren(CourseModule $module, array $data): void
    {
        $items = [];

        foreach (array_values($data['videos'] ?? []) as $video) {
            $category = trim($video['category']);
            $items[] = [
                ...$video,
                'slot' => CourseModule::VIDEO_SLOT,
                'category' => $category,
                'type' => 'video',
                'title' => ($video['title'] ?? null) ?: $category,
            ];
        }

        foreach ($data['support'] ?? [] as $item) {
            $items[] = [...$item, 'slot' => 'support', 'source' => $item['type'] === 'link' ? 'url' : 'upload'];
        }

        $this->materials->sync($module, $items, "courses/modules/{$module->id}");

        $this->exercises->sync($module->exercises(), $data['exercises'] ?? []);
    }

    private function attributeNames(): array
    {
        return [
            'title' => 'título',
            'application_minutes' => 'duração da aplicação',
            'videos.*.category' => 'categoria do vídeo',
            'videos.*.url' => 'link do vídeo',
            'videos.*.file' => 'arquivo de vídeo',
            'support.*.title' => 'título do material',
            'support.*.url' => 'link do material',
            'support.*.file' => 'arquivo do material',
        ];
    }
}
