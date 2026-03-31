import Link from "next/link";
import { ArrowLeft, Mail, PhoneCall, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)] selection:bg-blue-200">
      
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-10 shadow-sm">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-bold group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back Home
        </Link>
      </header>

      {/* Main Grid Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] mx-auto w-full max-w-7xl lg:my-16 lg:rounded-[3rem] overflow-hidden bg-white border border-gray-100">
        
        {/* Left Interactive / Contact Informtion Pane */}
        <section className="bg-gray-900 text-white lg:w-5/12 p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          {/* Glass effects */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 mb-16">
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Let&apos;s talk scale.</h1>
            <p className="text-gray-400 font-medium leading-relaxed">Whether you are building a custom B2B inventory pool or have a question about automated agent payouts, our core team is directly responsive.</p>
          </div>
          
          <div className="space-y-8 relative z-10">
            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-blue-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-1">Direct Outreach</span>
                <span className="text-lg font-black text-white hover:underline cursor-pointer">hello@zarizo.com</span>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-green-600 transition-colors">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-1">Client Success</span>
                <span className="text-lg font-black text-white hover:underline cursor-pointer">+234 (0) 800-ZARIZO</span>
              </div>
            </div>

            <div className="flex items-start space-x-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-indigo-600 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-1">Scale HQ</span>
                <span className="text-lg font-black text-white">Innovation Hub,<br/>Lagos, Nigeria.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Form Processing Pane */}
        <section className="lg:w-7/12 p-12 lg:p-16 flex flex-col justify-center">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5 focus-within:text-blue-600">
                <label className="text-sm font-black text-gray-700 tracking-wide">First Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-b-2 border-transparent focus:border-blue-600 bg-transparent py-3 text-gray-900 border-b-gray-200 outline-none transition-colors font-medium placeholder:text-gray-300"
                  placeholder="John"
                />
              </div>

              <div className="space-y-1.5 focus-within:text-blue-600">
                <label className="text-sm font-black text-gray-700 tracking-wide">Last Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border-b-2 border-transparent focus:border-blue-600 bg-transparent py-3 text-gray-900 border-b-gray-200 outline-none transition-colors font-medium placeholder:text-gray-300"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-600">
              <label className="text-sm font-black text-gray-700 tracking-wide">Email Target</label>
              <input 
                type="email" 
                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-blue-600 bg-transparent py-3 text-gray-900 border-b-gray-200 outline-none transition-colors font-medium placeholder:text-gray-300"
                placeholder="store@company.com"
              />
            </div>

            <div className="space-y-1.5 focus-within:text-blue-600">
              <label className="text-sm font-black text-gray-700 tracking-wide">Reason for Contact</label>
              <div className="relative mt-2">
                 <select className="w-full bg-gray-50 border-gray-200 text-gray-900 font-bold p-4 rounded-xl outline-none border focus:ring-2 focus:ring-blue-600 appearance-none shadow-sm cursor-pointer hover:bg-white transition-colors">
                   <option>Business Vendor Setup</option>
                   <option>Agent Payout Issues</option>
                   <option>Strategic Partnership</option>
                   <option>General Support</option>
                 </select>
              </div>
            </div>

            <div className="space-y-1.5 focus-within:text-blue-600">
              <label className="text-sm font-black text-gray-700 tracking-wide">Message Content</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-200 bg-transparent p-4 rounded-xl text-gray-900 outline-none transition-colors font-medium min-h-[150px] focus:ring-2 focus:ring-blue-600 shadow-sm placeholder:text-gray-400"
                placeholder="Write your message context here..."
              ></textarea>
            </div>

            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-lg py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 hover:shadow-2xl">
              Dispatch Securely
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
