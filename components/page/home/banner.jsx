"use client"

import React, { useEffect, useRef } from 'react'
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const banner = [
  {
    image: "/images/4.png",
  },
  {
    image: "/images/5.png",
  },
  {
    image: "/images/6.png",
  },
];

const Banner = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const sectionRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Add a small delay to ensure header is rendered
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Animate the entire banner section
        gsap.fromTo(
          sectionRef.current,
          {
            opacity: 0,
            y: 100,
          },
          {
            opacity: 1,
            y: 0,
            duration: 2.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%", // Changed from 80% to 90%
              end: "top 30%", // Changed from 50% to 30%
              scrub: 1.5, // Increased scrub time
              toggleActions: "play none none reverse", // Added toggle actions
              markers: false, // Set to true for debugging
            },
          }
        );

        // Animate the carousel items individually
        gsap.fromTo(
          ".carousel-item",
          {
            opacity: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            stagger: 0.3, // Increased stagger time
            ease: "power2.out",
            scrollTrigger: {
              trigger: carouselRef.current,
              start: "top 90%", // Changed from 80% to 90%
              end: "top 30%", // Changed from 50% to 30%
              scrub: 1.5, // Increased scrub time
              toggleActions: "play none none reverse", // Added toggle actions
              markers: false, // Set to true for debugging
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={sectionRef} className='w-[95%] mx-auto mb-10 opacity-0'> {/* Added initial opacity-0 */}
      <div ref={carouselRef} className="w-full h-full rounded-xl">
        <Carousel 
          className="w-full h-full" 
          plugins={[plugin.current]}
        >
          <CarouselContent>
            {banner.map((category, index) => (
              <CarouselItem
                key={index}
                className="carousel-item flex flex-col w-full h-full justify-between items-center"
              >
                <Image
                  src={category.image}
                  alt={category.image}
                  width={1980}
                  height={709}
                  className="w-full object-contain rounded-xl"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute h-12 w-12 left-0 border-red-600 text-red-600 hover:bg-red-600/20 hover:text-red-600" />
          <CarouselNext className="absolute h-12 w-12 right-0 border-red-600 text-red-600 hover:bg-red-600/20 hover:text-red-600" />
        </Carousel>
      </div>
    </section>
  )
}

export default Banner