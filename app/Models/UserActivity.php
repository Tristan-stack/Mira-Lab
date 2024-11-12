<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'activity_date',
        'login_count',
    ];

    public $timestamps = true;

    protected $dates = ['activity_date'];

    // Relation avec l'utilisateur (facultatif)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}