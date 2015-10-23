<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpenseUserTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('expense_user', function(Blueprint $table)
		{
			$table->create();

			$table->integer('user_id')->unsigned();
			$table->foreign('user_id')->references('id')->on('users');

			$table->integer('expense_id')->unsigned();
			$table->foreign('expense_id')->references('id')->on('expenses')->onDelete('cascade');

			$table->boolean('blame')->default(false);

			$table->boolean('seen')->default(false);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('expense_user', function(Blueprint $table)
		{
			$table->dropIfExists();
		});
	}

}
