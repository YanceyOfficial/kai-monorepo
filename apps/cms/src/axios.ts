import axios, { AxiosResponse } from 'axios'
import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  realm: import.meta.env.VITE_KEY_CLOAK_REALM || '',
  url: import.meta.env.VITE_KEY_CLOAK_URL || '',
  clientId: import.meta.env.VITE_KEY_CLOAK_CLIENT_ID || ''
})

await keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false
})

axios.defaults.timeout = 5 * 60 * 1000
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.baseURL = import.meta.env.VITE_SERVICE_URL
axios.interceptors.request.use(async (config) => {
  if (keycloak.isTokenExpired(1 * 60)) {
    try {
      await keycloak.updateToken(1 * 60)
    } catch (err) {
      console.error('Failed to refresh token', err)
      keycloak.logout()
      throw new axios.Cancel('Token refresh failed, user logged out')
    }
  }

  config.headers['Authorization'] = `Bearer ${keycloak.token}`
  return config
})

// GET
export const GET = <T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, { params })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// POST
export const POST = <T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err)
        }
      )
      .catch((err) => {
        reject(err)
      })
  })
}

// PUT
export const PUT = <T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .put(url, params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// PATCH
export const PATCH = <T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

// DELETE
export const DELETE = <T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, { data: params })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
