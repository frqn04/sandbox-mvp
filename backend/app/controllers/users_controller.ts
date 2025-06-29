import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { schema, rules } from '@adonisjs/validator'

export default class UsersController {
  public async register({ request, response }: HttpContext) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(30),
        // Aquí NO ponemos rules.unique porque no está disponible
      ]),
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(6)]),
      role: schema.enum(['admin', 'client', 'editor']),
    })

    // Validar el esquema básico
    const payload = await request.validate({ schema: userSchema })

    // Validar manualmente que el username NO exista ya en la base
    const existingUsername = await User.findBy('username', payload.username)
    if (existingUsername) {
      return response.badRequest({
        errors: [
          {
            message: 'El username ya está en uso, intente otro por favor',
            field: 'username',
          },
        ],
      })
    }

    // Validar manualmente que el email NO exista ya en la base
    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.badRequest({
        errors: [
          {
            message: 'El email ya está en uso, intente otro por favor',
            field: 'email',
          },
        ],
      })
    }

    // Crear usuario si todo está bien
    const user = await User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: payload.role as 'admin' | 'client' | 'editor',
    })

    return response.created({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  }
}
