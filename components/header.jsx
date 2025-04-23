import Link from "next/link";
import Image from "next/image";

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
  return (
    <header className="bg-white p-3 rounded-xl w-[95%] mx-auto m-4 flex justify-between items-center !min-h-16 !max-h-16">
      <Link href="/">
        <Image src="/images/logo.svg" alt="logo" width={100} height={100} />
      </Link>
      <div className="hidden lg:flex items-center gap-1">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className={navigationMenuTriggerStyle()}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/about"
                className={navigationMenuTriggerStyle()}
              >
                About us
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px]">
                  {productCategories.map((item) => (
                    <NavigationMenuLink key={item.name} href={item.path}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                        {item.name}
                      </div>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/products"
                className={cn(navigationMenuTriggerStyle())}
              >
                Products
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/brochures"
                className={cn(navigationMenuTriggerStyle())}
              >
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

      <Sheet>
        <SheetTrigger className="bg-primary text-white rounded-lg h-fit p-2 lg:hidden">
          <AlignJustify />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-primary">Menu Items</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-7 mt-5 p-4 justify-start">
            <Link href="/">Home</Link>
            <Link href="/about-us">About Us</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-left cursor-pointer flex items-center gap-2">
                Categories <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {productCategories.map((category, index) => (
                  <DropdownMenuItem key={index}>
                    <Link
                      href={category.path}
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/5"
                    >
                      <Image
                        src={category.icon}
                        alt="Tools 1"
                        quality={80}
                        height={30}
                        width={30}
                        priority
                        className="rounded-md object-cover"
                      />
                      <span>{category.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/brochure">Broucher</Link>
            <Link href="/contact-us">Contact Us</Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
