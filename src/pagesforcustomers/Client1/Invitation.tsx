"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvitationFirstPage({ name = "Alex" }) {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);

    setTimeout(() => {
      window.location.href = "/client1"; // redirect after animation
    }, 1500);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative overflow-hidden bg-black"
      style={{
        backgroundImage: "url(/Client1/Client1Pictures/Image1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Cinematic dark vignette */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

      {/* Main Content */}
      <div className="relative z-20 text-center max-w-3xl px-4">
        {/* TOP TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-5xl md:text-7xl font-serif font-bold tracking-wide drop-shadow-xl"
        >
          You Are Invited
        </motion.h1>

        {/* Floating Envelope */}
        <motion.div
          className="cursor-pointer w-52 md:w-72 mx-auto mt-10"
          onClick={handleOpen}
          initial={{ scale: 0.9 }}
          animate={{
            scale: opened ? 1 : [0.95, 1, 0.97, 1],
          }}
          transition={{
            duration: opened ? 0.3 : 3,
            repeat: opened ? 0 : Infinity,
          }}
        >
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.img
                key="closed"
                src="/Client1/Client1Pictures/close.png"
                alt="Envelope Closed"
                className="rounded-md shadow-2xl"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8 }}
              />
            ) : (
              <motion.img
                key="open"
                src="/Client1/Client1Pictures/open.png"
                alt="Envelope Open"
                className="rounded-md shadow-2xl"
                initial={{ opacity: 0, rotateX: -90 }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Name Turns 18 */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-white text-2xl md:text-4xl font-semibold mt-8 drop-shadow-lg"
        >
          {name} Turns 18
        </motion.h2>

        {/* Instruction */}
        {!opened && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-white/80 mt-2 text-base md:text-lg animate-pulse"
          >
            Click the envelope to open your invitation
          </motion.p>
        )}
      </div>

      {/* Soft glow behind envelope */}
      <motion.div
        className="absolute w-[450px] h-[350px] bg-white/5 blur-[120px] rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5 }}
      ></motion.div>
    </div>
  );
}
