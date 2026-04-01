"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import ReferralTracker from "@/components/ReferralTracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [agentRef, setAgentRef] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedRefStr = localStorage.getItem("zarizo_referral");
      if (storedRefStr) {
        try {
          const storedRef = JSON.parse(storedRefStr);
          if (storedRef.expiresAt > new Date().getTime()) {
            return storedRef.code;
          }
        } catch (error) {
          console.error("Failed to parse referral data", error);
        }
      }
    }
    return null;
  });
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  // Form State
  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "", // Required for Paystack
    phone: "",
    quantity: 1,
    address: "",
    appointmentDate: "",
    notes: ""
  });

  useEffect(() => {
    // 1. Fetch Product Data from Supabase
    async function fetchProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Paystack Configuration
  const totalAmount = product ? (product.type === 'service' ? Number(product.price) : Number(product.price) * customerData.quantity) : 0;
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: customerData.email,
    amount: totalAmount * 100, // Paystack works in Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
    metadata: {
        custom_fields: [
            {
                display_name: "Customer Phone",
                variable_name: "customer_phone",
                value: customerData.phone
            },
            {
                display_name: "Product ID",
                variable_name: "product_id",
                value: id as string
            }
        ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const saveOrderToDatabase = async (reference: string) => {
    try {
      // 1. Resolve Agent ID if referral exists
      let agentId = null;
      if (agentRef) {
        const { data: agent } = await supabase
          .from('agents')
          .select('id')
          .eq('referral_code', agentRef)
          .single();
        if (agent) agentId = agent.id;
      }

      // 2. Create Order
      const { error } = await supabase.from('orders').insert({
        product_id: product.id,
        business_id: product.business_id,
        agent_id: agentId,
        customer_name: customerData.fullName,
        customer_phone: customerData.phone,
        customer_address: product.type === 'physical' ? customerData.address : null,
        quantity: product.type === 'service' ? 1 : customerData.quantity,
        total_amount: totalAmount,
        appointment_date: product.type === 'service' ? customerData.appointmentDate : null,
        requirements_note: customerData.notes || null,
        order_status: 'confirmed',
        payment_status: 'paid',
        payment_reference: reference
      });

      if (error) throw error;

      alert("Payment Successful! Your order has been placed and confirmed.");
      
      // Reset form
      setCustomerData({
        fullName: "",
        email: "",
        phone: "",
        quantity: 1,
        address: "",
        appointmentDate: "",
        notes: ""
      });

    } catch (err: any) {
      console.error("Order survival failed after payment:", err.message);
      alert("Payment was successful but we failed to record your order. Please contact support with reference: " + reference);
    }
  };

  const onSuccess = (reference: any) => {
    saveOrderToDatabase(reference.reference);
    setCheckingOut(false);
  };

  const onClose = () => {
    setCheckingOut(false);
    alert("Payment window closed. If you didn't pay, your order will not be processed.");
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    if (!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY) {
        console.warn("Paystack Public Key is missing! Using placeholder.");
    }

    setCheckingOut(true);
    initializePayment({ onSuccess, onClose });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you're looking for might have been removed or doesn't exist.</p>
        <Link href="/products" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">Back to Catalog</Link>
      </div>
    );
  }

  const productType = product.type as "physical" | "digital" | "service";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <ReferralTracker />

      {/* Header */}
      <header className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b bg-white sticky top-0 z-10 gap-4">
        <Link href="/products" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium">
          &larr; Back to Catalog
        </Link>
        <div className="flex items-center gap-2">
           <span className="text-xs font-black uppercase tracking-widest text-gray-400">Category</span>
           <span className="bg-gray-100 text-gray-700 px-3 py-1 text-xs font-bold rounded-full capitalize">{productType}</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center aspect-square overflow-hidden group">
          {product.image ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <>
              <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="mt-4 text-sm font-medium text-gray-400">Zarizo Verified Product</span>
            </>
          )}
        </div>

        {/* Product Info & Order Form */}
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.title}
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              {product.description || "No description provided for this product."}
            </p>
            <div className="mt-6 flex items-baseline space-x-4">
              <span className="text-5xl font-black text-gray-900">₦{Number(product.price).toLocaleString()}</span>
            </div>
            {agentRef && (
              <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-blue-100">
                <span>🎁</span>
                <span>Agent Referral Active</span>
              </div>
            )}
          </div>

          <form className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6" onSubmit={handleOrder}>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input 
                  type="text" 
                  required 
                  value={customerData.fullName}
                  onChange={(e) => setCustomerData({...customerData, fullName: e.target.value})}
                  placeholder="John Doe" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <Input 
                  type="email" 
                  required 
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                  placeholder="john@example.com" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input 
                  type="tel" 
                  required 
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  placeholder="+234 800..." 
                />
              </div>

              {productType !== "service" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <Input 
                    type="number" 
                    min="1" 
                    required 
                    value={customerData.quantity}
                    onChange={(e) => setCustomerData({...customerData, quantity: parseInt(e.target.value)})}
                  />
                </div>
              )}

              {productType === "physical" && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <textarea 
                    className="w-full flex rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 placeholder:text-gray-500" 
                    rows={3} 
                    required 
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    placeholder="Enter your full delivery address" 
                  ></textarea>
                </div>
              )}

              {productType === "service" && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Appointment Date & Time</label>
                    <Input 
                      type="datetime-local" 
                      required 
                      value={customerData.appointmentDate}
                      onChange={(e) => setCustomerData({...customerData, appointmentDate: e.target.value})}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specific Requirements or Notes</label>
                    <textarea 
                      className="w-full flex rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 placeholder:text-gray-500" 
                      rows={3} 
                      value={customerData.notes}
                      onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                      placeholder="E.g., Specific details about your requirements..." 
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            {/* Hidden Referral Field for DB saving */}
            <input type="hidden" name="agent_ref" value={agentRef || ""} />
            
            <Button 
              type="submit" 
              disabled={checkingOut}
              className="w-full h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3"
            >
              {checkingOut && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {checkingOut ? "Initiating Payment..." : `Pay ₦${totalAmount.toLocaleString()} Now`}
            </Button>
            <p className="text-xs text-center text-gray-500 uppercase font-semibold tracking-wider">Secure Checkout by Paystack</p>
          </form>
        </div>
      </main>
    </div>
  );
}


