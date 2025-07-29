import React from "react";
import ScrambleText from "../utilis/gsap/scrambleText/ScrambleText";

const RandomText = () => {
  const texts = [
    "Designing with sunlight energy — fresh & clean.",
    "Ideas strike while airbrushing or wandering.",
    "Indie games? My digital comfort zone.",
    "iPad notes = doodles + random poems.",
    "Pull-ups? Still in peaceful protest.",
    "Learn. Create. Share. Repeat.",
    "Got ideas? Let’s talk over email.",
  ];
  return (
    <div
      className=" p-4 h-60 w-16 fixed bottom-10 "
      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
    >
      <ScrambleText texts={texts} />
    </div>
  );
};

export default RandomText;
