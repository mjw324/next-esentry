import {
  Bell,
  Filter,
  Clock,
  ToggleRight,
  Mail,
  Settings,
  Zap
} from "lucide-react";
import React from "react";

const benefitOne = {
  title: "Real-Time Monitoring & Customization",
  desc: "eSentry provides powerful tools for tracking eBay listings. Set up customized monitors to ensure you never miss out on the products that matter most to you.",
  image: "/img/benefit-one.png",
  bullets: [
    {
      title: "24/7 Monitoring",
      desc: "Keep a constant eye on eBay listings, ensuring you are always the first to know.",
      icon: <Clock />,
    },
    {
      title: "Custom Filters",
      desc: "Apply detailed filters like price range, condition, keywords, and more to refine your alerts.",
      icon: <Filter />,
    },
    {
      title: "Turn On/Off Monitors Whenever",
      desc: "If you purchased your deal or aren't interested at the time, you can always pause monitors and reactivate them at any time.",
      icon: <ToggleRight />,
    },
  ],
};

const benefitTwo = {
  title: "Instant Notifications & Alerts",
  desc: "Stay informed on-the-go with eSentry's instant notifications. Receive detailed alerts directly to your email.",
  image: "/img/benefit-two.png",
  bullets: [
    {
      title: "Instant Email Alerts",
      desc: "Receive emails with all the relevant details, including the product images and direct links.",
      icon: <Bell />,
    },
    {
      title: "Email Preferences",
      desc: "Prefer to use different emails? Add and switch between any email you want to make sure you are getting alerts in the right inbox.",
      icon: <Mail />,
    },
    {
      title: "Easy Setup",
      desc: "Setting up your email is quick and easy, so you can start tracking listings in no time.",
      icon: <Zap />,
    },
  ],
};

export { benefitOne, benefitTwo };
