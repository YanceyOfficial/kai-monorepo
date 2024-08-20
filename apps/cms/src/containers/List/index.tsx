import { Button, TextField } from '@mui/material'
import { DataGrid, GridColDef, gridClasses } from '@mui/x-data-grid'
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatJSONDate } from 'yancey-js-util'
import { DELETE, GET } from '../../axios'
import ConfirmPopover from '../../components/ConfirmPopover'
import { Word, WordListWithPagination } from '../../types'

const List: FC = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(0)
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<Word[] | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data } = await GET<WordListWithPagination>('/word', {
        page,
        pageSize: 50,
        search: searchInput
      })
      setRows(data.items)
      setRowCount(data.total)
    } finally {
      setLoading(false)
    }
  }

  const removeOne = async (id: string) => {
    setLoading(true)
    try {
      await DELETE<Word>(`/word/${id}`)
      await fetchData()
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', resizable: true, width: 200 },
    {
      field: 'explanation',
      headerName: 'Explanation',
      resizable: true,
      width: 200
    },
    { field: 'isLearned', headerName: 'Is Learned', resizable: true },
    {
      field: 'factor',
      headerName: 'Is Challenging',
      resizable: true,
      renderCell: (params) => <span>{(params.value > 3).toString()}</span>
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

          <Button variant="text">
            <ConfirmPopover onOk={() => removeOne(params.value)}>
              Delete
            </ConfirmPopover>
          </Button>
        </>
      )
    }
  ]

  useEffect(() => {
    fetchData()
  }, [page])

  return (
    <section>
      <section className="flex mb-4 w-full justify-between">
        <section className="flex gap-2 items-center">
          <TextField
            variant="standard"
            className="w-48"
            onInput={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              (e) => setSearchInput(e.target.value)
            }
          />
          <Button variant="contained" onClick={fetchData}>
            Search
          </Button>
        </section>
        <Button
          variant="contained"
          color="info"
          onClick={() => navigate('/item')}
        >
          Batch Insert
        </Button>
      </section>
      <DataGrid
        getRowId={(row) => row._id}
        rows={rows || []}
        isRowSelectable={() => false}
        disableColumnSorting
        disableColumnMenu
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        autoPageSize
        onPaginationModelChange={(e) => {
          setPage(e.page)
        }}
        loading={loading}
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
