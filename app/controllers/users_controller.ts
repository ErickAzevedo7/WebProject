import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.all()

    return view.render('pages/users/index', { users: users })
  }

  async show({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return view.render('pages/users/show', { user: user })
  }

  async store({ request, response }: HttpContext) {
    const fullName = request.input('name')
    const password = request.input('password')
    const email = request.input('email')

    const data = {fullName, password, email}

    console.log(typeof(data.password))

    const user = new User()

    user.merge(data)

    await user.save()

    return response.redirect().toRoute('users.show', { id: user.id })
  }

  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const fullName = request.input('name')
    const password = request.input('password')
    const email = request.input('email')

    const data = {fullName, password, email}

    user.merge(data)

    await user.save()

    return response.redirect().toRoute('users.show', { id: user.id })
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.redirect().toRoute('users.index')
  }
}
