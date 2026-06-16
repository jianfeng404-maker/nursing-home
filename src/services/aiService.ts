export async function generateCareReport(elderName: string, careRecords: any[], healthData: any[]) {
  try {
    const prompt = `
      请作为一家高端养老机构的专属健康管家，为家属生成一份本周的【长者关怀周报】。
      语气要温暖、专业、体贴。
      
      长者姓名：${elderName}
      
      近期的照护记录摘要：
      ${JSON.stringify(careRecords)}
      
      近期的生命体征或健康数据：
      ${JSON.stringify(healthData)}
      
      请包含：
      1. 本周生活与陪伴小结（心情、饮食、参与活动等）
      2. 身体健康情况与复测预警研判（重点关注指标是否平稳）
      3. 下周照护重点与建议
      
      返回格式为纯文本，请适当进行排版，不要有过多的格式符号。`;

    const token = localStorage.getItem('token');
    const response = await fetch('/api/ai/generate', {
       method: 'POST',
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
       body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) throw new Error('AI Server responded with error');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Error generating report:", error);
    throw new Error('生成报告时出错，请检查网络或配置。');
  }
}

export async function generateWeeklyMenu(eldersData: any, existingDishes: any) {
  try {
    const prompt = `
      请作为资深养老机构营养师，根据当前院内长者的饮食禁忌和现有的菜单库，生成一份【下周适老化菜谱推荐】。
      
      院内长者饮食画像摘要：
      ${JSON.stringify(eldersData)}
      
      可用菜品库：
      ${JSON.stringify(existingDishes)}
      
      要求：
      1. 兼顾普通膳食、糖尿病餐（无糖/低糖）、低脂低嘌呤、流质/软食等多种需求。
      2. 给出一份简明的排餐建议（例如周一到周日的核心特膳安排）。
      3. 重点对易错的过敏或禁忌给出后厨安全提示。
      
      返回格式为纯文本，排版清晰易读。
    `;

    const token = localStorage.getItem('token');
    const response = await fetch('/api/ai/generate', {
       method: 'POST',
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
       body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) throw new Error('AI Server responded with error');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Error generating menu:", error);
    throw new Error('AI编制菜谱时出错，请检查网络或配置。');
  }
}

export async function analyzeVitalSignsAnomaly(vitalData: any) {
  try {
    const prompt = `
      请作为资深医学与养老大数据分析师，针对以下长者的物联网采集的【近期生命体征数据】进行“异动早筛助手（Anomaly Analysis）”分析。
      
      数据内容（可能包含心率、呼吸、血压、睡眠体动等）：
      ${JSON.stringify(vitalData)}
      
      要求：
      1. 分析数据中潜在的异常波动（例如夜间呼吸暂停、心率飙升、夜间离床等）。
      2. 给出前瞻性的健康风险预警提示（如心血管隐患预警、跌倒风险提示等）。
      3. 给出护理站干预建议。
      
      输出结果应简明扼要，控制在300字内，分点列出。
    `;

    const token = localStorage.getItem('token');
    const response = await fetch('/api/ai/generate', {
       method: 'POST',
       headers: { 
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
       },
       body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) throw new Error('AI Server responded with error');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Error analyzing anomaly:", error);
    throw new Error('分析异动时出错，请检查配置。');
  }
}
