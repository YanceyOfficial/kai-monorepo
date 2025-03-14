import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'
import LoadingButton from '@mui/lab/LoadingButton'
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField
} from '@mui/material'
import { AxiosResponse } from 'axios'
import { FieldArray, Form, Formik } from 'formik'
import { enqueueSnackbar } from 'notistack'
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GET, PATCH, POST } from '../../axios'
import AudioPlayer from '../../components/AudioPlayer'
import CircularLoading from '../../components/CircularLoading'
import { YOUDAO_VOICE_URL } from '../../constants'
import { Word } from '../../types'

const Item: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(!id ? true : false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [words, setWords] = useState<Word[] | null>(null)
  const isUpdating = !!id

  const create = async (words: Word[]) => {
    await POST<Word>('/word', {
      words
    })

    enqueueSnackbar('Save Successfully!', { variant: 'success' })
    navigate('/')
  }

  const update = async (words: Word[]) => {
    await PATCH<Word>('/word', {
      _id: words[0]._id,
      explanation: words[0].explanation,
      examples: words[0].examples
    })

    enqueueSnackbar('Save Successfully!', { variant: 'success' })
    navigate('/')
  }

  const findOne = async () => {
    const { data } = await GET<Word[]>(`/word/${id}`, {})
    setWords(data)
  }

  const batchGetAI = async () => {
    setLoading(true)

    const wordsInput = input.split('\n').map((word) => word.trim())
    const promises: Promise<AxiosResponse<Word>>[] = []
    for (let i = 0; i < wordsInput.length; i += 10) {
      promises.push(
        POST<Word>('/chatgpt', {
          words: wordsInput.slice(i, i + 10)
        })
      )
    }

    try {
      const res = await Promise.all(promises)
      setWords(res.map((item) => item.data))
    } finally {
      setLoading(false)
      setShowDialog(false)
    }
  }

  useEffect(() => {
    if (isUpdating) {
      findOne()
    }
  }, [isUpdating])

  if (isUpdating && !words) return <CircularLoading />

  return (
    <section className="pb-14">
      <Formik
        initialValues={{ words }}
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
                    ({ name, explanation, phoneticNotation, examples }, i) => (
                      <Card
                        key={name}
                        className="w-[calc((100vw-96px)/5)] flex-shrink-0 max-sm:w-full"
                      >
                        <CardContent className="flex flex-col gap-2">
                          <div className="font-bold text-lg flex items-center gap-2 flex-wrap">
                            <span>{name}</span>
                            <span
                              className="font-normal text-sm"
                              color="text.secondary"
                            >
                              {phoneticNotation}
                            </span>
                            <AudioPlayer
                              audioUrl={`${YOUDAO_VOICE_URL}${name}`}
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

                          <FieldArray
                            name={`words.${i}.examples`}
                            render={({ insert, remove }) => (
                              <>
                                <div className="flex flex-col gap-2 mt-4">
                                  {examples.map((example, j) => (
                                    <div
                                      className="flex items-center gap-1 mb-4"
                                      key={j}
                                    >
                                      <TextField
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
                                      <IconButton
                                        size="small"
                                        onClick={() => remove(j)}
                                        className="h-8"
                                      >
                                        <RemoveCircleOutlineRoundedIcon />
                                      </IconButton>
                                    </div>
                                  ))}

                                  <Button
                                    variant="contained"
                                    onClick={() => insert(examples.length, '')}
                                    className="w-[calc(100%-38px)]"
                                  >
                                    Add Example
                                  </Button>
                                </div>
                              </>
                            )}
                          />
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

              <Button
                type="submit"
                variant="contained"
                disabled={!words || loading}
              >
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
            className="w-full"
            onChange={(e) => setInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <LoadingButton
            variant="contained"
            onClick={batchGetAI}
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
