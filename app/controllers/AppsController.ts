import App from '#models/app'
import Tag from '#models/tag'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ request, view }: HttpContext) {
    const data = request.qs()
    const apps = await App.all()
    const categories = await Tag.query().orderBy('name')
    let checked

    if (data.category) {
      checked = await Tag.query().where('id', data.category)
    }

    if (checked) {
      return view.render('pages/apps/index', {
        apps: apps,
        categories: categories,
        checked: checked[0].name,
      })
    }
    return view.render('pages/apps/index', { apps: apps, categories: categories })
  }

  async filter({ request, view }: HttpContext) {
    let data = []
    let queries = []
    const payload = request.all()

    if (Array.isArray(payload.category)) {
      for (const category of payload.category) {
        data.push(category)
      }
    } else if (payload.category) {
      data.push(payload.category)
    }

    for (const element of data) {
      queries.push(
        App.query().whereHas('tags', (query) => {
          query.where('name', element)
        })
      )
    }

    if (payload.search !== null) {
      queries.push(App.query().whereILike('name', `%${payload.search}%`))
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
