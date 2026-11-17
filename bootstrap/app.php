<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\EnsureAccountIsActive::class,
        ]);

        // Área do administrador da plataforma tem tela de login própria.
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('administrador', 'administrador/*')
            ? route('platform.login')
            : route('login'));

        // Usuário já logado acessando telas de visitante vai para o próprio painel.
        $middleware->redirectUsersTo(fn () => route('dashboard'));

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->is('administrador/uploads'),
        );

        // Envio maior que o post_max_size do PHP: volta ao formulário com aviso, em vez da tela de erro.
        $exceptions->render(function (\Illuminate\Http\Exceptions\PostTooLargeException $e, Request $request) {
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return null;
            }

            return back()->with('error', 'Os arquivos enviados excedem o limite do servidor ('
                .ini_get('post_max_size').'). Envie vídeos grandes pelo envio direto ao armazenamento ou reduza o tamanho dos arquivos.');
        });
    })->create();
