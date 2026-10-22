import TextReveal from "../utilis/TextReveal";
import { useContent } from "../context/ContentContext";
import Magnet from "../utilis/Magnet";

const AboutPage = () => {
  const content = useContent().about;
  const {
    about: aboutInfo,
    education: educationData,
    experience: experienceData,
    certificate: certificateData,
    contact: contactData,
    skills,
  } = content;

  const renderSections = {
skills: (<section aria-labelledby="skills-heading" className="my-20 ">
          <TextReveal delay={0.2}>
            <h2 id="skills-heading" className="text-center mb-12 ">
              {content.sections.skills.heading}
            </h2>
          </TextReveal>

          <ul role="list" className="flex flex-wrap justify-center gap-1">
            {skills.map((skill) => (
              <li key={skill} className="gray-bg px-4 py-2 rounded-md shadow-md">
                <Magnet padding={20} disabled={false} magnetStrength={5}>
                  <span className="block text-sm font-semibold text-center">
                    {skill}
                  </span>
                </Magnet>
              </li>
            ))}
          </ul>
        </section>),
education: (<section aria-labelledby="education-heading" className="my-20 z-55 relative">
          <TextReveal delay={0.2}>
            <h2 id="education-heading" className="text-center mb-10">
              {content.sections.education.heading}
            </h2>
          </TextReveal>
          {educationData.map((edu) => (
            <div key={edu.title} className="flex justify-between items-center gap-4 p-2.5  ">
              <div className="min-w-0">
                <TextReveal delay={0.2}>
                  <h3 className="text-xl sm:text-3xl orange-text-hover">
                    {edu.title}
                  </h3>
                </TextReveal>
                <TextReveal delay={0.2}>
                  <p className="text-sm">{edu.destination}</p>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm shrink-0 text-end">{edu.duration}</p>
              </TextReveal>
            </div>
          ))}
        </section>),
experience: (<section aria-labelledby="experience-heading" className="my-20 z-55 relative">
          <TextReveal delay={0.2}>
            <h2 id="experience-heading" className=" text-center mb-10">
              {content.sections.experience.heading}
            </h2>
          </TextReveal>
          {experienceData.map((exp) => (
            <div key={exp.title} className="flex justify-between items-center gap-4 p-2.5  ">
              <div className="min-w-0">
                <TextReveal delay={0.2}>
                  <h3 className="text-xl sm:text-3xl orange-text-hover">
                    {exp.title}
                  </h3>
                </TextReveal>
                <TextReveal delay={0.2}>
                  <p className="text-sm">{exp.company}</p>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm shrink-0 text-end">{exp.duration}</p>
              </TextReveal>
            </div>
          ))}
        </section>),
certificate: (<section aria-labelledby="certificates-heading" className="my-20 z-55 relative">
          <TextReveal delay={0.2}>
            <h2 id="certificates-heading" className=" text-center mb-10">
              {content.sections.certificate.heading}
            </h2>
          </TextReveal>
          {certificateData.map((cer) => (
            <div key={cer.title} className="flex justify-between items-center gap-4 p-2.5  ">
              <div className="min-w-0">
                <TextReveal delay={0.2}>
                  <h3 className="text-xl sm:text-3xl orange-text-hover">
                    {cer.title}
                  </h3>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm shrink-0 text-end">{cer.from}</p>
              </TextReveal>
            </div>
          ))}
        </section>),
contact: (<section aria-labelledby="contact-heading" className="my-20 mb-50 z-55 relative">
          <TextReveal delay={0.2}>
            <h2 id="contact-heading" className="text-center mb-10">
              {content.sections.contact.heading}
            </h2>
          </TextReveal>
          {contactData.map((con) => (
            <div
              key={con.title}
              className="flex justify-start sm:justify-between items-start sm:items-center flex-col sm:flex-row gap-1 sm:gap-4 p-2.5  "
            >
              <div className="min-w-0">
                <TextReveal delay={0.2}>
                  <a
                    href={con.link}
                    {...(con.link.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-block py-1 text-xl sm:text-3xl orange-text-hover break-words"
                  >
                    {con.title}
                  </a>
                </TextReveal>
              </div>
              <TextReveal delay={0.2}>
                <p className="text-sm shrink-0 sm:text-end">{con.from}</p>
              </TextReveal>
            </div>
          ))}
        </section>)
  };

  return (
    <main id="main-content" className="h-auto pt-15 text-off-white">
      <div className="max-w-[700px] sm:max-w-[500px] md:max-w-[700px] p-5 mx-auto">
        {/* Image */}
        {content.showProfile && <div className="rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] mx-auto my-20">
          <img
            src={content.profile}
            alt={content.profileAlt}
            width="400"
            height="400"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        }
        {/* Heading */}
        <div>
          <TextReveal delay={0.2}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl z-55">
              {aboutInfo.heading}
            </h1>
          </TextReveal>
        </div>

        {/* About Paragraphs */}
        <div className="flex flex-col gap-3 mt-10">
          {aboutInfo.paragraphs.map((para) => (
            <TextReveal key={para} delay={0.5}>
              <p className="text-sm z-55">{para}</p>
            </TextReveal>
          ))}
          <TextReveal delay={0.2}>
            <p className="text-center text-lg font-bold mt-5 z-55">
              {aboutInfo.closing}
            </p>
          </TextReveal>
        </div>

        {content.order.map(key => content.sections[key].enabled ? <div key={key}>{renderSections[key]}</div> : null)}
      </div>
    </main>
  );
};

export default AboutPage;
