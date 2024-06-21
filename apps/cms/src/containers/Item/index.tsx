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
import { FieldArray, Form, Formik } from 'formik'
import { enqueueSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AudioPlayer from '../../components/AudioPlayer'
import CircularLoading from '../../components/CircularLoading'
import { YOUDAO_VOICE_URL } from '../../constants'
import { ChatCompletion, Word, WordList } from '../../types'
import { GET, PATCH, POST } from '../../utils'

const Item: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(!id ? true : false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [wordList, setWordList] = useState<WordList | null>(null)
  const isUpdating = !!id

  const create = async (words: Word[]) => {
    await POST<WordList>('/word', {
      words
    })

    enqueueSnackbar('Save Successfully!', { variant: 'success' })
    navigate('/')
  }

  const update = async (words: Word[]) => {
    console.log(wordList)
    await PATCH<WordList>(`/word/${id}`, {
      words
    })

    enqueueSnackbar('Save Successfully!', { variant: 'success' })
    navigate('/')
  }

  const findOne = useCallback(async () => {
    const { data } = await GET<WordList>(`/word/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    setWordList(data)
  }, [id])

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
  }, [findOne, id])

  if (isUpdating && !wordList) return <CircularLoading />

  return (
    <section className="pb-14">
      {wordList?.title ? (
        <h1 className="font-bold text-4xl">{wordList?.title}</h1>
      ) : null}

      <Formik
        initialValues={{ words: wordList?.words }}
        enableReinitialize
        onSubmit={(values) => {
          if (values.words) {
            isUpdating ? update(values.words) : create(values.words)
          }
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form className="my-4 flex gap-4 flex-wrap">
            <FieldArray
              name="words"
              render={() => (
                <>
                  {values?.words?.map(
                    ({ word, explanation, phoneticNotation, examples }, i) => (
                      <Card
                        key={word}
                        className="w-[calc((100vw-96px)/5)] flex-shrink-0"
                      >
                        <CardContent className="flex flex-col gap-2">
                          <div className="font-bold text-lg flex items-center gap-2">
                            <span>{word}</span>
                            <span
                              className="font-normal text-sm"
                              color="text.secondary"
                            >
                              {phoneticNotation}
                            </span>
                            <AudioPlayer
                              audioUrl={`${YOUDAO_VOICE_URL}${word}`}
                            />
                          </div>
                          <TextField
                            multiline
                            fullWidth
                            hiddenLabel
                            name={`words.${i}.explanation`}
                            value={explanation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            variant="filled"
                            size="small"
                          />
                          <div className="flex flex-col gap-2 mt-4">
                            {examples.map((example, j) => (
                              <TextField
                                key={j}
                                multiline
                                fullWidth
                                hiddenLabel
                                name={`words.${i}.examples.${j}`}
                                value={example}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                variant="filled"
                                size="small"
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </>
              )}
            />
            <section className="w-full flex justify-end gap-4 fixed bg-white bottom-0 left-0 p-4">
              {isUpdating || (
                <Button variant="contained" onClick={() => setShowDialog(true)}>
                  Input Words
                </Button>
              )}

              <Button type="submit" variant="contained" disabled={!wordList}>
                {isUpdating ? 'Update' : 'Create'}
              </Button>
            </section>
          </Form>
        )}
      </Formik>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogContent>
          <p className="opacity-60 mb-2">
            * Make sure there is one word / phrase per line.
          </p>
          <TextField
            focused
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
