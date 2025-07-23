import React from 'react'
import Magnet from '../../utilis/magnet/Magnet'
import ScrollReveal from '../../utilis/scrollReveal/ScrollReveal'

const QuoteSection = () => {
  return (
     <div className="h-auto relative pt-40 sm:pt-60 pb-40 w-full flex justify-center items-center text-[#b7ab98]">
          <div className="w-full flex flex-col justify-center items-center relative px-4">
            {/* Background Text with responsive font size */}
            {/* Background Text */}
   <div className="sticky top-50 sm:top-30 w-full text-center font-extrabold text-[#2C2C2C] opacity-30 leading-none">
  <h1 className="text-[20vw] sm:text-[22vw]">QUOTES</h1>
</div>
    
    
            {/* Foreground Text */}


            <div className="text-center text-9xl   z-10">
                <h1><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="text-6xl md:text-9xl text-primary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
{/* <path fill="none" d="M0 0h24v24H0z"></path> */}
<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
</svg></h1>
            </div>
            <div className="w-full md:w-[70%] p-4 text-center z-10 ">
              <Magnet padding={5} disabled={false} magnetStrength={90}>
                <ScrollReveal
                  baseOpacity={1}
                  enableBlur={true}
                  baseRotation={0}
                  blurStrength={10}
                >
                  Scared AI might take my job. Also scared it won’t finish my code in time.
                </ScrollReveal>
              </Magnet>
            </div>
          <div className="text-center mt-10">
            <h1>Said by me… or someone else?</h1>
          </div>
          </div>
        </div>
  )
}

export default QuoteSection
 