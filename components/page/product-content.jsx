// components/ProductsContent.jsx
"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useProducts } from "@/hooks/useProducts";
import { useProductCategories } from "@/hooks/useProductCategories";
import banner from "@/public/images/banners/allproduct.png";
import banner_md from "@/public/images/banners/allProduct_md.png";

export default function ProductsContent() {
  const containerRef = useRef();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Fetch products from API with better error handling
  const { 
    data: productsResponse, 
    isLoading, 
    error,
    refetch 
  } = useProducts();

  // Fetch categories for filter dropdown
  const { data: categoriesResponse } = useProductCategories();
  
  // Extract products and categories array from API response
  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  // Get selected category name for display
  const selectedCategoryName = useMemo(() => {
    if (selectedCategory === "all") return "All Products";
    const category = categories.find(cat => cat._id === selectedCategory);
    return category ? category.name : "All Products";
  }, [selectedCategory, categories]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    
    return products.filter(product => {
      if (product.categories && Array.isArray(product.categories)) {
        return product.categories.some(category => {
          // Handle both populated and unpopulated category references
          const categoryId = typeof category === 'object' ? category._id : category;
          return categoryId === selectedCategory;
        });
      }
      return false;
    });
  }, [products, selectedCategory]);

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full mx-auto">
        {/* Hero Banner - Loading State */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
          <div className="max-w-7xl rounded-2xl bg-gray-200 animate-pulse mx-auto overflow-hidden shadow-lg h-[50vh] sm:h-[60vh] lg:h-[70vh]">
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">Loading Products...</h2>
          <div className="w-24 sm:w-32 h-1 bg-primary mx-auto my-4"></div>
        </div>
      </section>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <section className="w-full mx-auto">
        {/* Hero Banner - Error State */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
          <div className="max-w-7xl rounded-2xl bg-white mx-auto overflow-hidden shadow-lg">
            {/* Mobile Image */}
            <Image
              src={banner_md}
              alt="All Products Banner Mobile"
              width={1980}
              height={709}
              className="block md:hidden w-full h-auto max-h-[50vh] sm:max-h-[60vh] rounded-2xl object-contain"
              priority
            />

            {/* Desktop Image */}
            <Image
              src={banner}
              alt="All Products Banner Desktop"
              width={1980}
              height={709}
              className="hidden md:block w-full h-auto max-h-[60vh] lg:max-h-[70vh] rounded-2xl object-contain"
              priority
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">Error Loading Products</h2>
          <div className="w-24 sm:w-32 h-1 bg-primary mx-auto my-4"></div>
          <div className="text-center mt-12 bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-red-600 mb-4">
              Error loading products: {error?.response?.data?.error || error.message}
            </p>
            <div className="space-y-2">
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <p className="text-sm text-gray-500">
                If the problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No products state
  if (!products.length) {
    return (
      <section className="w-full mx-auto">
        {/* Hero Banner - No Products State */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
          <div className="max-w-7xl rounded-2xl bg-white mx-auto overflow-hidden shadow-lg">
            {/* Mobile Image */}
            <Image
              src={banner_md}
              alt="All Products Banner Mobile"
              width={1980}
              height={709}
              className="block md:hidden w-full h-auto max-h-[50vh] sm:max-h-[60vh] rounded-2xl object-contain"
              priority
            />

            {/* Desktop Image */}
            <Image
              src={banner}
              alt="All Products Banner Desktop"
              width={1980}
              height={709}
              className="hidden md:block w-full h-auto max-h-[60vh] lg:max-h-[70vh] rounded-2xl object-contain"
              priority
            />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">No Products Available</h2>
          <div className="w-24 sm:w-32 h-1 bg-primary mx-auto my-4"></div>
          <div className="text-center mt-12 bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">No products available at the moment</p>
            <p className="text-sm text-gray-500">Please check back later or contact us for more information</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="w-full min-h-[80vh]  px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
      {/* Hero Banner Section - Same pattern as About page */}
      <div className="w-full pb-10">
        <div className="max-w-7xl rounded-2xl bg-white mx-auto overflow-hidden shadow-lg">
          {/* Mobile Image */}
          <Image
            src={banner}
            alt="All Products Banner Mobile"
            width={1980}
            height={709}
            className="block md:hidden w-full h-auto max-h-[89vh] sm:max-h-[70vh] rounded-2xl object-contain"
            priority
          />

          {/* Desktop Image */}
          <Image
            src={banner_md}
            alt="All Products Banner Desktop"
            width={1980}
            height={709}
            className="hidden md:block w-full h-auto max-h-[70vh] lg:max-h-[96vh] rounded-2xl object-contain"
            priority
          />
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto ">
        {/* Header with Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="products-title text-4xl sm:text-5xl font-bold">{selectedCategoryName}</h2>
            <div className="w-40 sm:w-60 h-1 bg-primary mx-auto sm:mx-0 mt-2"></div>
            {selectedCategory !== "all" && (
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white border-gray-300">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid or No Results */}
        {filteredProducts.length > 0 ? (
          <div className="grid my-6 sm:my-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <Card
                key={product._id}
                className="hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white"
              >
                <CardContent className="p-4 sm:p-6">
                  <Link href={`/products/${product._id}`} className="block group focus:outline-none">
                    <div className="relative w-full h-40 sm:h-48 mb-3 sm:mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                        src={product.images?.[0]?.url || "/images/placeholder-product.png"}
                        alt={product.images?.[0]?.alt || product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        priority={index < 8}
                        onError={(e) => {
                          e.target.src = "/images/placeholder-product.png";
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 min-h-[3rem]">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-primary text-lg sm:text-xl font-bold">
                          ₹{Number(product.price)?.toLocaleString('en-IN') || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <Button
                    asChild
                    className="mt-4 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2"
                    size="sm"
                  >
                    <a
                      href={`https://wa.me/919156261648?text=${encodeURIComponent(
                        `Hello, I'm interested in the ${product.name}. Could you please provide more details?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Enquire about ${product.name} on WhatsApp`}
                    >
                      <FaWhatsapp className="w-4 h-4" /> Enquire on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600 text-lg mb-2">No products found</p>
            <p className="text-gray-500 text-sm mb-4">
              No products match the selected category filter
            </p>
            <Button 
              onClick={() => setSelectedCategory("all")}
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              Show All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
