"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { useProductCategories } from "@/hooks/useProductCategories";

const paginationStyles = `
  .swiper-pagination-bullet {
    background: #dc2626 !important;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    background: #dc2626 !important;
    opacity: 1;
  }
  .swiper-slide {
    height: auto !important;
    display: flex !important;
  }
  .product-categories-slider .swiper-slide > a {
    width: 100%;
    height: 100%;
  }
  .product-categories-slider .swiper-slide .bg-white {
    height: 280px !important; /* Fixed height for all cards */
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
`;


// Skeleton Component
function ProductCategoriesSkeleton() {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Title skeleton */}
        <div className="text-center">
          <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto animate-pulse"></div>
        </div>
        
        {/* Red line skeleton */}
        <div className="w-32 h-1 bg-gray-200 mx-auto my-2 animate-pulse rounded"></div>

        {/* Cards skeleton */}
        <div className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Generate 8 skeleton cards */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm min-h-[240px] flex flex-col items-center justify-center">
                {/* Image skeleton */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-4">
                  <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                
                {/* Title skeleton */}
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Pagination dots skeleton */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductCategories() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const sliderRef = useRef(null);

  const { data: categoriesResponse, isLoading, error } = useProductCategories();
  
  const categories = categoriesResponse?.data || [];

  // Show skeleton during loading
  if (isLoading) {
    return <ProductCategoriesSkeleton />;
  }

  if (error) {
    return (
      <section ref={sectionRef} className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 ref={headingRef} className="text-4xl text-center font-bold">
            Product Category
          </h2>
          <div className="red-line w-32 h-1 bg-red-600 mx-auto my-6"></div>
          <div className="mt-12 text-center text-red-600">
            Error loading categories: {error.message}
          </div>
        </div>
      </section>
    );
  }

  // No categories state
  if (!categories.length) {
    return (
      <section ref={sectionRef} className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 ref={headingRef} className="text-4xl text-center font-bold">
            Product Category
          </h2>
          <div className="red-line w-32 h-1 bg-red-600 mx-auto my-6"></div>
          <div className="mt-12 text-center text-gray-600">
            No categories available
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <style jsx global>
        {paginationStyles}
      </style>
      {/* Same width container structure as Hero - Perfect match */}
      <div className="max-w-7xl mx-auto">
        <h2 ref={headingRef} className="text-4xl text-center font-bold">
          Product Category
        </h2>
        <div className="red-line w-32 h-1 bg-red-600 mx-auto my-2"></div>

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
              delay: 5000,
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
              <SwiperSlide key={category._id || category.id || index}>
                <Link href={`/category/${category._id || category.id}`} className="block">
                  <div className="bg-white rounded-lg p-6 shadow-sm transition-all duration-300 flex flex-col items-center justify-center min-h-[240px] relative group hover:shadow-lg hover:transform hover:scale-105">
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-4 transition-transform duration-300">
                      <Image
                        src={category.image || "/images/placeholder-category.png"}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
                        className="object-contain rounded-lg"
                        onError={(e) => {
                          e.target.src = "/images/placeholder-category.png";
                        }}
                      />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-primary text-center transition-colors duration-300 px-2">
                      {category.name}
                    </h3>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-lg" />
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
