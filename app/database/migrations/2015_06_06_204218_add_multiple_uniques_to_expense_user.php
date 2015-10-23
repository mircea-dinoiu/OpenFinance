<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMultipleUniquesToExpenseUser extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('expense_user', function(Blueprint $table)
		{
			$table->unique(['expense_id', 'user_id']);
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
            $table->dropUnique(['expense_id', 'user_id']);
		});
	}

}
