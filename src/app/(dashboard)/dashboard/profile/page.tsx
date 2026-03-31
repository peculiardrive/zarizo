"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Camera, Save, User, Building2, Banknote, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [roleData, setRoleData] = useState<any>(null); // agent or business record
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    // Business fields
    business_name: "",
    description: "",
    logo: "",
    // Agent fields
    bank_name: "",
    account_name: "",
    account_number: "",
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;
      setUser(authUser);

      // Fetch public user profile
      const { data: publicUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (publicUser) {
        setProfile(publicUser);
        setForm(f => ({
          ...f,
          full_name: publicUser.full_name || "",
          email: publicUser.email || "",
          phone: publicUser.phone || "",
        }));
      }

      // Fetch role-specific data
      if (publicUser?.role === "business_owner") {
        const { data: biz } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_user_id", authUser.id)
          .single();
        if (biz) {
          setRoleData(biz);
          setForm(f => ({
            ...f,
            business_name: biz.business_name || "",
            description: biz.description || "",
            logo: biz.logo || "",
          }));
        }
      } else if (publicUser?.role === "agent") {
        const { data: agent } = await supabase
          .from("agents")
          .select("*")
          .eq("user_id", authUser.id)
          .single();
        if (agent) {
          setRoleData(agent);
          setForm(f => ({
            ...f,
            bank_name: agent.bank_name || "",
            account_name: agent.account_name || "",
            account_number: agent.account_number || "",
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Save avatar URL to users table
      await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", user.id);
      setProfile((p: any) => ({ ...p, avatar_url: publicUrl }));
      showToast("success", "Profile picture updated!");
    } catch (err: any) {
      showToast("error", "Upload failed: " + (err.message || "Check your Supabase Storage bucket exists and is public."));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);

    try {
      // Update public users table
      const { error: userErr } = await supabase.from("users").update({
        full_name: form.full_name,
        phone: form.phone,
      }).eq("id", user.id);

      if (userErr) throw userErr;

      // Update role-specific table
      if (profile.role === "business_owner" && roleData) {
        const { error: bizErr } = await supabase.from("businesses").update({
          business_name: form.business_name,
          description: form.description,
          logo: form.logo || null,
        }).eq("id", roleData.id);
        if (bizErr) throw bizErr;
      } else if (profile.role === "agent" && roleData) {
        const { error: agentErr } = await supabase.from("agents").update({
          bank_name: form.bank_name,
          account_name: form.account_name,
          account_number: form.account_number,
        }).eq("id", roleData.id);
        if (agentErr) throw agentErr;
      }

      showToast("success", "Profile saved successfully!");
      await fetchProfile();
    } catch (err: any) {
      showToast("error", "Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-24 text-gray-400 font-bold">Could not load profile. Please sign in.</div>
    );
  }

  const role = profile.role;
  const initials = profile.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "?";
  const roleLabel = { admin: "Super Admin", business_owner: "Business Owner", agent: "Sales Agent" }[role as string] || role;
  const roleBadgeColor = { admin: "bg-purple-100 text-purple-700 border-purple-200", business_owner: "bg-blue-100 text-blue-700 border-blue-200", agent: "bg-indigo-100 text-indigo-700 border-indigo-200" }[role as string] || "bg-gray-100 text-gray-700";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl font-[family-name:var(--font-geist-sans)]">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in slide-in-from-top-2 duration-300 ${
          toast.type === "success"
            ? "bg-green-50 text-green-800 border-green-200 shadow-green-500/10"
            : "bg-red-50 text-red-800 border-red-200 shadow-red-500/10"
        }`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          My Profile
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          Manage your personal details, profile picture, and account settings.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/20">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-3xl">{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center shadow-lg hover:scale-110 hover:border-blue-200 transition-all"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Camera className="w-4 h-4 text-gray-600" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-black text-gray-900">{profile.full_name}</h2>
            <p className="text-gray-500 font-medium mt-1">{profile.email}</p>
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${roleBadgeColor}`}>
                {roleLabel}
              </span>
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                profile.status === "active" || profile.status === "approved"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                {profile.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-3">
              Click the camera icon to upload a new photo (JPG, PNG — max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 text-gray-600 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Personal Information</h3>
            <p className="text-xs text-gray-400 font-medium">Your basic contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Email Address</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full h-11 bg-gray-100 border border-gray-200 rounded-xl px-4 font-medium text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 font-medium">Email cannot be changed directly</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+234 800 000 0000"
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Business Profile Section */}
      {role === "business_owner" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Business Profile</h3>
              <p className="text-xs text-gray-400 font-medium">This is what agents and customers see</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Business Name</label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                placeholder="Acme Logistics Ltd"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Business Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what your business offers..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Logo / Brand Image URL</label>
              <div className="flex items-center gap-3">
                {form.logo && (
                  <img src={form.logo} alt="Logo preview" className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0" />
                )}
                <input
                  type="url"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Banking Section */}
      {role === "agent" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Payout Details</h3>
              <p className="text-xs text-gray-400 font-medium">Where your commissions get deposited</p>
            </div>
          </div>

          {/* Referral Code (read-only) */}
          {roleData?.referral_code && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Your Referral Code</p>
                <p className="text-xl font-black text-indigo-700 font-mono tracking-wider mt-1">{roleData.referral_code}</p>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(roleData.referral_code); showToast("success", "Referral code copied!"); }}
                className="text-xs font-black text-indigo-600 bg-white border border-indigo-200 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Copy
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Bank Name</label>
              <input
                type="text"
                value={form.bank_name}
                onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                placeholder="Fidelity Bank"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Account Number</label>
              <input
                type="text"
                value={form.account_number}
                onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                placeholder="0012345678"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-sm font-bold text-gray-700">Account Name</label>
              <input
                type="text"
                value={form.account_name}
                onChange={(e) => setForm({ ...form, account_name: e.target.value })}
                placeholder="John Doe"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Identity */}
      {role === "admin" && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Super Admin Identity</h3>
              <p className="text-xs text-gray-400 font-medium">Full platform access is enabled</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              { label: "Role", value: "Super Administrator" },
              { label: "Access Level", value: "Unrestricted" },
              { label: "Status", value: profile.status },
              { label: "Account ID", value: user?.id?.slice(0, 12) + "..." },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
                <p className="font-black text-white mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4 pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2.5 bg-gray-900 hover:bg-black text-white font-black px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving Changes..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
