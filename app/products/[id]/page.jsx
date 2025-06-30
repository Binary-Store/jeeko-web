"use client";

import { useRouter, useParams } from "next/navigation";
import data from "@/config/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const product = data.products.find((p) => String(p.id) === String(id));

  const gallery = product?.gallery && product.gallery.length > 0 ? product.gallery : [product?.image];
  const [selectedImg, setSelectedImg] = useState(gallery[0]);

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <section className="w-full mx-auto my-10">
      <div className="w-[95%] mx-auto max-w-5xl">
        <Link href="/products" className="text-primary font-bold mb-4 inline-block">&larr; Back to Products</Link>
        <Card className="p-6 md:p-10 flex flex-col md:flex-row gap-8 bg-white">
          <div className="flex-1 flex flex-col gap-4 items-center">
            <Image
              src={selectedImg}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-xl object-cover size-72 bg-[#f5f5f5]"
            />
            {gallery.length > 1 && (
              <div className="flex gap-2 mt-2">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`rounded border object-contain bg-[#f5f5f5] w-20 h-20 p-0.5 transition-all ${selectedImg === img ? 'ring-2 ring-primary border-primary' : 'border-gray-200'}`}
                    style={{ outline: 'none' }}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={product.name + " gallery " + (i + 1)}
                      width={80}
                      height={80}
                      className="rounded object-contain w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <p className="text-lg text-gray-500">{product.description}</p>
            <div>
              <span className="text-primary text-2xl font-bold">₹{product.price}</span>
            </div>
            <Button
              asChild
              className="w-full md:w-fit mt-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center gap-2"
              size="lg"
            >
              <a
                href={`https://wa.me/919156261648?text=${encodeURIComponent(
                  `Hello, I'm interested in the ${product.name}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Enquire on WhatsApp"
              >
                <FaWhatsapp className="size-5" /> Enquire on WhatsApp
              </a>
            </Button>
            <div>
              <h2 className="text-xl font-bold mt-6 mb-2">Features</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.features && product.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mt-6 mb-2">Specifications</h2>
              <table className="w-full text-left border rounded-xl overflow-hidden bg-gray-50">
                <tbody>
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-b-0">
                      <td className="py-2 px-3 font-semibold text-gray-700 w-1/3">{key}</td>
                      <td className="py-2 px-3 text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
} 