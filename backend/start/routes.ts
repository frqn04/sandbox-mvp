/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
//import UsersController from '#controllers/users_controller'

// Ruta raíz de prueba

const UsersController = () => import('#controllers/users_controller')

router.get('/users', [UsersController, 'index']) // Read all
router.get('/users/:id', [UsersController, 'show']) // Read one
router.post('/users/register', [UsersController, 'register']) // Create
router.put('/users/:id', [UsersController, 'update']) // Update
router.delete('/users/:id', [UsersController, 'destroy']) // Delete
