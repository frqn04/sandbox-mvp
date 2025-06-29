import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import Hash from '@adonisjs/core/services/hash' // <-- Importación correcta

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public email!: string
  @column()
  public username!: string

  @column({ serializeAs: null })
  public password!: string

  @column()
  public role!: 'admin' | 'client' | 'editor'

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
