import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, QrCode, UserPlus, Shield, X, Smartphone, CheckCircle, SmartphoneNfc } from "lucide-react";

export function FamilyBind({ targetElderId, setTargetElderId, embedded }: { targetElderId?: string | null, setTargetElderId?: (id: string | null) => void, embedded?: boolean }) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('bound');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [bindings, setBindings] = useState([
    { id: 1, elderId: "ELD-001", elderName: "张明宇", elderRoom: "A栋-101", relation: "儿子", name: "张小强", phone: "13800138000", address: "江苏省南京市玄武区中山东路100号2栋301", isBound: true, bindDate: "2023-11-20", payAuth: true, visitAuth: true },
    { id: 2, elderId: "ELD-002", elderName: "李秀红", elderRoom: "A栋-105", relation: "女儿", name: "王芳", phone: "13912345678", address: "江苏省南京市建邺区江东中路200号1栋502", isBound: true, bindDate: "2023-10-15", payAuth: true, visitAuth: true },
    { id: 3, elderId: "ELD-003", elderName: "赵大爷", elderRoom: "B栋-201", relation: "配偶", name: "孙阿姨", phone: "13700000000", address: "江苏省南京市鼓楼区汉中路50号3栋101", isBound: false, bindDate: "-", payAuth: false, visitAuth: true },
  ]);

  const [selectedBinding, setSelectedBinding] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUnbindAlert, setShowUnbindAlert] = useState(false);

  useEffect(() => {
     if (targetElderId && embedded) {
        const binding = bindings.find(b => b.elderId === targetElderId);
        if (binding) {
           // setSearchTerm(binding.elderName);
           setActiveTab(binding.isBound ? 'bound' : 'unbound');
        }
     }
  }, [targetElderId, bindings, embedded]);

  const displayBindings = embedded && targetElderId ? bindings.filter(b => b.elderId === targetElderId) : bindings;

  const filteredBindings = displayBindings.filter(b => 
    (embedded || (activeTab === 'bound' ? b.isBound : !b.isBound)) &&
    (searchTerm === '' || b.elderName.includes(searchTerm) || b.name.includes(searchTerm) || b.phone.includes(searchTerm))
  );

  return (
    <div className={`animate-in fade-in duration-500 pb-8 ${embedded ? 'pt-4' : ''}`}>
      {!embedded && (
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">家属及微信绑定</h1>
            <span className="text-sm text-slate-500">管理长者亲属信息、微信小程序绑定状态及家属权限</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => { setSelectedBinding(null); setShowInviteModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              邀请家属绑定
            </button>
          </div>
        </div>
      )}

      {embedded && (
        <div className="flex justify-end mb-4">
            <button 
              onClick={() => { setSelectedBinding(null); setShowInviteModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              邀请家属绑定
            </button>
        </div>
      )}

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             {!embedded ? (
               <>
                 <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                   <button 
                     onClick={() => setActiveTab('bound')}
                     className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'bound' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >已绑定 ({bindings.filter(b => b.isBound).length})</button>
                   <button 
                     onClick={() => setActiveTab('unbound')}
                     className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'unbound' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >未绑定/待邀请 ({bindings.filter(b => !b.isBound).length})</button>
                 </div>
                 <div className="relative">
                   <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input 
                     type="text" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="搜索长者/家属姓名/手机号..." 
                     className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-72 focus:outline-none focus:border-emerald-500 bg-white"
                   />
                 </div>
               </>
             ) : (
               <div className="text-base font-bold text-slate-800">所有家属绑定列表</div>
             )}
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
           <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">长者信息</th>
                  <th className="px-6 py-4 font-medium">家属姓名/关系</th>
                  <th className="px-6 py-4 font-medium">联系电话</th>
                  <th className="px-6 py-4 font-medium min-w-[200px]">现住址</th>
                  <th className="px-6 py-4 font-medium min-w-[120px]">微信绑定状态</th>
                  <th className="px-6 py-4 font-medium">家属权限</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBindings.map((binding) => (
                  <tr key={binding.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{binding.elderName}</div>
                      <div className="text-xs text-slate-500">{binding.elderRoom}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{binding.name}</div>
                      <div className="text-xs text-slate-500">{binding.relation}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-mono">{binding.phone}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs truncate max-w-[200px]" title={binding.address}>{binding.address || "-"}</td>
                    <td className="px-6 py-4">
                      {binding.isBound ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-medium w-fit border border-emerald-200">
                             <CheckCircle className="w-3.5 h-3.5" /> 已绑定微信
                          </span>
                          <span className="text-[11px] text-slate-400">时间: {binding.bindDate}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium w-fit border border-slate-200">
                           <Smartphone className="w-3.5 h-3.5" /> 尚未绑定
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                         <span className={`px-2 py-0.5 rounded text-xs border ${binding.payAuth ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>缴费</span>
                         <span className={`px-2 py-0.5 rounded text-xs border ${binding.visitAuth ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>探视预约</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {!binding.isBound ? (
                         <button onClick={() => { setSelectedBinding(binding); setShowInviteModal(true); }} className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">去邀请</button>
                       ) : (
                         <div className="flex justify-end gap-3">
                           <button onClick={() => { setSelectedBinding(binding); setShowAuthModal(true); }} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">调整权限</button>
                           <button onClick={() => { setSelectedBinding(binding); setShowUnbindAlert(true); }} className="text-slate-400 hover:text-rose-600 font-medium text-xs">解绑</button>
                         </div>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredBindings.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <p>暂无相关家属数据</p>
              </div>
            )}
        </CardContent>
      </Card>

      {/* 邀请绑定 Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   邀请家属绑定小程序
                </h3>
                <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6">
                <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100 flex flex-col items-center justify-center text-center space-y-4 mb-6">
                   <div className="w-48 h-48 bg-white border border-slate-200 p-2 shadow-sm rounded-lg flex flex-col items-center justify-center">
                      <QrCode className="w-32 h-32 text-slate-800" />
                      <span className="text-xs text-slate-500 mt-2 font-medium">长按/扫描专属二维码绑定</span>
                   </div>
                   <div>
                     <p className="font-bold text-slate-800">面对面扫码邀请</p>
                     <p className="text-sm text-emerald-700 mt-1">请家属使用微信扫描上方二维码进行身份核验</p>
                   </div>
                </div>

                <div className="relative flex items-center py-2 mb-6">
                   <div className="flex-grow border-t border-slate-200"></div>
                   <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">或 发送邀请短信</span>
                   <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="space-y-4 mt-4">
                    <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">选择要关联的长者</label>
                     <select id="invite-elder" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white" defaultValue={selectedBinding?.elderName || "张大爷"}>
                        <option value="张大爷">张明宇 (A栋-101)</option>
                        <option value="李秀红">李秀红 (A栋-105)</option>
                        <option value="赵大爷">赵大爷 (B栋-201)</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">家属姓名</label>
                     <input id="invite-name" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="请输入家属姓名" defaultValue={selectedBinding?.name || ""} />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">家属手机号</label>
                     <input id="invite-phone" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="请输入11位手机号码" defaultValue={selectedBinding?.phone || ""} />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">联系地址(现住址)</label>
                     <input id="invite-address" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="请输入家属现住址" defaultValue={selectedBinding?.address || ""} />
                   </div>
                   <button 
                     onClick={() => {
                        const phone = (document.getElementById('invite-phone') as HTMLInputElement).value;
                        const address = (document.getElementById('invite-address') as HTMLInputElement).value;
                        const name = (document.getElementById('invite-name') as HTMLInputElement).value;
                        if (!phone) return;
                        
                        if (selectedBinding) {
                          setBindings(bindings.map(b => b.id === selectedBinding.id ? { ...b, phone, address, name: name || selectedBinding.name, isBound: true, bindDate: new Date().toISOString().split('T')[0] } : b));
                        } else {
                          const elderValue = (document.getElementById('invite-elder') as HTMLSelectElement).value;
                          setBindings([...bindings, {
                            id: Date.now(), elderId: "ELD-999", elderName: elderValue, elderRoom: "待分配", relation: "亲属", name: name || "新家属", phone, address, isBound: true, bindDate: new Date().toISOString().split('T')[0], payAuth: true, visitAuth: true
                          }]);
                        }
                        setShowInviteModal(false);
                     }}
                     className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                   >
                      <SmartphoneNfc className="w-4 h-4" /> 下发一条包含邀请链接的短信
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 调整权限 Modal */}
      {showAuthModal && selectedBinding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Shield className="w-5 h-5 text-indigo-600" />
                   调整家属权限
                </h3>
                <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6">
                 <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between">
                       <span className="text-sm font-medium text-slate-700">缴费权限</span>
                       <input type="checkbox" id="auth-pay" defaultChecked={selectedBinding.payAuth} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between">
                       <span className="text-sm font-medium text-slate-700">探视预约权限</span>
                       <input type="checkbox" id="auth-visit" defaultChecked={selectedBinding.visitAuth} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    </label>
                 </div>
                 
                 <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setShowAuthModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                    <button 
                      onClick={() => {
                        const payAuth = (document.getElementById('auth-pay') as HTMLInputElement).checked;
                        const visitAuth = (document.getElementById('auth-visit') as HTMLInputElement).checked;
                        setBindings(bindings.map(b => b.id === selectedBinding.id ? { ...b, payAuth, visitAuth } : b));
                        setShowAuthModal(false);
                      }} 
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                      确认调整
                    </button>
                 </div>
             </div>
          </div>
        </div>
      )}

      {/* 解绑二次确认 Modal */}
      {showUnbindAlert && selectedBinding && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="p-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-600">
                    <X className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-800 mb-2">确认解除绑定？</h3>
                 <p className="text-sm text-slate-500 mb-6">
                   解除绑定后，该家属将无法访问长者 {selectedBinding.elderName} 的信息及操作相关权限。
                 </p>
                 <div className="flex justify-center gap-3">
                    <button onClick={() => setShowUnbindAlert(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 w-full">取消</button>
                    <button 
                      onClick={() => {
                        setBindings(bindings.map(b => b.id === selectedBinding.id ? { ...b, isBound: false, bindDate: "-" } : b));
                        setShowUnbindAlert(false);
                      }} 
                      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 w-full"
                    >
                      确认解绑
                    </button>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
