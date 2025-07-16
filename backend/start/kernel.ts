// import router from '@adonisjs/core/services/router'
//import server from '@adonisjs/core/services/server'
import Router from '@ioc:Adonis/Core/Route' // from '@ioc:Adonis/Core/Server'

Router.onServer.errorHandler(() => import('#exceptions/handler'))

Router.middleware.register([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

Router.middleware.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

export const middleware = [
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
]
