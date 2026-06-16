import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Search,
  Plus,
  Filter,
  Zap,
  Droplets,
  ArrowRight,
  Download,
  Eye,
  X
} from "lucide-react";
import { toast } from "sonner";

export function UtilityRecord() {
  const [activeMonth, setActiveMonth] = useState("2023-10");
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [singleContext, setSingleContext] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState("");

  const [records, setRecords] = useState([
    {
      bed: "A栋-101",
      waterRead: "1,250.5",
      elecRead: "8,420.0",
      waterDiff: "12.5",
      elecDiff: "150.0",
      fee: "262.50",
      status: "已录入"
    },
    {
      bed: "A栋-102",
      waterRead: "-",
      elecRead: "-",
      waterDiff: "-",
      elecDiff: "-",
      fee: "-",
      status: "待录入"
    },
    {
       bed: "B栋-205",
       waterRead: "1,400.0",
       elecRead: "9,000.5",
       waterDiff: "10.0",
       elecDiff: "200.0",
       fee: "310.00",
       status: "已录入"
    }
  ]);

  const filteredRecords = records.filter(r => r.bed.includes(searchQuery));

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("批量抄表数据导入成功");
    setShowBatchModal(false);
  };

  const handleSingleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const water = formData.get("water") as string;
    const elec = formData.get("elec") as string;
    
    setRecords(records.map(r => r.bed === singleContext ? {
       ...r,
       waterRead: water,
       elecRead: elec,
       waterDiff: "12.0",
       elecDiff: "100.0",
       fee: "200.00",
       status: "已录入"
    } : r));

    toast.success(`${singleContext} 抄表数据录入成功`);
    setShowSingleModal(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            水电费与仪表记录
          </h1>
          <span className="text-sm text-slate-500">
            记录和复核各房间水电表读数，自动生成长者水电账单
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBatchModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            批量抄表录入
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">
                本月水费总计 (估计)
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-indigo-700">
                  <span className="text-lg">¥</span> 4,520
                </h3>
                <span className="text-xs text-indigo-500 font-medium bg-indigo-100/50 px-2 py-0.5 rounded">
                  共 1,205 吨
                </span>
              </div>
            </div>
            <Droplets className="absolute right-2 -bottom-4 w-24 h-24 text-indigo-100/50 -rotate-12" />
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm overflow-hidden relative">
          <CardContent className="p-6">
            <div className="relative z-10">
              <p className="text-sm font-medium text-slate-500 mb-1">
                本月电费总计 (估计)
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-amber-600">
                  <span className="text-lg">¥</span> 12,450
                </h3>
                <span className="text-xs text-amber-600 font-medium bg-amber-100/50 px-2 py-0.5 rounded">
                  共 8,300 度
                </span>
              </div>
            </div>
            <Zap className="absolute right-2 -bottom-4 w-24 h-24 text-amber-200/40 -rotate-12" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm flex flex-col justify-center">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">
                  抄表进度 ({activeMonth})
                </p>
                <h3 className="text-xl font-bold text-slate-800">
                  120 / 150{" "}
                  <span className="text-sm font-normal text-slate-500">间</span>
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-r-slate-200 flex items-center justify-center font-bold text-emerald-600 text-sm">
                80%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <select
                value={activeMonth}
                onChange={(e) => setActiveMonth(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white font-medium text-slate-700"
              >
                <option value="2023-11">2023年 11月</option>
                <option value="2023-10">2023年 10月</option>
                <option value="2023-09">2023年 09月</option>
              </select>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索房号..."
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-48 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success("报表导出成功，正在下载...")}
                className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" /> 导出报表
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">房号</th>
                <th className="px-6 py-4 font-medium">本月水表止码(吨)</th>
                <th className="px-6 py-4 font-medium">本月电表止码(度)</th>
                <th className="px-6 py-4 font-medium">计费水量(吨)</th>
                <th className="px-6 py-4 font-medium">计费电量(度)</th>
                <th className="px-6 py-4 font-medium">预估费用</th>
                <th className="px-6 py-4 font-medium">抄表状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(r => (
                <tr key={r.bed} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{r.bed}</td>
                  <td className={`px-6 py-4 font-mono ${r.waterRead === '-' ? 'text-slate-400' : 'text-slate-600'}`}>{r.waterRead}</td>
                  <td className={`px-6 py-4 font-mono ${r.elecRead === '-' ? 'text-slate-400' : 'text-slate-600'}`}>{r.elecRead}</td>
                  <td className={`px-6 py-4 font-medium ${r.waterDiff === '-' ? 'text-slate-400' : 'text-emerald-600'}`}>{r.waterDiff}</td>
                  <td className={`px-6 py-4 font-medium ${r.elecDiff === '-' ? 'text-slate-400' : 'text-amber-600'}`}>{r.elecDiff}</td>
                  <td className={`px-6 py-4 ${r.fee === '-' ? 'text-slate-400' : 'font-bold inline-flex items-baseline gap-1'}`}>
                    {r.fee !== '-' && <span className="text-xs text-slate-400">¥</span>} {r.fee}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-sm text-xs font-medium ${r.status === '已录入' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === '已录入' ? (
                      <button
                        onClick={() => toast.info("查看抄表详情")}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSingleContext(r.bed);
                          setShowSingleModal(true);
                        }}
                        className="text-indigo-600 font-medium text-xs px-2 py-1 border border-indigo-200 rounded hover:bg-indigo-50"
                      >
                        录入
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                   <td colSpan={8} className="px-6 py-12 text-center text-slate-400">没有找到符合条件的房间</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Batch Import Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">批量抄表数据导入</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleBatchSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">选择账期</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                    <option>2023年 11月</option>
                    <option>2023年 10月</option>
                  </select>
                </div>
                <div className="space-y-1.5 p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-400 transition-colors text-center cursor-pointer bg-slate-50">
                  <p className="text-sm text-indigo-600 font-medium">点击此处上传 Excel 文件</p>
                  <p className="text-xs text-slate-500 mt-1">支持 .xlsx 或 .csv 格式</p>
                </div>
                <div className="pt-2 text-xs text-slate-500">
                  导入说明：请下载标准模板据实填写。一次最多允许导入 500 条记录。
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">确认导入</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Entry Modal */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">单间抄表录入</h3>
              <button onClick={() => setShowSingleModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSingleSubmit}>
              <div className="p-6 space-y-4">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-800 text-sm mb-2 font-medium">
                  正在为 <strong>{singleContext}</strong> 录入读数
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">水表止码 (吨)</label>
                  <input name="water" required type="number" step="0.1" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="如: 1250.5" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">电表止码 (度)</label>
                  <input name="elec" required type="number" step="0.1" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="如: 8420.0" />
                </div>
                <div className="space-y-1.5">
                   <label className="flex items-center gap-2 mt-2">
                     <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                     <span className="text-sm text-slate-600">录入后自动计算本月费用</span>
                   </label>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowSingleModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">保存记录</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
