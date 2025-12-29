type Props = {
  title: string;
  value: string | number;
};

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-black border border-white/10 rounded-2xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2 text-[#d4af37]">
        {value}
      </h2>
    </div>
  );
}
