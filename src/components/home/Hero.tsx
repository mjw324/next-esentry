"use client";
import Image from "next/image";
import { Container } from "@/components/home/Container";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const Hero = () => {
  const { data: session } = useSession();

  return (
    <Container className="flex flex-wrap">
      <div className="flex items-center w-full lg:w-1/2">
        <div className="max-w-2xl mb-8">
          <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
            Discover Rare eBay Finds Instantly
          </h1>
          <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
            eSentry alerts you about new eBay listings matching your customized
            preferences, ensuring you never miss out on the perfect deal.
          </p>

          <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
            <Link href={session ? "/dashboard" : "/register"}>
              <Button className="p-8 text-lg font-semibold text-center text-white bg-success rounded-md">
                {session ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
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
