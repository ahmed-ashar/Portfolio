import React from "react";
import TextReveal from "../utilis/TextReveal";
import AboutData from "../data/AboutData";
import Magnet from "../utilis/Magnet";

const AboutPage = () => {
  const {
    about: aboutInfo,
    education: educationData,
    experience: experienceData,
    certificate: certificateData,
    contact: contactData,
    skills: skills,
  } = AboutData();

  return (
    <div className="h-auto text-off-white pt-15 text-off-white">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl z-55">
              {aboutInfo.heading}
            </h1>
          </TextReveal>
        </div>

        {/* About Paragraphs */}
        <div className="flex flex-col gap-3 mt-10">
          {aboutInfo.paragraphs.map((para, idx) => (
            <TextReveal delay={0.5}>
              <p key={idx} className="text-sm z-55">
                {para}
              </p>
            </TextReveal>
          ))}
          <TextReveal delay={0.2}>
            <p className="text-center text-lg font-bold mt-5 z-55">
              {aboutInfo.closing}
            </p>
          </TextReveal>
        </div>
        {/* Skills Section */}
        <div className="my-20 ">
          <TextReveal delay={0.2}>
            <h1 className="text-center mb-12 ">Skills</h1>
          </TextReveal>

          <div className="flex flex-wrap justify-center gap-1">
            {skills.map((skill, idx) => (
              // <TextReveal key={idx} delay={0.05 * idx}>

              <div className=" clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%) gray-bg px-2 py-2 rounded-md shadow-md ">
                <Magnet padding={20} disabled={false} magnetStrength={5}>
                  <h2 className="text-sm font-semibold text-center">{skill}</h2>
                </Magnet>
              </div>
              // {/* </TextReveal> */}
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="my-20">
          <TextReveal delay={0.2}>
            <h1 className="text-center mb-10">Education</h1>
          </TextReveal>
          {educationData.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5  ">
              <div className="">
                <TextReveal delay={0.2}>
                  <h1 className="text-xl sm:text-3xl orange-text-hover">{edu.title}</h1>
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
            <h1 className=" text-center mb-10">Experience</h1>
          </TextReveal>
          {experienceData.map((exp, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5  ">
              <div>
                <TextReveal delay={0.2}>
                  <h1 className="text-xl sm:text-3xl orange-text-hover">{exp.title}</h1>
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
            <h1 className=" text-center mb-10">Certificates</h1>
          </TextReveal>
          {certificateData.map((cer, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5  ">
              <div>
                <TextReveal delay={0.2}>
                  <h1 className="text-xl sm:text-3xl orange-text-hover">{cer.title}</h1>
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
            <h1 className="text-center mb-10">Contact</h1>
          </TextReveal>
          {contactData.map((con, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5  ">
              <div>
                <TextReveal delay={0.2}>
                  <a href={con.link} target="_blank" className="text-xl sm:text-3xl orange-text-hover">{con.title}</a>
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
