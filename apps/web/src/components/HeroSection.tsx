import Button from "./Button";
import { fluidFont } from "../utils/fontSize";
import { motion } from "framer-motion";

import ScrollIndicator from "./ScrollIndicator";

const textItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 0.8, duration: 0.5 } },
};

const HeroSection = () => {
  
  return (
    <section
      className="relative flex flex-col items-center justify-center p-4 lg:px-20 h-screen w-full text-[#1d2e28]"
    >
      <div className="w-full h-full flex flex-row lg:p-2">
        <div className="flex flex-col justify-center lg:items-start items-center h-full w-full lg:p-8 space-y-2 overflow-hidden">
          <motion.div
            variants={textItem}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col lg:items-start items-center"
          >
            {/* Responsive font size using clamp() */}
            <p
              className=" custom-font font-normal px-4 py-2"
              style={fluidFont("1.25rem", "2vw", "2.5rem")}

            >
              Helping Exporters
            </p>

            <p
              className=" custom-font font-bold lg:text-start text-center px-4 py-2"
              style={fluidFont("4rem", "6vw", "8rem")}
            >
              Track Resources
            </p>

            <p
              className=" custom-font font-light px-4 py-2"
              style={fluidFont("1.75rem", "3vw", "3.5rem")}
            >
              Across The Supply Chain.
            </p>
            <p
              className="custom-font font-light px-4 py-2 lg:text-start text-center"
              style={fluidFont("0.8rem", "0.8vw", "1.5rem")}
            >
              JANI AI Tracks your resources from the farm up to the fork. 
              Give your clients more observability and traceability to increase trust and transparency.
            </p>
          </motion.div>

          <motion.div
            variants={textItem}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex space-x-4 mt-4 px-4 text-lg font-semibold">
            <Button text="Get Started" border="#77af9c" background="#77af9c" />
            <Button text="Contact Sales" border="#77af9c" background="#77af9c" />
          </motion.div>
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
