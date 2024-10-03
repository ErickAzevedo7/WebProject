import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import App from '#models/app'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Screenshot extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare appId: number

  @column()
  declare pathThumbnail: string

  @column()
  declare pathFull: string

  @belongsTo(() => App)
  declare app: BelongsTo<typeof App>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
