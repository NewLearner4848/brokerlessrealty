/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('rent_inquiries', function(table) {
    table.increments('id').primary();
    table.enum('user_type', ['owner', 'tenant']).notNullable();
    table.string('full_name', 255).notNullable();
    table.string('mobile_number', 50).notNullable();
    table.string('email', 255).nullable();
    table.string('location_preference', 255).notNullable();
    table.string('budget', 100).notNullable();
    table.string('timeline', 100).notNullable();
    
    // Owner-specific fields (nullable)
    table.string('property_type', 100).nullable();
    table.string('property_address', 255).nullable();
    table.string('area_sqft', 50).nullable();
    table.string('furnishing_status', 100).nullable();
    table.date('available_from').nullable();
    
    // Tenant-specific fields (nullable)
    table.string('configuration', 100).nullable();
    table.string('furnishing_preference', 100).nullable();
    
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('rent_inquiries');
};
