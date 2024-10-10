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
const SessionController = () => import('#controllers/session_controller')
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/auth/signUp')

router
  .group(() => {
    router.get('/', [AppsController, 'index']).as('index')
    router.get('/:id', [AppsController, 'show']).as('show')
  })
  .prefix('/apps')
  .as('apps')

router.on('/').render('pages/auth/signUp')

router
  .group(() => {
    router.get('/', [AppsController, 'index']).as('index')
    router.get('/:id', [AppsController, 'show']).as('show')
  })
  .prefix('/apps')
  .as('apps')

  router
  .group(() => {
    router.get('/login', [SessionController, 'create']).as('create')
    router.post('/login', [SessionController, 'store']).as('store')
    router.get('/logout', [SessionController, 'delete']).as('delete')
  })
.prefix('/sessions')
.as('sessions')

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
