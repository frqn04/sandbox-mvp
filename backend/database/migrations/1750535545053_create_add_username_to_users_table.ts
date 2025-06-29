import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUsernameToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username').notNullable().unique()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('username')
    })
  }
}
