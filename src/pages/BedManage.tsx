import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, Edit2, Trash2, Home, Layers, Settings, ChevronRight, Activity, Zap, PlusCircle, X, CheckCircle2, ChevronDown } from "lucide-react";
import { useStore } from "../store";

export function BedManage() {
  const { 
    buildings, floors, rooms, roomTypes, 
    addBuilding, addFloor, addRoom, addRoomType,
    removeBuilding, removeFloor, removeRoom, removeRoomType
  } = useStore();

  const [activeTab, setActiveTab] = useState('rooms');
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaceType, setSpaceType] = useState('building'); // building, floor, room
  
  const [showTypeModal, setShowTypeModal] = useState(false);
  
  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>({'BLD-A': true});
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>('FL-A-1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleBuilding = (id: string) => {
    setExpandedBuildings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveSpace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (spaceType === 'building') {
      addBuilding({
        id: `BLD-${Date.now()}`,
        name: formData.get('name') as string,
        note: formData.get('note') as string,
      });
    } else if (spaceType === 'floor') {
      addFloor({
        id: `FL-${Date.now()}`,
        buildingId: formData.get('building') as string,
        name: formData.get('floorName') as string,
        type: formData.get('floorType') as string,
      });
    } else if (spaceType === 'room') {
      addRoom({
        id: `RM-${Date.now()}`,
        roomNo: formData.get('roomNo') as string,
        buildingId: formData.get('building') as string,
        floorId: formData.get('floor') as string,
        roomTypeId: formData.get('roomType') as string,
        status: '启用中',
        specialFacilities: []
      });
    }
    
    setShowSpaceModal(false);
  };

  const handleSaveType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addRoomType({
      id: `T${Date.now()}`,
      name: formData.get('name') as string,
      beds: parseInt(formData.get('beds') as string) || 2,
      price: parseInt(formData.get('price') as string) || 3000,
      desc: formData.get('desc') as string || '无特殊说明'
    });
    setShowTypeModal(false);
  };

  const filteredRooms = rooms.filter(r => 
    (selectedFloorId ? r.floorId === selectedFloorId : true) &&
    (searchQuery ? r.roomNo.includes(searchQuery) : true)
  );

  const selectedFloor = floors.find(f => f.id === selectedFloorId);
  const selectedBuildingLabel = selectedFloor ? buildings.find(b => b.id === selectedFloor.buildingId)?.name : '';

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">床位与区域划分</h1>
          <span className="text-sm text-slate-500">统一管理全院楼宇架构、房间类型、床位收费标准等基础数据</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setSpaceType('room'); setShowSpaceModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            新增房间/床位
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 左侧架构树 */}
        <Card className="w-64 border border-slate-200 shadow-sm h-[calc(100vh-220px)] overflow-y-auto shrink-0 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 sticky top-0 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              院区层级架构
            </h3>
            <button 
              onClick={() => { setSpaceType('building'); setShowSpaceModal(true); }}
              className="text-emerald-600 hover:text-emerald-700 p-1 rounded hover:bg-emerald-100 transition-colors"
              title="新增层级"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="space-y-1">
              <div 
                className={`flex items-center gap-2 px-2 py-1.5 rounded font-medium text-sm cursor-pointer ${selectedFloorId === null ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-100 text-slate-800'}`}
                onClick={() => setSelectedFloorId(null)}
              >
                <Layers className="w-4 h-4 text-emerald-500" />
                <span className="flex-1">全部房间</span>
              </div>
              
              {buildings.map(building => (
                <React.Fragment key={building.id}>
                  <div 
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 cursor-pointer font-medium text-sm text-slate-800 group"
                    onClick={() => toggleBuilding(building.id)}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${expandedBuildings[building.id] ? 'rotate-90' : ''}`} />
                    <Home className="w-4 h-4 text-indigo-500" />
                    <span className="flex-1">{building.name}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSpaceType('floor'); setShowSpaceModal(true); }} 
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 p-1"
                      title="新增楼层"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm('确认删除?')) removeBuilding(building.id); }} 
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1"
                      title="删除楼栋"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  {expandedBuildings[building.id] && (
                    <div className="pl-6 space-y-1">
                      {floors.filter(f => f.buildingId === building.id).map(floor => (
                        <div 
                          key={floor.id}
                          className={`flex items-center justify-between px-2 py-1.5 rounded font-medium text-sm cursor-pointer group ${selectedFloorId === floor.id ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-100 text-slate-600'}`}
                          onClick={() => setSelectedFloorId(floor.id)}
                        >
                          <span className="flex-1">{floor.name} {floor.type ? `(${floor.type})` : ''}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSpaceType('room'); setShowSpaceModal(true); }} 
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 p-1"
                            title="新增房间"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                           <button 
                            onClick={(e) => { e.stopPropagation(); if(confirm('确认删除?')) removeFloor(floor.id); }} 
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1"
                            title="删除楼层"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {floors.filter(f => f.buildingId === building.id).length === 0 && (
                        <div className="px-2 py-1 text-xs text-slate-400">暂无楼层</div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>

        {/* 右侧内容区 */}
        <div className="flex-1 flex flex-col gap-4">
           {/* Tab 切换 */}
           <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
              <button 
                onClick={() => setActiveTab('rooms')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'rooms' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >房间列表</button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'settings' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >房型配置与定价</button>
           </div>

           {activeTab === 'rooms' && (
             <Card className="flex-1 border border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-4 px-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">{selectedBuildingLabel} {selectedFloor ? selectedFloor.name : '全部房间'} 列表</CardTitle>
                    <p className="text-xs text-slate-500 mt-1">当前区域共 {filteredRooms.length} 个房间</p>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="搜索房号..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-48 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-100 uppercase">
                      <tr>
                        <th className="px-6 py-4 font-medium">房号</th>
                        <th className="px-6 py-4 font-medium">资源类型</th>
                        <th className="px-6 py-4 font-medium">面积属性</th>
                        <th className="px-6 py-4 font-medium">包含床位</th>
                        <th className="px-6 py-4 font-medium">特殊设施</th>
                        <th className="px-6 py-4 font-medium">状态</th>
                        <th className="px-6 py-4 font-medium text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredRooms.map((room) => {
                        const rType = roomTypes.find(t => t.id === room.roomTypeId);
                        
                        return (
                          <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{room.roomNo}室</td>
                            <td className="px-6 py-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">
                                {rType?.name || '未知房型'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">默认面积</td>
                            <td className="px-6 py-4 font-medium text-emerald-600 cursor-pointer hover:underline">
                              {rType?.beds || 0}张
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1.5">
                                {room.specialFacilities?.map((fac, idx) => (
                                  <span key={idx} title={fac} className="bg-blue-50 text-blue-600 p-1 rounded text-xs px-2">{fac}</span>
                                ))}
                                {(!room.specialFacilities || room.specialFacilities.length === 0) && <span className="text-slate-400 text-xs">暂无</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">{room.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50 transition-colors" title="编辑"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => { if(confirm('确认删除?')) removeRoom(room.id); }} className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors ml-1" title="删除"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredRooms.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                            暂无房间数据，请点击右上角新增房间
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
             </Card>
           )}

           {activeTab === 'settings' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="border border-slate-200">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">长者标准床位费用</h3>
                    <button 
                      onClick={() => setShowTypeModal(true)}
                      className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      + 新增房型
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {roomTypes.map(type => (
                      <div key={type.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg group">
                         <div><div className="font-bold text-slate-800 text-sm">{type.name}</div><div className="text-xs text-slate-500 mt-1">{type.desc}</div></div>
                         <div className="text-right flex items-center gap-3">
                           <div className="text-right"><div className="font-bold text-rose-600">¥ {type.price.toLocaleString()} / 月</div><div className="text-xs text-slate-400 mt-0.5">按床位收费</div></div>
                           <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => { if(confirm('确认删除?')) removeRoomType(type.id); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                    ))}
                  </div>
               </Card>
             </div>
           )}
        </div>
      </div>

      {/* 空间定义 Modal (楼栋/楼层/房间) */}
      {showSpaceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">
                {spaceType === 'building' && '新增楼栋区划'}
                {spaceType === 'floor' && '新增楼层区间'}
                {spaceType === 'room' && '新增房间与床位'}
              </h3>
              <button onClick={() => setShowSpaceModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveSpace}>
              <div className="p-6 space-y-4">
                {spaceType === 'building' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">楼栋名称 *</label>
                      <input name="name" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：D栋、康复中心" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">区域功能备注</label>
                      <input name="note" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：主要用于失能长者" />
                    </div>
                  </>
                )}

                {spaceType === 'floor' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">所属楼栋 *</label>
                      <select name="building" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        {buildings.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">楼层名称 *</label>
                      <input name="floorName" required type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：四层、4F" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">楼层标签定义</label>
                      <select name="floorType" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        <option>自理区 (普通)</option>
                        <option>半护理/介助区</option>
                        <option>重度失能护理区</option>
                        <option>认知症专护区</option>
                      </select>
                    </div>
                  </>
                )}

                {spaceType === 'room' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">所属楼栋</label>
                        <select name="building" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                          {buildings.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">所属楼层</label>
                        <select name="floor" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                          {floors.map(f => (
                            <option key={f.id} value={f.id}>{f.name} ({buildings.find(b => b.id === f.buildingId)?.name})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">房间号 *</label>
                        <input name="roomNo" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如: 106" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">房型及收费标准 *</label>
                        <select name="roomType" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                          {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name} - {rt.price}元/月</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <label className="text-sm font-medium text-slate-700">快速生成床位编号</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
                        系统将根据所选房型自动生成包含的关联床位。
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowSpaceModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> 确认保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 房型配置 Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">定义房型与定价标准</h3>
              <button onClick={() => setShowTypeModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveType}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">房型名称 *</label>
                  <input name="name" type="text" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：六人间 (特护)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">包含床位数 *</label>
                    <input name="beds" type="number" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：6" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">每月基准价格 (按床) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">¥</span>
                      <input name="price" type="number" required className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="2500" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">配套标签 / 设施说明</label>
                   <textarea 
                     name="desc"
                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white resize-none" 
                     rows={3}
                     placeholder="如：中心供氧设备、防压疮气垫床、24小时监控等..."
                   ></textarea>
                </div>
                <div className="space-y-1.5 pt-2">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600" defaultChecked />
                     <span className="text-sm font-medium text-slate-700">允许长者包房 (整包全费用计算)</span>
                   </label>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowTypeModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> 确认保存房型
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

