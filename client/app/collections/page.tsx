// app/collections/page.tsx

import CollectionCard from "@/components/CollectionCard";

const collections = [
  {
    title: "Classic Collection",
    description:
      "Timeless designs crafted with precision and elegance for every occasion.",
    image: "/collections/classic.jpg",
    href: "/watches?collection=Classic Collection"
  },
  {
    title: "Heritage Collection",
    description:
      "Inspired by traditional craftsmanship and enduring watchmaking legacy.",
    image: "/collections/heritage.jpg",
    href: "/watches?collection=Heritage Collection"
  },
  {
    title: "Sport Collection",
    description:
      "Built for performance, durability, and an active lifestyle.",
    image: "/collections/sport.jpg",
    href: "/watches?collection=Sport Collection"
  }
];

const CollectionsPage = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Our <span className="text-[#d4af37]">Collections</span>
        </h1>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Explore curated watch collections designed to match
          your lifestyle, taste, and ambition.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.title}
            {...collection}
          />
        ))}
      </div>
    </section>
  );
};

export default CollectionsPage;
