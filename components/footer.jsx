"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ClipboardCheck,
  Search,
  Star,
  Lightbulb,
  Wrench,
  SlidersHorizontal,
  Phone,
  LocateIcon,
  Youtube,
  Linkedin,
  FacebookIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const productCategories = [
  {
    name: "Tillers",
    path: "/products/double-column-machining-centers",
    icon: "/svg/tiller-icon.svg",
  },
  {
    name: "Water Pumps",
    path: "/products/horizontal-boring-machines",
    icon: "/svg/tiller-icon.svg",
  },
  {
    name: "Generators",
    path: "/products/vertical-machining-centers",
    icon: "/svg/tiller-icon.svg",
  },
];

export default function Footer() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        ".footer-logo",
        {
          y: 50,
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: ".footer-logo",
            start: "top 90%",
            end: "-200px 90%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 1.5,
        }
      );

      gsap.fromTo(
        ".footer-section",
        {
          y: 50,
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: ".footer-section",
            start: "top 95%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
            // scrub: 1,
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <footer ref={containerRef} className="bg-white relative mt-4 flex">
      <div className="w-[95%] mx-auto py-7 md:gap-4 grid md:grid-cols-2 lg:grid-cols-3 z-10">
        <div className="footer-section">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            height={50}
            width={150}
            className="bg-white rounded-lg p-2 footer-logo"
          />

          <p className="text-sm text-black my-7">
            At Shubhline Automation Pvt. Ltd., we are proud to be the only
            manufacturer in India specializing in Heavy Duty CNC Machine Tools.
          </p>

          <div className="flex gap-2 mb-4">
            <div className="rounded-xl bg-primary w-fit p-3 z-50">
              <Phone size={20} className="text-white" />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-black font-bold ps-font-orbitron">
                Customer Service
              </p>
              <p className="text-black text-sm">(+91) 9156261648</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="rounded-xl bg-primary w-fit h-fit p-3 z-50">
              <LocateIcon size={20} className="text-white" />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-black font-bold ps-font-orbitron">Address</p>
              <p className="text-black text-sm">
                Shubhline Automation Pvt. Ltd.
                <br /> GAT No. 2022/5, Ambethan Bordara Road, Behind Mahalaxmi
                Vajan Kata, Chakan Road, Chakan, Pune, Maharashtra, 410501
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 z-50">
          <h3 className="text-lg font-semibold text-primary leading-10 z-50">
            Our Product Categories
          </h3>
          <Separator className="h-0.5 bg-primary" />
          {productCategories.map((page, index) => (
            <div
              key={index}
              className="flex gap-2 items-center text-black hover:text-primary text-sm group"
            >
              {/* <span className="h-2 w-2 rounded-full bg-white group-hover:bg-primary"></span> */}
              <Image
                src={page.icon}
                alt="Tools 1"
                quality={80}
                height={30}
                width={30}
                priority
                className="rounded-md object-cover"
              />
              <Link href={page.path}>{page.name}</Link>
            </div>
          ))}
        </div>

        <div className="space-y-4 z-50">
          <h3 className="text-lg font-semibold text-primary leading-10 z-50">
            Social Media
          </h3>
          <Separator className="h-0.5 bg-primary" />
          <div className="mt-4 flex gap-3">
            <Button
              className="rounded-full"
              size="icon"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/profile.php?id=61555166633293"
                )
              }
            >
              <FacebookIcon />
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              onClick={() =>
                window.open("https://www.youtube.com/@prostarcnc7217")
              }
            >
              <Youtube />
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/company/shubhline-automation-pvt-ltd/?viewAsMember=true"
                )
              }
            >
              <Linkedin />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
