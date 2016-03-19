<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTypeToMoneyLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('money_locations', function (Blueprint $table) {
            $table->integer('type_id')->unsigned()->nullable();
            $table->foreign('type_id')->references('id')->on('money_location_types');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('money_locations', function (Blueprint $table) {
            $table->dropColumn('type_id');
        });
    }
}
