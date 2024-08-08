"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-emerald-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-emerald-500`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "How does eSentry monitor eBay and Amazon listings?",
    answer: "eSentry continuously monitors eBay and Amazon listings in real-time, providing you with instant alerts when new products matching your criteria are listed.",
  },
  {
    question: "Can I customize the alerts I receive?",
    answer: "Yes, you can customize your monitors with specific keywords, price ranges, condition filters, and blacklist certain keywords to receive only the most relevant alerts.",
  },
  {
    question: "How do I receive alerts?",
    answer: "You can receive alerts via email or directly through our automated Telegram Bot. Each alert includes detailed information about the listing and a direct link to the product on eBay or Amazon.",
  },
  {
    question: "Is eSentry free to use?",
    answer: "eSentry offers a free tier with basic monitoring features. For advanced features, you can upgrade to one of our premium plans.",
  },
];

