import { useSelector } from "react-redux";

const formatCurrency = (value) => `Rs ${value.toLocaleString("en-IN")}`;

const Cards = () => {
    const transactions = useSelector((state) => state.finance.transactions);

    const totals = transactions.reduce(
        (acc, t) => {
            if (t.type === "income") acc.income += t.amount;
            if (t.type === "expense") acc.expense += t.amount;
            return acc;
        },
        { income: 0, expense: 0 }
    );

    const balance = totals.income - totals.expense;

    const cardData = [
        {
            title: "Total Balance",
            value: formatCurrency(balance),
            style:
                balance >= 0
                    ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-white"
                    : "bg-rose-600 text-white dark:bg-rose-700 dark:text-white",
        },
        {
            title: "Income",
            value: formatCurrency(totals.income),
            style: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
        },
        {
            title: "Expenses",
            value: formatCurrency(totals.expense),
            style: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200",
        },
    ];

    return (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cardData.map((card) => (
                <div
                    key={card.title}
                    className={`group relative overflow-hidden rounded-[1.75rem] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:p-5 dark:ring-white/10 ${card.style}`}
                >
                    <div className="absolute inset-x-0 top-0 h-1 bg-white/20" />
                    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl transition group-hover:scale-125" />
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">{card.title}</p>
                    <p className="mt-3 text-2xl font-black tracking-tight sm:text-[2rem]">{card.value}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] opacity-70">Updated live from the store</p>
                </div>
            ))}
        </div>
    );
};

export default Cards;
