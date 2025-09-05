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

export default function Footer() {
  const containerRef = useRef();

  return (
    <footer ref={containerRef} className="bg-[#F7F7F9] border-t border-gray-200 mt-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 pb-8">
        {/* Brand Section */}
        <div className="footer-section flex flex-col gap-4 sm:gap-5">
          <Image
            src="/images/logo.svg"
            alt="Jeeko Agro Industries Logo"
            height={50}
            width={150}
            className="rounded-lg p-2 w-fit"
          />
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Jeeko Agro Industries, a leading manufacturer of high-quality agricultural and farming tools, is dedicated to empowering farmers and agricultural businesses with reliable, innovative, and efficient equipment.
          </p>

          <a
            href="https://wa.me/919925232951?text=Hello, I would like to inquire about your products."
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2" size="sm">
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" /> Enquire on WhatsApp
            </Button>
          </a>
        </div>

        {/* Contact Information */}
        <div className="footer-section">
          <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Contact Info</h3>
          <Separator className="h-0.5 bg-primary mb-4" />

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="bg-primary rounded-xl p-2 flex-shrink-0">
                <IoCall className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="text-gray-700 text-xs sm:text-sm">+91 99252 32951</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-primary rounded-xl p-2 flex-shrink-0">
                <IoMdMail className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="text-gray-700 text-xs sm:text-sm">jeekoagritech@gmail.com</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-primary rounded-xl p-2 flex-shrink-0">
                <FaRegClock className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="text-gray-700 text-xs sm:text-sm">09:00 AM - 06:00 PM</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="bg-primary rounded-xl p-2 flex-shrink-0 mt-0.5">
                <FaLocationDot className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="text-gray-700 text-xs sm:text-sm leading-relaxed max-w-xs">
                Plot no:-332, Road-R, Gate NO. 2, Phase -1 khirasara GIDC,
                Tal. Lodhika, Rajkot -360021, Gujarat, India.
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Quick Links</h3>
          <Separator className="h-0.5 bg-primary mb-4" />
          <div className="flex flex-col gap-2 sm:gap-3">
            <Link href="/" className="text-xs sm:text-sm text-gray-700 hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <Link href="/about" className="text-xs sm:text-sm text-gray-700 hover:text-primary transition-colors duration-200">
              About Us
            </Link>
            <Link href="/products" className="text-xs sm:text-sm text-gray-700 hover:text-primary transition-colors duration-200">
              Products
            </Link>
            <Link href="/contact-us" className="text-xs sm:text-sm text-gray-700 hover:text-primary transition-colors duration-200">
              Contact Us
            </Link>
            <Link href="/brochures" className="text-xs sm:text-sm text-gray-700 hover:text-primary transition-colors duration-200">
              Brochures
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Connect with Us</h3>
          <Separator className="h-0.5 bg-primary mb-4" />
          <div className="flex gap-3 mt-4">
            <Button
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              size="icon"
              aria-label="Facebook"
              onClick={() => window.open("https://www.facebook.com/profile.php?id=61555166633293")}
            >
              <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              size="icon"
              aria-label="YouTube"
              onClick={() => window.open("https://www.youtube.com/@prostarcnc7217")}
            >
              <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              size="icon"
              aria-label="LinkedIn"
              onClick={() => window.open("https://www.linkedin.com/company/shubhline-automation-pvt-ltd/?viewAsMember=true")}
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="w-full bg-primary/10 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} Jeeko Agro Industries. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
