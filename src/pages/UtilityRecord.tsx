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
} from "lucide-react";
import { toast } from "sonner";

export function UtilityRecord() {
  const [activeMonth, setActiveMonth] = useState("2023-10");

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
            onClick={() => toast.info("批量导入抄表数据功能开发中")}
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
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">A栋-101</td>
                <td className="px-6 py-4 text-slate-600 font-mono">1,250.5</td>
                <td className="px-6 py-4 text-slate-600 font-mono">8,420.0</td>
                <td className="px-6 py-4 text-emerald-600 font-medium">12.5</td>
                <td className="px-6 py-4 text-amber-600 font-medium">150.0</td>
                <td className="px-6 py-4 font-bold inline-flex items-baseline gap-1">
                  <span className="text-xs text-slate-400">¥</span> 262.50
                </td>
                <td className="px-6 py-4">
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-sm text-xs font-medium">
                    已录入
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toast.info("查看抄表详情")}
                    className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">A栋-102</td>
                <td className="px-6 py-4 text-slate-600 font-mono">-</td>
                <td className="px-6 py-4 text-slate-600 font-mono">-</td>
                <td className="px-6 py-4 text-slate-400">-</td>
                <td className="px-6 py-4 text-slate-400">-</td>
                <td className="px-6 py-4 text-slate-400">-</td>
                <td className="px-6 py-4">
                  <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-sm text-xs font-medium">
                    待录入
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toast.info("单间录入功能开发中")}
                    className="text-indigo-600 font-medium text-xs px-2 py-1 border border-indigo-200 rounded hover:bg-indigo-50"
                  >
                    录入
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
