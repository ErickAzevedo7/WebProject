import SteamAPI from 'steamapi'

export default class AppService {
  public static async getAppSteam(name: String) {
    const steam = new SteamAPI(false)

    const app = (await steam.getAppList()).find((app) => app.name === name)

    if (app) {
      const appDetails = await steam.getGameDetails(app.appid)

      return appDetails
    }

    return null
  }
}
