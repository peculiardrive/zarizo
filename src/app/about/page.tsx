import Link from "next/link";
import { ArrowLeft, Target, ShieldCheck, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-blue-200">
      
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-bold group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back Home
        </Link>
      </header>

      {/* Hero */}
      <section className="bg-gray-900 py-24 text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-full max-w-2xl h-[400px] bg-blue-600/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center text-sm font-black tracking-widest uppercase text-blue-400 mb-6 bg-blue-900/50 px-4 py-2 rounded-full border border-blue-800">Our Motivation</span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">Commerce, unlocked.</h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Zarizo isn&apos;t just a marketplace. We are a digital sales conduit designed to help ambitious African businesses multiply their reach by equipping everyday people with the tools to become successful sales agents.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="text-center md:text-left">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto md:mx-0 mb-6 shadow-sm border border-blue-100">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">The Mission</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              We started Zarizo to close the gap between brilliant products and the people who want to buy them. Traditional marketing is expensive. Agent networks are limitless.
            </p>
          </div>

          <div className="text-center md:text-left">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto md:mx-0 mb-6 shadow-sm border border-green-100">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Controlled Ecosystem</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              This is not a wild-west open market. We ensure strict verification for every business and automate every commission so there are zero trust issues between agents and sellers.
            </p>
          </div>

          <div className="text-center md:text-left">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto md:mx-0 mb-6 shadow-sm border border-purple-100">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Mobile & Modern</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Built from scratch with an African-friendly layout prioritizing mobile experiences. Track orders, generate links, or payout cash easily from your phone.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="bg-gray-50 py-24 flex items-center justify-center text-center px-6">
        <div className="max-w-2xl bg-white p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Want to participate?</h2>
          <p className="text-gray-600 mb-8 font-medium">Whether you are building a storefront to leverage resellers or you just want to earn cash sharing links, there&apos;s a space for you in Zarizo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/signup" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Start Network Dashboard</Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
