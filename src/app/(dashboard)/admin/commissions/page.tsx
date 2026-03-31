"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, Search, CheckCircle2, Clock, Ban, AlertCircle, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ManageCommissions() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchCommissions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("commissions")
        .select(`
          id,
          amount,
          payout_status,
          created_at,
          paid_at,
          agents (
            referral_code,
            bank_name,
            account_name,
            account_number,
            users (full_name)
          ),
          orders (customer_name, total_amount, payment_reference)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommissions(data || []);
    } catch (err) {
      console.error("Error fetching commissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const handleUpdateStatus = async (id: string, status: "paid" | "rejected") => {
    setActionId(id);
    try {
      const { error } = await supabase
        .from("commissions")
        .update({
          payout_status: status,
          paid_at: status === "paid" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
      await fetchCommissions();
    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const filtered = commissions.filter((c) => {
    const agentName = (c.agents?.users as any)?.full_name || "";
    const matchesFilter = filter === "all" || c.payout_status === filter;
    const matchesSearch =
      agentName.toLowerCase().includes(search.toLowerCase()) ||
      c.agents?.referral_code?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPending = commissions
    .filter((c) => c.payout_status === "pending")
    .reduce((acc, c) => acc + Number(c.amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            Commission Fulfillment
          </h1>
          <p className="text-gray-500 font-medium tracking-wide mt-2">
            Review and process agent commission payouts in real-time.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-amber-600">Pending Payout</p>
          <p className="text-2xl font-black text-amber-700">₦{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by agent name or code..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending", icon: Clock, active: "bg-amber-100 text-amber-700" },
            { label: "Paid", value: "paid", icon: CheckCircle2, active: "bg-green-100 text-green-700" },
            { label: "Rejected", value: "rejected", icon: XCircle, active: "bg-red-100 text-red-700" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filter === f.value
                  ? f.active || "bg-gray-900 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f.icon && <f.icon className="w-3.5 h-3.5" />} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-widest font-black text-gray-500">
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4">Bank Details</th>
                  <th className="px-6 py-4">Commission</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => {
                  const agentName = (item.agents?.users as any)?.full_name || item.agents?.referral_code || "Unknown";
                  const isProcessing = actionId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-black text-gray-900 block">{agentName}</span>
                        <span className="text-xs font-bold text-gray-400 font-mono">{item.agents?.referral_code}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-gray-700 block">{item.agents?.bank_name || "—"}</span>
                        <span className="text-xs font-bold text-gray-400">{item.agents?.account_number ? `****${item.agents.account_number.slice(-4)}` : "—"}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-green-600 text-lg">₦{Number(item.amount).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-5">
                        {item.payout_status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border border-amber-200/50">
                            <Clock className="w-3 h-3" /> Queued
                          </span>
                        )}
                        {item.payout_status === "paid" && (
                          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border border-green-200/50">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        )}
                        {item.payout_status === "rejected" && (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border border-red-200/50">
                            <Ban className="w-3 h-3" /> Rejected
                          </span>
                        )}
                        {item.payout_status === "requested" && (
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border border-blue-200/50">
                            <AlertCircle className="w-3 h-3" /> Requested
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-xs font-bold text-gray-400">
                        {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {isProcessing ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400 ml-auto" />
                        ) : item.payout_status === "pending" || item.payout_status === "requested" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(item.id, "paid")}
                              className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300 font-bold">
                            {item.paid_at ? `Paid ${new Date(item.paid_at).toLocaleDateString()}` : "No action"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && !loading && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-900">No matching commissions.</h3>
                <p className="text-sm font-medium text-gray-500 mt-1 max-w-sm">
                  Try adjusting your search or filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
