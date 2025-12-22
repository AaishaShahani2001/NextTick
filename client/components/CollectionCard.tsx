// components/CollectionCard.tsx

import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  image: string;
  href: string;
};

const CollectionCard = ({ title, description, image, href }: Props) => {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl overflow-hidden
      border border-white/10 hover:border-[#d4af37]/60 transition"
    >
      {/* Background Image */}
      <div className="relative h-105 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700
          group-hover:scale-105"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <h3 className="text-2xl font-semibold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-300 max-w-sm">
          {description}
        </p>

        <span className="mt-4 inline-block text-sm font-medium
          text-[#d4af37] tracking-wide">
          Explore Collection →
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
