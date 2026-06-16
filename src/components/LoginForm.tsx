import React, { useState } from 'react';
import { useStore } from '../store';
import { toast } from 'sonner';

export function LoginForm() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !password) {
      toast.error('请输入账号和密码');
      return;
    }
    setLoading(true);

    const formattedEmail = account.includes('@') ? account : `${account}@smart-care.com`;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formattedEmail, password })
      });
      
      if (!response.ok) {
        if (response.status === 401 && (account === 'admin' || account === '13800138000')) {
           // Admin bootstrap
           const regResponse = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formattedEmail, password, name: '系统管理员' })
           });
           
           if (!regResponse.ok) {
              const regData = await regResponse.json();
              throw new Error(regData.error || 'Failed to bootstrap admin');
           }
           
           // Now log in
           const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formattedEmail, password })
           });
           const loginData = await loginResponse.json();
           
           localStorage.setItem('token', loginData.token);
           
           useStore.getState().addSysUser({
             id: String(loginData.user.id),
             username: account,
             name: '系统管理员',
             roles: ['超级管理员'],
             status: '正常',
             lastLogin: new Date().toISOString()
           });
           toast.success('初始管理员账号创建并登录成功');
           setLoading(false);
           setTimeout(() => window.location.reload(), 500);
           return;
        }

        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      useStore.getState().updateSysUser(String(data.user.id), {
        lastLogin: new Date().toISOString()
      });
      toast.success('登录成功');
      window.location.reload(); 
    } catch (err: any) {
      console.error(err);
      toast.error('登录失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">系统登录</h1>
        <p className="text-slate-500 text-center text-sm">请输入手机号或邮箱登录</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">账号 (手机号/邮箱)</label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            placeholder="请输入账号"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            placeholder="请输入登录密码"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-2 disabled:opacity-70 active:scale-[0.98]"
        >
          {loading ? '验证中...' : '立即登录'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
        <p className="text-xs text-slate-400">如无法登录，请联系机构管理人员</p>
      </div>
    </div>
  );
}
