"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Fetch User Role from the 'users' table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      // 3. Redirect based on role
      const role = userData?.role;
      if (role === 'admin') {
        router.push('/admin');
      } else if (role === 'business_owner') {
        router.push('/business');
      } else if (role === 'agent') {
        router.push('/agent');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please check your credentials.");
      console.error("Login Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white font-[family-name:var(--font-geist-sans)] selection:bg-blue-200">
      
      {/* Left Pane - Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-8 sm:px-16 xl:px-24 bg-white relative z-10 shadow-[0_0_60px_-15px_rgba(0,0,0,0.1)]">
        <Link href="/" className="absolute top-10 left-8 sm:left-16 flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Zarizo
        </Link>
        
        <div className="w-full max-w-sm mx-auto mt-20">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              Z
            </div>
            <span className="text-3xl font-black tracking-tighter text-gray-900">Sign In</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium mb-10">Sign in to manage your digital sales network, track automated commissions, and more.</p>

          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700" htmlFor="email">Email or Phone Profile</label>
              <Input
                id="email"
                name="email"
                type="text"
                required
                onChange={handleChange}
                placeholder="you@company.com"
                className="h-12 border-gray-200 shadow-sm rounded-xl px-4 font-medium focus-visible:ring-gray-900"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700" htmlFor="password">Secure Password</label>
                <Link href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot?</Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                onChange={handleChange}
                placeholder="••••••••"
                className="h-12 border-gray-200 shadow-sm rounded-xl px-4 font-medium focus-visible:ring-gray-900"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-black bg-gray-900 hover:bg-black text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? "Authenticating..." : "Secure Autologin"}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-500">
              Fresh to Zarizo? {" "}
              <Link href="/signup" className="text-blue-600 hover:underline">Start an Account</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Visual Decoration */}
      <div className="hidden lg:flex flex-1 relative bg-gray-50 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-400 to-indigo-300 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-30 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 max-w-lg text-center space-y-8 px-12">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-white/50 backdrop-blur-2xl border border-white shadow-2xl flex items-center justify-center">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Commerce, completely streamlined.</h3>
          <p className="text-xl text-gray-600 font-medium">Zarizo was crafted to take the friction out of B2B tracking. We handle the math, so you can manage your inventory autonomously.</p>
        </div>
        
        {/* Glass elements */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl"></div>
      </div>
    </div>
  );
}
