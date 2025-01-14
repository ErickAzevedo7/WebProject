import fs from 'fs'
import SteamAPI from 'steamapi'
import scraper from 'steam-scraper'

const path = '/home/infinity/Project/WebProject/database/data/appList.js'
const newpath = '/home/infinity/Project/WebProject/database/data/apps.js'
const fullDataPath = '/home/infinity/Project/WebProject/database/data/fullData.js'

const gameNames = [
  'ELDEN RING',
  'Terraria',
  'Blasphemous',
  'Hollow Knight',
  'Library Of Ruina',
  'Katana ZERO',
  'Dead Cells',
  'DEVOUR',
  'Limbus Company',
  'NieR:Automata™',
]

const gamesDescription = []

const rawdata = fs.readFileSync(path)

const json = JSON.parse(rawdata.toString())

const apps = Object.values(json.applist.apps)

const steam = new SteamAPI(false)

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

//330000
const test = async () => {
  fs.appendFileSync(fullDataPath, '[')

  let count = 0
  for (const app of apps) {
    if (count === 180) {
      await sleep(330000)
      count = 0
    }

    try {
      const data = await steam.getGameDetails(app.appid)

      const tag = await getTag(app.appid)

      data.tags = tag

      fs.appendFileSync(fullDataPath, JSON.stringify(data) + ',')
    } catch (e) {
      if (e.message === 'Too Many Requests') {
        console.log('Too Many Requests')
        await sleep(330000)
        count = 0
      }
      count++
      continue
    }

    count++
  }

  fs.appendFileSync(fullDataPath, ']')
}

test()

// for (const game of gameNames) {
//   const app = apps.find((app) => app.name === game)

//   const steam = new SteamAPI(false)

//   const data = await steam.getGameDetails(app.appid)

//   const tag = await getTag(app.appid)

//   data.tags = tag

//   fs.appendFileSync(fullDataPath, JSON.stringify(data) + ',')
// }

// fs.writeFileSync(newpath, JSON.stringify(gamesDescription))

async function getTag(appId) {
  const tag = await new Promise((resolve, reject) => {
    scraper.getData(appId, (err, dataTag) => {
      if (err) {
        reject(err)
      }

      if (dataTag) {
        resolve(dataTag.tags)
      }
    })
  })
  return tag
}
