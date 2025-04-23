import Image from "next/image";
import { ShieldCheck, Fuel, Headset, ScrollText } from "lucide-react";

const points = [
  {
    icon: (
      <Image
        src="/svg/india-icon.svg"
        className="size-10"
        alt="Why Us"
        width={50}
        height={50}
      />
    ),
    title: "Made in India",
    description:
      "Proudly manufactured in India, supporting local industry and ensuring products are designed for Indian conditions.",
  },
  {
    icon: <ShieldCheck className="size-7" />,
    title: "Durable & Reliable",
    description:
      "Built to last with high-quality materials and rigorous testing to ensure reliability in demanding conditions.",
  },
  {
    icon: <Fuel className="size-7" />,
    title: "Fuel Efficient",
    description:
      "Designed with optimal fuel efficiency to reduce operating costs and environmental impact.",
  },
  {
    icon: <ScrollText className="size-7" />,
    title: "Easy to Operate",
    description:
      "Comprehensive support services to ensure your satisfaction and peace of mind.",
  },
  {
    icon: <Headset className="size-7" />,
    title: "Customer Support",
    description:
      "Comprehensive support services to ensure your satisfaction and peace of mind.",
  },
];

export default function WhyUs() {
  return (
    <section className="w-full mx-auto my-10">
      <h2 className="text-4xl text-center font-bold">
        Why Choose <span className="text-primary">JEEKO</span>?
      </h2>
      <div className="w-32 h-1 bg-primary mx-auto my-2"></div>

      <div className="w-[95%] mx-auto flex gap-4 my-7">
        <div className="space-y-4 w-full">
          {points.map((point, index) => (
            <div
              key={index}
              className="flex gap-4 h-fit items-center p-4 rounded-xl bg-white"
            >
              <div className="text-primary">{point.icon}</div>
              <div>
                <h2 className="font-bold">{point.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Image
          className="w-full rounded-xl"
          src="/images/banner.png"
          alt="Why Us"
          width={500}
          height={500}
        />
      </div>
    </section>
  );
}
