import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Container } from "@/components/home/Container";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Footer() {
  return (
    <Container>
      <div className="md:px-0 px-6">
        <div className="grid grid-cols-1 gap-10 pt-10 mx-auto mt-5 border-t border-gray-100 dark:border-trueGray-700 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div>
              <Link href="/">
                <Image
                  src="/img/esentry-name-icon-gray.svg"
                  alt="eSentry Logo"
                  width="0"
                  height="0"
                  className="w-48"
                />
              </Link>
            </div>

            <div className="max-w-md mt-4 text-gray-500 dark:text-gray-400">
              eSentry helps you stay ahead by providing real-time alerts for
              eBay listings that match your preferences, ensuring you
              never miss out on the perfect deal.
            </div>

            <div className="mt-5">
              <a
                href="https://vercel.com/?utm_source=web3templates&utm_campaign=oss"
                target="_blank"
                rel="noopener"
                className="relative block w-44"
              >
                <Image
                  src="/img/vercel.svg"
                  alt="Powered by Vercel"
                  width="212"
                  height="44"
                />
              </a>
            </div>
          </div>
          <div className="flex justify-start lg:justify-end">
            <div>
              <div>Follow me!</div>
              <div className="flex mt-5 space-x-5 text-gray-400 dark:text-gray-500">
                <a
                  href="https://github.com/mjw324"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-[#171515] transition-colors duration-200 dark:hover:text-white"
                >
                  <span className="sr-only">GitHub</span>
                  <FontAwesomeIcon
                    icon={faGithub}
                    className="w-8 h-8"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/in/micah-worth/"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-[#0A66C2] transition-colors duration-200"
                >
                  <span className="sr-only">LinkedIn</span>
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    className="w-8 h-8"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 text-sm text-center text-gray-600 dark:text-gray-400">
        Copyright © {new Date().getFullYear()}. Made by Micah Worth.
      </div>
    </Container>
  );
}
