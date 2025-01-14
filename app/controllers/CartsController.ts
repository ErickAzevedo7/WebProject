import App from '#models/app'
import type { HttpContext } from '@adonisjs/core/http'
import Stripe from 'stripe'

export default class CartsController {
  async index({ auth, view, request }: HttpContext) {
    if (auth.isAuthenticated) {
      await auth.user?.load('cart')

      const cart = auth.user?.cart

      await cart?.load('apps')

      const apps = cart?.apps

      return view.render('pages/cart/index', { apps: apps })
    }

    if (!request.cookie('cart_items')) {
      return view.render('pages/cart/index')
    }

    const apps = []
    for (const app of request.cookie('cart_items')) {
      console.log(app)
      apps.push(await App.findOrFail(app))
    }

    return view.render('pages/cart/index', { apps: apps })
  }

  async store({ auth, request, response }: HttpContext) {
    const appId = request.input('app_id')
    const app = await App.findOrFail(appId)

    if (auth.isAuthenticated) {
      await auth.user?.load('cart')

      const cart = auth.user?.cart

      cart?.related('apps').save(app)

      return response.redirect().back()
    }

    response.clearCookie('cart_items')

    // @ts-ignore
    const payload = request.cookie('cart_items', [])

    payload.push(appId)

    const cartItems = Array.from(new Set(payload))

    response.cookie('cart_items', cartItems)

    return response.redirect().back()
  }

  async destroy({ auth, request, response, params }: HttpContext) {
    const app = await App.findOrFail(params.id)

    if (auth.isAuthenticated) {
      await auth.user?.load('cart')

      const cart = auth.user?.cart

      cart?.related('apps').detach([app.id])

      return response.redirect().back()
    }

    // @ts-ignore
    const payload = request.cookie('cart_items', [])

    const cartItems = payload.filter((item: string) => item !== params.id)

    response.cookie('cart_items', cartItems)

    return response.redirect().back()
  }

  async checkout({ request, response }: HttpContext) {
    if (!process.env.STRIPE_SK_KEY) {
      throw new Error('Missing STRIPE_SK_KEY')
    }
    const stripe = new Stripe(process.env.STRIPE_SK_KEY)

    let data = request.input('apps')

    if (!Array.isArray(data)) {
      data = [data]
    }

    const apps = await App.query().whereIn('id', data)

    const YOUR_DOMAIN = 'http://localhost:3333'

    let line_items = []
    for (const app of apps) {
      const product = await stripe.products.create({
        name: app.name,
        description: app.shortDescription,
        images: [app.headerImage],
      })

      var currency = app.price
      var number = Number(currency.replace(/[^0-9-]+/g, ''))

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: number,
        currency: 'usd',
      })

      line_items.push({ price: price.id, quantity: 1 })
    }

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/`,
      cancel_url: `${YOUR_DOMAIN}/cart`,
    })

    if (session.url) response.status(303).redirect(session.url)
  }
}
