import App from '#models/app'
import Tag from '#models/tag'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ view }: HttpContext) {
    const apps = await App.all()
    const categories = await Tag.query().orderBy('name')

    return view.render('pages/apps/index', { apps: apps, categories: categories })
  }

  async filter({ request, view }: HttpContext) {
    let data = []
    let queries = []
    const payload = request.all()
    for (const key in payload) {
      data.push(payload[key])
    }

    console.log(data)

    for (const element of data) {
      queries.push(
        App.query().whereHas('tags', (query) => {
          query.where('name', element)
        })
      )
    }

    const apps = await App.query().intersect(queries)

    return view.render('pages/apps/partials/app_list', { apps: apps })
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
