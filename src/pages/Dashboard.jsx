import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Cards from "../components/dashboard/Cards";
import Charts from "../components/dashboard/Charts";
import Insights from "../components/dashboard/Insights";
import TransactionTable from "../components/transactions/TransactionTable";
import AddTransactionModal from "../components/transactions/AddTransaction";
import { useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const [open, setOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const role = useSelector((state) => state.finance.role);

    const handleAdd = () => {
        setEditingTransaction(null);
        setOpen(true);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setOpen(true);
    };

    const closeModal = () => {
        setOpen(false);
        setEditingTransaction(null);
    };

    const openMobileNav = () => setMobileNavOpen(true);
    const closeMobileNav = () => setMobileNavOpen(false);

    return (
        <div className="w-full">
            <Sidebar mobileOpen={mobileNavOpen} onClose={closeMobileNav} />

            <div className="w-full px-3 py-4 sm:px-4 md:p-6 lg:px-8">
                <div className="mx-auto w-full max-w-none space-y-5 sm:space-y-6">
                    <section id="overview" className="scroll-mt-6 section-reveal section-reveal-1">
                        <Navbar onMenuClick={openMobileNav} />

                        {role === "admin" && (
                            <button
                                onClick={handleAdd}
                                className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] hover:from-sky-500 hover:to-blue-500 sm:w-auto"
                            >
                                + Add Transaction
                            </button>
                        )}

                        <Cards />
                    </section>

                    <section id="charts" className="scroll-mt-6 section-reveal section-reveal-2">
                        <Charts />
                    </section>

                    <section id="insights" className="scroll-mt-6 section-reveal section-reveal-3">
                        <Insights />
                    </section>

                    <section id="transactions" className="scroll-mt-6 section-reveal section-reveal-4">
                        <TransactionTable onEdit={handleEdit} />
                    </section>
                </div>

                {open && (
                    <AddTransactionModal
                        close={closeModal}
                        initialTransaction={editingTransaction}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;