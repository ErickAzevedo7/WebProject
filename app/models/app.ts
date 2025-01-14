import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Screenshot from '#models/screenshot'
import Movie from '#models/movie'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Publisher from '#models/publisher'
import Developer from '#models/developer'
import Tag from '#models/tag'
import Cart from '#models/cart'

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
  declare recommendations: number

  @column()
  declare releaseDate: string

  @column()
  declare price: string

  @column()
  declare background: string

  @column()
  declare cartId: number

  @hasMany(() => Screenshot)
  declare screenshots: HasMany<typeof Screenshot>

  @hasMany(() => Movie)
  declare movies: HasMany<typeof Movie>

  @manyToMany(() => Publisher)
  declare publishers: ManyToMany<typeof Publisher>

  @manyToMany(() => Developer)
  declare developers: ManyToMany<typeof Developer>

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @manyToMany(() => Cart)
  declare carts: ManyToMany<typeof Cart>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
