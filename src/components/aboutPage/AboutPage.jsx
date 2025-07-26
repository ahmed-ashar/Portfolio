import React from "react";
import TextReveal from "../../utilis/textReveal/TextReveal";

const aboutInfo = {
  heading:
    "From concept to code — I build interactive experiences that spark curiosity and delight.",
  paragraphs: [
    "Hey, I’m Muhammad Ahmed Ashar — a front-end developer and graphic design enthusiast who enjoys turning ideas into clean, creative digital experiences.",
    "I studied MERN Stack development at Saylani Mass IT Training, where I built full-stack projects using MongoDB, Express, React, and Node.js. Before that, I completed a 3-year diploma in Computer Information Technology (CIT), which laid a strong foundation for my tech journey.",
    "Along the way, I also got into graphic design — creating logos, social media posts, and UI mockups helped me develop an eye for detail and aesthetics. Tools like Figma, Canva, and Adobe Illustrator are part of my creative process whenever I'm working on interfaces or personal projects.",
    "I enjoy coding with HTML, CSS, JavaScript, and building with Firebase and React. I also love exploring animation tools like GSAP and UI trends that make websites feel alive.",
    "Outside of tech, I’m a Hafiz-e-Quran, which taught me focus and consistency. In my free time, I tinker with custom keyboards, sketch ideas, or help others with design and dev projects.",
  ],
  closing: "Always building. Always designing. Always learning.",
};

const educationData = [
  {
    title: "Ummul Qura Secondary School",
    destination: "School",
    duration: "2016 - 2022",
  },
  {
    title: "Saylani Mass IT Training",
    destination: "Institute",
    duration: "2024 - 2025",
  },
  {
    title: "Computer Information Technology (CIT)",
    destination: "Diploma / Inter",
    duration: "2022 - 2025",
  },
];

const experienceData = [
  {
    title: "Social Media Marketing Manager",
    company: "Magical Marketing Agency",
    duration: "2016 - 2022",
  },
  {
    title: "Saylani Mass IT Training - Institute",
    duration: "2024 - 2025",
  },
  {
    title: "Computer Information Technology (CIT) - Diploma/Inter",
    duration: "2022 - 2025",
  },
];

const certificateData = [
  {
    title: "Social Media Marketing Manager",
    from: "Ummul Qura Secondary School",
  },
  {
    title: "Saylani Mass IT Training - Institute",
    from: "Saylani Mass IT Training",
  },
  {
    title: "Computer Information Technology (CIT) - Diploma/Inter",
    from: "Saylani Mass IT Training",
  },
];

const contactData = [
  {
    title: "Social Media Marketing Manager",
    from: "Ummul Qura Secondary School",
  },
  {
    title: "Saylani Mass IT Training - Institute",
    from: "Saylani Mass IT Training",
  },
  {
    title: "Computer Information Technology (CIT) - Diploma/Inter",
    from: "Saylani Mass IT Training",
  },
];
const AboutPage = () => {
  return (
    <div className="h-auto text-[#b7ab98]">
      <div className="max-w-[700px] sm:max-w-[500px] md:max-w-[700px] p-5 mx-auto">
        {/* Image */}
        <div className="rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] mx-auto my-20">
          <img
            src="https://avatars.githubusercontent.com/u/155929233?v=4"
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        {/* Heading */}
        <div className="">
          <TextReveal delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl">
              {aboutInfo.heading}
            </h1>
          </TextReveal>
        </div>

        {/* About Paragraphs */}
        <div className="flex flex-col gap-3 mt-10">
          {aboutInfo.paragraphs.map((para, idx) => (
            <TextReveal delay={0.5}>
              <p key={idx} className="text-sm">
                {para}
              </p>
            </TextReveal>
          ))}
          <TextReveal delay={0.2}>
            <p className="text-center text-lg font-bold mt-5">
              {aboutInfo.closing}
            </p>
          </TextReveal>
        </div>

        {/* Education Section */}
        <div className="my-20">
          <TextReveal delay={0.2}>
            <h1 className="mb-10">Education</h1>
          </TextReveal>
          {educationData.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-center mb-5">
              <div className="">
                <TextReveal delay={0.2}>
                  <h1 className="text-3xl">{edu.title}</h1>
                </TextReveal>
                <TextReveal delay={0.2}>
                  <p className="text-sm">{edu.destination}</p>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm  w-[20%] text-end">{edu.duration}</p>
              </TextReveal>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className="my-20">
          <TextReveal delay={0.2}>
            <h1 className="mb-10">Experience</h1>
          </TextReveal>
          {experienceData.map((exp, idx) => (
            <div key={idx} className="flex justify-between items-center mb-5">
              <div>
                <TextReveal delay={0.2}>
                  <h1 className="text-3xl">{exp.title}</h1>
                </TextReveal>
                <TextReveal delay={0.2}>
                  <p className="text-sm">{exp.company}</p>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm w-[20%] text-end">{exp.duration}</p>
              </TextReveal>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className="my-20">
          <TextReveal delay={0.2}>
            <h1 className="mb-10">Certificates</h1>
          </TextReveal>
          {certificateData.map((cer, idx) => (
            <div key={idx} className="flex justify-between items-center mb-5">
              <div>
                <TextReveal delay={0.2}>
                  <h1 className="text-3xl ">{cer.title}</h1>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm w-[20%] text-end">{cer.from}</p>
              </TextReveal>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="my-20 mb-50">
          <TextReveal delay={0.2}>
            <h1 className="mb-10">Contact</h1>
          </TextReveal>
          {contactData.map((con, idx) => (
            <div key={idx} className="flex justify-between items-center mb-5">
              <div>
                <TextReveal delay={0.2}>
                  <h1 className="text-3xl ">{con.title}</h1>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm w-[20%] text-end">{con.from}</p>
              </TextReveal>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
