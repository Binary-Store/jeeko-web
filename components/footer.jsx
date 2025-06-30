"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegClock, FaWhatsapp } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Youtube, Linkedin, FacebookIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const productCategories = [
  {
    name: "Tillers",
    path: "/category/tiller",
    icon: "/svg/tiller-icon.svg",
  },
  {
    name: "Water Pumps",
    path: "/category/pumps",
    icon: "/svg/pump-icon.svg",
  },
  {
    name: "Generators",
    path: "/category/generator",
    icon: "/svg/generator-icon.svg",
  },
  {
    name: "Grass Cutters",
    path: "/category/grass-cutter",
    icon: "/svg/tiller-icon.svg",
  },
];

export default function Footer() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        ".footer-section",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".footer-section",
            start: "top 95%",
            end: "bottom 95%",
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
    <footer ref={containerRef} className="bg-[#F7F7F9] border-t border-gray-200 mt-8 pt-10">
      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-8">
        {/* Brand & Contact */}
        <div className="footer-section flex flex-col gap-5">
          <Image
            src="/images/logo.svg"
            alt="Jeeko Agro Industries Logo"
            height={50}
            width={150}
            className="bg-white rounded-lg p-2"
          />
          <p className="text-sm text-gray-700">
            Jeeko Agro Industries, a leading manufacturer of high-quality agricultural and farming tools, is dedicated to empowering farmers and agricultural businesses with reliable, innovative, and efficient equipment.
          </p>
          <div className="flex items-center gap-3">
            <span className="bg-primary rounded-xl p-2"><IoCall className="text-white size-5" /></span>
            <span className="text-gray-700 text-sm">+91 9156261648</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-primary rounded-xl p-2"><IoMdMail className="text-white size-5" /></span>
            <span className="text-gray-700 text-sm">marketing@jeeko.com</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-primary rounded-xl p-2"><FaRegClock className="text-white size-5" /></span>
            <span className="text-gray-700 text-sm">09:00 AM - 05:00 PM</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-primary rounded-xl p-2"><FaLocationDot className="text-white size-5" /></span>
            <span className="text-gray-700 text-sm">
              GAT No. 2022/5, Ambethan Bordara Road, Chakan Road, Chakan, Pune, Maharashtra, 410501
            </span>
          </div>
          <a
            href="https://wa.me/919156261648?text=Hello, I would like to inquire about your products."
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2" size="lg">
              <FaWhatsapp className="size-5" /> Enquire on WhatsApp
            </Button>
          </a>
        </div>
        {/* Product Categories */}
        <div className="footer-section">
          <h3 className="text-lg font-semibold text-primary mb-3">Product Categories</h3>
          <Separator className="h-0.5 bg-primary mb-4" />
          <div className="flex flex-col gap-3">
            {productCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.path}
                className="flex items-center gap-3 text-gray-700 hover:text-primary text-sm"
              >
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  quality={80}
                  height={24}
                  width={24}
                  priority
                  className="rounded-md object-cover"
                />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="text-lg font-semibold text-primary mb-3">Quick Links</h3>
          <Separator className="h-0.5 bg-primary mb-4" />
          <div className="flex flex-col gap-3">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/products">Products</Link>
            <Link href="/contact-us">Contact Us</Link>
            <Link href="/brochures">Brochures</Link>
          </div>
        </div>
        {/* Social Media */}
        <div className="footer-section">
          <h3 className="text-lg font-semibold text-primary mb-3">Connect with Us</h3>
          <Separator className="h-0.5 bg-primary mb-4" />
          <div className="flex gap-3 mt-4">
            <Button
              className="rounded-full"
              size="icon"
              aria-label="Facebook"
              onClick={() => window.open("https://www.facebook.com/profile.php?id=61555166633293")}
            >
              <FacebookIcon />
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              aria-label="YouTube"
              onClick={() => window.open("https://www.youtube.com/@prostarcnc7217")}
            >
              <Youtube />
            </Button>
            <Button
              className="rounded-full"
              size="icon"
              aria-label="LinkedIn"
              onClick={() => window.open("https://www.linkedin.com/company/shubhline-automation-pvt-ltd/?viewAsMember=true")}
            >
              <Linkedin />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-primary/10 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
        &copy; {new Date().getFullYear()} Jeeko Agro Industries. All rights reserved.
      </div>
    </footer>
  );
}
