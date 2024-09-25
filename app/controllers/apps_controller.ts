// import type { HttpContext } from '@adonisjs/core/http'

import SteamAPI from "steamapi";

export default class AppsController {
  async index(){
    const steam = new SteamAPI(false)

    const app = (await steam.getAppList()).find((app) => app.name === "ELDEN RING")

    if(app){
      const appDetails = await steam.getGameDetails(app.appid)

      return appDetails
    }


    return null
  }
}
