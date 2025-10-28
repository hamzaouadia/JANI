"use client";

import { motion } from "framer-motion";
import Button from "./Button";
import { fluidFont } from "../utils/fontSize";

const textItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 0.8, duration: 0.5 } },
};

const BusinessSection = () => {
  return (
    <section className="snap-start relative flex flex-col items-center justify-center p-4 h-screen lg:w-screen w-full bg-[#cd853f] text-white z-10">
      <div className="lg:w-screen h-full text-center flex flex-row lg:justify-start justify-center lg:p-2">
        <div className="lg:w-1/2 h-full flex flex-col justify-center items-center lg:p-20 p-4">
          {/* Title */}
          <motion.div
            variants={textItem}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex justify-center items-center py-4"
            >
            <p
              className="custom-font font-semibold"
              style={fluidFont("2rem", "4vw", "6rem")}
              >
              Manage your Agribusiness the Smart Way.
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            variants={textItem}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex flex-col justify-center items-center py-2"
          >
            <p
              className="custom-font p-1"
              style={fluidFont("0.8rem", "1vw", "2rem")}
            >
              {`Recording your company data in an Excel sheet doesn't scale well enough and soon you will have Excel sheets that are hard to keep track of.`}
            </p>

            <p
              className="custom-font p-1"
              style={fluidFont("0.8rem", "1vw", "2rem")}
            >
              At JANI, we cover that for you and you can focus on the core
              operations of your business to increase revenue and growth.
            </p>
          </motion.div>

          <motion.div
            variants={textItem}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="flex space-x-4 mt-4 px-4 text-lg font-semibold text-white">
            <Button text="Register" textColor="white" textHover="#8b4513" border="white" background="#cd853f" backgroundHover="white" />
              <Button text="Login" textColor="white" textHover="#8b4513" border="white" background="#cd853f" backgroundHover="white" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
