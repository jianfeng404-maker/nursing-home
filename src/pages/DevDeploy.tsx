import { Server, Wrench, Shield, Box, GitBranch, ArrowRight } from "lucide-react";

export function DevDeploy() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 w-full max-w-6xl mx-auto">
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md">
         <h2 className="text-3xl font-black tracking-tight mb-2">环境部署与持续集成</h2>
         <p className="text-emerald-100/90 font-medium">多租户环境隔离、CI/CD 自动化流水线构建及发布流</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {/* Environment Setup */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
               <Server className="w-5 h-5 text-emerald-600" />
               <h3 className="font-black text-slate-800 text-lg">部署环境矩阵</h3>
            </div>
            
            <div className="space-y-4">
               <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 shadow-sm shrink-0">DEV</div>
                  <div>
                     <h4 className="font-bold text-slate-800 text-sm mb-1">开发联调环境</h4>
                     <p className="text-xs text-slate-500">针对开发人员，功能验证与合并前测试集成，日志级别最高，连接测试库。</p>
                  </div>
               </div>
               <div className="flex gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 relative overflow-hidden">
                  <div className="absolute -right-2 -top-2 w-12 h-12 bg-indigo-100 rounded-full opacity-50 blur-xl"></div>
                  <div className="w-12 h-12 bg-white rounded-lg border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 shadow-sm shrink-0 z-10">UAT</div>
                  <div className="z-10">
                     <h4 className="font-bold text-slate-800 text-sm mb-1">测试演示环境</h4>
                     <p className="text-xs text-slate-500">用于运营及产品验收使用，定期同步脱敏后的生产数据，验证上线流程。</p>
                  </div>
               </div>
               <div className="flex gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100 relative overflow-hidden">
                  <div className="absolute -right-2 -top-2 w-12 h-12 bg-rose-100 rounded-full opacity-50 blur-xl"></div>
                  <div className="w-12 h-12 bg-rose-600 rounded-lg shadow-sm flex items-center justify-center font-bold text-white shrink-0 z-10">PROD</div>
                  <div className="z-10">
                     <h4 className="font-bold text-rose-900 text-sm mb-1">正式生产环境</h4>
                     <p className="text-xs text-rose-700/80">严控制，仅限 Pipeline 自动化发布。配合监控平台实现自愈容灾。</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Pipeline */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
               <GitBranch className="w-5 h-5 text-blue-600" />
               <h3 className="font-black text-slate-800 text-lg">CI/CD 流水线设计</h3>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-4 pb-4">
               <div className="mb-6 relative">
                  <div className="absolute -left-[25px] top-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                     <Box className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="pl-6">
                     <h4 className="font-bold text-slate-700 text-sm">Code Commit & Linting</h4>
                     <p className="text-xs text-slate-500 mt-1">代码推入仓库后自动触发 ESLint 代码规范及 TSC 强类型编译校验。</p>
                  </div>
               </div>
               <div className="mb-6 relative">
                  <div className="absolute -left-[25px] top-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                     <Wrench className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="pl-6">
                     <h4 className="font-bold text-slate-700 text-sm">Build & Dockerize</h4>
                     <p className="text-xs text-slate-500 mt-1">打包生成优化后的前端静态产物，配合 Dockerfile 构建镜像推入内部 Registry。</p>
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute -left-[25px] top-1 bg-emerald-100 p-1 rounded-full border border-emerald-200">
                     <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="pl-6">
                     <h4 className="font-bold text-emerald-700 text-sm">Deploy & Notification</h4>
                     <p className="text-xs text-emerald-600/80 mt-1">部署更新集群 Pod 实例，发送发布成功提醒至企业聊天群或者邮件。</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      {/* Docker example */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-6">
         <h4 className="font-bold text-slate-300 text-sm mb-4 font-mono">// Dockerfile.prod Example (Frontend Nginx)</h4>
         <pre className="text-[13px] text-slate-400 font-mono leading-relaxed overflow-x-auto">
{`FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Custom Nginx configuration for single page app routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
         </pre>
      </div>
    </div>
  );
}
