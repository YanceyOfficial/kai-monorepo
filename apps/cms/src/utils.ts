export const fetcher = (url: string, method: string, body?: unknown) =>
  fetch(`${import.meta.env.VITE_BEG_SERVICE_DOMAIN}${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  })
