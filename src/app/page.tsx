"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, ShoppingBag, Store, Users, Zap, ShieldCheck, ChevronRight } from "lucide-react";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-[#fafafa] selection:bg-blue-200">
      
      {/* Floating Glass Navigation */}
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-6">
        <header className="flex w-full items-center justify-between max-w-6xl px-6 py-3 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              Z
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">Zarizo</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#storefront" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">Catalog</Link>
            <Link href="#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="#businesses" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">For Businesses</Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 hidden sm:block">Sign In</Link>
            <Link href="/signup" className="text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 transform">
              Start Free
            </Link>
          </div>
        </header>
      </div>

      <main className="flex-1 shrink-0">
        {/* Dynamic Hero Section */}
        <section className="relative px-6 pt-48 pb-32 md:pt-56 md:pb-40 flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <motion.div 
            className="max-w-5xl mx-auto z-10 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-blue-700 font-semibold text-sm shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              <span>The Next-Gen Digital Sales Network</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[1.05]">
              Grow sales. <br className="hidden sm:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expand reach.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Zarizo transforms how businesses sell by empowering a network of independent agents to effortlessly share products, track attributions, and earn commissions.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link href="/signup/business" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                <Store className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                <span>Launch your Store</span>
              </Link>
              <Link href="/signup/agent" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-full font-bold text-lg hover:border-gray-900 transition-all shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Become an Agent</span>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Storefront / Catalog Ribbon */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          id="storefront" 
          className="py-32 px-6 bg-white border-y border-gray-100"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">Discover the Catalog</h2>
                <p className="text-xl text-gray-500 font-medium">Browse premium generic products shared securely by our automated referral network.</p>
              </div>
              <Link href="/products" className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors w-fit group">
                Explore Everything <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((idx) => (
                <Link href={`/products/${idx}`} key={idx} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-2">
                  <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden p-6 mx-2 mt-2 rounded-2xl flex items-center justify-center group-hover:bg-blue-50/50 transition-colors">
                    <ShoppingBag className="w-16 h-16 text-gray-300 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      Best Seller
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Digital Product {idx}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium">Highly scalable enterprise solutions designed to expand your revenue.</p>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-2xl font-black text-gray-900">₦45,000</span>
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Dynamic Value Props */}
        <section id="how-it-works" className="py-32 px-6 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-white">Automated for Growth</h2>
              <p className="text-xl text-gray-400 font-medium">Zarizo was built from the ground up to operate autonomously. You list the products, agents drive traffic, the system manages attribution perfectly.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Store, title: "List Effortlessly", desc: "Set up your storefront, add products, and configure your automated commission limits in minutes." },
                { icon: Zap, title: "Frictionless Tracking", desc: "Our silent tracking engine guarantees every agent referral link is 100% reliably attributed via local storage." },
                { icon: ShieldCheck, title: "Automated Payouts", desc: "No more messy spreadsheets. Track pending vs paid commissions flawlessly via our robust dashboards." }
              ].map((feature, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 bg-gradient-to-b from-blue-50 to-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-gray-900 mb-8">Ready to multiply <br /> your online sales?</h2>
            <Link href="/signup" className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xl hover:bg-blue-700 transition-all shadow-2xl hover:shadow-blue-500/30 hover:scale-105 active:scale-95 group">
              Build your agent network today
            </Link>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-lg">Z</div>
            <span className="font-black text-gray-900 text-xl tracking-tighter">Zarizo</span>
          </div>
          <div className="flex space-x-6 text-sm font-semibold text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-gray-900 transition-colors">Contact Support</Link>
          </div>
          <div className="text-sm font-semibold text-gray-400">
            &copy; {new Date().getFullYear()} Autonomous Commerce.
          </div>
        </div>
      </footer>
    </div>
  );
}
