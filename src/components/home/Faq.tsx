"use client";

import React from "react";
import { Container } from "@/components/home/Container";
import { Accordion, AccordionItem } from "@heroui/react";
import { motion } from "framer-motion";

export const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        <Accordion
          selectionMode="multiple"
          variant="bordered"
          motionProps={{
            variants: {
              enter: {
                opacity: 1,
                height: "auto",
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 700,
                    damping: 30,
                    duration: 0.5,
                  },
                  opacity: {
                    ease: [0.04, 0.62, 0.23, 0.98],
                    duration: 0.8,
                  },
                },
              },
              exit: {
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    ease: [0.04, 0.62, 0.23, 0.98],
                    duration: 0.8,
                  },
                  opacity: {
                    ease: [0.04, 0.62, 0.23, 0.98],
                    duration: 0.4,
                  },
                },
              },
            },
            initial: "exit",
            animate: "enter",
            exit: "exit",
          }}
        >
          {faqdata.map((item) => (
            <AccordionItem
              key={item.question}
              aria-label={item.question}
              title={item.question}
            >
              {item.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "How does eSentry monitor eBaylistings?",
    answer:
      "eSentry continuously monitors eBay listings in real-time, providing you with instant alerts when new products matching your criteria are listed.",
  },
  {
    question: "Can I customize the alerts I receive?",
    answer:
      "Yes, you can customize your monitors with specific keywords, price ranges, condition filters, and blacklist certain keywords to receive only the most relevant alerts.",
  },
  {
    question: "How do I receive alerts?",
    answer:
      "You can receive alerts via email. You can pick which email you want to use, but only one email can be active at a time. Each alert includes detailed information about the listing and a direct link to the product on eBay.",
  },
  {
    question: "Is eSentry free to use?",
    answer:
      "eSentry is free to use for up to 3 active monitors. If you need more monitors, you can upgrade to a premium plan for unlimited monitors and additional features.",
  },
];
