import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async create({ view }: HttpContext) {
    return view.render('pages/auth/create')
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    response.redirect().toRoute('index')
  }

  async delete({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('index')
  }
}
