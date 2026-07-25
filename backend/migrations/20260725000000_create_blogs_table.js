/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('blogs', function(table) {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('excerpt').notNullable();
    table.text('content').notNullable();
    table.string('category', 100).notNullable();
    table.string('author_name', 255).notNullable();
    table.string('author_role', 255).notNullable();
    table.string('author_avatar', 500).notNullable();
    table.text('author_bio').nullable();
    table.string('date', 100).notNullable();
    table.string('read_time', 50).notNullable();
    table.string('image', 500).notNullable();
    table.boolean('is_featured').defaultTo(false);
    table.json('tags').nullable();
    table.text('keywords').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('blogs');
};
