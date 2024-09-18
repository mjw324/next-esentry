"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/react";

const deals = [
  {
    name: "iPhone 15 Pro",
    image: "/img/iphone_15_pro.png",
    msrp: 1099,
    discountPrice: 899,
  },
  {
    name: "Nintendo Switch",
    image: "/img/nintendo_switch.png",
    msrp: 299,
    discountPrice: 249,
  },
  {
    name: "Air Jordan 1 Hyper Royal",
    image: "/img/aj1_hyper_royal_1.png",
    msrp: 170,
    discountPrice: 150,
  },
  {
    name: "Zodiac Olympos Watch",
    image: "/img/zodiac_olympos_watch.png",
    msrp: 895,
    discountPrice: 695,
  },
];

export const FeaturedDeals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 10000); // Change slide every 10 seconds
    return () => clearInterval(interval);
  }, [currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prevIndex) => (prevIndex + newDirection + deals.length) % deals.length
    );
  };

  // Framer Motion variants for the carousel
  const variants = {
    enter: (direction: number) => ({
      opacity: 0,
      rotateY: direction > 0 ? 15 : -15,
      scale: 0.8,
      zIndex: -1,
      originX: direction > 0 ? 1.5 : -1.5,
    }),
    center: {
      opacity: 1,
      rotateY: 0,
      scale: 1,
      zIndex: 1,
      originX: 0.5,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      rotateY: direction > 0 ? -15 : 15,
      scale: 0.8,
      zIndex: -1,
      originX: direction > 0 ? 0 : 1,
    }),
  };

  return (
    <div className="py-12 relative">
      <h2 className="text-center text-4xl font-bold mb-8">Featured Deals</h2>

      <div className="relative flex justify-center items-center">
        {/* Left Control */}
        <Button
          onPress={() => paginate(-1)}
          size="lg"
          radius="full"
          variant="light"
          aria-label="Previous Deal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </Button>

        {/* Carousel Container */}
        <div
          className="w-full max-w-5xl h-[600px] relative overflow-hidden"
          style={{ perspective: "1500px" }} // Perspective gives the 3D depth effect
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex flex-col justify-between items-center"
            >
              {/* Product Image with subtle breathing effect */}
              <motion.img
                key={deals[currentIndex].image}
                src={deals[currentIndex].image}
                alt={deals[currentIndex].name}
                className="object-contain w-2/3 h-3/4 pt-5"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />

              {/* Price Badge (Top-Right) */}
              <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
                <div className="text-gray-200 line-through text-lg">
                  ${deals[currentIndex].msrp}
                </div>
                <div className="text-white font-bold text-2xl">
                  ${deals[currentIndex].discountPrice}
                </div>
              </div>

              {/* Space between product and name */}
              <div className="mb-6"></div>

              {/* Product Name */}
              <div className="bg-green-600 text-white text-2xl px-6 py-3 rounded-md shadow-lg">
                {deals[currentIndex].name}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Control */}
        <Button
          onPress={() => paginate(1)}
          size="lg"
          radius="full"
          variant="light"
          aria-label="Next Deal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};
