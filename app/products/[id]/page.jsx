"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaWhatsapp } from "react-icons/fa";
import { useProduct } from "@/hooks/useProducts";

gsap.registerPlugin(ScrollTrigger);

// Skeleton Loading Component
function ProductDetailSkeleton() {
  return (
    <section className="w-full mx-auto my-8">
      <div className="w-[95%] mx-auto max-w-7xl">
        {/* Back link skeleton */}
        <div className="h-6 bg-gray-200 animate-pulse rounded mb-4 w-32"></div>
        
        <Card className="p-6 md:p-10 flex flex-col md:flex-row gap-8 bg-white">
          {/* Image section skeleton */}
          <div className="flex-1 flex flex-col gap-4 items-center">
            {/* Main image skeleton */}
            <div className="rounded-xl bg-gray-200 animate-pulse size-72"></div>
            
            {/* Gallery thumbnails skeleton */}
            <div className="flex gap-2 mt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded border bg-gray-200 animate-pulse w-20 h-20"></div>
              ))}
            </div>
          </div>
          
          {/* Product details skeleton */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Title skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-9 bg-gray-200 animate-pulse rounded w-3/4"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3"></div>
            </div>
            
            {/* Price skeleton */}
            <div className="h-8 bg-gray-200 animate-pulse rounded w-32"></div>
            
            {/* WhatsApp button skeleton */}
            <div className="h-12 bg-gray-200 animate-pulse rounded w-full md:w-64 mt-2"></div>
            
            {/* Specifications section skeleton */}
            <div className="mt-6">
              <div className="h-7 bg-gray-200 animate-pulse rounded w-40 mb-2"></div>
              <div className="border rounded-xl overflow-hidden bg-gray-50">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="border-b last:border-b-0 py-2 px-3">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const containerRef = useRef(null);
  
  // Fetch product from API
  const { data: productResponse, isLoading, error } = useProduct(id);
  
  const product = productResponse?.data;
  
  // Handle gallery images - MongoDB schema uses images array with url property
  const [gallery, setGallery] = useState(product?.images?.length > 0 
    ? product.images.map(img => img?.url).filter(url => url)
    : ["/images/placeholder-product.png"]);
  
  // Initialize selectedImg with the first valid image
  const [selectedImg, setSelectedImg] = useState("/images/placeholder-product.png");

  // Update gallery and selectedImg when product data is available
  useEffect(() => {
    if (product && product.images?.length > 0) {
      const newGallery = product.images.map(img => img?.url).filter(url => url) || ["/images/placeholder-product.png"];
      setGallery(newGallery);
      setSelectedImg(newGallery[0] || "/images/placeholder-product.png");
    } else {
      setGallery(["/images/placeholder-product.png"]);
      setSelectedImg("/images/placeholder-product.png");
    }
  }, [product]);

  // GSAP Animations
  useGSAP(() => {
    // Header animation (Back link and product title)
    gsap.fromTo(
      ".product-header",
      {
        y: 40,
        opacity: 0,
        scale: 0.9,
        rotationX: 10,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ".product-header",
          start: "top 90%",
          end: "bottom 75%",
          toggleActions: "play none none none",
        },
      }
    );

    // Main image animation
    gsap.fromTo(
      ".main-image",
      {
        y: 60,
        opacity: 0,
        scale: 0.85,
        rotationY: 15,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".main-image",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Gallery thumbnails animation
    gsap.fromTo(
      ".gallery-thumb",
      {
        y: 30,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".gallery",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Product details animation
    gsap.fromTo(
      ".product-details",
      {
        y: 60,
        opacity: 0,
        scale: 0.85,
        rotationY: 15,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".product-details",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Hover animation for gallery thumbnails (no reverse)
    document.querySelectorAll(".gallery-thumb").forEach((thumb) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(thumb, {
        y: -8,
        scale: 1.02,
        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        duration: 0.4,
        ease: "power3.out",
      });

      thumb.addEventListener("mouseenter", () => tl.play());
      // No mouseleave event to prevent reverse
    });
  }, { scope: containerRef, dependencies: [product, selectedImg] });

  // Show skeleton during loading
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Error or no product found
  if (error || !product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-4">
          {error?.message || "The product you're looking for doesn't exist."}
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <section ref={containerRef} className="w-full mx-auto my-8">
      <div className="w-[95%] mx-auto max-w-7xl">
        <Link href="/products" className="product-header text-primary font-bold mb-4 inline-block">
          &larr; Back to Products
        </Link>
        <Card className="p-6 md:p-10 flex flex-col md:flex-row gap-8 bg-white">
          <div className="flex-1 flex flex-col gap-4 items-center">
            <Image
              src={selectedImg}
              alt={product.name}
              width={400}
              height={400}
              className="main-image rounded-xl object-contain size-72 bg-[#f5f5f5]"
              onError={(e) => {
                e.target.src = "/images/placeholder-product.png";
                setSelectedImg("/images/placeholder-product.png");
              }}
            />
            {gallery.length > 1 && (
              <div className="gallery flex gap-2 mt-2">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`gallery-thumb rounded border object-contain bg-[#f5f5f5] w-20 h-20 p-0.5 transition-all ${
                      selectedImg === img ? 'ring-2 ring-primary border-primary' : 'border-gray-200'
                    }`}
                    style={{ outline: 'none' }}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={product.name + " gallery " + (i + 1)}
                      width={80}
                      height={80}
                      className="rounded object-contain w-full h-full"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.png";
                        // Update gallery to replace invalid image
                        const updatedGallery = [...gallery];
                        updatedGallery[i] = "/images/placeholder-product.png";
                        setGallery(updatedGallery);
                        if (selectedImg === img) {
                          setSelectedImg("/images/placeholder-product.png");
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="product-details flex-1 flex flex-col gap-4">
            <div className="product-header flex items-center gap-3">
              <h1 className="text-3xl font-bold">{product.name}</h1>
            </div>
            <p className="text-lg text-gray-500">{product.description}</p>
            <div>
              <span className="text-primary text-2xl font-bold">
                ₹{product.price?.toLocaleString()}
              </span>
            </div>
            <Button
              asChild
              className="w-full md:w-fit mt-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2"
              size="lg"
            >
              <a
                href={`https://wa.me/919925232951?text=${encodeURIComponent(
                  `Hello, I'm interested in the ${product.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enquire on WhatsApp"
              >
                <FaWhatsapp className="size-5" /> Enquire on WhatsApp
              </a>
            </Button>
            
            {/* Specifications Section */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mt-6 mb-2">Specifications</h2>
                <div className="w-full text-left border rounded-xl overflow-hidden bg-gray-50">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="border-b last:border-b-0 py-2 px-3">
                      <span className="text-gray-700 text-sm">• {spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
