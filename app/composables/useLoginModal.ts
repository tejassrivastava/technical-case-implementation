const isOpen = ref<boolean>(false)
const contextMessage = ref<string | null>(null)

export function useLoginModal() {
  const open = (message?: string) => {
    if (message !== undefined) {
      contextMessage.value = message
    }
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    contextMessage.value = null
  }

  const setContext = (title: string | null) => {
    contextMessage.value = title
  }

  return { isOpen, contextMessage, open, close, setContext }
}
