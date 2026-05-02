const isOpen = ref<boolean>(false)
const contextMessage = ref<string | null>(null)

export function useLoginModal() {
  const redirectUrl = useState<string | null>('auth-redirect', () => null)

  const open = (message?: string) => {
    if (message !== undefined) {
      contextMessage.value = message
    }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    contextMessage.value = null
    redirectUrl.value = null
  }

  const setContext = (title: string | null) => {
    contextMessage.value = title
  }

  const setRedirectUrl = (url: string) => {
    redirectUrl.value = url
  }

  const clearRedirectUrl = () => {
    redirectUrl.value = null
  }

  return {
    isOpen,
    contextMessage,
    redirectUrl,
    open,
    close,
    setContext,
    setRedirectUrl,
    clearRedirectUrl,
  }
}
