import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState({ visible: false, message: '', ok: false })

  const showToast = useCallback((message, ok = false) => {
    setToast({ visible: true, message, ok })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400)
  }, [])

  return { toast, showToast }
}
