import React, { useState } from 'react';
import axios from 'axios';
import DeerLogo from './components/DeerLogo';
import RadarChart from './components/RadarChart';
import { COLORS } from './constants/colors';
import { ensureAppStyles } from './utils/ensureAppStyles';
import { 
  Compass, 
  MessageSquare, 
  UserCircle, 
  TrendingUp, 
  Award,
  Search,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  Plus,
  Filter,
  Mic,
  Clock,
  Play,
  ArrowLeft,
  ChevronDown,
  FileText
} from 'lucide-react';

ensureAppStyles();

const sanitizeChatContent = (content) => {
  if (typeof content !== 'string') return '';

  return content
    .replace(/^\s*(assistant|user|system)\s*:?\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const App = () => {
  const [view, setView] = useState('landing');
  const [avatarSeed, setAvatarSeed] = useState('Deer1');


  const handleRandomAvatar = () => setAvatarSeed(Math.random().toString(36).substring(7));

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif', overflow: 'hidden', userSelect: 'none', backgroundColor: COLORS.bg, color: COLORS.text }}>
      {view === 'landing' && <LandingView onStart={() => setView('authSelect')} />}
      {view === 'authSelect' && <AuthSelectView onRegister={() => setView('register')} onLogin={() => setView('login')} />}
      {view === 'register' && (
        <RegisterView 
          avatarSeed={avatarSeed}
          onRandom={handleRandomAvatar}
          onNext={() => setView('login')}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'login' && (
        <LoginView 
          avatarSeed={avatarSeed}
          onBack={() => setView('register')}
          onFinish={() => setView('dashboard')} 
        />
      )}
      {view === 'dashboard' && (
        <DashboardView avatarSeed={avatarSeed} />
      )}
    </div>
  );
};

// --- 页面组件 ---

const LandingView = ({ onStart }) => (
  <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <DeerLogo size={120} style={{ marginBottom: '24px', animation: 'bounce 2s infinite' }} />
    <div style={{ backgroundColor: 'white', borderRadius: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center', border: '6px solid', borderColor: COLORS.header }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'black', marginBottom: '32px', letterSpacing: '4px' }}>大学森 · 求职鹿</h1>
      <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.header }}>大学森求职鹿，你的专属求职陪伴小助手。</p>
      <p style={{ opacity: '0.8', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto', fontStyle: 'italic' }}>从自我认知、岗位探索到求职答疑，帮助大学生更有方向地迈出每一步。</p>
    </div>
    <button onClick={onStart} style={{ marginTop: '48px', backgroundColor: 'white', borderRadius: '50px', padding: '20px 48px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '24px', border: '4px solid', borderColor: COLORS.text, cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <span style={{ fontSize: '24px', fontWeight: 'black' }}>跟着小鹿一起开始体验吧</span>
      <div style={{ width: '64px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', backgroundColor: COLORS.text }}><ArrowRight /></div>
    </button>
  </div>
);

const AuthSelectView = ({ onRegister, onLogin }) => (
  <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <DeerLogo size={80} style={{ marginBottom: '32px', animation: 'bounce 2s infinite' }} />
    <div style={{ backgroundColor: 'white', borderRadius: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center', border: '6px solid', borderColor: COLORS.header, maxWidth: '500px', width: '100%' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'black', marginBottom: '32px' }}>开启你的求职旅程</h2>
      <p style={{ opacity: '0.8', lineHeight: '1.6', marginBottom: '48px' }}>选择以下方式进入系统</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button onClick={onRegister} style={{ backgroundColor: '#949545', color: 'white', borderRadius: '20px', padding: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease', border: 'none', fontSize: '18px' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          新用户注册
        </button>
        <button onClick={onLogin} style={{ backgroundColor: 'transparent', color: COLORS.text, borderRadius: '20px', padding: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease', border: '2px solid', borderColor: COLORS.text, fontSize: '18px' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          已有账号登录
        </button>
      </div>
    </div>
  </div>
);

const RegisterView = ({ avatarSeed, onRandom, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    nickname: '',
    grade: '',
    school: '',
    major: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onNext();
      } else {
        setError(data.error || '注册失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '40px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '8px solid', borderColor: COLORS.accent, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><ArrowLeft size={24} /></button>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.4', marginBottom: '32px', fontStyle: 'italic', letterSpacing: '4px' }}>求职鹿注册</h2>
        <div style={{ width: '128px', height: '128px', margin: '0 auto 32px', borderRadius: '50%', border: '4px dashed', borderColor: COLORS.primary, overflow: 'hidden' }}>
          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
        </div>
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '32px' }}>
          <input 
            placeholder="昵称" 
            value={formData.nickname}
            onChange={(e) => handleChange(e, 'nickname')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="年级" 
            value={formData.grade}
            onChange={(e) => handleChange(e, 'grade')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="学校" 
            value={formData.school}
            onChange={(e) => handleChange(e, 'school')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="专业" 
            value={formData.major}
            onChange={(e) => handleChange(e, 'major')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="邮箱（必填，用于登录）" 
            value={formData.email}
            onChange={(e) => handleChange(e, 'email')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="手机号（可选）" 
            value={formData.phone}
            onChange={(e) => handleChange(e, 'phone')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            type="password" 
            placeholder="密码" 
            value={formData.password}
            onChange={(e) => handleChange(e, 'password')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#724412', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.3s ease', opacity: loading ? 0.6 : 1 }} 
          onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.1)')} 
          onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? <div style={{ width: '24px', height: '24px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={32} />}
        </button>
      </div>
    </div>
  );
};

const LoginView = ({ onFinish, onBack }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // 保存用户信息到本地存储
        localStorage.setItem('user', JSON.stringify(data.user));
        onFinish();
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '40px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '8px solid', borderColor: COLORS.header, textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.4', marginBottom: '32px' }}>登录解锁身份</h2>
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <input 
            placeholder="邮箱 / 手机号 / 测试账号 123" 
            value={formData.identifier}
            onChange={(e) => handleChange(e, 'identifier')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', marginBottom: '16px' }} 
          />
          <input 
            type="password" 
            placeholder="密码" 
            value={formData.password}
            onChange={(e) => handleChange(e, 'password')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', marginBottom: '16px' }} 
          />
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          style={{ width: '100%', padding: '16px', backgroundColor: '#949545', color: 'white', borderRadius: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.3s ease', border: 'none', opacity: loading ? 0.6 : 1 }} 
          onMouseOver={(e) => !loading && (e.currentTarget.style.opacity = '0.9')} 
          onMouseOut={(e) => !loading && (e.currentTarget.style.opacity = '1')}
        >
          {loading ? '登录中...' : '开启求职之旅'}
        </button>
        <button onClick={onBack} style={{ marginTop: '16px', fontSize: '14px', opacity: '0.4', width: '100%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>返回修改</button>
      </div>
    </div>
  );
};

const DashboardView = ({ avatarSeed }) => {
  const [currentPage, setCurrentPage] = useState('analyst');
  const [showCompletedList, setShowCompletedList] = useState(false);
  const [showQuestFlow, setShowQuestFlow] = useState(false);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  const [userData, setUserData] = useState(null);
  const [jobAssistantContext, setJobAssistantContext] = useState(null);

  const navItems = [
    { id: 'analyst', label: '求职分析师', icon: Compass },
    { id: 'forum', label: '职场讨论天地', icon: MessageSquare },
    { id: 'assistant', label: '求职答疑小鹿', icon: UserCircle },
    { id: 'trajectory', label: '成长轨迹', icon: TrendingUp },
  ];

  const renderContent = () => {
    if (showAnalysisReport) return <AnalysisReportPage onBack={() => setShowAnalysisReport(false)} userData={userData} />;
    if (showQuestFlow) return <QuestFlow onFinish={(data) => { setUserData(data); setShowAnalysisReport(true); }} />;
    if (showCompletedList) return <CompletedListPage onBack={() => setShowCompletedList(false)} />;
    
    switch (currentPage) {
      case 'analyst': return <JobAnalystPage onStartQuest={() => setShowQuestFlow(true)} onAskJob={(job) => {
        setJobAssistantContext(job);
        setShowCompletedList(false);
        setShowQuestFlow(false);
        setShowAnalysisReport(false);
        setCurrentPage('assistant');
      }} />;
      case 'forum': return <ForumPage />;
      case 'assistant': return <AIAssistantPage avatarSeed={avatarSeed} jobContext={jobAssistantContext} />;
      case 'trajectory': return <TrajectoryPage onOpenList={() => setShowCompletedList(true)} />;
      default: return null;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px', overflow: 'hidden' }}>
      <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '50px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', position: 'relative', border: '8px solid', borderColor: COLORS.accent, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
          {renderContent()}
        </div>

        <div style={{ height: '96px', backgroundColor: 'white', borderTop: '4px solid', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', gap: '24px', padding: '0 40px' }}>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', alignItems: 'center' }}>
            {navItems.map(item => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id && !showCompletedList && !showQuestFlow && !showAnalysisReport;
              return (
                <button 
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setShowCompletedList(false);
                    setShowQuestFlow(false);
                    setShowAnalysisReport(false);
                  }}
                  style={{
                    width: '100%',
                    minWidth: 0,
                    padding: '12px 20px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    border: '2px solid',
                    backgroundColor: isActive ? COLORS.primary : 'transparent',
                    color: isActive ? 'white' : '#999',
                    borderColor: isActive ? COLORS.text : 'transparent',
                    boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <IconComponent size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
          <button style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px solid', borderColor: COLORS.header, overflow: 'hidden', backgroundColor: '#f9f9f9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
            <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`} alt="user" style={{ width: '100%', height: '100%' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 鎴愰暱杞ㄨ抗鏍?(TrajectoryPage) ---
const TrajectoryPage = ({ onOpenList }) => {
  const [selectedYear, setSelectedYear] = useState(null);

  const years = ['大一', '大二', '大三', '大四'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease', overflow: 'visible', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: '#FDFBF2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'black', fontStyle: 'italic', border: '2px solid', borderColor: '#724412' }}>logo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <DeerLogo size={40} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '4px', border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
           <div style={{ backgroundColor: 'white', padding: '12px 24px', borderRadius: '20px', border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
              <p style={{ fontWeight: 'bold', fontSize: '14px' }}>把每一次成长记录下来吧，会解锁一些小惊喜。</p>
              <div style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', backgroundColor: 'white', borderLeft: '2px solid #f0f0f0', borderBottom: '2px solid #f0f0f0', transform: 'translateY(-50%) rotate(45deg)' }}></div>
           </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '40px', minHeight: '0', position: 'relative' }}>
        {/* 左侧垂直时间轴 */}
        <div style={{ width: '192px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingLeft: '40px', borderLeft: '4px dashed', borderColor: '#E3CB8F', position: 'relative', paddingTop: '40px', paddingBottom: '40px' }}>
          {years.map((year) => (
            <div 
              key={year} 
              onClick={() => setSelectedYear(year)}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '4px solid', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'absolute', left: '-54px', transition: 'all 0.3s ease', transform: selectedYear === year ? 'scale(1.25)' : 'scale(1)', borderColor: selectedYear === year ? '#724412' : '#E3CB8F' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#949545'} onMouseOut={(e) => e.currentTarget.style.borderColor = selectedYear === year ? '#724412' : '#E3CB8F'}></div>
              <span style={{ fontSize: '32px', fontWeight: 'black', transition: 'all 0.3s ease', color: selectedYear === year ? '#949545' : 'rgba(0,0,0,0.2)', transform: selectedYear === year ? 'scale(1.1)' : 'scale(1)' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'} onMouseOut={(e) => e.currentTarget.style.opacity = selectedYear === year ? '1' : '0.2'}>{year}</span>
            </div>
          ))}
        </div>

        {/* 中间弹出详情 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selectedYear ? (
            <div style={{ width: '450px', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', animation: 'zoomIn 0.3s ease', position: 'relative' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'black', textAlign: 'center', marginBottom: '32px' }}>{selectedYear} 篇章</h3>
              <div style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
                {['证书', '社团组织', '实习'].map(label => (
                  <div key={label} style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: '#724412', fontWeight: 'black', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                    {label}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', opacity: '0.1' }}>
                <DeerLogo size={60} />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', opacity: '0.2' }}>
              <Compass size={120} style={{ margin: '0 auto 16px', animation: 'spin 8s linear infinite' }} />
              <p style={{ fontWeight: 'black', fontSize: '24px', letterSpacing: '4px' }}>点击年份查看轨迹</p>
            </div>
          )}
        </div>

        {/* 右侧功能区 */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '40px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '35px', border: '4px solid', borderColor: COLORS.text, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
             <div style={{ width: '64px', height: '64px', backgroundColor: '#FDFBF2', borderRadius: '50%', border: '2px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <Mic style={{ color: '#D6B767' }} />
             </div>
             <span style={{ fontWeight: 'black', fontSize: '20px' }}>语音记录</span>
             <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f9f9f9', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}>
               面试追踪 <ArrowRight size={14} />
             </button>
          </div>

          <button 
            onClick={onOpenList}
            style={{ width: '100%', backgroundColor: 'white', borderRadius: '35px', border: '4px solid', borderColor: COLORS.text, padding: '32px', fontWeight: 'black', fontSize: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} 
          >
            成长清单
          </button>

          <div style={{ backgroundColor: '#FAF3E0', borderRadius: '30px', border: '4px dashed', borderColor: COLORS.primary, padding: '24px', textAlign: 'center', fontWeight: 'black', color: '#949545', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            领取专属大学森鹿卡
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', opacity: '0.6' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '2px' }}>小惊喜：这些经历后续可以一键生成简历内容或个人简历网页。</p>
      </div>
    </div>
  );
};

// --- 成长清单详情页 ---
const CompletedListPage = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <button onClick={onBack} style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
        <ArrowLeft size={32} />
      </button>
      <div style={{ width: '48px', height: '48px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', border: '1px solid #f0f0f0' }}>logo</div>
      <h2 style={{ fontSize: '32px', fontWeight: 'black', fontStyle: 'italic', flex: 1, textAlign: 'center', paddingRight: '96px' }}>成长清单</h2>
    </div>

    <div style={{ flex: 1, display: 'flex', gap: '40px', minHeight: '0' }}>
      {/* 左侧与中间列表区 */}
      <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, aspectRatio: '4/3', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'black', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            小鹿收藏夹
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['销售心得', 'AI 板块', '运营技能总结'].map(tag => (
              <div key={tag} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '20px', border: '4px solid', borderColor: COLORS.text, textAlign: 'center', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(8px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: '45%', height: '96px', backgroundColor: 'white', borderRadius: '30px', border: '4px solid', borderColor: COLORS.text, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f9f9f9'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.style.transform = 'rotate(90deg)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; const svg = e.currentTarget.querySelector('svg'); if (svg) svg.style.transform = 'rotate(0deg)'; }}>
          <Plus size={48} style={{ transition: 'transform 0.3s ease' }} />
        </div>
      </div>

      {/* 鍙充晶闆疯揪鍥惧尯 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RadarChart size={300} />
      </div>
    </div>

    {/* 搴曢儴鎰熸偀鏂囨鍖?*/}
    <div style={{ position: 'relative', marginTop: '16px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '35px', border: '4px solid', borderColor: COLORS.text, padding: '32px', paddingRight: '128px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.6' }}>
          每一次岗位探索都会有想记录的心得，这里可以沉淀你的实践成果。<br/>
          这些记录也可以分享到讨论天地，无论是顺利还是踩坑，都是成长的一部分。
        </p>
      </div>
      <div style={{ position: 'absolute', right: '24px', bottom: '-10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 'black', opacity: '0.3', marginBottom: '4px' }}>小鹿</span>
        <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '20px', border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <DeerLogo size={64} style={{ transform: 'scaleX(-100%)' }} />
        </div>
      </div>
    </div>
  </div>
);

// --- 鍏朵綑椤甸潰 ---
const JobAnalystPage = ({ onStartQuest, onAskJob }) => {
  const [showJobLibrary, setShowJobLibrary] = useState(false);

  const openResumeOptimizer = () => {
    window.location.href = 'http://127.0.0.1:5175/';
  };

  if (showJobLibrary) {
    return <JobLibraryPage onBack={() => setShowJobLibrary(false)} onAskJob={onAskJob} />;
  }

  return (
    <div style={{ gap: '32px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'black' }}>小鹿求职分析</h2>
      <div style={{ width: '100%', height: '256px', backgroundColor: '#f9f9f9', borderRadius: '40px', border: '4px dashed', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', borderColor: COLORS.text, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><Play fill={COLORS.primary} /></div>
            <span style={{ fontWeight: 'bold', opacity: '0.2', fontSize: '20px', letterSpacing: '10px' }}>演示视频</span>
         </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
         <div onClick={openResumeOptimizer} style={{ padding: '24px', backgroundColor: '#FDFBF2', borderRadius: '30px', border: '4px dashed', borderColor: COLORS.header, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'box-shadow 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
            <Plus size={32} />
            <p style={{ fontWeight: 'bold' }}>添加简历</p>
         </div>
         {['简历优化建议', '岗位库分析'].map(t => (
           <div key={t} onClick={t === '简历优化建议' ? openResumeOptimizer : () => setShowJobLibrary(true)} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '30px', border: '4px solid', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: 'border-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#724412'} onMouseOut={(e) => e.currentTarget.style.borderColor = COLORS.accent}>{t}</div>
         ))}
         <div onClick={onStartQuest} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '30px', border: '4px solid', borderColor: COLORS.accent, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: 'border-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#724412'} onMouseOut={(e) => e.currentTarget.style.borderColor = COLORS.accent}>
           <span style={{ fontSize: '14px' }}>还没有简历？</span><span style={{ fontSize: '12px', opacity: '0.6' }}>点这里</span>
         </div>
      </div>
    </div>
  );
};

const JobLibraryPage = ({ onBack, onAskJob }) => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ cities: [], categories: [], educations: [] });
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [education, setEducation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (city) params.set('city', city);
      if (category) params.set('category', category);
      if (education) params.set('education', education);
      params.set('limit', '80');

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) throw new Error('岗位库读取失败');
      const data = await response.json();
      setJobs(data.jobs || []);
      setFilters(data.filters || { cities: [], categories: [], educations: [] });

      if (!selectedJob && data.jobs?.[0]) {
        loadJobDetail(data.jobs[0].id);
      } else if (selectedJob && !data.jobs?.some(job => job.id === selectedJob.id)) {
        setSelectedJob(null);
      }
    } catch (err) {
      setError(err.message || '岗位库读取失败');
    } finally {
      setLoading(false);
    }
  };

  const loadJobDetail = async (id) => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('岗位详情读取失败');
      setSelectedJob(await response.json());
    } catch (err) {
      setError(err.message || '岗位详情读取失败');
    }
  };

  React.useEffect(() => {
    loadJobs();
  }, [city, category, education]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs();
  };

  const resetFilters = () => {
    setSearch('');
    setCity('');
    setCategory('');
    setEducation('');
  };

  const selectStyle = {
    height: '48px',
    padding: '0 14px',
    borderRadius: '16px',
    border: '3px solid',
    borderColor: COLORS.accent,
    backgroundColor: 'white',
    color: COLORS.text,
    fontWeight: 'bold',
    outline: 'none',
    minWidth: '140px',
  };

  return (
    <div style={{ height: '100%', minHeight: '0', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} style={{ width: '48px', height: '48px', borderRadius: '16px', border: '3px solid', borderColor: COLORS.text, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 'black', marginBottom: '4px' }}>岗位库分析</h2>
          <p style={{ fontSize: '13px', color: '#8A6A35', fontWeight: 'bold' }}>来自 AI 大赛脱敏数据 · JD部分</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <div style={{ padding: '10px 14px', borderRadius: '16px', backgroundColor: '#FDFBF2', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'black', color: COLORS.text }}>{jobs.length} 个结果</div>
          <button onClick={resetFilters} style={{ padding: '10px 14px', borderRadius: '16px', backgroundColor: 'white', border: '2px solid', borderColor: COLORS.text, fontWeight: 'black', cursor: 'pointer' }}>重置</button>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 130px 220px 160px 110px', gap: '12px', alignItems: 'center' }}>
        <div style={{ minWidth: 0, height: '52px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: COLORS.text, opacity: 0.5 }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索职位、公司、关键词" style={{ width: '100%', height: '100%', padding: '0 16px 0 48px', borderRadius: '18px', border: '3px solid', borderColor: COLORS.accent, backgroundColor: '#fffdfa', fontWeight: 'bold', outline: 'none' }} />
        </div>
        <select value={city} onChange={(e) => setCity(e.target.value)} style={{ ...selectStyle, width: '100%', minWidth: 0 }}>
          <option value="">全部城市</option>
          {filters.cities.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...selectStyle, width: '100%', minWidth: 0 }}>
          <option value="">全部职类</option>
          {filters.categories.slice(0, 80).map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={education} onChange={(e) => setEducation(e.target.value)} style={{ ...selectStyle, width: '100%', minWidth: 0 }}>
          <option value="">全部学历</option>
          {filters.educations.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <button type="submit" style={{ height: '52px', padding: '0 24px', borderRadius: '18px', border: '3px solid', borderColor: COLORS.text, backgroundColor: COLORS.primary, color: 'white', fontWeight: 'black', cursor: 'pointer' }}>搜索</button>
      </form>

      {error && <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: '#fff1f0', color: '#9f1d1d', fontWeight: 'bold' }}>{error}</div>}

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(300px, 0.9fr) minmax(420px, 1.4fr)', gap: '20px' }}>
        <div style={{ minHeight: 0, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loading && <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#FDFBF2', border: '3px dashed', borderColor: COLORS.accent, fontWeight: 'black', textAlign: 'center' }}>岗位加载中...</div>}
          {!loading && jobs.map(job => {
            const active = selectedJob?.id === job.id;
            return (
              <button key={job.id} onClick={() => loadJobDetail(job.id)} style={{ textAlign: 'left', padding: '18px', borderRadius: '22px', border: '3px solid', borderColor: active ? COLORS.text : COLORS.accent, backgroundColor: active ? '#FDFBF2' : 'white', cursor: 'pointer', boxShadow: active ? '0 6px 14px rgba(114,68,18,0.12)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '17px', lineHeight: 1.35, fontWeight: 'black', color: COLORS.text }}>{job.title}</h3>
                  <span style={{ flex: '0 0 auto', fontSize: '12px', padding: '5px 8px', borderRadius: '999px', backgroundColor: COLORS.primary, color: 'white', fontWeight: 'black' }}>{job.city}</span>
                </div>
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#7b6a4c', fontWeight: 'bold' }}>{job.company}</p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[job.category, job.salary, job.experience, job.education].filter(Boolean).map(tag => (
                    <span key={tag} style={{ fontSize: '12px', padding: '5px 8px', borderRadius: '10px', backgroundColor: '#f7efd9', color: COLORS.text, fontWeight: 'bold' }}>{tag}</span>
                  ))}
                </div>
              </button>
            );
          })}
          {!loading && jobs.length === 0 && <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#FDFBF2', border: '3px dashed', borderColor: COLORS.accent, fontWeight: 'black', textAlign: 'center' }}>没有匹配的岗位</div>}
        </div>

        <div style={{ minHeight: 0, overflowY: 'auto', backgroundColor: '#fffdfa', borderRadius: '28px', border: '4px solid', borderColor: COLORS.accent, padding: '24px' }}>
          {selectedJob ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ fontSize: '13px', color: COLORS.primary, fontWeight: 'black', marginBottom: '8px' }}>{selectedJob.category}</p>
                <h3 style={{ fontSize: '30px', lineHeight: 1.18, fontWeight: 'black', color: COLORS.text }}>{selectedJob.title}</h3>
                <p style={{ marginTop: '10px', color: '#7b6a4c', fontWeight: 'bold' }}>{selectedJob.company}</p>
                <button onClick={() => onAskJob?.(selectedJob)} style={{ marginTop: '16px', height: '48px', padding: '0 20px', borderRadius: '18px', border: '3px solid', borderColor: COLORS.text, backgroundColor: COLORS.primary, color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 'black', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  继续问小鹿 <ArrowRight size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
                {[
                  ['薪资', selectedJob.salary],
                  ['经验', selectedJob.experience],
                  ['学历', selectedJob.education],
                  ['城市', selectedJob.city],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '14px', borderRadius: '18px', backgroundColor: 'white', border: '2px solid', borderColor: '#f0dfb5' }}>
                    <p style={{ fontSize: '12px', color: '#9b865e', fontWeight: 'bold' }}>{label}</p>
                    <p style={{ marginTop: '6px', fontSize: '15px', color: COLORS.text, fontWeight: 'black' }}>{value || '-'}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'black', marginBottom: '10px' }}>职位关键词</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedJob.keywords?.length ? selectedJob.keywords.map(keyword => (
                    <span key={keyword} style={{ padding: '7px 10px', borderRadius: '12px', backgroundColor: '#FDFBF2', border: '2px solid', borderColor: COLORS.accent, color: COLORS.text, fontWeight: 'bold', fontSize: '13px' }}>{keyword}</span>
                  )) : <span style={{ color: '#9b865e', fontWeight: 'bold' }}>暂无关键词</span>}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 'black', marginBottom: '10px' }}>岗位描述</h4>
                <p style={{ lineHeight: 1.75, color: '#4d3b22', fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{selectedJob.description}</p>
              </div>

              <div style={{ borderTop: '4px dashed', borderColor: COLORS.accent, paddingTop: '20px' }}>
                <h4 style={{ fontSize: '22px', fontWeight: 'black', marginBottom: '14px' }}>小鹿岗位分析</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {selectedJob.analysis?.fitTags.map(tag => (
                    <span key={tag} style={{ padding: '8px 12px', borderRadius: '999px', backgroundColor: COLORS.primary, color: 'white', fontWeight: 'black', fontSize: '13px' }}>{tag}</span>
                  ))}
                </div>
                {[
                  ['显性要求', selectedJob.analysis?.requirements],
                  ['隐含信号', selectedJob.analysis?.hiddenSignals],
                  ['适合人群', selectedJob.analysis?.targetAudience],
                  ['准备建议', selectedJob.analysis?.preparation],
                  ['面试准备', selectedJob.analysis?.interviewPrep],
                ].map(([title, items]) => (
                  <div key={title} style={{ marginTop: '14px', padding: '16px', borderRadius: '18px', backgroundColor: 'white', border: '2px solid', borderColor: '#f0dfb5' }}>
                    <p style={{ fontWeight: 'black', color: COLORS.text, marginBottom: '10px' }}>{title}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(items || []).map(item => <p key={item} style={{ lineHeight: 1.55, color: '#5e4b2a', fontWeight: 'bold' }}>• {item}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9b865e', fontWeight: 'black' }}>选择一个岗位查看分析</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ForumPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('全部');

  // 閰嶇疆鍒嗙被涓庢弿杩?
  const filterOptions = [
    { id: '全部', label: '全部帖子', desc: '' },
    { id: '吐槽', label: '岗位吐槽类', desc: '情绪价值' },
    { id: '解答', label: '疑问解答类', desc: '实用价值' },
    { id: '经验', label: '经验分享类', desc: '实用价值 + 情绪价值' }
  ];

  // 妯℃嫙甯栧瓙鏁版嵁
  const posts = [
    { id: 1, title: '校招避雷：某公司面试体验很差，流程非常混乱', type: '吐槽', tag: '岗位吐槽', author: '迷路的小鹿', likes: 128 },
    { id: 2, title: '互联网产品经理一面通常会问什么？求经验', type: '解答', tag: '疑问解答', author: '求职新手', likes: 56 },
    { id: 3, title: '双非上岸大厂运营，分享我的秋招面经和心态调整', type: '经验', tag: '经验分享', author: '上岸的鹿', likes: 342 },
    { id: 4, title: '简历里的项目经历怎么包装会更出彩？', type: '解答', tag: '疑问解答', author: '秋招大学生', likes: 89 },
    { id: 5, title: '入职一个月感觉每天都在打杂，想辞职了', type: '吐槽', tag: '岗位吐槽', author: '打工人', likes: 210 },
    { id: 6, title: '群面无领导小组讨论技巧总结，干货满满', type: '经验', tag: '经验分享', author: '面霸', likes: 415 }
  ];

  // 杩囨护鏄剧ず甯栧瓙
  const filteredPosts = activeFilter === '全部' ? posts : posts.filter(p => p.type === activeFilter);

  return (
    <div style={{ gap: '24px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease', position: 'relative', height: '100%' }}>
      
      {/* 椤堕儴锛氭悳绱笌绛涢€夋爮 */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', height: '56px' }}>
        {/* 鎼滅储妗?*/}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#724412', opacity: '0.4' }} size={20} />
          <input 
            placeholder="搜索讨论..." 
            style={{ width: '100%', height: '100%', paddingLeft: '48px', paddingRight: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '4px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'all 0.3s ease' }} 
            onFocus={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = '#724412'; }}
            onBlur={(e) => { e.target.style.backgroundColor = '#f9f9f9'; e.target.style.borderColor = COLORS.accent; }}
          />
        </div>
        
        {/* 绛涢€夋寜閽笌寮圭獥 */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            style={{ padding: '0 24px', height: '100%', backgroundColor: 'white', borderRadius: '20px', border: '4px solid', borderColor: COLORS.text, fontWeight: 'black', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
            onMouseOver={(e) => e.target.style.backgroundColor = '#f9f9f9'}
            onMouseDown={(e) => e.target.style.transform = 'translateY(1px)'}
            onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Filter size={20} /> 
            {activeFilter === '全部' ? '筛选分类' : filterOptions.find(o => o.id === activeFilter)?.label}
          </button>
          
          {showFilter && (
            <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: '0', width: '256px', backgroundColor: 'white', border: '4px solid', borderColor: COLORS.text, borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: '30', overflow: 'hidden', animation: 'slideInTop 0.2s ease' }}>
              {filterOptions.map((opt, i) => (
                <button 
                  key={opt.id} 
                  onClick={() => { setActiveFilter(opt.id); setShowFilter(false); }} 
                  style={{ width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.3s ease', borderBottom: i !== filterOptions.length - 1 ? '4px solid' : 'none', borderColor: COLORS.text, backgroundColor: activeFilter === opt.id ? '#FDFBF2' : 'white' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#FDFBF2'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = activeFilter === opt.id ? '#FDFBF2' : 'white'}
                >
                  <span style={{ fontWeight: 'black', color: '#724412' }}>{opt.label}</span>
                  {opt.desc && <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#949545', marginTop: '4px', opacity: '0.8' }}>{opt.desc}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* 鍙戝笘鎸夐挳 */}
        <button style={{ width: '56px', height: '56px', backgroundColor: '#724412', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.3s ease', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          <Plus size={24} />
        </button>
      </div>

      {/* 鍐呭锛氬笘瀛愬垪琛ㄥ尯 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', minHeight: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', paddingBottom: '24px' }}>
          {filteredPosts.map(post => (
            <div key={post.id} style={{ backgroundColor: 'white', border: '4px solid', borderColor: COLORS.accent, borderRadius: '30px', padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px' }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'; const h3 = e.currentTarget.querySelector('h3'); if (h3) h3.style.color = '#949545'; }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; const h3 = e.currentTarget.querySelector('h3'); if (h3) h3.style.color = '#724412'; }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
                   <h3 style={{ fontWeight: 'black', fontSize: '18px', color: '#724412', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', paddingRight: '8px' }}>{post.title}</h3>
                   <span style={{ flexShrink: '0', padding: '6px 12px', backgroundColor: '#FDFBF2', borderRadius: '12px', border: '2px solid', borderColor: COLORS.text, fontWeight: 'bold', fontSize: '10px', whiteSpace: 'nowrap', color: COLORS.primary }}>
                     {post.tag}
                   </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', opacity: '0.5', borderTop: '2px solid', borderColor: COLORS.bg, paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f0f0f0', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                     <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${post.author}`} alt="author" style={{ width: '100%', height: '100%' }} />
                   </div>
                   <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{post.author}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                   <MessageSquare size={14} /> {post.likes}
                </div>
              </div>
            </div>
          ))}
          {/* 褰撶瓫閫夊悗娌℃湁鏁版嵁鏃剁殑绌虹姸鎬?*/}
          {filteredPosts.length === 0 && (
             <div style={{ gridColumn: 'span 2', padding: '80px 0', textAlign: 'center', fontWeight: 'black', opacity: '0.2', fontStyle: 'italic' }}>
               这里还没有对应分类的帖子
             </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

const AIAssistantPage = ({ avatarSeed, jobContext }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: sanitizeChatContent('你好，我是你的求职答疑助手。无论是职业规划、简历优化还是面试准备，都可以来问我。') }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = { current: null };

  React.useEffect(() => {
    if (!jobContext?.id) return;

    setMessages([
      {
        role: 'assistant',
        content: sanitizeChatContent(`我已经带上「${jobContext.title}」这个岗位的信息了。你可以继续问我：适不适合你、简历怎么改、面试怎么准备，或者让小鹿帮你拆解岗位要求。`)
      }
    ]);
    setInputValue(`这个${jobContext.title}岗位适合什么样的人？`);
  }, [jobContext?.id]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: sanitizeChatContent(inputValue) };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      conversationHistory.push(userMessage);

      const response = await axios.post('/api/chat', {
        messages: conversationHistory,
        jobContext
      });

      const assistantMessage = { role: 'assistant', content: sanitizeChatContent(response.data.message) };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: sanitizeChatContent('抱歉，小鹿现在遇到了一点问题。请稍后重试，或者检查后端服务是否已经启动。') 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickAsk = (question) => {
    if (isLoading) return;
    setInputValue(question);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'slideInRight 0.5s ease', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#E3CB8F', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'black', fontStyle: 'italic', border: '2px solid', borderColor: '#724412' }}>logo</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'black' }}>求职解答小鹿</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: isLoading ? '#f0f0f0' : '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: '#E3CB8F' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isLoading ? '#949545' : '#4CAF50' }}></div>
          <span style={{ fontSize: '12px', fontWeight: 'bold', opacity: '0.6' }}>{isLoading ? '小鹿思考中...' : '在线'}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '32px', minHeight: '0' }}>
        <div style={{ flex: '2.5', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, padding: '32px', gap: '24px', overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ display: 'flex', gap: '16px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {msg.role === 'assistant' ? (
                    <>
                      <DeerLogo size={32} style={{ backgroundColor: '#E3CB8F', borderRadius: '12px', padding: '4px', border: '2px solid', borderColor: '#724412', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                      <span style={{ fontSize: '10px', fontWeight: 'black', marginTop: '4px', opacity: '0.4' }}>小鹿</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '32px', height: '32px', borderRadius: '12px', overflow: 'hidden', border: '2px solid', borderColor: '#724412', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`} alt="user" style={{ width: '100%', height: '100%' }} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'black', marginTop: '4px', opacity: '0.4' }}>我</span>
                    </>
                  )}
                </div>
                <div style={{ 
                  backgroundColor: msg.role === 'user' ? '#949545' : '#FDFBF2', 
                  color: msg.role === 'user' ? 'white' : '#724412', 
                  padding: '20px', 
                  borderRadius: '30px', 
                  borderTopLeftRadius: msg.role === 'assistant' ? '0' : '30px',
                  borderTopRightRadius: msg.role === 'user' ? '0' : '30px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                  maxWidth: '80%', 
                  fontWeight: 'bold', 
                  lineHeight: '1.6',
                  border: '2px solid',
                  borderColor: msg.role === 'user' ? '#724412' : COLORS.accent,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <DeerLogo size={32} style={{ backgroundColor: '#E3CB8F', borderRadius: '12px', padding: '4px', border: '2px solid', borderColor: '#724412', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', opacity: 0.6 }} />
                  <span style={{ fontSize: '10px', fontWeight: 'black', marginTop: '4px', opacity: '0.4' }}>小鹿</span>
                </div>
                <div style={{ backgroundColor: '#FDFBF2', padding: '20px', borderRadius: '30px', borderTopLeftRadius: '0', border: '2px solid', borderColor: COLORS.accent, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '80%', fontWeight: 'bold', color: '#724412', lineHeight: '1.6' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#949545', animation: 'bounce 1s infinite' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#949545', animation: 'bounce 1s infinite 0.2s' }}></div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#949545', animation: 'bounce 1s infinite 0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '24px', backgroundColor: 'white', borderTop: '4px solid', borderColor: COLORS.accent }}>
            <div style={{ display: 'flex', gap: '16px', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '30px', border: '4px solid', borderColor: COLORS.accent, transition: 'border-color 0.3s ease' }}>
              <input 
                type="text" 
                placeholder="输入您的问题..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1, padding: '16px 24px', backgroundColor: 'transparent', outline: 'none', fontWeight: 'black', fontSize: '14px' }}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  backgroundColor: isLoading || !inputValue.trim() ? '#ccc' : '#724412', 
                  color: 'white', 
                  borderRadius: '22px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer', 
                  transition: 'transform 0.3s ease', 
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
                }}
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {jobContext && (
            <div style={{ marginBottom: '20px', padding: '18px', borderRadius: '24px', backgroundColor: '#FDFBF2', border: '3px solid', borderColor: COLORS.accent }}>
              <p style={{ fontSize: '12px', fontWeight: 'black', color: COLORS.primary, marginBottom: '6px' }}>当前岗位</p>
              <h3 style={{ fontSize: '18px', lineHeight: 1.35, fontWeight: 'black', color: COLORS.text }}>{jobContext.title}</h3>
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#7b6a4c', fontWeight: 'bold' }}>{jobContext.company} · {jobContext.city} · {jobContext.salary}</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[jobContext.category, jobContext.experience, jobContext.education].filter(Boolean).map(tag => (
                  <span key={tag} style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '10px', backgroundColor: 'white', border: '1px solid', borderColor: COLORS.accent, color: COLORS.text, fontWeight: 'bold' }}>{tag}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {jobContext ? <MessageSquare size={20} style={{ color: '#949545' }} /> : <Clock size={20} style={{ color: '#949545' }} />}
              {jobContext ? '快速追问' : '历史访问'}
            </h3>
            <div style={{ width: '48px', height: '4px', backgroundColor: '#D6B767', margin: '8px auto', borderRadius: '2px' }}></div>
          </div>
          <div style={{ flex: 1, gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
            {jobContext ? (
              [
                `这个岗位适合应届生吗？`,
                `我的简历应该突出哪些关键词？`,
                `面试这个岗位要准备什么问题？`,
                `这个岗位有哪些隐含要求？`
              ].map((question) => (
                <button key={question} onClick={() => quickAsk(question)} style={{ width: '100%', textAlign: 'left', padding: '18px', marginBottom: '12px', backgroundColor: '#FDFBF2', borderRadius: '22px', border: '2px solid', borderColor: '#E3CB8F', cursor: 'pointer', fontWeight: 'black', color: COLORS.text, lineHeight: 1.45 }}>
                  {question}
                </button>
              ))
            ) : (
              [
                { title: '产品经理面试流程', date: '今日' },
                { title: '简历如何写得更吸引人？', date: '昨天' },
                { title: '杭州人才补贴政策咨询', date: '2026.04.18' },
                { title: '应届生选大厂还是初创公司？', date: '2026.04.15' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '30px', border: '2px solid', borderColor: '#E3CB8F', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#724412'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; const h4 = e.currentTarget.querySelector('h4'); if (h4) h4.style.color = '#949545'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E3CB8F'; e.currentTarget.style.boxShadow = 'none'; const h4 = e.currentTarget.querySelector('h4'); if (h4) h4.style.color = 'inherit'; }}>
                  <h4 style={{ fontWeight: 'black', fontSize: '14px', marginBottom: '8px' }}>{item.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: '0.4' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{item.date}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestFlow = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(null);
  
  // 鏀堕泦鐢ㄦ埛鏁版嵁
  const [userData, setUserData] = useState({
    // 鍩烘湰淇℃伅
    basic: {
      name: '',
      gender: '',
      school: '',
      major: '',
      education: '',
      graduation: ''
    },
    // 姹傝亴鎰忓悜
    career: {
      city: '',
      jobType: '',
      industry: '',
      position: '',
      available: '',
      salary: ''
    },
    // 鏍″唴缁忓巻
    internal: {
      club: [],
      classDuty: [],
      certificate: []
    },
    // 鏍″缁忓巻
    external: {
      internship: [],
      competition: []
    }
  });

  const updateData = (section, key, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateExperience = (type, category, data) => {
    setUserData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: [...prev[type][category], data]
      }
    }));
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setSubStep(null);
    }
    else onFinish(userData);
  };

  const renderLeftForm = () => {
    switch(step) {
      case 1:
        return (
          <div style={{ gap: '16px', animation: 'slideInLeft 0.3s ease' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'black', marginBottom: '24px', textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#D6B767' }}>关卡1：基本信息</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#949545', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}></div>
            </div>
            <input placeholder="姓名" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'name', e.target.value)} />
            <input placeholder="性别" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'gender', e.target.value)} />
            <input placeholder="学校" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'school', e.target.value)} />
            <input placeholder="专业" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'major', e.target.value)} />
            <input placeholder="学历，例如本科" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'education', e.target.value)} />
            <input placeholder="毕业时间，例如 2026" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'graduation', e.target.value)} />
          </div>
        );
      case 2:
        return (
          <div style={{ gap: '16px', animation: 'slideInLeft 0.3s ease' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'black', marginBottom: '24px', textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#D6B767' }}>关卡2：求职意向</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#949545', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#949545', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}></div>
            </div>
            <input placeholder="意向城市" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'city', e.target.value)} />
            <input placeholder="求职类型" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'jobType', e.target.value)} />
            <input placeholder="意向行业" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'industry', e.target.value)} />
            <input placeholder="意向岗位" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'position', e.target.value)} />
            <input placeholder="可到岗时间" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'available', e.target.value)} />
            <input placeholder="期望薪资" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'salary', e.target.value)} />
          </div>
        );
      case 3:
      case 4:
        const isInternal = step === 3;
        const items = isInternal ? [
          { t: '学校社团/组织', f: ['组织名称', '职务', '在职时间', '成果'] },
          { t: '班级职务', f: ['职务', '职责'] },
          { t: '证书/荣誉', f: ['名称', '时间'] }
        ] : [
          { t: '实习经历', f: ['公司', '岗位', '产出'] },
          { t: '比赛经历', f: ['项目', '奖项'] }
        ];
        return (
          <div style={{ gap: '16px', animation: 'slideInLeft 0.3s ease' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'black', marginBottom: '24px' }}>{isInternal ? '关卡3：校内经历' : '关卡4：校外经历'}</h3>
            {items.map(item => (
              <button key={item.t} onClick={() => setSubStep({ title: item.t, fields: item.f })} style={{ width: '100%', padding: '16px', borderRadius: '20px', border: '2px solid', fontWeight: 'bold', textAlign: 'left', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: subStep?.title === item.t ? '#949545' : 'white', color: subStep?.title === item.t ? 'white' : 'inherit', borderColor: subStep?.title === item.t ? '#724412' : '#E3CB8F' }} onMouseOver={(e) => !subStep || subStep.title !== item.t ? e.currentTarget.style.transform = 'translateX(8px)' : null} onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                {item.t} <ChevronRight size={18} />
              </button>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', gap: '40px', animation: 'fadeIn 0.5s ease', position: 'relative', minHeight: '0', overflow: 'hidden' }}>
      <div style={{ flex: '1.2', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.accent, padding: '40px', position: 'relative', overflowY: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {renderLeftForm()}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '48px' }}>
          <button onClick={nextStep} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', backgroundColor: 'white', borderColor: COLORS.text }} onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'} onMouseDown={(e) => e.target.style.transform = 'translateY(1px)'} onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>
            {step === 4 ? <span style={{ fontWeight: 'bold', fontSize: '14px' }}>完成</span> : <ArrowRight size={32} />}
          </button>
        </div>
      </div>
      <div style={{ width: '1px', backgroundColor: '#f0f0f0', height: '100%', borderRadius: '50%', opacity: '0.3' }}></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '0' }}>
        {subStep ? (
          <div style={{ height: '100%', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '24px' }}>{subStep.title}详情</h3>
            <div style={{ flex: 1, gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
              {subStep.fields.map(f => (
                <div key={f}>
                  <label style={{ fontSize: '12px', fontWeight: 'black', opacity: '0.4', marginLeft: '8px' }}>{f}</label>
                  <input placeholder={`请输入${f}`} style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.target.style.borderColor = '#724412'} />
                </div>
              ))}
            </div>
            <button onClick={() => setSubStep(null)} style={{ marginTop: '32px', padding: '16px 64px', backgroundColor: '#724412', color: 'white', borderRadius: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s ease', border: 'none' }} onMouseOver={(e) => e.target.style.opacity = '0.9'} onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>淇濆瓨</button>
          </div>
        ) : (
          <div style={{ paddingTop: '80px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 'black', marginBottom: '48px', letterSpacing: '4px', lineHeight: '1.2' }}>欢迎来到大学森</h2>
            <div style={{ gap: '16px', paddingLeft: '20px', borderLeft: '4px solid', borderColor: COLORS.accent }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.8', lineHeight: '1.6' }}>通过几个关卡即可解锁专属分析</p>
              <div style={{ gap: '16px' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.8', lineHeight: '1.6' }}>没有简历也没关系，</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.8', lineHeight: '1.6' }}>小鹿帮你做分析</p>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: '16px', right: '16px', textAlign: 'center' }}>
              <DeerLogo size={64} style={{ border: '2px solid #f0f0f0', borderRadius: '20px', padding: '8px' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisReportPage = ({ onBack, userData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '针对这份分析报告，你还想深入了解什么？比如推荐城市的落户政策，或者目标岗位的准备方向？'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我暂时无法回答你的问题，请稍后再试。' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '网络错误，请稍后重试。' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'slideInBottom 0.5s ease', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '24px', fontWeight: 'black' }}>求职分析师</h2>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '32px', minHeight: '0' }}>
        {/* 宸︿晶锛氬垎鏋愭姤鍛婂睍绀哄尯 */}
        <div style={{ flex: '1.5', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 'black', textDecoration: 'underline', textDecorationStyle: 'wavy', textDecorationColor: '#D6B767' }}>分析报告</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '24px', color: '#724412' }}>
            <div style={{ gap: '32px', paddingBottom: '40px' }}>
              {userData ? (
                <>
                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      1. 个人信息概览
                    </h4>
                    <div style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>姓名</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.name || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>性别</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.gender || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>学校</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.school || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>专业</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.major || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>学历</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.education || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>毕业时间</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.graduation || '未填写'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      2. 求职意向分析
                    </h4>
                    <div style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>意向城市</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.city || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>求职类型</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.jobType || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>意向行业</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.industry || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>意向岗位</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.position || '未填写'}</p>
                        </div>
                        <div>
                        <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>可到岗时间</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.available || '未填写'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>期望薪资</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.salary || '未填写'}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      3. 核心竞争力分析
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <div style={{ padding: '16px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                        <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>硬实力</p>
                        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{userData.basic.major ? `${userData.basic.major}专业基础` : '专业基础扎实'}，{Object.keys(userData.external).some(key => userData.external[key].length > 0) ? '有一定实践经历' : '以校内项目经验为主'}</p>
                      </div>
                      <div style={{ padding: '16px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                        <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>软实力</p>
                        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{Object.keys(userData.internal).some(key => userData.internal[key].length > 0) ? '团队协作能力较强' : '具备基础沟通表达能力'}，适合{userData.career.position ? userData.career.position : '跨部门协作'}场景</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      4. 推荐岗位与城市
                    </h4>
                    <div style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                      <p style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1.6' }}>
                        岗位推荐：{userData.career.position || '产品运营、行政管理、初级咨询顾问'}。<br/>
                        城市推荐：{userData.career.city || '杭州（人才政策友好）、苏州（生活成本适中且产业基础较好）'}。
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      5. 个性化建议
                    </h4>
                    <div style={{ gap: '16px' }}>
                      {[
                        `强化你的${userData.career.position || '目标岗位'}相关能力，这会直接影响求职竞争力。`,
                        `多参与${userData.career.industry || '相关'}行业的实习和项目，积累实践经验。`,
                        '建立专业的社交网络，持续关注行业动态和机会。',
                        '准备一份能够突出你核心优势的简历和作品集。'
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#949545', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 'bold' }}>{i + 1}</div>
                          <p style={{ lineHeight: '1.6', flex: 1 }}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '16px', opacity: '0.6' }}>暂无分析数据，请先完成求职意向填写。</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 鍙充晶锛氬洖椤?+ 杩介棶 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '0' }}>
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h4 style={{ textAlign: 'center', fontWeight: 'black', marginBottom: '16px', fontSize: '14px', opacity: '0.6' }}>往期回顾</h4>
            <div style={{ gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
              {
                [
                  { date: '2026.04.20', type: '初次探索' },
                  { date: '2026.04.15', type: '意向更新' },
                  { date: '2026.04.01', type: '大三起点' }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#FDFBF2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileText size={16} style={{ color: '#949545' }} />
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.type}</span>
                    </div>
                    <span style={{ fontSize: '12px', opacity: '0.4' }}>{item.date}</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div style={{ flex: '1.5', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', gap: '16px', fontSize: '14px' }}>
              {messages.map((message, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {message.role === 'assistant' && (
                    <DeerLogo size={24} style={{ backgroundColor: '#E3CB8F', borderRadius: '8px', padding: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  )}
                  <div style={{
                    backgroundColor: message.role === 'user' ? '#E3CB8F' : '#f9f9f9',
                    padding: '12px',
                    borderRadius: '20px',
                    borderTopLeftRadius: message.role === 'assistant' ? '0' : '20px',
                    borderTopRightRadius: message.role === 'user' ? '0' : '20px',
                    fontWeight: 'bold',
                    maxWidth: '80%'
                  }}>
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#949545', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                      你
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <DeerLogo size={24} style={{ backgroundColor: '#E3CB8F', borderRadius: '8px', padding: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '20px', borderTopLeftRadius: '0', fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#949545', animation: 'bounce 1s infinite' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#949545', animation: 'bounce 1s infinite 0.2s' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#949545', animation: 'bounce 1s infinite 0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px', borderTop: '2px solid', borderColor: COLORS.accent }}>
              <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                <input 
                  type="text" 
                  placeholder="输入你想继续追问的问题..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  style={{ flex: 1, padding: '8px 16px', backgroundColor: 'transparent', outline: 'none', fontWeight: 'bold', fontSize: '12px', cursor: loading ? 'not-allowed' : 'text' }}
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading}
                  style={{ width: '40px', height: '40px', backgroundColor: '#724412', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.3s ease', opacity: loading ? 0.6 : 1 }}
                  onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

