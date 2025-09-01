"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

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

  // All GSAP animations removed

  if (isLoading) {
    return (
      <section ref={containerRef} className="w-full mx-auto mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl text-center font-bold">Popular Products</h2>
          <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
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
    <section ref={containerRef} className="w-full mx-auto mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="pt-0 md:pt-5 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <CardContent>
                <Image
                  className="mx-auto w-full md:w-2/3 h-40 object-contain"
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
                <div className="md:flex justify-between">
                  <h3 className="text-lg font-bold">{product.name}</h3>
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
