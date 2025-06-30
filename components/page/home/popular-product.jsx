"use client";

import data from "@/config/data";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

let popularProducts = data.products.filter((product) => product.is_popular);

popularProducts = [...popularProducts, ...popularProducts.reverse()];

export default function PopularProduct() {
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
          duration: 1,
        }
      );

      gsap.fromTo(
        ".product-card",
        {
          y: 100,
          opacity: 0,
        },
        {
          scrollTrigger: {
            trigger: ".product-card",
            start: "100px 95%",
            end: "bottom 95%",
            toggleActions: "play none none reverse",
            scrub: 1,
          },
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.5,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full mx-auto mb-8">
      <h2 className="text-4xl text-center font-bold">Popular Products</h2>
      <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
      <div className="w-[95%] mx-auto flex justify-end">
        <Link href="/products" className="flex gap-2 text-primary font-bold">
          See all <ChevronRight />
        </Link>
      </div>
      <div className="w-[95%] mx-auto">
        <div className="grid my-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {popularProducts.map((product, index) => (
            <Card
              key={index}
              className="hover:shadow-lg hover:scale-105 transition-all duration-300 product-card pt-0 md:pt-5"
            >
              <CardContent>
                <Image
                  className="mx-auto w-full md:w-2/3 h-40 object-contain"
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  quality={100}
                  priority={index < 4}
                />

                <div className="md:flex justify-between">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <p className="text-xs md:text-sm mt-2 text-gray-500">
                  {product.description}
                </p>
                <p className="md:text-sm mt-2 text-gray-500">
                  Price:{" "}
                  <span className="text-primary text-lg font-bold">
                    ₹{product.price}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
