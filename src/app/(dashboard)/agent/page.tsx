"use client";

import { useState, useEffect } from "react";
import { Link2, Users, DollarSign, Wallet, ArrowUpRight, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AgentDashboard() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingCommissions: 0,
    referrals: 0, // Placeholder for v2 click tracking
    orders: 0
  });

  useEffect(() => {
    async function fetchAgentDashboard() {
      setLoading(true);
      try {
        // 1. Get Current User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 2. Get Agent Profile
        const { data: agent } = await supabase
          .from('agents')
          .select('*, users(full_name)')
          .eq('user_id', user.id)
          .single();
        
        if (!agent) return;
        setAgentProfile(agent);

        // 3. Get Commissions & Stats
        const { data: comms } = await supabase
          .from('commissions')
          .select('*, orders(customer_name, total_amount)')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false });

        if (comms) {
          setCommissions(comms);
          
          const total = comms.reduce((acc, curr) => acc + Number(curr.amount), 0);
          const pending = comms
            .filter(c => c.payout_status === 'pending' || c.payout_status === 'requested')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
            
          setStats(prev => ({
            ...prev,
            totalEarnings: total,
            pendingCommissions: pending,
            orders: comms.length
          }));
        }

      } catch (err) {
        console.error("Error fetching agent dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgentDashboard();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!agentProfile) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Agent Profile Not Found</h2>
        <p className="text-gray-500 mb-8 text-lg">We couldn't find an agent profile linked to your account.</p>
        <button onClick={() => window.location.reload()} className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">Retry Connection</button>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/products?ref=${agentProfile.referral_code}`;
  const initials = agentProfile.users?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || "A";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-[family-name:var(--font-geist-sans)]">
      
      {/* Dynamic Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start xl:items-end gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl shadow-sm border border-purple-200">
              <Users className="w-6 h-6" />
            </div>
            Agent Portal
          </h1>
          <p className="text-gray-500 font-medium tracking-wide mt-2">Generate your referral links, track incoming sales, and request payouts.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white border border-gray-200 p-2 pr-6 rounded-full shadow-lg shadow-gray-200/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-purple-500/20">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-gray-900 leading-tight">{agentProfile.users?.full_name}</span>
            <span className="text-xs text-purple-600 font-black uppercase tracking-widest flex items-center gap-1">
               Zarizo Partner
            </span>
          </div>
        </div>
      </div>

      {/* Strategic KPI Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Earnings", value: `₦${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50", line: "border-green-200" },
          { label: "Pending Commissions", value: `₦${stats.pendingCommissions.toLocaleString()}`, icon: Wallet, color: "text-amber-600", bg: "bg-amber-50", line: "border-amber-200" },
          { label: "Total Link Clicks", value: stats.referrals.toString(), icon: Link2, color: "text-blue-600", bg: "bg-blue-50", line: "border-blue-200" },
          { label: "Confirmed Orders", value: stats.orders.toString(), icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50", line: "border-indigo-200" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
             <div key={i} className={`p-6 bg-white rounded-3xl border border-gray-100 border-b-4 ${stat.line} shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-4 ring-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                <p className="text-sm font-bold text-gray-500 mt-1 tracking-wider uppercase">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Referral Link Generator & Network Tracking Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main URL Generator */}
        <div className="lg:col-span-2 bg-gray-900 rounded-[2.5rem] border border-gray-800 shadow-2xl p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h2 className="text-2xl font-black text-white relative z-10 mb-2">Share & Earn</h2>
          <p className="text-gray-400 font-medium mb-8 relative z-10 max-w-md">Copy your unique global referral link below. Any purchase made through this link is permanently attributed to your wallet.</p>
          
          <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden px-4">
               <Link2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
               <span className="text-white font-mono text-sm sm:text-base truncate">{referralLink}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(referralLink)}
              className="flex-shrink-0 bg-white text-gray-900 font-black px-6 py-3 rounded-xl hover:bg-gray-100 hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 shadow-lg"
            >
              {copiedLink === referralLink ? <><CheckCircle2 className="w-4 h-4 text-green-600" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </button>
          </div>

          <div className="mt-8 relative z-10 flex gap-4">
             <button className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-black p-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20">
               Share to WhatsApp
             </button>
             <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black border border-white/20 p-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
               Browse Catalog <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Payout Processing Tracking Log */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Wallet Logs</h2>
            <button className="text-sm font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">Withdraw</button>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {commissions.length > 0 ? (
              commissions.map((txn, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-black text-gray-900 text-sm">+₦{Number(txn.amount).toLocaleString()}</span>
                    <span className="text-xs font-bold text-gray-500 mt-0.5">{txn.orders?.customer_name || "Direct Sale"}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded border ${txn.payout_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {txn.payout_status}
                    </span>
                    <span className="text-xs font-medium text-gray-400 mt-1">{new Date(txn.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">
                No Transactions Yet
              </div>
            )}
          </div>
        </div>

      </div>
      
    </div>
  );
}
