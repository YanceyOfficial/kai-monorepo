import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { FC } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Item from './containers/Item'
import List from './containers/List'

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
      <section className="fixed top-0 left-0 w-full">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, cursor: 'pointer' }}
                onClick={() => window.location.replace('/')}
              >
                Kai CMS
              </Typography>
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
      </section>
      <section className="p-4 pt-20 bg-gray-50 min-h-screen">
        <RouterProvider router={router} />
      </section>
    </SnackbarProvider>
  )
}

export default Layouts
