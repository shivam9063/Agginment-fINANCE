import { useEffect } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";

function App() {
  const darkMode = useSelector((state) => state.finance.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900 transition-colors duration-300 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.12),transparent_22%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_18%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 dark:opacity-15" />
      <div className="absolute left-8 top-10 h-44 w-44 rounded-full bg-sky-400/20 blur-3xl motion-safe:animate-pulse dark:bg-sky-500/10" />
      <div className="absolute right-8 top-28 h-52 w-52 rounded-full bg-emerald-400/15 blur-3xl motion-safe:animate-pulse dark:bg-emerald-500/10" />
      <div className="relative min-h-screen bg-[linear-gradient(to_bottom,rgba(248,250,252,0.82),rgba(226,232,240,0.88))] backdrop-blur-sm dark:bg-[linear-gradient(to_bottom,rgba(2,6,23,0.85),rgba(15,23,42,0.92))]">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;