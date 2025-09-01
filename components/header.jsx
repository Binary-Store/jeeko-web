"use client";

import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { AlignJustify, X } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header({ className }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

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
      "fixed top-4 left-4 right-4 p-1 rounded-xl z-50",
      className
    )}>
      {/* Container with max-w-7xl for content width constraint */}
      <div className="max-w-7xl mx-auto pl-3 pr-4 rounded-xl bg-white flex justify-between items-center min-h-16">
        <Link href="/">
          <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
        </Link>
        
        {/* Desktop Navigation - Removed Categories */}
        <div className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link
                  href="/"
                  className={cn(navigationMenuTriggerStyle(), "nav-item")}
                >
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/about"
                  className={cn(navigationMenuTriggerStyle(), "nav-item")}
                >
                  About us
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="nav-item">
                <Link
                  href="/products"
                  className={cn(navigationMenuTriggerStyle())}
                >
                  Products
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="nav-item">
                <Link
                  href="/brochures"
                  className={cn(navigationMenuTriggerStyle())}
                >
                  Brochures
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <Link href="/contact-us">
          <Button size="lg" className="font-semibold hidden xl:flex">
            Contact Us
          </Button>
        </Link>

        {/* Mobile Menu - Box Style Dropdown */}
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
          <div className={`absolute top-12 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-300 ease-out origin-top-right ${
            mobileMenuOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}>
            <nav className="flex flex-col p-4">
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
              <Link 
                href="/products" 
                className="py-3 px-3 rounded-lg hover:bg-gray-100 text-base font-medium transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
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
