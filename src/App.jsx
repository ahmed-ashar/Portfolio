import React from 'react'
import Navbar from './components/navbar/Navbar'
import ParticlesBackground from './utilis/particles/particlesBackground/ParticlesBackground'
import DotGrid from './utilis/dotGrid/DotGrid'

const App = () => {
  return (
    <div>
      <div style={{ position: 'relative', backgroundColor: '#060010' }}>
        <DotGrid
          dotSize={2}
          gap={10}
          baseColor="#0F0F0F"
          activeColor="#FDA612"
          proximity={240}
          shockRadius={500}
          shockStrength={20}
          resistance={100}
          returnDuration={5}
        />
        <Navbar />
      </div>
    </div>
  )
}

export default App