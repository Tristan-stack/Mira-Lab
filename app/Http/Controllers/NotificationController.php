<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use App\Models\User;

class NotificationController extends Controller
{
    /**
     * Récupérer les notifications de l'utilisateur actuel.
     */
    public function getUserNotifications()
    {
        $user = Auth::user();

        // Récupérer les notifications avec le créateur, la tâche et la liste associées
        $notifications = $user->notifications()
                              ->with('creator')
                              ->with('task')
                              ->with('list')
                              ->orderBy('created_at', 'desc')
                              ->get();

        return response()->json([
            'notifications' => $notifications
        ], 200);
    }

    /**
     * Marquer une notification comme lue.
     */
    public function markAsRead($notificationId)
    {
        $user = Auth::user();

        // Mettre à jour le statut dans la table pivot
        $user->notifications()->updateExistingPivot($notificationId, ['status' => 'read']);

        return response()->json([
            'message' => 'Notification marked as read'
        ], 200);
    }

    /**
     * Supprimer une notification.
     */
    public function deleteNotification($notificationId)
    {
        $user = Auth::user();

        // Détacher la notification de l'utilisateur
        $user->notifications()->detach($notificationId);

        return response()->json([
            'message' => 'Notification deleted'
        ], 200);
    }
}