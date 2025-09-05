"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Package, 
  Eye,
  Grid3X3,
  List
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useProductCategory } from "@/hooks/useProductCategories";
import { useProducts } from "@/hooks/useProducts";

// Skeleton Loading Component
function CategoriesDetailSkeleton() {
  return (
    <div className="min-h-screen text-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
        {/* Back Navigation Skeleton */}
        <div className="flex items-center gap-2 mb-10">
          <div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-5 bg-gray-200 animate-pulse rounded w-32"></div>
        </div>

        {/* Category Header Skeleton */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 sm:p-8 mb-12 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Skeleton */}
            <div className="w-full lg:w-1/3">
              <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
              {/* Title Skeleton */}
              <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 animate-pulse rounded w-3/4"></div>
              
              {/* Description Skeleton */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3"></div>
              </div>

              {/* Badge Skeleton */}
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 animate-pulse rounded-full w-24"></div>
              </div>

              {/* Button Skeleton */}
              <div className="h-12 bg-gray-200 animate-pulse rounded-lg w-full sm:w-64"></div>
            </div>
          </div>
        </div>

        {/* Products Section Skeleton */}
        <div className="space-y-8">
          {/* Section Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 sm:h-10 bg-gray-200 animate-pulse rounded w-80"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-48"></div>
            </div>

            {/* View Toggle Skeleton */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2 border border-gray-200">
              <div className="h-8 w-10 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-8 w-10 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="bg-white border-2 border-gray-200 rounded-xl shadow-lg">
                {/* Product Image Skeleton */}
                <div className="relative bg-gray-200 rounded-t-xl w-full h-40 sm:h-48 animate-pulse"></div>

                {/* Product Info Skeleton */}
                <CardContent className="p-4 sm:p-6">
                  {/* Title Skeleton */}
                  <div className="space-y-1 mb-3">
                    <div className="h-4 sm:h-5 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 sm:h-5 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  </div>
                  
                  {/* Description Skeleton */}
                  <div className="space-y-1 mb-4">
                    <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  </div>
                  
                  {/* Price and View Badge Skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="h-6 sm:h-7 bg-gray-200 animate-pulse rounded w-20"></div>
                    <div className="h-6 bg-gray-200 animate-pulse rounded-full w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [viewMode, setViewMode] = useState('grid');
  
  const { data: categoryResponse, isLoading: categoryLoading, error: categoryError } = useProductCategory(id);
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useProducts();
  
  const category = categoryResponse?.data;
  const allProducts = productsResponse?.data || [];

  const products = useMemo(() => {
    if (!id || !allProducts.length) return [];
    return allProducts.filter(product => {
      return product.categories && product.categories.includes(id);
    });
  }, [allProducts, id]);

  // Show skeleton during loading
  if (categoryLoading || productsLoading) {
    return <CategoriesDetailSkeleton />;
  }

  if (categoryError || !category) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <Package className="h-16 w-16 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-600 mb-4">Category Not Found</h2>
        <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700 text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8">
        {/* Back Navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-red-600 font-semibold mb-10 hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>

        {/* Category Header - Rounded card */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 sm:p-8 mb-12 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <div className="aspect-square bg-white rounded-xl p-6 sm:p-8 border border-gray-300 shadow-sm">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-16 w-16 sm:h-24 sm:w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                {category.name}
              </h1>
              
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                {category.description || "Explore our premium collection of high-quality products in this category."}
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge className="bg-red-600 text-white px-4 py-2 text-sm rounded-full">
                  Products: {products.length}
                </Badge>
              </div>

              <Button
                asChild
                className="bg-[#25D366] hover:bg-[#1ebe5d] text-white w-full sm:w-auto rounded-lg"
                size="lg"
              >
                <a
                  href={`https://wa.me/919925232951?text=${encodeURIComponent(
                    `Hello, I'm interested in products from the ${category.name} category.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="mr-2 h-5 w-5" />
                  Inquire About This Category
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Products in {category.name}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {products.length > 0 
                  ? `${products.length} product${products.length !== 1 ? 's' : ''} available`
                  : 'No products available in this category'
                }
              </p>
            </div>

            {/* View Toggle - Rounded */}
            {products.length > 0 && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2 border border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg ${viewMode === 'grid' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg ${viewMode === 'list' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Products Grid/List - Rounded cards */}
          {products.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8' 
                : 'space-y-6'
            }`}>
              {products.map((product) => (
                <Card 
                  key={product._id} 
                  className={`bg-white border-2 border-red-600 hover:border-red-700 hover:shadow-xl transition-all duration-300 group rounded-xl shadow-lg ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                >
                  <Link href={`/products/${product._id}`} className="block">
                    {/* Product Image - Rounded */}
                    <div className={`relative bg-gray-50 rounded-t-xl ${
                      viewMode === 'list' ? 'w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-l-xl rounded-t-none' : 'w-full h-40 sm:h-48'
                    }`}>
                      {product.images?.[0]?.url ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info - Increased padding */}
                    <CardContent className="p-4 sm:p-6 flex-1">
                      <h3 className="font-semibold text-black mb-3 text-sm sm:text-base line-clamp-2 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg sm:text-xl font-bold text-red-600">
                          ₹{product.price?.toLocaleString()}
                        </div>
                        <Badge className="text-xs bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <Package className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
                This category doesn't have any products yet.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-lg">
                <Link href="/">
                  Browse Other Categories
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
