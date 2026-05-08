import fs from 'fs';
import path from 'path';

class KnowledgeBase {
  constructor() {
    this.knowledgeFiles = [];
    this.index = {};
    this.jobs = [];
    this.resumes = [];
    this.loadKnowledgeFiles();
    this.buildIndex();
    this.loadJobs();
    this.loadResumes();
  }

  loadKnowledgeFiles() {
    const __dirname = path.resolve();
    const mdFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.md'));
    mdFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      const content = fs.readFileSync(filePath, 'utf8');
      this.knowledgeFiles.push({ name: file, content });
    });
  }

  buildIndex() {
    this.knowledgeFiles.forEach((file, fileIndex) => {
      const lines = file.content.split('\n');
      lines.forEach((line, lineIndex) => {
        const words = line.toLowerCase().match(/\b\w+\b/g) || [];
        words.forEach(word => {
          if (!this.index[word]) this.index[word] = [];
          this.index[word].push({ fileIndex, lineIndex, line: line.trim() });
        });
      });
    });
  }

  loadJobs() {
    try {
      const jobsPath = path.resolve('server/data/jobs.json');
      this.jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
    } catch (e) {
      console.warn('Failed to load jobs data:', e.message);
    }
  }

  loadResumes() {
    try {
      const resumePath = path.resolve('server/data/resumes.json');
      if (fs.existsSync(resumePath)) {
        this.resumes = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
      }
    } catch (e) {
      console.warn('Failed to load resume data:', e.message);
    }
  }

  // ————— Chinese-friendly text search —————
  // Split Chinese text into meaningful search tokens
  _tokenize(text) {
    if (!text) return [];
    const str = String(text).toLowerCase();
    const tokens = [];

    // Extract Chinese bigrams (2-char sequences)
    const chineseChars = str.match(/[\u4e00-\u9fff]/g) || [];
    for (let i = 0; i < chineseChars.length - 1; i++) {
      tokens.push(chineseChars[i] + chineseChars[i + 1]);
    }

    // Extract English words / numbers
    const words = str.match(/[a-z0-9]+/g) || [];
    tokens.push(...words);

    return [...new Set(tokens)];
  }

  _scoreTokens(queryTokens, targetTokens) {
    if (!queryTokens.length || !targetTokens.length) return 0;
    let hits = 0;
    for (const qt of queryTokens) {
      if (targetTokens.some(tt => tt.includes(qt) || qt.includes(tt))) hits++;
    }
    return hits / queryTokens.length;
  }

  // ————— Job search —————
  searchJobs(query) {
    const q = String(query).toLowerCase();
    const qTokens = this._tokenize(q);

    // Direct field matching
    const cityMatch = this.jobs.filter(j =>
      String(j.city || '').toLowerCase().includes(q) ||
      q.includes(String(j.city || '').toLowerCase())
    );

    const categoryMatch = this.jobs.filter(j =>
      String(j.category || '').toLowerCase().includes(q) ||
      q.includes(String(j.category || '').toLowerCase())
    );

    // Education & experience hints in query
    const eduMap = { '大专': '大专', '中专': '中专/中技', '本科': '本科', '硕士': '硕士', '博士': '博士', '不限': '不限' };
    const expMap = { '应届': '经验不限', '不限': '经验不限', '1年': '1-3年', '3年': '3-5年', '5年': '5-10年' };

    let matchedEdu = null;
    let matchedExp = null;
    for (const [key, val] of Object.entries(eduMap)) {
      if (q.includes(key)) { matchedEdu = val; break; }
    }
    for (const [key, val] of Object.entries(expMap)) {
      if (q.includes(key)) { matchedExp = val; break; }
    }

    // Score each job
    const scored = this.jobs.map(job => {
      let score = 0;
      const fields = [job.title, job.category, job.city, job.description, ...(job.keywords || [])].filter(Boolean);

      // Token match score
      const fieldTokens = fields.flatMap(f => this._tokenize(f));
      score += this._scoreTokens(qTokens, fieldTokens) * 3;

      // Direct substring matches
      for (const field of fields) {
        if (String(field).toLowerCase().includes(q)) score += 2;
      }

      // City match bonus
      if (job.city && q.includes(job.city.toLowerCase())) score += 5;

      // Category match bonus
      if (job.category && q.includes(job.category.toLowerCase())) score += 4;

      // Education & experience filter match
      if (matchedEdu && job.education === matchedEdu) score += 3;
      if (matchedExp && job.experience === matchedExp) score += 3;

      return { job, score };
    });

    const matched = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    // Return top 15 for aggregation
    return matched.slice(0, 15).map(s => s.job);
  }

  // ————— Resume search —————
  searchResumes(query) {
    const q = String(query).toLowerCase();
    const qTokens = this._tokenize(q);

    const scored = this.resumes.map(r => {
      let score = 0;
      const searchTexts = [
        r.self_desc,
        r.job_intent,
        r.work_history,
        r.experience_years,
        r.education,
        r.location,
      ].filter(Boolean);

      for (const text of searchTexts) {
        if (String(text).toLowerCase().includes(q)) score += 3;
      }

      const fieldTokens = searchTexts.flatMap(t => this._tokenize(t));
      score += this._scoreTokens(qTokens, fieldTokens) * 2;

      // Location match
      if (r.location && q.includes(r.location.replace(/[市省]/g, '').toLowerCase())) score += 4;

      // Education match
      if (r.education && q.includes(r.education.toLowerCase())) score += 3;

      return { resume: r, score };
    });

    return scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map(s => s.resume);
  }

  // ————— Aggregation —————
  aggregateJobs(jobs) {
    if (!jobs.length) return null;

    const total = jobs.length;
    const cities = {};
    const categories = {};
    const allKeywords = [];
    const eduCount = {};
    const expCount = {};
    let salaryMin = Infinity, salaryMax = 0;
    let salaryCount = 0;

    for (const job of jobs) {
      // City
      if (job.city) cities[job.city] = (cities[job.city] || 0) + 1;
      // Category
      if (job.category) categories[job.category] = (categories[job.category] || 0) + 1;
      // Keywords
      if (job.keywords) allKeywords.push(...job.keywords);
      // Education
      if (job.education) eduCount[job.education] = (eduCount[job.education] || 0) + 1;
      // Experience
      if (job.experience) expCount[job.experience] = (expCount[job.experience] || 0) + 1;
      // Salary
      if (job.salary) {
        const nums = job.salary.match(/\d+/g);
        if (nums && nums.length >= 2) {
          salaryMin = Math.min(salaryMin, parseInt(nums[0]));
          salaryMax = Math.max(salaryMax, parseInt(nums[nums.length - 1]));
          salaryCount++;
        }
      }
    }

    // Top keywords
    const keywordFreq = {};
    for (const kw of allKeywords) {
      const clean = kw.trim();
      if (clean.length >= 2) keywordFreq[clean] = (keywordFreq[clean] || 0) + 1;
    }
    const topKeywords = Object.entries(keywordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([k, v]) => `${k}(${v}次)`);

    // Top cities
    const topCities = Object.entries(cities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c, n]) => `${c} ${n}条`);

    // Categories distribution
    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c, n]) => `${c} ${n}条`);

    const eduStr = Object.entries(eduCount)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}条`).join('、');

    const expStr = Object.entries(expCount)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}条`).join('、');

    const salaryStr = salaryCount > 0
      ? `${salaryMin / 1000}K-${salaryMax / 1000}K/月`
      : '薪资数据不足';

    // Compact output (~200 tokens max)
    let result = `【匹配到 ${total} 个相关岗位】\n`;
    if (topCities.length) result += `城市分布：${topCities.join('、')}\n`;
    if (topCategories.length) result += `主要类别：${topCategories.join('、')}\n`;
    result += `薪资范围：${salaryStr}\n`;
    if (eduStr) result += `学历分布：${eduStr}\n`;
    if (expStr) result += `经验分布：${expStr}\n`;
    if (topKeywords.length) result += `高频要求：${topKeywords.join('、')}\n`;

    return result;
  }

  aggregateResumes(resumes) {
    if (!resumes.length) return null;

    const result = [`【匹配到 ${resumes.length} 份相关简历】`];

    for (const r of resumes.slice(0, 3)) {
      const parts = [];
      // Extract target role from job_intent JSON
      let targetRole = '';
      try {
        const intent = JSON.parse(r.job_intent);
        if (intent.length) targetRole = intent[0]['期望职类'] || '';
      } catch {}
      parts.push(`${targetRole || '求职中'} | ${r.experience_years}经验 | ${r.education}`);
      parts.push(r.location);

      // Short self_desc (first 60 chars)
      if (r.self_desc) {
        const firstPoint = r.self_desc.split('\n')[0].replace(/^\d+\.\s*/, '').slice(0, 60);
        parts.push(firstPoint);
      }

      result.push(`  • ${parts.join(' · ')}`);
    }

    if (resumes.length > 3) {
      result.push(`  ...及另外 ${resumes.length - 3} 份`);
    }

    return result.join('\n');
  }

  // ————— Main entry: get all relevant knowledge —————
  getRelevantKnowledge(query) {
    const results = [];

    // 1. Search existing .md knowledge
    const mdResults = this.search(query);
    if (mdResults) {
      const clean = mdResults.replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/^#+\s*/gm, '')
        .replace(/^\s*[-*+]\s*/gm, '')
        .replace(/^\d+\.\s*/gm, '')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1');
      results.push({ type: '知识库', content: clean });
    }

    // 2. Search jobs — only if query looks job-related
    if (this._isJobQuery(query)) {
      const matchedJobs = this.searchJobs(query);
      const jobSummary = this.aggregateJobs(matchedJobs);
      if (jobSummary) results.push({ type: '岗位数据', content: jobSummary });
    }

    // 3. Search resumes — if query is resume/career-related
    if (this._isResumeQuery(query)) {
      const matchedResumes = this.searchResumes(query);
      const resumeSummary = this.aggregateResumes(matchedResumes);
      if (resumeSummary) results.push({ type: '简历案例', content: resumeSummary });
    }

    if (!results.length) return null;

    return results.map(r =>
      `【${r.type}】\n${r.content}`
    ).join('\n\n');
  }

  // ————— Heuristic query type detection (to save tokens) —————
  _isJobQuery(query) {
    const q = String(query).toLowerCase();
    const jobHints = [
      '岗位', '职位', '工作', '招聘', '投递', '求职', '就业',
      '薪资', '工资', '待遇', '钱',
      '要求', '能力', '技能', '学历', '经验', '专业',
      '城市', '杭州', '北京', '上海', '深圳', '广州', '成都',
      '实习', '校招', '社招', '全职', '兼职',
    ];
    return jobHints.some(hint => q.includes(hint));
  }

  _isResumeQuery(query) {
    const q = String(query).toLowerCase();
    const resumeHints = [
      '简历', '面试', '求职', '跳槽', '转行',
      '适合', '匹配', '能找', '可以投',
      '项目', '经历', '经验', '背景',
    ];
    return resumeHints.some(hint => q.includes(hint));
  }

  // ————— Original .md search (unchanged logic) —————
  search(query) {
    const queryWords = query.toLowerCase().match(/\b\w+\b/g) || [];
    const results = {};

    queryWords.forEach(word => {
      if (this.index[word]) {
        this.index[word].forEach(item => {
          const key = `${item.fileIndex}-${item.lineIndex}`;
          if (!results[key]) {
            results[key] = { file: this.knowledgeFiles[item.fileIndex].name, line: item.line, score: 0 };
          }
          results[key].score += 1;
        });
      }
    });

    return Object.values(results).sort((a, b) => b.score - a.score).slice(0, 5).map(r =>
      `[${r.file}] ${r.line}`
    ).join('\n') || null;
  }
}

export default KnowledgeBase;
