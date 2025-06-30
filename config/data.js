const products = [
  {
    id: 1,
    name: "Tiller",
    category: "tiller",
    is_popular: true,
    image: "/images/product/tiller.png",
    price: 12000,
    description: "The tiller is a machine that is used to till the soil.",
    features: [
      "Heavy-duty blades for deep tilling",
      "Fuel efficient engine",
      "Easy to operate and maintain",
      "Suitable for all soil types"
    ],
    specs: {
      Engine: "4-stroke, 7HP",
      Weight: "80kg",
      Width: "900mm",
      Warranty: "1 Year"
    },
    gallery: [
      "/images/product/tiller.png",
      "/images/product/tiller.png"
    ]
  },
  {
    id: 2,
    name: "Generator",
    category: "generator",
    is_popular: true,
    image: "/images/product/jk 10500 e.jpg",
    price: 15000,
    description: "The generator is a machine that is used to generate electricity.",
    features: [
      "Silent operation",
      "Automatic voltage regulation",
      "Long runtime",
      "Portable design"
    ],
    specs: {
      Power: "8.5kW",
      Fuel: "Petrol",
      Weight: "95kg",
      Warranty: "2 Years"
    },
    gallery: [
      "/images/product/jk 10500 e.jpg",
      "/images/product/jk 10500 e (2).jpg"
    ]
  },
  {
    id: 3,
    name: "Pumps",
    category: "pump",
    is_popular: true,
    image: "/images/product/j k 30 p.jpg",
    price: 23000,
    description: "The pump is a machine that is used to pump water.",
    features: [
      "High flow rate",
      "Corrosion resistant body",
      "Low maintenance",
      "Thermal overload protection"
    ],
    specs: {
      Power: "3HP",
      Type: "Centrifugal",
      Weight: "30kg",
      Warranty: "1 Year"
    },
    gallery: [
      "/images/product/j k 30 p.jpg",
      "/images/product/j k 30 p (2).jpg"
    ]
  },
  {
    id: 4,
    name: "Grass Cutter",
    category: "grass-cutter",
    is_popular: true,
    image: "/images/product/grass-cutter.png",
    price: 9000,
    description: "The grass cutter is a machine that is used to cut the grass.",
    features: [
      "Sharp, durable blades",
      "Lightweight and ergonomic",
      "Low vibration",
      "Easy start system"
    ],
    specs: {
      Power: "2HP",
      Blade: "Steel",
      Weight: "7kg",
      Warranty: "6 Months"
    },
    gallery: [
      "/images/product/grass-cutter.png"
    ]
  },
];

const data = { products };
export default data;
