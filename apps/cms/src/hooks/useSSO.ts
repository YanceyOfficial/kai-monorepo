import Keycloak from 'keycloak-js'
import { useEffect, useRef, useState } from 'react'

const instance = new Keycloak({
  realm: import.meta.env.VITE_KEY_CLOAK_REALM || '',
  url: import.meta.env.VITE_KEY_CLOAK_URL || '',
  clientId: import.meta.env.VITE_KEY_CLOAK_CLIENT_ID || ''
})

const useSSO = () => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null)
  const didInit = useRef(false)

  const initial = async () => {
    const authenticated = await instance.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    })

    if (authenticated) {
      window.localStorage.setItem('token', instance?.token || '')
      setKeycloak(instance)
      didInit.current = true
    }
  }

  useEffect(() => {
    if (didInit.current) {
      return
    }

    initial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didInit])

  return { didInit, keycloak }
}

export default useSSO
