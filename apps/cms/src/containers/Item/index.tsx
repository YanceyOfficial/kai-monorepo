import LoadingButton from '@mui/lab/LoadingButton'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  TextField
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChatCompletion, WordList } from '../../types'
import { GET, PATCH, POST } from '../../utils'
import CircularLoading from '../../components/CircularLoading'

const Item: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(!id ? true : false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [wordList, setWordList] = useState<WordList | null>(null)

  const create = async () => {
    await POST<WordList>('/word', {
      words: wordList?.words
    })

    enqueueSnackbar('Save Successfully!', { variant: 'success' })
    navigate('/')
  }

  const update = async () => {
    await PATCH<WordList>(`/word/${id}`, {
      words: wordList?.words
    })

    enqueueSnackbar('Save Successfully!', { variant: 'success' })
    navigate('/')
  }

  const findOne = async () => {
    const { data } = await GET<WordList>(`/word/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setWordList(data)
  }

  const getAI = async () => {
    setLoading(true)
    try {
      const { data } = await POST<ChatCompletion>('/chatgpt', {
        words: input.split('\n').map((word) => word.trim())
      })

      setWordList(
        wordList
          ? {
              ...wordList,
              words: JSON.parse(data.choices[0].message.content)
            }
          : {
              words: JSON.parse(data.choices[0].message.content)
            }
      )
    } finally {
      setLoading(false)
      setShowDialog(false)
    }
  }

  useEffect(() => {
    if (id) {
      findOne()
    }
  }, [id])

  if (id && !wordList) return <CircularLoading />

  return (
    <section className="pb-14">
      {wordList?.title ? (
        <h1 className="font-bold text-4xl">{wordList?.title}</h1>
      ) : null}
      <section className="my-4 flex gap-4 flex-wrap">
        {wordList?.words.map(
          ({ word, explanation, phoneticNotation, examples }) => (
            <Card key={word} className="w-[calc((100vw-96px)/5)] flex-shrink-0">
              <CardContent className="flex flex-col gap-2">
                <p className="font-bold text-lg">
                  {word}
                  <span
                    className="font-normal text-sm ml-2"
                    color="text.secondary"
                  >
                    {phoneticNotation}
                  </span>
                </p>
                <p className="text-sm opacity-60">{explanation}</p>

                <ul className="pl-4 list-disc flex flex-col gap-2">
                  {examples.map((example) => (
                    <li key={example}>
                      <p className="text-sm">{example}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        )}
      </section>

      <section className="w-full flex justify-end gap-4 fixed bg-white bottom-0 left-0 p-4">
        {id ? null : (
          <Button variant="contained" onClick={() => setShowDialog(true)}>
            Input Words
          </Button>
        )}

        <Button
          variant="contained"
          onClick={id ? update : create}
          disabled={!wordList}
        >
          {id ? 'Update' : 'Create'}
        </Button>
      </section>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogContent>
          <p className="opacity-60 mb-2">
            * Make sure there is one word / phrase per line.
          </p>
          <TextField
            label="Words"
            multiline
            rows={10}
            className="w-[500px]"
            onChange={(e) => setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={getAI}
            loading={loading}
            disabled={!input.trim()}
          >
            Generate via AI
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </section>
  )
}

export default Item
