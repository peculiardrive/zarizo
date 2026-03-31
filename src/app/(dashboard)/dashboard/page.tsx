export default function MainDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Your digital sales network at a glance.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {/* Quick Actions */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            + New Action
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Sales</span>
          <span className="text-3xl font-bold text-gray-900">$24,500</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 w-max px-2 py-1 rounded-md">+15% this month</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Commissions</span>
          <span className="text-3xl font-bold text-gray-900">$4,120</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 w-max px-2 py-1 rounded-md">+8% this month</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Agents</span>
          <span className="text-3xl font-bold text-gray-900">124</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 w-max px-2 py-1 rounded-md">+12 new agents</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Orders</span>
          <span className="text-3xl font-bold text-gray-900">18</span>
          <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 w-max px-2 py-1 rounded-md">Needs action</span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Product</th>
                <th className="px-6 py-3 font-semibold">Agent</th>
                <th className="px-6 py-3 font-semibold">Commission</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-{9000 + idx}</td>
                  <td className="px-6 py-4">Premium Sneakers {idx}</td>
                  <td className="px-6 py-4">Alex J.</td>
                  <td className="px-6 py-4 text-green-600 font-medium">+$15.00</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-md border border-blue-100">
                      Processing
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
