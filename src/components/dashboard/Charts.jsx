import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

const COLORS = ["#2563eb", "#14b8a6", "#f97316", "#ef4444", "#8b5cf6", "#22c55e"];
const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
const normalizeCategory = (value) => (value && String(value).trim() ? String(value).trim() : "Uncategorized");
const formatLabel = (category, type) => `${category} (${type === "income" ? "Income" : "Expense"})`;
const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

const TrendTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
        return null;
    }

    const balance = payload.find((p) => p.dataKey === "balance")?.value || 0;
    const income = payload.find((p) => p.dataKey === "income")?.value || 0;
    const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 text-sm shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
            <p className="font-semibold text-slate-800 dark:text-slate-100">{label}</p>
            <div className="mt-2 space-y-1">
                <p className="text-blue-600 dark:text-blue-300">Balance: {formatCurrency(balance)}</p>
                <p className="text-emerald-600 dark:text-emerald-300">Income: {formatCurrency(income)}</p>
                <p className="text-rose-600 dark:text-rose-300">Expense: {formatCurrency(expense)}</p>
            </div>
        </div>
    );
};

const Charts = () => {
    const transactions = useSelector((state) => state.finance.transactions);
    const [activePie, setActivePie] = useState(-1);

    const { trendData, categoryData, totalValue } = useMemo(() => {
        const byDate = transactions.reduce((acc, t) => {
            if (!acc[t.date]) {
                acc[t.date] = { date: t.date, income: 0, expense: 0 };
            }

            if (t.type === "income") acc[t.date].income += t.amount;
            if (t.type === "expense") acc[t.date].expense += t.amount;

            return acc;
        }, {});

        const sorted = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
        let runningBalance = 0;
        const trend = sorted.map((t) => {
            runningBalance += t.income - t.expense;
            return {
                date: t.date,
                label: formatDate(t.date),
                balance: runningBalance,
                income: t.income,
                expense: t.expense,
            };
        });

        const categories = Object.values(
            transactions.reduce((acc, t) => {
                const amount = Number(t.amount) || 0;
                if (amount > 0) {
                    const categoryName = normalizeCategory(t.category);
                    const key = `${t.type}:${categoryName}`;
                    acc[key] = acc[key] || {
                        name: formatLabel(categoryName, t.type),
                        category: categoryName,
                        type: t.type,
                        value: 0,
                    };
                    acc[key].value += amount;
                }
                return acc;
            }, {})
        );

        const allTotal = categories.reduce((sum, c) => sum + c.value, 0);

        return { trendData: trend, categoryData: categories, totalValue: allTotal };
    }, [transactions]);

    if (!transactions.length) {
        return (
            <div className="mb-6 rounded-[1.75rem] border border-dashed border-slate-300/80 bg-white/80 p-6 text-center text-slate-500 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400">
                No data available for charts.
            </div>
        );
    }

    return (
        <div className="mb-6 grid gap-4 lg:grid-cols-2 xl:gap-6">
            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5 dark:border-white/10 dark:bg-slate-900/80">
                <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">Trend</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">Balance trend</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Daily net flow merged into a clean cumulative trend.</p>
                </div>
                <div className="h-64 w-full rounded-[1.25rem] bg-gradient-to-b from-sky-50/80 via-white to-transparent p-1 dark:from-slate-800/60 dark:via-slate-900/90 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
                            <defs>
                                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.16} />
                            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={56} tickMargin={8} allowDecimals={false} />
                            <Tooltip content={<TrendTooltip />} cursor={{ stroke: "#94a3b8", strokeOpacity: 0.35 }} />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke="#ef4444"
                                strokeWidth={1.8}
                                fill="url(#expenseFill)"
                                fillOpacity={0.3}
                                activeDot={false}
                            />
                            <Area
                                type="monotone"
                                dataKey="balance"
                                stroke="#2563eb"
                                strokeWidth={3}
                                fill="url(#balanceFill)"
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-5 dark:border-white/10 dark:bg-slate-900/80">
                <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500 dark:text-emerald-300">Breakdown</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-900 sm:text-lg dark:text-white">Spending breakdown</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Interactive category split across income and expense.</p>
                </div>
                <div className="h-64 w-full rounded-[1.25rem] bg-gradient-to-b from-emerald-50/70 via-white to-transparent p-1 dark:from-slate-800/60 dark:via-slate-900/90 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={0}
                                outerRadius={105}
                                paddingAngle={2}
                                cornerRadius={6}
                                onMouseEnter={(_, index) => setActivePie(index)}
                                onMouseLeave={() => setActivePie(-1)}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={COLORS[index % COLORS.length]}
                                        stroke={index === activePie ? "#fff" : "transparent"}
                                        strokeWidth={index === activePie ? 3 : 0}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, _name, item) => [formatCurrency(value), item?.payload?.type === "income" ? "Income" : "Expense"]}
                                labelFormatter={(label) => label}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {categoryData.map((item, index) => (
                        <button
                            key={item.name}
                            type="button"
                            onMouseEnter={() => setActivePie(index)}
                            onMouseLeave={() => setActivePie(-1)}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition duration-200 ${activePie === index
                                ? "border-slate-400 bg-slate-100 shadow-sm dark:border-slate-500 dark:bg-slate-800"
                                : "border-slate-200 bg-white/80 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80"
                                }`}
                        >
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                            <span className="text-slate-500 dark:text-slate-400">{formatCurrency(item.value)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Charts;