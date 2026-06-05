import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add middleware to parse JSON using express.json()
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "智能颐养平台后端服务已启动" });
  });

  // Set up mock data to serve via API
  let elders = [
  { id: '1', name: '王桂珍', room: 'A栋-101', age: 78, gender: '女', careLevel: '二级护理', healthStatus: '高血压', admissionDate: '2023-05-12' },
  { id: '2', name: '钱德明', room: 'B栋-205', age: 82, gender: '男', careLevel: '特级护理', healthStatus: '糖尿病, 行动不便', admissionDate: '2022-11-08' },
  { id: '3', name: '吴秀兰', room: 'A栋-102', age: 76, gender: '女', careLevel: '三级护理', healthStatus: '心血管疾病', admissionDate: '2021-03-20' },
  { id: '4', name: '冯国强', room: 'A栋-101', age: 85, gender: '男', careLevel: '一级护理', healthStatus: '阿尔茨海默症早期表现', admissionDate: '2022-08-15' },
  { id: '5', name: '楚玉英', room: 'A栋-102', age: 72, gender: '女', careLevel: '三级护理', healthStatus: '一般', admissionDate: '2024-01-10' },
  { id: '6', name: '卫广平', room: 'A栋-103', age: 88, gender: '男', careLevel: '特级护理', healthStatus: '冠心病，常年卧床', admissionDate: '2020-12-05' },
  { id: '7', name: '蒋雪梅', room: 'A栋-201', age: 69, gender: '女', careLevel: '三级护理', healthStatus: '骨质疏松，视力不佳', admissionDate: '2023-07-22' },
  { id: '8', name: '沈建设', room: 'A栋-201', age: 74, gender: '男', careLevel: '二级护理', healthStatus: '慢性支气管炎', admissionDate: '2023-09-01' },
  { id: '9', name: '韩佩云', room: 'A栋-202', age: 81, gender: '女', careLevel: '一级护理', healthStatus: '中风后遗症，偏瘫', admissionDate: '2021-10-18' },
  { id: '10', name: '杨德培', room: 'A栋-203', age: 79, gender: '男', careLevel: '二级护理', healthStatus: '帕金森综合症', admissionDate: '2022-04-30' },
  { id: '11', name: '朱金凤', room: 'A栋-105', age: 75, gender: '女', careLevel: '二级护理', healthStatus: '糖尿病', admissionDate: '2023-11-12' },
  { id: '12', name: '秦振宇', room: 'A栋-105', age: 80, gender: '男', careLevel: '一级护理', healthStatus: '高血压、脑梗后遗症', admissionDate: '2022-02-28' },
  { id: '13', name: '尤秋叶', room: 'A栋-202', age: 77, gender: '女', careLevel: '三级护理', healthStatus: '一般', admissionDate: '2024-03-05' },
  { id: '14', name: '许万才', room: 'B栋-205', age: 86, gender: '男', careLevel: '特级护理', healthStatus: '长期卧床、需要全面护理', admissionDate: '2021-08-20' },
  { id: '15', name: '吕淑芳', room: 'A栋-103', age: 71, gender: '女', careLevel: '自理护理', healthStatus: '骨关节炎', admissionDate: '2024-05-18' },
  { id: '16', name: '张宝林', room: 'B栋-201', age: 84, gender: '男', careLevel: '二级护理', healthStatus: '前列腺增生，轻度认知衰退', admissionDate: '2022-01-20' },
  { id: '17', name: '曹翠屏', room: 'C栋-302', age: 89, gender: '女', careLevel: '特级护理', healthStatus: '老年病综合征，营养不良', admissionDate: '2020-03-10' },
  { id: '18', name: '孔祥辉', room: 'A栋-203', age: 73, gender: '男', careLevel: '一级护理', healthStatus: '痛风，下肢静脉曲张', admissionDate: '2023-08-05' },
  { id: '19', name: '施玉英', room: 'B栋-202', age: 81, gender: '女', careLevel: '二级护理', healthStatus: '轻度贫血，骨质疏松', admissionDate: '2023-12-11' },
  { id: '20', name: '华志明', room: 'C栋-301', age: 78, gender: '男', careLevel: '自理护理', healthStatus: '健康状况良好，高血脂', admissionDate: '2024-06-01' },
  ];

  let alerts = [
    { id: "ALT-001", type: "fall", title: "发生跌倒告警", location: "102-1", resident: "吴秀兰", device: "毫米波雷达", time: "2分钟前", level: "critical", status: 'pending' },
    { id: "ALT-002", type: "sos", title: "紧急呼叫告警", location: "101-1", resident: "王桂珍", device: "床头呼叫器", time: "刚刚", level: "critical", status: 'pending' },
  ];

  let tasks = [
    { id: '1', name: '辅助服药 (降压药)', elder: '王桂珍 (A栋-101)', time: '10:30', staff: '待指派', status: 'pending', type: 'medical' },
    { id: '2', name: '协助沐浴', elder: '钱德明 (B栋-205)', time: '14:00', staff: '赵铁柱', status: 'in_progress', type: 'care' },
    { id: '3', name: '环境消杀', elder: '公共区域', time: '16:00', staff: '罗大牛', status: 'pending', type: 'cleaning' },
  ];

  // Example API route for dashboard overview stats
  app.get("/api/stats", (req, res) => {
    const totalBeds = 120;
    const occupiedBeds = elders.length;
    res.json({
      occupiedBeds: occupiedBeds,
      freeBeds: totalBeds - occupiedBeds,
      occupancyRate: Math.round((occupiedBeds / totalBeds) * 100),
      totalTasks: tasks.length,
      taskCompletionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0,
      pendingAlertsCount: alerts.filter(a => a.status === 'pending').length,
      criticalAlertsCount: alerts.filter(a => a.status === 'pending' && a.level === 'critical').length,
    });
  });

  // API endpoints for elders
  app.get("/api/elders", (req, res) => {
    res.json(elders);
  });

  // API endpoints for tasks
  app.get("/api/tasks", (req, res) => {
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const newTask = {
      id: `T-${Date.now()}`,
      ...req.body
    };
    tasks.push(newTask);
    res.json(newTask);
  });

  app.put("/api/tasks/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, staff } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      if (status !== undefined) tasks[taskIndex].status = status;
      if (staff !== undefined) tasks[taskIndex].staff = staff;
      res.json(tasks[taskIndex]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  });

  // API endpoints for alerts
  app.get("/api/alerts", (req, res) => {
    res.json(alerts);
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? { overlay: false } : false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
