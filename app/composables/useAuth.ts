import type { AuthUser } from '~/types/auth'

const user = ref<AuthUser | null>(null)

export function useAuth() {
  const login = (userData: AuthUser) => {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  return { user, login, logout }
}