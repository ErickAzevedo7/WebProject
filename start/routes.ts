/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/UsersController')
const AppsController = () => import('#controllers/AppsController')
const AuthController = () => import('#controllers/AuthController')
import CartsController from '#controllers/CartsController'
import App from '#models/app'
import Tag from '#models/tag'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .get('/', async ({ view }) => {
    const apps = await App.query().orderBy('recommendations', 'desc').limit(5)
    const limit = 6

    const categories = await Tag.query()
      .limit(limit)
      .preload('apps', (query) => {
        query.groupLimit(10)
      })

    return view.render('pages/home', { apps: apps, categories: categories })
  })
  .as('index')
  .use(middleware.cartItems())

router
  .group(() => {
    router.get('/', [AppsController, 'index']).as('index')
    router.post('/', [AppsController, 'filter']).as('filter')
    router.get('paginate/:page', [AppsController, 'paginate']).as('paginate')
    router.get('/:id', [AppsController, 'show']).as('show')
  })
  .prefix('/apps')
  .as('apps')
  .use(middleware.cartItems())

router
  .group(() => {
    router.get('/', [CartsController, 'index']).as('index')
    router.post('/', [CartsController, 'store']).as('store')
    router.post('/checkout', [CartsController, 'checkout']).as('checkout')
    router.post('/:id', [CartsController, 'destroy']).as('destroy')
  })
  .prefix('/cart')
  .as('cart')
  .use(middleware.cartItems())

router
  .group(() => {
    router.get('/login', [AuthController, 'create']).as('create')
    router.post('/login', [AuthController, 'store']).as('store')
    router.get('/logout', [AuthController, 'delete']).as('delete')
  })
  .as('auth')

router
  .group(() => {
    router.get('/', [UsersController, 'index']).as('index')
    router.get('/new', [UsersController, 'create']).as('create')
    router.post('/', [UsersController, 'store']).as('store')
    router.get('/:id', [UsersController, 'show']).as('show')
    router.get('/:id/edit', [UsersController, 'edit']).as('edit').use(middleware.auth())
    router.post('/:id/edit', [UsersController, 'patch']).as('patch').use(middleware.auth())
    router.delete('/:id', [UsersController, 'destroy']).as('destroy').use(middleware.auth())
  })
  .prefix('/users')
  .as('users')
  .use(middleware.cartItems())
