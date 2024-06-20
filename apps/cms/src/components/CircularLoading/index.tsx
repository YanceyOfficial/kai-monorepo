import { CircularProgress } from '@mui/material'
import { FC } from 'react'

const CircularLoading: FC = () => (
  <section className="flex w-full h-[calc(100vh-96px)] justify-center items-center">
    <CircularProgress />
  </section>
)

export default CircularLoading
