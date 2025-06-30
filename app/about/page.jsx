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
    icon: <FaSeedling className="text-primary size-8" />, title: "Innovation", desc: "We constantly innovate to bring the best solutions to Indian agriculture."
  },
  {
    icon: <FaHandsHelping className="text-primary size-8" />, title: "Support", desc: "Our team is always ready to help, from purchase to after-sales."
  },
  {
    icon: <FaAward className="text-primary size-8" />, title: "Quality", desc: "Every product is rigorously tested for reliability and durability."
  },
  {
    icon: <FaLeaf className="text-primary size-8" />, title: "Sustainability", desc: "We care for the earth and design products with the future in mind."
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
    <section ref={containerRef} className="w-full min-h-[80vh] bg-[#F7F7F9] pb-10">
      {/* Hero Section */}
      <div className="relative w-full h-[340px] md:h-[420px] flex items-center justify-center bg-primary/90 overflow-hidden mb-16">
        <Image src="/images/bg-doodle.png" alt="About Hero" fill className="object-cover object-center opacity-10" />
        <div className="relative z-10 text-center w-full">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo.svg" alt="Jeeko Logo" width={120} height={60} className="object-contain" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow">Empowering Indian Agriculture</h1>
          <p className="text-lg text-primary-foreground max-w-2xl mx-auto mb-6 drop-shadow">
            Jeeko Agro Industries is on a mission to deliver innovative, reliable, and sustainable solutions for every Indian farmer.
          </p>
        </div>
      </div>

      {/* Timeline / Journey */}
      <div className="about-animate max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>
        <div className="flex flex-col gap-8">
          {timeline.map((item, i) => (
            <div key={item.year} className={`flex flex-col md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center gap-8`}> 
              <Card className="flex-1 p-8 bg-white rounded-xl shadow-md">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-primary font-bold text-xl">{item.year}</span>
                  <Separator className="flex-1 bg-primary/30" />
                  <span className="font-semibold text-lg">{item.title}</span>
                </div>
                <p className="text-gray-600 mb-2">{item.desc}</p>
              </Card>
              <div className="flex-shrink-0">
                <Image src={item.image} alt={item.title} width={90} height={90} className="rounded-lg shadow object-contain bg-[#f5f5f5]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values */}
      <div className="about-animate max-w-5xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <Card key={v.title} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md text-center gap-3">
              {v.icon}
              <span className="font-semibold text-lg text-primary">{v.title}</span>
              <p className="text-gray-600 text-sm">{v.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Meet Our Brands */}
      <div className="about-animate max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Brands</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {brands.map((b) => (
            <Card key={b.name} className="flex-1 flex flex-col items-center p-8 bg-white rounded-xl shadow-md text-center gap-4">
              <Image src={b.logo} alt={b.name + ' logo'} width={80} height={80} className="object-contain rounded" />
              <span className="font-bold text-xl text-primary">{b.name}</span>
              <p className="text-gray-600 text-sm">{b.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="about-animate max-w-2xl mx-auto bg-primary/10 p-10 rounded-lg text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to Equip Your Farm?</h3>
        <p className="text-gray-700 mb-6">
          Contact us today to learn more about our products or to get expert advice on the best solutions for your agricultural needs.
        </p>
        <Link href="/contact-us">
          <Button className="text-lg px-8 py-3">Contact Us</Button>
        </Link>
      </div>
    </section>
  );
}
