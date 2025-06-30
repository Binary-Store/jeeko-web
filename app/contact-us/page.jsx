"use client";

import Image from "next/image";
import { IoCall } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const containerRef = useRef();
  const [success, setSuccess] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        ".contact-hero",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".contact-hero",
            start: "top 90%",
            end: "200px 90%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 1.2,
        }
      );
      gsap.fromTo(
        ".contact-info-card",
        { y: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".contact-info-card",
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
      gsap.fromTo(
        ".contact-form-card",
        { x: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".contact-form-card",
            start: "top 90%",
            end: "bottom 90%",
            toggleActions: "play none none reverse",
            scrub: 1,
          },
          x: 0,
          opacity: 1,
          duration: 1.2,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full min-h-[80vh] bg-[#F7F7F9] py-10 px-2">
      {/* Hero Section */}
      <div className="contact-hero max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <div className="w-24 h-1 bg-primary mx-auto my-2"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
          We're here to help! Reach out for product inquiries, support, or just to say hello. Our team will get back to you as soon as possible.
        </p>
        <div className="flex justify-center">
          <Image src="/images/bg-doodle.png" alt="Contact" width={180} height={120} className="rounded-lg shadow-md object-cover" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Contact Info */}
        <div className="space-y-5">
          <div className="contact-info-card p-6 flex items-start gap-4 bg-white rounded-xl">
            <div className="bg-primary rounded-xl p-3">
              <IoCall className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Call Us</div>
              <div className="text-gray-600">+91 9156261648</div>
            </div>
          </div>
          <div  className="contact-info-card p-6 flex items-start gap-4 bg-white rounded-xl">
            <div className="bg-primary rounded-xl p-3">
              <IoMdMail className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Email</div>
              <div className="text-gray-600">marketing@jeeko.com</div>
            </div>
          </div>
          <div className="contact-info-card p-6 flex items-start gap-4 bg-white rounded-xl">
            <div className="bg-primary rounded-xl p-3">
              <FaRegClock className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Operational Hours</div>
              <div className="text-gray-600">09:00 AM - 05:00 PM</div>
            </div>
          </div>
          <div className="contact-info-card p-6 flex items-start gap-4 bg-white rounded-xl">
            <div className="bg-primary rounded-xl p-3">
              <FaLocationDot className="size-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">Location</div>
              <div className="text-gray-600">
                GAT No. 2022/5, Ambethan Bordara Road, Chakan Road, Chakan,<br />
                Pune, Maharashtra, 410501
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/919156261648?text=Hello, I would like to inquire about your products."
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2" size="lg">
              <FaWhatsapp className="size-5" /> Enquire on WhatsApp
            </Button>
          </a>
        </div>
        {/* Contact Form */}
        <Card className="contact-form-card p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Send us a message</h2>
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
              Thank you for contacting us! We'll get back to you soon.
            </div>
          )}
          <form
            className="space-y-4"
            onSubmit={e => {
              e.preventDefault();
              setSuccess(true);
              setTimeout(() => setSuccess(false), 4000);
            }}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input type="text" id="name" name="name" placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input type="email" id="email" name="email" placeholder="Enter your email address" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject
              </label>
              <Input type="text" id="subject" name="subject" placeholder="Enter your subject" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea id="message" name="message" placeholder="Type your message here..." rows={4} required />
            </div>
            <Button type="submit" className="w-full mt-2" size="lg">
              Send Message
            </Button>
          </form>
        </Card>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto mt-16 rounded-xl overflow-hidden shadow-md">
        <iframe
          title="Jeeko Agro Industries Location"
          src="https://www.google.com/maps?q=GAT+No.+2022%2F5%2C+Ambethan+Bordara+Road%2C+Chakan+Road%2C+Chakan%2C+Pune%2C+Maharashtra%2C+410501&output=embed"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
} 