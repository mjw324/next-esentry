"use client";
import React from "react";
import { Container } from "@/components/home/Container";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export const Cta = () => {
  const { data: session } = useSession();

  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-5 mx-auto text-white bg-success px-7 py-7 lg:px-12 lg:py-12 lg:flex-nowrap rounded-xl">
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-2xl font-medium lg:text-3xl">
            Ready to use eSentry?
          </h2>
          <p className="mt-2 font-medium text-white text-opacity-90 lg:text-xl">
            It doesn&apos;t get easier to find the best deals on products you
            are looking for.
          </p>
        </div>
        <div className="flex-shrink-0 w-full text-center lg:w-auto">
          <Link href={session ? "/dashboard" : "/register"}>
            <Button className="p-8 text-lg font-semibold text-center bg-white text-success rounded-md">
              {session ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};
