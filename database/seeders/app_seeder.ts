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
  recommendations?: number
  releaseDate: string
  price?: string
  background: string | undefined
}

export default class extends BaseSeeder {
  async run() {
    const path = app.seedersPath('../data/fullData.js')

    const rawdata = readFileSync(path, 'utf8')

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

      if (data.recommendations) {
        steamApp.recommendations = data.recommendations.total
      } else {
        steamApp.recommendations = 0
      }

      if (data.is_free === false) {
        if (data.price_overview) steamApp.price = data.price_overview.final_formatted
      }

      const screenshotsData = data.screenshots
      const screenshots = []
      if (screenshotsData) {
        for (const screenshotData of screenshotsData) {
          if (screenshots.includes(screenshotData)) {
            continue
          }
          const screenshot = await Screenshot.create({
            pathThumbnail: screenshotData.path_thumbnail,
            pathFull: screenshotData.path_full,
          })

          screenshots.push(screenshot)
        }
      }

      if (data.steam_appid === 177) {
        console.log(screenshots)
      }

      const moviesData = data.movies
      const movies = []
      if (moviesData) {
        for (const movieData of moviesData) {
          if (movies.includes(movieData)) {
            continue
          }

          try {
            const movie = await Movie.create({
              movieId: movieData.id,
              thumbnail: movieData.thumbnail,
              fullResolution: movieData.webm.max,
            })

            movies.push(movie)
          } catch (error) {
            console.error(error)
          }
        }
      }

      const developersData = data.developers
      const developers = []
      if (developersData) {
        for (const developerData of developersData) {
          if (developers.includes(developerData)) {
            continue
          }
          try {
            const developer = await Developer.firstOrCreate({ name: developerData })

            developers.push(developer)
          } catch (error) {
            console.error(error)
          }
        }
      }

      const publishersData = data.publishers
      const publishers = []
      if (publishersData) {
        for (const publisherData of publishersData) {
          if (publishers.includes(publisherData)) {
            continue
          }
          try {
            const publisher = await Publisher.firstOrCreate({ name: publisherData })

            publishers.push(publisher)
          } catch (error) {
            console.error(error)
          }
        }
      }

      const tagsData = data.tags
      const tags = []
      if (tagsData) {
        for (const tagData of tagsData) {
          if (tags.includes(tagData)) {
            continue
          }
          const tag = await Tag.firstOrCreate({ name: tagData })

          tags.push(tag)
        }
      }

      const app = new App()

      app.merge(steamApp)

      try {
        await app.save()
      } catch (error) {
        console.error(error)
      }
      try {
        await app.related('tags').saveMany(tags)
      } catch (error) {
        console.error(error)
      }

      try {
        await app.related('developers').saveMany(developers)
      } catch (error) {
        console.error(error)
      }

      try {
        await app.related('publishers').saveMany(publishers)
      } catch (error) {
        console.error(error)
      }

      try {
        await app.related('screenshots').saveMany(screenshots)
      } catch (error) {
        console.error(error)
      }

      try {
        await app.related('movies').saveMany(movies)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
