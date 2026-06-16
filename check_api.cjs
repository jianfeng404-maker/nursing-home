const http = require("http");
const reqs = ["elders", "staff", "beds", "tasks", "alerts", "care_records", "rehab_plans", "rounds", "inventory", "admissions", "discharges", "bills", "insurance_claims", "sys_users", "sys_roles", "iot_devices", "care_plans", "assessments", "schedules", "transactions", "buildings", "floors", "rooms", "room_types", "care_levels", "service_items", "nursing_stations", "customer_archives", "agreements", "inventory_audits"];
reqs.forEach(r => http.get("http://localhost:3000/api/" + r, {headers: {Authorization: "Bearer admin"}}, (res) => {
  if (res.statusCode >= 400 && res.statusCode !== 401) console.log(r, res.statusCode);
}));
setTimeout(() => process.exit(0), 1000);
