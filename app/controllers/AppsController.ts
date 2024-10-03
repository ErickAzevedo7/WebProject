import App from '#models/app'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ view }: HttpContext) {
    const apps = await App.all()

    return view.render('pages/apps/index', { apps: apps })
  }

  async show({ params, view }: HttpContext) {
    const app = await App.findOrFail(params.id)

    await app.load('screenshots')
    await app.load('movies')

    return view.render('pages/apps/show', { app: app })
  }
}
