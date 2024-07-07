import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { keycloak } from './axios'
import Item from './containers/Item'
import List from './containers/List'

const safeAreaTop =
  Number(
    new window.URLSearchParams(window.location.search).get('safeAreaTop')
  ) || 0

const router = createBrowserRouter([
  {
    path: '/',
    element: <List />
  },
  {
    path: '/item/:id',
    element: <Item />
  },
  {
    path: '/item/',
    element: <Item />
  }
])

const Layouts: FC = () => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          style={{
            paddingTop: safeAreaTop
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, cursor: 'pointer' }}
              onClick={() => window.location.replace('/')}
            >
              Kai CMS
            </Typography>
            <p>
              Hello, {keycloak?.tokenParsed?.given_name}{' '}
              {keycloak?.tokenParsed?.family_name}
            </p>
          </Toolbar>
        </AppBar>
      </Box>
      <section
        className="p-4 bg-gray-50 min-h-screen"
        style={{ paddingTop: `calc(${safeAreaTop}px + 5rem)` }}
      >
        <RouterProvider router={router} />
      </section>
    </SnackbarProvider>
  )
}

export default Layouts
