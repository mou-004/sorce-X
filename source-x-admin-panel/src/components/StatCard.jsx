function StatCard({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            {description}
          </p>

        </div>

        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;