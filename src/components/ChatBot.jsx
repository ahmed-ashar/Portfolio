import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import CircularText from "../utilis/CircularText";
import Magnet from "../utilis/Magnet";

const ChatBot = () => {
  return (
    <div className="fixed hidden sm:block sm:bottom-5 right-5 sm:right-5 z-[999]">
      <div className="relative">
        <Magnet padding={15} disabled={false} magnetStrength={5}>
          <CircularText
            text="ITS*NOT*COMPLETED*YET*"
            onHover="speedUp"
            spinDuration={20}
            className="black-bg"
          />
          <FontAwesomeIcon
            icon={faArrowUp}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="absolute orange-bg p-2 w-5 sm:w-10 h-5 sm:h-10 rounded-full text-xl sm:text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer black-text"
          />
        </Magnet>
      </div>
    </div>
  );
};

export default ChatBot;
