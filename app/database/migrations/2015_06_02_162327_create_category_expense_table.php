<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryExpenseTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('category_expense', function(Blueprint $table)
		{
			$table->integer('category_id')->unsigned();
			$table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');

            $table->integer('expense_id')->unsigned();
            $table->foreign('expense_id')->references('id')->on('expenses')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('category_expense');
	}

}
