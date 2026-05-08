import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import KnowledgeBase from './knowledge.js';
import UserManager from './users.js';
import { getDb } from './db.js';

dotenv.config({ path: path.resolve('.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const userManager = new UserManager();
const knowledgeBase = new KnowledgeBase();

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = (process.env.SILICONFLOW_API_KEY || '').replace(/^['"]|['"]$/g, '');
const JOBS_PATH = path.resolve('server/data/jobs.json');

const loadJobs = () => {
  try {
    return JSON.parse(fs.readFileSync(JOBS_PATH, 'utf-8'));
  } catch (error) {
    console.warn('Failed to load jobs data:', error.message);
    return [];
  }
};

const jobs = loadJobs();

// 初始化 SQLite 数据库
getDb();

const includesText = (value, keyword) => String(value || '').toLowerCase().includes(keyword);

const getUniqueValues = (items, key) => (
  [...new Set(items.map(item => item[key]).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'zh-CN'))
);

const getJobAnalysis = (job) => {
  const keywords = Array.isArray(job.keywords) ? job.keywords.filter(Boolean) : [];
  const lowBarrier = job.experience.includes('经验不限') || job.experience.includes('不限');
  const needsPortfolio = /设计|美工|手绘|视觉|视频|剪辑|运营|编辑/.test(`${job.category}${job.title}${keywords.join('')}`);
  const needsCommunication = /销售|运营|行政|客服|主管|经理|市场|推广/.test(`${job.category}${job.title}${job.description}`);
  const coreKeywords = keywords.slice(0, 8);

  return {
    fitTags: [
      lowBarrier ? '适合应届生或转岗探索' : `更适合${job.experience}背景`,
      `${job.education || '学历不限'}门槛`,
      job.city ? `${job.city}本地机会` : '城市不限',
      needsPortfolio ? '建议准备作品集' : '建议准备项目案例',
    ],
    requirements: [
      job.education ? `学历要求：${job.education}` : '学历要求未明确',
      job.experience ? `经验要求：${job.experience}` : '经验要求未明确',
      coreKeywords.length ? `关键词：${coreKeywords.join('、')}` : '关键词信息较少，需要结合职位描述判断',
    ],
    hiddenSignals: [
      needsPortfolio ? '岗位描述里强调作品、视觉或内容产出，简历里要放可验证的作品链接或项目成果。' : '岗位更看重职责匹配度，简历里要突出和岗位任务相近的项目经历。',
      needsCommunication ? '岗位包含对接、客户、运营或管理场景，沟通协作能力需要在经历中体现。' : '岗位更偏专业执行，需要把工具、流程和结果写具体。',
      lowBarrier ? '经验门槛较低，但会更看重学习能力、稳定性和执行细节。' : '经验门槛不低，建议用量化成果证明熟练度。',
    ],
    targetAudience: [
      lowBarrier ? '正在找第一份实习、兼职或入门岗位的学生。' : `已经有${job.experience}相关经历，想继续在同类岗位发展的人。`,
      needsPortfolio ? '有作品集、课程项目、社团作品或商业项目沉淀的人。' : '能把过往项目拆成目标、动作、结果并讲清楚的人。',
      job.city ? `能接受在${job.city}工作或通勤的人。` : '对工作城市比较灵活的人。',
    ],
    preparation: [
      `简历标题和求职意向优先贴近“${job.category || job.title}”。`,
      coreKeywords.length ? `经历描述中自然覆盖 ${coreKeywords.slice(0, 5).join('、')} 等关键词。` : '先从职位描述中提炼 4-6 个核心技能词，再重写经历。',
      needsPortfolio ? '准备 3-5 个代表作品，说明目标、过程、工具和结果。' : '准备 2-3 个项目案例，用任务、行动、结果的结构表达。',
      '面试前整理岗位职责对应的自我介绍，避免只泛泛介绍个人经历。',
    ],
    interviewPrep: [
      `准备一个 1 分钟版本的自我介绍，结尾明确表达对“${job.title}”的兴趣。`,
      coreKeywords.length ? `围绕 ${coreKeywords.slice(0, 3).join('、')} 各准备一个经历案例。` : '围绕岗位职责准备 2-3 个经历案例。',
      needsPortfolio ? '面试时按作品背景、个人负责部分、最终效果来讲，不只展示图片。' : '面试回答尽量量化结果，例如效率提升、成交数量、阅读量、故障率等。',
    ],
  };
};

const SYSTEM_PROMPT = `你是“求职领航小鹿”，一个专为大学生提供求职辅助的 AI 助手。你的职责包括：
1. 职业规划建议：帮助用户分析职业方向，制定求职策略
2. 简历优化建议：提供简历撰写和优化建议
3. 面试技巧指导：分享面试技巧和常见问题回答思路
4. 行业信息咨询：提供不同行业和岗位的基础信息与洞察
5. 求职心理支持：鼓励和安抚用户，帮助用户保持积极状态
请用友好、专业、温暖的语气回答问题。如果不确定某些信息，请诚实告知用户。`;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '求职领航小鹿服务正在运行中' });
});

app.get('/api/jobs', (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const city = String(req.query.city || '').trim();
  const category = String(req.query.category || '').trim();
  const education = String(req.query.education || '').trim();
  const limit = Math.min(Number(req.query.limit) || 60, 250);

  let filtered = jobs;

  if (search) {
    filtered = filtered.filter(job => (
      includesText(job.title, search)
      || includesText(job.category, search)
      || includesText(job.company, search)
      || includesText(job.city, search)
      || includesText(job.description, search)
      || job.keywords.some(keyword => includesText(keyword, search))
    ));
  }

  if (city) {
    filtered = filtered.filter(job => job.city === city);
  }

  if (category) {
    filtered = filtered.filter(job => job.category === category);
  }

  if (education) {
    filtered = filtered.filter(job => job.education === education);
  }

  res.json({
    total: filtered.length,
    jobs: filtered.slice(0, limit).map(job => ({
      ...job,
      description: job.description.length > 180 ? `${job.description.slice(0, 180)}...` : job.description,
    })),
    filters: {
      cities: getUniqueValues(jobs, 'city'),
      categories: getUniqueValues(jobs, 'category'),
      educations: getUniqueValues(jobs, 'education'),
    },
  });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(item => item.id === Number(req.params.id));

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    ...job,
    analysis: getJobAnalysis(job),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, jobContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!API_KEY) {
      return res.status(500).json({ error: 'SiliconFlow API key not configured' });
    }

    const userMessage = messages[messages.length - 1]?.content;
    let enhancedSystemPrompt = SYSTEM_PROMPT;

    if (userMessage) {
      const relevantKnowledge = knowledgeBase.getRelevantKnowledge(userMessage);
      if (relevantKnowledge) {
        enhancedSystemPrompt += `\n\n以下是相关的知识库信息，请基于这些信息回答问题：\n${relevantKnowledge}`;
      }
    }

    if (jobContext?.title) {
      enhancedSystemPrompt += `\n\n当前用户正在咨询这个岗位，请优先围绕该岗位回答：
职位名称：${jobContext.title}
职类：${jobContext.category || '未提供'}
薪资：${jobContext.salary || '未提供'}
经验要求：${jobContext.experience || '未提供'}
学历要求：${jobContext.education || '未提供'}
城市：${jobContext.city || '未提供'}
公司：${jobContext.company || '未提供'}
关键词：${Array.isArray(jobContext.keywords) ? jobContext.keywords.join('、') : ''}
岗位描述：${String(jobContext.description || '').slice(0, 1200)}`;
    }

    const response = await axios.post(
      SILICONFLOW_API_URL,
      {
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages: [
          { role: 'system', content: enhancedSystemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    let assistantMessage = response.data.choices[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    assistantMessage = assistantMessage
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s*/gm, '')
      .replace(/^\s*[-*+]\s*/gm, '• ')
      .replace(/^\s*\d+\s*[\.\)\]、）]\s*/gm, '• ')
      .replace(/^\s*\d+\s*$/gm, '')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    res.json({
      message: assistantMessage,
      usage: response.data.usage,
    });
  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data?.error?.message || 'Failed to get response from AI',
    });
  }
});

app.post('/api/register', (req, res) => {
  try {
    const { nickname, grade, school, major, email, phone, password } = req.body;

    if (!nickname || !grade || !school || !major || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!email) {
      return res.status(400).json({ error: 'Email is required for login' });
    }

    if (userManager.findUserByEmail(email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    if (phone && userManager.findUserByPhone(phone)) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    const newUser = userManager.createUser({
      nickname,
      grade,
      school,
      major,
      email,
      phone,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser.id,
        nickname: newUser.nickname,
        grade: newUser.grade,
        school: newUser.school,
        major: newUser.major,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = userManager.validateUser(identifier, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        nickname: user.nickname,
        grade: user.grade,
        school: user.school,
        major: user.major,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 生产环境：托管前端静态文件
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA 回退：非 API 路由返回 index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next();
    });
  });
}

// 仅在非 Vercel 环境启动 HTTP 服务
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`求职领航小鹿后端服务已启动，运行在 http://localhost:${PORT}`);
    console.log(`岗位库加载完成，共 ${jobs.length} 条岗位`);
    if (!API_KEY) {
      console.warn('未设置 SILICONFLOW_API_KEY，AI 功能暂不可用');
    }
  });
}

export default app;
