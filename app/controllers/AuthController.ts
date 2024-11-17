import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async create({ view }: HttpContext) {
    return view.render('pages/auth/create')
  }

  async store({ auth, request, response, view }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.findBy('email', email)

    if (!user) {
      return view.render('pages/auth/create')
    }

    const isPasswordValid = await hash.verify(user.password, password)

    if (!isPasswordValid) {
      return view.render('pages/auth/create')
    }

    await auth.use('web').login(user)

    return response.redirect().toRoute('/apps')
  }

  async delete({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('/apps')
  }
}
