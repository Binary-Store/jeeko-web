"use client";

import Image from "next/image";
import { ShieldCheck, Fuel, Headset, ScrollText } from "lucide-react";

const points = [
  {
    icon: (
      <Image
        src="/svg/india-icon.svg"
        className="size-8 sm:size-10"
        alt="Why Us"
        width={50}
        height={50}
      />
    ),
    title: "Made in India",
    description:
      "Proudly manufactured in India, supporting local industry and ensuring products are designed for Indian conditions.",
  },
  {
    icon: <ShieldCheck className="size-6 sm:size-7" />,
    title: "Durable & Reliable",
    description:
      "Built to last with high-quality materials and rigorous testing to ensure reliability in demanding conditions.",
  },
  {
    icon: <Fuel className="size-6 sm:size-7" />,
    title: "Fuel Efficient",
    description:
      "Designed with optimal fuel efficiency to reduce operating costs and environmental impact.",
  },
  {
    icon: <ScrollText className="size-6 sm:size-7" />,
    title: "Easy to Operate",
    description:
      "User-friendly design with simple controls and clear instructions for hassle-free operation.",
  },
  {
    icon: <Headset className="size-6 sm:size-7" />,
    title: "Customer Support",
    description:
      "Comprehensive support services to ensure your satisfaction and peace of mind.",
  },
];

export default function WhyUs() {
  return (
    <section className="w-full mx-auto my-6 sm:my-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-bold">
          Why Choose <span className="text-primary">JEEKO</span>?
        </h2>
        <div className="w-16 sm:w-24 md:w-32 h-1 bg-primary mx-auto my-2"></div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 my-6 sm:my-8">
          {/* Points Section */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 w-full lg:w-1/2">
            {points.map((point, index) => (
              <div
                key={index}
                className="flex gap-2 sm:gap-3 md:gap-4 items-start p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-white point-card shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary flex-shrink-0 mt-0.5 sm:mt-1 md:mt-0">
                  {point.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Image Section */}
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
            <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] lg:aspect-auto lg:h-full">
              <Image
                className="rounded-lg sm:rounded-xl banner-image shadow-lg object-cover"
                src="/images/banner.png"
                alt="Why Choose JEEKO - Quality Products"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
