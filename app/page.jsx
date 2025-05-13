import Image from "next/image";
import Hero from "@/components/page/home/hero";
import PopularProduct from "@/components/page/home/popular-product";
import Brands from "@/components/page/home/brands";
import WhyUs from "@/components/page/home/why-us";
import Testimonials from "@/components/page/home/testimonials";
import ContactUs from "@/components/page/home/contact-us";
import Banner from "@/components/page/home/banner";
import ProductCategories from "@/components/page/home/product-categories";

export default function Home() {
  return (
    <>
      <Banner />
      <Hero />
      <ProductCategories />
      <PopularProduct />
      <Brands />
      <WhyUs />
      <Testimonials />
      <ContactUs />
    </>
  );
}
