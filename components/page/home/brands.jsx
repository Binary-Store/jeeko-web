"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Brands() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        "h2",
        {
          y: 50,
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: "h2",
            start: "top 90%",
            end: "200px 90%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 2,
        }
      );

      gsap.fromTo(
        ".brand-card",
        {
          y: 100,
          opacity: 0,
          rotate: 10,
        },
        {
          scrollTrigger: {
            trigger: ".brand-card",
            start: "top 95%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
            scrub: 1,
          },
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 1,
          stagger: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full mx-auto my-10">
      <h2 className="text-4xl text-center font-bold">Our Brands</h2>
      <div className="w-32 h-1 bg-primary mx-auto my-2"></div>

      <div className="w-[95%] mx-auto flex gap-4 my-7">
        <div className="w-full bg-white rounded-xl p-5 brand-card">
          <div className="w-full flex items-center gap-4">
            <Image
              src="/images/logo.svg"
              className="object-contain"
              alt="JEEKO"
              width={100}
              height={100}
            />
            <div>
              <h2 className="text-primary font-bold">JEEKO</h2>
              <p className="text-muted-foreground">
                Our main brand specializing in high-quality generators designed
                for reliability and performance in various settings, from homes
                to farms.
              </p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="w-full flex gap-5">
            <Image
              src="/images/jeeko-brochure.png"
              className="object-contain shadow-lg rounded border w-48"
              alt="JEEKO"
              width={500}
              height={500}
            />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                Get manuals and support for your JEEKO machine
              </h3>
              <ul className="list-disc list-inside">
                <li>Products</li>
                <li>Pricing</li>
                <li>Service & Support</li>
              </ul>
              <Button>Download Brochure</Button>
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-xl p-5 brand-card">
          <div className="w-full flex items-center gap-4">
            <Image
              src="/images/kk-logo.png"
              className="object-contain"
              alt="JEEKO"
              width={100}
              height={100}
            />
            <div>
              <h2 className="text-primary font-bold">Kishan King</h2>
              <p className="text-muted-foreground">
                Our sub-brand dedicated to agricultural equipment and farming
                tools designed to enhance productivityfor Indian farmers.
              </p>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="w-full flex gap-5">
            <Image
              src="/images/kk-brochure.png"
              className="object-contain shadow-lg rounded border w-48"
              alt="JEEKO"
              width={500}
              height={500}
            />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">
                Get manuals and support for your JEEKO machine
              </h3>
              <ul className="list-disc list-inside">
                <li>Products</li>
                <li>Pricing</li>
                <li>Service & Support</li>
              </ul>
              <Button>Download Brochure</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
