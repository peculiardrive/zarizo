"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, DollarSign, Store, UserCheck, LogOut, Bell, Settings, ChevronRight, UserCircle } from 'lucide-react';

function NavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: any }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? "bg-gray-900 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {children}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-[family-name:var(--font-geist-sans)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 sticky top-0 md:h-screen z-20 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">Z</div>
            <span className="text-xl font-black tracking-tighter text-gray-900">Zarizo</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
          {/* Workspaces */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2 mt-4">My Workspace</p>
          <NavLink href="/business" icon={Store}>Business Hub</NavLink>
          <NavLink href="/agent" icon={UserCheck}>Agent Portal</NavLink>

          {/* Admin Section */}
          <div className="mt-6 mb-2 mx-3 flex items-center gap-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">👑 Super Admin</span>
            <div className="flex-1 h-px bg-blue-100"></div>
          </div>
          <NavLink href="/admin" icon={LayoutDashboard}>Command Center</NavLink>
          <NavLink href="/admin/orders" icon={ShoppingCart}>All Orders</NavLink>
          <NavLink href="/admin/products" icon={Package}>Product Catalog</NavLink>
          <NavLink href="/admin/users" icon={Users}>User Management</NavLink>
          <NavLink href="/admin/commissions" icon={DollarSign}>Manage Payouts</NavLink>

          {/* System */}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2 mt-6">System</p>
          <NavLink href="/dashboard/profile" icon={UserCircle}>My Profile</NavLink>
          <NavLink href="/dashboard/settings" icon={Settings}>Settings</NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all w-full"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 shrink-0 overflow-y-auto w-full relative">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 w-full shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <span className="font-black text-gray-900">Zarizo</span>
            <ChevronRight className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 cursor-pointer hover:scale-105 transition-transform">
              A
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

