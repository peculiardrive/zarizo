import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default async function ProductsPage() {
  // Fetch live products for this business/context
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching dashboard products:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-500">Manage and browse products in your network.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>Add New Product</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 overflow-x-auto">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>Active</option>
          <option>Draft</option>
        </select>
        <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition whitespace-nowrap">
          Filter
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group h-full flex flex-col">
              <div className="aspect-[4/3] bg-gray-100 relative group-hover:bg-gray-200 transition">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                  {product.commission_type === 'percentage' ? `${product.commission_value}%` : `₦${product.commission_value}`} Comm.
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 space-y-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-1">{product.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg text-gray-900">₦{Number(product.price).toLocaleString()}</span>
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${product.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></div> {product.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-100 flex gap-2">
                  <Button variant="outline" className="w-full text-xs">Edit</Button>
                  <Button variant="default" className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 text-xs shadow-none border-blue-200">Share Link</Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
            <p className="text-gray-500 font-bold">No products found in your catalog.</p>
            <Button className="mt-4 bg-gray-900 text-white">Add Your First Product</Button>
          </div>
        )}
      </div>
    </div>
  );
}

