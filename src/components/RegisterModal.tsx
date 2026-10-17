import React, { useState } from 'react';
import { UserPlus, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { register } from '../services/api';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Nama lengkap wajib diisi.'); return; }
    if (!email.trim()) { setError('Email wajib diisi.'); return; }
    if (password.length < 6) { setError('Password minimal 6 karakter.'); return; }
    if (password !== confirmPassword) { setError('Konfirmasi password tidak cocok.'); return; }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
      }, 1500);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(msg || 'Gagal mendaftar. Pastikan backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-200">AMA-AMA ACCOUNT</p>
              <h2 className="mt-1 text-xl font-black">Buat Akun Baru</h2>
              <p className="mt-0.5 text-xs text-blue-200">Daftar untuk mulai belanja koleksi favoritmu</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/20 transition-colors" aria-label="Tutup daftar">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Success State */}
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Pendaftaran Berhasil! 🎉</h3>
            <p className="text-sm text-slate-500 mt-1">Selamat datang di AMA AMA FIGURE ACTION</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputCls}
                placeholder="Contoh: Naruto Uzumaki"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputCls}
                placeholder="email@contoh.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={inputCls + " pr-10"}
                  placeholder="Minimal 6 karakter"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={inputCls}
                placeholder="Ulangi password"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-bold text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 font-bold hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
