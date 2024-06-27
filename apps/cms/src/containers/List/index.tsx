import { Button } from '@mui/material'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatJSONDate } from 'yancey-js-util'
import { DELETE, GET } from '../../axios'
import CircularLoading from '../../components/CircularLoading'
import { WordList } from '../../types'

const List: FC = () => {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<WordList[] | null>(null)
  const navigate = useNavigate()

  const fetchData = async () => {
    const { data } = await GET<WordList[]>('/word')
    setList(data)
  }

  const removeOne = async (id: string) => {
    setLoading(true)
    await DELETE<WordList>(`/word/${id}`)
    await fetchData()
    setLoading(false)
  }

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', resizable: false, width: 300 },
    {
      field: 'undefined',
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
      headerName: 'Actions',
      resizable: false,
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            variant="text"
            onClick={() => navigate(`/item/${params.value}`)}
          >
            Edit
          </Button>
          <Button variant="text" onClick={() => removeOne(params.value)}>
            Delete
          </Button>
        </>
      )
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  if (!list || loading) return <CircularLoading />

  return (
    <section>
      <section className="mb-4 flex w-full justify-end">
        <Button variant="contained" onClick={() => navigate('/item')}>
          Create a Word List
        </Button>
      </section>
      <DataGrid
        getRowId={(row) => row._id}
        rows={list || []}
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
