import { useContent } from "../context/ContentContext";
import Magnet from "../utilis/Magnet";
import ScrollReveal from "../utilis/ScrollReveal";
import TextReveal from "../utilis/TextReveal";

const QuoteSection = () => {
  const section = useContent().home.approach;
  return (
    <section
      aria-labelledby="approach-heading"
      className="relative py-16 sm:py-24 w-full flex justify-center items-center text-off-white"
    >
      <div className="w-full flex flex-col justify-center items-center relative px-4">
        <div className="sticky top-50 sm:top-30 w-full text-center font-extrabold opacity-30 leading-none gray-text">
          <TextReveal delay={1}>
            <h2 id="approach-heading" className="text-[14vw] sm:text-[15vw]">
              {section.heading}
            </h2>
          </TextReveal>
        </div>

        <div className="text-center text-9xl  z-55 ">
          <svg
            aria-hidden="true"
            focusable="false"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="text-6xl md:text-9xl text-primary"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
          </svg>
        </div>
        <blockquote className="w-full md:w-[70%] p-4 text-center z-55 ">
          <Magnet padding={5} disabled={false} magnetStrength={90}>
            <ScrollReveal
              baseOpacity={1}
              enableBlur={true}
              baseRotation={0}
              blurStrength={10}
            >
              {section.body}
            </ScrollReveal>
          </Magnet>
        </blockquote>
        <div className="text-center mt-10 z-55">
          <p>{section.caption}</p>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
