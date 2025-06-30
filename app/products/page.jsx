"use client";

import data from "@/config/data";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const containerRef = useRef();


  return (
    <section ref={containerRef} className="w-full mx-auto my-10">
      <h2 className="products-title text-4xl text-center font-bold">All Products</h2>
      <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
      <div className="w-[95%] mx-auto">
        <div className="grid my-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.products.map((product, index) => (
            <Card
              key={product.id}
              className="hover:shadow-lg hover:scale-105 transition-all duration-300 product-card pt-0 md:pt-5"
            >
              <CardContent>
                <Link href={`/products/${product.id}`} className="block group focus:outline-none">
                  <Image
                    className="mx-auto w-full md:w-2/3 h-40 object-contain group-hover:scale-105 transition-transform"
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    quality={100}
                    priority={index < 4}
                  />
                  <div className="md:flex justify-between mt-2">
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
                </Link>
                <Button
                  asChild
                  className="mt-4 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2"
                  size="lg"
                >
                  <a
                    href={`https://wa.me/919156261648?text=${encodeURIComponent(
                      `Hello, I'm interested in the ${product.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Enquire on WhatsApp"
                  >
                    <FaWhatsapp className="size-5" /> Enquire on WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}