import fs from "fs"

const path = '/home/infinity/Project/WebProject/database/data/appList.js'
const newpath = '/home/infinity/Project/WebProject/database/data/apps.js'

const gameNames =
['ELDEN RING',
'Terraria',
'Blasphemous',
'Hollow Knight',
'Library Of Ruina',
'Katana ZERO',
'Dead Cells',
'DEVOUR',
'Limbus Company',
'NieR:Automata™']

const gamesDescription = []

const rawdata = fs.readFileSync(path)

const json = JSON.parse(rawdata.toString())

const apps = Object.values(json.applist.apps)

for(const game of gameNames){
  const app = apps.find((app) => app.name === game)

  const response = await fetch('https://store.steampowered.com/api/appdetails?appids=' + app.appid)

  const data = await response.json()

  const dataValue = Object.values(data)

  gamesDescription.push(dataValue[0])
}

fs.writeFileSync(newpath, JSON.stringify(gamesDescription))
