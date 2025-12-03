import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Droplet, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email manzilni kiriting');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Droplet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-blue-900 mb-2">WaterHack</h1>
          <p className="text-gray-600">Parolni tiklash</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!sent ? (
            <>
              <h2 className="text-gray-900 mb-4">Parolni unutdingizmi?</h2>
              <p className="text-gray-600 mb-6">
                Email manzilingizni kiriting va biz sizga parolni tiklash uchun havola yuboramiz.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Yuborilmoqda...' : 'Havola yuborish'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-4">Email yuborildi!</h2>
              <p className="text-gray-600 mb-6">
                Parolni tiklash havolasi <span className="font-medium">{email}</span> manziliga yuborildi. Iltimos, emailingizni tekshiring.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              ← Kirish sahifasiga qaytish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
