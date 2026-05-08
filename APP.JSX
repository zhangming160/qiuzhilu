import React, { useState } from 'react';
import axios from 'axios';
import DeerLogo from './src/components/DeerLogo';
import RadarChart from './src/components/RadarChart';
import { COLORS } from './src/constants/colors';
import { ensureAppStyles } from './src/utils/ensureAppStyles';
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

// --- 瀛愰〉闈㈢粍浠?---

const LandingView = ({ onStart }) => (
  <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <DeerLogo size={120} style={{ marginBottom: '24px', animation: 'bounce 2s infinite' }} />
    <div style={{ backgroundColor: 'white', borderRadius: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center', border: '6px solid', borderColor: COLORS.header }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'black', marginBottom: '32px', letterSpacing: '4px' }}>澶у妫?. 姹傝亴楣?/h1>
      <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: COLORS.header }}>澶у妫眰鑱岄箍鈥斺€斾綘鐨勪笓灞炴眰鑱岄鑸皬楣匡紒</p>
      <p style={{ opacity: '0.8', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto', fontStyle: 'italic' }}>浠庛€岃尭瑙掓墦纾ㄣ€嶅埌銆屾灄闂磋瘯鐐笺€嶏紝甯綘鎵撻€氭眰鑱屽叏閾捐矾锛岃姣忎竴姝ュ姫鍔涢兘绮惧噯韪╀腑鐩爣銆?/p>
    </div>
    <button onClick={onStart} style={{ marginTop: '48px', backgroundColor: 'white', borderRadius: '50px', padding: '20px 48px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '24px', border: '4px solid', borderColor: COLORS.text, cursor: 'pointer', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <span style={{ fontSize: '24px', fontWeight: 'black' }}>璺熺潃灏忛箍鏉ヤ竴璧蜂綋楠屽惂</span>
      <div style={{ width: '64px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', backgroundColor: COLORS.text }}><ArrowRight /></div>
    </button>
  </div>
);

const AuthSelectView = ({ onRegister, onLogin }) => (
  <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
    <DeerLogo size={80} style={{ marginBottom: '32px', animation: 'bounce 2s infinite' }} />
    <div style={{ backgroundColor: 'white', borderRadius: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center', border: '6px solid', borderColor: COLORS.header, maxWidth: '500px', width: '100%' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 'black', marginBottom: '32px' }}>寮€濮嬩綘鐨勬眰鑱屼箣鏃?/h2>
      <p style={{ opacity: '0.8', lineHeight: '1.6', marginBottom: '48px' }}>閫夋嫨浠ヤ笅鏂瑰紡杩涘叆绯荤粺</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button onClick={onRegister} style={{ backgroundColor: '#949545', color: 'white', borderRadius: '20px', padding: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease', border: 'none', fontSize: '18px' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          鏂扮敤鎴锋敞鍐?
        </button>
        <button onClick={onLogin} style={{ backgroundColor: 'transparent', color: COLORS.text, borderRadius: '20px', padding: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease', border: '2px solid', borderColor: COLORS.text, fontSize: '18px' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          宸叉湁璐﹀彿鐧诲綍
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
        setError(data.error || '娉ㄥ唽澶辫触');
      }
    } catch (err) {
      setError('缃戠粶閿欒锛岃绋嶅悗閲嶈瘯');
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
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.4', marginBottom: '32px', fontStyle: 'italic', letterSpacing: '4px' }}>澶у妫箍鍗?/h2>
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
            placeholder="鏄电О" 
            value={formData.nickname}
            onChange={(e) => handleChange(e, 'nickname')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="骞寸骇" 
            value={formData.grade}
            onChange={(e) => handleChange(e, 'grade')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="闄㈡牎" 
            value={formData.school}
            onChange={(e) => handleChange(e, 'school')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="涓撲笟" 
            value={formData.major}
            onChange={(e) => handleChange(e, 'major')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="閭锛堝繀濉紝鐢ㄤ簬鐧诲綍锛? 
            value={formData.email}
            onChange={(e) => handleChange(e, 'email')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            placeholder="鎵嬫満鍙凤紙鍙€夛級" 
            value={formData.phone}
            onChange={(e) => handleChange(e, 'phone')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, textAlign: 'center', fontWeight: 'bold', outline: 'none', marginBottom: '16px', transition: 'border-color 0.3s ease' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} 
          />
          <input 
            type="password" 
            placeholder="瀵嗙爜" 
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
        // 淇濆瓨鐢ㄦ埛淇℃伅鍒版湰鍦板瓨鍌?
        localStorage.setItem('user', JSON.stringify(data.user));
        onFinish();
      } else {
        setError(data.error || '鐧诲綍澶辫触');
      }
    } catch (err) {
      setError('缃戠粶閿欒锛岃绋嶅悗閲嶈瘯');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '40px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '8px solid', borderColor: COLORS.header, textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.4', marginBottom: '32px' }}>鐧诲綍瑙ｉ攣韬唤</h2>
        {error && (
          <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}
        <div style={{ marginBottom: '32px', textAlign: 'left' }}>
          <input 
            placeholder="閭锛堟敞鍐屾椂濉啓鐨勯偖绠憋級" 
            value={formData.identifier}
            onChange={(e) => handleChange(e, 'identifier')}
            style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', marginBottom: '16px' }} 
          />
          <input 
            type="password" 
            placeholder="瀵嗙爜" 
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
          {loading ? '鐧诲綍涓?..' : '寮€鍚眰鑱屼箣鏃?}
        </button>
        <button onClick={onBack} style={{ marginTop: '16px', fontSize: '14px', opacity: '0.4', width: '100%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>杩斿洖淇敼</button>
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

  const navItems = [
    { id: 'analyst', label: '姹傝亴鍒嗘瀽甯?, icon: Compass },
    { id: 'forum', label: '鑱屽満璁ㄨ澶╁湴', icon: MessageSquare },
    { id: 'assistant', label: '姹傝亴瑙ｇ瓟灏忛箍', icon: UserCircle },
    { id: 'trajectory', label: '鎴愰暱杞ㄨ抗', icon: TrendingUp },
  ];

  const renderContent = () => {
    if (showAnalysisReport) return <AnalysisReportPage onBack={() => setShowAnalysisReport(false)} userData={userData} />;
    if (showQuestFlow) return <QuestFlow onFinish={(data) => { setUserData(data); setShowAnalysisReport(true); }} />;
    if (showCompletedList) return <CompletedListPage onBack={() => setShowCompletedList(false)} />;
    
    switch (currentPage) {
      case 'analyst': return <JobAnalystPage onStartQuest={() => setShowQuestFlow(true)} />;
      case 'forum': return <ForumPage />;
      case 'assistant': return <AIAssistantPage avatarSeed={avatarSeed} />;
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

        <div style={{ height: '96px', backgroundColor: 'white', borderTop: '4px solid', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
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
                    padding: '12px 32px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    border: '2px solid',
                    backgroundColor: isActive ? COLORS.primary : 'transparent',
                    color: isActive ? 'white' : '#999',
                    borderColor: isActive ? COLORS.text : 'transparent',
                    boxShadow: isActive ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                    cursor: 'pointer'
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

  const years = ['澶т竴', '澶т簩', '澶т笁', '澶у洓'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease', overflow: 'visible', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: '#FDFBF2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'black', fontStyle: 'italic', border: '2px solid', borderColor: '#724412' }}>logo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <DeerLogo size={40} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '4px', border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
           <div style={{ backgroundColor: 'white', padding: '12px 24px', borderRadius: '20px', border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
              <p style={{ fontWeight: 'bold', fontSize: '14px' }}>鎶婃瘡涓€娆℃垚灏遍兘璁板綍涓嬫潵鍚э紝浼氳В閿佸皬鎯婂枩鍝</p>
              <div style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', backgroundColor: 'white', borderLeft: '2px solid #f0f0f0', borderBottom: '2px solid #f0f0f0', transform: 'translateY(-50%) rotate(45deg)' }}></div>
           </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '40px', minHeight: '0', position: 'relative' }}>
        {/* 宸︿晶鍨傜洿鏃堕棿杞?*/}
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

        {/* 涓棿寮瑰嚭璇︽儏 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selectedYear ? (
            <div style={{ width: '450px', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', animation: 'zoomIn 0.3s ease', position: 'relative' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'black', textAlign: 'center', marginBottom: '32px' }}>{selectedYear} 涓婄瘒</h3>
              <div style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
                {['璇佷功', '绀惧洟缁勭粐', '瀹炰範'].map(label => (
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
              <p style={{ fontWeight: 'black', fontSize: '24px', letterSpacing: '4px' }}>鐐瑰嚮骞翠唤鏌ョ湅杞ㄨ抗</p>
            </div>
          )}
        </div>

        {/* 鍙充晶鍔熻兘鏍?*/}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '40px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '35px', border: '4px solid', borderColor: COLORS.text, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
             <div style={{ width: '64px', height: '64px', backgroundColor: '#FDFBF2', borderRadius: '50%', border: '2px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <Mic style={{ color: '#D6B767' }} />
             </div>
             <span style={{ fontWeight: 'black', fontSize: '20px' }}>褰曢煶</span>
             <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f9f9f9', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}>
               闈㈣瘯杩借釜 <ArrowRight size={14} />
             </button>
          </div>

          <button 
            onClick={onOpenList}
            style={{ width: '100%', backgroundColor: 'white', borderRadius: '35px', border: '4px solid', borderColor: COLORS.text, padding: '32px', fontWeight: 'black', fontSize: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.3s ease' }} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} 
          >
            Completed List
          </button>

          <div style={{ backgroundColor: '#FAF3E0', borderRadius: '30px', border: '4px dashed', borderColor: COLORS.primary, padding: '24px', textAlign: 'center', fontWeight: 'black', color: '#949545', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            棰嗗彇涓撳睘澶у妫箍鍗?
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center', opacity: '0.6' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '2px' }}>灏忔儕鍠滐細鍙牴鎹繖浜涙垚灏变竴閿敓鎴愮畝鍘?word / 鐢熸垚涓汉绠€鍘嗙綉绔?/p>
      </div>
    </div>
  );
};

// --- Completed List 璇︽儏椤?---
const CompletedListPage = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <button onClick={onBack} style={{ padding: '8px', cursor: 'pointer', borderRadius: '50%', transition: 'background-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
        <ArrowLeft size={32} />
      </button>
      <div style={{ width: '48px', height: '48px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', border: '1px solid #f0f0f0' }}>logo</div>
      <h2 style={{ fontSize: '32px', fontWeight: 'black', fontStyle: 'italic', flex: 1, textAlign: 'center', paddingRight: '96px' }}>Completed List</h2>
    </div>

    <div style={{ flex: 1, display: 'flex', gap: '40px', minHeight: '0' }}>
      {/* 宸︿晶鍙婁腑闂村垪琛ㄥ尯 */}
      <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: 1, aspectRatio: '4/3', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'black', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            灏忛箍搴撻泦
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['閿€鍞績寰?, 'AI 鏉垮潡', '杩愯惀鎶€宸ф€荤粨'].map(tag => (
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
          姣忎竴娆″矖浣嶆帰绱㈤兘浼氭湁鎯宠褰曠殑蹇冨緱锛岃繖閲屽彲浠ヨ褰曚笅鏉ヤ綘鐨勫疄璺垫垚鏋滐紝<br/>
          浣犵殑璁板綍杩樺彲浠ュ垎浜埌璁ㄨ澶╁湴锛屾棤璁烘槸濂芥槸鍧忥紝閮芥槸鎴愰暱涓渶妫掔殑鑷繁
        </p>
      </div>
      <div style={{ position: 'absolute', right: '24px', bottom: '-10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 'black', opacity: '0.3', marginBottom: '4px' }}>灏忛箍</span>
        <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '20px', border: '2px solid #f0f0f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <DeerLogo size={64} style={{ transform: 'scaleX(-100%)' }} />
        </div>
      </div>
    </div>
  </div>
);

// --- 鍏朵綑椤甸潰 ---
const JobAnalystPage = ({ onStartQuest }) => (
  <div style={{ gap: '32px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease' }}>
    <h2 style={{ fontSize: '32px', fontWeight: 'black' }}>灏忛箍姹傝亴鍒嗘瀽</h2>
    <div style={{ width: '100%', height: '256px', backgroundColor: '#f9f9f9', borderRadius: '40px', border: '4px dashed', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid', borderColor: COLORS.text, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}><Play fill={COLORS.primary} /></div>
          <span style={{ fontWeight: 'bold', opacity: '0.2', fontSize: '20px', letterSpacing: '10px' }}>婕旂ず瑙嗛</span>
       </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
       <div style={{ padding: '24px', backgroundColor: '#FDFBF2', borderRadius: '30px', border: '4px dashed', borderColor: COLORS.header, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'box-shadow 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'} onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <Plus size={32} />
          <p style={{ fontWeight: 'bold' }}>娣诲姞绠€鍘?/p>
       </div>
       {['绠€鍘嗕紭鍖栧缓璁?, '宀椾綅 JD 鍒嗘瀽'].map(t => (
         <div key={t} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '30px', border: '4px solid', borderColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: 'border-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#724412'} onMouseOut={(e) => e.currentTarget.style.borderColor = COLORS.accent}>{t}</div>
       ))}
       <div onClick={onStartQuest} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '30px', border: '4px solid', borderColor: COLORS.accent, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', cursor: 'pointer', transition: 'border-color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#724412'} onMouseOut={(e) => e.currentTarget.style.borderColor = COLORS.accent}>
         <span style={{ fontSize: '14px' }}>杩樻病鏈夌畝鍘嗭紵</span><span style={{ fontSize: '12px', opacity: '0.6' }}>鐐硅繖閲?/span>
       </div>
    </div>
  </div>
);

const ForumPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('鍏ㄩ儴');

  // 閰嶇疆鍒嗙被涓庢弿杩?
  const filterOptions = [
    { id: '鍏ㄩ儴', label: '鍏ㄩ儴甯栧瓙', desc: '' },
    { id: '鍚愭Ы', label: '宀椾綅鍚愭Ы绫?, desc: '鎯呯华浠峰€? },
    { id: '瑙ｇ瓟', label: '鐤戦棶瑙ｇ瓟绫?, desc: '瀹炵敤浠峰€? },
    { id: '缁忛獙', label: '缁忛獙鍒嗕韩绫?, desc: '瀹炵敤浠峰€?鎯呯华浠峰€? }
  ];

  // 妯℃嫙甯栧瓙鏁版嵁
  const posts = [
    { id: 1, title: '鏍℃嫑閬块浄锛乆X鍏徃闈㈣瘯浣撻獙鏋佸樊锛屽畬鍏ㄤ笉灏婇噸浜?, type: '鍚愭Ы', tag: '宀椾綅鍚愭Ы', author: '杩疯矾鐨勫皬楣?, likes: 128 },
    { id: 2, title: '浜掕仈缃戜骇鍝佺粡鐞嗕竴闈㈤€氬父闂粈涔堬紵姹傚ぇ浣寚鐐癸紒', type: '瑙ｇ瓟', tag: '鐤戦棶瑙ｇ瓟', author: '姹傝亴鏂版墜', likes: 56 },
    { id: 3, title: '鍙岄潪鏈笂宀稿ぇ鍘傝繍钀ワ紝鍒嗕韩鎴戠殑绉嬫嫑闈㈢粡涓庡績鎬佽皟鏁?, type: '缁忛獙', tag: '缁忛獙鍒嗕韩', author: '涓婂哺鐨勯箍', likes: 342 },
    { id: 4, title: '绠€鍘嗕笂鐨勯」鐩粡鍘嗘€庝箞鍖呰鎵嶅嚭褰╋紵', type: '瑙ｇ瓟', tag: '鐤戦棶瑙ｇ瓟', author: '绉冨ご澶у鐢?, likes: 89 },
    { id: 5, title: '鍏ヨ亴涓€涓湀锛屾劅瑙夋瘡澶╅兘鍦ㄦ墦鏉傦紝鎯宠緸鑱屼簡...', type: '鍚愭Ы', tag: '宀椾綅鍚愭Ы', author: '鎵撳伐浜?, likes: 210 },
    { id: 6, title: '缇ら潰鏃犻瀵煎皬缁勮璁烘妧宸ф€荤粨锛屽共璐ф弧婊★紒', type: '缁忛獙', tag: '缁忛獙鍒嗕韩', author: '闈㈤湼', likes: 415 }
  ];

  // 杩囨护鏄剧ず甯栧瓙
  const filteredPosts = activeFilter === '鍏ㄩ儴' ? posts : posts.filter(p => p.type === activeFilter);

  return (
    <div style={{ gap: '24px', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease', position: 'relative', height: '100%' }}>
      
      {/* 椤堕儴锛氭悳绱笌绛涢€夋爮 */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', height: '56px' }}>
        {/* 鎼滅储妗?*/}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#724412', opacity: '0.4' }} size={20} />
          <input 
            placeholder="鎼滅储璁ㄨ..." 
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
            {activeFilter === '鍏ㄩ儴' ? '绛涢€夊垎绫? : filterOptions.find(o => o.id === activeFilter)?.label}
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
               杩欓噷杩樻病鏈夊搴旀爣绛剧殑甯栧瓙鍝 馃
             </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

const AIAssistantPage = ({ avatarSeed }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '浣犲ソ鍛€锛佹垜鏄綘鐨勬眰鑱岄鑸皬楣裤€傛棤璁哄叧浜庤亴涓氳鍒掋€佺畝鍘嗘鼎鑹茶繕鏄潰璇曟妧宸э紝灏界闂垜鍝 馃鉁? }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = { current: null };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({ role: m.role, content: m.content }));
      conversationHistory.push(userMessage);

      const response = await axios.post('/api/chat', {
        messages: conversationHistory
      });

      const assistantMessage = { role: 'assistant', content: response.data.message };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: '鎶辨瓑锛屽皬楣跨幇鍦ㄩ亣鍒颁簡涓€鐐归棶棰橈紝璇风◢鍚庡啀璇曘€傛垨鑰呬綘鍙互妫€鏌ヤ竴涓嬪悗绔湇鍔℃槸鍚﹀惎鍔▇ 馃' 
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px', animation: 'slideInRight 0.5s ease', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#E3CB8F', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'black', fontStyle: 'italic', border: '2px solid', borderColor: '#724412' }}>logo</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'black' }}>姹傝亴瑙ｇ瓟灏忛箍</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: isLoading ? '#f0f0f0' : '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: '#E3CB8F' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isLoading ? '#949545' : '#4CAF50' }}></div>
          <span style={{ fontSize: '12px', fontWeight: 'bold', opacity: '0.6' }}>{isLoading ? '灏忛箍鎬濊€冧腑...' : '鍦ㄧ嚎'}</span>
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
                      <span style={{ fontSize: '10px', fontWeight: 'black', marginTop: '4px', opacity: '0.4' }}>灏忛箍</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '32px', height: '32px', borderRadius: '12px', overflow: 'hidden', border: '2px solid', borderColor: '#724412', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`} alt="user" style={{ width: '100%', height: '100%' }} />
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'black', marginTop: '4px', opacity: '0.4' }}>鎴?/span>
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
                  <span style={{ fontSize: '10px', fontWeight: 'black', marginTop: '4px', opacity: '0.4' }}>灏忛箍</span>
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
                placeholder="杈撳叆鎮ㄧ殑闂銆傘€? 
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
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: '#949545' }} />
              鍘嗗彶璁块棶
            </h3>
            <div style={{ width: '48px', height: '4px', backgroundColor: '#D6B767', margin: '8px auto', borderRadius: '2px' }}></div>
          </div>
          <div style={{ flex: 1, gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
            {
              [
                { title: '浜у搧缁忕悊闈㈣瘯娴佺▼', date: '浠婃棩' },
                { title: '绠€鍘嗗浣曞啓寰楀惛寮曚汉锛?, date: '鏄ㄥぉ' },
                { title: '鏉窞浜烘墠琛ヨ创鏀跨瓥鍜ㄨ', date: '2026.04.18' },
                { title: '搴斿眾鐢熼€夊ぇ鍘傝繕鏄垵鍒涳紵', date: '2026.04.15' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '30px', border: '2px solid', borderColor: '#E3CB8F', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#724412'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; const h4 = e.currentTarget.querySelector('h4'); if (h4) h4.style.color = '#949545'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E3CB8F'; e.currentTarget.style.boxShadow = 'none'; const h4 = e.currentTarget.querySelector('h4'); if (h4) h4.style.color = 'inherit'; }}>
                  <h4 style={{ fontWeight: 'black', fontSize: '14px', marginBottom: '8px' }}>{item.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: '0.4' }}>
                    <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{item.date}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))
            }
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
     绀惧洟: [],
     鐝骇鑱屽姟: [],
      璇佷功: []
    },
    // 鏍″缁忓巻
    external: {
      瀹炰範: [],
      姣旇禌: []
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
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'black', marginBottom: '24px', textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#D6B767' }}>鍏冲崱1锛氬熀鏈俊鎭?/h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#949545', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}></div>
            </div>
            <input placeholder="濮撳悕" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'name', e.target.value)} />
            <input placeholder="鎬у埆" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'gender', e.target.value)} />
            <input placeholder="闄㈡牎" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'school', e.target.value)} />
            <input placeholder="涓撲笟" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'major', e.target.value)} />
            <input placeholder="瀛﹀巻锛氫緥鏈" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'education', e.target.value)} />
            <input placeholder="姣曚笟鏃堕棿锛氫緥2026" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('basic', 'graduation', e.target.value)} />
          </div>
        );
      case 2:
        return (
          <div style={{ gap: '16px', animation: 'slideInLeft 0.3s ease' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'black', marginBottom: '24px', textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#D6B767' }}>鍏冲崱2锛氭眰鑱屾剰鍚?/h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#949545', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#949545', borderRadius: '2px' }}></div>
              <div style={{ width: '64px', height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px' }}></div>
            </div>
            <input placeholder="鎰忓悜鍩庡競" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'city', e.target.value)} />
            <input placeholder="姹傝亴绫诲瀷" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'jobType', e.target.value)} />
            <input placeholder="鎰忓悜琛屼笟" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'industry', e.target.value)} />
            <input placeholder="鎰忓悜宀椾綅" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'position', e.target.value)} />
            <input placeholder="鍙埌宀楁椂闂? style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'available', e.target.value)} />
            <input placeholder="鏈熸湜钖祫" style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.currentTarget.style.borderColor = '#724412'} onChange={(e) => updateData('career', 'salary', e.target.value)} />
          </div>
        );
      case 3:
      case 4:
        const isInternal = step === 3;
        const items = isInternal ? [
          { t: '瀛︽牎绀惧洟/缁勭粐', f: ['缁勭粐鍚嶇О', '鑱屽姟', '鍦ㄨ亴鏃堕棿', '鎴愭灉'] },
          { t: '鐝骇鑱屽姟', f: ['鑱屽姟', '鑱岃矗'] },
          { t: '璇佷功/鑽ｈ獕', f: ['鍚嶇О', '鏃堕棿'] }
        ] : [
          { t: '瀹炰範缁忓巻', f: ['鍏徃', '宀椾綅', '浜у嚭'] },
          { t: '姣旇禌缁忓巻', f: ['椤圭洰', '濂栭」'] }
        ];
        return (
          <div style={{ gap: '16px', animation: 'slideInLeft 0.3s ease' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'black', marginBottom: '24px' }}>{isInternal ? '鍏冲崱3锛氭牎鍐呯粡鍘? : '鍏冲崱4锛氭牎澶栫粡鍘?}</h3>
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
            {step === 4 ? <span style={{ fontWeight: 'bold', fontSize: '14px' }}>瀹屾垚</span> : <ArrowRight size={32} />}
          </button>
        </div>
      </div>
      <div style={{ width: '1px', backgroundColor: '#f0f0f0', height: '100%', borderRadius: '50%', opacity: '0.3' }}></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', minHeight: '0' }}>
        {subStep ? (
          <div style={{ height: '100%', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '24px' }}>{subStep.title}璇︽儏</h3>
            <div style={{ flex: 1, gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
              {subStep.fields.map(f => (
                <div key={f}>
                  <label style={{ fontSize: '12px', fontWeight: 'black', opacity: '0.4', marginLeft: '8px' }}>{f}</label>
                  <input placeholder={`璇疯緭鍏?{f}`} style={{ width: '100%', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent, fontWeight: 'bold', outline: 'none', transition: 'border-color 0.3s ease' }} onFocus={(e) => e.target.style.borderColor = '#724412'} />
                </div>
              ))}
            </div>
            <button onClick={() => setSubStep(null)} style={{ marginTop: '32px', padding: '16px 64px', backgroundColor: '#724412', color: 'white', borderRadius: '20px', fontWeight: 'black', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'all 0.3s ease', border: 'none' }} onMouseOver={(e) => e.target.style.opacity = '0.9'} onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} onMouseUp={(e) => e.target.style.transform = 'scale(1)'}>淇濆瓨</button>
          </div>
        ) : (
          <div style={{ paddingTop: '80px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 'black', marginBottom: '48px', letterSpacing: '4px', lineHeight: '1.2' }}>娆㈣繋鏉ュ埌澶у妫?/h2>
            <div style={{ gap: '16px', paddingLeft: '20px', borderLeft: '4px solid', borderColor: COLORS.accent }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.8', lineHeight: '1.6' }}>閫氳繃涓変釜鍏冲崱鍗冲彲棰嗗彇濂栧姳</p>
              <div style={{ gap: '16px' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.8', lineHeight: '1.6' }}>娌℃湁绠€鍘嗕篃娌″叧绯伙紝</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', opacity: '0.8', lineHeight: '1.6' }}>灏忛箍甯綘鍋氬垎鏋?/p>
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
      content: '閽堝杩欎唤鍒嗘瀽鎶ュ憡锛屼綘鏈変粈涔堟兂鏇存繁鍏ヤ簡瑙ｇ殑鍚楋紵姣斿鏌愪釜鎺ㄨ崘鍩庡競鐨勫叿浣撹惤鎴锋斂绛栵紵'
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
        setMessages(prev => [...prev, { role: 'assistant', content: '鎶辨瓑锛屾垜鏆傛椂鏃犳硶鍥炵瓟浣犵殑闂锛岃绋嶅悗鍐嶈瘯銆? }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '缃戠粶閿欒锛岃绋嶅悗閲嶈瘯銆? }]);
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
        <h2 style={{ fontSize: '24px', fontWeight: 'black' }}>姹傝亴鍒嗘瀽甯?/h2>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '32px', minHeight: '0' }}>
        {/* 宸︿晶锛氬垎鏋愭姤鍛婂睍绀哄尯 */}
        <div style={{ flex: '1.5', backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '40px', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '32px', fontWeight: 'black', textDecoration: 'underline', textDecorationStyle: 'wavy', textDecorationColor: '#D6B767' }}>鍒嗘瀽鎶ュ憡</h3>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '24px', color: '#724412' }}>
            <div style={{ gap: '32px', paddingBottom: '40px' }}>
              {userData ? (
                <>
                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      1. 涓汉淇℃伅姒傝
                    </h4>
                    <div style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>濮撳悕</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.name || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>鎬у埆</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.gender || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>闄㈡牎</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.school || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>涓撲笟</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.major || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>瀛﹀巻</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.education || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>姣曚笟鏃堕棿</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.basic.graduation || '鏈～鍐?}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      2. 姹傝亴鎰忓悜鍒嗘瀽
                    </h4>
                    <div style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>鎰忓悜鍩庡競</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.city || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>姹傝亴绫诲瀷</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.jobType || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>鎰忓悜琛屼笟</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.industry || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>鎰忓悜宀椾綅</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.position || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>鍙埌宀楁椂闂?/p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.available || '鏈～鍐?}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>鏈熸湜钖祫</p>
                          <p style={{ fontWeight: 'bold' }}>{userData.career.salary || '鏈～鍐?}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      3. 鏍稿績绔炰簤鍔涘垎鏋?
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <div style={{ padding: '16px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                        <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>纭疄鍔?/p>
                        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{userData.basic.major ? `${userData.basic.major}涓撲笟鍩虹` : '涓撲笟鍩虹鎵庡疄'}锛寋Object.keys(userData.external).some(key => userData.external[key].length > 0) ? '瀹炶返缁忛獙涓板瘜' : '鏍″唴椤圭洰鎴愭灉鏄捐憲'}</p>
                      </div>
                      <div style={{ padding: '16px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                        <p style={{ fontSize: '12px', opacity: '0.5', marginBottom: '4px' }}>杞疄鍔?/p>
                        <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{Object.keys(userData.internal).some(key => userData.internal[key].length > 0) ? '鍥㈤槦鍗忎綔鑳藉姏寮? : '楂樻儏鍟嗘矡閫?}锛屾搮闀縶userData.career.position ? userData.career.position.split(' ')[0] : '璺ㄩ儴闂?}鍗忎綔</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      4. 鎺ㄨ崘宀椾綅涓庡煄甯?
                    </h4>
                    <div style={{ padding: '20px', backgroundColor: '#FDFBF2', borderRadius: '20px', border: '2px solid', borderColor: COLORS.accent }}>
                      <p style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1.6' }}>
                        宀椾綅鎺ㄨ崘锛歿userData.career.position || '浜у搧杩愯惀銆佽鏀跨鐞嗐€佸垵绾у挩璇㈤【闂?}銆?br/>
                        鍩庡競鎺ㄨ崘锛歿userData.career.city || '鏉窞锛堜汉鎵嶆斂绛栧弸濂斤級銆佽嫃宸烇紙鐢熸椿鎴愭湰閫備腑涓斾骇涓氬熀纭€濂斤級'}銆?
                      </p>
                    </div>
                  </section>

                  <section>
                    <h4 style={{ fontSize: '20px', fontWeight: 'black', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '24px', backgroundColor: '#949545', borderRadius: '4px' }}></span>
                      5. 涓€у寲寤鸿
                    </h4>
                    <div style={{ gap: '16px' }}>
                      {[
                        `寮哄寲浣犵殑${userData.career.position === '鏁版嵁鍒嗘瀽甯? ? '鏁版嵁鍒嗘瀽' : userData.career.position === '浜у搧缁忕悊' ? '浜у搧鎬濈淮' : '涓撲笟'}鑳藉姏锛岃繖鍦ㄥ綋鍓嶅氨涓氬競鍦轰腑闈炲父鍙楁杩巂,
                        `澶氬弬鍔?{userData.career.industry || '鐩稿叧'}琛屼笟鐨勫疄涔犲拰椤圭洰锛岀Н绱疄璺电粡楠宍,
                        '寤虹珛涓撲笟鐨勭ぞ浜ょ綉缁滐紝鍏虫敞琛屼笟鍔ㄦ€佸拰鏈轰細',
                        '鍑嗗涓€浠界獊鍑轰綘鏍稿績浼樺娍鐨勭畝鍘嗗拰浣滃搧闆?
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
                  <p style={{ fontSize: '16px', opacity: '0.6' }}>鏆傛棤鍒嗘瀽鏁版嵁锛岃鍏堝畬鎴愭眰鑱屾剰鍚戝～鍐?/p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 鍙充晶锛氬洖椤?+ 杩介棶 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '0' }}>
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '40px', border: '4px solid', borderColor: COLORS.text, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h4 style={{ textAlign: 'center', fontWeight: 'black', marginBottom: '16px', fontSize: '14px', opacity: '0.6' }}>寰€鏈熷洖椤?/h4>
            <div style={{ gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
              {
                [
                  { date: '2026.04.20', type: '鍒濇鎺㈢储' },
                  { date: '2026.04.15', type: '鎰忓悜鏇存柊' },
                  { date: '2026.04.01', type: '澶т笁璧风偣' }
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
                      浣?
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
                  placeholder="杈撳叆鎮ㄧ殑闂銆傘€? 
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
