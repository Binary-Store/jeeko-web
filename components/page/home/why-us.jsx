"use client";

import Image from "next/image";
import { ShieldCheck, Fuel, Headset, ScrollText } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const containerRef = useRef();

  useGSAP(
    () => {
      // Header animation - matching PopularProduct style
      gsap.fromTo(
        "h2",
        {
          y: 40,
          opacity: 0,
          scale: 0.9,
          rotationX: 10,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: "h2",
            start: "top 90%",
            end: "bottom 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Underline animation - matching PopularProduct style
      gsap.fromTo(
        ".underline",
        {
          width: 0,
          opacity: 0,
        },
        {
          width: "8rem",
          opacity: 1,
          duration: 1.2,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: ".underline",
            start: "top 90%",
            end: "bottom 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Point cards animation - matching PopularProduct style
      gsap.fromTo(
        ".point-card",
        {
          y: 60,
          opacity: 0,
          scale: 0.85,
          rotationY: 15,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".point-card",
            start: "top 85%",
            end: "bottom 70%",
            scrub: 0.3,
          },
        }
      );

      // Banner image animation - matching PopularProduct style
      gsap.fromTo(
        ".banner-image",
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".banner-image",
            start: "top 85%",
            end: "bottom 70%",
            scrub: 0.3,
          },
        }
      );

      // Hover animation for point cards
      document.querySelectorAll(".point-card").forEach((card) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          duration: 0.4,
          ease: "power3.out",
        });

        card.addEventListener("mouseenter", () => tl.play());
        card.addEventListener("mouseleave", () => tl.reverse());
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full mx-auto my-10  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">
          Why Choose <span className="text-primary">JEEKO</span>?
        </h2>
        <div className="w-24 sm:w-32 h-1 bg-primary mx-auto my-2 underline"></div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 my-8">
          {/* Points Section */}
          <div className="space-y-3 sm:space-y-4 w-full lg:w-1/2">
            {points.map((point, index) => (
              <div
                key={index}
                className="flex gap-3 sm:gap-4 h-fit items-start sm:items-center p-3 sm:p-4 rounded-xl bg-white point-card shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary flex-shrink-0 mt-1 sm:mt-0">
                  {point.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Image Section */}
          <div className="w-full lg:w-1/2">
            <Image
              className="w-full h-auto rounded-xl banner-image shadow-lg"
              src="/images/banner.png"
              alt="Why Choose JEEKO - Quality Products"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
