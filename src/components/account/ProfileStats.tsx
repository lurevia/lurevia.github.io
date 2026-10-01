type ProfileStatsProps = {
  orderCount: number;
  favoriteCount: number;
  transactionCount: number;
  totalSpent: number;
};

export const ProfileStats = ({
  orderCount,
  favoriteCount,
  transactionCount,
  totalSpent,
}: ProfileStatsProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
    <StatCard label="Commandes" value={orderCount} />
    <StatCard label="Favoris" value={favoriteCount} />
    <StatCard label="Transactions" value={transactionCount} />
    <StatCard
      label="Total dépensé"
      value={`${new Intl.NumberFormat("fr-MG").format(totalSpent)} Ar`}
      isText
    />
  </div>
);

const StatCard = ({
  label,
  value,
  isText = false,
}: {
  label: string;
  value: number | string;
  isText?: boolean;
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
    <p className={`font-black ${isText ? "text-sm md:text-base" : "text-2xl"}`}>
      {value}
    </p>
    <p className="text-[10px] uppercase tracking-wider text-emerald-100/80 font-bold mt-0.5">
      {label}
    </p>
  </div>
);
