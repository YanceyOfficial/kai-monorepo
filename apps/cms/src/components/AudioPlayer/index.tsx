import { FC, useEffect, useRef, useState } from 'react'
import Lottie from 'react-lottie-player'
import audioLottieData from '../../assets/lotties/audio.json'

interface Props {
  audioUrl: string
}

const AudioPlayer: FC<Props> = ({ audioUrl }) => {
  const [play, setPlay] = useState(false)
  const [canPlay, setCanPlay] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playAudio = () => {
    if (audioRef.current && canPlay) {
      setPlay(true)
      audioRef.current.play()
    }
  }

  const handleCanPlay = () => {
    setCanPlay(true)
  }

  const handleEnded = () => {
    setPlay(false)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('canplay', handleCanPlay)
    }
  }, [])

  return (
    <div className="cursor-pointer">
      <Lottie
        loop
        animationData={audioLottieData}
        play={play}
        goTo={!play ? 0 : undefined}
        style={{ width: 32, height: 32 }}
        onClick={playAudio}
      />
      <audio src={audioUrl} ref={audioRef} className="disabled" />
    </div>
  )
}

export default AudioPlayer
