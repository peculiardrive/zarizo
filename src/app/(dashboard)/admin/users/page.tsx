"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Store, Search, Loader2, ShieldCheck, ShieldOff, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "users" | "businesses" | "agents";

export default function AdminUsersPage() {
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "users") {
        const { data: rows } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });
        setData(rows || []);
      } else if (tab === "businesses") {
        const { data: rows } = await supabase
          .from("businesses")
          .select("*, users (full_name, email)")
          .order("created_at", { ascending: false });
        setData(rows || []);
      } else if (tab === "agents") {
        const { data: rows } = await supabase
          .from("agents")
          .select("*, users (full_name, email, phone)")
          .order("created_at", { ascending: false });
        setData(rows || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
    setSearch("");
  }, [fetchData]);

  const handleToggleStatus = async (id: string, currentStatus: string, table: string) => {
    setActionId(id);
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      const { error } = await supabase.from(table).update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleApprove = async (id: string, table: string) => {
    setActionId(id);
    try {
      const { error } = await supabase.from(table).update({ status: "approved" }).eq("id", id);
      if (error) throw error;
      setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item)));
    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const filtered = data.filter((item) => {
    const name = item.full_name || item.business_name || (item.users as any)?.full_name || "";
    const email = item.email || (item.users as any)?.email || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-50 text-green-700 border-green-200",
      approved: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      suspended: "bg-red-50 text-red-700 border-red-200",
    };
    return map[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          User Management
        </h1>
        <p className="text-gray-500 font-medium tracking-wide mt-2">
          Oversee all users, businesses, and agents. Approve or suspend accounts.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex gap-1 w-fit shadow-sm">
        {[
          { label: "All Users", value: "users" as Tab, icon: Users },
          { label: "Businesses", value: "businesses" as Tab, icon: Store },
          { label: "Agents", value: "agents" as Tab, icon: ShieldCheck },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.value
                ? "bg-gray-900 text-white shadow-md"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${tab}...`}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-widest font-black text-gray-500">
                  <th className="px-6 py-4">Name</th>
                  {tab === "users" && <th className="px-6 py-4">Role</th>}
                  {tab === "businesses" && <th className="px-6 py-4">Owner</th>}
                  {tab === "agents" && <th className="px-6 py-4">Referral Code</th>}
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => {
                  const isProcessing = actionId === item.id;
                  const name = item.full_name || item.business_name || (item.users as any)?.full_name || "Unknown";
                  const email = item.email || (item.users as any)?.email || "—";
                  const table = tab === "users" ? "users" : tab === "businesses" ? "businesses" : "agents";

                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-gray-600 text-sm flex-shrink-0">
                            {name[0]?.toUpperCase()}
                          </div>
                          <span className="font-black text-gray-900 text-sm">{name}</span>
                        </div>
                      </td>
                      {tab === "users" && (
                        <td className="px-6 py-4">
                          <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                            item.role === "admin" ? "bg-purple-50 text-purple-700 border-purple-200" :
                            item.role === "business_owner" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-indigo-50 text-indigo-700 border-indigo-200"
                          }`}>
                            {item.role?.replace("_", " ")}
                          </span>
                        </td>
                      )}
                      {tab === "businesses" && (
                        <td className="px-6 py-4 text-sm font-bold text-gray-600">
                          {(item.users as any)?.full_name || item.owner_name}
                        </td>
                      )}
                      {tab === "agents" && (
                        <td className="px-6 py-4">
                          <span className="text-xs font-black font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                            {item.referral_code}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded border ${statusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-bold">
                        {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-auto" />
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {item.status === "pending" && (
                              <button
                                onClick={() => handleApprove(item.id, table)}
                                className="flex items-center gap-1.5 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <ShieldCheck className="w-3 h-3" /> Approve
                              </button>
                            )}
                            {item.status !== "pending" && item.role !== "admin" && (
                              <button
                                onClick={() => handleToggleStatus(item.id, item.status, table)}
                                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${
                                  item.status === "suspended"
                                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                }`}
                              >
                                {item.status === "suspended" ? (
                                  <><ShieldCheck className="w-3 h-3" /> Reinstate</>
                                ) : (
                                  <><ShieldOff className="w-3 h-3" /> Suspend</>
                                )}
                              </button>
                            )}
                            {item.role === "admin" && (
                              <span className="flex items-center gap-1 text-xs font-black text-purple-600">
                                <ShieldAlert className="w-3.5 h-3.5" /> Super Admin
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="py-24 text-center">
                <p className="text-gray-400 font-bold">No records found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
