export default defineNuxtPlugin(() => {
  const { login } = useAuth()
  const stored = localStorage.getItem('auth_user')
  if (stored) {
    login(JSON.parse(stored))
  }
})