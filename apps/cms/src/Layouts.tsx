import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SSOLoading from './components/SSOLoading'
import Item from './containers/Item'
import List from './containers/List'
import useSSO from './hooks/useSSO'

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
  const keycloak = useSSO()

  if (!keycloak?.authenticated) {
    return <SSOLoading />
  }

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <AppBar>
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
      <section className="p-4 pt-20 bg-gray-50 min-h-screen">
        <RouterProvider router={router} />
      </section>
    </SnackbarProvider>
  )
}

export default Layouts
