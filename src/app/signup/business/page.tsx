"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function BusinessSignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            full_name: formData.ownerName,
            role: "business_owner",
          }
        }
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Unknown error creating user.");

      // 2. Insert into our custom public.users table (if not handled by Supabase Triggers automatically)
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          full_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          role: "business_owner",
          status: "active"
        }
      ]);

      if (userError) console.error("Could not insert public user row:", userError); // We log rather than throw in case trigger handled it

      // 3. Insert into the public.businesses table
      const { error: businessError } = await supabase.from("businesses").insert([
        {
          owner_user_id: authData.user.id,
          business_name: formData.businessName,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
          status: "pending" // Requires Admin Approval
        }
      ]);

      if (businessError) throw new Error("Failed to register business details context.");

      // Success! Route the user to the business dashboard.
      router.push("/business");
      
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] selection:bg-blue-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="flex items-center space-x-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">Z</div>
          <span className="text-3xl font-black tracking-tighter text-gray-900">Zarizo</span>
        </Link>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Register your Business</h2>
        <p className="mt-2 text-sm text-gray-600 font-medium">Start expanding your sales network with autonomous agents.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl border border-gray-100 sm:px-10 relative overflow-hidden">
          
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-2">
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Business Name</label>
              <Input name="businessName" type="text" required onChange={handleChange} placeholder="Acme Logistics Ltd" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Owner Full Name</label>
              <Input name="ownerName" type="text" required onChange={handleChange} placeholder="Jane Doe" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Email address</label>
              <Input name="email" type="email" required onChange={handleChange} placeholder="owner@business.com" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <Input name="phone" type="tel" required onChange={handleChange} placeholder="+234 800 000 0000" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Secure Password</label>
              <Input name="password" type="password" required onChange={handleChange} placeholder="••••••••" className="h-11 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-blue-600 focus-visible:bg-white transition-all shadow-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Business Description</label>
              <textarea 
                name="description" 
                rows={3} 
                required 
                onChange={handleChange} 
                placeholder="Tell us what products you sell..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder:text-gray-400 shadow-sm transition-all"
              ></textarea>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full h-12 text-base font-black rounded-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Business Account"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm font-bold text-gray-500 relative z-10">
            Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Log in securely</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
