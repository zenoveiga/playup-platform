<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Platform/Dashboard', [
            'stats' => [
                'pending_licensees' => User::licensees()->where('status', User::STATUS_PENDING)->count(),
                'active_licensees' => User::licensees()->where('status', User::STATUS_ACTIVE)->count(),
                'blocked_licensees' => User::licensees()->where('status', User::STATUS_BLOCKED)->count(),
                'students' => User::where('role', 'student')->count(),
                'courses' => Course::count(),
                'published_courses' => Course::where('status', 'published')->count(),
                'modules' => CourseModule::count(),
                'admins' => User::platformAdmins()->count(),
            ],
            'pendingLicensees' => User::licensees()
                ->where('status', User::STATUS_PENDING)
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'phone', 'created_at']),
            'recentCourses' => Course::latest()->take(5)->withCount('modules', 'materials')->get(),
        ]);
    }
}
