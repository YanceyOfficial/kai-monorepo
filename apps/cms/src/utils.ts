import axios, { AxiosResponse } from 'axios'

// config timeout
axios.defaults.timeout = 5 * 10000

// config request header
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.headers['Authorization'] =
  `Bearer ${window.localStorage.getItem('token')}`

// config base url
axios.defaults.baseURL = import.meta.env.VITE_BEG_SERVICE_URL

// GET
export function GET<T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> {
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
export function POST<T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> {
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
export function PUT<T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> {
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
export function PATCH<T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> {
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
export function DELETE<T>(
  url: string,
  params?: unknown
): Promise<AxiosResponse<T>> {
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
