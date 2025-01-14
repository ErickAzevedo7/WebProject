import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    fullName: vine.string().trim().minLength(3),
    password: vine.string().trim().minLength(6).sameAs('passwordConfirmation'),
  })
)

export const patchUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().optional(),
    fullName: vine.string().trim().minLength(3).optional(),
    password: vine.string().trim().minLength(6).sameAs('passwordConfirmation').optional(),
  })
)
