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
import { FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CircularLoading from '../../components/CircularLoading'
import { ChatCompletion, WordList } from '../../types'
import { GET, POST } from '../../utils'

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
    console.log(wordList)
    // await PATCH<WordList>(`/word/${id}`, {
    //   words: wordList?.words
    // })

    // enqueueSnackbar('Save Successfully!', { variant: 'success' })
    // navigate('/')
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

      <Formik
        initialValues={{ words: wordList?.words }}
        enableReinitialize
        onSubmit={(values) => {
          console.log(values)
          // TODO:
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
                          <p className="font-bold text-lg">
                            {word}
                            <span
                              className="font-normal text-sm ml-2"
                              color="text.secondary"
                            >
                              {phoneticNotation}
                            </span>
                          </p>
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
            <button type="submit">Invite</button>
          </Form>
        )}
      </Formik>

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
