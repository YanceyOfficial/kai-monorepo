import { Button } from '@mui/material'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { formatJSONDate } from 'yancey-js-util'
import { fetcher } from '../../utils'

const List: FC = () => {
  const navigate = useNavigate()
  const { data, error, isLoading } = useSWR(
    'http://127.0.0.1:3002/word',
    fetcher
  )

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', resizable: false, width: 300 },
    {
      field: '',
      headerName: 'Words Count',
      width: 120,
      resizable: false,
      valueGetter: (_, row) => row.words.length
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      valueGetter: (createdAt) => formatJSONDate(createdAt),
      resizable: false,
      width: 300
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      valueGetter: (updatedAt) => formatJSONDate(updatedAt),
      resizable: false,
      width: 300
    },
    {
      field: '_id',
      headerName: '',
      resizable: false,
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => navigate(`/item/${params.value}`)}
        >
          Edit
        </Button>
      )
    }
  ]

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return (
    <section>
      <section className="mb-4 flex w-full justify-end">
        <Button variant="contained" onClick={() => navigate('/item')}>
          Create a Word List
        </Button>
      </section>
      <DataGrid
        getRowId={(row) => row._id}
        rows={data || []}
        isRowSelectable={() => false}
        disableColumnSorting
        disableColumnMenu
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 }
          }
        }}
        pageSizeOptions={[5, 10]}
        sx={{
          [`& .${gridClasses.columnSeparator}`]: {
            [`&:not(.${gridClasses['columnSeparator--resizable']})`]: {
              display: 'none'
            }
          }
        }}
      />
    </section>
  )
}

export default List
