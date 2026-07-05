import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

export default function ReferralDetail() {
  const { id } = useParams();
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = Cookies.get('jwt_token');
        const res = await fetch(`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        let matched = null;
        if (json?.data) {
          if (Array.isArray(json.data.referrals)) matched = json.data.referrals.find(i => String(i.id) === String(id));
          else if (String(json.data.id) === String(id)) matched = json.data;
        }
        if (matched) setRow(matched);
        else setError(true);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-3xl mx-auto w-full px-4 py-10 flex-1">
        <div className="mb-4"><Link to="/" className="text-sm font-medium text-blue-600 hover:underline">&larr; Back to dashboard</Link></div>
        {loading && <div className="text-center text-gray-500">Loading details...</div>}
        {error && !loading && (
          <div className="bg-white p-6 rounded-xl border text-center shadow-sm">
            <h1 className="text-xl font-bold text-red-600">Referral not found</h1>
          </div>
        )}
        {!loading && !error && row && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-gray-50">
              <span className="text-xs uppercase text-blue-600 font-bold">Referral Details</span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">{row.name}</h1>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div><dt className="text-gray-400 uppercase text-xs">Referral ID</dt><dd className="font-semibold text-gray-900">{row.id}</dd></div>
                <div><dt className="text-gray-400 uppercase text-xs">Service Name</dt><dd className="text-gray-900">{row.serviceName}</dd></div>
                <div><dt className="text-gray-400 uppercase text-xs">Date Joined</dt><dd className="text-gray-900">{row.date.replace(/-/g, '/')}</dd></div>
                <div><dt className="text-gray-400 uppercase text-xs">Total Profit</dt><dd className="font-bold text-green-600">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(row.profit)}</dd></div>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}