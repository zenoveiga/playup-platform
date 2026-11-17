<?php

namespace App\Http\Controllers\Licensee;

use App\Http\Controllers\Controller;
use App\Services\LicenseePricing;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/** Cursos publicados pelo administrador, com os preços do licenciado. */
class CourseCatalogController extends Controller
{
    public function __invoke(Request $request, LicenseePricing $pricing): Response
    {
        return Inertia::render('Licensee/Courses', $pricing->catalog($request->user()));
    }
}
