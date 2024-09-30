import App from '#models/app'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { readFileSync } from 'fs'

interface SteamApp {
  name: string
  steamAppid: number
  shortDescription: string | undefined
  detailedDescription: string | undefined
  headerImage: string | undefined
}

export default class extends BaseSeeder {
  async run() {
    const path = app.seedersPath('../data/apps.js')

    const rawdata = readFileSync(path)
    const apps = JSON.parse(rawdata.toString())

    for (const steamApp of apps) {
      const data: SteamApp = {
        name: steamApp.data.name,
        steamAppid: steamApp.data.steam_appid,
        shortDescription: steamApp.data.short_description,
        detailedDescription: steamApp.data.detailed_description,
        headerImage: steamApp.data.header_image,
      }

      const app = new App()

      app.merge(data)

      await app.save()
    }
  }
}
