"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

// Skeleton Component
function PopularProductSkeleton() {
  return (
    <section className="w-full mx-auto mb-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Title skeleton */}
        <div className="text-center">
          <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto animate-pulse"></div>
        </div>
        
        {/* Red line skeleton */}
        <div className="w-32 h-1 bg-gray-200 mx-auto my-2 animate-pulse rounded"></div>
        
        {/* See all link skeleton */}
        <div className="flex justify-end mb-5">
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>

        {/* Products grid skeleton */}
        <div className="grid my-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {/* Generate 8 skeleton cards */}
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-4 flex flex-col h-full">
                {/* Image skeleton */}
                <div className="flex-shrink-0 mb-4">
                  <div className="mx-auto w-full h-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                {/* Content skeleton */}
                <div className="flex flex-col flex-grow">
                  {/* Product name skeleton */}
                  <div className="mb-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  
                  {/* Description skeleton */}
                  <div className="flex-grow mb-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                  
                  {/* Price skeleton */}
                  <div className="mt-auto">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PopularProduct() {
  const containerRef = useRef();
  const { data: productsResponse, isLoading, error } = useProducts();

  // Extract products from API response - show all products once
  let popularProducts = [];
  if (productsResponse?.data && Array.isArray(productsResponse.data)) {
    popularProducts = productsResponse.data;
  }

  const getProductImageUrl = (product) => {
    if (product.images && product.images.length > 0 && product.images[0].url) {
      return product.images[0].url;
    }
    return "/images/placeholder-product.png";
  };

  const getProductImageAlt = (product) => {
    if (product.images && product.images.length > 0 && product.images[0].alt) {
      return product.images[0].alt;
    }
    return product.name || "Product";
  };

  const getCategoryName = (product) => {
    if (product.categoryDetails && product.categoryDetails.length > 0) {
      return product.categoryDetails[0].name;
    }
    if (product.categories && product.categories.length > 0) {
      if (typeof product.categories[0] === 'object' && product.categories[0].name) {
        return product.categories[0].name;
      }
      return product.categories[0];
    }
    return "General";
  };

  // Show skeleton during loading
  if (isLoading) {
    return <PopularProductSkeleton />;
  }

  if (error) {
    return (
      <section ref={containerRef} className="w-full mx-auto mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl text-center font-bold">Popular Products</h2>
          <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
          <div className="text-center mt-8">
            <p className="text-red-600">Error loading products: {error.message}</p>
            <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }

  if (!popularProducts.length) {
    return (
      <section ref={containerRef} className="w-full mx-auto mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl text-center font-bold">Popular Products</h2>
          <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
          <div className="text-center mt-8">
            <p className="text-gray-600">No products available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="w-full mx-auto mb-8 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-center font-bold">Popular Products</h2>
        <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
        <div className="flex justify-end">
          <Link href="/products" className="flex gap-2 text-primary font-bold hover:underline">
            See all <ChevronRight />
          </Link>
        </div>
        {/* Updated grid classes for single column on mobile */}
        <div className="grid my-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {popularProducts.map((product, index) => (
            <Card
              key={product._id}
              className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <CardContent className="p-4 flex flex-col h-full">
                {/* Image Container - Fixed height */}
                <div className="flex-shrink-0 mb-4">
                  <Image
                    className="mx-auto w-full h-40 object-contain"
                    src={getProductImageUrl(product)}
                    alt={getProductImageAlt(product)}
                    width={400}
                    height={400}
                    quality={100}
                    priority={index < 4}
                    onError={(e) => {
                      e.target.src = "/images/placeholder-product.png";
                    }}
                  />
                </div>
                
                {/* Content Container - Flexible height */}
                <div className="flex flex-col flex-grow">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Description - Takes available space */}
                  <p className="text-xs md:text-sm text-gray-500 flex-grow mb-3 line-clamp-3">
                    {product.description}
                  </p>
                  
                  {/* Price - Always at bottom */}
                  <div className="mt-auto">
                    <p className="text-sm">
                      <span className="text-primary text-lg font-bold">
                        ₹{product.price}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
