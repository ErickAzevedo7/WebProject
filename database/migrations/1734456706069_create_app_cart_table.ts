import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'app_cart'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('app_id').unsigned().references('apps.id').onDelete('CASCADE')
      table.integer('cart_id').unsigned().references('carts.id').onDelete('CASCADE')
      table.unique(['app_id', 'cart_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
