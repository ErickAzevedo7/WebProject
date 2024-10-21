import App from '#models/app'
import Developer from '#models/developer'
import Movie from '#models/movie'
import Publisher from '#models/publisher'
import Screenshot from '#models/screenshot'
import Tag from '#models/tag'
import app from '@adonisjs/core/services/app'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { readFileSync } from 'fs'

interface SteamApp {
  name: string
  requiredAge: string
  steamAppid: number
  shortDescription: string | undefined
  detailedDescription: string | undefined
  headerImage: string | undefined
  isFree: boolean
  minimalRequirements: string
  recomendedRequirements: string
  releaseDate: string
  price?: string
  background: string | undefined
}

export default class extends BaseSeeder {
  async run() {
    const path = app.seedersPath('../data/apps.js')

    const rawdata = readFileSync(path)
    const apps = JSON.parse(rawdata.toString())

    for (const data of apps) {
      const steamApp: SteamApp = {
        name: data.name,
        requiredAge: data.required_age,
        steamAppid: data.steam_appid,
        shortDescription: data.short_description,
        detailedDescription: data.detailed_description,
        headerImage: data.header_image,
        isFree: data.is_free,
        minimalRequirements: data.pc_requirements.minimum,
        recomendedRequirements: data.pc_requirements.recommended,
        releaseDate: data.release_date.date,
        background: data.background_raw,
      }

      if (data.is_free === false) {
        steamApp.price = data.price_overview.final_formatted
      }

      const screenshotsData = data.screenshots
      const screenshots = []
      for (const screenshotData of screenshotsData) {
        const screenshot = await Screenshot.create({
          pathThumbnail: screenshotData.path_thumbnail,
          pathFull: screenshotData.path_full,
        })

        screenshots.push(screenshot)
      }

      const moviesData = data.movies
      const movies = []
      for (const movieData of moviesData) {
        const movie = await Movie.create({
          movieId: movieData.id,
          thumbnail: movieData.thumbnail,
          fullResolution: movieData.webm.max,
        })

        movies.push(movie)
      }

      const developersData = data.developers
      const developers = []
      for (const developerData of developersData) {
        const developer = await Developer.firstOrCreate({ name: developerData })

        developers.push(developer)
      }

      const publishersData = data.publishers
      const publishers = []
      for (const publisherData of publishersData) {
        const publisher = await Publisher.firstOrCreate({ name: publisherData })

        publishers.push(publisher)
      }

      const tagsData = data.tags
      const tags = []
      for (const tagData of tagsData) {
        const tag = await Tag.firstOrCreate({ name: tagData })

        tags.push(tag)
      }

      const app = new App()

      app.merge(steamApp)

      await app.save()

      await app.related('tags').saveMany(tags)
      await app.related('developers').saveMany(developers)
      await app.related('screenshots').saveMany(screenshots)
      await app.related('movies').saveMany(movies)
    }
  }
}
