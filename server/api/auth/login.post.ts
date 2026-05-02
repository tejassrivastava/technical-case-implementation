export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ email: string; password: string }>(event)

  if (body.email === config.authEmail && body.password === config.authPassword) {
    return {
      user: {
        name: 'Demo User',
        email: body.email
      }
    }
  }

  throw createError({
    statusCode: 401,
    message: 'Invalid credentials'
  })
})
