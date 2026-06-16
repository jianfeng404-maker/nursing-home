import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Filter, Plus, User, FileText, CheckCircle2, ChevronRight, Activity, MapPin, Eye, Edit, X, Watch, Wifi, HeartPulse, Users as UsersIcon, ShieldAlert, ArrowLeft } from "lucide-react";
import { useStore } from "../store";

import { HealthRecord } from "./HealthRecord";
import { FamilyBind } from "./FamilyBind";
import { ElderDevices } from "./ElderDevices";
import { SafetyMonitor } from "./SafetyMonitor";

export function ElderInfo({ setActiveTab, setTargetElderId: propSetTargetElderId, targetElderId: propTargetElderId, targetAction, embedded }: { setActiveTab?: (tab: string) => void, setTargetElderId?: (id: string | null) => void, targetElderId?: string | null, targetAction?: string | null, embedded?: boolean }) {
  const [selectedStatus, setSelectedStatus] = useState('在院');
  const [showNewElderModal, setShowNewElderModal] = useState(false);
  const [selectedElder, setSelectedElder] = useState<any>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangeRoomModal, setShowChangeRoomModal] = useState(false);

  const { elders: storeElders, beds, setTargetElderId: globalSetTargetElderId, targetElderId: globalTargetElderId, setTargetElderTab, targetElderTab, updateElder, addElder, removeElder, careLevels } = useStore();

  const actualTargetElderId = propTargetElderId || globalTargetElderId;

  const handleSave = () => {
    const newName = (document.getElementById('edit-name') as HTMLInputElement)?.value || selectedElder.name;
    const newAvatar = (document.getElementById('edit-avatar') as HTMLInputElement)?.value || selectedElder.avatar;
    const updatedElder = { ...selectedElder, name: newName, avatar: newAvatar };
    setSelectedElder(updatedElder);
    if (storeElders.find(se => se.id === selectedElder.id)) {
       updateElder(selectedElder.id, { name: newName, avatar: newAvatar });
    } else {
       addElder({ 
         id: selectedElder.id, 
         name: newName, 
         avatar: newAvatar, 
         age: selectedElder.age, 
         gender: selectedElder.gender, 
         careLevel: selectedElder.careLevel, 
         healthStatus: selectedElder.medical || '良好',
         room: selectedElder.room || '待分配',
         admissionDate: selectedElder.admitDate || new Date().toISOString().split('T')[0]
       });
    }
    setIsEditing(false);
    setShowNewElderModal(false);
  };

  const elders = [
    { 
      id: "ELD-001", name: "张明宇", age: 82, gender: "男", room: "A栋-101-1", careLevel: "二级护理", admitDate: "2023-01-15", status: "在院", contact: "张小强 13800138000", diet: "流食, 糖尿病餐", medical: "高血压、糖尿病",
      idCard: "320102194101010011", nativePlace: "江苏省南京市玄武区", currentAddress: "江苏省南京市玄武区中山东路100号", religion: "无", education: "大学本科",
      smoking: "否", hobbies: "看报纸、听广播、下象棋", hearing: "轻度下降", vision: "老花眼", mobility: "借助拐杖可独自行走",
      avatar: "https://i.pravatar.cc/150?u=ELD-001"
    },
    { 
      id: "ELD-002", name: "李秀红", age: 76, gender: "女", room: "A栋-105-1", careLevel: "特级护理", admitDate: "2023-03-10", status: "在院", contact: "王芳 13912345678", diet: "普食", medical: "阿尔茨海默症中期",
      idCard: "320104194705051234", nativePlace: "江苏省南京市秦淮区", currentAddress: "江苏省南京市建邺区江东中路200号", religion: "佛教", education: "初中",
      smoking: "否", hobbies: "看电视、听戏", hearing: "正常", vision: "正常", mobility: "需轮椅协助",
      avatar: "https://i.pravatar.cc/150?u=ELD-002"
    },
    { id: "ELD-003", name: "赵大爷", age: 88, gender: "男", room: "B栋-201-1", careLevel: "三级护理", admitDate: "2022-11-05", status: "在院", contact: "赵刚 13700000000", diet: "普食", medical: "关节炎、轻度听力障碍",
      idCard: "320106193508085678", nativePlace: "江苏省南京市鼓楼区", currentAddress: "江苏省南京市鼓楼区汉中路50号", religion: "无", education: "高中",
      smoking: "曾吸烟(已戒)", hobbies: "养花、散步", hearing: "较弱，配戴助听器", vision: "白内障术后恢复可", mobility: "可缓慢行走，易疲劳",
      avatar: "https://i.pravatar.cc/150?u=ELD-003"
    },
    { id: "ELD-004", name: "刘建国", age: 79, gender: "男", room: "-", careLevel: "一级护理", admitDate: "2023-05-20", status: "已退住", contact: "刘娟 13600000000", diet: "普食", medical: "心血管疾病",
      idCard: "320105194412129012", nativePlace: "安徽省马鞍山市", currentAddress: "江苏省南京市栖霞区仙林大道500号", religion: "无", education: "小学",
      smoking: "否", hobbies: "种菜", hearing: "正常", vision: "正常", mobility: "完全自理",
      avatar: "https://i.pravatar.cc/150?u=ELD-004"
    },
  ];

  // Sync storeElders to our mock data if matching
  const allElders = elders.map(e => {
     const st = storeElders.find(se => se.name === e.name);
     if (st && st.id) return { ...e, id: st.id, avatar: st.avatar || e.avatar };
     return { ...e, avatar: e.avatar };
  });
  
  // Fill in any storeElders that aren't in our local mock
  storeElders.forEach(se => {
    if (!allElders.find(e => e.id === se.id)) {
      allElders.push({
        id: se.id,
        name: se.name,
        age: se.age,
        gender: se.gender,
        room: '未分配',
        careLevel: se.careLevel,
        admitDate: se.admissionDate || '2023-01-01',
        status: '在院',
        contact: '暂无联系人',
        diet: '普食',
        medical: se.healthStatus || '无特殊',
        idCard: '',
        nativePlace: '',
        currentAddress: '',
        religion: '无',
        education: '未知',
        smoking: '否',
        hobbies: '',
        hearing: '正常',
        vision: '正常',
        mobility: '自理',
        avatar: se.avatar
      });
    }
  });

  useEffect(() => {
    if (actualTargetElderId) {
       const elder = allElders.find(e => e.id === actualTargetElderId || e.id === `ELD-${actualTargetElderId.replace('ELD-', '')}`);
       if (elder) {
         setSelectedElder((prev: any) => prev?.id === elder.id ? prev : elder);
         if (targetAction === 'change_room') {
            setShowChangeRoomModal(true);
         }
       }
    } else {
       setSelectedElder(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualTargetElderId, targetAction]);

  const handleOpenDetail = (elder: any) => {
    if (globalSetTargetElderId) {
      globalSetTargetElderId(elder.id);
      setTargetElderTab('info');
    } else if (propSetTargetElderId) {
      propSetTargetElderId(elder.id);
    }
  };

  const renderDetailContent = () => (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
       <div className="max-w-5xl mx-auto space-y-6">
         {/* 基础信息 */}
         <Card className="border-slate-200 shadow-sm">
           <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800">{isEditing ? '编辑基本资料' : '基本信息'}</CardTitle>
              {!isEditing && embedded && (
                 <div className="flex items-center gap-4">
                 <button onClick={() => setIsEditing(true)} className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                   <Edit className="w-4 h-4"/> 修改基础信息
                 </button>
                 <button 
                   onClick={() => {
                     if(window.confirm('确定要删除这位长者的所有信息吗？本操作不可恢复。')) {
                       removeElder(selectedElder.id);
                       if (globalSetTargetElderId) globalSetTargetElderId(null);
                       if (propSetTargetElderId) propSetTargetElderId(null);
                     }
                   }}
                   className="text-rose-600 text-sm font-medium hover:underline flex items-center gap-1"
                 >
                   <X className="w-4 h-4"/> 删除该长者档案
                 </button>
                 </div>
              )}
           </CardHeader>
           <CardContent className="pt-6">
             {isEditing ? (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-y-6 gap-x-8 text-sm">
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">姓名</label>
                         <input id="edit-name" type="text" defaultValue={selectedElder.name === '新长者' ? '' : selectedElder.name} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500" placeholder="长者姓名" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">性别</label>
                         <select defaultValue={selectedElder.gender} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                           <option value="男">男</option>
                           <option value="女">女</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">年龄</label>
                         <input type="number" defaultValue={selectedElder.age} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5 flex flex-col">
                         <label className="block mb-1 text-slate-600 text-sm">照片</label>
                         <div className="flex items-center gap-3">
                           <label className="relative w-12 h-12 rounded-full border border-slate-300 overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer group shadow-sm shrink-0">
                              <input type="file" className="hidden" accept="image/*" onChange={(e)=>{
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    const targetInput = document.getElementById('edit-avatar') as HTMLInputElement;
                                    if(targetInput) { targetInput.value = ev.target?.result as string; }
                                    const img = document.getElementById('edit-avatar-preview') as HTMLImageElement;
                                    if (img) { img.src = ev.target?.result as string; img.classList.remove('hidden'); document.getElementById('edit-avatar-placeholder')?.classList.add('hidden'); }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }} />
                              <img id="edit-avatar-preview" src={selectedElder.avatar || undefined} className={`w-full h-full object-cover ${!selectedElder.avatar ? 'hidden' : ''}`} />
                              <div id="edit-avatar-placeholder" className={`text-slate-400 font-bold ${selectedElder.avatar ? 'hidden' : ''}`}>
                                 {selectedElder.name?.[0] || '长'}
                              </div>
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Edit className="w-4 h-4 text-white" />
                              </div>
                           </label>
                           <input id="edit-avatar" type="text" defaultValue={selectedElder.avatar || ""} className="hidden" />
                           <span className="text-xs text-slate-400">点击头像照片更改</span>
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">身份证号</label>
                         <input type="text" defaultValue={selectedElder.idCard || ""} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">联系电话</label>
                         <input type="text" defaultValue={selectedElder.contact?.split(' ')?.[1] || ""} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="col-span-2 md:col-span-3 lg:col-span-3 space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">入住前现住址</label>
                         <input type="text" defaultValue={selectedElder.currentAddress || ""} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">户籍地址</label>
                         <input type="text" defaultValue={selectedElder.nativePlace || ""} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">宗教信仰</label>
                         <select defaultValue={selectedElder.religion || '无'} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                           <option value="无">无</option>
                           <option value="佛教">佛教</option>
                           <option value="道教">道教</option>
                           <option value="基督教">基督教</option>
                           <option value="其他">其他</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="block mb-1 text-slate-600 text-sm">受教育程度</label>
                         <select defaultValue={selectedElder.education || '未知'} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                           <option value="未知">未知</option>
                           <option value="小学及以下">小学及以下</option>
                           <option value="初中">初中</option>
                           <option value="高中/中专">高中/中专</option>
                           <option value="大学专科及以上">大学专科及以上</option>
                         </select>
                      </div>
                      
                      <div className="col-span-2 md:col-span-3 lg:col-span-4 border-t border-slate-100 mt-2 pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
                         <div className="space-y-1.5">
                            <label className="block mb-1 text-slate-600 text-sm">吸烟史</label>
                            <select defaultValue={selectedElder.smoking || '否'} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                              <option value="否">否</option>
                              <option value="是">是</option>
                              <option value="已戒烟">已戒烟</option>
                            </select>
                         </div>
                         <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-1.5">
                            <label className="block mb-1 text-slate-600 text-sm">兴趣爱好</label>
                            <div className="flex flex-wrap gap-2 text-sm">
                               {["看报纸", "听广播", "下象棋", "看电视", "散步", "养花", "打麻将", "书法", "唱歌", "跳舞", "太极拳"].map((hobby) => (
                                 <label key={hobby} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded cursor-pointer hover:bg-slate-100 transition-colors">
                                   <input type="checkbox" defaultChecked={(selectedElder.hobbies || "").includes(hobby)} className="accent-indigo-600" />
                                   <span className="text-slate-700">{hobby}</span>
                                 </label>
                               ))}
                            </div>
                         </div>
                         <div className="space-y-1.5">
                            <label className="block mb-1 text-slate-600 text-sm">听力状况</label>
                            <select defaultValue={selectedElder.hearing || '正常'} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                               <option value="正常">正常</option>
                               <option value="轻度下降">轻度下降</option>
                               <option value="需助听器">需助听器</option>
                            </select>
                         </div>
                         <div className="space-y-1.5">
                            <label className="block mb-1 text-slate-600 text-sm">视力状况</label>
                            <select defaultValue={selectedElder.vision || '正常'} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                               <option value="正常">正常</option>
                               <option value="老花眼">老花眼</option>
                               <option value="白内障">白内障</option>
                            </select>
                         </div>
                         <div className="col-span-2 space-y-1.5">
                            <label className="block mb-1 text-slate-600 text-sm">行为能力 / 步态</label>
                            <select defaultValue={selectedElder.mobility || '自理'} className="w-full border border-slate-300 px-3 py-2 text-sm rounded bg-white focus:outline-none focus:border-indigo-500">
                               <option value="自理">自理</option>
                               <option value="借助拐杖可独自行走">借助拐杖可独自行走</option>
                               <option value="需轮椅辅助">需轮椅辅助</option>
                               <option value="卧床">卧床</option>
                               <option value="其他">其他</option>
                            </select>
                         </div>
                      </div>
                   </div>
                   <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button onClick={() => { setIsEditing(false); setShowNewElderModal(false); }} className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">取消</button>
                      <button onClick={handleSave} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm">保存资料</button>
                   </div>
                </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 flex-wrap gap-y-6 gap-x-8 text-sm">
                  <div>
                     <span className="text-slate-500 block mb-1">身份证号</span>
                     <span className="font-medium text-slate-800 text-base">{selectedElder.idCard?.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2') || "32010219410101****"}</span>
                  </div>
                  <div>
                     <span className="text-slate-500 block mb-1">长者联系电话</span>
                     <span className="font-medium text-slate-800 text-base">{selectedElder.contact?.split(' ')?.[1] || "139****1234"}</span>
                  </div>
                  <div className="col-span-2">
                     <span className="text-slate-500 block mb-1">入住前现住址</span>
                     <span className="font-medium text-slate-800 text-base">{selectedElder.currentAddress || "江苏省南京市建邺区"}</span>
                  </div>
                  <div className="col-span-2">
                     <span className="text-slate-500 block mb-1">户籍地址 (原籍)</span>
                     <span className="font-medium text-slate-800 text-base">{selectedElder.nativePlace || "江苏省南京市玄武区"}</span>
                  </div>
                  <div>
                     <span className="text-slate-500 block mb-1">宗教信仰</span>
                     <span className="font-medium text-slate-800 text-base">{selectedElder.religion || "无"}</span>
                  </div>
                  <div>
                     <span className="text-slate-500 block mb-1">受教育程度</span>
                     <span className="font-medium text-slate-800 text-base">{selectedElder.education || "未知"}</span>
                  </div>
                  
                  <div className="col-span-2 md:col-span-3 lg:col-span-4 border-t border-slate-100 mt-2 pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-8">
                     <div>
                        <span className="text-slate-500 block mb-1">吸烟史</span>
                        <span className="font-medium text-slate-800 text-base">{selectedElder.smoking || "否"}</span>
                     </div>
                     <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <span className="text-slate-500 block mb-1">兴趣爱好</span>
                        <span className="font-medium text-slate-800 text-base">{selectedElder.hobbies || "无特殊"}</span>
                     </div>
                     <div>
                        <span className="text-slate-500 block mb-1">听力状况</span>
                        <span className="font-medium text-slate-800 text-base">{selectedElder.hearing || "正常"}</span>
                     </div>
                     <div>
                        <span className="text-slate-500 block mb-1">视力状况</span>
                        <span className="font-medium text-slate-800 text-base">{selectedElder.vision || "正常"}</span>
                     </div>
                     <div className="col-span-2">
                        <span className="text-slate-500 block mb-1">行为能力 / 步态</span>
                        <span className="font-medium text-slate-800 text-base">{selectedElder.mobility || "自理"}</span>
                     </div>
                  </div>
                </div>
             )}
           </CardContent>
         </Card>

         {/* Removed 已绑定的智能设备 as it is now in a separate tab */}
       </div>
    </div>
  );

  // Optional: A helper to handle tab clicks
  const handleTabClick = (tabId: string) => {
    setTargetElderTab(tabId);
  };

  const tabsMenu = [
    { id: 'info', label: '基本资料与特征', icon: User },
    { id: 'health', label: '健康与用药档案', icon: HeartPulse },
    { id: 'family', label: '亲属与授权绑定', icon: UsersIcon },
    { id: 'devices', label: '已绑定设备', icon: Wifi }
  ];

  if (actualTargetElderId && selectedElder) {
    const detailLayout = (
      <div className="bg-white border text-sm border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col h-[calc(100vh-120px)] animate-in fade-in zoom-in-95 duration-200">
         <div className="border-b border-slate-200 pb-0 flex flex-col bg-slate-50 shrink-0">
            <div className="flex justify-between items-center px-6 pt-4 pb-2">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl bg-indigo-100 text-indigo-700 shadow-sm overflow-hidden shrink-0">
                    {selectedElder.avatar ? <img src={selectedElder.avatar} className="w-full h-full object-cover" alt={selectedElder.name} /> : selectedElder.name?.[0]}
                  </div>
                  <div>
                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {selectedElder.name}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedElder.status === '在院' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{selectedElder.status}</span>
                     </h3>
                     <p className="text-sm text-slate-500 mt-0.5">{selectedElder.age}岁 · {selectedElder.gender} · 档案编号: {selectedElder.id}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                 {!embedded && (
                   <button onClick={() => { if(globalSetTargetElderId) globalSetTargetElderId(null); if(propSetTargetElderId) propSetTargetElderId(null); }} className="text-slate-600 flex items-center gap-1 font-medium bg-white px-3 py-1.5 border border-slate-200 shadow-sm rounded-lg hover:bg-slate-50">
                     <ArrowLeft className="w-4 h-4"/> 返回列表
                   </button>
                 )}
               </div>
            </div>
            
            <div className="flex px-6 pt-2">
               {tabsMenu.map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 font-medium border-b-2 text-sm transition-colors ${targetElderTab === tab.id ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'}`}
                 >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                 </button>
               ))}
            </div>
         </div>
         
         <div className="flex-1 overflow-auto bg-slate-50/30">
            {targetElderTab === 'info' && renderDetailContent()}
            {targetElderTab === 'health' && <HealthRecord targetElderId={actualTargetElderId} embedded={true} />}
            {targetElderTab === 'family' && <FamilyBind targetElderId={actualTargetElderId} embedded={true} />}
            {targetElderTab === 'devices' && <ElderDevices targetElderId={actualTargetElderId} embedded={true} />}
         </div>
      </div>
    );

    if (embedded) {
       return <div className="h-full w-full">{detailLayout}</div>;
    }

    return (
       <div className="animate-in fade-in duration-500 pb-8 h-full">
         <div className="mb-6 flex justify-between items-end shrink-0">
           <div>
             <h1 className="text-2xl font-bold text-slate-800 mb-1">长者全量档案卷宗</h1>
             <span className="text-sm text-slate-500">查看长者的详细信息、健康状况、家属及设备信息</span>
           </div>
         </div>
         {detailLayout}
       </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">长者基本资料</h1>
          <span className="text-sm text-slate-500">维护长者的基础身份、生活习惯、特征画像与关联档案</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { 
                setIsEditing(true); 
                setSelectedElder({ id: "NEW", name: "新长者", gender: "男", age: "", status: "在院", contact: "", room: "未分配" }); 
                setShowNewElderModal(true); 
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            新建长者档案
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <Card className="w-64 border border-slate-200 shadow-sm h-[calc(100vh-170px)] shrink-0 hidden md:block">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500" />
              院区与楼层
            </h3>
          </div>
          <div className="p-2 space-y-1">
             <div className="px-3 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-md text-sm cursor-pointer">全院所有长者 (265)</div>
             <div className="px-3 py-2 text-slate-600 font-medium rounded-md text-sm hover:bg-slate-100 cursor-pointer">A栋 主楼 (180)</div>
             <div className="px-3 py-2 text-slate-600 font-medium rounded-md text-sm hover:bg-slate-100 cursor-pointer">B栋 VIP区 (45)</div>
             <div className="px-3 py-2 text-slate-600 font-medium rounded-md text-sm hover:bg-slate-100 cursor-pointer">C栋 康复区 (40)</div>
          </div>
        </Card>

        <Card className="flex-1 border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                  <button 
                    onClick={() => setSelectedStatus('在院')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${selectedStatus === '在院' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >在院长者 (265)</button>
                  <button 
                    onClick={() => setSelectedStatus('已退住')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${selectedStatus === '已退住' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >历史/退住 (12)</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="搜索长者姓名/身份证..." 
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4" /> 筛选
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">长者 (年龄/性别)</th>
                    <th className="px-6 py-4 font-medium">床位号</th>
                    <th className="px-6 py-4 font-medium">护理等级</th>
                    <th className="px-6 py-4 font-medium">入住时间</th>
                    <th className="px-6 py-4 font-medium">家属联系人</th>
                    <th className="px-6 py-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allElders.filter(e => e.status === selectedStatus).map((elder) => (
                    <tr key={elder.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${elder.gender === '男' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'} overflow-hidden shrink-0`}>
                            {elder.avatar ? <img src={elder.avatar} className="w-full h-full object-cover" alt={elder.name} /> : elder.name.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{elder.name}</div>
                            <div className="text-xs text-slate-500">{elder.age}岁 / {elder.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-indigo-600">{elder.room}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        <span className={`px-2 py-1 rounded-md text-xs border ${
                          elder.careLevel === '二级护理' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                          elder.careLevel === '特级护理' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                          'bg-indigo-50 border-indigo-200 text-indigo-700'
                        }`}>
                          {elder.careLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{elder.admitDate}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{elder.contact}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => handleOpenDetail(elder)} className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-50 transition" title="查阅全量档案"><FileText className="w-4 h-4" /></button>
                           <button onClick={() => { if (globalSetTargetElderId) { globalSetTargetElderId(elder.id); setTargetElderTab('info'); } else if (propSetTargetElderId) propSetTargetElderId(elder.id); }} className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-50 transition" title="编辑资料"><Edit className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {allElders.filter(e => e.status === selectedStatus).length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>没有找到匹配的长者数据</p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* 调房/换床 Modal */}
      {showNewElderModal && selectedElder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg bg-indigo-100 text-indigo-700 border-indigo-200`}>
                   新
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                       新建长者档案 
                    </h3>
                 </div>
              </div>
              <button onClick={() => setShowNewElderModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-white"><X className="w-5 h-5 absolute opacity-0" /> 关闭</button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
               {renderDetailContent()}
            </div>
          </div>
        </div>
      )}

      {showChangeRoomModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-emerald-100 bg-emerald-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   长者调房/换床申请
                </h3>
                <button onClick={() => setShowChangeRoomModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg mb-6 flex items-center gap-4 text-sm">
                   <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white shadow-sm flex items-center justify-center bg-slate-200 font-bold text-slate-500">
                     {selectedElder?.avatar ? <img src={selectedElder?.avatar} className="w-full h-full object-cover" alt={selectedElder?.name} /> : selectedElder?.name?.[0]}
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-base mb-1">{selectedElder?.name}</p>
                     <p className="text-slate-600">当前床位: <span className="font-bold text-rose-600">{selectedElder?.room}</span></p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">意向调换楼宇 / 楼层</label>
                     <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        <option value="all">全院可调床位</option>
                        <option value="A栋">A栋 主楼</option>
                        <option value="B栋">B栋 VIP区</option>
                        <option value="C栋">C栋 康复区</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">调整护理等级</label>
                     <select defaultValue={selectedElder?.careLevel} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        <option>保持当前等级不变 ({selectedElder?.careLevel})</option>
                        {careLevels.map((lvl) => (
                          <option key={lvl.id}>{lvl.name}</option>
                        ))}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">目标房间/床位 *</label>
                     <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        {beds.filter(b => b.status === 'empty').map(b => (
                          <option key={b.id} value={b.id}>{b.id} ({b.building} - {b.roomType})</option>
                        ))}
                        {beds.filter(b => b.status === 'empty').length === 0 && (
                          <option disabled>当前全院无空闲床位</option>
                        )}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">调换原因备注</label>
                     <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white resize-none" placeholder="如：家属要求、病情变化等..."></textarea>
                   </div>
                   <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-xs text-amber-800 font-medium">注意：调房可能涉及月度计费标准的变化，保存后将自动生成一条费用调整待办事项给财务部。</p>
                   </div>
                </div>
             </div>

             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowChangeRoomModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
                <button 
                  onClick={() => setShowChangeRoomModal(false)} 
                  className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> 提交调房申请
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
