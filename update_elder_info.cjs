const fs = require('fs');
let code = fs.readFileSync('src/pages/ElderInfo.tsx', 'utf-8');

code = code.replace(/const { elders: storeElders([^}]+)updateElder, addElder, careLevels } = useStore\(\);/, 'const { elders: storeElders$1updateElder, addElder, removeElder, careLevels } = useStore();');

const headerEditRegex = /<button onClick=\{\(\) => setIsEditing\(true\)\} className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">\s*<Edit className="w-4 h-4"\/> 修改基础信息\s*<\/button>/m;

const replacement = `<div className="flex items-center gap-4">
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
                 </div>`;

code = code.replace(headerEditRegex, replacement);

fs.writeFileSync('src/pages/ElderInfo.tsx', code);
