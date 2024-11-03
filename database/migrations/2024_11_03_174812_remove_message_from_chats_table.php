<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveMessageFromChatsTable extends Migration
{
    public function up()
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->dropColumn('message');
        });
    }

    public function down()
    {
        Schema::table('chats', function (Blueprint $table) {
            $table->text('message')->nullable();
        });
    }
}