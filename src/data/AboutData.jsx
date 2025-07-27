import React from 'react'

const AboutData = () => {
  const about = {
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

const education = [
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

const experience = [
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

const certificate = [
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

const contact = [
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
    return {
        about,
        education,
        experience,
        certificate,
        contact,
    };
}

export default AboutData
