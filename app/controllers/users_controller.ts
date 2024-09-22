import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index() {
    const users = await User.all()

    return users
  }

  async show({ params }: HttpContext) {
    const user = await User.findOrFail(params.id)

    return user
  }

  async store({ request, response }: HttpContext) {
    const fullName = request.input('name')
    const password = request.input('password')
    const email = request.input('email')

    const data = {fullName, password, email}

    const user = new User()

    user.merge(data)

    await user.save()

    response.status(200)

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

    response.status(200)

    return response.redirect().toRoute('users.index')
  }
}
