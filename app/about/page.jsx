"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaSeedling, FaHandsHelping, FaAward, FaLeaf } from "react-icons/fa";
import banner from "@/public/images/banners/about.png"
import banner_mb from "@/public/images/banners/about_mb.png"

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: "2010",
    title: "Founded",
    desc: "Jeeko Agro Industries is born with a vision to empower Indian farmers with modern, reliable tools.",
    image: "/images/bg-doodle.png",
  },
  {
    year: "2014",
    title: "First Breakthrough",
    desc: "Launched our first tiller, quickly becoming a trusted name in the region.",
    image: "/images/category/tiller.png",
  },
  {
    year: "2018",
    title: "Expanding Horizons",
    desc: "Introduced generators and pumps, expanding our product range and reach.",
    image: "/images/category/generator.jpg",
  },
  {
    year: "2023",
    title: "Innovation & Growth",
    desc: "Invested in R&D, launched new eco-friendly products, and grew our support network nationwide.",
    image: "/images/category/grass-cutter.png",
  },
];

const values = [
  {
    icon: <FaSeedling className="text-primary w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Innovation",
    desc: "We constantly innovate to bring the best solutions to Indian agriculture."
  },
  {
    icon: <FaHandsHelping className="text-primary w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Support",
    desc: "Our team is always ready to help, from purchase to after-sales."
  },
  {
    icon: <FaAward className="text-primary w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Quality",
    desc: "Every product is rigorously tested for reliability and durability."
  },
  {
    icon: <FaLeaf className="text-primary w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Sustainability",
    desc: "We care for the earth and design products with the future in mind."
  },
];

const brands = [
  {
    name: "JEEKO",
    logo: "/images/logo.svg",
    desc: "Our flagship brand for generators, tillers, and pumps—trusted for performance and reliability.",
  },
  {
    name: "Kishan King",
    logo: "/images/kk-logo.png",
    desc: "Dedicated to agricultural equipment and tools for Indian farmers.",
  },
];

export default function About() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        ".about-animate",
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".about-animate",
            start: "top 90%",
            end: "bottom 90%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full min-h-[80vh] px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
      <div className="w-full pb-10">
        <div className="max-w-7xl rounded-2xl bg-white mx-auto overflow-hidden shadow-lg">
          {/* Mobile Image */}
          <Image
            src={banner_mb}
            alt="About Banner Mobile"
            width={1980}
            height={709}
            className="block md:hidden w-full h-auto max-h-[89vh] sm:max-h-[70vh] rounded-2xl object-contain"
            priority
          />

          {/* Desktop Image */}
          <Image
            src={banner}
            alt="About Banner Desktop"
            width={1980}
            height={709}
            className="hidden md:block w-full h-auto max-h-[70vh] lg:max-h-[96vh] rounded-2xl object-contain"
            priority
          />
        </div>
      </div>

      {/* Timeline / Journey */}
      <div className="about-animate max-w-7xl mx-auto mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 sm:mb-8">Our Journey</h2>
        <div className="flex flex-col gap-6 sm:gap-8">
          {timeline.map((item, i) => (
            <div key={item.year} className={`flex flex-col lg:flex-row ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''} items-center gap-4 sm:gap-6 lg:gap-8`}>
              <Card className="flex-1 p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-md">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-primary font-bold text-lg sm:text-xl">{item.year}</span>
                  <Separator className="flex-1 bg-primary/30" />
                  <span className="font-semibold text-base sm:text-lg">{item.title}</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
              </Card>
              <div className="flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={70}
                  height={70}
                  className="rounded-lg shadow object-contain bg-[#f5f5f5] hidden sm:block"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values */}
      <div className="about-animate max-w-7xl mx-auto mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 sm:mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {values.map((v, i) => (
            <Card key={v.title} className="flex flex-col items-center p-4 sm:p-6 bg-white rounded-xl shadow-md text-center gap-3">
              {v.icon}
              <span className="font-semibold text-base sm:text-lg text-primary">{v.title}</span>
              <p className="text-gray-600 text-xs sm:text-sm">{v.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Meet Our Brands */}
      <div className="about-animate max-w-7xl mx-auto mb-16 sm:mb-20">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6 sm:mb-8">Meet Our Brands</h2>
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center justify-center max-w-4xl mx-auto">
          {brands.map((b) => (
            <Card key={b.name} className="flex-1 flex flex-col items-center p-6 sm:p-8 bg-white rounded-xl shadow-md text-center gap-4">
              <Image
                src={b.logo}
                alt={b.name + ' logo'}
                width={70}
                height={70}
                className="object-contain rounded sm:w-[80px] sm:h-[80px]"
              />
              <span className="font-bold text-lg sm:text-xl text-primary">{b.name}</span>
              <p className="text-gray-600 text-xs sm:text-sm">{b.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-animate max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto bg-primary/10 p-6 sm:p-8 lg:p-10 rounded-lg text-center">
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">Ready to Equip Your Farm?</h3>
          <p className="text-gray-700 mb-6 text-sm sm:text-base">
            Contact us today to learn more about our products or to get expert advice on the best solutions for your agricultural needs.
          </p>
          <Link href="/contact-us">
            <Button className="text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
