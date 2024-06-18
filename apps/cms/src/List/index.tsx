import { Button } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FC } from 'react'
import useSWR from 'swr'
import { fetcher } from '../utils'
import {useNavigate} from 'react-router-dom'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`
  }
]

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
]

const List: FC = () => {
  const navigate = useNavigate()
  const { data, error, isLoading } = useSWR(
    'http://127.0.0.1:3002/word',
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  console.log(data)

  return (
    <section>
      <section className="mb-4 flex w-full justify-end">
        <Button variant="contained" onClick={() => navigate('/item/12345')}>
          Create a Word List
        </Button>
      </section>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </section>
  )
}

export default List
