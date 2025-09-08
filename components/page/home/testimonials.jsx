"use client";

import Image from "next/image";
import { Star } from "lucide-react";

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
  return (
    <section className="w-full mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">
          What Our Customers Say?
        </h2>
        <div className="w-24 sm:w-32 h-1 bg-primary mx-auto my-2 sm:my-4"></div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-6 sm:my-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={60}
                  height={60}
                  className="rounded-full w-12 h-12 sm:w-14 sm:h-14 object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                ))}
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {testimonial.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
