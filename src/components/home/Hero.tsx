import Image from "next/image";
import { Container } from "@/components/home/Container";
import { Button } from "@heroui/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Hero = () => {
  return (
    <Container className="flex flex-wrap">
      <div className="flex items-center w-full lg:w-1/2">
        <div className="max-w-2xl mb-8">
          <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
            Discover Rare eBay Finds Instantly
          </h1>
          <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
            eSentry alerts you about new eBay and Amazon listings matching your
            customized preferences, ensuring you never miss out on the perfect
            deal.
          </p>

          <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
            <Link href="/register">
              <Button className="p-8 text-lg font-semibold text-center text-white bg-success rounded-md">
                Get Started for Free
              </Button>
            </Link>
            <a
              href="https://github.com/mjw324/next-esentry"
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-[#171515] transition-colors duration-200 dark:hover:text-white"
            >
              <FontAwesomeIcon
                icon={faGithub}
                className="w-8 h-8"
              />
              <span>Source Code</span>
            </a>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div>
          <Image
            src="/img/hero.png"
            width="616"
            height="617"
            className="object-cover"
            alt="Hero Illustration"
            loading="eager"
          />
        </div>
      </div>
    </Container>
  );
};
