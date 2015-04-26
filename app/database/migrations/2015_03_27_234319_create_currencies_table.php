<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCurrenciesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('currencies', function(Blueprint $table)
		{
			$table->create();

			$table->increments('id');
			$table->string('iso_code')->unique();
			$table->string('currency');
			$table->string('symbol');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('currencies', function(Blueprint $table)
		{
			$table->dropIfExists();
		});
	}

}
