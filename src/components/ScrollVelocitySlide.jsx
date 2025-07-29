import React from 'react'
import ScrollVelocity from '../utilis/ScrollVelocity'

const ScrollVelocitySlide = () => {
  return (
    <div className='bg-off-white'>
        
<ScrollVelocity
  texts={['Html Css JavaScript ReactJS NextJS TailwindCss BootStrap', 'NodeJs ExpressJS MongoDB Firebase']} 
  velocity={190} 
  className="custom-scroll-text"
/>
    </div>
  )
}

export default ScrollVelocitySlide
