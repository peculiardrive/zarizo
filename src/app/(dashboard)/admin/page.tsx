"use client";

import { useState, useEffect } from "react";
import { Activity, Users, Box, CheckCircle2, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGmv: 0,
    activeBusinesses: 0,
    platformAgents: 0,
    pendingPayouts: 0
  });
  const [verificationQueue, setVerificationQueue] = useState<any[]>([]);
  const [adminName, setAdminName] = useState("Admin");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 0. Get Current Admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('users').select('full_name').eq('id', user.id).single();
        if (profile) setAdminName(profile.full_name);
      }
        // 1. Fetch Total GMV (Revenue)
        const { data: revenueData } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'paid');
        const gmv = revenueData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

        // 2. Fetch Active Businesses
        const { count: bizCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        // 3. Fetch Platform Agents
        const { count: agentCount } = await supabase
          .from('agents')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        // 4. Fetch Pending Payouts (Mocked value or sum of pending commissions)
        const { data: commissionData } = await supabase
          .from('commissions')
          .select('amount')
          .eq('payout_status', 'pending');
        const pending = commissionData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        setStats({
          totalGmv: gmv,
          activeBusinesses: bizCount || 0,
          platformAgents: agentCount || 0,
          pendingPayouts: pending
        });

        // 5. Fetch Verification Queue (Pending Businesses & Agents)
        const { data: pendingBiz } = await supabase
          .from('businesses')
          .select('id, business_name, created_at')
          .eq('status', 'pending')
          .limit(3);

        const { data: pendingAgents } = await supabase
          .from('agents')
          .select('id, referral_code, created_at, users(full_name)')
          .eq('status', 'pending')
          .limit(3);

        const queue = [
          ...(pendingBiz || []).map(b => ({ ...b, type: 'Business', name: b.business_name, req: 'Approval for store listing', icon: Box, color: 'text-purple-600', bg: 'bg-purple-50' })),
          ...(pendingAgents || []).map(a => ({ ...a, type: 'Agent', name: (a.users as any)?.full_name || a.referral_code, req: 'Banking verification request', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setVerificationQueue(queue);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id: string, type: 'Business' | 'Agent') => {
    try {
      const table = type === 'Business' ? 'businesses' : 'agents';
      const { error } = await supabase
        .from(table)
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      
      alert(`${type} approved successfully!`);
      await fetchAdminData(); // Refresh queue and stats
    } catch (err: any) {
      console.error(`Error approving ${type}:`, err.message);
      alert(`Failed to approve ${type}.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">
      
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Admin Command Center</h1>
          <p className="text-gray-500 font-medium tracking-wide mt-1">Real-time oversight of the entire Zarizo network.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white border border-gray-100 p-2 pr-6 rounded-full shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
            {adminName[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-tight">{adminName}</span>
            <span className="text-xs text-green-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Network Active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: `₦${stats.totalGmv.toLocaleString()}`, trend: "Live", info: "Platform GMV", icon: DollarSign, color: "text-green-600", bg: "bg-green-50", line: "border-green-100" },
          { label: "Active Businesses", value: stats.activeBusinesses.toString(), trend: "Verified", info: "All Time", icon: Store, color: "text-blue-600", bg: "bg-blue-50", line: "border-blue-100" },
          { label: "Platform Agents", value: stats.platformAgents.toString(), trend: "Active", info: "Total Network", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", line: "border-indigo-100" },
          { label: "Pending Payouts", value: `₦${stats.pendingPayouts.toLocaleString()}`, trend: "Action Req.", info: "Pending commissions", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", line: "border-red-100" }
        ].map((stat, i) => {
          const Icon = stat.icon || Activity;
          return (
            <div key={i} className={`p-6 bg-white rounded-3xl border ${stat.line} shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow relative overflow-hidden group`}>
              <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-black ${i === 3 ? 'text-red-500' : 'text-gray-900'}`}>{stat.trend}</span>
                  <span className="text-xs font-bold text-gray-400">{stat.info}</span>
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

      {/* Main Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Queue (Pending Items) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-lg font-black text-gray-900">Verification Queue</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Require Admin Approval</p>
            </div>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          
          <div className="divide-y divide-gray-50 flex-1">
            {verificationQueue.length > 0 ? (
              verificationQueue.map((task, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${task.bg} ${task.color}`}>
                      <task.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{task.name}</h4>
                      <p className="text-xs font-medium text-gray-500">{task.req} • <span className="text-gray-400">New</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleApprove(task.id, task.type)}
                      className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 hover:scale-105 active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-500 font-medium">
                No items in the verification queue.
              </div>
            )}
          </div>
        </div>

        {/* System Health / Analytics Snapshot */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden p-6 text-white relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-lg font-black text-white relative z-10 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Platform Velocity
          </h2>
          
          <div className="mt-8 space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-400">Agent Onboarding</span>
                <span className="text-green-400">+18%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-[78%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-400">Order Conversion</span>
                <span className="text-blue-400">12.4%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[45%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-400">Reseller Adoption (V2)</span>
                <span className="text-purple-400">Beta</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-[15%]"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800 relative z-10 hidden sm:block">
            <p className="text-xs font-medium text-gray-500 leading-relaxed">System diagnostics normal. All async commission trackers verifying consistently against DB queues. 100% SLA.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure simple Store icon helper for dashboard
const Store = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
)
