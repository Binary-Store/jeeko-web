"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Add custom styles for pagination bullets
const paginationStyles = `
  .swiper-pagination-bullet {
    background: #dc2626 !important;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    background: #dc2626 !important;
    opacity: 1;
  }
`;

const categories = [
  {
    name: "Tiller",
    image: "/images/category/tiller.png",
    href: "/category/tiller",
  },
  {
    name: "Hand tools",
    image: "/images/category/hand-tools.png",
    href: "/category/hand-tools",
  },
  {
    name: "Generator",
    image: "/images/category/generator.jpg",
    href: "/category/generator",
  },
  {
    name: "Pumps",
    image: "/images/category/pump.jpg",
    href: "/category/pumps",
  },
  {
    name: "Grass Cutter",
    image: "/images/category/grass-cutter.png",
    href: "/category/grass-cutter",
  },
];

export default function ProductCategories() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the heading
      gsap.fromTo(
        headingRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Animate the red line
      gsap.fromTo(
        ".red-line",
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ".red-line",
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // Animate the slider
      gsap.fromTo(
        sliderRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sliderRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-8">
      <style jsx global>
        {paginationStyles}
      </style>
      <div className="w-[95%] mx-auto">
        <h2 ref={headingRef} className="text-4xl text-center font-bold">
          Product Category
        </h2>
        <div className="red-line w-32 h-1 bg-red-600 mx-auto my-6 transform origin-left"></div>

        <div ref={sliderRef} className="mt-12">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="product-categories-slider !pb-12"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <Link href={category.href} className="block">
                  <div className="bg-white rounded-lg p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] relative group">
                    <div className="relative w-56 h-56 mb-6 group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={category.image}
                        alt={category.name}
                        quality={100}
                        width={224}
                        height={224}
                        priority={index < 4}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h3 className="text-xl text-gray-800 font-medium text-center group-hover:text-red-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
