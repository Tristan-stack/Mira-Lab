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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('project_code', 8)->nullable()->after('status'); // Ajout de la colonne project_code
        });

        // Mettre à jour les enregistrements existants pour générer un project_code unique pour les projets privés
        $projects = \App\Models\Project::where('status', 'Privé')->get();
        foreach ($projects as $project) {
            $project->project_code = \App\Models\Project::generateProjectCode();
            $project->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('project_code');
        });
    }
};