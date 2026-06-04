import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BadgeCheck, BatteryFull, Thermometer, Mic, ShieldAlert, Watch, Locate, Cpu } from "lucide-react";

export function DeviceStatus() {
  const categories = [
    { name: "智能床垫", online: 110, total: 120, icon: Thermometer },
    { name: "防跌倒雷达", online: 45, total: 45, icon: Locate },
    { name: "智能胸带/手表", online: 92, total: 100, icon: Watch },
    { name: "生命体征探测器", online: 24, total: 24, icon: Mic },
    { name: "过道监控摄像头", online: 32, total: 32, icon: ShieldAlert },
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1 border-none shadow-sm shadow-slate-200/50 bg-white">
      <CardHeader className="py-5 px-6 border-b border-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            物联设备状态
          </CardTitle>
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">共 321 台</div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {categories.map((cat, i) => {
            const ratio = cat.online / cat.total;
            const isFull = cat.online === cat.total;
            return (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                      <cat.icon className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 tracking-tight">{cat.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-800">{cat.online}</span>
                    <span className="text-xs font-medium text-slate-400"> / {cat.total}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-emerald-500' : ratio > 0.8 ? 'bg-indigo-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold w-10 text-right ${
                    isFull ? 'text-emerald-600' : ratio > 0.8 ? 'text-indigo-600' : 'text-amber-600'
                  }`}>
                    {Math.round(ratio * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
