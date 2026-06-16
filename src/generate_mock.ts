import { db } from './db/index.ts';
import { eq } from 'drizzle-orm';
import { elders, iotDevices, alerts, tasks, customerArchives } from './db/schema.ts';
import crypto from 'crypto';

const randomElderNames = ["赵德发", "钱万国", "孙秀芳", "李建国", "周明德", "吴玉兰", "郑大庆", "王宝琴", "冯振国", "陈淑珍", "褚建强", "卫爱萍", "蒋宏伟", "沈彩霞", "韩大明", "杨翠花", "朱伯伯", "秦大妈", "尤大爷", "许阿姨", "何守信", "吕布", "施美丽", "郭静", "张宏斌"];
const rooms = ["A栋-101", "A栋-102", "A栋-103", "B栋-201", "B栋-202", "B栋-205", "C栋-301", "C栋-302"];
const careLevels = ["一级护理", "二级护理", "三级护理", "特级护理", "自理"];
const health = ["冠心病", "糖尿病", "高血压", "阿尔茨海默症早期", "骨质疏松", "健康"];
const status = ["在院", "请假", "出院"];

async function run() {
  console.log("Generating elders...");
  let currentElders = await db.select().from(elders);
  const toCreate = 45 - currentElders.length;
  if(toCreate > 0) {
    let newElders = [];
    for(let i=0; i<toCreate; i++) {
      const e = {
        id: "ELD-200" + i,
        name: randomElderNames[i % randomElderNames.length] + "-" + i,
        room: rooms[Math.floor(Math.random() * rooms.length)],
        age: 60 + Math.floor(Math.random() * 30),
        gender: Math.random() > 0.5 ? "男" : "女",
        careLevel: careLevels[Math.floor(Math.random() * careLevels.length)],
        healthStatus: health[Math.floor(Math.random() * health.length)],
        admissionDate: "2024-0" + (1+Math.floor(Math.random() * 8)) + "-12",
        avatar: "https://i.pravatar.cc/150?u=ELD-300" + i,
        face: Math.random() > 0.5,
        fingerprint: Math.random() > 0.5,
        doors: ["园区正大门"]
      };
      newElders.push(e);
    }
    await db.insert(elders).values(newElders).onConflictDoNothing();
    currentElders = await db.select().from(elders);
  }

  console.log("Generating IoT devices...");
  await db.delete(iotDevices); // clear
  const newDevices = [];
  const types = ["毫米波雷达", "智能床垫", "SOS终端", "智能手环"];
  const devStatus = ["online", "online", "online", "online", "offline", "alerting"];
  for(let i=0; i<30; i++) {
    const elder = currentElders[Math.floor(Math.random() * currentElders.length)];
    newDevices.push({
      id: "DEV-100" + i,
      sn: "SN-DEV-100" + i,
      name: elder.name + "的" + types[i % types.length],
      type: types[i % types.length],
      status: devStatus[Math.floor(Math.random() * devStatus.length)],
      elderId: elder.id,
      elder: elder.name,
      room: elder.room,
      lastActive: "刚刚",
      ip: "192.168.1." + (100 + i)
    });
  }
  await db.insert(iotDevices).values(newDevices).onConflictDoNothing();

  console.log("Generating ALERTS...");
  await db.delete(alerts);
  const newAlerts = [];
  for(let i=0; i<20; i++) {
    const elder = currentElders[Math.floor(Math.random() * currentElders.length)];
    newAlerts.push({
      id: "ALT-500" + i,
      level: Math.random()>0.7?"critical":(Math.random()>0.5?"warning":"info"),
      type: Math.random()>0.5?"跌倒监测":"生命体征异常",
      title: "设备告警",
      elderId: elder.id,
      resident: elder.name,
      location: elder.room,
      device: "智能设备",
      content: "系统检测到异常情况",
      time: "2024-09-08 10:00:00",
      status: Math.random()>0.3?"pending":"resolved",
      handler: "张护工"
    });
  }
  await db.insert(alerts).values(newAlerts).onConflictDoNothing();

  console.log("Generating tasks...");
  await db.delete(tasks);
  const newTasks = [];
  for(let i=0; i<50; i++) {
     const elder = currentElders[Math.floor(Math.random() * currentElders.length)];
     newTasks.push({
       id: crypto.randomUUID(),
       elderId: elder.id,
       elder: elder.name,
       room: elder.room,
       name: Math.random()>0.5?"晨间用药协助":"物理康复训练",
       time: ["08:00", "09:30", "14:00", "16:00"][Math.floor(Math.random()*4)],
       level: Math.random()>0.8?"high":"normal",
       staff: "李护工",
       type: "护理",
       status: Math.random()>0.4?"completed":"pending"
     });
  }
  await db.insert(tasks).values(newTasks).onConflictDoNothing();

  console.log("Generating customer archives...");
  await db.delete(customerArchives);
  let newCustomers = [];
  const cNames = ["马老太", "高大爷", "牛建国", "方淑兰", "侯大明", "常秀芳"];
  for(let i=0; i<15; i++) {
     newCustomers.push({
       id: "CA-900" + i,
       name: cNames[i % cNames.length] + "-" + i,
       age: 65 + Math.floor(Math.random() * 20),
       gender: Math.random() > 0.5 ? "男" : "女",
       status: ["已交定金", "初次咨询", "意向强烈"][Math.floor(Math.random()*3)],
       careLevel: "意向二级",
       familyContact: "儿子",
       phone: "13800138000",
       date: "2024-09-12",
       idCard: "110101195001019999",
       bedInfo: "A栋101",
       agreementStatus: "normal"
     });
  }
  await db.insert(customerArchives).values(newCustomers).onConflictDoNothing();

  console.log("Done generating massive demo data!");
  process.exit(0);
}

run();
