import {
  BellIcon,
  FunnelIcon,
  ChartBarIcon,
  ClockIcon,
  TagIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";

const benefitOne = {
  title: "Real-Time Monitoring & Customization",
  desc: "eSentry provides powerful tools for tracking eBay and Amazon listings. Set up customized monitors to ensure you never miss out on the deals that matter most to you.",
  image: "/img/benefit-one.png", // Updated image path
  bullets: [
    {
      title: "24/7 Monitoring",
      desc: "Keep an eye on eBay and Amazon listings in real-time, ensuring you are always the first to know.",
      icon: <ClockIcon />,
    },
    {
      title: "Custom Filters",
      desc: "Apply detailed filters like price range, condition, keywords, and more to refine your alerts.",
      icon: <FunnelIcon />,
    },
    {
      title: "Specific Amazon Product Monitoring",
      desc: "Monitor specific Amazon products for price drops, especially for used items.",
      icon: <TagIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Instant Notifications & Alerts",
  desc: "Stay informed on-the-go with eSentry's instant notifications. Receive detailed alerts directly to your email or via Telegram.",
  image: "/img/benefit-two.png", // Updated image path
  bullets: [
    {
      title: "Instant Telegram Alerts",
      desc: "Receive notifications through our Telegram bot with all the relevant details and direct links.",
      icon: <BellIcon />,
    },
    {
      title: "Email Notifications",
      desc: "Prefer email? Get instant alerts sent directly to your inbox with all necessary information.",
      icon: <InboxIcon />,
    },
    {
      title: "Easy Setup",
      desc: "Setting up alerts is quick and easy, so you can start tracking listings in no time.",
      icon: <ChartBarIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
