<script setup lang="ts">
import type { AuthUser } from '~/types/auth'

const { isOpen, contextMessage, close } = useLoginModal()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  error.value = null
  isSubmitting.value = true

  try {
    const response = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value
      }
    })

    login(response.user)
    close()
  } catch (err: any) {
    error.value = err.message || 'An error occurred during login'
  } finally {
    isSubmitting.value = false
  }
}

const handleBackdropClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains('login-modal__backdrop')) {
    close()
  }
}

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="login-modal" @click="handleBackdropClick">
        <div class="login-modal__backdrop" />
        <div class="login-modal__content">
          <button class="login-modal__close" @click="close">
            ×
          </button>
          <h2 class="login-modal__title">Sign In</h2>

          <p v-if="contextMessage" class="login-modal__context">
            Sign in to easily read more articles like "<em>{{ contextMessage }}</em>"
          </p>

          <form @submit.prevent="handleSubmit" class="login-modal__form">
            <div class="login-modal__field">
              <label class="login-modal__label">Email</label>
              <input
                v-model="email"
                type="email"
                class="login-modal__input"
                placeholder="Enter your email"
                required
                :disabled="isSubmitting"
              />
            </div>

            <div class="login-modal__field">
              <label class="login-modal__label">Password</label>
              <input
                v-model="password"
                type="password"
                class="login-modal__input"
                placeholder="Enter your password"
                required
                :disabled="isSubmitting"
              />
            </div>

            <p v-if="error" class="login-modal__error">
              {{ error }}
            </p>

            <button
              type="submit"
              class="login-modal__submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.login-modal__content {
  position: relative;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.login-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f4f5f7;
  }
}

.login-modal__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.login-modal__context {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 24px;
  line-height: 1.5;

  em {
    font-style: italic;
    color: #e94560;
  }
}

.login-modal__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-modal__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a2e;
}

.login-modal__input {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  color: #1a1a2e;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: #e94560;
    box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.login-modal__error {
  color: #dc2626;
  font-size: 0.875rem;
}

.login-modal__submit {
  padding: 12px 24px;
  background-color: #e94560;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #c73550;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
