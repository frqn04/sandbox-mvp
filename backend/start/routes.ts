/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

// Ruta raíz de prueba
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Ruta POST /register que llama al método register de UsersController
router.post('/register', async (ctx) => {
  return new UsersController().register(ctx)
})
