import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CartItemsMiddleware {
  async handle({request, session, auth}: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (auth.isAuthenticated) {
      await auth.user?.load('cart')

      const cart = auth.user?.cart

      await cart?.loadCount('apps')

      session.put('cart_items_count', cart?.$extras.apps_count)

      return await next()

    }

    if (!request.cookie('cart_items')) {
      const count = 0

      session.put('cart_items_count', count)

      return await next()
    }

    let count = 0
    for (const app of request.cookie('cart_items')) {
      count++
    }

    session.put('cart_items_count', count)

    /**
     * Call next method in the pipeline and return its output
     */
    return await next()
  }
}
