import { Card, CardContent, CardHeader } from "../components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Package, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";

export function StatInventory() {
  const expenseData = [
    { month: '10月', 护理耗材: 12500, 生活物资: 8200, 办公用品: 1500 },
    { month: '11月', 护理耗材: 13200, 生活物资: 7800, 办公用品: 2100 },
    { month: '12月', 护理耗材: 15800, 生活物资: 9500, 办公用品: 1800 },
    { month: '1月', 护理耗材: 19500, 生活物资: 12400, 办公用品: 3200 },
    { month: '2月', 护理耗材: 14200, 生活物资: 8100, 办公用品: 1200 },
    { month: '3月', 护理耗材: 15100, 生活物资: 8600, 办公用品: 1600 },
  ];

  const stockAlertData = [
    { name: '医用手套(L)', 结存: 120, 预警线: 200 },
    { name: 'N95口罩', 结存: 85, 预警线: 150 },
    { name: '护理垫', 结存: 45, 预警线: 100 },
    { name: '成人纸尿裤', 结存: 12, 预警线: 50 },
    { name: '消毒凝胶', 结存: 8, 预警线: 30 },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">物料结存与采购报表</h2>
          <p className="text-slate-500 text-sm mt-1">监控各仓库物资结存，统计月度采购支出趋势并预警低库存</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">当前库存总数</p>
                <h3 className="text-xl font-bold text-slate-800">45,280 <span className="text-xs font-normal text-slate-500">件</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月消耗量</p>
                <h3 className="text-xl font-bold text-slate-800">3,142 <span className="text-xs font-normal text-slate-500">件</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月采购支出</p>
                <h3 className="text-xl font-bold text-slate-800">¥25,300</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white ring-1 ring-rose-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-rose-600 mb-1">低库存预警</p>
                <h3 className="text-xl font-bold text-rose-700">12 <span className="text-xs font-normal text-rose-500">种物资不足</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1 min-h-[400px]">
        <Card className="border-none shadow-sm shadow-slate-200/50 flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">近半年采购支出趋势 (元)</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="护理耗材" stackId="a" fill="#3b82f6" maxBarSize={40} />
                <Bar dataKey="生活物资" stackId="a" fill="#10b981" maxBarSize={40} />
                <Bar dataKey="办公用品" stackId="a" fill="#f59e0b" maxBarSize={40} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
            <h3 className="font-bold text-slate-800">库存短缺告警 Top 5</h3>
            <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded font-medium">亟需采购</span>
          </CardHeader>
          <CardContent className="p-4 pt-6 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockAlertData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="结存" stroke="#ef4444" strokeWidth={3} dot={{ strokeWidth: 2, r: 6, fill: "white" }} activeDot={{ r: 8 }} />
                <Line type="step" dataKey="预警线" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
