import { Suspense } from 'react';
import ProductsContent from "@/components/page/product-content"

// Skeleton Component
function ProductsLoading() {
  return (
    <section className="w-full min-h-[80vh] px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
      {/* Hero Banner Skeleton */}
      <div className="w-full pb-10">
        <div className="max-w-7xl rounded-2xl bg-gray-200 animate-pulse mx-auto overflow-hidden shadow-lg h-[50vh] sm:h-[60vh] lg:h-[70vh]">
        </div>
      </div>

      {/* Products Section Skeleton */}
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="text-center sm:text-left">
            <div className="h-12 sm:h-14 bg-gray-200 animate-pulse rounded w-80 mx-auto sm:mx-0"></div>
            <div className="w-40 sm:w-60 h-1 bg-gray-300 animate-pulse mx-auto sm:mx-0 mt-2"></div>
          </div>
          
          {/* Filter Dropdown Skeleton */}
          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <div className="w-48 h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid my-6 sm:my-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              {/* Image Skeleton */}
              <div className="w-full h-40 sm:h-48 mb-3 sm:mb-4 bg-gray-200 animate-pulse rounded-lg"></div>
              
              {/* Content Skeleton */}
              <div className="space-y-2">
                {/* Title Skeleton */}
                <div className="space-y-1">
                  <div className="h-5 sm:h-6 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
                
                {/* Description Skeleton */}
                <div className="space-y-1 pt-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                </div>
                
                {/* Price Skeleton */}
                <div className="pt-2">
                  <div className="h-6 sm:h-7 bg-gray-200 animate-pulse rounded w-24"></div>
                </div>
              </div>
              
              {/* Button Skeleton */}
              <div className="mt-4 w-full h-9 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
