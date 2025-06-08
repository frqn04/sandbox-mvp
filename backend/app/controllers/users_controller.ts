import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { schema, rules } from '@adonisjs/validator'

export default class UsersController {
  public async register({ request, response }: HttpContext) {
    const userSchema = schema.create({
      email: schema.string([rules.email()]),
      password: schema.string([rules.minLength(6)]),
      role: schema.enum(['admin', 'client'] as const),
    })

    const payload = await request.validate({ schema: userSchema })

    // Validación manual de email único
    const existingUser = await User.findBy('email', payload.email)
    if (existingUser) {
      return response.badRequest({
        errors: [
          {
            message: 'El email ya está en uso',
            field: 'email',
          },
        ],
      })
    }

    const user = await User.create(payload)

    return response.created({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  }
}
