"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import banner from "@/public/images/banners/brochures.png";
import banner_md from "@/public/images/banners/brochures_md.png";

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

  // All GSAP animations removed

  return (
    <section ref={containerRef} className="w-full min-h-[80vh] px-4 sm:px-6 lg:px-8 pb-10 sm:pb-10">
      {/* Hero Banner Section - Same pattern as About page */}
      <div className="w-full pb-10">
        <div className="max-w-7xl rounded-2xl bg-white mx-auto overflow-hidden shadow-lg">
          {/* Mobile Image */}
          <Image
            src={banner}
            alt="Brochures Banner Mobile"
            width={1980}
            height={709}
            className="block md:hidden w-full h-auto max-h-[89vh] sm:max-h-[70vh] rounded-2xl object-contain"
            priority
          />

          {/* Desktop Image */}
          <Image
            src={banner_md}
            alt="Brochures Banner Desktop"
            width={1980}
            height={709}
            className="hidden md:block w-full h-auto max-h-[70vh] lg:max-h-[96vh] rounded-2xl object-contain"
            priority
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Updated with reduced spacing */}
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 sm:mb-6">Our Brochures</h1>
          <div className="w-24 sm:w-32 h-1 bg-primary mx-auto mb-2"></div>
        </div>

        {/* Brochure Cards - Reduced gap */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {brochures.map((b, i) => (
            <Card key={b.brand} className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-1">
                <Image 
                  src={b.logo} 
                  alt={b.brand + ' logo'} 
                  width={40} 
                  height={40} 
                  className="object-contain rounded sm:w-[48px] sm:h-[48px]" 
                />
                <h2 className="text-lg sm:text-xl font-bold text-primary">{b.brand}</h2>
              </div>
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
                <Image 
                  src={b.image} 
                  alt={b.title} 
                  width={160} 
                  height={220} 
                  className="rounded-lg shadow object-contain bg-[#f5f5f5] w-28 h-36 sm:w-32 sm:h-40" 
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-sm sm:text-base font-semibold mb-1">{b.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">{b.description}</p>
                  <Button asChild className="w-fit mt-1">
                    <a href={b.link} download>
                      Download Brochure
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Why Download Section - Reduced spacing */}
        <div className="max-w-5xl mx-auto bg-primary/10 p-4 sm:p-6 lg:p-8 rounded-lg text-center">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Why Download Our Brochures?</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-4"></div>
          <ul className="list-disc list-inside text-gray-700 text-left max-w-xl mx-auto space-y-1 text-xs sm:text-sm mb-4">
            <li>Get detailed product specifications and features</li>
            <li>Compare models and find the best fit for your needs</li>
            <li>Access support and warranty information</li>
            <li>Stay updated with our latest offerings and innovations</li>
          </ul>
          <p className="text-gray-700 text-xs sm:text-sm">
            Download our comprehensive brochures and make informed decisions about your agricultural equipment needs.
          </p>
        </div>
      </div>
    </section>
  );
}
