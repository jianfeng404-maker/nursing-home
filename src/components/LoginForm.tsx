import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { useStore } from '../store';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';

export function LoginForm() {
  const { loginWithEmail, logout } = useFirebase();
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
      await loginWithEmail(formattedEmail, password);
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Validate if user exists in system and is not locked
        const sysUserRef = doc(db, 'sysUsers', currentUser.uid);
        const sysUserSnap = await getDoc(sysUserRef);
        
        if (!sysUserSnap.exists() && account !== 'admin') {
          await logout();
          toast.error('该账号无系统访问权限或已被删除');
          setLoading(false);
          return;
        }

        if (sysUserSnap.exists() && sysUserSnap.data().status === '锁定') {
          await logout();
          toast.error('账号已被锁定，请联系系统管理员');
          setLoading(false);
          return;
        }

        useStore.getState().updateSysUser(currentUser.uid, {
          lastLogin: new Date().toISOString()
        });
        toast.success('登录成功');
      }
    } catch (err: any) {
      console.error(err);
      
      // Bootstrap system if this is the very first admin login attempting setup
      if (account === 'admin' && (err.code?.includes('user-not-found') || err.code?.includes('invalid-credential') || err.code?.includes('wrong-password'))) {
         try {
            const userCred = await createUserWithEmailAndPassword(auth, formattedEmail, password);
            useStore.getState().addSysUser({
              id: userCred.user.uid,
              username: account,
              name: '系统管理员',
              roles: ['超级管理员'],
              status: '正常',
              lastLogin: new Date().toISOString()
            });
            toast.success('初始管理员账号创建并登录成功');
            setLoading(false);
            return;
         } catch(bootstrapErr) {
            console.error('Bootstrap failed', bootstrapErr);
         }
      }

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        toast.error('账号或密码错误');
      } else {
        toast.error('操作失败: ' + err.message);
      }
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
        <p className="text-slate-500 text-center text-sm">请输入管理员分配的账号和密码</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">账号 (手机号等)</label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
            placeholder="请输入系统账号"
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
        <p className="text-xs text-slate-400">如忘记密码，请联系机构管理人员重置</p>
      </div>
    </div>
  );
}
