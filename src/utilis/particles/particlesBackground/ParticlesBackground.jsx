import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import WAVES from 'vanta/dist/vanta.waves.min'
import './ParticlesBackground.css'

const ParticlesBackground = () => {
    const vantaRef = useRef(null)

    useEffect(() => {
        const vantaEffect = WAVES({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            // minHeight: 500,
            // minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x141414,
            waveHeight: 18.00,
            zoom: 0.85
        })

        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [])

    return (
        <main>
            <div className='background' ref={vantaRef}></div>
            <div className='title'>ParticlesBackground</div>
        </main>
    )
}

export default ParticlesBackground