/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('properties', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.decimal('price', 14, 2).notNullable();
    table.decimal('original_price', 14, 2).nullable();
    table.string('savings_text', 255).nullable();
    table.string('address', 255).notNullable();
    table.string('city', 255).notNullable();
    table.enum('type', ['House', 'Apartment', 'Condo', 'Land', 'Villa', 'Heritage House']).notNullable();
    table.integer('bedrooms').notNullable();
    table.integer('bathrooms').notNullable();
    table.integer('area').notNullable();
    table.json('features').notNullable();
    table.json('images').notNullable();
    table.boolean('is_featured').defaultTo(false);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('properties');
};
