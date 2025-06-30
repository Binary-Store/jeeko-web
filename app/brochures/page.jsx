"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const brochures = [
  {
    brand: "JEEKO",
    logo: "/images/logo.svg",
    image: "/images/jeeko-brochure.png",
    title: "JEEKO Product Brochure",
    description: "Explore our full range of high-quality generators, tillers, pumps, and more. Download the JEEKO brochure for detailed specs, features, and support info.",
    link: "#",
  },
  {
    brand: "Kishan King",
    logo: "/images/kk-logo.png",
    image: "/images/kk-brochure.png",
    title: "Kishan King Product Brochure",
    description: "Discover agricultural equipment and tools designed for Indian farmers. Download the Kishan King brochure for product details and support.",
    link: "#",
  },
];

export default function BrochuresPage() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        ".brochure-card",
        { y: 80, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".brochure-card",
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
    <section ref={containerRef} className="w-full min-h-[80vh] bg-[#F7F7F9] py-10 px-2">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Download Our Brochures</h1>
        <div className="w-24 h-1 bg-primary mx-auto my-2"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          Get detailed information about our products, features, and support. Download the latest brochures for JEEKO and Kishan King brands.
        </p>
        {/* <div className="flex justify-center">
          <Image src="/images/bg-doodle.png" alt="Brochures" width={180} height={120} className="rounded-lg shadow-md object-cover" />
        </div> */}
      </div>

      {/* Brochure Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {brochures.map((b, i) => (
          <Card key={b.brand} className="brochure-card p-6 flex flex-col gap-5 bg-white rounded-xl shadow-md">
            <div className="flex items-center gap-4 mb-2">
              <Image src={b.logo} alt={b.brand + ' logo'} width={48} height={48} className="object-contain rounded" />
              <h2 className="text-2xl font-bold text-primary">{b.brand}</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-5 items-center">
              <Image src={b.image} alt={b.title} width={180} height={240} className="rounded-lg shadow object-contain bg-[#f5f5f5] w-40 h-52" />
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-lg font-semibold mb-1">{b.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{b.description}</p>
                <Button asChild className="w-fit mt-2">
                  <a href={b.link} download>
                    Download Brochure
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* How to Use/Why Download Section */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-3 text-primary">Why Download Our Brochures?</h2>
        <Separator className="w-16 mx-auto mb-4 bg-primary" />
        <ul className="list-disc list-inside text-gray-700 text-left max-w-xl mx-auto space-y-2">
          <li>Get detailed product specifications and features.</li>
          <li>Compare models and find the best fit for your needs.</li>
          <li>Access support and warranty information.</li>
          <li>Stay updated with our latest offerings and innovations.</li>
        </ul>
      </div>
    </section>
  );
} 