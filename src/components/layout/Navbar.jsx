import { useDispatch, useSelector } from "react-redux";
import { setFilter, setRole, setSearch, toggleDarkMode } from "../../features/finance/financeSlice";

const navItems = [
    { label: "Overview", target: "overview" },
    { label: "Charts", target: "charts" },
    { label: "Insights", target: "insights" },
    { label: "Transactions", target: "transactions" },
];

const Navbar = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const { role, darkMode, search, filter } = useSelector((state) => state.finance);
    const todayLabel = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    });

    const smoothScrollToTarget = (element) => {
        const y = element.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    };

    const handleNavigate = (target) => {
        const element = document.getElementById(target);

        if (element) {
            smoothScrollToTarget(element);
        }
    };

    return (
        <div className="mb-6 space-y-4 rounded-[1.75rem] border border-white/70 bg-white/85 p-4 shadow-[0_16px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:p-5 md:space-y-5 md:p-6 dark:border-white/10 dark:bg-slate-900/75">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        aria-label="Open navigation menu"
                    >
                        <span className="flex flex-col gap-1.5">
                            <span className="h-0.5 w-4 rounded-full bg-current" />
                            <span className="h-0.5 w-4 rounded-full bg-current" />
                            <span className="h-0.5 w-4 rounded-full bg-current" />
                        </span>
                    </button>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">Overview</p>
                        <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">Finance Dashboard</h1>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Track balance, spending, and role-based actions in a cleaner, more responsive workspace.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 sm:inline-flex">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>
                        Live sync
                    </div>
                    <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:inline-flex">
                        {todayLabel}
                    </div>
                    <button
                        onClick={() => dispatch(toggleDarkMode())}
                        type="button"
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        title={darkMode ? "Light mode" : "Dark mode"}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2" />
                                <path d="M12 20v2" />
                                <path d="m4.93 4.93 1.41 1.41" />
                                <path d="m17.66 17.66 1.41 1.41" />
                                <path d="M2 12h2" />
                                <path d="M20 12h2" />
                                <path d="m6.34 17.66-1.41 1.41" />
                                <path d="m19.07 4.93-1.41 1.41" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3a7 7 0 1 0 9 9 9 9 0 1 1-9-9z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.9fr_0.9fr]">
                <input
                    value={search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                    placeholder="Search category or amount"
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/90 dark:text-white"
                />

                <select
                    value={filter}
                    onChange={(e) => dispatch(setFilter(e.target.value))}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/90 dark:text-white"
                >
                    <option value="all">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={role}
                    onChange={(e) => dispatch(setRole(e.target.value))}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950/90 dark:text-white"
                >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:hidden">
                {navItems.map((item) => (
                    <button
                        key={item.target}
                        onClick={() => handleNavigate(item.target)}
                        className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Navbar;
