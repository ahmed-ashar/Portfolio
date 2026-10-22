import { useContent } from "../context/ContentContext";
import Magnet from "../utilis/Magnet";
import DotGrid from "../utilis/DotGrid";
import TextReveal from "../utilis/TextReveal";

const Hero = () => {
  const { hero } = useContent().home;
  const longest = Math.max(...hero.lines.map(line=>line.length));
  return (
    <div className="pt-23 min-h-screen relative">
      {hero.showDots && <DotGrid />}

      <div className="absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-55">
        <Magnet padding={5} disabled={false} magnetStrength={90}>
          <TextReveal delay={0.5}>
            <h1 style={longest>18 ? {fontSize:`clamp(1rem, ${135/longest}vw, 8rem)`} : undefined} className="text-[clamp(2.25rem,11vw,3rem)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[8rem] text-off-white font-extrabold leading-[0.8] tracking-tighter whitespace-nowrap ">
              {hero.lines.map((line,index)=>(
                <span key={index} className={`block ${index === hero.accentLine - 1 ? 'orange-text' : ''}`}>{index === 3 && line.includes(' ') ? <><span className="orange-text">{line.split(' ')[0]}</span>{line.slice(line.indexOf(' '))}</> : line}{index===2 && <span aria-hidden="true" className="inline-block w-[1em] h-[0.1em] orange-bg ml-[0.16em] mb-[0.2em]" />}</span>
              ))}
            </h1>
          </TextReveal>
        </Magnet>
      </div>
    </div>
  );
};

export default Hero;
