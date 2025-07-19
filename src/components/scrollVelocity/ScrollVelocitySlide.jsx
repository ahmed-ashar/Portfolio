import React from 'react'
import ScrollVelocity from '../../utilis/scrollVelocity/ScrollVelocity'

const ScrollVelocitySlide = () => {
  return (
    <div className='bg-[#b7ab98]'>
        
<ScrollVelocity
  texts={['Scroll UP', 'Scroll Down']} 
  velocity={190} 
  className="custom-scroll-text"
/>
    </div>
  )
}

export default ScrollVelocitySlide
