import React from "react";

const AboutData = () => {
  const about = {
    heading:
      "From concept to code — I build interactive experiences that spark curiosity and delight.",
    paragraphs: [
      "Hey, I’m Muhammad Ahmed Ashar — a MERN Stack developer and graphic design enthusiast who enjoys turning ideas into clean, creative digital experiences.",
      "I studied MERN Stack development at Saylani Mass IT Training, where I built full-stack projects using MongoDB, Express, React, and Node.js. Before that, I completed a 3-year diploma in Computer Information Technology (CIT), which laid a strong foundation for my tech journey.",
      "Along the way, I also got into graphic design — creating logos, social media posts, and UI mockups helped me develop an eye for detail and aesthetics. Tools like Figma, Canva, and Adobe Illustrator are part of my creative process whenever I'm working on interfaces or personal projects.",
      "I enjoy coding with HTML, CSS, JavaScript, and building with Firebase and React. I also love exploring animation tools like GSAP and UI trends that make websites feel alive.",
      "Outside of tech, I’m a Hafiz-e-Quran, which taught me focus and consistency. In my free time, I tinker with custom keyboards, sketch ideas, or help others with design and dev projects.",
    ],
    closing: "Always building. Always designing. Always learning.",
  };

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "Firebase",
    "Figma",
    "Canva",
    "Adobe Illustrator",
    "GSAP",
    "Git",
    "GitHub",
    "Responsive Design",
    "UI/UX Design",
    "Web Development",
    "Graphic Design",
    "Problem Solving",
    "E-commerce",
    "API Integration",
    "Debugging",
    "Code Review",
    "Mobile App Development",
    "Database Management",
  ];
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
    {
      title: "Hafiz",
      destination: "Hafiz-e-Quran",
      duration: "2012 - 2016",
    },
  ];

  const experience = [
    {
      title: "Social Media Marketing Manager",
      company: "Magical Marketing Agency",
      duration: "2023 - 2024",
    },
    {
      title: "Front End Developer",
      company: "Code Alpha",
      duration: "2024 - 2025",
    },
  ];

  const certificate = [
    {
      title: "Front End Internship",
      from: "Code Alpha",
    },
    {
      title: "MERN Stack Developer",
      from: "Saylani Mass IT Training",
    },
    {
      title: "Advanced JavaScript",
      from: "Cisco",
    },
  ];

  const contact = [
    {
      title: "hafizmahmedashar@gmail.com",
      from: "Email Address",
      link: "mailto:hafizmahmedashar@gmail.com",
    },
    {
      title: "linkedin.com/in/ahmed-ashar",
      from: "Linkedin",
      link: "https://www.linkedin.com/in/ahmed-ashar/",
    },
    {
      title: "@ahm3d_ashar",
      from: "Personal Instagram",
      link: "https://www.instagram.com/ahm3d_ashar/",
    },
    {
      title: "@ahmed.ashar.58",
      from: "A very old Facebook",
      link: "https://www.facebook.com/ahmed.ashar.58",
    },
    {
      title: "Curriculum Vitae",
      from: "My cv",
      link: "#",
    },
    {
      title: "github.com/ahmed-ashar",
      from: "Where I store my Code",
      link: "https://github.com/ahmed-ashar",
    },
    {
      title: "My Resume",
      from: "PDF",
      link: "#",
    },
  ];
  return {
    about,
    education,
    experience,
    certificate,
    contact,
    skills,
  };
};

export default AboutData;
