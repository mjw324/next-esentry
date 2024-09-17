// components/home/FeaturedDeals.tsx
"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, Button, Image } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { motion, AnimatePresence } from "framer-motion";

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
  const [selectedKey, setSelectedKey] = useState(0);

  const handleTabChange = (key: string | number) => {
    const index = parseInt(key as string, 10);
    setSelectedKey(index);
  };

  const variants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  // Set a fixed height for the card container
  const cardContainerHeight = "h-[900px]";

  return (
    <div className="py-12">
      <h2 className="text-center text-3xl font-bold mb-8">Featured Deals</h2>
      <div
        className={`flex justify-center items-center ${cardContainerHeight}`}
      >
        <div className="w-full max-w-lg h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedKey}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Card
                isHoverable
                shadow="lg"
                radius="lg"
                className="h-full flex flex-col"
                classNames={{
                  header: "bg-transparent",
                }}
              >
                <CardHeader className="bg-transparent p-0 h-2/3">
                  <Image
                    src={deals[selectedKey].image}
                    alt={deals[selectedKey].name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                </CardHeader>
                <CardBody className="text-center h-1/3 flex flex-col justify-center">
                  <h3 className="font-semibold text-xl">
                    {deals[selectedKey].name}
                  </h3>
                  <div className="flex justify-center items-center mt-2">
                    <span className="text-gray-500 line-through mr-2">
                      ${deals[selectedKey].msrp}
                    </span>
                    <span className="text-green-600 font-bold text-2xl">
                      ${deals[selectedKey].discountPrice}
                    </span>
                  </div>
                  <Button
                    as="a"
                    href="#"
                    variant="flat"
                    color="success"
                    className="mt-4 bg-gradient-to-tr from-green-400 to-emerald-600 text-white"
                  >
                    Learn More
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs for Slide Control */}
      <div className="mt-8">
        <Tabs
          aria-label="Select deal"
          selectedKey={selectedKey.toString()}
          onSelectionChange={handleTabChange}
          placement="bottom"
          variant="underlined"
          color="success"
          fullWidth
          size="md"
          classNames={{
            tabList: "justify-center",
          }}
          disableAnimation={false}
        >
          {deals.map((deal, index) => (
            <Tab key={index.toString()} title={deal.name} />
          ))}
        </Tabs>
      </div>
    </div>
  );
};
