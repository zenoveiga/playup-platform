<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {{-- Ícones: display=block evita que o nome do ícone ("notifications", "menu"...) apareça como texto enquanto a fonte carrega. --}}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
        <script>
            // Esconde os ícones até a fonte carregar (primeiro acesso / rede lenta no celular).
            document.documentElement.classList.add('icons-loading');
            (document.fonts ? document.fonts.load('24px "Material Symbols Outlined"') : Promise.resolve())
                .catch(function () {})
                .then(function () { document.documentElement.classList.remove('icons-loading'); });
            setTimeout(function () { document.documentElement.classList.remove('icons-loading'); }, 6000);
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-surface text-on-surface">
        @inertia
    </body>
</html>
