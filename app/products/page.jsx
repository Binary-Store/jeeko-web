// app/products/page.js
import { Suspense } from 'react';
import ProductsContent from "@/components/page/product-content"
// Loading component
function ProductsLoading() {
  return (
    <section className="w-full mx-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
        <div className="max-w-7xl rounded-2xl bg-gray-200 animate-pulse mx-auto overflow-hidden shadow-lg h-[60vh]">
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="h-12 bg-gray-200 animate-pulse rounded mx-auto mb-4 max-w-md"></div>
          <div className="w-32 h-1 bg-gray-300 animate-pulse mx-auto my-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
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
