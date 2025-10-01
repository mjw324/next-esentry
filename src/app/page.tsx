import { Container } from "@/components/home/Container";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/home/SectionTitle";
import { Benefits } from "@/components/home/Benefits";
import { Faq } from "@/components/home/Faq";
import { Cta } from "@/components/home/Cta";
import { FeaturedDeals } from "@/components/home/FeaturedDeals";
import { benefitOne, benefitTwo } from "@/components/data";
import { InitialRedirect } from "@/components/InitialRedirect";

export default async function Home() {
  return (
    <Container>
      <InitialRedirect />
      <Hero />

      <div className="hidden lg:block">
        <SectionTitle
          preTitle="Try It Yourself"
          title="Simple Setup in Just a Few Clicks"
        >
          Get a feel for how easy it is to set up your own customized monitor
          with eSentry. Try our interactive demo below!
        </SectionTitle>

        <FeaturedDeals />
      </div>

      <SectionTitle
        preTitle="eSentry Benefits"
        title="Why eSentry is Your Ultimate Monitoring Tool"
      >
        eSentry helps you stay ahead of the game by providing real-time alerts
        for eBay listings. Customize your monitors, and never miss out on the
        best deals that match your exact criteria.
      </SectionTitle>

      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Got questions? We&apos;ve got answers. Learn more about how eSentry
        works, our features, and how you can make the most out of your monitors.
      </SectionTitle>

      <Faq />

      <Cta />
    </Container>
  );
}
