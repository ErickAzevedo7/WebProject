import App from '#models/app'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index(){

  }

  async show({ params, view }: HttpContext){
    const app = await App.findOrFail(params.id)

    return view.render('pages/apps/show', {app: app})
  }
}
