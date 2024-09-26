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
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/auth/signUp')

router
  .group(() => {
    router.get('/', [AppsController, 'search']).as('index')
    router.get('/:name', [AppsController, 'show']).as('show')
    router.post('/', [AppsController, 'store']).as('store')
  })
  .prefix('/apps')
  .as('apps')

router
  .group(() => {
    router.get('/', [UsersController, 'index']).as('index')
    router.post('/', [UsersController, 'store']).as('store')
    router.get('/:id', [UsersController, 'show']).as('show')
    router.patch('/:id', [UsersController, 'update']).as('update')
    router.delete('/:id', [UsersController, 'destroy']).as('destroy')
  })
  .prefix('/users')
  .as('users')
