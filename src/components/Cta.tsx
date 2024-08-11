import React from "react";
import { Container } from "@/components/Container";

export const Cta = () => {
  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-5 mx-auto text-white bg-emerald-600 px-7 py-7 lg:px-12 lg:py-12 lg:flex-nowrap rounded-xl">
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-2xl font-medium lg:text-3xl">
            Ready to use eSentry?
          </h2>
          <p className="mt-2 font-medium text-white text-opacity-90 lg:text-xl">
            It doesn&apos;t get easier to find the best deals on products you are looking for.
          </p>
        </div>
        <div className="flex-shrink-0 w-full text-center lg:w-auto">
          <a
            href="/register"
            target="_blank"
            rel="noopener"
            className="inline-block py-3 mx-auto text-lg font-medium text-center text-emerald-600 bg-white rounded-md px-7 lg:px-10 lg:py-5 "
          >
            Register
          </a>
        </div>
      </div>
    </Container>
  );
};
