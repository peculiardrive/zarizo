"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Search, Loader2, CheckCircle2, XCircle, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, businesses (business_name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStatusChange = async (id: string, newStatus: "active" | "inactive" | "pending_approval") => {
    setActionId(id);
    try {
      const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setActionId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.businesses?.business_name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = products.filter((p) => p.status === "pending_approval").length;

  const statusColors: Record<string, string> = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
    pending_approval: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            Product Catalog
          </h1>
          <p className="text-gray-500 font-medium tracking-wide mt-2">
            Review, approve, or deactivate products listed by businesses on the platform.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-center animate-pulse">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600">Needs Review</p>
            <p className="text-2xl font-black text-amber-700">{pendingCount} Product{pendingCount !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product or business name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending_approval" },
            { label: "Inactive", value: "inactive" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                statusFilter === f.value
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 flex items-center justify-center bg-white rounded-3xl border border-gray-100">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const isProcessing = actionId === product.id;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-lg transition-all flex flex-col"
              >
                {/* Product Image */}
                <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden relative">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Package className="w-12 h-12 text-gray-300" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[product.status]}`}>
                      {product.status === "pending_approval" ? "Pending" : product.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold bg-white/80 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full border border-gray-200 capitalize">
                      {product.type}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-gray-900 text-base leading-tight mb-1">{product.title}</h3>
                  <p className="text-xs font-bold text-gray-400 mb-4">by {product.businesses?.business_name || "Unknown Business"}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-black text-gray-900">₦{Number(product.price).toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-400">Commission</span>
                      <p className="text-sm font-black text-green-600">
                        {product.commission_value}{product.commission_type === "percentage" ? "%" : "₦ flat"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2 pt-3 border-t border-gray-50">
                    {isProcessing ? (
                      <div className="flex-1 flex items-center justify-center py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {product.status === "pending_approval" && (
                          <button
                            onClick={() => handleStatusChange(product.id, "active")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white text-xs font-black px-3 py-2.5 rounded-xl hover:bg-green-700 transition-colors shadow-md shadow-green-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {product.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(product.id, "inactive")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 text-xs font-black px-3 py-2.5 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Deactivate
                          </button>
                        )}
                        {product.status === "inactive" && (
                          <button
                            onClick={() => handleStatusChange(product.id, "active")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 text-green-600 text-xs font-black px-3 py-2.5 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        )}
                        <a
                          href={`/products/${product.id}`}
                          target="_blank"
                          className="flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs font-black px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-gray-100">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No products found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
