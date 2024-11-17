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
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', [AppsController, 'index']).as('index')
    router.get('/:id', [AppsController, 'show']).as('show')
  })
  .prefix('/apps')
  .as('apps')

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
    router.patch('/:id', [UsersController, 'update']).as('update')
    router.delete('/:id', [UsersController, 'destroy']).as('destroy')
  })
  .prefix('/users')
  .as('users')
