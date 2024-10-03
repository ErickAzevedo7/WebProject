import App from '#models/app'
import Movie from '#models/movie'
import Screenshot from '#models/screenshot'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { readFileSync } from 'fs'

interface SteamApp {
  name: string
  steamAppid: number
  shortDescription: string | undefined
  detailedDescription: string | undefined
  headerImage: string | undefined
  price: string | undefined
  background: string | undefined
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
        price: undefined,
        background: steamApp.data.background_raw,
      }

      if (steamApp.is_free === true) {
        data.price = steamApp.data.price_overview.final_formatted
      }

      const screenshotsData = steamApp.data.screenshots

      const screenshots = []

      for(const screenshotData of screenshotsData) {
        const screenshot = new Screenshot()

        screenshot.pathThumbnail = screenshotData.path_thumbnail
        screenshot.pathFull = screenshotData.path_full

        screenshots.push(screenshot)
      }

      const moviesData = steamApp.data.movies

      const movies = []

      for(const movieData of moviesData) {
        const movie = new Movie()

        movie.movieId = movieData.id
        movie.thumbnail = movieData.thumbnail
        movie.fullResolution = movieData.webm.max

        movies.push(movie)
      }

      const app = new App()

      app.merge(data)

      await app.save()

      await app.related('screenshots').saveMany(screenshots)
      await app.related('movies').saveMany(movies)
    }
  }
}
