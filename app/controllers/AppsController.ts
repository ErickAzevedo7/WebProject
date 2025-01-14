import App from '#models/app'
import Tag from '#models/tag'
import type { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ request, view }: HttpContext) {
    const data = request.qs()
    const apps = await App.query().orderBy('recommendations', 'desc').paginate(1, 10)
    const categories = await Tag.query().orderBy('name')
    let checked

    if (data.category) {
      checked = await Tag.query().where('id', data.category)
    }

    const page = apps.toJSON()

    if (checked) {
      return view.render('pages/apps/index', {
        apps,
        categories: categories,
        checked: checked[0].name,
      })
    }
    return view.render('pages/apps/index', { apps, categories: categories, meta: page.meta })
  }

  async paginate({ view, params }: HttpContext) {
    const page = await App.query().orderBy('recommendations', 'desc').paginate(params.page, 10)

    return view.render('pages/apps/partials/app_list', { apps: page })
  }

  async filter({ request, view, params }: HttpContext) {
    let data = []
    const payload = request.all()
    const page = params.page
    const limit = 10

    console.log(page)

    if (Array.isArray(payload.category)) {
      for (const category of payload.category) {
        data.push(category)
      }
    } else if (payload.category) {
      data.push(payload.category)
    }

    const query = App.query()

    for (const element of data) {
      query.whereHas('tags', (query) => {
        query.where('name', element)
      })
    }

    if (payload.search !== null && payload.search !== undefined) {
      query.andWhereILike('name', `%${payload.search}%`)
    }

    const apps = await query.orderBy('recommendations', 'desc').paginate(1, limit)

    return view.render('pages/apps/partials/app_list', { apps })
  }

  async show({ auth, request, params, view }: HttpContext) {
    const app = await App.findOrFail(params.id)

    await app.load('screenshots')
    await app.load('movies')
    await app.load('developers')
    await app.load('publishers')
    await app.load('tags')

    if (auth.isAuthenticated) {
      await auth.user?.load('cart')

      const cart = auth.user?.cart

      await cart?.load('apps')

      const cartItems = cart?.apps.map((app) => app.id)

      if (cartItems?.includes(app.id)) {
        return view.render('pages/apps/show', { app: app, inCart: true })
      }
    }
    if (request.cookie('cart_items')) {
      const cartItems = request.cookie('cart_items')

      if (cartItems.includes(app.id.toString())) {
        return view.render('pages/apps/show', { app: app, inCart: true })
      }
    }

    return view.render('pages/apps/show', { app: app })
  }
}
