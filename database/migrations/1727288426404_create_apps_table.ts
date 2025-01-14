import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.text('name').notNullable()
      table.string('required_age')
      table.bigint('steam_appid').notNullable().unique()
      table.text('short_description').nullable()
      table.text('detailed_description').nullable()
      table.text('header_image').nullable()
      table.boolean('is_free')
      table.text('minimal_requirements')
      table.text('recomended_requirements')
      table.bigint('recommendations')
      table.string('release_date')
      table.string('price').nullable()
      table.text('background').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
