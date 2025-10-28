import { Workflow, Wrench, Database, Github } from "lucide-react";
import { motion } from "framer-motion";
import { fluidFont } from "../utils/fontSize";



const textItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 0.8, duration: 0.5 } },
};

export default function SupplyChainSection(){
  const features = [
    {
      title: "Tailored to your workflow",
      desc:
        "We have designed Jani to fit perfectly with your workflow so you can easily integrate it within your organization.",
      Icon: Workflow,
    },
    {
      title: "Custom Made",
      desc: "Request custom features that are unique to your business and workflow.",
      Icon: Wrench,
    },
    {
      title: "Own Your Data",
      desc:
        "With Jani you can choose to self-host your data, as the platform is open source.",
      Icon: Database,
    },
    {
      title: "Open Sourced",
      desc:
        "Jani AI is open source, allowing anyone to contribute to the software and also self-host.",
      Icon: Github,
    },
  ];

  return (
    <section
      className="relative flex flex-col items-center justify-center p-4 px-24 lg:h-screen w-full h-full text-[#0e2e20]"
    >
      <div className="w-full h-full flex flex-col justify-end p-2 pt-6 z-40">
        {/* Section Heading */}
        <motion.div
          variants={textItem}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="w-full h-60 flex flex-col justify-center items-center text-center"
        >
          <p
            className="custom-font font-bold lg:px-4 pt-8"
            style={fluidFont("2.5rem", "3vw", "5rem")}
          >
            Giving observability from farm to fork.
          </p>

          <p
            className="custom-font mt-6 mx-auto max-w-3xl"
            style={fluidFont("0.8rem", "1vw", "1.55rem")}
          >
            Map out your supply chain and see where you can optimize, provide
            your clients with transparency and traceability of your resources.
          </p>
        </motion.div>

        <div className="w-full lg:h-160 flex lg:flex-row flex-col justify-between">
          {/* Left: Map / Illustration */}
          <div className="w-1/3 h-full p-5">
            <motion.div
              variants={textItem}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="relative rounded-2xl border-2 bg-white border-[#8b4513] lg:p-6 p-4 flex items-center justify-center  min-h-[320px] h-full"
            >
              <div className="text-center">
                <p className="custom-font uppercase tracking-wide font-semibold"
                  style={fluidFont("1.2rem", "1.8vw", "1.4rem")}
                >
                  Supply Chain Map
                </p>
                <p className="mt-2 custom-font font-light"
                  style={fluidFont("0.8rem", "0.9vw", "1.4rem")}
                >
                  Drop in your map, flow diagram, or live metrics component here
                  to visualize every step from farm to fork.
                </p>
                <div className="mt-6 lg:min-h-40 lg:h-80 h-40 rounded-xl border border-dashed border-[#8b4513] hover:bg-[#8b4513] transition duration-300 hover:text-white text-[#1d2e28] ">
                  <div className="flex flex-col items-center justify-center h-full">
                    <label
                      htmlFor="file"
                      className="h-full w-full cursor-pointer lg:text-xl text-center font-light flex flex-col items-center justify-center"
                    >
                      [Map/Diagram Placeholder]
                    </label>
                    <input type="file" id="file" className="hidden" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Features */}
          <motion.div
            variants={textItem}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="lg:w-160 h-full flex flex-col justify-between space-y-6 p-5"
          >
            {features.map(({ title, desc, Icon }) => (
              <div
                key={title}
                className="rounded-2xl border-2 bg-white border-[#8b4513] hover:bg-[#8b4513] transition group hover:text-white text-[#1d2e28] flex items-center p-5"
              >
                <motion.div
                  variants={textItem}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="flex items-center justify-center gap-3"
                >
                  <div className="rounded-xl border-2 border-[#8b4513] group-hover:border-white p-2">
                    <Icon
                      className="h-6 w-6 text-[#8b4513] group-hover:text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3
                      className="custom-font font-semibold"
                      style={fluidFont("0.8rem", "1vw", "1.2rem")}
                    >
                      {title}
                    </h3>
                    <p
                      className="custom-font font-light mt-2"
                      style={fluidFont("0.6rem", "0.8vw", "1.2rem")}
                    >
                      {desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
