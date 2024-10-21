<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->string('team_code', 8)->default('TEMP_CODE')->after('name'); // Ajout de la colonne team_code avec une valeur par défaut temporaire
        });

        // Mettre à jour les enregistrements existants pour générer un team_code unique
        $teams = \App\Models\Team::all();
        foreach ($teams as $team) {
            $team->team_code = \App\Models\Team::generateTeamCode();
            $team->save();
        }

        // Modifier la colonne pour supprimer la valeur par défaut
        Schema::table('teams', function (Blueprint $table) {
            $table->string('team_code', 8)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn('team_code');
        });
    }
};