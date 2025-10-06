"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState("");

    const menuItems = ["Home", "About", "Blog", "Pricing", "Features"];

    useEffect(() => {
        setActive("");
        setTimeout(() => {
            setActive("Home");
        }, 500);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full flex px-6 lg:px-8 pt-6 text-[#0e2e20] z-300">
                <nav className="flex flex-row items-center justify-between w-full">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="px-1 rounded-full border-2 border-[#77af9c] flex flex-row items-center justify-center h-full"
                    >
                        <div className="flex items-center p-4 px-6 text-black bg-white/50 backdrop-blur-md border border-white/20 shadow-lg rounded-full font-bold">
                            <h1 className="text-xl whitespace-nowrap">JANI</h1>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-full border-2 border-[#77af9c] flex-row items-center p-1 justify-center h-full hidden lg:flex">
                        <div className="flex flex-row justify-center items-center gap-2 text-lg h-full p-1 bg-white/50 backdrop-blur-md border border-white/20 shadow-lg rounded-full">
                            {menuItems.map((item) => (
                                <button
                                    onClick={() => setActive(item)}
                                    key={item}
                                    className={`flex items-center justify-center px-8 py-3 rounded-full cursor-pointer transition duration-300 ${
                                    active === item
                                        ? "bg-[#77af9c] text-white shadow-md"
                                        : "hover:bg-[#77af9c]/20"
                                    }`}
                                >
                                    <a href="#" title={item}>
                                        <p>{item}</p>
                                    </a>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                    
                    <motion.button
                        className={`flex items-center justify-center z-100 rounded-full border-2 h-[60px] w-[60px] lg:hidden
                            ${isOpen ? "border-white" : "border-[#77af9c]"}`}
                        onClick={() => {setIsOpen(!isOpen)}}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div
                            className="rounded-full flex flex-col items-center justify-center w-full h-full"
                        >
                            <div
                                className="h-full w-full flex flex-col justify-center items-center gap-2">
                                <motion.div
                                    initial={false}
                                    animate={isOpen ? { rotate: 45, y: 5, background: "white" } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-[25px] h-[2px] bg-black rounded-full"
                                />
                                <motion.div
                                    initial={false}
                                    animate={isOpen ? { rotate: -45, y: -5, background: "white" } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-[25px] h-[2px] bg-black rounded-full"
                                />
                            </div>
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: "100%" }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: "100%" }}
                                transition={{ duration: 0.4 }}
                                className="absolute px-8 text-white top-0 right-0 w-full h-screen bg-green-950/80 backdrop-blur flex flex-col items-start justify-center space-y-8 transition duration-300 z-50 md:hidden"
                            >
                                {menuItems.map((item, index) => (
                                    <motion.a
                                        key={item}
                                        href="#"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`text-2xl cursor-pointer ${
                                            active === item
                                                ? ""
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setActive(item);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
        </div>
    );
};

export default NavBar;
