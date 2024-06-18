import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Item from './Item/index.tsx'
import List from './List/index.tsx'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <List />
  },
  {
    path: '/item/:id',
    element: <Item />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <section className="p-4">
      <RouterProvider router={router} />
    </section>
  </React.StrictMode>
)
