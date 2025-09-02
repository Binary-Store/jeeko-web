"use client";

import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactUs() {
  const containerRef = useRef();

  useGSAP(
    () => {
      // Header animation - matching PopularProduct style
      gsap.fromTo(
        "h2",
        {
          y: 40,
          opacity: 0,
          scale: 0.9,
          rotationX: 10,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: "h2",
            start: "top 90%",
            end: "bottom 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Contact cards animation - enhanced with 3D effects
      gsap.fromTo(
        ".contact-card",
        {
          y: 60,
          opacity: 0,
          scale: 0.85,
          rotationY: 15,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".contact-card",
            start: "top 85%",
            end: "bottom 70%",
            scrub: 0.3,
          },
        }
      );

      // Contact form animation - enhanced entrance
      gsap.fromTo(
        ".contact-form",
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 85%",
            end: "bottom 70%",
            scrub: 0.3,
          },
        }
      );

      // Hover animation for contact cards
      document.querySelectorAll(".contact-card").forEach((card) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          duration: 0.4,
          ease: "power3.out",
        });

        card.addEventListener("mouseenter", () => tl.play());
        card.addEventListener("mouseleave", () => tl.reverse());
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="bg-primary w-full py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        {/* Contact Information Section */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Get in touch</h2>
          <h3 className="text-white text-lg sm:text-xl mb-2"> We're Here to Help</h3>
          <p className="text-white text-sm sm:text-base mt-2 mb-6 leading-relaxed">
            If you have any questions, concerns, or feedback, we're here to
            assist you. Our team is dedicated to providing support and ensuring
            your experience is smooth and hassle-free. Don't hesitate to reach
            out to us—we'd love to hear from you!
          </p>
          
          <div className="bg-gray-100 rounded-xl p-4 sm:p-6 grid grid-cols-1 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl contact-card shadow-sm">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <IoCall className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">
                  Call Us
                </div>
                <div className="text-sm sm:text-base">+91 9156261648</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl contact-card shadow-sm">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <FaRegClock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">
                  Operational
                </div>
                <div className="text-sm sm:text-base">09:00 AM - 05:00 PM</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl contact-card shadow-sm">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <IoMdMail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">Email</div>
                <div className="text-sm sm:text-base">marketing@jeeko.com</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 sm:p-4 rounded-xl contact-card shadow-sm">
              <div className="bg-primary rounded-xl p-2 sm:p-3 flex-shrink-0">
                <FaLocationDot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-lg sm:text-xl font-bold">
                  Location
                </div>
                <div className="text-sm sm:text-base">
                  GAT No. 2022/5, Ambethan Bordara Road, Chakan Road, Chakan,
                  Pune, Maharashtra, 410501
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form Section */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 contact-form shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">
              Send us a message
            </h2>
            <form className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Enter your subject"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  className="w-full min-h-[120px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
