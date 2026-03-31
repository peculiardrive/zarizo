"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AgentSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Authenticate / Sign up the User with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "agent",
          }
        }
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Unknown error creating agent user profile.");

      // 2. Insert into custom public.users table
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: "agent",
          status: "active"
        }
      ]);

      if (userError) console.error("User row duplication or error:", userError.message);

      // Generate a mock unique code for MVP tracking (V2 will let them pick or format nicely)
      const mockReferralCode = formData.fullName.split(' ')[0].toUpperCase() + Math.floor(1000 + Math.random() * 9000);

      // 3. Insert into the public.agents table
      const { error: agentError } = await supabase.from("agents").insert([
        {
          user_id: authData.user.id,
          referral_code: mockReferralCode,
          bank_name: formData.bankName,
          account_name: formData.accountName,
          account_number: formData.accountNumber,
          status: "pending" // Admin must approve
        }
      ]);

      if (agentError) throw new Error("Could not register banking fulfillment logic.");

      // Success
      router.push("/agent");
      
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] selection:bg-blue-200 overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <Link href="/" className="flex items-center space-x-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">Z</div>
          <span className="text-3xl font-black tracking-tighter text-gray-900">Zarizo</span>
        </Link>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Become an Agent</h2>
        <p className="mt-2 text-sm text-gray-600 font-medium max-w-xs">Earn scalable commissions silently securely through banking connections.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 relative z-10">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sm:rounded-3xl sm:px-10">
          
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-2">
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <Input name="fullName" type="text" required onChange={handleChange} placeholder="John Doe" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Email address</label>
                <Input name="email" type="email" required onChange={handleChange} placeholder="agent@mail.com" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <Input name="phone" type="tel" required onChange={handleChange} placeholder="+234 812..." className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700">Private Password</label>
                <Input name="password" type="password" required onChange={handleChange} placeholder="••••••••" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs uppercase">💰</span>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Payout Config (Fulfillment)</h3>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Bank Name</label>
                  <Input name="bankName" type="text" required onChange={handleChange} placeholder="Fidelity Bank" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Account Number</label>
                  <Input name="accountNumber" type="text" required onChange={handleChange} placeholder="0001112223" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
                </div>
                
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Registered Account Name</label>
                  <Input name="accountName" type="text" required onChange={handleChange} placeholder="John Doe" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-black rounded-xl bg-gray-900 hover:bg-black text-white shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Agent Network Profile"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm font-bold text-gray-500 relative z-10">
            Already verified? <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Log in securely</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
