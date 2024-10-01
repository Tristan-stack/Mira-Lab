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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');                    // Nom du projet
            $table->text('description')->nullable();   // Description du projet
            $table->date('start_date')->nullable();    // Date de début du projet
            $table->date('end_date')->nullable();      // Date de fin du projet
            $table->string('status')->default('pending'); // Statut du projet (par défaut 'pending')
            $table->foreignId('team_id')->constrained()->onDelete('cascade'); // Liaison avec la table 'teams'
            $table->timestamps();                      // created_at et updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }

};
