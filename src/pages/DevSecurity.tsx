import { ShieldCheck, UserCog, Lock, EyeOff, LayoutGrid } from "lucide-react";

export function DevSecurity() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 w-full max-w-6xl mx-auto">
      <div className="mb-8 p-6 bg-gradient-to-r from-rose-600 to-red-800 rounded-2xl text-white shadow-md">
         <h2 className="text-3xl font-black tracking-tight mb-2">数据安全与权限策略</h2>
         <p className="text-rose-100/90 font-medium">RBAC/ABAC 多维租户权限控制体系、数据加密及隐私合规架构</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
               <UserCog className="w-5 h-5 text-rose-600" />
               <h3 className="font-black text-slate-800 text-lg">角色与资源控制模型 (RBAC)</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center gap-6">
               <p className="text-slate-500 text-sm">系统采用分区分层的多租户角色控制逻辑，将"功能操作"与"数据范围"解耦管理。分为全局超管、机构管理员及基层执行职员。</p>
               
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <span className="w-24 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Super Admin</span>
                     <div className="h-0.5 flex-1 bg-slate-200"></div>
                     <span className="text-sm font-bold text-slate-800">平台基础设施运维统筹，管理所有子机构账号分配。</span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <span className="w-24 text-right text-xs font-bold text-rose-600 uppercase tracking-wider">Tenant Admin</span>
                     <div className="h-0.5 flex-1 bg-rose-200"></div>
                     <span className="text-sm font-bold text-slate-800">养老院院长级，独享专属数据沙盒，可自定义配置财务、排班参数。</span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <span className="w-24 text-right text-xs font-bold text-indigo-600 uppercase tracking-wider">Staff Role</span>
                     <div className="h-0.5 flex-1 bg-indigo-200"></div>
                     <span className="text-sm font-bold text-slate-800">护士、护理员、生管等，按岗赋权（如：只能读写本分配区域的老人记录）。</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <EyeOff className="w-5 h-5 text-slate-600" />
               <h3 className="font-black text-slate-800 text-lg">数据脱敏规范</h3>
            </div>
            <ul className="space-y-4 text-sm flex-1">
               <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                  <div>
                     <span className="font-bold text-slate-700 block">身份标识脱敏</span>
                     <span className="text-slate-500 text-xs">身份证号码采用 `***...***` 掩码展示，后端日志禁止输出完整明文。</span>
                  </div>
               </li>
               <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                  <div>
                     <span className="font-bold text-slate-700 block">联系方式隐藏</span>
                     <span className="text-slate-500 text-xs">家属联系电话默认展示 `138****1234`，确需拨打利用软电话转接。</span>
                  </div>
               </li>
               <li className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                  <div>
                     <span className="font-bold text-slate-700 block">病历隐私控制</span>
                     <span className="text-slate-500 text-xs">既往病史、特护记录仅允许关联负责医护人员查阅，严禁平台跨界导出。</span>
                  </div>
               </li>
            </ul>
         </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6 text-slate-300">
         <div className="flex gap-3 items-center mb-4 border-b border-slate-800 pb-4">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-white text-lg">传输与存储加密基线</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
               <div className="font-bold text-indigo-300 mb-2 font-mono">1. 网络传输层 (Transport)</div>
               <p className="text-slate-400 leading-relaxed mb-4">全链路强制 HTTPS / TLS 1.3 升级，拦截一切 HTTP 降级行为。对敏感接口防重放（加入 nonce 及 timestamp 校验签名）。</p>
               
               <div className="font-bold text-indigo-300 mb-2 font-mono">2. 数据库落盘引擎 (Storage)</div>
               <p className="text-slate-400 leading-relaxed">RDS 开启 TDE（Transparent Data Encryption）。针对密码及关键认证 Hash，采用带有随机盐值的 Bcrypt 或 Argon2 算法存储，严禁使用弱哈希例如 MD5。</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[12px] overflow-x-auto text-slate-500 leading-loose">
               // 请求防篡改头部示例<br/>
               <span className="text-blue-400">Authorization:</span> Bearer eyJhbG...<br/>
               <span className="text-blue-400">X-Request-Timestamp:</span> 1714460592<br/>
               <span className="text-blue-400">X-Request-Nonce:</span> 8f9b2c1d-4e5f<br/>
               <span className="text-blue-400">X-Request-Signature:</span> sha256(path+body+timestamp+nonce+secret)<br/><br/>
               <span className="text-slate-600">/* 网关自动拦截非法或重放过期的签名请求，并阻断向后端微服务透传。 */</span>
            </div>
         </div>
      </div>
    </div>
  );
}
