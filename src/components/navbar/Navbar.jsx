import ScrambleText from '../../utilis/gsap/scrambleText/ScrambleText';

const Navbar = ({ navbarText }) => {
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
    <div style={{ padding: '0.5rem', width: '100%', backgroundColor: 'pink', display: 'flex', justifyContent: 'flex-start' }}>
      <h1>Hi</h1>
      <div style={{ width: '300px', border: '1px', marginLeft: "3rem" }}>
        <ScrambleText navbarText={navbarText} texts={texts} />
      </div>
    </div>
  );
}

export default Navbar