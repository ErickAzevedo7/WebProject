import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.bigint('steam_appid').notNullable().unique()
      table.text('short_description').nullable()
      table.text('detailed_description').nullable()
      table.text('header_image').nullable()
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
