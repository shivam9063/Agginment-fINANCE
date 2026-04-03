import { useEffect, useState } from "react";

const navItems = [
    {
        label: "Dashboard",
        target: "overview",
        icon: (
            <path d="M4 11.5V20h6v-5.5H4Zm10 0V20h6v-8.5h-6ZM4 4v5.5h6V4H4Zm10 0v5.5h6V4h-6Z" />
        ),
    },
    {
        label: "Transactions",
        target: "transactions",
        icon: (
            <>
                <path d="M5 7h14" />
                <path d="M5 12h14" />
                <path d="M5 17h9" />
            </>
        ),
    },
    {
        label: "Insights",
        target: "insights",
        icon: (
            <>
                <path d="M12 3v18" />
                <path d="m7 14 5-5 4 4 5-7" />
            </>
        ),
    },
];

const Sidebar = ({ mobileOpen = false, onClose }) => {
    const [active, setActive] = useState("overview");

    const smoothScrollToTarget = (element) => {
        const y = element.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    };

    useEffect(() => {
        if (!mobileOpen) {
            document.body.style.overflow = "";
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileOpen, onClose]);

    const handleNavigate = (target) => {
        const element = document.getElementById(target);

        if (element) {
            setActive(target);

            if (onClose) {
                onClose();
                document.body.style.overflow = "";
                requestAnimationFrame(() => {
                    smoothScrollToTarget(element);
                });
                return;
            }

            smoothScrollToTarget(element);
        }
    };

    const sidebarContent = (
        <div className="flex h-full flex-col gap-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.2)] backdrop-blur">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Personal
                </div>
                <h2 className="mt-3 text-[1.7rem] font-black tracking-tight text-white">Finance</h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">Track, compare, and act fast.</p>
            </div>

            <nav className="space-y-1.5">
                {navItems.map((item) => {
                    const isActive = active === item.target;

                    return (
                        <button
                            key={item.target}
                            onClick={() => handleNavigate(item.target)}
                            className={`group flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${isActive
                                ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/20"
                                : "text-slate-300 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${isActive
                                    ? "border-white/20 bg-white/15"
                                    : "border-white/10 bg-white/5 group-hover:border-white/20 group-hover:bg-white/10"
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {item.icon}
                                    </svg>
                                </span>
                                <span>{item.label}</span>
                            </span>

                            <span className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full transition-all ${isActive ? "bg-white" : "bg-slate-500 group-hover:bg-slate-300"}`} />
                                <span className={`h-6 w-1 rounded-full transition-all ${isActive ? "bg-white/90" : "bg-transparent"}`} />
                            </span>
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-sky-500/15 via-cyan-400/10 to-emerald-400/10 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
                <p className="text-sm font-semibold text-white">Frontend demo</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">Viewer and admin mode with dark theme.</p>
            </div>
        </div>
    );

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-400 ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={!mobileOpen}
        >
            <button
                type="button"
                aria-label="Close navigation overlay"
                onClick={onClose}
                className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-400 ${mobileOpen ? "opacity-100" : "opacity-0"}`}
            />

            <aside className={`absolute left-0 top-4 flex h-[92vh] w-[86%] max-w-sm flex-col overflow-y-auto rounded-r-[1.75rem] border-r border-white/10 bg-slate-950/95 px-5 py-6 text-white shadow-[0_20px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl will-change-transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Menu</p>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:bg-white/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {sidebarContent}
            </aside>
        </div>
    );
};

export default Sidebar;