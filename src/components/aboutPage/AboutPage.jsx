import React from "react";

const AboutPage = () => {
  return (
    <div className="h-[100vh] text-white">
      <div className="max-w-[700px] sm:max-w-[500px] md:max-w-[700px] p-5 border mx-auto ">
        <div className="">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl">
            From concept to code — I build interactive experiences that spark
            curiosity and delight.
          </h1>
        </div>

        <div className="flex flex-col gap-3 mt-5">
          <p className="text-sm">
            Hey, I’m Muhammad Ahmed Ashar — a front-end developer and graphic
            design enthusiast who enjoys turning ideas into clean, creative
            digital experiences.
          </p>
          <p className="text-sm">
            I studied MERN Stack development at Saylani Mass IT Training, where
            I built full-stack projects using MongoDB, Express, React, and
            Node.js. Before that, I completed a 3-year diploma in Computer
            Information Technology (CIT), which laid a strong foundation for my
            tech journey.
          </p>
          <p className="text-sm">
            Along the way, I also got into graphic design — creating logos,
            social media posts, and UI mockups helped me develop an eye for
            detail and aesthetics. Tools like Figma, Canva, and Adobe
            Illustrator are part of my creative process whenever I'm working on
            interfaces or personal projects.
          </p>
          <p className="text-sm">
            I enjoy coding with HTML, CSS, JavaScript, and building with
            Firebase and React. I also love exploring animation tools like GSAP
            and UI trends that make websites feel alive.
          </p>
          <p className="text-sm">
            Outside of tech, I’m a Hafiz-e-Quran, which taught me focus and
            consistency. In my free time, I tinker with custom keyboards, sketch
            ideas, or help others with design and dev projects.
          </p>
          <p className="text-center text-lg font-bold mt-5">
            Always building. Always designing. Always learning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
