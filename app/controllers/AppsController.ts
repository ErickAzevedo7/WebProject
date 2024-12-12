import App from '#models/app'
import Tag from '#models/tag'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ view }: HttpContext) {
    const apps = await App.all()
    const limit = 4

    const categories = await Tag.query().preload('apps').paginate(1, limit)

    return view.render('pages/apps/index', { apps: apps, categories: categories })
  }

  async show({ params, view }: HttpContext) {
    const app = await App.findOrFail(params.id)

    await app.load('screenshots')
    await app.load('movies')
    await app.load('developers')
    await app.load('publishers')
    await app.load('tags')

    return view.render('pages/apps/show', { app: app })
  }
}
