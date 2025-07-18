import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import CircularText from "../../utilis/circularText/CircularText";
import Magnet from "../../utilis/magnet/Magnet";

const ChatBot = () => {
  return (
    <div className="fixed bottom-10 right-10 z-[999]">
      <div className="relative">
        <Magnet padding={15} disabled={false} magnetStrength={5}>
          <CircularText
            text="ITS*NOT*COMPLETED*YET*"
            onHover="speedUp"
            spinDuration={20}
            className=""
          />
          <FontAwesomeIcon
            icon={faArrowUp}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="absolute bg-[#fd8b09] p-2 w-10 h-10 rounded-full text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-[#b7ab98]"
          />
        </Magnet>
      </div>
    </div>
  );
};

export default ChatBot;
