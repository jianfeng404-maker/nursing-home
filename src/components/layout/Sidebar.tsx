import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { menuGroups as baseMenuGroups, MenuGroup } from "../../config/menus";
import { useStore } from "../../store";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const { nursingStations } = useStore();

  const dynamicMenuGroups = useMemo(() => {
    return baseMenuGroups.map(group => {
      if (group.title === "工作台") {
        return {
          ...group,
          items: [
            ...group.items.filter(i => i.id !== 'nurse_station'),
            ...nursingStations.map(ns => ({
              id: `nurse_station_${ns.id}`,
              label: `护理站: ${ns.name}`
            }))
          ]
        };
      }
      return group;
    });
  }, [nursingStations]);

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "工作台": true,
    "个人照护管理": true,
    "智能安防与物联": true,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 h-screen flex flex-col text-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shrink-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              S
            </div>
            智能颐养
          </h1>
          <button 
            className="lg:hidden p-1 text-slate-400 hover:bg-slate-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto hidden-scrollbar">
          {dynamicMenuGroups.map((group, idx) => {
            const isExpanded = expandedGroups[group.title];
            const hasActiveItem = group.items.some(item => item.id === activeTab);
            
            return (
              <div key={idx} className="px-3 mb-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors group",
                    hasActiveItem && !isExpanded ? "text-emerald-700 bg-emerald-50/50" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className={cn(
                      "h-4 w-4", 
                      hasActiveItem ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    <span className={cn("font-medium", hasActiveItem && "text-emerald-700")}>{group.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="mt-1 mb-2 pl-[34px] space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-xs rounded-lg transition-colors",
                          activeTab === item.id 
                            ? "bg-emerald-50 text-emerald-700 font-semibold shadow-sm shadow-emerald-100" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-slate-100 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs shrink-0">
              Admin
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">系统管理员</p>
              <p className="text-[10px] text-slate-500 truncate">超级管理员</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
