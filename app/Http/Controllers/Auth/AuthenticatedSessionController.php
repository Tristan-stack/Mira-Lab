<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\UserActivity;
use Carbon\Carbon;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Enregistrer l'activité de connexion
        $user = Auth::user();
        $today = Carbon::today()->toDateString(); // Format 'Y-m-d'

        $activity = UserActivity::where('user_id', $user->id)
            ->where('activity_date', $today)
            ->first();

        if ($activity) {
            // Incrémenter le compteur de connexions
            $activity->login_count += 1;
            $activity->save();
        } else {
            // Créer une nouvelle entrée avec login_count = 1
            UserActivity::create([
                'user_id' => $user->id,
                'activity_date' => $today,
                'login_count' => 1,
            ]);
        }

        return redirect()->intended(route('dashboard', [], false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
