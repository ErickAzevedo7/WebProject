import App from '#models/app'
import AppService from '#services/AppService'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index(){

  }

  async store({ request, response }: HttpContext){
    const name = request.input('name')

    if(await App.findBy('name', name)){
      return response.redirect().toRoute('apps.show', {name: name})
    }

    const appDetails = await AppService.getAppSteam(name)

    if(appDetails){
      const name = appDetails.name
      const steamAppid = appDetails.steam_appid
      const shortDescription = appDetails.short_description
      const detailedDescription = appDetails.detailed_description

      const data = {name, steamAppid, shortDescription, detailedDescription}

      const app = new App()

      app.merge(data)

      await app.save()

      return response.redirect().toRoute('apps.show', {name: app.name})
    }

    return appDetails
  }

  async show({ params, view }: HttpContext){
    const app = await App.findByOrFail('name', params.name)

    return view.render('pages/apps/show', {app: app})
  }

  async search({ view }: HttpContext){
    return view.render('pages/apps/search')
  }
}
