import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltedCard from "../utilis/TiltedCard";
import Button from "./Button";
import TextReveal from "../utilis/TextReveal";
import { useContent } from "../context/ContentContext";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const ProjectSection = () => {
  const content = useContent();
  const section = content.home.featured;
  const data = content.portfolio.projects.filter(p=>p.visible && p.featured).slice(0, section.count);
  const sectionRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray(".card", sectionRef.current);
    const tweens = cards.map((card) =>
      gsap.to(card, {
        scale: 0.8,
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: "top -30%",
          end: "bottom -20%",
          scrub: true,
        },
      })
    );

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <section aria-labelledby="projects-heading" className="relative " ref={sectionRef}>
      <div className="sticky top-50 sm:top-30 left-0 w-full text-center font-extrabold opacity-30 leading-none gray-text">
        <TextReveal delay={1}>
          <h2 id="projects-heading" className="text-[15vw] sm:text-[16vw]">
            {section.heading}
          </h2>
        </TextReveal>
      </div>

      <ul role="list" className="w-full py-10 flex flex-col items-center gap-70 list-none">
        {data.map((item) => (
          <li
            key={item.title}
            className="card group sticky top-[17vh] sm:top-[18vh] w-[85%] sm:w-[70%] h-[65vh] flex flex-col items-center gap-5 rounded-lg"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.title}: ${item.para} (opens in a new tab)`}
              className="w-full h-full"
            >
              <TiltedCard
                imageSrc={item.image}
                altText={item.alt}
                imageIntrinsicWidth={item.width}
                imageIntrinsicHeight={item.height}
                captionText={item.caption}
                overlayContent={<ProjectCard project={item} />}
              />
            </a>
          </li>
        ))}
      </ul>

      <div className="text-center ml-3 mt-10 relative z-55">
        <Button text={section.buttonText} to={section.buttonLink} />
      </div>
    </section>
  );
};

export default ProjectSection;
