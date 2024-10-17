import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as mdiIcons } from '@iconify-json/mdi'
import edge from 'edge.js'

addCollection(mdiIcons)

edge.use(edgeIconify)
