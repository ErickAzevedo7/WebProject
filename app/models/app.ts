import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Screenshot from '#models/screenshot'
import Movie from '#models/movie'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class App extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare steamAppid: number

  @column()
  declare shortDescription: string

  @column()
  declare detailedDescription: string

  @column()
  declare headerImage: string

  @column()
  declare price: string

  @column()
  declare background: string

  @hasMany(() => Screenshot)
  declare screenshots: HasMany<typeof Screenshot>

  @hasMany(() => Movie)
  declare movies: HasMany<typeof Movie>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
