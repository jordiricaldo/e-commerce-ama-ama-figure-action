import React, { useEffect, useState } from 'react';
import { LogIn, X } from 'lucide-react';
import { login, LoginRole } from '../services/api';

interface LoginModalProps {
  role: LoginRole | null;
  onClose: () => void;
  onSuccess: () => void;
}

const credentials: Record<LoginRole, { email: string; password: string }> = {
  admin: { email: 'admin@ama-ama.local', password: 'admin123' },
  user: { email: 'user@ama-ama.local', password: 'user123' },
};

export const LoginModal: React.FC<LoginModalProps> = ({ role, onClose, onSuccess }) => {
  const [email, setEmail] = useState(role ? credentials[role].email : '');
  const [password, setPassword] = useState(role ? credentials[role].password : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role) return;
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setError('');
  }, [role]);

  if (!role) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password, role);
      onSuccess();
      onClose();
    } catch (requestError: any) {
      const responseMessage = requestError.response?.data?.message;
      setError(responseMessage || 'API tidak dapat dihubungi. Jalankan backend pada port yang sama dengan VITE_API_PORT atau API_PORT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">AMA-AMA ACCOUNT</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Login {role === 'admin' ? 'Admin' : 'User'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Tutup login"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" required /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" required /></label>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60"><LogIn className="h-4 w-4" />{loading ? 'Memproses...' : 'Masuk'}</button>
        
        {role === 'user' && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <button type="button" onClick={() => { onClose(); window.dispatchEvent(new Event('open-register')); }} className="text-blue-600 font-bold hover:underline">
              Daftar di sini
            </button>
          </p>
        )}
        <p className="mt-4 text-center text-xs text-slate-500">Demo: {credentials[role].email} / {credentials[role].password}</p>
      </form>
    </div>
  );
};