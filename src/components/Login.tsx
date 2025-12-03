import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Droplet, AlertCircle } from 'lucide-react';
import { User } from '../App';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!showTwoFA) {
      // First step: email and password
      if (!email || !password) {
        setError('Iltimos barcha maydonlarni to\'ldiring');
        return;
      }

      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setShowTwoFA(true);
      }, 1000);
    } else {
      // Second step: 2FA verification
      if (!twoFACode) {
        setError('Tasdiqlash kodini kiriting');
        return;
      }

      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        const mockUser: User = {
          id: '1',
          fullName: 'Alisher Karimov',
          region: 'Farg\'ona viloyati',
          phone: '+998901234567',
          email: email,
          verified2FA: true
        };
        onLogin(mockUser);
        navigate('/dashboard');
      }, 1000);
    }
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
          <p className="text-gray-600">Aqlli suv taqsimoti platformasi</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-gray-900 mb-6">
            {showTwoFA ? 'Tasdiqlash' : 'Tizimga kirish'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!showTwoFA ? (
              <>
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

                <div>
                  <label className="block text-gray-700 mb-2">
                    Parol
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Parolni unutdingizmi?
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-gray-700 mb-2">
                  Tasdiqlash kodi
                </label>
                <p className="text-gray-600 mb-4">
                  {email} manziliga yuborilgan 6 raqamli kodni kiriting
                </p>
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Yuklanmoqda...' : showTwoFA ? 'Tasdiqlash' : 'Kirish'}
            </button>
          </form>

          {!showTwoFA && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Akkauntingiz yo'qmi?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700">
                  Ro'yxatdan o'tish
                </Link>
              </p>
            </div>
          )}

          {showTwoFA && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowTwoFA(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                ← Orqaga
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
