import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddEditorRoleToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['admin', 'client', 'editor']).notNullable().defaultTo('client').alter()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['admin', 'client']).notNullable().defaultTo('client').alter()
    })
  }
}
