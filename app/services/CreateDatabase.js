import fs from 'fs'
import SteamAPI from 'steamapi'
import scraper from 'steam-scraper'

const path = '/home/infinity/Project/WebProject/database/data/appList.js'
const newpath = '/home/infinity/Project/WebProject/database/data/apps.js'

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

for (const game of gameNames) {
  const app = apps.find((app) => app.name === game)

  const steam = new SteamAPI(false)

  const data = await steam.getGameDetails(app.appid)

  const tag = await getTag(app.appid)

  data.tags = tag

  gamesDescription.push(data)
}

fs.writeFileSync(newpath, JSON.stringify(gamesDescription))

async function getTag(appId) {
  const tag = await new Promise((resolve, reject) => {
    scraper.getData(appId, (err, dataTag) => {
      if (err) {
        reject(err)
      }

      resolve(dataTag.tags)
    })
  })
  return tag
}
