import type { AuthUser } from '~/types/auth'

const user = ref<AuthUser | null>(null)

export function useAuth() {
  const hydrate = () => {
    const stored = localStorage.getItem('auth_user')
    if (stored) user.value = JSON.parse(stored)
  }

  const login = (userData: AuthUser) => {
    user.value = userData
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_user')
  }

  return { user, hydrate, login, logout }
}