<?php

/*
|--------------------------------------------------------------------------
| Rotas do licenciado (incluídas nos grupos /admin e /school-admin)
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Licensee\CampaignController;
use App\Http\Controllers\Licensee\CourseCatalogController;
use App\Http\Controllers\Licensee\PriceTableController;
use App\Http\Controllers\Licensee\SaleController;
use Illuminate\Support\Facades\Route;

// Cursos publicados pelo administrador, com os preços do licenciado.
Route::get('/courses', CourseCatalogController::class)->name('courses.index');

Route::resource('tabelas-de-precos', PriceTableController::class)
    ->parameters(['tabelas-de-precos' => 'priceTable'])
    ->names('price-tables')
    ->except('show');

Route::resource('campanhas', CampaignController::class)
    ->parameters(['campanhas' => 'campaign'])
    ->names('campaigns')
    ->except('show');

// Vendas de cursos para alunos
Route::get('/vendas', [SaleController::class, 'index'])->name('sales.index');
Route::get('/vendas/nova', [SaleController::class, 'create'])->name('sales.create');
Route::post('/vendas', [SaleController::class, 'store'])->name('sales.store');
Route::get('/vendas/{sale}', [SaleController::class, 'show'])->name('sales.show');
Route::post('/vendas/{sale}/pagar', [SaleController::class, 'pay'])->name('sales.pay');
Route::post('/vendas/{sale}/cancelar', [SaleController::class, 'cancel'])->name('sales.cancel');
