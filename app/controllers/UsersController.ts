import Cart from '#models/cart'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { createUserValidator, patchUserValidator } from '#validators/user'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.all()

    return view.render('pages/users/index', { users: users })
  }

  async show({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return view.render('pages/users/show', { user: user })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/users/create')
  }

  async store({ request, response }: HttpContext) {
    console.log(request.all())
    const payload = await request.validateUsing(createUserValidator)

    const user = new User()

    const cart = new Cart()

    await user.merge(payload)

    await user.save()

    user.related('cart').save(cart)

    return response.redirect().toRoute('index')
  }

  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return view.render('pages/users/edit', { user: user })
  }

  async patch({ params, request, response }: HttpContext) {
    console.log('sadasdasdasdasdasd')
    const user = await User.findOrFail(params.id)

    const payload = await request.validateUsing(patchUserValidator)

    user.merge(payload)

    await user.save()

    return response.redirect().toRoute('index')
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.redirect().toRoute('users.index')
  }
}
