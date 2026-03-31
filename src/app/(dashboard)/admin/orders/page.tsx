"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Search, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ORDER_STATUSES = ["new", "confirmed", "processing", "scheduled", "rendered", "delivered", "completed", "cancelled"];

const statusColors: Record<string, string> = {
  new: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  scheduled: "bg-purple-50 text-purple-700 border-purple-200",
  rendered: "bg-teal-50 text-teal-700 border-teal-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          id,
          customer_name,
          customer_phone,
          customer_address,
          quantity,
          total_amount,
          order_status,
          payment_status,
          payment_reference,
          created_at,
          products (title, type),
          businesses (business_name),
          agents (referral_code, users (full_name))
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
    } catch (err: any) {
      alert("Failed to update order: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.order_status === statusFilter;
    const matchesSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.businesses?.business_name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((acc, o) => acc + Number(o.total_amount), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            Platform Orders
          </h1>
          <p className="text-gray-500 font-medium tracking-wide mt-2">
            Full visibility and control over all customer orders across every business.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-center shadow-sm">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Orders</p>
            <p className="text-2xl font-black text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-green-600">Total Revenue</p>
            <p className="text-2xl font-black text-green-700">₦{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, order ID, business..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${statusFilter === "all" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
          >
            All
          </button>
          {["new", "confirmed", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap capitalize transition-colors ${statusFilter === s ? `${statusColors[s]} border` : "text-gray-500 hover:bg-gray-100"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
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
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Business</th>
                  <th className="px-6 py-4">Agent</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900 text-sm font-mono block">
                        ORD-{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 text-sm block">{order.customer_name}</span>
                      <span className="text-xs text-gray-400">{order.customer_phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-700 text-sm">{order.businesses?.business_name || "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                        {(order.agents?.users as any)?.full_name || order.agents?.referral_code || "Organic"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900">₦{Number(order.total_amount).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded border ${
                        order.payment_status === "paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded border ${statusColors[order.order_status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {updatingId === order.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400 ml-auto" />
                      ) : (
                        <div className="relative inline-block">
                          <select
                            value={order.order_status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:border-gray-300 transition-colors"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !loading && (
              <div className="py-24 text-center">
                <p className="text-gray-400 font-bold">No orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
