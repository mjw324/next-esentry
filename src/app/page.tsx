import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
// import { Video } from "@/components/Video";
// import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

import { benefitOne, benefitTwo } from "@/components/data";

export default function Home() {
  return (
    <Container>
      <Hero />
      
      <SectionTitle
        preTitle="eSentry Benefits"
        title="Why eSentry is Your Ultimate Monitoring Tool"
      >
        eSentry helps you stay ahead of the game by providing real-time alerts for eBay and Amazon listings. Customize your monitors, and never miss out on the best deals that match your exact criteria.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      {/* <SectionTitle
        preTitle="Watch a Video"
        title="See How eSentry Works in Action"
      >
        Discover how eSentry can simplify your online shopping experience with our quick demo video. Learn how to set up monitors and receive instant alerts, ensuring you always get the best deals.
      </SectionTitle>

      <Video videoId="fZ0D0cnR88E" />

      <SectionTitle
        preTitle="Testimonials"
        title="What Our Users Are Saying"
      >
        Hear from our satisfied users who have found success with eSentry. See how eSentry has helped them snag the best deals on eBay and Amazon, time and time again.
      </SectionTitle>

      <Testimonials /> */}

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Got questions? We&apos;ve got answers. Learn more about how eSentry works, our features, and how you can make the most out of your monitors.
      </SectionTitle>

      <Faq />

      <Cta />
    </Container>
  );
}
