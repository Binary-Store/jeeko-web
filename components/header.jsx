"use client";

import React from "react"
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AlignJustify, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductCategories } from "@/hooks/useProductCategories";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// List item component for category links using mobile-style
const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block py-2 px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-all duration-200 transform hover:translate-x-1 select-none no-underline outline-none",
            className
          )}
          {...props}
        >
          {title}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function Header({ className }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Fetch product categories for the dropdown
  const { data: categoriesResponse, isLoading: categoriesLoading } = useProductCategories();
  const categories = categoriesResponse?.data || [];

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      "header",
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    tl.fromTo(
      "header > div > a",
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    tl.fromTo(
      "header .nav-item",
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
    );
  });

  return (
    <header className={cn(
      "fixed top-4 w-full px-4 sm:px-6 lg:px-8 z-50",
      className
    )}>
      {/* Container with max-w-7xl for content width constraint - exactly same as hero */}
      <div className="max-w-7xl mx-auto rounded-xl bg-white flex justify-between items-center min-h-16 px-4 sm:px-6">
        <Link href="/">
          <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
        </Link>
        
        {/* Desktop Navigation - With Products Dropdown */}
        <div className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "nav-item")} href="/">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "nav-item")} href="/about">
                  About us
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {/* Products with Category Dropdown */}
              <NavigationMenuItem className="nav-item">
                <NavigationMenuTrigger className="nav-item">
                  <a href="/products" className="no-underline">
                    Products
                  </a>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-64 bg-white rounded-md border border-gray-100 p-4 max-h-[70vh] overflow-y-auto">
                    
                    {/* Categories Section */}
                    {!categoriesLoading && categories.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-1 mb-2">
                          Categories
                        </h4>
                        <ul className="space-y-1">
                          {categories.map((category) => (
                            <ListItem
                              key={category._id}
                              title={category.name}
                              href={`/products?category=${category._id}`}
                              className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                            />
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Loading State */}
                    {categoriesLoading && (
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-1 mb-2">
                          Loading Categories...
                        </h4>
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse mx-3"></div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No categories fallback */}
                    {!categoriesLoading && categories.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500">No categories available</p>
                        <p className="text-xs text-gray-400 mt-1">Please check back later</p>
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem className="nav-item">
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle())} href="/brochures">
                  Brochures
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <Link href="/contact-us">
          <Button size="lg" className="font-semibold hidden xl:flex">
            Contact Us
          </Button>
        </Link>

        {/* Mobile Menu - Box Style Dropdown with Category Support */}
        <div className="lg:hidden relative" ref={mobileMenuRef}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="bg-primary text-white hover:bg-primary/90 border-primary transition-all duration-200"
          >
            <div className="relative">
              <AlignJustify 
                className={`h-5 w-5 transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`} 
              />
              <X 
                className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`} 
              />
            </div>
          </Button>

          {/* Mobile Dropdown Box with Smooth Animation */}
          <div className={`absolute top-12 right-0 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-300 ease-out origin-top-right ${
            mobileMenuOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}>
            <nav className="flex flex-col p-4 max-h-[80vh] overflow-y-auto">
              <Link 
                href="/" 
                className="py-3 px-3 rounded-lg hover:bg-gray-100 text-base font-medium transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="py-3 px-3 rounded-lg hover:bg-gray-100 text-base font-medium transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              
              {/* Products Section with Categories - Mobile View */}
              <div className="py-2">
                <Link 
                  href="/products" 
                  className="py-3 px-3 rounded-lg hover:bg-gray-100 text-base font-medium transition-all duration-200 transform hover:translate-x-1 block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                
                {/* Categories in Mobile */}
                {!categoriesLoading && categories.length > 0 && (
                  <div className="ml-4 mt-2 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/products?category=${category._id}`}
                        className="block py-2 px-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-all duration-200 transform hover:translate-x-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                href="/brochures" 
                className="py-3 px-3 rounded-lg hover:bg-gray-100 text-base font-medium transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brochures
              </Link>
              
              {/* Divider with animation */}
              <div className="border-t border-gray-200 my-3 opacity-30"></div>
              
              {/* Contact Button with hover effect */}
              <Link href="/contact-us" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full font-semibold transition-all duration-200 hover:scale-105">
                  Contact Us
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
