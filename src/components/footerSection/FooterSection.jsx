import React from "react";
import TextReveal from "../../utilis/textReveal/TextReveal";
import Button from "../button/Button";

const FooterSection = () => {
  return (
    <div className="h-[80vh] sm:h-[85vh] w-full overflow-hidden text-[#b7ab98] relative">
      <div className="w-[80vw] mt-5 sm:mt-10 mx-auto flex flex-col sm:flex-row justify-between items-start  gap-10">
        <div className="">
          <div className="">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold   ">
              Ready to start a conversation? <br /> Drop your thoughts,
              questions, <br />
              or ideas — I’m always <br />
              open to connect.
            </h1>
          </div>
          <div className="flex flex-col mt-1 sm:mt-5 gap-1 sm:gap-2 ">
            <p className="text-xs md:text-sm">CONTACT</p>
            <p className="text-sm md:text-2xl font-bold">
              hafizmahmedashar@gmail.com
            </p>
            <p className="text-xs md:text-sm">
              Sector 11-C/1 North Karachi, <br /> Karachi, Pakistan
            </p>
          </div>
        </div>

        <div className=" sm:text-end ">
          <p className="text-xs sm:text-sm">LINKS</p>
          <div className="text-sm sm:text-xl  sm:mt-2 text-end flex flex-wrap sm:flex-col gap-1 font-bold">
            <p>Instagram</p>
            <p>Facebook</p>
            <p>LinkedIn</p>
            <p>GitHub</p>
            <p>Whatsapp</p>
            <p>Resume</p>
            <p>Read.cv</p>
          </div>
        </div>
      </div>

      <div className=" absolute  bottom-0 w-full text-center font-extrabold opacity-10 text-[#b7ab98] leading-none">
        {/* <TextReveal delay={1}> */}
        <h1 className="text-[20vw]   ">CONTACT</h1>
        {/* </TextReveal> */}
      </div>
    </div>
  );
};

export default FooterSection;

{
  /*  */
}
{
  /* <div className="w-[82vw] h-[32%] border mx-auto  flex justify-between items-end gap-5 ">
<div className="flex   justify-between  items-end ">
<div className=" flex flex-col ">
  <h1>Resume</h1>
  <h1>Read.cv</h1>
  <h1>Linkedin</h1>
</div>
<div className=" flex flex-col ">
<h1>Instagram</h1>
<h1>Facebook</h1>
</div>
<div className=" flex flex-col ">
  <Button text={"Whatsapp"} />
  <Button text={"Github"} />
</div>
</div>
<div className="border text-end">
  <h1>Email</h1>
  <p>hafizmahmedashar@gmail.com</p>
</div>
</div> */
}
