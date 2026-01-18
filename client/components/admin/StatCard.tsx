import { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  icon
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <div className="bg-black border border-white/10 rounded-xl p-4
    hover:border-[#d4af37]/40 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{title}</p>
          <p className="text-xl font-bold text-white mt-1">
            {value}
          </p>
        </div>

        <div className="text-[#d4af37]">
          {icon}
        </div>
      </div>
    </div>
  );
}
