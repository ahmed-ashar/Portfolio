import ScrambleText from '../../utilis/gsap/scrambleText/ScrambleText';
import ParticlesBackground from '../../utilis/particles/particlesBackground/ParticlesBackground';

const Navbar = ({ navbarText, particlesBackground }) => {
  const texts = [
    "Designing with sunlight energy — fresh & clean.",
    "Ideas strike while airbrushing or wandering.",
    "Indie games? My digital comfort zone.",
    "iPad notes = doodles + random poems.",
    "Pull-ups? Still in peaceful protest.",
    "Learn. Create. Share. Repeat.",
    "Got ideas? Let’s talk over email."
  ];


  return (
    <div style={{ position: 'absolute', top: 0, left: 0, color: 'white' }}>
      <h1>Hi</h1>
      <div style={{ width: '300px', border: '1px', marginLeft: "3rem" }}>
        <ScrambleText navbarText={navbarText} texts={texts} />
      </div>
    </div>
  );
}

export default Navbar