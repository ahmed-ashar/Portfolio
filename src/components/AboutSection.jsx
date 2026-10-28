import { useContent } from "../context/ContentContext";
import Magnet from "../utilis/Magnet";
import Button from "./Button";
import ScrollReveal from "../utilis/ScrollReveal";
import TextReveal from "../utilis/TextReveal";

const AboutSection = () => {
  const section = useContent().home.intro;
  return (
    <section
      aria-labelledby="about-heading"
      className="relative py-16 sm:py-24 w-full flex justify-center items-center text-off-white"
    >
      <div className="w-full flex flex-col justify-center items-center relative px-4">
        <div className="sticky top-50 sm:top-30 left-0 w-full text-center gray-text font-extrabold opacity-30 leading-none">
          <TextReveal delay={1}>
            <h2 id="about-heading" className="text-[14vw] sm:text-[15vw] ">
              {section.heading}
            </h2>
          </TextReveal>
        </div>

        <div className="w-full md:w-[70%] p-4 text-center z-55 ">
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
        </div>
        <div className="text-center ml-3 mt-10 z-55">
          <Magnet padding={10} disabled={false} magnetStrength={20}>
            <Button to={section.buttonLink}>{section.buttonText}</Button>
          </Magnet>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
