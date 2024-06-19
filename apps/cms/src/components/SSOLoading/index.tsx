import { FC } from 'react'
import Lottie from 'react-lottie-player'
import authLottieData from '../../assets/lotties/auth.json'

const SSOLoading: FC = () => (
  <div
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh'
    }}
  >
    <Lottie
      loop
      animationData={authLottieData}
      play
      style={{ width: 500, height: 500 }}
    />
  </div>
)

export default SSOLoading
