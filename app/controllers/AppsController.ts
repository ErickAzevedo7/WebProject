import App from '#models/app'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ view }: HttpContext) {
    const apps = await App.all()

    return view.render('pages/apps/index', { apps: apps })
  }

  async show({ request, params, view }: HttpContext) {
    const app = await App.findOrFail(params.id)

    await app.load('screenshots')
    await app.load('movies')
    await app.load('developers')
    await app.load('publishers')
    await app.load('tags')

    return view.render('pages/apps/show', { app: app })
  }
}
