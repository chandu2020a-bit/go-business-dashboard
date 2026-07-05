import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = Cookies.get('jwt_token');
        const res = await fetch(`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?search=${encodeURIComponent(search)}&sort=${sort}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Status ${res.status}: Failed to fetch data`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setCurrentPage(1);
  }, [search, sort]);

  const list = data?.referrals || [];
  const start = (currentPage - 1) * 10;
  const paginated = list.slice(start, start + 10);
  const totalPages = Math.ceil(list.length / 10) || 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Referral Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Track your referrals, earnings, and partner activity in one place.</p>
          </div>
          {loading && <div className="text-center py-6 text-gray-500">Loading metrics and referrals...</div>}
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm" role="alert">{error}</div>}
          {!loading && !error && data && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="Overview metrics">
                {data.metrics?.map((m, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{m.value}</p>
                  </div>
                ))}
              </section>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm" aria-label="Service summary">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Service summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Service</p>
                      <p className="font-semibold text-sm text-gray-900">{data.serviceSummary?.service || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Your Referrals</p>
                      <p className="font-semibold text-sm text-gray-900">{data.serviceSummary?.yourReferrals || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Active Referrals</p>
                      <p className="font-semibold text-sm text-gray-900">{data.serviceSummary?.activeReferrals || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Total Ref. Earnings</p>
                      <p className="font-semibold text-sm text-gray-900">{data.serviceSummary?.totalRefEarnings || '$0'}</p>
                    </div>
                  </div>
                </section>
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm" aria-label="Share referral">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Refer friends and earn more</h2>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-500">Your Referral Link</span>
                      <div className="flex mt-1"><input readOnly value={data.referral?.link || ''} className="flex-1 px-2 py-1 bg-gray-50 border rounded-l" /><button onClick={() => {navigator.clipboard.writeText(data.referral?.link); alert('Copied Link!');}} className="bg-gray-200 px-3 rounded-r font-medium">Copy</button></div>
                    </div>
                    <div>
                      <span className="text-gray-500">Your Referral Code</span>
                      <div className="flex mt-1"><input readOnly value={data.referral?.code || ''} className="flex-1 px-2 py-1 bg-gray-50 border rounded-l" /><button onClick={() => {navigator.clipboard.writeText(data.referral?.code); alert('Copied Code!');}} className="bg-gray-200 px-3 rounded-r font-medium">Copy</button></div>
                    </div>
                  </div>
                </section>
              </div>
              <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">All referrals</h2>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder="Name or service..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search referrals" className="px-3 py-1.5 border rounded-md text-sm w-full sm:w-48" />
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <label htmlFor="sort-select" className="whitespace-nowrap">Sort by date:</label>
                      <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded-md p-1">
                        <option value="desc">Newest first</option>
                        <option value="asc">Oldest first</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                      <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Service</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Profit</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginated.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No matching entries</td></tr>
                      ) : (
                        paginated.map((r) => (
                          <tr key={r.id} onClick={() => navigate(`/referral/${r.id}`)} className="hover:bg-gray-50 cursor-pointer">
                            <td className="px-6 py-4 font-medium text-gray-900">{r.name}</td>
                            <td className="px-6 py-4 text-gray-500">{r.serviceName}</td>
                            <td className="px-6 py-4 text-gray-500">{r.date.replace(/-/g, '/')}</td>
                            <td className="px-6 py-4 font-semibold text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(r.profit)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
                  <p>Showing {list.length === 0 ? 0 : start + 1}–{Math.min(start + 10, list.length)} of {list.length} entries</p>
                  {totalPages > 1 && (
                    <div className="flex space-x-1">
                      <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-2 py-1 border rounded bg-white disabled:opacity-50">Previous</button>
                      <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-2 py-1 border rounded bg-white disabled:opacity-50">Next</button>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4"><span className="font-semibold text-gray-700">Go Business</span><nav className="flex space-x-2" aria-label="Footer"><a href="#about" className="hover:text-gray-900">About</a><a href="#privacy" className="hover:text-gray-900">Privacy</a></nav></div>
          <p>© 2024 Go Business</p>
        </div>
      </footer>
    </div>
  );
}