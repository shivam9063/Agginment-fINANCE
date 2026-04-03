import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addTransaction, updateTransaction } from "../../features/finance/financeSlice";

const AddTransactionModal = ({ close, initialTransaction }) => {
    const dispatch = useDispatch();
    const isEditing = Boolean(initialTransaction);

    const [form, setForm] = useState({
        amount: "",
        category: "",
        type: "expense",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialTransaction) {
            setForm({
                amount: String(initialTransaction.amount),
                category: initialTransaction.category,
                type: initialTransaction.type,
            });
        } else {
            setForm({ amount: "", category: "", type: "expense" });
        }
    }, [initialTransaction]);

    const handleSubmit = () => {
        const amount = Number(form.amount);
        const category = form.category.trim();

        if (!category) {
            setError("Category is required.");
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }

        setError("");

        const payload = {
            ...(initialTransaction || {}),
            ...form,
            category,
            id: initialTransaction?.id || Date.now(),
            date: initialTransaction?.date || new Date().toISOString().slice(0, 10),
            amount,
        };

        dispatch(isEditing ? updateTransaction(payload) : addTransaction(payload));
        close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-md">
            <div className="w-full max-w-md rounded-[1.75rem] border border-white/60 bg-white/92 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-slate-900/90 dark:text-white">
                <h2 className="mb-1 text-xl font-black tracking-tight">{isEditing ? "Edit Transaction" : "Add Transaction"}</h2>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    {isEditing ? "Update the selected entry." : "Create a new income or expense entry."}
                </p>

                <input
                    placeholder="Amount"
                    value={form.amount}
                    className="mb-3 w-full rounded-2xl border border-slate-200 bg-white/80 p-3 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/80"
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />

                <input
                    placeholder="Category"
                    value={form.category}
                    className="mb-3 w-full rounded-2xl border border-slate-200 bg-white/80 p-3 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/80"
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />

                <select
                    value={form.type}
                    className="mb-5 w-full rounded-2xl border border-slate-200 bg-white/80 p-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/80"
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                {error && <p className="mb-4 text-sm font-medium text-rose-500">{error}</p>}

                <div className="flex gap-3">
                    <button
                        onClick={close}
                        className="w-1/2 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="w-1/2 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-500 hover:to-cyan-400"
                    >
                        {isEditing ? "Save" : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;