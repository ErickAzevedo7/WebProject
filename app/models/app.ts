import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Screenshot from '#models/screenshot'
import Movie from '#models/movie'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Publisher from '#models/publisher'
import Developer from '#models/developer'

export default class App extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare requiredAge: string

  @column()
  declare steamAppid: number

  @column()
  declare shortDescription: string

  @column()
  declare detailedDescription: string

  @column()
  declare headerImage: string

  @column()
  declare isFree: boolean

  @column()
  declare minimalRequirements: string

  @column()
  declare recomendedRequirements: string

  @column()
  declare releaseDate: string

  @column()
  declare price: string

  @column()
  declare background: string

  @hasMany(() => Screenshot)
  declare screenshots: HasMany<typeof Screenshot>

  @hasMany(() => Movie)
  declare movies: HasMany<typeof Movie>

  @manyToMany(() => Publisher)
  declare publishers: ManyToMany<typeof Publisher>

  @manyToMany(() => Developer)
  declare developers: ManyToMany<typeof Developer>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
