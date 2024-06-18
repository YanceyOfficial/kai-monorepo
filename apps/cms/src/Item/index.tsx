import { Button, TextField } from '@mui/material'
import { FC } from 'react'

const Item: FC = () => {
  const create = async () => {
    const response = await fetch('http://localhost:3002/word', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: '123',
        words: [
          {
            word: 'awareness',
            explanation: 'n. 意识',
            phoneticNotation: '/əˈwer.nəs/',
            examples: [
              'Public awareness of the problem will make politicians take it seriously. 一旦公众意识到这个问题，政客们就会严肃对待它了。 ',
              'Environmental awareness has increased dramatically over the past decade. 在过去的10年中，环保意识明显增强。'
            ],
            pronunciationUrl: ''
          },
          {
            word: 'obsession',
            explanation: 'n. 困扰;无法摆脱的念头;念念不忘的事（或人）',
            phoneticNotation: '/əbˈseʃ.ən/',
            examples: [
              "He's always wanted to find his birth mother but recently it's become an obsession. 他一直想找到自己的生母，但最近这成了他的一块心病。"
            ],
            pronunciationUrl: ''
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Network error')
    }

    return await response.json()
  }

  const getAI = async () => {
    const response = await fetch('http://localhost:3002/chatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        words: [
          'bumpy',
          'eventful',
          'invincible',
          'win ten games in a row',
          'crisis',
          'economic crisis',
          'crisis management',
          'midlife crisis'
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Network error')
    }

    return await response.json()
  }

  return (
    <section className="w-full">
      <TextField label="Multiline" multiline rows={20} />
      <section className="mt-4 flex w-full justify-end">
        <Button variant="contained" onClick={create}>
          Create a Word List
        </Button>
        <Button variant="contained" onClick={getAI}>
          AI
        </Button>
      </section>
    </section>
  )
}

export default Item
