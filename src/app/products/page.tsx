import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function PublicProductCatalog() {
  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white sticky top-0 z-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xl">Z</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Zarizo</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors hidden sm:block">Log in</Link>
          <Link href="/signup" className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-black transition-colors">Start Selling</Link>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-blue-600 px-6 py-12 text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Top Products</h1>
        <p className="text-blue-100 max-w-xl mx-auto text-lg">Browse vetted products from verified generic businesses. Shop seamlessly or become an agent to share & earn.</p>
      </section>

      {/* Catalog Main */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search for amazing products..." 
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <select className="px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Fashion</option>
            <option>Electronics</option>
            <option>Digital Goods</option>
          </select>
        </div>

        {/* Public Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
                <div className="aspect-[4/3] bg-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{product.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                    <span className="text-xl font-extrabold text-gray-900">₦{Number(product.price).toLocaleString()}</span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Buy Now &rarr;</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
             <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 font-medium">No products found in the catalog.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

