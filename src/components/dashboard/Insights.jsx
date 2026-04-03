import { useSelector } from "react-redux";

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

const Insights = () => {
    const transactions = useSelector((state) => state.finance.transactions);

    const categoryTotals = {};
    const monthlyTotals = {};

    transactions.forEach((t) => {
        const monthKey = t.date.slice(0, 7);
        monthlyTotals[monthKey] = monthlyTotals[monthKey] || { income: 0, expense: 0 };

        if (t.type === "income") {
            monthlyTotals[monthKey].income += t.amount;
        }

        if (t.type === "expense") {
            categoryTotals[t.category] =
                (categoryTotals[t.category] || 0) + t.amount;
            monthlyTotals[monthKey].expense += t.amount;
        }
    });

    const highestCategory = Object.keys(categoryTotals).reduce(
        (a, b) => (categoryTotals[a] > categoryTotals[b] ? a : b),
        ""
    );

    const months = Object.keys(monthlyTotals).sort();
    const latestMonth = months.at(-1);
    const previousMonth = months.at(-2);
    const latestTotals = latestMonth ? monthlyTotals[latestMonth] : { income: 0, expense: 0 };
    const previousTotals = previousMonth ? monthlyTotals[previousMonth] : { income: 0, expense: 0 };
    const spendingChange = previousTotals.expense
        ? Math.round(((latestTotals.expense - previousTotals.expense) / previousTotals.expense) * 100)
        : 0;
    const savings = latestTotals.income - latestTotals.expense;

    return (
        <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:border-amber-500/20 dark:from-amber-950/35 dark:to-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700 dark:text-amber-200">Highest spending category</p>
                <p className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">{highestCategory || "N/A"}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {highestCategory ? formatCurrency(categoryTotals[highestCategory]) : "No expense data yet"}
                </p>
            </div>

            <div className="rounded-[1.75rem] border border-sky-200/60 bg-gradient-to-br from-sky-50 to-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:border-sky-500/20 dark:from-sky-950/35 dark:to-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700 dark:text-sky-200">Monthly comparison</p>
                <p className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {latestMonth || "N/A"}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Expense change vs previous month: {spendingChange >= 0 ? "+" : ""}{spendingChange}%
                </p>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.08)] dark:border-emerald-500/20 dark:from-emerald-950/35 dark:to-slate-900">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-200">Net savings</p>
                <p className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">{formatCurrency(savings)}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Income {formatCurrency(latestTotals.income)} minus expense {formatCurrency(latestTotals.expense)}
                </p>
            </div>
        </div>
    );
};

export default Insights;