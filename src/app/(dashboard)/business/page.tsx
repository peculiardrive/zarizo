"use client";

import { useState, useEffect } from "react";
import { Package, TrendingUp, Users, ShoppingCart, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function BusinessDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeProducts: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "physical",
    price: "",
    commission_type: "percentage",
    commission_value: "",
    image: ""
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Get Current User & Business
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_user_id', user.id)
        .single();
      
      if (!business) {
        setLoading(false);
        return;
      }
      setBusinessProfile(business);

      // 2. Fetch Total Revenue (Sum of total_amount from paid orders for THIS business)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('business_id', business.id)
        .eq('payment_status', 'paid');
      
      const totalRev = revenueData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

      // 3. Fetch Active Products count for THIS business
      const { count: activeCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('status', 'active');

      // 4. Fetch Total Orders count for THIS business
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id);

      setStats({
        totalRevenue: totalRev,
        activeProducts: activeCount || 0,
        totalOrders: ordersCount || 0
      });

      // 5. Fetch Recent Orders for THIS business
      const { data: orders } = await supabase
        .from('orders')
        .select(`
          id,
          customer_name,
          total_amount,
          order_status,
          quantity,
          products (title),
          agents (referral_code)
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders) setRecentOrders(orders);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Use existing business profile
      if (!businessProfile) {
        alert("No business profile found. Please wait for the dashboard to load or refresh.");
        return;
      }

      // 2. Insert Product
      const { error } = await supabase.from('products').insert({
        business_id: businessProfile.id,
        title: formData.title,
        type: formData.type,
        price: parseFloat(formData.price),
        commission_type: formData.commission_type,
        commission_value: parseFloat(formData.commission_value),
        image: formData.image || null,
        status: 'active'
      });

      if (error) throw error;

      // 3. Reset and Refresh
      setShowAddProduct(false);
      setFormData({
        title: "",
        type: "physical",
        price: "",
        commission_type: "percentage",
        commission_value: "",
        image: ""
      });
      await fetchDashboardData();
      alert("Product published successfully!");

    } catch (error: any) {
      console.error("Error publishing product:", error.message);
      alert("Failed to publish product. Please check console.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">
      
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <StoreIcon className="w-6 h-6" />
            </div>
            Business Workspace
          </h1>
          <p className="text-gray-500 font-medium tracking-wide mt-2">Manage your inventory, set agent commissions, and fulfill orders.</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => setShowAddProduct(!showAddProduct)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold tracking-tight shadow-xl shadow-blue-500/20 px-6 h-11 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, trend: "Live", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50", line: "border-green-100" },
          { label: "Active Products", value: stats.activeProducts.toString(), trend: "Catalog", icon: Package, color: "text-blue-600", bg: "bg-blue-50", line: "border-blue-100" },
          { label: "Total Orders", value: stats.totalOrders.toString(), trend: "All Time", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", line: "border-indigo-100" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
             <div key={i} className={`p-6 bg-white rounded-3xl border ${stat.line} shadow-sm relative overflow-hidden group transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-gray-900">{stat.trend}</span>
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-gray-900 tracking-tight">{loading ? "..." : stat.value}</h3>
                <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Product Form Triggered State */}
      {showAddProduct && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-gray-900">Create New Product Listing</h2>
            <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-900 font-bold text-sm bg-gray-100 px-3 py-1 rounded-full">Cancel</button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Product Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Premium Running Shoes" 
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" 
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Product Category Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              >
                <option value="physical">Physical Good (Requires Delivery)</option>
                <option value="digital">Digital Product (Email Delivery)</option>
                <option value="service">Service (Requires Appointment)</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Retail Price (₦)</label>
              <input 
                type="number" 
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="45000" 
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Agent Commission Rate</label>
              <div className="flex items-center space-x-2">
                <select 
                  value={formData.commission_type}
                  onChange={(e) => setFormData({...formData, commission_type: e.target.value})}
                  className="h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₦)</option>
                </select>
                <input 
                  type="number" 
                  required
                  value={formData.commission_value}
                  onChange={(e) => setFormData({...formData, commission_value: e.target.value})}
                  placeholder="10" 
                  className="flex-1 h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" 
                />
              </div>
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Product Image URL (Mocking File Upload)</label>
              <input 
                type="text" 
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg" 
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" 
              />
            </div>

             <div className="pt-2 md:col-span-2">
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full md:w-auto px-8 h-12 text-base font-black rounded-xl bg-gray-900 hover:bg-black text-white shadow-xl flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Package className="w-5 h-5" />
                )}
                {submitting ? "Publishing..." : "Publish to Catalog"}
              </Button>
            </div>
          </form>
        </div>
      )}


      {/* Recent Orders Processing */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Requires Fulfillment</p>
          </div>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        
        <div className="divide-y divide-gray-50">
          {recentOrders.length > 0 ? (
            recentOrders.map((order, i) => (
              <div key={i} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className={`p-4 rounded-xl flex items-center justify-center ${order.order_status === 'new' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                     <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">ORD-{order.id.slice(0, 4).toUpperCase()} • {order.products?.title || "Product"} (x{order.quantity})</h4>
                    <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-2">
                      <span className="font-bold text-gray-900">₦{Number(order.total_amount).toLocaleString()}</span> 
                      • <Tag className="w-3 h-3 ml-1" /> {order.customer_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                  <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border ${order.order_status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : order.order_status === 'new' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                    {order.order_status}
                  </span>
                  <button className="text-xs font-bold px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors shadow-md">
                    Manage Order
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500 font-medium">
              No recent orders found.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

const StoreIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
)
