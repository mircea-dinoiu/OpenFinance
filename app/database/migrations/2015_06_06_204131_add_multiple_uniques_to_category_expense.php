<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMultipleUniquesToCategoryExpense extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('category_expense', function(Blueprint $table)
		{
			$table->unique(['category_id', 'expense_id']);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('category_expense', function(Blueprint $table)
		{
			$table->dropUnique(['category_id', 'expense_id']);
		});
	}

}
