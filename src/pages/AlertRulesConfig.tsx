import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Bell, HeartPulse, ShieldAlert, Activity, Settings, Plus, Play, Pause, ThermometerSun, Bed, X } from "lucide-react";

export function AlertRulesConfig() {
  const [activeTab, setActiveTab] = useState("vital");

  const [rules, setRules] = useState([
    { id: 1, type: "vital", name: "心率过高预警", metric: "心率 (Heart Rate)", condition: ">", threshold: "100 bpm", level: "紧急", status: "active", devices: ["智能床垫", "健康腕表"], extend: "" },
    { id: 2, type: "vital", name: "心率过低预警", metric: "心率 (Heart Rate)", condition: "<", threshold: "50 bpm", level: "紧急", status: "active", devices: ["智能床垫", "健康腕表"], extend: "" },
    { id: 3, type: "vital", name: "呼吸暂停报警", metric: "呼吸率 (Respiration)", condition: "=", threshold: "0 次/分 (持续15秒)", level: "危急", status: "active", devices: ["智能床垫", "毫米波雷达"], extend: "" },
    { id: 4, type: "vital", name: "体温异常预警", metric: "体表温度", condition: ">", threshold: "37.5 ℃", level: "提醒", status: "paused", devices: ["健康腕表"], extend: "" },
    { id: 5, type: "safety", name: "夜间异常离床预警", metric: "离床时长", condition: ">", threshold: "15 分钟", level: "紧急", status: "active", extend: "生效时间段: 22:00 - 06:00", devices: ["智能床垫"] },
    { id: 6, type: "safety", name: "卫生间防跌倒报警", metric: "长时间驻留", condition: ">", threshold: "30 分钟", level: "紧急", status: "active", devices: ["防跌倒雷达"], extend: "" },
    { id: 7, type: "safety", name: "越界告警(电子围栏)", metric: "出入区域", condition: "触发", threshold: "离开安全区", level: "危急", status: "active", devices: ["防走失胸牌", "健康腕表"], extend: "" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  const toggleStatus = (id: number) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' } : rule
    ));
  };

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingRule({
      id: Date.now(),
      type: activeTab,
      name: "",
      metric: "",
      condition: ">",
      threshold: "",
      level: "提醒",
      status: "active",
      devices: [],
      extend: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (rules.find(r => r.id === editingRule.id)) {
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
    } else {
      setRules([...rules, editingRule]);
    }
    setIsModalOpen(false);
  };

  const activeRules = rules.filter(r => r.type === activeTab);

  return (
    <div className="animate-in fade-in pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">智能预警规则与阈值配置</h1>
          <p className="text-slate-500 text-sm mt-1">集中管理所有智能物联设备的告警条件、阈值及触发升级策略</p>
        </div>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建预警规则
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('vital')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'vital' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4" />
            生命体征规则
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('safety')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'safety' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            行为安全规则
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('notification')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            预警通知与升级策略
          </div>
        </button>
      </div>

      {activeTab !== 'notification' ? (
        <Card>
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">全局规则列表</CardTitle>
              <CardDescription>当设备采集的指标触发以下条件时，将自动生成平台告警。</CardDescription>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-md text-blue-700">
              <Settings className="w-4 h-4" /> 支持为特定长者单独配置个性化阈值
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="font-medium p-4 pl-6">规则名称</th>
                  <th className="font-medium p-4">监控指标</th>
                  <th className="font-medium p-4">触发阈值条件</th>
                  <th className="font-medium p-4">告警级别</th>
                  <th className="font-medium p-4">适用设备</th>
                  <th className="font-medium p-4">状态</th>
                  <th className="font-medium p-4 text-right pr-6">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {activeRules.map((rule, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-medium text-slate-800">{rule.name}</div>
                      {rule.extend && <div className="text-xs text-slate-500 mt-1">{rule.extend}</div>}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        {rule.metric.includes('心率') ? <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> : 
                         rule.metric.includes('温') ? <ThermometerSun className="w-3.5 h-3.5 text-orange-500" /> :
                         rule.metric.includes('离床') ? <Bed className="w-3.5 h-3.5 text-emerald-500" /> :
                         <Activity className="w-3.5 h-3.5 text-blue-500" />
                        }
                        {rule.metric}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{rule.condition}</span>
                        <span className="text-rose-600 font-semibold">{rule.threshold}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border 
                        ${rule.level === '危急' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                          rule.level === '紧急' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {rule.level}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {rule.devices.map((d, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                       {rule.status === 'active' ? (
                         <span className="flex items-center gap-1.5 text-emerald-600 text-sm">
                           <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 生效中
                         </span>
                       ) : (
                         <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                           <span className="w-2 h-2 rounded-full bg-slate-300"></span> 已暂停
                         </span>
                       )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                       <button onClick={() => handleEdit(rule)} className="text-blue-600 hover:underline mr-4 font-medium">编辑</button>
                       {rule.status === 'active' ? (
                         <button onClick={() => toggleStatus(rule.id)} className="text-slate-400 hover:text-amber-600 font-medium" title="暂停规则"><Pause className="w-4 h-4 inline" /></button>
                       ) : (
                         <button onClick={() => toggleStatus(rule.id)} className="text-slate-400 hover:text-emerald-600 font-medium" title="启用规则"><Play className="w-4 h-4 inline" /></button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">通知对象与升级策略</CardTitle>
              <CardDescription>配置告警触发后的通知通道，并设定超时未处理时的上报机制。</CardDescription>
            </div>
            <button className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 text-sm font-medium transition-colors">
              保存策略全局配置
            </button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span> 
                  1. 初次通知设定
                </h4>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                    <div className="font-medium text-slate-700">常规提醒 (提醒级)</div>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> APP 消息推送 (专属护工)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> 护士站大屏显示
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> 通知家属 (微信提醒)
                    </label>
                  </div>
                  <div className="p-4 border border-amber-200 bg-amber-50/30 rounded-xl space-y-3">
                    <div className="font-medium text-amber-800">重要预警 (紧急级)</div>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> APP 强弹窗警报 (护工 + 主管)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 护士站大屏高亮声音报警
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> 发送短信至紧急联系人
                    </label>
                  </div>
                  <div className="p-4 border border-rose-200 bg-rose-50/30 rounded-xl space-y-3">
                    <div className="font-medium text-rose-800">生命安危 (危急级)</div>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 语音电话自动外呼 (片区所有人员)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 护士站大屏防灾警报级全屏提醒
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 语音电话自动外呼 (家属)
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> 
                  2. 超时未处理升级机制
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">当 紧急级 及以上预警发生后，如果</span>
                    <select defaultValue="5 分钟" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
                      <option value="3 分钟">3 分钟</option>
                      <option value="5 分钟">5 分钟</option>
                      <option value="10 分钟">10 分钟</option>
                    </select>
                    <span className="text-sm font-medium text-slate-700">内无人接单处理，则自动触发第一级上报：</span>
                  </div>
                  <div className="flex items-center gap-4 pl-6 border-l-2 border-slate-300 ml-2 py-2">
                    <span className="text-sm text-slate-600">通知对象：</span>
                    <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 护理大区负责人
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 医疗主任
                    </label>
                    <span className="text-sm text-slate-600 ml-4">通知方式：</span>
                    <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" defaultChecked /> 短信提醒
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer">
                      <input type="checkbox" className="rounded text-blue-600" /> 自动外呼
                    </label>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-medium text-slate-700">如果继续超时</span>
                    <select defaultValue="10 分钟" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white">
                      <option value="5 分钟">5 分钟</option>
                      <option value="10 分钟">10 分钟</option>
                      <option value="15 分钟">15 分钟</option>
                    </select>
                    <span className="text-sm font-medium text-slate-700">仍未妥善处理，则触发最高级上报：</span>
                  </div>
                  <div className="flex items-center gap-4 pl-6 border-l-2 border-rose-300 ml-2 py-2">
                    <span className="text-sm text-slate-600">通知对象：</span>
                    <label className="flex items-center gap-2 text-sm text-rose-800 font-medium cursor-pointer">
                      <input type="checkbox" className="rounded text-rose-600" defaultChecked disabled /> 院长/机构总负责人
                    </label>
                    <span className="text-sm text-slate-600 ml-4">通知方式：</span>
                    <label className="flex items-center gap-2 text-sm text-rose-800 font-medium cursor-pointer">
                      <input type="checkbox" className="rounded text-rose-600" defaultChecked disabled /> 自动外呼 + 短信双通道
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">
                {rules.some(r => r.id === editingRule?.id) ? '编辑规则' : '新建预警规则'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">规则名称 *</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  value={editingRule?.name || ""} 
                  onChange={e => setEditingRule({...editingRule, name: e.target.value})}
                  placeholder="例如: 心率过高预警"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">监控指标 *</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    value={editingRule?.metric || ""} 
                    onChange={e => setEditingRule({...editingRule, metric: e.target.value})}
                    placeholder="例如: 心率 (Heart Rate)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">告警级别 *</label>
                  <select 
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    value={editingRule?.level || "提醒"} 
                    onChange={e => setEditingRule({...editingRule, level: e.target.value})}
                  >
                    <option value="提醒">提醒</option>
                    <option value="紧急">紧急</option>
                    <option value="危急">危急</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">触发条件 *</label>
                  <select 
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    value={editingRule?.condition || ">"} 
                    onChange={e => setEditingRule({...editingRule, condition: e.target.value})}
                  >
                    <option value=">">大于 {">"}</option>
                    <option value="<">小于 {"<"}</option>
                    <option value="=">等于 {"="}</option>
                    <option value=">=">大于等于 {">="}</option>
                    <option value="<=">小于等于 {"<="}</option>
                    <option value="触发">特定事件触发</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">阈值/触发值 *</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    value={editingRule?.threshold || ""} 
                    onChange={e => setEditingRule({...editingRule, threshold: e.target.value})}
                    placeholder="例如: 100 bpm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">适用设备</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  value={editingRule?.devices?.join(', ') || ""} 
                  onChange={e => setEditingRule({...editingRule, devices: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})}
                  placeholder="例如: 智能床垫, 健康腕表 (用逗号分隔)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">附加说明 / 扩展时间段</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                  value={editingRule?.extend || ""} 
                  onChange={e => setEditingRule({...editingRule, extend: e.target.value})}
                  placeholder="例如: 生效时间段: 22:00 - 06:00"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                disabled={!editingRule?.name || !editingRule?.metric || !editingRule?.threshold}
              >
                保存规则
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
