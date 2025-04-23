"use client";

import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import "./style/hero.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Users } from "lucide-react";
import { useRef } from "react";

const productCategories = [
  {
    name: "Tiller",
    image: "/images/category/tiller.png",
  },
  {
    name: "Generator",
    image: "/images/category/generator.png",
  },
  {
    name: "Pumps",
    image: "/images/category/pump.png",
  },
];

export default function Hero() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.from(
        ".info-container, .jeeko-logo, .kk-logo, .category-container, .approvals, .customer-count, .years-of-experience",
        {
          opacity: 0,
          y: 100,
          duration: 0.7,
          stagger: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-[95%] hero-container mx-auto">
      <div className="bg-white p-6 rounded-xl space-y-4 info-container">
        <h3 className="text-primary font-semibold text-md">Welcome to JEEKO</h3>

        <h2 className="font-bold text-4xl">
          Agricultural Machinery & <br />
          Equipment
        </h2>

        <p className="text-gray-500">
          Improving agricultural productivity and efficiency through innovative
          machinery and equipment.
        </p>

        <Button>Contact Us</Button>
      </div>

      <div className="w-full p-4 bg-white flex justify-center items-center rounded-xl jeeko-logo">
        <Image
          src="/images/logo.svg"
          alt="hero"
          className="w-3/4 object-contain"
          width={500}
          height={500}
        />
      </div>
      <div className="w-full p-4 bg-white flex justify-center items-center rounded-xl kk-logo">
        <Image
          src="/images/kk-logo.png"
          alt="hero"
          className="w-5/12 object-contain"
          width={500}
          height={500}
        />
      </div>
      <div className="category-container flex flex-col p-4 items-center justify-center bg-white h-full w-full rounded-xl">
        <Carousel className="">
          <CarouselContent>
            {productCategories.map((category, index) => (
              <CarouselItem
                key={index}
                className="flex flex-col w-full h-full justify-between items-center"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={500}
                  height={500}
                  className="w-2/3 object-contain"
                />
                <h3 className="my-2 font-bold text-2xl text-muted-foreground">
                  {category.name}
                </h3>
                <Button>View Products</Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute h-12 w-12 left-0 border-primary text-primary hover:bg-primary/20 hover:text-primary" />
          <CarouselNext className="absolute h-12 w-12 right-0 border-primary text-primary hover:bg-primary/20 hover:text-primary" />
        </Carousel>
      </div>
      <div className="approvals flex py-7 items-center justify-around bg-white rounded-xl">
        <Image
          src="/images/isi-logo.png"
          alt="iso"
          width={200}
          height={200}
          className=" size-20 object-contain"
        />
        <Image
          src="/images/iso-logo.png"
          alt="iso"
          width={200}
          height={200}
          className=" size-20 object-contain"
        />
        <Image
          src="/images/fmtti-logo.png"
          alt="iso"
          width={200}
          height={200}
          className=" size-20 object-contain"
        />
      </div>
      <div className="customer-count flex flex-col py-7 gap-5 items-center justify-center bg-white rounded-xl">
        <h2 className="text-primary font-bold text-4xl">100+</h2>
        <div className="font-bold flex items-center gap-2">
          <Users className="size-5" />
          <p>Happy Customers</p>
        </div>
      </div>
      <div className="flex flex-col py-7 gap-5 items-center justify-center bg-white rounded-xl years-of-experience">
        <h2 className="text-primary font-bold text-4xl">3+</h2>
        <div className="font-bold flex items-center gap-2">
          <p>Years of Experience</p>
        </div>
      </div>
    </section>
  );
}
