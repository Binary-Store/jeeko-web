"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function Brands() {
  const containerRef = useRef();

  // All GSAP animations removed

  return (
    <section ref={containerRef} className="w-full mx-auto my-10  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-center font-bold">Our Brands</h2>
        <div className="w-32 h-1 bg-primary mx-auto my-2"></div>

        <div className="flex flex-col lg:flex-row gap-6 my-7">
          {/* JEEKO Brand Card */}
          <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Image
                src="/images/logo.svg"
                className="object-contain flex-shrink-0"
                alt="JEEKO"
                width={80}
                height={80}
              />
              <div>
                <h2 className="text-primary font-bold text-lg sm:text-xl">JEEKO</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Our main brand specializing in high-quality generators designed
                  for reliability and performance in various settings, from homes
                  to farms.
                </p>
              </div>
            </div>
            <Separator className="my-4 sm:my-6" />
            <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Image
                src="/images/jeeko-brochure.png"
                className="object-contain shadow-lg rounded border h-fit w-full sm:w-1/2 md:w-48"
                alt="JEEKO Brochure"
                width={500}
                height={500}
              />
              <div className="space-y-2 flex-1">
                <h3 className="text-base sm:text-lg md:text-xl font-bold">
                  Get manuals and support for your JEEKO machine
                </h3>
                <ul className="list-disc list-inside text-sm sm:text-base space-y-1">
                  <li>Products</li>
                  <li>Pricing</li>
                  <li>Service & Support</li>
                </ul>
                <Button className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>

          {/* Kishan King Brand Card */}
          <div className="w-full bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Image
                src="/images/kk-logo.png"
                className="object-contain flex-shrink-0"
                alt="Kishan King"
                width={80}
                height={80}
              />
              <div>
                <h2 className="text-primary font-bold text-lg sm:text-xl">Kishan King</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Our sub-brand dedicated to agricultural equipment and farming
                  tools designed to enhance productivity for Indian farmers.
                </p>
              </div>
            </div>
            <Separator className="my-4 sm:my-6" />
            <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-5">
              <Image
                src="/images/kk-brochure.png"
                className="object-contain shadow-lg rounded border h-fit w-full sm:w-1/2 md:w-48"
                alt="Kishan King Brochure"
                width={500}
                height={500}
              />
              <div className="space-y-2 flex-1">
                <h3 className="text-base sm:text-lg md:text-xl font-bold">
                  Get manuals and support for your Kishan King machine
                </h3>
                <ul className="list-disc list-inside text-sm sm:text-base space-y-1">
                  <li>Products</li>
                  <li>Pricing</li>
                  <li>Service & Support</li>
                </ul>
                <Button className="w-full sm:w-auto hover:scale-105 transition-transform duration-200">
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
