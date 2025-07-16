import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from '#models/user'
import { schema, rules } from '@adonisjs/validator'

export default class UsersController {
  // CREATE - Registrar nuevo usuario
  public async register({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }, [rules.minLength(3), rules.maxLength(30)]),
      email: schema.string({}, [rules.email()]),
      password: schema.string({}, [rules.minLength(6)]),
    })

    const payload: {
      username?: string
      email?: string
      password?: string
      role?: 'client'
    } = await request.validate({ schema: userSchema })

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

    const existingEmail = await User.findBy('email', payload.email)
    if (existingEmail) {
      return response.badRequest({
        errors: [
          {
            message: 'El email ya está en uso, intente otro por favor',
            field: 'email',
          },
        ],
      })
    }

    const user = await User.create({
      username: payload.username,
      email: payload.email,
      password: payload.password,
      role: 'client', // Asignar rol por defecto
    })
    return response.created(user)
  }

  // READ ALL - Obtener todos los usuarios
  public async index({ response }: HttpContextContract) {
    const user = await User.all()
    return response.ok(user)
  }

  // READ ONE - Obtener un usuario por ID
  public async show({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }
    return response.ok(user)
  }

  // UPDATE - Actualizar un usuario por ID
  public async update({ params, request, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    const updateSchema = schema.create({
      username: schema.string.optional({ trim: true }, [rules.minLength(3), rules.maxLength(30)]),
      email: schema.string.optional({}, [rules.email()]),
      password: schema.string.optional({}, [rules.minLength(6)]),
      role: schema.enum.optional(['admin', 'client', 'editor'] as const),
    })

    // 👇 Esta es la clave para que TypeScript sepa que `role` es válido
    type Role = 'admin' | 'client' | 'editor'

    const payload: {
      username?: string
      email?: string
      password?: string
      role?: Role
    } = await request.validate({ schema: updateSchema })
    if (payload.role && request.user?.role !== 'admin') {
      delete payload.role
    }
    user.merge(payload)
    await user.save()

    if (payload.username && payload.username !== user.username) {
      const exists = await User.findBy('username', payload.username)
      if (exists) {
        return response.badRequest({
          errors: [{ message: 'El username ya está en uso', field: 'username' }],
        })
      }
    }

    if (payload.email && payload.email !== user.email) {
      const exists = await User.findBy('email', payload.email)
      if (exists) {
        return response.badRequest({
          errors: [{ message: 'El email ya está en uso', field: 'email' }],
        })
      }
    }

    // Ya no hace falta hacer aserción, porque el tipo ya es correcto
    user.merge(payload)
    await user.save()

    return response.ok({
      message: 'Usuario actualizado correctamente',
      user,
    })
  }
  // DELETE - Eliminar un usuario por ID
  public async destroy({ params, response }: HttpContextContract) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    await user.delete()
    return response.ok({ message: 'Usuario eliminado correctamente' })
  }
}
