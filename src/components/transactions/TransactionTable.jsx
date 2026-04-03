import { useMemo } from "react";
import { useSelector } from "react-redux";

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;
const normalizeCategory = (value) => (value && String(value).trim() ? String(value).trim() : "Uncategorized");

const TransactionTable = ({ onEdit }) => {
    const { transactions, search, filter, role } = useSelector((state) => state.finance);
    const sortBy = "date";
    const sortOrder = "desc";

    const filteredTransactions = useMemo(() => {
        const results = transactions.filter((t) => {
            const category = normalizeCategory(t.category);
            const matchesSearch =
                !search ||
                category.toLowerCase().includes(search.toLowerCase()) ||
                String(t.amount).includes(search);

            const matchesFilter = filter === "all" || t.type === filter;

            return matchesSearch && matchesFilter;
        });

        return [...results].sort((a, b) => {
            if (sortBy === "amount") {
                return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
            }

            return sortOrder === "asc"
                ? a.date.localeCompare(b.date)
                : b.date.localeCompare(a.date);
        });
    }, [transactions, search, filter]);

    const handleExportCsv = () => {
        if (!filteredTransactions.length) {
            return;
        }

        const header = ["Date", "Category", "Type", "Amount"];
        const rows = filteredTransactions.map((item) => [
            item.date,
            normalizeCategory(item.category),
            item.type,
            item.amount,
        ]);

        const csv = [header, ...rows]
            .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">Activity</p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">Transactions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Search, filter, and sort the latest entries.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportCsv}
                        disabled={!filteredTransactions.length}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                        Export CSV
                    </button>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {filteredTransactions.length} records
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2">Category</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2">Amount</th>
                            {role === "admin" && <th className="px-3 py-2">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td className="rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-3 py-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400" colSpan={role === "admin" ? 5 : 4}>
                                    No transactions found for the selected filters. Try clearing the search.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((t) => (
                                <tr key={t.id} className="group rounded-[1.25rem] bg-slate-50/80 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:bg-slate-950/60 dark:hover:bg-slate-900">
                                    <td className="rounded-l-[1.25rem] px-3 py-4 text-slate-700 dark:text-slate-200">{t.date}</td>
                                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">{normalizeCategory(t.category)}</td>
                                    <td className="px-3 py-4 text-slate-700 dark:text-slate-200">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${t.type === "income"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200"
                                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
                                            }`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td
                                        className={`px-3 py-4 font-bold ${t.type === "income" ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
                                            }`}
                                    >
                                        {formatCurrency(t.amount)}
                                    </td>
                                    {role === "admin" && (
                                        <td className="rounded-r-[1.25rem] px-3 py-4">
                                            <button
                                                onClick={() => onEdit(t)}
                                                className="rounded-full border border-sky-500/40 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-500 hover:text-white dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-200"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
