"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Visal Kumar",
    role: "Farm Owner",
    image: "/images/testimonials/person-1.jpg",
    rating: 5,
    comment:
      "The JEEKO generator has been a game-changer for my farm. Reliable power supply even during peak summer months. Excellent fuel efficiency and minimal maintenance required.",
  },
  {
    name: "Amit Patel",
    role: "Business Owner",
    image: "/images/testimonials/person-2.jpeg",
    rating: 5,
    comment:
      "As a small business owner, I needed a reliable power backup solution. JEEKO's generator has never let me down. Their customer service is exceptional too!",
  },
  {
    name: "Vallabhbhai",
    role: "Farmer",
    image: "/images/testimonials/person-3.jpeg",
    rating: 4,
    comment:
      "Great investment for my home. The generator is quiet, efficient and starts instantly during power cuts. Would definitely recommend to others.",
  },
];

export default function Testimonials() {
  const containerRef = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        "h2",
        {
          y: 50,
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: "h2",
            start: "top 90%",
            end: "200px 90%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 2,
        }
      );

      gsap.fromTo(
        ".testimonial-card",
        {
          opacity: 0,
          rotateY: 90,
        },
        {
          scrollTrigger: {
            trigger: ".testimonial-card",
            start: "top 95%",
            end: "200px 95%",
            toggleActions: "play none none reverse",
            // scrub: 1,
          },

          opacity: 1,
          rotateY: 0,
          stagger: 0.5,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full mx-auto my-10">
      <h2 className="text-4xl text-center font-bold">
        What Our Customers Say?
      </h2>
      <div className="w-32 h-1 bg-primary mx-auto my-2"></div>

      <div className="w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-7">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow testimonial-card"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={60}
                height={60}
                className="rounded-full size-14 object-cover"
              />
              <div>
                <h3 className="font-bold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="size-4 fill-primary text-primary" />
              ))}
            </div>

            <p className="text-muted-foreground">{testimonial.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
