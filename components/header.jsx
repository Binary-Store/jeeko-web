"use client";

import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { Button } from "@/components/ui/button";
import { AlignJustify, ChevronDown } from "lucide-react";
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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const productCategories = [
  {
    name: "Tillers",
    path: "/products/double-column-machining-centers",
    icon: "/svg/tiller-icon.svg",
  },
  {
    name: "Water Pumps",
    path: "/products/horizontal-boring-machines",
    icon: "/svg/pump-icon.svg",
  },
  {
    name: "Generators",
    path: "/products/vertical-machining-centers",
    icon: "/svg/generator-icon.svg",
  },
];

export default function Header() {
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      "header",
      { opacity: 0, y: -100 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    tl.fromTo(
      "header > a",
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
    <header className="bg-white p-3 rounded-xl app-container mx-auto m-4 flex justify-between items-center !min-h-16 !max-h-16 relative z-10">
      <Link href="/">
        <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
      </Link>
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
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="nav-item">
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px]">
                  {productCategories.map((item) => (
                    <Link key={item.name} href={item.path}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                        {item.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
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

      <Sheet>
        <SheetTrigger aria-label="Open menu" className="bg-primary text-white rounded-lg h-fit p-2 lg:hidden">
          <AlignJustify />
        </SheetTrigger>
        <SheetContent className="p-0 flex flex-col h-full">
          <SheetHeader className="p-4 pb-0">
            <SheetTitle className="text-primary">Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 pt-2">
            <Link href="/" className="py-3 px-2 rounded-lg hover:bg-secondary/10 text-base font-medium">Home</Link>
            <Link href="/about" className="py-3 px-2 rounded-lg hover:bg-secondary/10 text-base font-medium">About Us</Link>
            <div>
              <div className="font-semibold text-sm text-muted-foreground mb-1 mt-2">Categories</div>
              <div className="flex flex-col gap-1">
                {productCategories.map((category) => (
                  <Link
                    href={category.path}
                    className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-secondary/10 text-base"
                    key={category.name}
                  >
                    <Image
                      src={category.icon}
                      alt={category.name}
                      quality={80}
                      height={24}
                      width={24}
                      priority
                      className="rounded-md object-cover"
                    />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t my-3" />
            <Link href="/brochures" className="py-3 px-2 rounded-lg hover:bg-secondary/10 text-base font-medium">Brochures</Link>
            <Link href="/products" className="py-3 px-2 rounded-lg hover:bg-secondary/10 text-base font-medium">Products</Link>
          </nav>
          <div className="p-4 border-t">
            <Link href="/contact-us">
              <Button size="lg" className="w-full font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
