import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", active: 2, sleeping: 110, abnormal: 0 },
  { time: "04:00", active: 5, sleeping: 105, abnormal: 2 },
  { time: "08:00", active: 98, sleeping: 12, abnormal: 2 },
  { time: "12:00", active: 105, sleeping: 5, abnormal: 2 },
  { time: "16:00", active: 90, sleeping: 15, abnormal: 5 },
  { time: "20:00", active: 60, sleeping: 45, abnormal: 7 },
  { time: "23:59", active: 10, sleeping: 100, abnormal: 2 },
];

export function ActivityStatusChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm shadow-slate-200/50 flex flex-col h-full bg-white">
      <CardHeader className="py-5 px-6 border-b border-slate-50 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">24小时活动体征监测图</CardTitle>
          <div className="flex items-center gap-4 text-xs font-medium content-end">
            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>活动中</span>
            <span className="flex items-center gap-1.5 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200"></span>异常</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 min-h-0 w-full relative">
        <div className="absolute inset-x-6 inset-y-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAbnormal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                labelStyle={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}
              />
              <Area type="monotone" dataKey="active" name="活动中 (人)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
              <Area type="monotone" dataKey="abnormal" name="异常体征 (人)" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorAbnormal)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
