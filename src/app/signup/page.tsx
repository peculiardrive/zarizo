import Link from "next/link";
import { ArrowLeft, Store, Users, ArrowRight } from "lucide-react";

export default function SignupSelectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] selection:bg-blue-200">
      
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Zarizo
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="flex items-center space-x-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">Z</div>
          <span className="text-3xl font-black tracking-tighter text-gray-900">Zarizo</span>
        </Link>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">How do you want to start?</h2>
        <p className="mt-3 text-lg text-gray-600 font-medium max-w-md">Choose your path to join the fastest growing autonomous digital sales network in Africa.</p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Business Owner Path */}
          <Link href="/signup/business" className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col h-full">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">I&#39;m a Business</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">I have products to sell. I want to build a storefront and let autonomous agents drive sales for me.</p>
            
            <div className="mt-auto flex items-center font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Create Business Account <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Agent Path */}
          <Link href="/signup/agent" className="group bg-white p-8 rounded-3xl border-2 border-transparent hover:border-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col h-full">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">I&#39;m an Agent</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">I want to earn money. I want to find great products, share them with my network, and earn automated commissions.</p>
            
            <div className="mt-auto flex items-center font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              Join as Agent <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
        
        <div className="mt-10 text-center text-sm font-bold text-gray-500">
          Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">Sign In here</Link>
        </div>
      </div>
    </div>
  );
}
