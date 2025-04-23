import Image from "next/image";
import Hero from "@/components/page/home/hero";
import PopularProduct from "@/components/page/home/popular-product";
import Brands from "@/components/page/home/brands";
import WhyUs from "@/components/page/home/why-us";
import Testimonials from "@/components/page/home/testimonials";
import ContactUs from "@/components/page/home/contact-us";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularProduct />
      <Brands />
      <WhyUs />
      <Testimonials />
      <ContactUs />
    </>
  );
}
