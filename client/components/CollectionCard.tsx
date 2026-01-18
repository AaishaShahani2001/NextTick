import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  image: string;
  href: string;
  count?: number; 
};

const CollectionCard = ({
  title,
  description,
  image,
  href,
  count
}: Props) => {
  return (
    <Link
      href={href}
      className="
        group relative block overflow-hidden
        rounded-3xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        transition-all duration-500
        hover:-translate-y-1
        hover:border-[#d4af37]/40
        hover:shadow-[0_30px_80px_rgba(0,0,0,0.7)]
      "
    >
      {/* IMAGE */}
      <div className="relative h-105 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="
            object-cover
            transition-transform duration-700
            group-hover:scale-105
          "
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* CONTENT */}
      <div className="absolute inset-0 flex flex-col justify-end p-10">
        {/* COUNT BADGE */}
        {typeof count === "number" && (
          <span
            className="
              mb-4 inline-block w-fit
              px-4 py-1.5
              text-xs font-semibold tracking-widest uppercase
              rounded-full
              bg-[#d4af37]/10 text-[#d4af37]
              border border-[#d4af37]/20
            "
          >
            {count} Watches
          </span>
        )}

        <h3 className="text-3xl font-semibold text-white tracking-wide">
          {title}
        </h3>

        <p className="mt-3 text-sm text-gray-300 max-w-md leading-relaxed">
          {description}
        </p>

        {/* CTA */}
        <span
          className="
            mt-6 inline-flex items-center gap-2
            text-sm font-medium tracking-wide
            text-[#d4af37]
            transition-all
            group-hover:gap-3
          "
        >
          Explore Collection
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
