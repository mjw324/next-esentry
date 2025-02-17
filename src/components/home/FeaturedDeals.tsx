"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import SetupEbayMonitor from "@/components/dashboard/ebaymonitorsetup/SetupEbayMonitor";

const deals = [
  {
    name: "iPhone 15 Pro",
    image: "/img/iphone_15_pro.png",
    msrp: 1099,
    discountPrice: 700,
    initialKeywords: ["iPhone", "15", "Pro", "Apple"],
    initialExcludedKeywords: ["Max", "Used", "Refurbished"],
    initialCondition: [],
    initialSellers: [],
    initialMinPrice: 400,
    initialMaxPrice: 900,
  },
  {
    name: "Nintendo Switch OLED",
    image: "/img/nintendo_switch.png",
    msrp: 299,
    discountPrice: 120,
    initialKeywords: ["Nintendo", "Switch", "OLED"],
    initialExcludedKeywords: ["Broken", "Parts"],
    initialCondition: ["used", "openBox"],
    initialSellers: [],
    initialMinPrice: 80,
    initialMaxPrice: 150,
  },
  {
    name: "Air Jordan 1 Hyper Royal",
    image: "/img/aj1_hyper_royal_1.png",
    msrp: 170,
    discountPrice: 110,
    initialKeywords: ["Air", "Jordan", "1", "Hyper", "Royal"],
    initialExcludedKeywords: ["Replica", "Fake", "Used"],
    initialCondition: ["used", "openBox"],
    initialSellers: [],
    initialMinPrice: 50,
    initialMaxPrice: 150,
  },
  {
    name: "Zodiac Olympos Watch",
    image: "/img/zodiac_olympos_watch.png",
    msrp: 895,
    discountPrice: 630,
    initialKeywords: ["Zodiac", "Olympos", "Watch"],
    initialExcludedKeywords: ["Damaged", "Replica"],
    initialCondition: ["used", "openBox"],
    initialSellers: ["WatchesOnline"],
    initialMinPrice: 300,
    initialMaxPrice: 700,
  },
];

export const FeaturedDeals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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
    <div className="py-12">
      <h2 className="text-center text-4xl font-extrabold mb-8 text-gray-800 dark:text-white">
        Featured Deals
      </h2>

      <div className="relative flex justify-center items-center">
        {/* Left Control */}
        <Button
          onPress={() => paginate(-1)}
          size="lg"
          radius="full"
          variant="light"
          aria-label="Previous Deal"
          className="mx-4"
        >
          {/* Left Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Button>

        {/* Carousel Container */}
        <div className="w-full max-w-4xl h-[800px] relative overflow-hidden rounded-lg">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex flex-col justify-between items-center p-7"
            >
              {/* Image and Price Badge Container */}
              <div className="relative w-full h-3/4">
                {/* Product Image with subtle breathing effect */}
                <motion.img
                  key={deals[currentIndex].image}
                  src={deals[currentIndex].image}
                  alt={deals[currentIndex].name}
                  className="object-contain w-full h-full"
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />

                {/* Price Badge */}
                <div className="absolute top-0 right-10 bg-gradient-to-tr dark:from-primary dark:to-success to-success-300 from-primary-300 dark:text-white text-black font-medium px-4 py-2 rounded-full shadow-md flex flex-col items-center">
                  <span className="text-sm line-through opacity-75">
                    ${deals[currentIndex].msrp}
                  </span>
                  <span className="text-xl font-bold">
                    ${deals[currentIndex].discountPrice}
                  </span>
                </div>
              </div>

              {/* Product Name and Setup Ebay Monitor Button */}
              <div className="text-center mt-4">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white pb-4">
                  {deals[currentIndex].name}
                </h3>
                <SetupEbayMonitor
                  isDemo={true}
                  initialKeywords={deals[currentIndex].initialKeywords}
                  initialExcludedKeywords={
                    deals[currentIndex].initialExcludedKeywords
                  }
                  initialCondition={deals[currentIndex].initialCondition}
                  initialSellers={deals[currentIndex].initialSellers}
                  initialMinPrice={deals[currentIndex].initialMinPrice}
                  initialMaxPrice={deals[currentIndex].initialMaxPrice}
                />
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
          className="mx-4"
        >
          {/* Right Arrow Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};
