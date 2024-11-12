<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserActivity;
use Illuminate\Support\Facades\Auth;

class UserActivityController extends Controller
{
    /**
     * Récupère l'activité de connexion de l'utilisateur connecté.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserActivities(Request $request)
    {
        // Obtenir l'utilisateur authentifié
        $user = Auth::user();

        // Vérifier si l'utilisateur est authentifié
        if (!$user) {
            return response()->json(['error' => 'Non autorisé'], 401);
        }

        // Définir la plage de dates (les 365 derniers jours)
        $endDate = date('Y-m-d'); // Date actuelle au format 'YYYY-MM-DD'
        $startDate = date('Y-m-d', strtotime('-1 year')); // Date un an en arrière

        // Récupérer les activités de l'utilisateur dans la plage de dates
        $activities = UserActivity::where('user_id', $user->id)
            ->whereBetween('activity_date', [$startDate, $endDate])
            ->orderBy('activity_date', 'asc')
            ->get(['activity_date', 'login_count']);

        return response()->json($activities);
    }
}