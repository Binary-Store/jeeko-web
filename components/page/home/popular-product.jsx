import data from "@/config/data";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

let popularProducts = data.products.filter((product) => product.is_popular);

popularProducts = [...popularProducts, ...popularProducts.reverse()];

export default function PopularProduct() {
  return (
    <section className="w-full mx-auto my-10">
      <h2 className="text-4xl text-center font-bold">Popular Products</h2>
      <div className="w-32 h-1 bg-primary mx-auto my-2"></div>
      <div className="w-[95%] mx-auto flex justify-end">
        <Link href="/products" className="flex gap-2 text-primary font-bold">
          See all <ChevronRight />
        </Link>
      </div>
      <div className="w-[95%] mx-auto">
        <div className="grid my-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularProducts.map((product, index) => (
            <Card
              key={index}
              className="hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <CardContent>
                <Image
                  className="mx-auto w-2/3 h-40 object-contain"
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                />

                <div className="flex justify-between">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <p className="text-sm mt-2 text-gray-500">
                  {product.description}
                </p>
                <p className="text-sm mt-2 text-gray-500">
                  Price:{" "}
                  <span className="text-primary text-lg font-bold">
                    ₹{product.price}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
