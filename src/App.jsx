import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, remove, onValue, push } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// ═══════════════════════════════════════════
// 🎨 ドット絵コンポーネント
// ═══════════════════════════════════════════

const HorsePixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 頭 */}
    <rect x="2" y="6" width="2" height="2" fill="#8B4513" />
    <rect x="4" y="6" width="2" height="2" fill="#8B4513" />
    {/* 耳 */}
    <rect x="6" y="4" width="2" height="2" fill="#A0522D" />
    <rect x="8" y="4" width="2" height="2" fill="#A0522D" />
    {/* 体 */}
    <rect x="3" y="8" width="10" height="4" fill="#D2691E" />
    {/* 脚 */}
    <rect x="4" y="12" width="2" height="3" fill="#8B4513" />
    <rect x="10" y="12" width="2" height="3" fill="#8B4513" />
    {/* 目 */}
    <circle cx="5" cy="6" r="1" fill="#FFD700" />
  </svg>
);

const CrownPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ベース */}
    <rect x="2" y="10" width="12" height="2" fill="#FFD700" />
    {/* スパイク左 */}
    <rect x="3" y="6" width="2" height="4" fill="#FFD700" />
    {/* スパイク中央 */}
    <rect x="7" y="4" width="2" height="6" fill="#FFD700" />
    {/* スパイク右 */}
    <rect x="11" y="6" width="2" height="4" fill="#FFD700" />
    {/* 宝石 */}
    <circle cx="4" cy="5" r="1" fill="#FF69B4" />
    <circle cx="8" cy="3" r="1" fill="#FF69B4" />
    <circle cx="12" cy="5" r="1" fill="#FF69B4" />
  </svg>
);

const MedalPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 金メダル */}
    <circle cx="4" cy="6" r="3" fill="#FFD700" />
    {/* 銀メダル */}
    <circle cx="12" cy="6" r="3" fill="#C0C0C0" />
    {/* 銅メダル */}
    <circle cx="8" cy="4" r="3" fill="#CD7F32" />
    {/* リボン */}
    <rect x="3" y="9" width="2" height="4" fill="#FF69B4" />
    <rect x="11" y="9" width="2" height="4" fill="#FF69B4" />
    <rect x="7" y="9" width="2" height="5" fill="#FF69B4" />
  </svg>
);

const StarPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="1" width="2" height="2" fill="#FFD700" />
    <rect x="5" y="3" width="2" height="2" fill="#FFD700" />
    <rect x="9" y="3" width="2" height="2" fill="#FFD700" />
    <rect x="3" y="5" width="2" height="2" fill="#FFD700" />
    <rect x="7" y="5" width="2" height="2" fill="#FFD700" />
    <rect x="11" y="5" width="2" height="2" fill="#FFD700" />
    <rect x="5" y="7" width="2" height="2" fill="#FFD700" />
    <rect x="9" y="7" width="2" height="2" fill="#FFD700" />
    <rect x="7" y="9" width="2" height="2" fill="#FFD700" />
  </svg>
);

const LockPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 錠前本体 */}
    <rect x="3" y="8" width="10" height="6" fill="#8B4513" />
    {/* 錠前カギ部 */}
    <rect x="5" y="4" width="6" height="4" fill="#A0522D" stroke="#8B4513" strokeWidth="1" />
    {/* 鍵穴 */}
    <circle cx="8" cy="11" r="1" fill="#FFD700" />
    <rect x="7" y="6" width="2" height="2" fill="#FFD700" />
  </svg>
);

const HeartPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* ハート */}
    <circle cx="5" cy="4" r="2" fill="#FF1493" />
    <circle cx="11" cy="4" r="2" fill="#FF1493" />
    <rect x="3" y="6" width="10" height="8" fill="#FF1493" />
    <rect x="4" y="8" width="2" height="4" fill="#FFB6C1" />
    <rect x="10" y="8" width="2" height="4" fill="#FFB6C1" />
  </svg>
);

const BarPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* グラフ棒 */}
    <rect x="2" y="12" width="2" height="2" fill="#FF69B4" />
    <rect x="5" y="8" width="2" height="6" fill="#FF69B4" />
    <rect x="8" y="5" width="2" height="9" fill="#FF69B4" />
    <rect x="11" y="10" width="2" height="4" fill="#FF69B4" />
  </svg>
);

const TrophyPixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 持ち手左 */}
    <rect x="2" y="4" width="2" height="6" fill="#FFD700" />
    {/* トロフィー本体 */}
    <rect x="6" y="2" width="4" height="8" fill="#FFD700" />
    {/* 持ち手右 */}
    <rect x="12" y="4" width="2" height="6" fill="#FFD700" />
    {/* ベース */}
    <rect x="5" y="10" width="6" height="2" fill="#FFD700" />
    {/* 台 */}
    <rect x="4" y="12" width="8" height="2" fill="#CD7F32" />
  </svg>
);

// 🎲 サイコロのアイコン
const DicePixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* サイコロ本体 */}
    <rect x="2" y="2" width="12" height="12" fill="#FFFFFF" stroke="#000000" strokeWidth="1" rx="2" />
    {/* サイコロの点 */}
    <circle cx="5" cy="5" r="1" fill="#000000" />
    <circle cx="8" cy="8" r="1" fill="#000000" />
    <circle cx="11" cy="11" r="1" fill="#000000" />
    <circle cx="11" cy="5" r="1" fill="#000000" />
    <circle cx="5" cy="11" r="1" fill="#000000" />
  </svg>
);

// 👁️ 目のアイコン（閲覧数表示用）
const EyePixelArt = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="8" cy="8" rx="6" ry="4" fill="#4A90E2" />
    <circle cx="8" cy="8" r="2" fill="#2C3E50" />
    <circle cx="9" cy="7" r="1" fill="#ECF0F1" />
  </svg>
);

const Sidebar = ({
  activeTab,
  onSelect,
  isAdmin,
  onClose,
  isMobile = false,
}) => {
  const navItems = [
    {
      key: 'races',
      label: 'レース予想（未出走/過去）',
      icon: <HorsePixelArt size={20} />,
      isActive: activeTab === 'races-upcoming' || activeTab === 'races-past',
      onClick: () => onSelect('races-upcoming'),
      disabled: false,
    },
    {
      key: 'settings',
      label: 'コース設定',
      icon: <CrownPixelArt size={20} />,
      isActive: activeTab === 'settings',
      onClick: () => onSelect('settings'),
      disabled: !isAdmin,
    },
    {
      key: 'stats',
      label: '成績分析',
      icon: <BarPixelArt size={20} />,
      isActive: activeTab === 'stats',
      onClick: () => onSelect('stats'),
      disabled: false,
    },
    {
      key: 'factor-analysis',
      label: 'ファクター分析',
      icon: <DicePixelArt size={20} />,
      isActive: activeTab === 'factor-analysis',
      onClick: () => onSelect('factor-analysis'),
      disabled: false,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-pink-100 z-40 ${
        isMobile ? '' : 'hidden md:flex'
      } flex-col`}
    >
      <div className="px-6 pt-8 pb-6 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <HorsePixelArt size={28} />
          <div>
            <p className="text-xs font-bold text-pink-500 uppercase tracking-[0.3em]">
              Gyanchu Lab
            </p>
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              カテゴリ
            </h1>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 px-4 py-2 text-sm font-bold text-white shadow-lg hover:shadow-xl transition"
          >
            メニューを閉じる
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick();
                  if (isMobile && onClose) {
                    onClose();
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl transition flex items-center gap-3 font-bold ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-l-4 border-transparent'
                    : item.isActive
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 border-l-4 border-pink-500 shadow-md'
                    : 'text-gray-700 hover:bg-pink-50 border-l-4 border-transparent'
                }`}
              >
                <span className="flex items-center justify-center rounded-lg bg-pink-100 text-pink-600 p-1.5">
                  {item.icon}
                </span>
                <span className="text-[13px] leading-tight whitespace-nowrap">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-4">
        <button
          onClick={() => setShowAdminModal(true)}
          className="w-full text-left px-4 py-3 rounded-2xl transition flex items-center gap-3 font-bold text-sm text-purple-600 hover:bg-purple-50 border-l-4 border-transparent hover:border-purple-500"
        >
          <span className="flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 p-1.5">
            <span className="text-lg">⚙️</span>
          </span>
          <span className="text-[13px] leading-tight whitespace-nowrap">管理者の方はこちら</span>
        </button>
      </div>

      <div className="px-6 py-5 border-t border-pink-100 text-xs text-gray-500 font-bold space-y-2">
        <p>バージョン 3.x</p>
      </div>
    </aside>
  );
};

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBLXleQ28dQR-uDTKlYXSevefzc0vowh9k",
  authDomain: "gyanchu-horse-racing-app.firebaseapp.com",
  projectId: "gyanchu-horse-racing-app",
  storageBucket: "gyanchu-horse-racing-app.firebasestorage.app",
  messagingSenderId: "427377004973",
  appId: "1:427377004973:web:48fc4f3ee9796731039124",
  measurementId: "G-75KP9PB5YT"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const HorseAnalysisApp = () => {
  // アプリのバージョン
  const APP_VERSION = '3.2.0'; // バグ修正版
  
  // バージョンチェックを無効化する場合はこれをtrueに
  const DISABLE_VERSION_CHECK = true;
  
  // 初回レンダリング時にバージョンチェック
  useEffect(() => {
    if (DISABLE_VERSION_CHECK) {
      return;
    }
    
    const savedVersion = localStorage.getItem('appVersion');
    if (savedVersion !== APP_VERSION) {
      try {
        localStorage.setItem('appVersion', APP_VERSION);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error('localStorage error:', error);
      }
      return;
    }
  }, []);

  // 通知許可をリクエスト
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const [races, setRaces] = useState([]);
  const [currentRace, setCurrentRace] = useState(null);
  const [pasteText, setPasteText] = useState('');
  const [inputMode, setInputMode] = useState('paste');
  const [manualHorses, setManualHorses] = useState([]);
  const [editingHorse, setEditingHorse] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [raceName, setRaceName] = useState('');
  const [importMessage, setImportMessage] = useState('');
  const [importMessageType, setImportMessageType] = useState('');
  
  const [courseSettings, setCourseSettings] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('races-upcoming');
  const [courseName, setCourseName] = useState('');
  const [tempFactors, setTempFactors] = useState({
    '能力値': 15,
    'コース・距離適性': 18,
    '展開利': 17,
    '近走安定度': 10,
    '馬場適性': 10,
    '騎手': 5,
    '斤量': 10,
    '調教': 15
  });
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [statsFilterCourse, setStatsFilterCourse] = useState(null);
  const [selectedFactors, setSelectedFactors] = useState({
    'スピード能力値': true,
    'コース・距離適性': true,
    '展開利': true,
    '近走安定度': true,
    '馬場適性': true,
    '騎手': true,
    '斤量': true,
    '調教': true
  });

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultRanking, setResultRanking] = useState('');
  const [oddsInput, setOddsInput] = useState({});
  const [showOddsModal, setShowOddsModal] = useState(false);
  const [oddsInputMode, setOddsInputMode] = useState('manual');
  const [oddsPasteText, setOddsPasteText] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [showCourseSelectModal, setShowCourseSelectModal] = useState(false);
  const [memo, setMemo] = useState('');
  const [showMemoModal, setShowMemoModal] = useState(false);

  const [raceSelectedCourse, setRaceSelectedCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [raceToDelete, setRaceToDelete] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExcludeModal, setShowExcludeModal] = useState(false);
  const [excludedHorses, setExcludedHorses] = useState({});
  
  const [expCoefficient, setExpCoefficient] = useState(0.1);
  const [showExpModal, setShowExpModal] = useState(false);
  const [tempExpCoefficient, setTempExpCoefficient] = useState(0.1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🎲 仮想レース関連のstate
  const [showVirtualRaceModal, setShowVirtualRaceModal] = useState(false);
  const [virtualRaceResults, setVirtualRaceResults] = useState(null);
  const [simulationCount, setSimulationCount] = useState(1000); // デフォルトを1000回に変更
  const [isSimulating, setIsSimulating] = useState(false);

  const [showBettingModal, setShowBettingModal] = useState(false);
  const [bettingBudget, setBettingBudget] = useState(1000);
  const [bettingType, setBettingType] = useState('accuracy');
  const [generatedBets, setGeneratedBets] = useState([]);

  const [statsType, setStatsType] = useState('winrate');
  const [statsDateFilter, setStatsDateFilter] = useState({
    type: 'all',  // 'all' | 'single' | 'range'
    singleDate: null,
    startDate: null,
    endDate: null
  });

  // 新機能用のstate
  const [raceConfidence, setRaceConfidence] = useState(3);
  const [raceStartTime, setRaceStartTime] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [editingRaceId, setEditingRaceId] = useState(null);
  const [newRaceName, setNewRaceName] = useState('');
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourseKey, setEditingCourseKey] = useState(null);
  
  // 📝 コース設定名変更関連のstate
  const [showRenameCourseModal, setShowRenameCourseModal] = useState(false);
  const [renamingCourseKey, setRenamingCourseKey] = useState(null);
  const [newCourseName, setNewCourseName] = useState('');
  
  // ✏️ レース編集関連のstate
  const [showEditRaceModal, setShowEditRaceModal] = useState(false);
  const [editingRaceData, setEditingRaceData] = useState(null);

  // 🔒 パスコード関連のstate
  const [racePasscode, setRacePasscode] = useState('');
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [selectedLockedRace, setSelectedLockedRace] = useState(null);
  const [passcodeError, setPasscodeError] = useState('');

  // ✨ ファクター分析用のstate
  const [showFactorAnalysisModal, setShowFactorAnalysisModal] = useState(false);
  const [selectedAnalysisCourse, setSelectedAnalysisCourse] = useState(null);
  const [factorAnalysisResults, setFactorAnalysisResults] = useState(null);
  const [analysisDateFilter, setAnalysisDateFilter] = useState(null);

  // ソート・フィルター用のstate
  const [upcomingSortBy, setUpcomingSortBy] = useState('startTime'); // 'startTime' or 'createdAt'
  const [pastSortBy, setPastSortBy] = useState('newest'); // 'newest' or 'oldest'
  const [pastFilterCourse, setPastFilterCourse] = useState(null); // コースフィルター
  
  // 高度フィルター用のstate
  const [showAdvancedFilterModal, setShowAdvancedFilterModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    gapPositions: {
      after1st: false,   // 勝率1位の下に断層がある
      after2nd: false,   // 勝率2位の下に断層がある
      after3rd: false,    // 勝率3位の下に断層がある
      after4th: false,    // 勝率4位の下に断層がある
      after5th: false,    // 勝率5位の下に断層がある
      after6th: false     // 勝率6位以下の下に断層がある
    },
    gapCount: 'any',      // 'any' | 'exactly1' | 'exactly2' | '3plus'
    specialHorses: {
      hasExpectation: false,   // 期待値150以上の馬がいる
      hasSuperExp: false,      // 超期待値馬（220以上）がいる
      hasAiRec: false          // AIおすすめ馬がいる
    },
    resultFilter: {
      tanshoHit: false,    // 単勝的中したレース
      fukushoHit: false,   // 複勝的中したレース
      miss: false          // 不的中レース（単勝も複勝も外れ）
    }
  });

  // 勝率ランキングの印機能用のstate
  const [horseMarks, setHorseMarks] = useState({}); // { horseNum: mark } の形式
  const [editingHorseMark, setEditingHorseMark] = useState(null);
  const [tempHorseMark, setTempHorseMark] = useState('');
  const [expandedHorseNum, setExpandedHorseNum] = useState(null);
  useEffect(() => {
    setExpandedHorseNum(null);
  }, [currentRace?.firebaseId, currentRace?.id]);

  // 仮想レース視覚化用のstate
  const [showTrackDiagram, setShowTrackDiagram] = useState(false);

  // 勝率ランキング 詳細表示
  const [expandedHorseId, setExpandedHorseId] = useState(null);

  // 足切り偏差値設定用のstate（各ファクターごと）
  const [cutoffDeviations, setCutoffDeviations] = useState({
    'スピード能力値': 40.0, // デフォルト値
    'コース・距離適性': null,
    '展開利': null,
    '近走安定度': null,
    '馬場適性': null,
    '騎手': null,
    '斤量': null,
    '調教': null
  });

  const factors = [
    { name: '能力値', weight: 15, key: 'タイム指数' },
    { name: 'コース・距離適性', weight: 18, key: 'コース・距離適性' },
    { name: '展開利', weight: 17, key: '展開利' },
    { name: '近走安定度', weight: 10, key: '近走安定度' },
    { name: '馬場適性', weight: 10, key: '馬場適性' },
    { name: '騎手', weight: 5, key: '騎手' },
    { name: '斤量', weight: 10, key: '斤量' },
    { name: '調教', weight: 15, key: '調教' }
  ];

  // 🎲 仮想レースシミュレーター関数群（改善版）
  
  // 勝率を再配分(合計100%に正規化)
  const redistributeRates = (remaining) => {
    const total = Object.values(remaining).reduce((a, b) => a + b, 0);
    const redistributed = {};
    
    for (const [horse, rate] of Object.entries(remaining)) {
      redistributed[horse] = (rate / total) * 100;
    }
    
    return redistributed;
  };

  const handleSidebarSelect = (target) => {
    switch (target) {
      case 'races-upcoming':
        setActiveTab('races-upcoming');
        break;
      case 'settings':
        if (isAdmin) {
          setActiveTab('settings');
        }
        break;
      case 'stats':
        setActiveTab('stats');
        break;
      case 'factor-analysis':
        setActiveTab('factor-analysis');
        setShowFactorAnalysisModal(true);
        break;
      default:
        break;
    }

    if (target !== 'factor-analysis') {
      setShowFactorAnalysisModal(false);
    }
  };

  const toggleHorseDetails = (horseNum) => {
    setExpandedHorseId((prev) => (prev === horseNum ? null : horseNum));
  };
  
  // 勝率に基づいて1頭を抽選（改善版：累積確率法を使用）
  const drawHorse = (horsesDict) => {
    const horses = Object.keys(horsesDict);
    const rates = Object.values(horsesDict);
    
    // 累積確率を計算
    const cumulative = [];
    let sum = 0;
    for (let i = 0; i < rates.length; i++) {
      sum += rates[i];
      cumulative.push(sum);
    }
    
    // 0-100の乱数を生成
    const rand = Math.random() * 100;
    
    // 累積確率で抽選
    for (let i = 0; i < cumulative.length; i++) {
      if (rand <= cumulative[i]) {
        return horses[i];
      }
    }
    
    // フォールバック（通常は到達しない）
    return horses[horses.length - 1];
  };
  
  // 1回のレースをシミュレーション
  const simulateOneRace = (horses) => {
    const result = [];
    let remaining = { ...horses };
    
    // 1着の決定
    const first = drawHorse(remaining);
    result.push(first);
    delete remaining[first];
    
    // 2着の決定(勝率を再配分)
    remaining = redistributeRates(remaining);
    const second = drawHorse(remaining);
    result.push(second);
    delete remaining[second];
    
    // 3着の決定(勝率を再配分)
    remaining = redistributeRates(remaining);
    const third = drawHorse(remaining);
    result.push(third);
    
    return result;
  };
  
  // 仮想レースシミュレーション実行（改善版）
  const runVirtualRaceSimulation = () => {
    if (!currentRace || !currentRace.horses || currentRace.horses.length < 3) {
      window.alert('レースデータが不足しています。最低3頭の馬が必要です。');
      return;
    }
    
    setIsSimulating(true);
    
    // 少し遅延を入れてアニメーション効果を出す
    setTimeout(() => {
      // 各馬の期待勝率を計算
      const horses = {};
      
      // コース設定の重み
      const weights = currentRace.course && courseSettings[currentRace.course]
        ? courseSettings[currentRace.course]
        : {
            '能力値': 15,
            'コース・距離適性': 18,
            '展開利': 17,
            '近走安定度': 10,
            '馬場適性': 10,
            '騎手': 5,
            '斤量': 10,
            '調教': 15
          };
      
      // 各馬のtotalScoreを計算
      const horsesWithScores = currentRace.horses.map(horse => {
        let totalScore = 0;
        
        if (horse.scores) {
          Object.keys(weights).forEach(factor => {
            const factorKey = factor === '能力値' ? 'スピード能力値' : factor;
            if (horse.scores[factorKey] !== undefined) {
              totalScore += (horse.scores[factorKey] || 0) * (weights[factor] / 100);
            }
          });
        }
        
        return {
          ...horse,
          totalScore
        };
      }).filter(h => h.totalScore && h.totalScore > 0);
      
      if (horsesWithScores.length === 0) {
        window.alert('馬の評価スコア（scores）が計算されていません。');
        setIsSimulating(false);
        return;
      }
      
      // 指数関数を使った勝率計算
      const maxScore = Math.max(...horsesWithScores.map(h => h.totalScore));
      const exponentials = horsesWithScores.map(horse => ({
        ...horse,
        exp: Math.exp((horse.totalScore - maxScore) * (expCoefficient || 0.1))
      }));
      
      const sumExp = exponentials.reduce((sum, h) => sum + h.exp, 0);
      
      exponentials.forEach(horse => {
        const horseKey = `${horse.horseNum}番 ${horse.name}`;
        const winRate = (horse.exp / sumExp) * 100;
        horses[horseKey] = winRate;
      });
      
      // 集計カウンター初期化
      const results = {};
      for (const horse of Object.keys(horses)) {
        results[horse] = {
          '1着': 0,
          '2着': 0,
          '3着': 0,
          '4着以下': 0,
          '期待勝率': horses[horse]
        };
      }
      
      // シミュレーション実行
      for (let i = 0; i < simulationCount; i++) {
        const raceResult = simulateOneRace(horses);
        
        // 1着、2着、3着のカウント
        results[raceResult[0]]['1着']++;
        results[raceResult[1]]['2着']++;
        results[raceResult[2]]['3着']++;
        
        // 4着以下(着外)のカウント
        const top3 = new Set(raceResult);
        for (const horse of Object.keys(horses)) {
          if (!top3.has(horse)) {
            results[horse]['4着以下']++;
          }
        }
      }
      
      // 1着回数でソート
      const sortedResults = Object.entries(results).sort((a, b) => b[1]['1着'] - a[1]['1着']);
      
      setVirtualRaceResults({
        results: sortedResults,
        simulationCount: simulationCount,
        raceName: currentRace.name || '未設定'
      });
      
      setIsSimulating(false);
    }, 500);
  };


  // Firebase認証とデータ同期
  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error('Auth error:', err));

    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        
        // バージョンチェック
//         const versionRef = ref(database, 'appVersion');
//         onValue(versionRef, snapshot => {
//           const serverVersion = snapshot.val();
//           if (serverVersion && serverVersion !== APP_VERSION) {
//             window.alert('⚠️ アプリが古いバージョンです\n\n最新版を使用するため、ページを更新してください。\n\n更新方法：\n・Ctrl+Shift+R (Windows)\n・Cmd+Shift+R (Mac)');
//             
//             const interval = setInterval(() => {
//               window.alert('⚠️ このバージョンは使用できません\n\nページを更新してください');
//             }, 10000);
//             
//             setIsLoading(false);
//             setRaces([]);
//             return;
//           }
//         });
//         
        const racesRef = ref(database, 'races');
        onValue(racesRef, snapshot => {
          const data = snapshot.val();
          if (data) {
            const racesArray = Object.entries(data).map(([key, value]) => ({
              firebaseId: key,
              ...value
            }));
            setRaces(racesArray);
          } else {
            setRaces([]);
          }
          setIsLoading(false);
        });

        const settingsRef = ref(database, 'courseSettings');
        onValue(settingsRef, snapshot => {
          const data = snapshot.val();
          if (data) {
            setCourseSettings(data);
          } else {
            setCourseSettings({});
          }
        });
      }
    });
  }, []);

  const addManualHorse = () => {
    const newHorse = {
      horseNum: manualHorses.length + 1,
      name: '',
      scores: {
        'スピード能力値': 50,
        'コース・距離適性': 50,
        '展開利': 50,
        '近走安定度': 50,
        '馬場適性': 50,
        '騎手': 50,
        '斤量': 50,
        '調教': 50
      }
    };
    setManualHorses([...manualHorses, newHorse]);
    setEditingHorse(newHorse.horseNum);
  };

  const updateManualHorse = (horseNum, field, value) => {
    setManualHorses(manualHorses.map(h => 
      h.horseNum === horseNum 
        ? { ...h, [field]: value }
        : h
    ));
  };

  const updateManualHorseScore = (horseNum, factor, value) => {
    setManualHorses(manualHorses.map(h => 
      h.horseNum === horseNum 
        ? { ...h, scores: { ...h.scores, [factor]: parseFloat(value) || 0 } }
        : h
    ));
  };

  const deleteManualHorse = (horseNum) => {
    const filtered = manualHorses.filter(h => h.horseNum !== horseNum);
    const renumbered = filtered.map((h, idx) => ({
      ...h,
      horseNum: idx + 1
    }));
    setManualHorses(renumbered);
  };

  const parseHorseData = (text) => {
    const lines = text.trim().split('\n');
    const horses = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;
      if (line.includes('馬番') || line.includes('評価')) return;

      const match = line.match(/^(\d{1,2})(.+)$/);
      if (!match) return;

      const horseNum = parseInt(match[1]);
      const restOfLine = match[2];

      let horseName = '';
      let dataStart = 0;
      for (let i = 0; i < restOfLine.length; i++) {
        const char = restOfLine[i];
        if (/[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(char)) {
          horseName += char;
        } else if (horseName && /[\d.]/.test(char)) {
          dataStart = i;
          break;
        }
      }

      if (!horseName || dataStart === 0) return;

      const dataString = restOfLine.substring(dataStart);
      const numbers = dataString.match(/[\d.]+/g);

      if (!numbers || numbers.length < 8) return;

      const scores = {
        'スピード能力値': parseFloat(numbers[0]) || 0,
        'コース・距離適性': parseFloat(numbers[1]) || 0,
        '展開利': parseFloat(numbers[2]) || 0,
        '近走安定度': parseFloat(numbers[3]) || 0,
        '馬場適性': parseFloat(numbers[4]) || 0,
        '騎手': parseFloat(numbers[5]) || 0,
        '斤量': parseFloat(numbers[6]) || 0,
        '調教': parseFloat(numbers[7]) || 0
      };

      horses.push({
        horseNum,
        name: horseName,
        scores
      });
    });

    return horses;
  };

  const handleDataImport = () => {
    if (!raceName.trim()) {
      setImportMessage('レース名を入力してください');
      setImportMessageType('error');
      setTimeout(() => setImportMessage(''), 3000);
      return;
    }

    if (racePasscode && racePasscode.length !== 6) {
      setImportMessage('パスコードは6桁で入力してください');
      setImportMessageType('error');
      setTimeout(() => setImportMessage(''), 3000);
      return;
    }

    if (racePasscode && !/^\d{6}$/.test(racePasscode)) {
      setImportMessage('パスコードは数字6桁で入力してください');
      setImportMessageType('error');
      setTimeout(() => setImportMessage(''), 3000);
      return;
    }

    let horses = [];

    if (inputMode === 'paste') {
      if (!pasteText.trim()) {
        setImportMessage('データが入力されていません');
        setImportMessageType('error');
        setTimeout(() => setImportMessage(''), 3000);
        return;
      }
      horses = parseHorseData(pasteText);
    } else {
      if (manualHorses.length === 0) {
        setImportMessage('馬を1頭以上追加してください');
        setImportMessageType('error');
        setTimeout(() => setImportMessage(''), 3000);
        return;
      }
      
      const emptyNames = manualHorses.filter(h => !h.name.trim());
      if (emptyNames.length > 0) {
        setImportMessage('すべての馬に名前を入力してください');
        setImportMessageType('error');
        setTimeout(() => setImportMessage(''), 3000);
        return;
      }
      
      horses = manualHorses;
    }
    
    if (horses.length === 0) {
      setImportMessage('データの解析に失敗しました。');
      setImportMessageType('error');
      setTimeout(() => setImportMessage(''), 3000);
      return;
    }

    const newRace = {
      name: raceName,
      horses,
      createdAt: new Date().toLocaleDateString('ja-JP'),
      courseKey: selectedCourse,
      result: null,
      odds: {},
      memo: '',
      excluded: {},
      expCoefficient: 0.1,
      createdBy: userId,
      createdTime: new Date().toISOString(),
      passcode: racePasscode || null,
      confidence: raceConfidence || 3,
      startTime: raceStartTime || null,
      viewCount: 0
    };

    const racesRef = ref(database, 'races');
    push(racesRef, newRace);

    setPasteText('');
    setRaceName('');
    setRacePasscode('');
    setManualHorses([]);
    setInputMode('paste');
    setImportMessage(`${raceName}を追加しました！（${horses.length}頭）${racePasscode ? ' 🔒パスコード設定済み' : ''}`);
    setImportMessageType('success');
    setTimeout(() => {
      setImportMessage('');
      setShowUploadModal(false);
    }, 1500);
  };

  const saveCourseSettings = () => {
    if (!courseName.trim()) {
      window.alert('コース名を入力してください');
      return;
    }

    const total = Object.values(tempFactors).reduce((a, b) => a + b, 0);
    if (total !== 100) {
      window.alert(`比重の合計が100%ではありません（現在${total}%）`);
      return;
    }

    const newSettings = {
      ...courseSettings,
      [courseName]: { ...tempFactors }
    };
    
    const settingsRef = ref(database, 'courseSettings');
    set(settingsRef, newSettings);

    setCourseName('');
    setTempFactors({
      '能力値': 15,
      'コース・距離適性': 18,
      '展開利': 17,
      '近走安定度': 10,
      '馬場適性': 10,
      '騎手': 5,
      '斤量': 10,
      '調教': 15
    });
    setShowSettingsModal(false);
  };

  const deleteCourseSettings = (name) => {
    if (!window.confirm(`「${name}」を削除してもよろしいですか？`)) {
      return;
    }
    const newSettings = { ...courseSettings };
    delete newSettings[name];
    
    const settingsRef = ref(database, 'courseSettings');
    set(settingsRef, newSettings);
  };

  const deleteRace = (firebaseId) => {
    const raceRef = ref(database, `races/${firebaseId}`);
    remove(raceRef);
    setShowDeleteConfirm(false);
    setRaceToDelete(null);
  };

  const toggleExcludeHorse = (horseNum) => {
    const newExcluded = { ...excludedHorses };
    if (newExcluded[horseNum]) {
      delete newExcluded[horseNum];
    } else {
      newExcluded[horseNum] = true;
    }
    setExcludedHorses(newExcluded);
  };

  const saveExcludeSettings = () => {
    // 部分更新を使用
    const excludedRef = ref(database, `races/${currentRace.firebaseId}/excluded`);
    set(excludedRef, excludedHorses)
      .then(() => {
        setCurrentRace({
          ...currentRace,
          excluded: excludedHorses
        });
        setShowExcludeModal(false);
      })
      .catch((error) => {
        console.error('除外設定の保存に失敗:', error);
        window.alert('除外設定の保存に失敗しました');
      });
  };

  const saveExpCoefficient = () => {
    setExpCoefficient(tempExpCoefficient);
    // 部分更新を使用
    const expCoeffRef = ref(database, `races/${currentRace.firebaseId}/expCoefficient`);
    set(expCoeffRef, tempExpCoefficient)
      .then(() => {
        setCurrentRace({
          ...currentRace,
          expCoefficient: tempExpCoefficient
        });
        setShowExpModal(false);
      })
      .catch((error) => {
        console.error('EXP係数の保存に失敗:', error);
        window.alert('EXP係数の保存に失敗しました');
      });
  };

  // 🔒 パスコード認証処理
  const handlePasscodeSubmit = () => {
    if (!selectedLockedRace) return;

    if (passcodeInput === selectedLockedRace.passcode) {
      setCurrentRace(selectedLockedRace);
      setRaceSelectedCourse(selectedLockedRace.courseKey);
      setMemo(selectedLockedRace.memo || '');
      setOddsInput(selectedLockedRace.odds || {});
      setExcludedHorses(selectedLockedRace.excluded || {});
      setExpCoefficient(selectedLockedRace.expCoefficient || 0.1);
      setHorseMarks(selectedLockedRace.horseMarks || {});  // ← 印の読み込み
      
      // デバッグ用ログ
      console.log('パスコード認証後、レースを読み込み:', {
        raceId: selectedLockedRace.firebaseId,
        raceName: selectedLockedRace.name,
        horseMarks: selectedLockedRace.horseMarks
      });
      
      // 足切り偏差値設定を読み込む
      if (selectedLockedRace.cutoffDeviations) {
        setCutoffDeviations(selectedLockedRace.cutoffDeviations);
      } else {
        // デフォルト値にリセット
        setCutoffDeviations({
          'スピード能力値': 40.0,
          'コース・距離適性': null,
          '展開利': null,
          '近走安定度': null,
          '馬場適性': null,
          '騎手': null,
          '斤量': null,
          '調教': null
        });
      }
      
      setShowPasscodeModal(false);
      setPasscodeInput('');
      setPasscodeError('');
      setSelectedLockedRace(null);
      
      // 👁️ 閲覧数をカウント
      incrementViewCount(selectedLockedRace.firebaseId);
    } else {
      setPasscodeError('パスコードが違います');
      setPasscodeInput('');
    }
  };

  // 👁️ 閲覧数をカウント（管理者以外のみ）
  const incrementViewCount = (raceId) => {
    if (!isAdmin && raceId) {
      const race = races.find(r => r.firebaseId === raceId);
      const currentCount = race?.viewCount || 0;
      const raceRef = ref(database, `races/${raceId}/viewCount`);
      set(raceRef, currentCount + 1);
    }
  };

  // 🔒 レースクリック時の処理
  const handleRaceClick = (race) => {
    if (race.passcode && !isAdmin) {
      setSelectedLockedRace(race);
      setShowPasscodeModal(true);
      setPasscodeInput('');
      setPasscodeError('');
    } else {
      setCurrentRace(race);
      setRaceSelectedCourse(race.courseKey);
      setMemo(race.memo || '');
      setOddsInput(race.odds || {});
      setExcludedHorses(race.excluded || {});
      setExpCoefficient(race.expCoefficient || 0.1);
      setHorseMarks(race.horseMarks || {});  // ← 印の読み込み
      
      // デバッグ用ログ
      console.log('レースを読み込み:', {
        raceId: race.firebaseId,
        raceName: race.name,
        horseMarks: race.horseMarks
      });
      
      // 足切り偏差値設定を読み込む
      if (race.cutoffDeviations) {
        setCutoffDeviations(race.cutoffDeviations);
      } else {
        // デフォルト値にリセット
        setCutoffDeviations({
          'スピード能力値': 40.0,
          'コース・距離適性': null,
          '展開利': null,
          '近走安定度': null,
          '馬場適性': null,
          '騎手': null,
          '斤量': null,
          '調教': null
        });
      }
      
      // 👁️ 閲覧数をカウント
      incrementViewCount(race.firebaseId);
    }
  };

  // ✏️ レース名を変更
  const handleRenameRace = (raceId, currentName) => {
    setEditingRaceId(raceId);
    setNewRaceName(currentName);
    setShowRenameModal(true);
  };

  const saveRaceName = () => {
    if (editingRaceId && newRaceName.trim()) {
      const raceRef = ref(database, `races/${editingRaceId}/name`);
      set(raceRef, newRaceName.trim())
        .then(() => {
          setShowRenameModal(false);
          setEditingRaceId(null);
          setNewRaceName('');
        })
        .catch((error) => {
          console.error('レース名の更新に失敗:', error);
          window.alert('レース名の更新に失敗しました');
        });
    }
  };

  // 🎛️ コース設定を編集
  const handleEditCourse = (courseKey) => {
    const courseData = courseSettings[courseKey];
    if (courseData) {
      setEditingCourseKey(courseKey);
      setCourseName(courseKey);
      setTempFactors(courseData);
      setShowEditCourseModal(true);
    }
  };

  const saveEditedCourse = () => {
    if (editingCourseKey && courseName.trim()) {
      const total = Object.values(tempFactors).reduce((a, b) => a + b, 0);
      if (total !== 100) {
        window.alert(`比重の合計が100%ではありません（現在${total}%）`);
        return;
      }
      
      const settingsRef = ref(database, `courseSettings/${courseName}`);
      set(settingsRef, tempFactors)
        .then(() => {
          setShowEditCourseModal(false);
          setEditingCourseKey(null);
          setCourseName('');
        })
        .catch((error) => {
          console.error('コース設定の更新に失敗:', error);
          window.alert('コース設定の更新に失敗しました');
        });
    }
  };

  // 📝 コース設定名変更処理
  const handleRenameCourse = (courseKey) => {
    setRenamingCourseKey(courseKey);
    setNewCourseName(courseKey);
    setShowRenameCourseModal(true);
  };

  // 🔧 印データを初期化（全レースに空の印データを追加）
  const initializeHorseMarks = () => {
    if (!window.confirm('全レースに空の印データを追加しますか？\n（既存の印は保持されます）')) {
      return;
    }
    
    let updatedCount = 0;
    const promises = races.map(race => {
      if (!race.horseMarks && race.firebaseId) {
        const raceRef = ref(database, `races/${race.firebaseId}/horseMarks`);
        updatedCount++;
        return set(raceRef, {});
      }
      return Promise.resolve();
    });
    
    Promise.all(promises)
      .then(() => {
        window.alert(`✅ 印データの初期化が完了しました\n（${updatedCount}件のレースを更新）`);
      })
      .catch((error) => {
        console.error('印データの初期化に失敗:', error);
        window.alert('❌ 印データの初期化に失敗しました');
      });
  };

  // 📝 コース設定名を保存
  const saveCourseName = () => {
    if (!renamingCourseKey || !newCourseName.trim()) {
      window.alert('コース名を入力してください');
      return;
    }
    
    if (newCourseName === renamingCourseKey) {
      setShowRenameCourseModal(false);
      return;
    }
    
    // 同名のコース設定が既に存在するかチェック
    if (courseSettings[newCourseName]) {
      window.alert('同じ名前のコース設定が既に存在します');
      return;
    }
    
    // 新しい名前でコース設定を保存
    const courseData = courseSettings[renamingCourseKey];
    const newSettings = { ...courseSettings };
    
    // 古い名前を削除
    delete newSettings[renamingCourseKey];
    
    // 新しい名前で追加
    newSettings[newCourseName] = courseData;
    
    // Firebaseに保存
    const settingsRef = ref(database, 'courseSettings');
    set(settingsRef, newSettings)
      .then(() => {
        // このコース設定を使用しているレースの参照も更新
        const racesUsingThisCourse = races.filter(r => r.courseKey === renamingCourseKey);
        
        racesUsingThisCourse.forEach(race => {
          const raceRef = ref(database, `races/${race.firebaseId}/courseKey`);
          set(raceRef, newCourseName);
        });
        
        setShowRenameCourseModal(false);
        setRenamingCourseKey(null);
        setNewCourseName('');
      })
      .catch((error) => {
        console.error('コース名の変更に失敗:', error);
        window.alert('コース名の変更に失敗しました');
      });
  };

  // 🕐 発走時間をフォーマット
  const formatStartTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  // ⭐ 星を表示
  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= count ? "text-yellow-400" : "text-gray-300"}
            style={{ fontSize: '12px' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const oddsExcludeKeywords = [
    '馬メモ',
    'レース別馬メモ',
    '全角',
    '文字以内',
    '削除',
    '保存',
    '閉じる',
    '次走買い',
    '次走消し',
    '不利',
    '馬場向かず',
    'ペース合わず',
    'ハイレベル戦',
    '好ラップ',
    '編集',
    '/100',
    '/500'
  ];

  // オッズ判定（オッズと人気順位の区別）
  const isOddsValue = (value, parts, index) => {
    if (!value) return false;
    
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    
    // 人気順位は通常1～18の整数
    if (Number.isInteger(num) && num > 0 && num <= 18) {
      return false;
    }
    
    // 小数点を含み、現実的な範囲ならオッズ
    if (value.includes('.') && num >= 1.0 && num < 1000) {
      return true;
    }
    
    // 後ろから2列目にある1.0以上の数値はオッズの可能性が高い
    if (index === parts.length - 2 && num >= 1.0 && num < 1000) {
      return true;
    }
    
    return false;
  };

  // オッズ貼り付けデータを解析して反映
  const parseAndSetOdds = () => {
    if (!oddsPasteText.trim()) {
      window.alert('データが入力されていません');
      return;
    }

    console.log('=== オッズ解析開始 ===');

    console.clear();
    console.log('=== オッズ解析開始 ===');

    const rawLines = oddsPasteText.trim().split(/\r?\n/);
    const lines = rawLines.filter((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '--' || trimmed === '---') return false;
      if (oddsExcludeKeywords.some((keyword) => trimmed.includes(keyword))) return false;
      return true;
    });

    console.log('有効な行数:', lines.length);

    if (lines.length === 0) {
      window.alert('データの解析に失敗しました。手入力モードをご利用ください。');
      return;
    }

    const parsedOdds = {};
    let currentHorseNum = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(/[\t\s]+/).filter((p) => p && p.trim());

      console.log(`\n行${i + 1}:`, line);
      console.log('  分割:', parts);

      const numEntries = parts
        .slice(0, 4)
        .map((p, idx) => ({ value: parseInt(p, 10), idx }))
        .filter(({ value }) => !Number.isNaN(value) && value >= 1 && value <= 18);

      let horseNumCandidate = null;
      if (numEntries.length >= 2) {
        horseNumCandidate = numEntries[1].value;
      } else if (numEntries.length === 1) {
        horseNumCandidate = numEntries[0].value;
      }

      if (horseNumCandidate) {
        currentHorseNum = horseNumCandidate;
        console.log(`  → 馬番検出: ${currentHorseNum}`);
        continue;
      }

      if (currentHorseNum && !parsedOdds[currentHorseNum]) {
        const decimalMatches = line.match(/\d+\.\d+/g);
        if (decimalMatches && decimalMatches.length > 0) {
          console.log('  小数候補:', decimalMatches);
          const odds = parseFloat(decimalMatches[decimalMatches.length - 1]);
          parsedOdds[currentHorseNum] = odds;
          console.log(`  ✅ 馬番${currentHorseNum}: ${odds}倍`);
          currentHorseNum = null;
          continue;
        }
      }
    }

    console.log('\n=== 結果 ===');
    console.log(parsedOdds);

    const successCount = Object.keys(parsedOdds).length;

    if (successCount === 0) {
      window.alert('オッズを解析できませんでした。\nF12でコンソールを確認してください。');
      return;
    }

    const raceHorses = (currentRace?.horses || []).map((h) => ({
      num: h.horseNum,
      name: h.name
    }));

    const foundHorses = raceHorses.filter((h) => parsedOdds[h.num]);
    const missingHorses = raceHorses.filter((h) => !parsedOdds[h.num]);

    let message = `✅ ${successCount}頭のオッズを読み込みました\n\n`;

    foundHorses.slice(0, 5).forEach((h) => {
      message += `${h.num}番 ${h.name}: ${parsedOdds[h.num]}倍\n`;
    });
    if (foundHorses.length > 5) {
      message += `...他${foundHorses.length - 5}頭\n`;
    }

    if (missingHorses.length > 0) {
      message += `\n⚠️ 未検出: ${missingHorses.length}頭\n`;
      missingHorses.forEach((h) => {
        message += `${h.num}番 ${h.name}\n`;
      });
    }

    setOddsInput(parsedOdds);
    setOddsPasteText('');
    setOddsInputMode('manual');
    window.alert(message);
  };

  const calculateWinRate = (horses, courseKey = null) => {
    if (!horses || horses.length === 0) return [];

    const weights = courseKey && courseSettings[courseKey]
      ? courseSettings[courseKey]
      : {
        '能力値': 15,
        'コース・距離適性': 18,
        '展開利': 17,
        '近走安定度': 10,
        '馬場適性': 10,
        '騎手': 5,
        '斤量': 10,
        '調教': 15
      };

    const activeHorses = horses.filter(horse => !excludedHorses[horse.horseNum]);

    const horsesWithScores = activeHorses.map(horse => {
      let totalScore = 0;
      Object.keys(weights).forEach(factor => {
        const factorKey = factor === '能力値' ? 'スピード能力値' : factor;
        if (selectedFactors[factorKey]) {
          totalScore += (horse.scores[factorKey] || 0) * (weights[factor] / 100);
        }
      });
      return {
        ...horse,
        totalScore
      };
    });

    if (horsesWithScores.length === 0) return [];

    const maxScore = Math.max(...horsesWithScores.map(h => h.totalScore));
    const exponentials = horsesWithScores.map(horse => ({
      ...horse,
      exp: Math.exp((horse.totalScore - maxScore) * expCoefficient)
    }));

    const sumExp = exponentials.reduce((sum, h) => sum + h.exp, 0);

    return exponentials.map(horse => ({
      ...horse,
      winRate: (horse.exp / sumExp) * 100
    })).sort((a, b) => b.winRate - a.winRate);
  };

  const calculateExpectationRanking = (horses, odds) => {
    if (!odds || Object.keys(odds).length === 0) return {};
    
    const expectations = horses
      .map(horse => {
        const horseOdds = odds[horse.horseNum] || 0;
        const value = horseOdds * horse.winRate;
        return { horseNum: horse.horseNum, value };
      })
      .filter(e => e.value > 0)
      .sort((a, b) => b.value - a.value);
    
    const ranking = {};
    expectations.forEach((e, idx) => {
      ranking[e.horseNum] = idx + 1;
    });
    
    return ranking;
  };

  const calculateAIRecommendation = (horses, odds = null) => {
    const oddsToUse = odds || oddsInput;
    const candidates = horses.filter(horse => {
      const horseOdds = oddsToUse[horse.horseNum] || 0;
      const value = horseOdds * horse.winRate;
      return value >= 100 && horse.winRate >= 10;
    });
    
    if (candidates.length === 0) return null;
    
    return candidates.sort((a, b) => b.winRate - a.winRate)[0];
  };

  // 全ファクターの偏差値を計算する関数
  const calculateFactorDeviations = (horses) => {
    if (!horses || horses.length === 0) return {};
    
    // 除外されていない馬を取得
    const activeHorses = horses.filter(horse => !excludedHorses[horse.horseNum]);
    
    if (activeHorses.length === 0) return {};
    
    // デバッグ: 最初の馬のscoresのキー名を確認（管理者のみ）
    if (isAdmin && activeHorses.length > 0 && activeHorses[0].scores) {
      const actualKeys = Object.keys(activeHorses[0].scores);
      console.log('[足切り機能] 実際のscoresキー名:', actualKeys);
    }
    
    // 全ファクターのキーリスト
    const factorKeys = ['スピード能力値', 'コース・距離適性', '展開利', '近走安定度', '馬場適性', '騎手', '斤量', '調教'];
    
    // 各ファクターごとに偏差値を計算
    const deviationsByFactor = {};
    
    factorKeys.forEach(factorKey => {
      // 各馬の該当ファクターの値を取得
      const values = activeHorses
        .map(horse => {
          // デバッグ: 実際のキー名を確認
          if (horse.scores) {
            const actualKeys = Object.keys(horse.scores);
            // キー名が一致しない場合のフォールバック（念のため）
            if (!horse.scores[factorKey] && factorKey === 'スピード能力値' && horse.scores['タイム指数']) {
              return parseFloat(horse.scores['タイム指数']);
            }
          }
          return horse.scores && horse.scores[factorKey] ? parseFloat(horse.scores[factorKey]) : null;
        })
        .filter(val => val !== null && !isNaN(val));
      
      if (values.length === 0) {
        deviationsByFactor[factorKey] = {};
        return;
      }
      
      // 平均を計算
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      // 標準偏差を計算
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      // 標準偏差が0の場合（全ての馬が同じ値）は偏差値を計算できない
      if (stdDev === 0 || isNaN(stdDev)) {
        // 全ての馬に偏差値50（平均値）を設定するか、nullを設定
        const deviationMap = {};
        activeHorses.forEach(horse => {
          deviationMap[horse.horseNum] = null; // 偏差値が計算できない場合はnull
        });
        deviationsByFactor[factorKey] = deviationMap;
        return;
      }
      
      // 各馬の偏差値を計算
      const deviationMap = {};
      activeHorses.forEach(horse => {
        // キー名のフォールバック処理
        let value = null;
        if (horse.scores) {
          if (horse.scores[factorKey]) {
            value = parseFloat(horse.scores[factorKey]);
          } else if (factorKey === 'スピード能力値' && horse.scores['タイム指数']) {
            value = parseFloat(horse.scores['タイム指数']);
          }
        }
        
        if (value !== null && !isNaN(value) && stdDev > 0) {
          deviationMap[horse.horseNum] = 50 + 10 * (value - mean) / stdDev;
        } else {
          deviationMap[horse.horseNum] = null;
        }
      });
      
      deviationsByFactor[factorKey] = deviationMap;
    });
    
    return deviationsByFactor;
  };

  // タイム指数（スピード能力値）の偏差値を計算する関数（後方互換性のため残す）
  const calculateTimeIndexDeviation = (horses) => {
    const allDeviations = calculateFactorDeviations(horses);
    return allDeviations['スピード能力値'] || {};
  };

  // 基準未達の馬を判定する関数
  const isCutoffFailed = (horse) => {
    const allFactorDeviations = calculateFactorDeviations(currentRace.horses);
    const failedFactors = [];
    Object.keys(cutoffDeviations).forEach(factorKey => {
      const cutoff = cutoffDeviations[factorKey];
      if (cutoff !== null && cutoff !== undefined && !isNaN(cutoff)) {
        const deviation = allFactorDeviations[factorKey]?.[horse.horseNum];
        if (deviation !== null && deviation !== undefined && !isNaN(deviation)) {
          if (deviation < cutoff) {
            failedFactors.push(factorKey);
          }
        }
      }
    });
    return failedFactors.length > 0;
  };

  // 期待値150以上の馬を取得
  const getExpectationHorses = (horses) => {
    return horses.filter(h => {
      const odds = oddsInput[h.horseNum] || 0;
      return h.winRate >= 10 && odds * h.winRate >= 150;
    });
  };

  // 券種の点数を計算する関数
  const calculateBetPoints = (betType, horses) => {
    if (betType === '単勝') {
      return horses.length;
    } else if (betType === '馬単') {
      // 馬単: 1着の数 × 2着の数
      const parts = horses[0].split('→');
      if (parts.length === 2) {
        const first = parts[0].split(',').length;
        const second = parts[1].split(',').length;
        return first * second;
      }
      return 0;
    } else if (betType === '馬連' || betType === 'ワイド') {
      // 馬連/ワイド: 組み合わせ数
      const parts = horses[0].split('-');
      if (parts.length === 2) {
        const first = parts[0].split(',').length;
        const second = parts[1].split(',').length;
        return first * second;
      }
      return 0;
    } else if (betType === '馬連BOX') {
      // 馬連BOX: nC2
      const nums = horses[0].split(',').length;
      return (nums * (nums - 1)) / 2;
    } else if (betType === '馬連マルチ') {
      // 馬連マルチ: 各組み合わせの合計
      return horses.length;
    } else if (betType === '3連単BOX') {
      // 3連単BOX: nP3 = n × (n-1) × (n-2)
      const nums = horses[0].split(',').length;
      return nums * (nums - 1) * (nums - 2);
    } else if (betType === '3連複BOX') {
      // 3連複BOX: nC3
      const nums = horses[0].split(',').length;
      return (nums * (nums - 1) * (nums - 2)) / 6;
    } else if (betType === '3連単フォーメーション') {
      // 3連単フォーメーション: 1着 × 2着 × 3着
      // 「軸:」「相手:」「ヒモ:」の形式にも対応
      let first = 0, second = 0, third = 0;
      if (horses[0]?.includes('軸:') || horses[0]?.includes('1着:')) {
        const firstStr = horses[0].split(':')[1]?.trim() || '';
        first = firstStr.split(',').filter(s => s.trim()).length;
      } else {
        first = horses[0]?.split(':')[1]?.split(',').filter(s => s.trim()).length || 0;
      }
      if (horses[1]?.includes('相手:') || horses[1]?.includes('2着:')) {
        const secondStr = horses[1].split(':')[1]?.trim() || '';
        second = secondStr.split(',').filter(s => s.trim()).length;
      } else {
        second = horses[1]?.split(':')[1]?.split(',').filter(s => s.trim()).length || 0;
      }
      if (horses[2]?.includes('ヒモ:') || horses[2]?.includes('3着:')) {
        const thirdStr = horses[2].split(':')[1]?.trim() || '';
        third = thirdStr.split(',').filter(s => s.trim()).length;
      } else {
        third = horses[2]?.split(':')[1]?.split(',').filter(s => s.trim()).length || 0;
      }
      return first * second * third;
    } else if (betType === '3連複フォーメーション') {
      const parseGroup = (entry) => {
        if (!entry) return [];
        const [, list = ''] = entry.split(':');
        return list
          .split(',')
          .map((s) => {
            const num = parseInt(s.trim(), 10);
            return Number.isNaN(num) ? null : num;
          })
          .filter((num) => num !== null);
      };

      const groupA = parseGroup(horses[0]);
      const groupB = parseGroup(horses[1]);
      const groupC = parseGroup(horses[2]);

      if (groupA.length === 0 || groupB.length === 0 || groupC.length === 0) {
        return 0;
      }

      const combos = new Set();

      groupA.forEach((a) => {
        groupB.forEach((b) => {
          groupC.forEach((c) => {
            if (a === b || a === c || b === c) {
              return;
            }
            const sorted = [a, b, c].sort((x, y) => x - y).join('-');
            combos.add(sorted);
          });
        });
      });

      return combos.size;
    } else if (betType === '3連複2頭軸') {
      // 3連複2頭軸: 軸2頭 × 相手
      const axis = horses[0].split(':')[1]?.split(',').length || 0;
      const opponent = horses[1]?.split(':')[1]?.split(',').length || 0;
      return (axis * (axis - 1) / 2) * opponent;
    }
    return 0;
  };

  // 買い目自動生成（新仕様）
  const generateBettingRecommendations = () => {
    const budget = bettingBudget;
    const bets = [];
    
    if (!currentRace || !currentRace.horses || resultsWithRate.length === 0) {
      bets.push({
        type: '情報',
        horses: [],
        amount: 0,
        points: 0,
        reason: 'レースデータが不足しています',
        warning: null
      });
      setGeneratedBets(bets);
      return;
    }

    // 断層を検出
    const gaps = detectWinRateGaps(resultsWithRate);
    
    // 期待値馬を取得
    const expectationHorses = getExpectationHorses(resultsWithRate);
    
    // 基準未達の馬を除外したリスト
    const nonCutoffFailedHorses = resultsWithRate.filter(h => !isCutoffFailed(h));
    
    // 各パターンの判定と買い目生成
    let planA = null;
    let planB = null;
    let planC = null;
    let needsWarning = false;
    
    // ①勝率3位の下に断層があり、断層の数が正確に1つの場合
    if (gaps.length === 1 && gaps.includes(2)) {
      const top3 = resultsWithRate.slice(0, 3);
      const winRate7Plus = resultsWithRate.filter(h => h.winRate >= 7);
      
      // A案: 3連複フォーメーション
      const axisNums = top3.map(h => h.horseNum);
      const axisHorses = axisNums.join(',');
      const opponentNums = winRate7Plus.map(h => h.horseNum);
      const himoNums = opponentNums.length > 0 ? opponentNums : axisNums;
      const formationA = [
        `軸: ${axisNums.join(',')}`,
        `相手: ${axisNums.join(',')}`,
        `ヒモ: ${himoNums.join(',')}`
      ];
      const pointsA = calculateBetPoints('3連複フォーメーション', formationA);
      planA = {
        type: '3連複フォーメーション',
        horses: formationA,
        amount: pointsA * 100,
        points: pointsA,
        reason: '勝率3位の下に断層、3連複フォーメーション',
        warning: null
      };
      
      // B案: 馬連BOX
      const pointsB = calculateBetPoints('馬連BOX', [axisHorses]);
      planB = {
        type: '馬連BOX',
        horses: [axisHorses],
        amount: pointsB * 100,
        points: pointsB,
        reason: '勝率1,2,3位',
        warning: null
      };
      
      // C案
      planC = {
        type: '情報',
        horses: [],
        amount: 0,
        points: 0,
        reason: '予算不足です。タイミーでバイトしておいで！',
        warning: null
      };
    }
    // ②勝率4位の下に断層があり、断層の数が正確に1つの場合
    else if (gaps.length === 1 && gaps.includes(3)) {
      const top4 = resultsWithRate.slice(0, 4);
      const top4Nums = top4.map(h => h.horseNum).join(',');
      
      // A案: 3連単BOX
      const pointsA = calculateBetPoints('3連単BOX', [top4Nums]);
      planA = {
        type: '3連単BOX',
        horses: [top4Nums],
        amount: pointsA * 100,
        points: pointsA,
        reason: '上位4頭',
        warning: null
      };
      
      // B案: 3連複BOX
      const pointsB = calculateBetPoints('3連複BOX', [top4Nums]);
      planB = {
        type: '3連複BOX',
        horses: [top4Nums],
        amount: pointsB * 100,
        points: pointsB,
        reason: '上位4頭',
        warning: null
      };
      
      // C案
      planC = {
        type: '情報',
        horses: [],
        amount: 0,
        points: 0,
        reason: 'そんなんじゃコンビニでお弁当も買えないぜ、、、',
        warning: null
      };
    }
    // ③勝率5位以下の下に断層があり、断層の数が正確に1つの場合
    else if (gaps.length === 1 && gaps[0] >= 4) {
      const gapIndex = gaps[0];
      const aboveGap = resultsWithRate.slice(0, gapIndex + 1);
      const expAboveGap = aboveGap.filter(h => {
        const odds = oddsInput[h.horseNum] || 0;
        return h.winRate >= 10 && odds * h.winRate >= 150;
      });
      
      if (expAboveGap.length > 0) {
        // A案: 3連単フォーメーション
        const firstHorse = expAboveGap[0].horseNum;
        // 2着: 断層の上の馬すべて（1着を除く）
        const secondHorses = aboveGap
          .filter(h => h.horseNum !== firstHorse)
          .map(h => h.horseNum)
          .join(',');
        // 3着: 断層の上の馬すべて（1着を除く）
        const thirdHorses = aboveGap
          .filter(h => h.horseNum !== firstHorse)
          .map(h => h.horseNum)
          .join(',');
        const pointsA = calculateBetPoints('3連単フォーメーション', [
          `1着: ${firstHorse}`,
          `2着: ${secondHorses}`,
          `3着: ${thirdHorses}`
        ]);
        planA = {
          type: '3連単フォーメーション',
          horses: [`1着: ${firstHorse}`, `2着: ${secondHorses}`, `3着: ${thirdHorses}`],
          amount: pointsA * 100,
          points: pointsA,
          reason: '断層の上に期待値馬あり、3連単フォーメーション',
          warning: null
        };
        
      // B案: 3連複フォーメーション
      let axis1, axis2;
      if (expAboveGap.length >= 2) {
        // 期待値馬が2頭以上: 最も勝率の高い期待値馬と2番目
        axis1 = expAboveGap[0].horseNum;
        axis2 = expAboveGap[1].horseNum;
      } else if (expAboveGap.length === 1) {
        // 期待値馬が1頭のみ: 期待値馬と勝率2位の馬
        axis1 = expAboveGap[0].horseNum;
        const aboveGapWithoutAxis1 = aboveGap.filter(h => h.horseNum !== axis1);
        axis2 = aboveGapWithoutAxis1.length > 0 ? aboveGapWithoutAxis1[0].horseNum : axis1;
      } else {
        // 期待値馬がいない場合（通常はここには来ない）
        axis1 = aboveGap[0]?.horseNum;
        axis2 = aboveGap[1]?.horseNum || axis1;
      }
      
      // 相手馬から軸馬を除外
      const opponent = aboveGap
        .filter(h => h.horseNum !== axis1 && h.horseNum !== axis2)
        .map(h => h.horseNum)
        .join(',');
      
      const opponentCount = aboveGap.filter(h => h.horseNum !== axis1 && h.horseNum !== axis2).length;
      const pointsB = (axis1 === axis2 ? 0 : 1 * opponentCount);
      planB = {
        type: '3連複フォーメーション',
        horses: [`軸1: ${axis1}`, `軸2: ${axis2}`, `相手: ${opponent}`],
        amount: pointsB * 100,
        points: pointsB,
        reason: '断層の上に期待値馬あり、3連複フォーメーション',
        warning: null
      };
      } else {
        needsWarning = true;
      }
      
      // C案
      planC = {
        type: '情報',
        horses: [],
        amount: 0,
        points: 0,
        reason: 'ここはある程度予算が必要なレースなんだ、、、ごめんよ、、、',
        warning: null
      };
    }
    // ④勝率1位の下に断層があり、勝率3位以下の下に断層がある（断層2つ）
    else if (gaps.length === 2 && gaps.includes(0) && gaps.some(g => g >= 3)) {
      const top1 = resultsWithRate[0];
      const secondGapIndex = gaps.find(g => g >= 3);
      const winRate5Plus = resultsWithRate.filter(h => h.winRate >= 5);
      const aboveSecondGap = resultsWithRate.slice(0, secondGapIndex + 1);
      
      // A案: 3連単フォーメーション
      // 2着: 勝率5%以上の馬（1着を除く）
      const secondHorses = winRate5Plus
        .filter(h => h.horseNum !== top1.horseNum)
        .map(h => h.horseNum)
        .join(',');
      // 3着: 勝率5%以上の馬（1着を除く）
      const thirdHorses = winRate5Plus
        .filter(h => h.horseNum !== top1.horseNum)
        .map(h => h.horseNum)
        .join(',');
      const pointsA = calculateBetPoints('3連単フォーメーション', [
        `1着: ${top1.horseNum}`,
        `2着: ${secondHorses}`,
        `3着: ${thirdHorses}`
      ]);
      planA = {
        type: '3連単フォーメーション',
        horses: [`1着: ${top1.horseNum}`, `2着: ${secondHorses}`, `3着: ${thirdHorses}`],
        amount: pointsA * 100,
        points: pointsA,
        reason: '勝率1位の下に断層、5%以上の馬に流し',
        warning: null
      };
      
      // B案: 3連単フォーメーション
      // 2着: 2つ目の断層より上の馬（1着を除く）
      const secondHorsesB = aboveSecondGap
        .filter(h => h.horseNum !== top1.horseNum)
        .map(h => h.horseNum)
        .join(',');
      const pointsB = calculateBetPoints('3連単フォーメーション', [
        `1着: ${top1.horseNum}`,
        `2着: ${secondHorsesB}`,
        `3着: ${thirdHorses}`
      ]);
      planB = {
        type: '3連単フォーメーション',
        horses: [`1着: ${top1.horseNum}`, `2着: ${secondHorsesB}`, `3着: ${thirdHorses}`],
        amount: pointsB * 100,
        points: pointsB,
        reason: '勝率1位の下に断層、2つ目の断層より上に流し',
        warning: null
      };
      
      // C案: 単勝
      planC = {
        type: '単勝',
        horses: [`${top1.horseNum}`],
        amount: 100,
        points: 1,
        reason: '勝率1位',
        warning: null
      };
    }
    // ⑤勝率1位の下に断層があり、勝率2位の下にも断層がある（断層2つ）
    else if (gaps.length === 2 && gaps.includes(0) && gaps.includes(1)) {
      const top1 = resultsWithRate[0];
      const top2 = resultsWithRate[1];
      const winRate5Plus = resultsWithRate.filter(h => h.winRate >= 5);
      const top345 = resultsWithRate.slice(2, 5);
      
      // A案: 3連単フォーメーション
      // 3着: 勝率5%以上の馬（1着、2着を除く）
      const thirdHorses = winRate5Plus
        .filter(h => h.horseNum !== top1.horseNum && h.horseNum !== top2.horseNum)
        .map(h => h.horseNum)
        .join(',');
      const pointsA = calculateBetPoints('3連単フォーメーション', [
        `1着: ${top1.horseNum}`,
        `2着: ${top2.horseNum}`,
        `3着: ${thirdHorses}`
      ]);
      planA = {
        type: '3連単フォーメーション',
        horses: [`1着: ${top1.horseNum}`, `2着: ${top2.horseNum}`, `3着: ${thirdHorses}`],
        amount: pointsA * 100,
        points: pointsA,
        reason: '勝率1,2位の下に断層、5%以上の馬に流し',
        warning: null
      };
      
      // B案: 3連単フォーメーション
      // 3着: 3,4,5位（1着、2着を除く）
      const thirdHorsesB = top345
        .filter(h => h.horseNum !== top1.horseNum && h.horseNum !== top2.horseNum)
        .map(h => h.horseNum)
        .join(',');
      const pointsB = calculateBetPoints('3連単フォーメーション', [
        `1着: ${top1.horseNum}`,
        `2着: ${top2.horseNum}`,
        `3着: ${thirdHorsesB}`
      ]);
      planB = {
        type: '3連単フォーメーション',
        horses: [`1着: ${top1.horseNum}`, `2着: ${top2.horseNum}`, `3着: ${thirdHorsesB}`],
        amount: pointsB * 100,
        points: pointsB,
        reason: '勝率1,2位の下に断層、3,4,5位に流し',
        warning: null
      };
      
      // C案: 3連単フォーメーション
      planC = {
        type: '3連単フォーメーション',
        horses: [`1着: ${top1.horseNum}`, `2着: ${top2.horseNum}`, `3着: ${resultsWithRate[2]?.horseNum || ''}`],
        amount: 100,
        points: 1,
        reason: '勝率1,2,3位',
        warning: null
      };
    }
    // ⑥3つ以上の断層が存在する場合
    else if (gaps.length >= 3) {
      const top2 = resultsWithRate.slice(0, 2);
      const top2Nums = top2.map(h => h.horseNum).join(',');
      // ヒモ: 基準未達以外すべて（軸馬を除く）
      const allNonCutoff = nonCutoffFailedHorses
        .filter(h => h.horseNum !== top2[0].horseNum && h.horseNum !== top2[1].horseNum)
        .map(h => h.horseNum)
        .join(',');
      
      // A案: 3連単フォーメーション
      // 軸: 勝率1,2位（2頭）、相手: 勝率1,2位（2頭）、ヒモ: 基準未達以外すべて（軸馬を除く）
      const axisCount = 2;
      const opponentCount = 2;
      const himoCount = nonCutoffFailedHorses.filter(h => h.horseNum !== top2[0].horseNum && h.horseNum !== top2[1].horseNum).length;
      const pointsA = axisCount * opponentCount * himoCount;
      planA = {
        type: '3連単フォーメーション',
        horses: [`軸: ${top2Nums}`, `相手: ${top2Nums}`, `ヒモ: ${allNonCutoff}`],
        amount: pointsA * 100,
        points: pointsA,
        reason: '断層3つ以上、基準未達以外すべて',
        warning: null
      };
      
      // B案: 馬単マルチ
      const bHorses = [`${top2[0].horseNum}⇔${top2[1].horseNum}`];
      if (expectationHorses.length > 0 && !top2.some(h => h.horseNum === expectationHorses[0].horseNum)) {
        bHorses.push(`${top2[0].horseNum}⇔${expectationHorses[0].horseNum}`);
      }
      planB = {
        type: '馬単マルチ',
        horses: bHorses,
        amount: bHorses.length * 100,
        points: bHorses.length,
        reason: '勝率1位⇔2位' + (expectationHorses.length > 0 ? ' + 期待値馬' : ''),
        warning: null
      };
      
      // C案: 馬単
      planC = {
        type: '馬単',
        horses: [`${top2[0].horseNum}→${top2[1].horseNum}`],
        amount: 100,
        points: 1,
        reason: '勝率1位→2位',
        warning: null
      };
    }
    // ⑦断層が存在しない場合
    else if (gaps.length === 0) {
      const winRate10Plus = resultsWithRate.filter(h => h.winRate >= 10);
      const expWinRate10Plus = winRate10Plus.filter(h => {
        const odds = oddsInput[h.horseNum] || 0;
        return odds * h.winRate >= 150;
      });
      
      // A案: 3連単BOX
      const winRate10Nums = winRate10Plus.map(h => h.horseNum).join(',');
      const pointsA = calculateBetPoints('3連単BOX', [winRate10Nums]);
      planA = {
        type: '3連単BOX',
        horses: [winRate10Nums],
        amount: pointsA * 100,
        points: pointsA,
        reason: '勝率10%以上の馬',
        warning: null
      };
      
      // B案: 3連複フォーメーション
      let axis1, axis2;
      if (expWinRate10Plus.length >= 2) {
        // 期待値馬が2頭以上: 最も勝率の高い期待値馬と2番目
        axis1 = expWinRate10Plus[0].horseNum;
        axis2 = expWinRate10Plus[1].horseNum;
      } else if (expWinRate10Plus.length === 1) {
        // 期待値馬が1頭のみ: 期待値馬と勝率10%以上の馬で期待値馬以外の最上位
        axis1 = expWinRate10Plus[0].horseNum;
        const winRate10PlusWithoutAxis1 = winRate10Plus.filter(h => h.horseNum !== axis1);
        axis2 = winRate10PlusWithoutAxis1.length > 0 ? winRate10PlusWithoutAxis1[0].horseNum : axis1;
      } else {
        // 期待値馬がいない場合: 勝率10%以上の馬の上位2頭
        axis1 = winRate10Plus[0]?.horseNum;
        axis2 = winRate10Plus[1]?.horseNum || axis1;
      }
      
      // 相手馬から軸馬を除外
      const opponentNums = winRate10Plus
        .filter(h => h.horseNum !== axis1 && h.horseNum !== axis2)
        .map(h => h.horseNum);
      
      const axisGroup1 = Number.isFinite(axis1) ? [axis1] : [];
      const axisGroup2 = Number.isFinite(axis2) ? [axis2] : [];
      const formationB = [
        `軸1: ${axisGroup1.join(',')}`,
        `軸2: ${axisGroup2.join(',')}`,
        `相手: ${opponentNums.join(',')}`
      ];
      const pointsB = calculateBetPoints('3連複フォーメーション', formationB);
      planB = pointsB > 0 ? {
        type: '3連複フォーメーション',
        horses: formationB,
        amount: pointsB * 100,
        points: pointsB,
        reason: '期待値馬を軸に、勝率10%以上',
        warning: null
      } : null;
      
      // C案: 単勝
      const bestExp = expWinRate10Plus.length > 0 
        ? expWinRate10Plus.sort((a, b) => b.winRate - a.winRate)[0]
        : winRate10Plus.sort((a, b) => b.winRate - a.winRate)[0];
      planC = {
        type: '単勝',
        horses: bestExp ? [`${bestExp.horseNum}`] : [],
        amount: 100,
        points: 1,
        reason: bestExp ? '期待値150以上で最も勝率が高い馬' : '勝率10%以上で最も勝率が高い馬',
        warning: null
      };
    }
    // ⑧勝率2位の下に断層があり、断層の数が正確に1つの場合
    else if (gaps.length === 1 && gaps.includes(1)) {
      const top2 = resultsWithRate.slice(0, 2);
      const top2Nums = top2.map(h => h.horseNum).join(',');
      
      // A案、B案: 3連複2頭軸
      const opponent = nonCutoffFailedHorses.map(h => h.horseNum).join(',');
      const pointsAB = calculateBetPoints('3連複2頭軸', [
        `軸: ${top2Nums}`,
        `相手: ${opponent}`
      ]);
      planA = {
        type: '3連複2頭軸',
        horses: [`軸: ${top2Nums}`, `相手: ${opponent}`],
        amount: pointsAB * 100,
        points: pointsAB,
        reason: '勝率1,2位を軸、基準未達以外すべて',
        warning: null
      };
      planB = planA;
      
      // C案: ワイド
      planC = {
        type: 'ワイド',
        horses: [`${top2[0].horseNum}-${top2[1].horseNum}`],
        amount: 100,
        points: 1,
        reason: '勝率1位-2位',
        warning: null
      };
    }
    // ⑨勝率1位の下に断層があり、断層の数が正確に1つの場合
    else if (gaps.length === 1 && gaps.includes(0)) {
      const top1 = resultsWithRate[0];
      const expHorses = expectationHorses.map(h => h.horseNum).join(',');
      const winRate5Plus = resultsWithRate.filter(h => h.winRate >= 5).map(h => h.horseNum).join(',');
      
      // A案: 3連単フォーメーション
      // 2着: 期待値馬（1着を除く）または勝率5%以上の馬（1着を除く）
      const secondHorses = expectationHorses.length > 0
        ? expectationHorses.filter(h => h.horseNum !== top1.horseNum).map(h => h.horseNum).join(',')
        : resultsWithRate.filter(h => h.winRate >= 5 && h.horseNum !== top1.horseNum).map(h => h.horseNum).join(',');
      // 3着: 勝率5%以上の馬（1着を除く）
      const thirdHorses = resultsWithRate.filter(h => h.winRate >= 5 && h.horseNum !== top1.horseNum).map(h => h.horseNum).join(',');
      const pointsA = calculateBetPoints('3連単フォーメーション', [
        `1着: ${top1.horseNum}`,
        `2着: ${secondHorses || thirdHorses}`,
        `3着: ${thirdHorses}`
      ]);
      planA = {
        type: '3連単フォーメーション',
        horses: [`1着: ${top1.horseNum}`, `2着: ${secondHorses || thirdHorses}`, `3着: ${thirdHorses}`],
        amount: pointsA * 100,
        points: pointsA,
        reason: '勝率1位の下に断層、期待値馬または5%以上に流し',
        warning: null
      };
      
      // B案: 3連複フォーメーション
      const axis1 = top1.horseNum;
      let axis2;
      if (expectationHorses.length > 0) {
        // 期待値馬がいる場合: 期待値馬の中で軸1を除いた最上位
        const expWithoutAxis1 = expectationHorses.filter(h => h.horseNum !== axis1);
        axis2 = expWithoutAxis1.length > 0 ? expWithoutAxis1[0].horseNum : null;
      }
      if (!axis2) {
        // 期待値馬がいない、または期待値馬が軸1のみの場合: 勝率5%以上の馬で軸1を除いた最上位
        const winRate5PlusWithoutAxis1 = resultsWithRate.filter(h => h.winRate >= 5 && h.horseNum !== axis1);
        axis2 = winRate5PlusWithoutAxis1.length > 0 ? winRate5PlusWithoutAxis1[0].horseNum : axis1;
      }
      
      // 相手馬から軸馬を除外
      const opponent = resultsWithRate
        .filter(h => h.winRate >= 5 && h.horseNum !== axis1 && h.horseNum !== axis2)
        .map(h => h.horseNum)
        .join(',');
      
      const axisGroup1B = Number.isFinite(axis1) ? [axis1] : [];
      const axisGroup2B = Number.isFinite(axis2) ? [axis2] : [];
      const opponentNums = resultsWithRate
        .filter(h => h.winRate >= 5 && h.horseNum !== axis1 && h.horseNum !== axis2)
        .map(h => h.horseNum);
      
      const formationB = [
        `軸1: ${axisGroup1B.join(',')}`,
        `軸2: ${axisGroup2B.join(',')}`,
        `相手: ${opponentNums.join(',')}`
      ];
      const pointsB = calculateBetPoints('3連複フォーメーション', formationB);
      planB = pointsB > 0 ? {
        type: '3連複フォーメーション',
        horses: formationB,
        amount: pointsB * 100,
        points: pointsB,
        reason: '勝率1位を軸、期待値馬または5%以上',
        warning: null
      } : null;
      
      // C案: 単勝
      planC = {
        type: '単勝',
        horses: [`${top1.horseNum}`],
        amount: 100,
        points: 1,
        reason: '勝率1位',
        warning: null
      };
    }
    // ⑩該当なし
    else {
      bets.push({
        type: '情報',
        horses: [],
        amount: 0,
        points: 0,
        reason: '保存された買い目ルール適用外のレースです',
        warning: null
      });
      setGeneratedBets(bets);
      return;
    }
    
    // 注釈の判定
    if (planA) {
      const planAHorses = planA.horses.join(',').match(/\d+/g) || [];
      const hasCutoffFailed = planAHorses.some(num => {
        const horse = resultsWithRate.find(h => h.horseNum === parseInt(num));
        return horse && isCutoffFailed(horse);
      });
      const hasExpectation = planAHorses.some(num => {
        const horse = resultsWithRate.find(h => h.horseNum === parseInt(num));
        return horse && expectationHorses.some(eh => eh.horseNum === horse.horseNum);
      });
      
      if (hasCutoffFailed || !hasExpectation) {
        needsWarning = true;
      }
    }
    
    if (needsWarning) {
      const warning = "⚠️ 本買い目は期待値に依存していない断層による買い目の提示なので、最終的に下にスクロールし、ギャンさんの買い目が出ている場合はそちらを参考にしたほうがいい可能性があります。";
      if (planA) planA.warning = warning;
      if (planB) planB.warning = warning;
      if (planC) planC.warning = warning;
    }
    
    // 予算最適化機能
    let selectedPlan = null;
    let multiplier = 1;
    let shortage = 0;
    
    // 1. A案が予算内に収まるか
    if (planA && planA.amount <= budget) {
      selectedPlan = planA;
      multiplier = Math.floor(budget / planA.amount);
    }
    // 2. B案が予算内に収まるか
    else if (planB && planB.amount <= budget) {
      selectedPlan = planB;
      multiplier = Math.floor(budget / planB.amount);
      if (planA) {
        shortage = planA.amount - budget;  // A案までの不足額
      }
    }
    // 3. C案（最小プラン）
    else if (planC) {
      selectedPlan = planC;
      if (planC.amount <= budget) {
        multiplier = Math.floor(budget / planC.amount);
      }
      if (planB) {
        shortage = planB.amount - budget;  // B案までの不足額
      } else if (planA) {
        shortage = planA.amount - budget;  // A案までの不足額
      }
    }
    
    if (selectedPlan) {
      const finalCost = selectedPlan.amount * multiplier;
      const usageRate = budget > 0 ? ((finalCost / budget) * 100).toFixed(1) : '0.0';
      const unusedBudget = budget - finalCost;
      
      // 最適化された買い目情報を追加
      const optimizedBet = {
        ...selectedPlan,
        multiplier: multiplier,
        unitCost: selectedPlan.amount,
        finalCost: finalCost,
        budget: budget,
        usageRate: usageRate,
        shortage: shortage,
        unusedBudget: unusedBudget,
        isOptimized: true
      };
      
      bets.push(optimizedBet);
    }
    
    setGeneratedBets(bets);
  };

  // 旧買い目自動生成（削除予定だが一旦コメントアウト）
  const generateBettingRecommendationsOld = () => {
    const budget = bettingBudget;
    const bets = [];

    if (bettingType === 'accuracy') {
      const top1 = resultsWithRate[0];
      
      if (!top1) {
        bets.push({
          type: '情報',
          horses: [],
          amount: 0,
          reason: '購入可能な馬が見つかりませんでした'
        });
      } else {
        const winRate10Plus = resultsWithRate.filter(h => h.winRate >= 10 && h.horseNum !== top1.horseNum);
        const winRate5Plus = resultsWithRate.filter(h => h.winRate >= 5 && h.horseNum !== top1.horseNum);
        
        if (budget <= 3000) {
          const tanAmount = Math.floor(budget * 0.6 / 100) * 100;
          const barenAmount = budget - tanAmount;
          
          bets.push({
            type: '単勝',
            horses: [`${top1.horseNum}`],
            amount: tanAmount,
            reason: `勝率1位馬（勝率${top1.winRate.toFixed(1)}%）`
          });
          
          if (barenAmount >= 100 && winRate10Plus.length > 0) {
            const flowCount = Math.min(winRate10Plus.length, Math.floor(barenAmount / 100));
            const perBet = Math.floor(barenAmount / flowCount / 100) * 100;
            const flowHorses = winRate10Plus.slice(0, flowCount);
            
            bets.push({
              type: '馬連',
              horses: [`${top1.horseNum}-${flowHorses.map(h => h.horseNum).join(',')}`],
              amount: perBet * flowCount,
              reason: `${top1.horseNum}番から勝率10%以上に各${perBet}円`
            });
          }
        } else {
          const tanAmount = Math.floor(budget * 0.5 / 100) * 100;
          const barenAmount = Math.floor(budget * 0.3 / 100) * 100;
          const sanrenAmount = budget - tanAmount - barenAmount;
          
          bets.push({
            type: '単勝',
            horses: [`${top1.horseNum}`],
            amount: tanAmount,
            reason: `勝率1位馬（勝率${top1.winRate.toFixed(1)}%）`
          });
          
          if (barenAmount >= 100 && winRate10Plus.length > 0) {
            const flowCount = Math.min(winRate10Plus.length, Math.floor(barenAmount / 100));
            const perBet = Math.floor(barenAmount / flowCount / 100) * 100;
            const flowHorses = winRate10Plus.slice(0, flowCount);
            
            bets.push({
              type: '馬連',
              horses: [`${top1.horseNum}-${flowHorses.map(h => h.horseNum).join(',')}`],
              amount: perBet * flowCount,
              reason: `${top1.horseNum}番から勝率10%以上に各${perBet}円`
            });
          }
          
          if (sanrenAmount >= 100) {
            // 10%以上の馬（軸馬を除く）
            const use10 = winRate10Plus; // 全件
            // 5%以上の馬（10%以上を含む、軸馬を除く）
            const use5 = winRate5Plus; // 全件
            
            if (use10.length > 0 && use5.length > 0) {
              // 軸馬-10%以上-5%以上（10%以上を含む）のユニーク組み合わせ数（b!=c）
              const pairKeys = new Set();
              use10.forEach(b => {
                use5.forEach(c => {
                  if (b.horseNum !== c.horseNum) {
                    const k1 = Math.min(b.horseNum, c.horseNum);
                    const k2 = Math.max(b.horseNum, c.horseNum);
                    pairKeys.add(`${k1}-${k2}`);
                  }
                });
              });
              const combinations = pairKeys.size;
              if (combinations > 0) {
                const perBet = Math.floor(sanrenAmount / combinations / 100) * 100;
                
                bets.push({
                  type: '三連複',
                  horses: [`${top1.horseNum}-${use10.map(h => h.horseNum).join(',')}-${use5.map(h => h.horseNum).join(',')}`],
                  amount: perBet * combinations,
                  reason: `フォーメーション ${combinations}点 各${perBet}円`
                });
              }
            }
          }
        }
      }
    } else if (bettingType === 'value') {
      const expectationHorses = resultsWithRate
        .map(horse => {
          const odds = oddsInput[horse.horseNum] || 0;
          const value = odds * horse.winRate;
          return { ...horse, expectation: value, odds };
        })
        .filter(h => h.winRate >= 10 && h.expectation >= 150)
        .sort((a, b) => b.expectation - a.expectation);
      
      const superExpHorses = expectationHorses.filter(h => h.expectation >= 220);
      let mainHorse = superExpHorses.length > 0 ? superExpHorses[0] : expectationHorses[0];
      
      if (!mainHorse) {
        mainHorse = calculateAIRecommendation(resultsWithRate);
      }
      
      if (!mainHorse) {
        bets.push({
          type: '情報',
          horses: [],
          amount: 0,
          reason: '期待値馬・AIおすすめ馬が見つかりませんでした'
        });
      } else {
        const winRate10Plus = resultsWithRate.filter(h => h.winRate >= 10 && h.horseNum !== mainHorse.horseNum);
        const winRate5Plus = resultsWithRate.filter(h => h.winRate >= 5 && h.horseNum !== mainHorse.horseNum);
        
        if (budget <= 3000) {
          const tanAmount = Math.floor(budget * 0.6 / 100) * 100;
          const barenAmount = budget - tanAmount;
          
          bets.push({
            type: '単勝',
            horses: [`${mainHorse.horseNum}`],
            amount: tanAmount,
            reason: mainHorse.expectation >= 150 
              ? `期待値${mainHorse.expectation.toFixed(0)}（オッズ${mainHorse.odds.toFixed(1)}倍）`
              : `AIおすすめ馬（勝率${mainHorse.winRate.toFixed(1)}%）`
          });
          
          if (barenAmount >= 100 && winRate10Plus.length > 0) {
            const flowCount = Math.min(winRate10Plus.length, Math.floor(barenAmount / 100));
            const perBet = Math.floor(barenAmount / flowCount / 100) * 100;
            const flowHorses = winRate10Plus.slice(0, flowCount);
            
            bets.push({
              type: '馬連',
              horses: [`${mainHorse.horseNum}-${flowHorses.map(h => h.horseNum).join(',')}`],
              amount: perBet * flowCount,
              reason: `${mainHorse.horseNum}番から勝率10%以上に各${perBet}円`
            });
          }
        } else {
          const tanAmount = Math.floor(budget * 0.5 / 100) * 100;
          const barenAmount = Math.floor(budget * 0.3 / 100) * 100;
          const sanrenAmount = budget - tanAmount - barenAmount;
          
          bets.push({
            type: '単勝',
            horses: [`${mainHorse.horseNum}`],
            amount: tanAmount,
            reason: mainHorse.expectation >= 150 
              ? `期待値${mainHorse.expectation.toFixed(0)}（オッズ${mainHorse.odds.toFixed(1)}倍）`
              : `AIおすすめ馬（勝率${mainHorse.winRate.toFixed(1)}%）`
          });
          
          if (barenAmount >= 100 && winRate10Plus.length > 0) {
            const flowCount = Math.min(winRate10Plus.length, Math.floor(barenAmount / 100));
            const perBet = Math.floor(barenAmount / flowCount / 100) * 100;
            const flowHorses = winRate10Plus.slice(0, flowCount);
            
            bets.push({
              type: '馬連',
              horses: [`${mainHorse.horseNum}-${flowHorses.map(h => h.horseNum).join(',')}`],
              amount: perBet * flowCount,
              reason: `${mainHorse.horseNum}番から勝率10%以上に各${perBet}円`
            });
          }
          
          if (sanrenAmount >= 100) {
            // 10%以上の馬（軸馬を除く）
            const use10 = winRate10Plus; // 全件
            // 5%以上の馬（10%以上を含む、軸馬を除く）
            const use5 = winRate5Plus; // 全件
            
            if (use10.length > 0 && use5.length > 0) {
              // 軸馬-10%以上-5%以上（10%以上を含む）のユニーク組み合わせ数（b!=c）
              const pairKeys = new Set();
              use10.forEach(b => {
                use5.forEach(c => {
                  if (b.horseNum !== c.horseNum) {
                    const k1 = Math.min(b.horseNum, c.horseNum);
                    const k2 = Math.max(b.horseNum, c.horseNum);
                    pairKeys.add(`${k1}-${k2}`);
                  }
                });
              });
              const combinations = pairKeys.size;
              if (combinations > 0) {
                const perBet = Math.floor(sanrenAmount / combinations / 100) * 100;
                
                bets.push({
                  type: '三連複',
                  horses: [`${mainHorse.horseNum}-${use10.map(h => h.horseNum).join(',')}-${use5.map(h => h.horseNum).join(',')}`],
                  amount: perBet * combinations,
                  reason: `フォーメーション ${combinations}点 各${perBet}円`
                });
              }
            }
          }
        }
      }
    }

    setGeneratedBets(bets);
  };

  const calculateStats = (courseKey = null, statsType = 'winrate') => {
    let recordedRaces = races.filter(r => r.result && r.odds && Object.keys(r.odds).length > 0);
    
    if (courseKey) {
      recordedRaces = recordedRaces.filter(r => r.courseKey === courseKey);
    }
    
    // 日付フィルター処理
    if (statsDateFilter.type === 'single' && statsDateFilter.singleDate) {
      recordedRaces = recordedRaces.filter(r => {
        if (!r.createdAt) return false;
        const raceDate = new Date(r.createdAt).toISOString().split('T')[0];
        return raceDate === statsDateFilter.singleDate;
      });
    } else if (statsDateFilter.type === 'range') {
      if (statsDateFilter.startDate) {
        recordedRaces = recordedRaces.filter(r => {
          if (!r.createdAt) return false;
          const raceDate = new Date(r.createdAt);
          const startDate = new Date(statsDateFilter.startDate);
          return raceDate >= startDate;
        });
      }
      if (statsDateFilter.endDate) {
        recordedRaces = recordedRaces.filter(r => {
          if (!r.createdAt) return false;
          const raceDate = new Date(r.createdAt);
          const endDate = new Date(statsDateFilter.endDate);
          endDate.setHours(23, 59, 59, 999); // 終了日の23:59:59まで含める
          return raceDate <= endDate;
        });
      }
    }
    
    if (recordedRaces.length === 0) return null;

    let tanshoHits = 0;
    let fukushoHits = 0;
    let tanshoReturn = 0; // 追加：単勝回収額
    let validRaces = 0;  // 有効なレース数（分母）

    recordedRaces.forEach(race => {
      const raceWinRates = calculateWinRate(race.horses, race.courseKey);
      
      let targetHorse = null;
      
      if (statsType === 'winrate') {
        targetHorse = raceWinRates[0];
        validRaces++;  // 勝率1位は必ず存在
      } else if (statsType === 'expectation') {
        const candidates = raceWinRates
          .map(horse => {
            const odds = race.odds[horse.horseNum] || 0;
            const value = odds * horse.winRate;
            return { ...horse, expectation: value };
          })
          .filter(h => h.winRate >= 10 && h.expectation >= 150)
          .sort((a, b) => b.expectation - a.expectation);
        
        targetHorse = candidates[0] || null;
        
        // 期待値馬がいない場合はこのレースをスキップ
        if (!targetHorse) return;
        validRaces++;
      } else if (statsType === 'ai') {
        const candidates = raceWinRates
          .filter(horse => {
            const odds = race.odds[horse.horseNum] || 0;
            const value = odds * horse.winRate;
            return value >= 100 && horse.winRate >= 10;
          })
          .sort((a, b) => b.winRate - a.winRate);
        
        targetHorse = candidates[0] || null;
        
        // AIおすすめ馬がいない場合はこのレースをスキップ
        if (!targetHorse) return;
        validRaces++;
      }
      
      if (!targetHorse) return;
      
      const ranking = race.result.ranking.split(/[\s\-,]/);
      const resultNums = ranking.map(r => {
        const num = parseInt(r);
        return isNaN(num) ? null : num;
      }).filter(n => n !== null);
      
      if (resultNums[0] === targetHorse.horseNum) {
        tanshoHits++;
        // 的中時の払戻金（100円あたり）
        const odds = race.odds[targetHorse.horseNum] || 0;
        const returnAmount = odds * 100;
        // 10円単位に丸める（競馬の払戻金ルール）
        const roundedReturn = Math.round(returnAmount / 10) * 10;
        tanshoReturn += roundedReturn;
      }
      
      if (resultNums.slice(0, 3).includes(targetHorse.horseNum)) {
        fukushoHits++;
      }
    });

    // 有効なレース数がゼロの場合
    if (validRaces === 0) return null;

    // 回収率を計算（投資額 = 有効レース数 × 100円）
    const investment = validRaces * 100;
    const recoveryRate = ((tanshoReturn / investment) * 100).toFixed(1);

    return {
      total: validRaces,  // 分母を validRaces に変更
      tansho: { 
        hits: tanshoHits, 
        rate: ((tanshoHits / validRaces) * 100).toFixed(1),
        recovery: recoveryRate
      },
      fukusho: { hits: fukushoHits, rate: ((fukushoHits / validRaces) * 100).toFixed(1) }
    };
  };

  // レース開始5分前をチェックする関数
  const scheduleRaceNotifications = () => {
    // 未出走レースを取得
    const upcomingRaces = races.filter(r => !r.result && r.startTime);
    
    upcomingRaces.forEach(race => {
      const startTime = new Date(race.startTime);
      const notifyTime = new Date(startTime.getTime() - 5 * 60 * 1000); // 5分前
      const now = new Date();
      
      const timeUntilNotify = notifyTime.getTime() - now.getTime();
      
      // 5分前の時刻が未来の場合のみ通知をセット
      if (timeUntilNotify > 0 && timeUntilNotify < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🏇 レース開始5分前！', {
              body: `${race.name} まもなく発走です`,
              icon: '/icon-192.png',
              tag: race.firebaseId
            });
          }
        }, timeUntilNotify);
      }
    });
  };

  // racesが更新されたら通知をスケジュール
  useEffect(() => {
    if (races.length > 0) {
      scheduleRaceNotifications();
    }
  }, [races]);

  // 買い目の的中判定関数
  const checkBettingHit = (bet, result) => {
    if (!bet || !result || !result.ranking) return false;
    
    const ranking = result.ranking.split(/[\s\-,]/).map(r => parseInt(r)).filter(n => !isNaN(n));
    
    if (ranking.length === 0) return false;
    
    // bet.typeに応じて判定
    switch (bet.type) {
      case '単勝':
        return ranking[0] === parseInt(bet.horses[0]);
      
      case 'ワイド':
        const wideHorses = bet.horses[0].split('-').map(h => parseInt(h));
        return wideHorses.every(h => ranking.slice(0, 3).includes(h));
      
      case '馬連BOX':
        const barenBoxHorses = bet.horses[0].split(',').map(h => parseInt(h));
        return barenBoxHorses.every(h => ranking.slice(0, 2).includes(h));
      
      case '馬単マルチ':
        return bet.horses.some(horseStr => {
          const parts = horseStr.split('⇔').map(h => parseInt(h));
          return parts.every(h => ranking.slice(0, 2).includes(h));
        });
      
      case '馬単':
        const parts = bet.horses[0].split('→').map(h => parseInt(h));
        return parts.length === 2 && ranking[0] === parts[0] && ranking[1] === parts[1];
      
      case '3連複BOX':
      case '3連複フォーメーション':
      case '3連複2頭軸':
        // 買い目に含まれるすべての馬番を抽出
        const allHorseNums = new Set();
        bet.horses.forEach(horseStr => {
          const nums = horseStr.match(/\d+/g);
          if (nums) {
            nums.forEach(n => allHorseNums.add(parseInt(n)));
          }
        });
        // 上位3頭にすべて含まれているか判定
        return Array.from(allHorseNums).every(h => ranking.slice(0, 3).includes(h));
      
      case '3連単BOX':
      case '3連単フォーメーション':
        // 買い目に含まれるすべての馬番を抽出
        const allHorseNumsExact = new Set();
        bet.horses.forEach(horseStr => {
          const nums = horseStr.match(/\d+/g);
          if (nums) {
            nums.forEach(n => allHorseNumsExact.add(parseInt(n)));
          }
        });
        // 上位3頭にすべて含まれているか判定（厳密には着順も確認すべきだが、簡易的に）
        return Array.from(allHorseNumsExact).every(h => ranking.slice(0, 3).includes(h));
      
      default:
        return false;
    }
  };

  // ✨ ファクター毎の的中率分析関数
  const calculateFactorStats = (courseKey = null, dateFilter = null) => {
    let recordedRaces = races.filter(r => r.result && r.odds && Object.keys(r.odds).length > 0);
    
    if (courseKey && courseKey !== 'all') {
      recordedRaces = recordedRaces.filter(r => r.courseKey === courseKey);
    }
    
    // 日付フィルター追加
    if (dateFilter) {
      recordedRaces = recordedRaces.filter(r => {
        if (!r.createdAt) return false;
        // r.createdAt が "2024/11/7" のような形式の場合
        const raceDate = new Date(r.createdAt).toISOString().split('T')[0];
        return raceDate === dateFilter;
      });
    }
    
    if (recordedRaces.length === 0) return null;

    const factorStats = {
      'スピード能力値': { tansho: 0, fukusho: 0, total: 0 },
      'コース・距離適性': { tansho: 0, fukusho: 0, total: 0 },
      '展開利': { tansho: 0, fukusho: 0, total: 0 },
      '近走安定度': { tansho: 0, fukusho: 0, total: 0 },
      '馬場適性': { tansho: 0, fukusho: 0, total: 0 },
      '騎手': { tansho: 0, fukusho: 0, total: 0 },
      '斤量': { tansho: 0, fukusho: 0, total: 0 },
      '調教': { tansho: 0, fukusho: 0, total: 0 }
    };
    
    // 買い目統計
    const bettingStats = {
      total: 0,
      hit: 0,
      miss: 0,
      hitRate: '0.0'
    };

    recordedRaces.forEach(race => {
      const ranking = race.result.ranking.split(/[\s\-,]/);
      const resultNums = ranking.map(r => {
        const num = parseInt(r);
        return isNaN(num) ? null : num;
      }).filter(n => n !== null);

      if (resultNums.length === 0) return;

      // 買い目判定を追加
      if (race.generatedBet) {
        bettingStats.total++;
        const wasHit = checkBettingHit(race.generatedBet, race.result);
        if (wasHit) {
          bettingStats.hit++;
        } else {
          bettingStats.miss++;
        }
      }

      Object.keys(factorStats).forEach(factorKey => {
        const activeHorses = race.horses.filter(h => !race.excluded || !race.excluded[h.horseNum]);
        
        if (activeHorses.length === 0) return;

        const topHorseByFactor = activeHorses.reduce((top, horse) => {
          const score = horse.scores[factorKey] || 0;
          return score > (top.scores[factorKey] || 0) ? horse : top;
        }, activeHorses[0]);

        if (topHorseByFactor) {
          factorStats[factorKey].total++;

          if (resultNums[0] === topHorseByFactor.horseNum) {
            factorStats[factorKey].tansho++;
          }

          if (resultNums.slice(0, 3).includes(topHorseByFactor.horseNum)) {
            factorStats[factorKey].fukusho++;
          }
        }
      });
    });
    
    // 的中率計算
    if (bettingStats.total > 0) {
      bettingStats.hitRate = ((bettingStats.hit / bettingStats.total) * 100).toFixed(1);
    }

    const result = {};
    Object.entries(factorStats).forEach(([factor, stats]) => {
      result[factor] = {
        ...stats,
        tanshoRate: stats.total > 0 ? ((stats.tansho / stats.total) * 100).toFixed(1) : '0.0',
        fukushoRate: stats.total > 0 ? ((stats.fukusho / stats.total) * 100).toFixed(1) : '0.0'
      };
    });

    return { results: result, recordedRacesCount: recordedRaces.length, bettingStats: bettingStats };
  };

  // 🏟️ コース設定の一覧を取得
  const getAvailableCourses = () => {
    const coursesWithResults = new Set();
    races.forEach(race => {
      if (race.result && race.courseKey) {
        coursesWithResults.add(race.courseKey);
      }
    });
    return Array.from(coursesWithResults).sort();
  };

  const handleAnalyzeFactors = () => {
    const analysisResults = calculateFactorStats(selectedAnalysisCourse, analysisDateFilter);
    setFactorAnalysisResults(analysisResults);
  };

  const handleFactorToggle = (factorKey) => {
    setSelectedFactors({
      ...selectedFactors,
      [factorKey]: !selectedFactors[factorKey]
    });
  };

  // 足切り偏差値設定を保存
  const saveCutoffDeviations = () => {
    if (!currentRace || !currentRace.firebaseId) return;
    
    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      cutoffDeviations: cutoffDeviations
    });
    setCurrentRace({
      ...currentRace,
      cutoffDeviations: cutoffDeviations
    });
  };

  // 足切り偏差値を更新
  const updateCutoffDeviation = (factorKey, value) => {
    const numValue = value === '' || value === null ? null : parseFloat(value);
    const newCutoffDeviations = {
      ...cutoffDeviations,
      [factorKey]: numValue
    };
    setCutoffDeviations(newCutoffDeviations);
    
    // 自動保存（部分更新を使用）
    if (currentRace && currentRace.firebaseId) {
      const cutoffRef = ref(database, `races/${currentRace.firebaseId}/cutoffDeviations`);
      set(cutoffRef, newCutoffDeviations)
        .then(() => {
          setCurrentRace({
            ...currentRace,
            cutoffDeviations: newCutoffDeviations
          });
        })
        .catch((error) => {
          console.error('足切り偏差値の保存に失敗:', error);
        });
    }
  };

  const handleSaveResult = () => {
    if (!resultRanking.trim()) {
      window.alert('着順を入力してください');
      return;
    }

    const resultsWithRate = calculateWinRate(currentRace.horses, raceSelectedCourse);
    const top1 = resultsWithRate[0];

    if (!top1) {
      window.alert('評価対象の馬がありません');
      return;
    }

    const ranking = resultRanking.split(/[\s\-,]/);
    
    const resultNums = ranking.map(r => {
      const num = parseInt(r);
      return isNaN(num) ? null : num;
    }).filter(n => n !== null);

    const tanshoDic = resultNums[0] === top1.horseNum ? 'hit' : 'miss';
    const fukushoHit = resultNums.slice(0, 3).includes(top1.horseNum) ? 'hit' : 'miss';

    // 部分更新を使用
    const resultRef = ref(database, `races/${currentRace.firebaseId}/result`);
    const newResult = {
      ranking: resultRanking,
      tansho: tanshoDic,
      fukusho: fukushoHit
    };
    
    set(resultRef, newResult)
      .then(() => {
        setCurrentRace({
          ...currentRace,
          result: newResult
        });
        setResultRanking('');
        setShowResultModal(false);
      })
      .catch((error) => {
        console.error('結果の保存に失敗:', error);
        window.alert('結果の保存に失敗しました');
      });
  };

  const updateRaceOdds = (odds) => {
    // 部分更新を使用
    const oddsRef = ref(database, `races/${currentRace.firebaseId}/odds`);
    set(oddsRef, odds)
      .then(() => {
        setCurrentRace({ ...currentRace, odds });
      })
      .catch((error) => {
        console.error('オッズの保存に失敗:', error);
        window.alert('オッズの保存に失敗しました');
      });
  };

  const updateRaceMemo = (newMemo) => {
    // 部分更新を使用
    const memoRef = ref(database, `races/${currentRace.firebaseId}/memo`);
    set(memoRef, newMemo)
      .then(() => {
        setCurrentRace({ ...currentRace, memo: newMemo });
      })
      .catch((error) => {
        console.error('メモの保存に失敗:', error);
        window.alert('メモの保存に失敗しました');
      });
  };

  // 🎯 勝率の断層を検出する関数
  const detectWinRateGaps = (horses) => {
    const gaps = [];
    for (let i = 0; i < horses.length - 1; i++) {
      const currentRate = horses[i].winRate;
      const nextRate = horses[i + 1].winRate;
      const diff = currentRate - nextRate;
      
      // 勝率差が5%以上の場合を断層とみなす
      if (diff >= 5) {
        gaps.push(i);
      }
    }
    return gaps;
  };

  // 🔍 レースが高度フィルター条件を満たすか判定する関数
  const checkAdvancedFilter = (race) => {
    if (!race || !race.horses) return false;
    
    const filters = advancedFilters;
    
    // フィルターが1つも選択されていない場合は全て表示
    const hasGapPositionFilter = Object.values(filters.gapPositions).some(v => v === true);
    const hasGapCountFilter = filters.gapCount !== 'any';
    const hasSpecialHorseFilter = Object.values(filters.specialHorses).some(v => v === true);
    const hasResultFilter = Object.values(filters.resultFilter).some(v => v === true);
    
    if (!hasGapPositionFilter && !hasGapCountFilter && !hasSpecialHorseFilter && !hasResultFilter) {
      return true;
    }
    
    // 各条件をチェック（AND条件）
    let matchesAll = true;
    
    // 断層関連の判定
    if (hasGapPositionFilter || hasGapCountFilter) {
      const winRates = calculateWinRate(race.horses, race.courseKey);
      const gaps = detectWinRateGaps(winRates);
      
      // 断層位置の判定
      if (hasGapPositionFilter) {
        const gapPositionMatch = 
          (!filters.gapPositions.after1st || gaps.includes(0)) &&
          (!filters.gapPositions.after2nd || gaps.includes(1)) &&
          (!filters.gapPositions.after3rd || gaps.includes(2)) &&
          (!filters.gapPositions.after4th || gaps.includes(3)) &&
          (!filters.gapPositions.after5th || gaps.includes(4)) &&
          (!filters.gapPositions.after6th || gaps.some(g => g >= 5));
        
        if (!gapPositionMatch) matchesAll = false;
      }
      
      // 断層の数の判定
      if (hasGapCountFilter) {
        const gapCountMatch = 
          filters.gapCount === 'any' ||
          (filters.gapCount === 'exactly1' && gaps.length === 1) ||
          (filters.gapCount === 'exactly2' && gaps.length === 2) ||
          (filters.gapCount === '3plus' && gaps.length >= 3);
        
        if (!gapCountMatch) matchesAll = false;
      }
    }
    
    // 特殊な馬の存在の判定
    if (hasSpecialHorseFilter) {
      const winRates = calculateWinRate(race.horses, race.courseKey);
      const odds = race.odds || {};
      
      // 期待値150以上の馬がいる
      if (filters.specialHorses.hasExpectation) {
        const hasExp = winRates.some(horse => {
          const horseOdds = odds[horse.horseNum] || 0;
          const value = horseOdds * horse.winRate;
          return value >= 150 && horse.winRate >= 10;
        });
        if (!hasExp) matchesAll = false;
      }
      
      // 超期待値220以上の馬がいる
      if (filters.specialHorses.hasSuperExp) {
        const hasSuperExp = winRates.some(horse => {
          const horseOdds = odds[horse.horseNum] || 0;
          const value = horseOdds * horse.winRate;
          return value >= 220 && horse.winRate >= 10;
        });
        if (!hasSuperExp) matchesAll = false;
      }
      
      // AIおすすめ馬がいる
      if (filters.specialHorses.hasAiRec) {
        const aiRec = calculateAIRecommendation(winRates, odds);
        if (!aiRec) matchesAll = false;
      }
    }
    
    // 結果関連の判定
    if (hasResultFilter) {
      if (!race.result) {
        // 結果が記録されていない場合は結果関連のフィルターは全てfalse
        matchesAll = false;
      } else {
        // 単勝的中
        if (filters.resultFilter.tanshoHit) {
          if (race.result.tansho !== 'hit') matchesAll = false;
        }
        
        // 複勝的中
        if (filters.resultFilter.fukushoHit) {
          if (race.result.fukusho !== 'hit') matchesAll = false;
        }
        
        // 不的中（単勝も複勝も外れた）
        if (filters.resultFilter.miss) {
          const missMatch = race.result.tansho === 'miss' && race.result.fukusho === 'miss';
          if (!missMatch) matchesAll = false;
        }
      }
    }
    
    return matchesAll;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
        <Sidebar
          activeTab={activeTab}
          onSelect={handleSidebarSelect}
          isAdmin={isAdmin}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-pink-600 shadow-lg border border-pink-200"
          >
            ☰ メニュー
          </button>
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsSidebarOpen(false)}
            />
            <Sidebar
              activeTab={activeTab}
              onSelect={handleSidebarSelect}
              isAdmin={isAdmin}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
            />
          </div>
        )}

        <div role="main" className="ml-0 md:ml-64 px-4 md:px-10 py-10">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="bg-white/80 backdrop-blur rounded-3xl px-10 py-12 shadow-xl border border-pink-100 text-center">
              <div className="flex justify-center mb-4">
                <HorsePixelArt size={48} />
              </div>
              <p className="text-gray-700 font-semibold mb-4 text-xl">ロード中...</p>
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRace) {
    const availableCourses = getAvailableCourses();

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
        <Sidebar
          activeTab={activeTab}
          onSelect={handleSidebarSelect}
          isAdmin={isAdmin}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-pink-600 shadow-lg border border-pink-200"
          >
            ☰ メニュー
          </button>
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsSidebarOpen(false)}
            />
            <Sidebar
              activeTab={activeTab}
              onSelect={handleSidebarSelect}
              isAdmin={isAdmin}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
            />
          </div>
        )}

        <div role="main" className="ml-0 md:ml-64 px-4 sm:px-6 lg:px-10 py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-8 relative">
            <div className="flex-1">
              <div className="mx-auto md:mx-0 inline-flex items-center gap-2 md:gap-3 px-4 py-3 rounded-full bg-white/70 backdrop-blur shadow-lg border border-pink-100">
                <HorsePixelArt size={28} />
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
                  ギャン中の予想部屋
                </h1>
                <HorsePixelArt size={28} className="hidden sm:block" />
              </div>
              <p className="mt-4 text-center md:text-left text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                期待値のある馬を探して、みんなの競馬ライフをもっと楽しく✨
              </p>
            </div>
            <button
              onClick={() => setShowAdminModal(true)}
              className="self-end md:self-start inline-flex items-center justify-center h-12 w-12 rounded-full bg-white shadow-lg border border-purple-200 text-2xl hover:shadow-2xl hover:-translate-y-1 transition md:hidden"
            >
              ⚙️
            </button>
          </div>

          {(activeTab === 'races-upcoming' || activeTab === 'races-past') && (
            <div className="bg-white rounded-3xl p-4 md:p-8 shadow-lg border-2 border-pink-200">
              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:shadow-2xl hover:scale-105 transition transform font-bold text-base md:text-lg mb-4 md:mb-6 shadow-lg flex items-center justify-center gap-2"
                >
                  <HorsePixelArt size={24} />
                  レースデータを追加
                </button>
              )}
              {!isAdmin && <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6 text-center">※ 管理者のみ追加可能</p>}

              <div className="flex gap-2 mb-4 md:mb-6">
                <button
                  onClick={() => setActiveTab('races-upcoming')}
                  className={`flex-1 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base transition ${
                    activeTab === 'races-upcoming'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  未出走の予想
                </button>
                <button
                  onClick={() => setActiveTab('races-past')}
                  className={`flex-1 px-3 md:px-4 py-2 rounded-full font-bold text-sm md:text-base transition flex items-center justify-center gap-2 ${
                    activeTab === 'races-past'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  過去の予想
                  {races.filter(r => r.result?.fukusho === 'hit').length > 0 && (
                    <span className="text-base md:text-lg">✅</span>
                  )}
                </button>
              </div>

              {races.length > 0 ? (
                <>
                  {activeTab === 'races-upcoming' && (
                    <div className="mb-4 flex gap-2 items-center flex-wrap">
                      <span className="text-xs md:text-sm font-bold text-gray-700">ソート:</span>
                      <button
                        onClick={() => setUpcomingSortBy('startTime')}
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
                          upcomingSortBy === 'startTime'
                            ? 'bg-purple-400 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        出走時間順
                      </button>
                      <button
                        onClick={() => setUpcomingSortBy('createdAt')}
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
                          upcomingSortBy === 'createdAt'
                            ? 'bg-purple-400 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        作成日順
                      </button>
                    </div>
                  )}
                  {activeTab === 'races-past' && (
                    <div className="mb-4 space-y-3">
                      <div className="flex gap-2 items-center flex-wrap">
                      <span className="text-xs md:text-sm font-bold text-gray-700">ソート:</span>
                      <button
                        onClick={() => setPastSortBy('newest')}
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
                          pastSortBy === 'newest'
                            ? 'bg-purple-400 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        新しい順
                      </button>
                      <button
                        onClick={() => setPastSortBy('oldest')}
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
                          pastSortBy === 'oldest'
                            ? 'bg-purple-400 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        古い順
                      </button>
                      <span className="text-xs md:text-sm font-bold text-gray-700 ml-2">コース:</span>
                      <button
                        onClick={() => setPastFilterCourse(null)}
                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
                          pastFilterCourse === null
                            ? 'bg-purple-400 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        全て
                      </button>
                      {Array.from(new Set(races.filter(r => r.result && r.courseKey).map(r => r.courseKey))).sort().map(course => (
                        <button
                          key={course}
                          onClick={() => setPastFilterCourse(course)}
                          className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition ${
                            pastFilterCourse === course
                              ? 'bg-purple-400 text-white'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                        >
                          {course}
                        </button>
                      ))}
                    </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowAdvancedFilterModal(true)}
                            className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition flex items-center gap-2 ${
                              (() => {
                                const hasGapPosition = Object.values(advancedFilters.gapPositions).some(v => v === true);
                                const hasGapCount = advancedFilters.gapCount !== 'any';
                                const hasSpecialHorse = Object.values(advancedFilters.specialHorses).some(v => v === true);
                                const hasResult = Object.values(advancedFilters.resultFilter).some(v => v === true);
                                return hasGapPosition || hasGapCount || hasSpecialHorse || hasResult;
                              })()
                                ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                          >
                            🔍 詳細検索
                            {(() => {
                              const hasGapPosition = Object.values(advancedFilters.gapPositions).some(v => v === true);
                              const hasGapCount = advancedFilters.gapCount !== 'any';
                              const hasSpecialHorse = Object.values(advancedFilters.specialHorses).some(v => v === true);
                              const hasResult = Object.values(advancedFilters.resultFilter).some(v => v === true);
                              const count = [
                                hasGapPosition,
                                hasGapCount,
                                hasSpecialHorse,
                                hasResult
                              ].filter(Boolean).length;
                              return count > 0 ? (
                                <span className="px-2 py-0.5 bg-white text-purple-600 rounded-full text-xs font-bold">
                                  {count}
                                </span>
                              ) : null;
                            })()}
                          </button>
                          {(() => {
                            const hasGapPosition = Object.values(advancedFilters.gapPositions).some(v => v === true);
                            const hasGapCount = advancedFilters.gapCount !== 'any';
                            const hasSpecialHorse = Object.values(advancedFilters.specialHorses).some(v => v === true);
                            const hasResult = Object.values(advancedFilters.resultFilter).some(v => v === true);
                            return hasGapPosition || hasGapCount || hasSpecialHorse || hasResult;
                          })() && (
                            <button
                              onClick={() => {
                                setAdvancedFilters({
                                  gapPositions: {
                                    after1st: false,
                                    after2nd: false,
                                    after3rd: false,
                                    after4th: false,
                                    after5th: false,
                                    after6th: false
                                  },
                                  gapCount: 'any',
                                  specialHorses: {
                                    hasExpectation: false,
                                    hasSuperExp: false,
                                    hasAiRec: false
                                  },
                                  resultFilter: {
                                    tanshoHit: false,
                                    fukushoHit: false,
                                    miss: false
                                  }
                                });
                              }}
                              className="px-3 py-2 rounded-full text-xs md:text-sm font-bold bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                            >
                              リセット
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                
                {/* 該当件数表示（過去の予想タブで高度フィルター適用時） */}
                {activeTab === 'races-past' && isAdmin && (() => {
                  const hasGapPosition = Object.values(advancedFilters.gapPositions).some(v => v === true);
                  const hasGapCount = advancedFilters.gapCount !== 'any';
                  const hasSpecialHorse = Object.values(advancedFilters.specialHorses).some(v => v === true);
                  const hasResult = Object.values(advancedFilters.resultFilter).some(v => v === true);
                  return hasGapPosition || hasGapCount || hasSpecialHorse || hasResult;
                })() && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300">
                    <p className="text-sm font-bold text-purple-800 text-center">
                      {(() => {
                        let past = races.filter(r => r.result);
                        if (pastFilterCourse) {
                          past = past.filter(r => r.courseKey === pastFilterCourse);
                        }
                        past = past.filter(race => checkAdvancedFilter(race));
                        return past.length;
                      })()}件のレースが該当
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(activeTab === 'races-upcoming' 
                    ? (() => {
                        const upcoming = races.filter(r => !r.result);
                        if (upcomingSortBy === 'startTime') {
                          return upcoming.sort((a, b) => {
                            if (!a.startTime && !b.startTime) return 0;
                            if (!a.startTime) return 1;
                            if (!b.startTime) return -1;
                            return new Date(a.startTime) - new Date(b.startTime);
                          });
                        } else {
                          return upcoming.sort((a, b) => {
                            const aDate = new Date(a.createdAt || 0);
                            const bDate = new Date(b.createdAt || 0);
                            return bDate - aDate;
                          });
                        }
                      })()
                    : (() => {
                        let past = races.filter(r => r.result);
                        if (pastFilterCourse) {
                          past = past.filter(r => r.courseKey === pastFilterCourse);
                        }
                        // 高度フィルターを適用
                        if (isAdmin) {
                          past = past.filter(race => checkAdvancedFilter(race));
                        }
                        if (pastSortBy === 'newest') {
                          return past.sort((a, b) => {
                            const aDate = new Date(a.createdAt || 0);
                            const bDate = new Date(b.createdAt || 0);
                            return bDate - aDate;
                          });
                        } else {
                          return past.sort((a, b) => {
                            const aDate = new Date(a.createdAt || 0);
                            const bDate = new Date(b.createdAt || 0);
                            return aDate - bDate;
                          });
                        }
                      })()
                  ).map((race) => (
                    <div
                      key={race.firebaseId}
                      onClick={() => handleRaceClick(race)}
                      className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-3 md:p-4 border-2 border-pink-200 hover:border-purple-400 cursor-pointer hover:shadow-lg transition hover:scale-105 group relative"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {race.passcode ? <LockPixelArt size={18} /> : <HorsePixelArt size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-sm md:text-base text-gray-800 truncate flex items-center gap-1 flex-wrap">
                            {race.name}
                            {race.confidence && <span className="flex-shrink-0">{renderStars(race.confidence)}</span>}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {race.createdAt} · {race.horses.length}頭
                            {race.courseKey && ` · ${race.courseKey}`}
                          </p>
                          {race.startTime && (
                            <p className="text-xs font-bold text-purple-600 mt-1">
                              🕐 {formatStartTime(race.startTime)}
                            </p>
                          )}
                          {isAdmin && (race.viewCount || race.viewCount === 0) && (
                            <p className="flex items-center gap-1 mt-1">
                              <EyePixelArt size={12} />
                              <span className="text-xs font-bold text-gray-600">{race.viewCount}回</span>
                            </p>
                          )}
                          {race.passcode && !isAdmin && (
                            <span className="text-xs text-purple-600 font-bold">🔒 要パスコード</span>
                          )}
                        </div>
                      </div>
                      
                      {/* 管理者用ボタン（修正：イベント伝播を防ぐ） */}
                      {isAdmin && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const raceData = races.find(r => r.firebaseId === race.firebaseId);
                              setEditingRaceData({
                                firebaseId: race.firebaseId,
                                name: raceData?.name || '',
                                startTime: raceData?.startTime || '',
                                confidence: raceData?.confidence || 3,
                                passcode: raceData?.passcode || '',
                                courseKey: raceData?.courseKey || ''
                              });
                              setShowEditRaceModal(true);
                            }}
                            className="flex-1 px-2 py-1 bg-purple-400 text-white rounded-full text-xs font-bold hover:bg-purple-500 transition"
                          >
                            ✏️ 編集
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameRace(race.firebaseId, race.name);
                            }}
                            className="flex-1 px-2 py-1 bg-blue-400 text-white rounded-full text-xs font-bold hover:bg-blue-500 transition"
                          >
                            📝 名称
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRaceToDelete(race.firebaseId);
                              setShowDeleteConfirm(true);
                            }}
                            className="flex-1 px-2 py-1 bg-red-400 text-white rounded-full text-xs font-bold hover:bg-red-500 transition"
                          >
                            🗑️ 削除
                          </button>
                        </div>
                      )}
                      
                      {race.odds && Object.keys(race.odds).length > 0 && (() => {
                        const raceWinRates = calculateWinRate(race.horses, race.courseKey);
                        const hasSuperExpectation = race.horses.some(horse => {
                          const odds = race.odds[horse.horseNum] || 0;
                          const horseData = raceWinRates.find(h => h.horseNum === horse.horseNum);
                          const winRate = horseData ? horseData.winRate : 0;
                          const value = odds * winRate;
                          return winRate >= 10 && value >= 220;
                        });
                        const hasExpectation = race.horses.some(horse => {
                          const odds = race.odds[horse.horseNum] || 0;
                          const horseData = raceWinRates.find(h => h.horseNum === horse.horseNum);
                          const winRate = horseData ? horseData.winRate : 0;
                          const value = odds * winRate;
                          return winRate >= 10 && value >= 150 && value < 220;
                        });
                        
                        if (hasSuperExpectation) {
                          return (
                            <div className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full shadow-md animate-pulse mt-2">
                              <span className="text-sm">💎</span>
                              <span>超期待値馬あり！</span>
                            </div>
                          );
                        } else if (hasExpectation) {
                          return (
                            <div className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 px-2 py-1 rounded-full shadow-md mt-2">
                              <StarPixelArt size={14} />
                              <span>期待値馬あり</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      
                      {race.result && (
                        <div className="flex items-center gap-1 flex-wrap mt-2">
                          <span className="text-xs font-bold text-gray-700">結果: {race.result.ranking}</span>
                          {race.result?.fukusho === 'hit' && <span className="text-base">✅</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-12 text-sm md:text-lg">レースデータがまだありません</p>
              )}
            </div>
          )}

          {activeTab === 'settings' && isAdmin && (
            <div className="bg-white rounded-3xl p-4 md:p-8 shadow-lg border-2 border-purple-200">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full hover:shadow-2xl hover:scale-105 transition transform font-bold text-base md:text-lg mb-4 md:mb-6 shadow-lg flex items-center justify-center gap-2"
              >
                <CrownPixelArt size={24} />
                新しいコース設定を作成
              </button>

              {Object.keys(courseSettings).length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-3 md:mb-4">保存済みコース設定</h2>
                  {Object.entries(courseSettings).map(([name, factorData]) => (
                    <div
                      key={name}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-3 md:p-4 border-2 border-purple-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-base md:text-lg text-gray-800">{name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameCourse(name);
                            }}
                            className="p-1.5 md:p-2 text-purple-500 hover:bg-purple-50 rounded-full transition"
                            title="名称変更"
                          >
                            ✏️📝
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCourse(name);
                            }}
                            className="p-1.5 md:p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                            title="比重を編集"
                          >
                            ⚙️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCourseSettings(name);
                            }}
                            className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                            title="削除"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm">
                        {Object.entries(factorData).map(([factor, weight]) => (
                          <div key={factor} className="bg-white p-2 rounded-lg border border-purple-300">
                            <div className="text-gray-600 text-xs font-bold truncate">{factor}</div>
                            <div className="font-bold text-purple-600 text-base md:text-lg">{weight}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12 text-sm md:text-base">保存されたコース設定がありません</p>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white rounded-3xl p-4 md:p-8 shadow-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <BarPixelArt size={24} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-700">成績分析</h2>
              </div>
              
              <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
                <button
                  onClick={() => setStatsType('winrate')}
                  className={`px-3 md:px-4 py-2 rounded-full font-bold transition text-xs md:text-sm flex items-center gap-1 md:gap-2 ${
                    statsType === 'winrate'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <MedalPixelArt size={16} />
                  勝率1位馬
                </button>
                <button
                  onClick={() => setStatsType('expectation')}
                  className={`px-3 md:px-4 py-2 rounded-full font-bold transition text-xs md:text-sm flex items-center gap-1 md:gap-2 ${
                    statsType === 'expectation'
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <StarPixelArt size={16} />
                  期待値馬
                </button>
                <button
                  onClick={() => setStatsType('ai')}
                  className={`px-3 md:px-4 py-2 rounded-full font-bold transition text-xs md:text-sm flex items-center gap-1 md:gap-2 ${
                    statsType === 'ai'
                      ? 'bg-blue-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <TrophyPixelArt size={16} />
                  AIおすすめ馬
                </button>
              </div>
              
              {/* 日付フィルター */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3">📅 期間フィルター</h3>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setStatsDateFilter({ type: 'all', singleDate: null, startDate: null, endDate: null })}
                    className={`px-3 py-2 rounded-full text-xs font-bold transition ${
                      statsDateFilter.type === 'all'
                        ? 'bg-purple-400 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    全期間
                  </button>
                  <button
                    onClick={() => setStatsDateFilter({ ...statsDateFilter, type: 'single' })}
                    className={`px-3 py-2 rounded-full text-xs font-bold transition ${
                      statsDateFilter.type === 'single'
                        ? 'bg-purple-400 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    特定日
                  </button>
                  <button
                    onClick={() => setStatsDateFilter({ ...statsDateFilter, type: 'range' })}
                    className={`px-3 py-2 rounded-full text-xs font-bold transition ${
                      statsDateFilter.type === 'range'
                        ? 'bg-purple-400 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    期間指定
                  </button>
                </div>
                
                {statsDateFilter.type === 'single' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">日付を選択</label>
                    <input
                      type="date"
                      value={statsDateFilter.singleDate || ''}
                      onChange={(e) => setStatsDateFilter({
                        ...statsDateFilter,
                        singleDate: e.target.value
                      })}
                      className="w-full px-3 py-2 border-2 border-purple-300 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
                
                {statsDateFilter.type === 'range' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">開始日</label>
                      <input
                        type="date"
                        value={statsDateFilter.startDate || ''}
                        onChange={(e) => setStatsDateFilter({
                          ...statsDateFilter,
                          startDate: e.target.value
                        })}
                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">終了日</label>
                      <input
                        type="date"
                        value={statsDateFilter.endDate || ''}
                        onChange={(e) => setStatsDateFilter({
                          ...statsDateFilter,
                          endDate: e.target.value
                        })}
                        className="w-full px-3 py-2 border-2 border-purple-300 rounded-xl text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {calculateStats(statsFilterCourse, statsType) ? (
                <div>
                  <div className="mb-4 p-3 bg-gray-100 rounded-2xl text-xs md:text-sm text-gray-700 font-bold">
                    {statsType === 'winrate' && '各レースの勝率1位馬の成績'}
                    {statsType === 'expectation' && '期待値150以上で最も期待値が高い馬の成績'}
                    {statsType === 'ai' && 'AIおすすめ馬の成績'}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* 単勝的中率 */}
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-4 md:p-6 border-2 border-pink-300 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <HeartPixelArt size={20} />
                        <h3 className="text-base md:text-lg font-bold text-pink-700">単勝的中率</h3>
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-pink-600">
                        {calculateStats(statsFilterCourse, statsType).tansho.rate}%
                      </div>
                      <div className="text-xs md:text-sm text-pink-700 mt-2 font-bold">
                        {calculateStats(statsFilterCourse, statsType).tansho.hits}/{calculateStats(statsFilterCourse, statsType).total} 的中
                      </div>
                    </div>
                    
                    {/* 単勝回収率（新規追加） */}
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl p-4 md:p-6 border-2 border-yellow-300 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <StarPixelArt size={20} />
                        <h3 className="text-base md:text-lg font-bold text-yellow-700">単勝回収率</h3>
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-yellow-600">
                        {calculateStats(statsFilterCourse, statsType).tansho.recovery}%
                      </div>
                      <div className="text-xs md:text-sm text-yellow-700 mt-2 font-bold">
                        {(() => {
                          const stats = calculateStats(statsFilterCourse, statsType);
                          const investment = stats.total * 100;
                          const returns = (investment * parseFloat(stats.tansho.recovery)) / 100;
                          const profit = returns - investment;
                          
                          // 10円単位に丸める
                          const roundedProfit = Math.round(profit / 10) * 10;
                          
                          return roundedProfit >= 0 
                            ? `+${roundedProfit.toLocaleString()}円 (${stats.total}レース)`
                            : `${roundedProfit.toLocaleString()}円 (${stats.total}レース)`;
                        })()}
                      </div>
                    </div>
                    
                    {/* 複勝（既存） */}
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-4 md:p-6 border-2 border-purple-300 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <TrophyPixelArt size={20} />
                        <h3 className="text-base md:text-lg font-bold text-purple-700">複勝</h3>
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-purple-600">
                        {calculateStats(statsFilterCourse, statsType).fukusho.rate}%
                      </div>
                      <div className="text-xs md:text-sm text-purple-700 mt-2 font-bold">
                        {calculateStats(statsFilterCourse, statsType).fukusho.hits}/{calculateStats(statsFilterCourse, statsType).total} 的中
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4 text-center font-bold">
                    ※ {statsType === 'expectation' && '期待値馬がいる'}
                    {statsType === 'ai' && 'AIおすすめ馬がいる'}
                    {statsType === 'winrate' && ''}
                    {statsType !== 'winrate' && 'レースのみを集計対象としています'}
                  </p>
                  <div className="text-xs text-gray-600 text-center mt-2 font-bold">
                    📊 集計対象: {calculateStats(statsFilterCourse, statsType).total}レース
                    {statsDateFilter.type === 'single' && statsDateFilter.singleDate && ` (${statsDateFilter.singleDate})`}
                    {statsDateFilter.type === 'range' && statsDateFilter.startDate && statsDateFilter.endDate && 
                      ` (${statsDateFilter.startDate} 〜 ${statsDateFilter.endDate})`}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12 text-sm md:text-lg">
                  {statsType === 'expectation' && '期待値馬がいるレースがありません'}
                  {statsType === 'ai' && 'AIおすすめ馬がいるレースがありません'}
                  {statsType === 'winrate' && '結果が記録されたレースがありません'}
                </p>
              )}
            </div>
          )}

          {/* 🔍 詳細検索モーダル（過去レースの高度フィルター） */}
          {showAdvancedFilterModal && isAdmin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔍</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">詳細検索</h2>
                </div>

                <div className="space-y-6">
                  {/* 条件1：断層の位置 */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span>📊</span>
                      条件1：断層の位置（複数選択可）
                    </h3>
                    <div className="space-y-2 pl-6">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.gapPositions.after1st}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            gapPositions: { ...advancedFilters.gapPositions, after1st: e.target.checked }
                          })}
                          className="w-5 h-5 accent-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-700">勝率1位の下に断層がある</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.gapPositions.after2nd}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            gapPositions: { ...advancedFilters.gapPositions, after2nd: e.target.checked }
                          })}
                          className="w-5 h-5 accent-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-700">勝率2位の下に断層がある</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.gapPositions.after3rd}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            gapPositions: { ...advancedFilters.gapPositions, after3rd: e.target.checked }
                          })}
                          className="w-5 h-5 accent-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-700">勝率3位の下に断層がある</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.gapPositions.after4th}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            gapPositions: { ...advancedFilters.gapPositions, after4th: e.target.checked }
                          })}
                          className="w-5 h-5 accent-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-700">勝率4位の下に断層がある</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.gapPositions.after5th}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            gapPositions: { ...advancedFilters.gapPositions, after5th: e.target.checked }
                          })}
                          className="w-5 h-5 accent-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-700">勝率5位の下に断層がある</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.gapPositions.after6th}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            gapPositions: { ...advancedFilters.gapPositions, after6th: e.target.checked }
                          })}
                          className="w-5 h-5 accent-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-700">勝率6位以下の下に断層がある</span>
                      </label>
                    </div>
                  </div>

                  {/* 条件2：断層の数 */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span>🔢</span>
                      条件2：断層の数（単一選択）
                    </h3>
                    <div className="pl-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                          <input
                            type="radio"
                            name="gapCount"
                            checked={advancedFilters.gapCount === 'any'}
                            onChange={() => setAdvancedFilters({ ...advancedFilters, gapCount: 'any' })}
                            className="w-5 h-5 accent-purple-500"
                          />
                          <span className="text-sm font-bold text-gray-700">制限なし</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                          <input
                            type="radio"
                            name="gapCount"
                            checked={advancedFilters.gapCount === 'exactly1'}
                            onChange={() => setAdvancedFilters({ ...advancedFilters, gapCount: 'exactly1' })}
                            className="w-5 h-5 accent-purple-500"
                          />
                          <span className="text-sm font-bold text-gray-700">正確に1つ</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                          <input
                            type="radio"
                            name="gapCount"
                            checked={advancedFilters.gapCount === 'exactly2'}
                            onChange={() => setAdvancedFilters({ ...advancedFilters, gapCount: 'exactly2' })}
                            className="w-5 h-5 accent-purple-500"
                          />
                          <span className="text-sm font-bold text-gray-700">正確に2つ</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition">
                          <input
                            type="radio"
                            name="gapCount"
                            checked={advancedFilters.gapCount === '3plus'}
                            onChange={() => setAdvancedFilters({ ...advancedFilters, gapCount: '3plus' })}
                            className="w-5 h-5 accent-purple-500"
                          />
                          <span className="text-sm font-bold text-gray-700">3つ以上</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 条件3：特殊な馬の存在 */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span>⭐</span>
                      条件3：特殊な馬の存在（複数選択可）
                    </h3>
                    <div className="space-y-2 pl-6">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-yellow-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.specialHorses.hasExpectation}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            specialHorses: { ...advancedFilters.specialHorses, hasExpectation: e.target.checked }
                          })}
                          className="w-5 h-5 accent-yellow-500"
                        />
                        <span className="text-sm font-bold text-gray-700">期待値150以上の馬がいる</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-yellow-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.specialHorses.hasSuperExp}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            specialHorses: { ...advancedFilters.specialHorses, hasSuperExp: e.target.checked }
                          })}
                          className="w-5 h-5 accent-yellow-500"
                        />
                        <span className="text-sm font-bold text-gray-700">超期待値馬（220以上）がいる</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-yellow-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.specialHorses.hasAiRec}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            specialHorses: { ...advancedFilters.specialHorses, hasAiRec: e.target.checked }
                          })}
                          className="w-5 h-5 accent-yellow-500"
                        />
                        <span className="text-sm font-bold text-gray-700">AIおすすめ馬がいる</span>
                      </label>
                    </div>
                  </div>

                  {/* 条件4：的中結果 */}
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <span>🏆</span>
                      条件4：的中結果（複数選択可）
                    </h3>
                    <div className="space-y-2 pl-6">
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-green-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.resultFilter.tanshoHit}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            resultFilter: { ...advancedFilters.resultFilter, tanshoHit: e.target.checked }
                          })}
                          className="w-5 h-5 accent-green-500"
                        />
                        <span className="text-sm font-bold text-gray-700">単勝的中したレース</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-green-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.resultFilter.fukushoHit}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            resultFilter: { ...advancedFilters.resultFilter, fukushoHit: e.target.checked }
                          })}
                          className="w-5 h-5 accent-green-500"
                        />
                        <span className="text-sm font-bold text-gray-700">複勝的中したレース</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-red-50 rounded-lg transition">
                        <input
                          type="checkbox"
                          checked={advancedFilters.resultFilter.miss}
                          onChange={(e) => setAdvancedFilters({
                            ...advancedFilters,
                            resultFilter: { ...advancedFilters.resultFilter, miss: e.target.checked }
                          })}
                          className="w-5 h-5 accent-red-500"
                        />
                        <span className="text-sm font-bold text-gray-700">不的中レース（単勝も複勝も外れ）</span>
                      </label>
                    </div>
                  </div>

                  {/* 説明 */}
                  <div className="p-4 bg-purple-100 rounded-2xl border-2 border-purple-300">
                    <p className="text-xs md:text-sm text-purple-800 font-bold">
                      💡 複数の条件を選択した場合、全ての条件を満たすレース（AND条件）が表示されます。
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowAdvancedFilterModal(false)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition transform"
                  >
                    適用
                  </button>
                  <button
                    onClick={() => {
                      setAdvancedFilters({
                        gapPositions: {
                          after1st: false,
                          after2nd: false,
                          after3rd: false,
                          after4th: false,
                          after5th: false,
                          after6th: false
                        },
                        gapCount: 'any',
                        specialHorses: {
                          hasExpectation: false,
                          hasSuperExp: false,
                          hasAiRec: false
                        },
                        resultFilter: {
                          tanshoHit: false,
                          fukushoHit: false,
                          miss: false
                        }
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    リセット
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ファクター分析モーダル */}
          {showFactorAnalysisModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <BarPixelArt size={32} />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">ファクター毎の的中率分析</h2>
                </div>

                {!factorAnalysisResults ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                      <p className="text-sm text-purple-800 font-bold">
                        📊 各ファクター単独で勝率1位になった馬の的中率を分析します
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">コース設定を選択</label>
                      <select
                        value={selectedAnalysisCourse || ''}
                        onChange={(e) => setSelectedAnalysisCourse(e.target.value || null)}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 font-bold"
                      >
                        <option value="">全コース（デフォルト設定含む）</option>
                        {availableCourses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-600 mt-2 font-bold">
                        ※ 結果が記録されているレースのコース設定のみ表示されます
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        日付でフィルター（オプション）
                      </label>
                      <input
                        type="date"
                        value={analysisDateFilter || ''}
                        onChange={(e) => setAnalysisDateFilter(e.target.value || null)}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-600 mt-2 font-bold">
                        ※ 特定の日に行われたレースのみを分析対象にできます
                      </p>
                    </div>

                    <button
                      onClick={handleAnalyzeFactors}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition flex items-center justify-center gap-2"
                    >
                      <StarPixelArt size={20} />
                      分析を実行
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-purple-100 rounded-2xl border-2 border-purple-300">
                      <p className="text-sm text-purple-800 font-bold">
                        📊 対象レース: {factorAnalysisResults.recordedRacesCount}レース
                        {selectedAnalysisCourse && ` (${selectedAnalysisCourse})`}
                        {!selectedAnalysisCourse && ' (全コース)'}
                        {analysisDateFilter && ` - ${analysisDateFilter}`}
                      </p>
                    </div>

                    {factorAnalysisResults.bettingStats && factorAnalysisResults.bettingStats.total > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-300">
                        <h4 className="font-bold text-gray-800 mb-3">📊 買い目的中率</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-xs text-gray-600 font-bold">的中率</div>
                            <div className="text-2xl font-black text-cyan-600">
                              {factorAnalysisResults.bettingStats.hitRate}%
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 font-bold">的中</div>
                            <div className="text-xl font-bold text-green-600">
                              {factorAnalysisResults.bettingStats.hit}回
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-600 font-bold">不的中</div>
                            <div className="text-xl font-bold text-red-600">
                              {factorAnalysisResults.bettingStats.miss}回
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-2 font-bold text-center">
                          対象: {factorAnalysisResults.bettingStats.total}レース
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {Object.entries(factorAnalysisResults.results)
                        .sort((a, b) => parseFloat(b[1].tanshoRate) - parseFloat(a[1].tanshoRate))
                        .map(([factor, stats]) => (
                          <div key={factor} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-bold text-gray-800 text-base md:text-lg">{factor}</h3>
                              <span className="text-xs text-gray-600 font-bold">（{stats.total}レース）</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-xl border-2 border-pink-300">
                                <div className="text-xs text-gray-600 font-bold mb-1">単勝的中率</div>
                                <div className="text-xl md:text-2xl font-black text-pink-600">{stats.tanshoRate}%</div>
                                <div className="text-xs text-gray-600 mt-1 font-bold">{stats.tansho}/{stats.total}</div>
                              </div>
                              <div className="bg-white p-3 rounded-xl border-2 border-purple-300">
                                <div className="text-xs text-gray-600 font-bold mb-1">複勝的中率</div>
                                <div className="text-xl md:text-2xl font-black text-purple-600">{stats.fukushoRate}%</div>
                                <div className="text-xs text-gray-600 mt-1 font-bold">{stats.fukusho}/{stats.total}</div>
                              </div>
                            </div>

                            <div className="mt-3 flex items-end gap-1 h-12">
                              <div className="flex-1 bg-pink-300 rounded-t opacity-70" style={{height: `${Math.min(parseFloat(stats.tanshoRate) * 1.5, 100)}px`}}></div>
                              <div className="flex-1 bg-purple-300 rounded-t opacity-70" style={{height: `${Math.min(parseFloat(stats.fukushoRate) * 1.5, 100)}px`}}></div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={() => {
                        setFactorAnalysisResults(null);
                        setSelectedAnalysisCourse(null);
                        setAnalysisDateFilter(null);
                      }}
                      className="w-full px-6 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                    >
                      条件を変更して再分析
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowFactorAnalysisModal(false);
                    setFactorAnalysisResults(null);
                    setSelectedAnalysisCourse(null);
                    setAnalysisDateFilter(null);
                    setActiveTab('races-upcoming');
                  }}
                  className="w-full mt-4 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                >
                  閉じる
                </button>
              </div>
            </div>
          )}

          {/* レースデータアップロードモーダル */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
                  <HorsePixelArt size={24} />
                  レースデータを追加
                </h3>

                {importMessage && (
                  <div className={`p-3 md:p-4 rounded-2xl mb-4 md:mb-6 font-bold text-sm md:text-base ${
                    importMessageType === 'success' 
                      ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                      : 'bg-red-100 text-red-800 border-2 border-red-400'
                  }`}>
                    {importMessage}
                  </div>
                )}

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">レース名</label>
                  <input
                    type="text"
                    value={raceName}
                    onChange={(e) => setRaceName(e.target.value)}
                    placeholder="例：京都12R 嵯峨野特別"
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-sm md:text-base"
                  />
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">コース設定を選択（オプション）</label>
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value || null)}
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 text-sm md:text-base"
                  >
                    <option value="">デフォルト設定を使用</option>
                    {Object.keys(courseSettings).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">⭐ 自信度</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRaceConfidence(star)}
                        className={`flex-1 py-2 rounded-xl font-bold transition text-sm md:text-base ${
                          raceConfidence === star
                            ? 'bg-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {'★'.repeat(star)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">🕐 発走時間</label>
                  <input
                    type="datetime-local"
                    value={raceStartTime}
                    onChange={(e) => setRaceStartTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 text-sm md:text-base"
                  />
                </div>
                
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <LockPixelArt size={20} />
                    パスコード（オプション）
                    <span className="text-xs text-gray-500 font-normal">※6桁の数字</span>
                  </label>
                  <input
                    type="text"
                    value={racePasscode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setRacePasscode(value);
                    }}
                    placeholder="例：123456（空欄=誰でも閲覧可）"
                    maxLength={6}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-mono text-lg tracking-widest"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    パスコードを設定すると、一般ユーザーは入力しないと閲覧できなくなります
                  </p>
                </div>

                {/* 入力モード選択 */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">データ入力方法</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setInputMode('paste')}
                      className={`flex-1 px-4 py-3 rounded-2xl font-bold transition text-sm md:text-base ${
                        inputMode === 'paste'
                          ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      📋 コピペ入力
                    </button>
                    <button
                      onClick={() => setInputMode('manual')}
                      className={`flex-1 px-4 py-3 rounded-2xl font-bold transition text-sm md:text-base ${
                        inputMode === 'manual'
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      ✏️ 手入力
                    </button>
                  </div>
                </div>

                {/* コピペモード */}
                {inputMode === 'paste' && (
                  <div className="mb-4 md:mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">データ（コピペ）</label>
                    <textarea
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      className="w-full h-48 p-4 border-2 border-pink-300 rounded-2xl font-mono text-sm focus:outline-none focus:border-pink-500"
                      placeholder="データをここにペーストしてください"
                    />
                  </div>
                )}

                {/* 手入力モード */}
                {inputMode === 'manual' && (
                  <div className="mb-4 md:mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold text-gray-700">出走馬リスト</label>
                      <button
                        onClick={addManualHorse}
                        className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-2xl transition"
                      >
                        ➕ 馬を追加
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {manualHorses.map((horse) => (
                        <div key={horse.horseNum} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="font-bold text-blue-600 text-lg">{horse.horseNum}.</span>
                              <input
                                type="text"
                                value={horse.name}
                                onChange={(e) => updateManualHorse(horse.horseNum, 'name', e.target.value)}
                                placeholder="馬名"
                                className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <button
                              onClick={() => deleteManualHorse(horse.horseNum)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition ml-2"
                            >
                              🗑️
                            </button>
                          </div>

                          {editingHorse === horse.horseNum && (
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t-2 border-blue-300">
                              {Object.entries(horse.scores).map(([factor, score]) => (
                                <div key={factor} className="flex items-center gap-2">
                                  <label className="text-xs font-bold text-gray-700 w-32 truncate">{factor}</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={score}
                                    onChange={(e) => updateManualHorseScore(horse.horseNum, factor, e.target.value)}
                                    className="w-20 px-2 py-1 border-2 border-blue-300 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => setEditingHorse(editingHorse === horse.horseNum ? null : horse.horseNum)}
                            className="mt-3 w-full px-3 py-2 bg-blue-400 text-white rounded-lg font-bold text-xs hover:bg-blue-500 transition"
                          >
                            {editingHorse === horse.horseNum ? '▲ 閉じる' : '▼ ファクターを編集'}
                          </button>
                        </div>
                      ))}
                    </div>

                    {manualHorses.length === 0 && (
                      <p className="text-gray-500 text-center py-8 text-sm">「馬を追加」ボタンで出走馬を登録してください</p>
                    )}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleDataImport}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition transform"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setPasteText('');
                      setRaceName('');
                      setRacePasscode('');
                      setManualHorses([]);
                      setInputMode('paste');
                      setImportMessage('');
                      setSelectedCourse(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🔒 パスコード認証モーダル */}
          {showPasscodeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <LockPixelArt size={48} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">パスコードを入力</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    このレースは保護されています
                  </p>
                </div>

                {passcodeError && (
                  <div className="p-3 bg-red-100 border-2 border-red-400 rounded-2xl mb-4 text-center">
                    <p className="text-red-800 font-bold text-sm">{passcodeError}</p>
                  </div>
                )}

                <div className="mb-6">
                  <input
                    type="text"
                    value={passcodeInput}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPasscodeInput(value);
                      setPasscodeError('');
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && passcodeInput.length === 6) {
                        handlePasscodeSubmit();
                      }
                    }}
                    placeholder="6桁の数字"
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-4 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-mono text-2xl tracking-widest text-center"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePasscodeSubmit}
                    disabled={passcodeInput.length !== 6}
                    className={`flex-1 px-6 py-3 rounded-full font-bold shadow-lg transition ${
                      passcodeInput.length === 6
                        ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:shadow-2xl hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    認証
                  </button>
                  <button
                    onClick={() => {
                      setShowPasscodeModal(false);
                      setPasscodeInput('');
                      setPasscodeError('');
                      setSelectedLockedRace(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* コース設定作成モーダル */}
          {showSettingsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
                  <CrownPixelArt size={24} />
                  新しいコース設定を作成
                </h3>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">コース名</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="例：新潟千直、京都ダ1400"
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">比重設定（合計100%）</label>
                  <div className="space-y-3">
                    {Object.entries(tempFactors).map(([factor, weight]) => (
                      <div key={factor} className="flex items-center gap-3">
                        <label className="w-32 md:w-40 text-sm font-bold text-gray-700 truncate">{factor}</label>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setTempFactors({
                            ...tempFactors,
                            [factor]: parseInt(e.target.value) || 0
                          })}
                          className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-600">%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-purple-100 rounded-2xl text-sm text-purple-800 font-bold border-2 border-purple-300">
                    合計: {Object.values(tempFactors).reduce((a, b) => a + b, 0)}%
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={saveCourseSettings}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition transform"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setCourseName('');
                      setTempFactors({
                        '能力値': 15,
                        'コース・距離適性': 18,
                        '展開利': 17,
                        '近走安定度': 10,
                        '馬場適性': 10,
                        '騎手': 5,
                        '斤量': 10,
                        '調教': 15
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 管理者モーダル */}
          {showAdminModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
                  <CrownPixelArt size={24} />
                  管理者パスコード
                </h3>
                
                {isAdmin && (
                  <div className="mb-6">
                    <div className="p-4 bg-green-100 border-2 border-green-400 rounded-2xl text-sm text-green-800 font-bold mb-4">
                      ✓ 管理者モード有効
                    </div>
                    
                    <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-700">現在のバージョン</span>
                        <span className="text-lg font-black text-blue-600">{APP_VERSION}</span>
                      </div>
                      <button
                        onClick={() => {
                          const versionRef = ref(database, 'appVersion');
                          set(versionRef, APP_VERSION).then(() => {
                            window.alert(`✅ Firebaseのバージョンを ${APP_VERSION} に更新しました！\n\n古いバージョンを開いている全ユーザーに更新通知が送られます。`);
                          }).catch((error) => {
                            window.alert('❌ 更新に失敗しました: ' + error.message);
                          });
                        }}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition"
                      >
                        🔄 全ユーザーに更新を配信
                      </button>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        このボタンを押すと全員に最新版への更新が促されます
                      </p>
                    </div>
                    
                    <button
                      onClick={initializeHorseMarks}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition mt-4"
                    >
                      🔧 印データを初期化（全レース）
                    </button>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      全レースに空の印データを追加します（既存の印は保持されます）
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">パスコードを入力</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500"
                    placeholder="パスコード"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (adminPassword === '6969331') {
                        setIsAdmin(true);
                        setAdminPassword('');
                        setShowAdminModal(false);
                      } else {
                        window.alert('パスコードが違います');
                        setAdminPassword('');
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    認証
                  </button>
                  <button
                    onClick={() => {
                      if (isAdmin) {
                        setIsAdmin(false);
                      }
                      setShowAdminModal(false);
                      setAdminPassword('');
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    {isAdmin ? 'ログアウト' : 'キャンセル'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 削除確認モーダル */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-red-600">レースを削除しますか？</h3>
                <p className="text-gray-700 mb-6 font-bold text-sm md:text-base">
                  この操作は取り消せません。本当に削除してもよろしいですか？
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => deleteRace(raceToDelete)}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    削除する
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setRaceToDelete(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✏️ レース名変更モーダル */}
          {showRenameModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <HorsePixelArt size={24} />
                  レース名を変更
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">新しいレース名</label>
                  <input
                    type="text"
                    value={newRaceName}
                    onChange={(e) => setNewRaceName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-2xl focus:outline-none focus:border-blue-500"
                    placeholder="新しいレース名"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={saveRaceName}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setShowRenameModal(false);
                      setNewRaceName('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✏️ レース編集モーダル */}
          {showEditRaceModal && isAdmin && editingRaceData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <CrownPixelArt size={24} />
                  レース情報を編集
                </h3>
                
                {/* レース名 */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">レース名</label>
                  <input
                    type="text"
                    value={editingRaceData.name || ''}
                    onChange={(e) => setEditingRaceData({...editingRaceData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 発走時刻 */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">🕐 発走時刻</label>
                  <input
                    type="datetime-local"
                    value={editingRaceData.startTime ? new Date(editingRaceData.startTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditingRaceData({
                        ...editingRaceData, 
                        startTime: value ? new Date(value).toISOString() : null
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 自信度 */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">⭐ 自信度</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setEditingRaceData({...editingRaceData, confidence: star})}
                        className={`flex-1 py-2 rounded-xl font-bold transition ${
                          editingRaceData.confidence === star
                            ? 'bg-yellow-400 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {'★'.repeat(star)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* パスコード */}
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <LockPixelArt size={20} />
                    パスコード（6桁の数字）
                  </label>
                  <input
                    type="text"
                    value={editingRaceData.passcode || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setEditingRaceData({
                        ...editingRaceData, 
                        passcode: value ? value : null
                      });
                    }}
                    placeholder="空欄で解除（誰でも閲覧可）"
                    maxLength={6}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 font-mono text-lg tracking-widest"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {editingRaceData.passcode 
                      ? `🔒 パスコード設定中（${editingRaceData.passcode.length}/6桁）`
                      : '🔓 パスコードなし（誰でも閲覧可）'
                    }
                  </p>
                </div>

                {/* コース設定 */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">コース設定</label>
                  <select
                    value={editingRaceData.courseKey || ''}
                    onChange={(e) => setEditingRaceData({...editingRaceData, courseKey: e.target.value || null})}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500"
                  >
                    <option value="">デフォルト設定を使用</option>
                    {Object.keys(courseSettings).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* 保存・キャンセルボタン */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      // バリデーション
                      if (!editingRaceData.name.trim()) {
                        window.alert('レース名を入力してください');
                        return;
                      }
                      
                      if (editingRaceData.passcode && editingRaceData.passcode.length !== 6) {
                        window.alert('パスコードは6桁で入力してください');
                        return;
                      }
                      
                      // Firebaseに保存（既存データを保持したまま、指定項目のみ更新）
                      const raceRef = ref(database, `races/${editingRaceData.firebaseId}`);
                      const currentRace = races.find(r => r.firebaseId === editingRaceData.firebaseId);
                      if (currentRace) {
                        const updatedRace = {
                          ...currentRace,
                          name: editingRaceData.name.trim(),
                          startTime: editingRaceData.startTime || null,
                          confidence: editingRaceData.confidence || 3,
                          passcode: editingRaceData.passcode || null,
                          courseKey: editingRaceData.courseKey || null
                        };
                        set(raceRef, updatedRace).then(() => {
                          window.alert('✅ 保存しました');
                          setShowEditRaceModal(false);
                          setEditingRaceData(null);
                        }).catch((error) => {
                          console.error('保存エラー:', error);
                          window.alert('❌ 保存に失敗しました');
                        });
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setShowEditRaceModal(false);
                      setEditingRaceData(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 🎛️ コース設定編集モーダル */}
          {showEditCourseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <CrownPixelArt size={24} />
                  {courseName}の設定を編集
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">比重設定（合計100%）</label>
                  <div className="space-y-3">
                    {Object.entries(tempFactors).map(([factor, weight]) => (
                      <div key={factor} className="flex items-center gap-3">
                        <label className="w-32 md:w-40 text-sm font-bold text-gray-700 truncate">{factor}</label>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setTempFactors({
                            ...tempFactors,
                            [factor]: parseInt(e.target.value) || 0
                          })}
                          className="w-20 px-3 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                        <span className="text-sm font-bold text-gray-600">%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-purple-100 rounded-2xl text-sm text-purple-800 font-bold border-2 border-purple-300">
                    合計: {Object.values(tempFactors).reduce((a, b) => a + b, 0)}%
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={saveEditedCourse}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setShowEditCourseModal(false);
                      setEditingCourseKey(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 📝 コース設定名変更モーダル */}
          {showRenameCourseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <CrownPixelArt size={24} />
                  コース設定名を変更
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    現在の名前
                  </label>
                  <div className="px-4 py-3 bg-gray-100 rounded-2xl text-gray-600 font-bold">
                    {renamingCourseKey}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    新しい名前
                  </label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500"
                    placeholder="新しいコース名"
                    autoFocus
                  />
                </div>
                
                <div className="mb-4 p-3 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                  <p className="text-xs text-yellow-800 font-bold">
                    ⚠️ このコース設定を使用している全てのレースの参照も自動的に更新されます
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={saveCourseName}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    変更を保存
                  </button>
                  <button
                    onClick={() => {
                      setShowRenameCourseModal(false);
                      setRenamingCourseKey(null);
                      setNewCourseName('');
                    }}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  }

  // レース詳細画面
  const resultsWithRate = calculateWinRate(currentRace.horses, raceSelectedCourse);
  const expectationRanking = calculateExpectationRanking(resultsWithRate, oddsInput);
  const aiRecommendation = calculateAIRecommendation(resultsWithRate);
  const winRateGaps = detectWinRateGaps(resultsWithRate);
  const allFactorDeviations = calculateFactorDeviations(currentRace.horses);

  const factorKeys = Object.keys(allFactorDeviations || {});
  const activeHorseNums = resultsWithRate.map(horse => horse.horseNum);

  const factorTotals = {};
  const factorAverages = {};
  const validFactorCounts = {};

  activeHorseNums.forEach(horseNum => {
    let total = 0;
    let count = 0;
    factorKeys.forEach(factorKey => {
      const deviation = allFactorDeviations[factorKey]?.[horseNum];
      if (deviation !== null && deviation !== undefined && !Number.isNaN(deviation)) {
        total += deviation;
        count += 1;
      }
    });
    factorTotals[horseNum] = count > 0 ? total : null;
    factorAverages[horseNum] = count > 0 ? total / count : null;
    validFactorCounts[horseNum] = count;
  });

  const createRanking = (valuesMap) => {
    const rankingEntries = Object.entries(valuesMap)
      .filter(([, value]) => value !== null && value !== undefined && !Number.isNaN(value))
      .sort((a, b) => b[1] - a[1]);

    const ranking = {};
    rankingEntries.forEach(([horseNum], idx) => {
      ranking[horseNum] = idx + 1;
    });
    return ranking;
  };

  const totalDeviationRanking = createRanking(factorTotals);
  const averageDeviationRanking = createRanking(factorAverages);

  const factorRankings = {};
  factorKeys.forEach(factorKey => {
    const map = {};
    activeHorseNums.forEach(horseNum => {
      const deviation = allFactorDeviations[factorKey]?.[horseNum];
      if (deviation !== null && deviation !== undefined && !Number.isNaN(deviation)) {
        map[horseNum] = deviation;
      }
    });
    factorRankings[factorKey] = createRanking(map);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <Sidebar
        activeTab={activeTab}
        onSelect={handleSidebarSelect}
        isAdmin={isAdmin}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-pink-600 shadow-lg border border-pink-200"
        >
          ☰ メニュー
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsSidebarOpen(false)}
          />
          <Sidebar
            activeTab={activeTab}
            onSelect={handleSidebarSelect}
            isAdmin={isAdmin}
            onClose={() => setIsSidebarOpen(false)}
            isMobile
          />
        </div>
      )}

      <div role="main" className="ml-0 md:ml-64 px-4 sm:px-6 lg:px-10 py-8 md:py-10">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          <div className="relative rounded-3xl border-2 border-pink-200 bg-white p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 shadow-inner">
                  <HorsePixelArt size={28} />
                </div>
                <div className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 shadow-inner">
                  <HorsePixelArt size={22} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight break-words">
                    {currentRace.name}
                  </h1>
                  <p className="mt-2 text-xs md:text-base text-gray-600 font-bold break-words space-x-2">
                    <span>{currentRace.createdAt}</span>
                    <span>· {currentRace.horses.length}頭</span>
                    {raceSelectedCourse && <span>· {raceSelectedCourse}</span>}
                    {isAdmin && <span>· EXP係数: {expCoefficient}</span>}
                  </p>
                </div>
              </div>
              <div className="flex w-full md:w-auto justify-end">
                <button
                  onClick={() => setCurrentRace(null)}
                  className="inline-flex items-center justify-center rounded-full bg-gray-400 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold text-white shadow-lg transition hover:bg-gray-500 hover:shadow-xl"
                >
                  ← 戻る
                </button>
              </div>
            </div>
          </div>

        {currentRace.result && (
          <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-3xl p-4 md:p-6 mb-4 md:mb-6 shadow-lg">
            <h3 className="font-bold text-green-800 mb-2 text-base md:text-lg">✅ 結果記録済み</h3>
            <p className="font-bold text-green-700 text-sm md:text-base">着順: {currentRace.result.ranking}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-3 md:p-6 shadow-lg mb-4 md:mb-6 border-2 border-pink-200">
          <h2 className="text-lg md:text-3xl font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
            <StarPixelArt size={20} />
            ファクター選択
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
            {Object.entries(selectedFactors).map(([factorKey, isSelected]) => (
              <div key={factorKey} className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition">
                <label className="flex items-center gap-2 cursor-pointer flex-1 text-xs md:text-sm">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFactorToggle(factorKey)}
                  className="w-4 h-4 accent-pink-500"
                />
                  <span className="font-bold text-gray-700 truncate flex-1">{factorKey}</span>
              </label>
                {isAdmin && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <input
                      type="number"
                      step="0.1"
                      value={cutoffDeviations[factorKey] ?? ''}
                      onChange={(e) => updateCutoffDeviation(factorKey, e.target.value)}
                      placeholder="切"
                      className="w-16 px-2 py-1 border-2 border-purple-300 rounded-lg text-xs focus:outline-none focus:border-purple-500 font-bold text-center"
                    />
                    <span className="text-xs text-gray-600 font-bold">以上</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {isAdmin && (
            <div className="mt-3 p-2 bg-purple-100 rounded-lg text-xs text-purple-800 font-bold border-2 border-purple-300">
              💡 管理者のみ：各ファクターの足切り偏差値を設定できます。設定した基準をクリアしない馬は背景がグレーになります。
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg mb-4 md:mb-6 border-2 border-purple-200">
          <div className="relative">
            <div className="flex items-start gap-2 pr-0 md:pr-64">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-purple-200 shadow-inner">
                <CrownPixelArt size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black text-gray-800">勝率ランキング</h2>
                {raceSelectedCourse && (
                  <p className="text-xs md:text-sm text-gray-600 mt-1 font-bold">コース: {raceSelectedCourse}</p>
                )}
              </div>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2 flex-wrap w-full justify-end md:w-auto md:absolute md:top-0 md:right-0">
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowCourseSelectModal(true)}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
                  >
                    <CrownPixelArt size={14} />
                    <span className="hidden md:inline">コース変更</span>
                    <span className="md:hidden">コース</span>
                  </button>
                  <button
                    onClick={() => {
                      setTempExpCoefficient(expCoefficient);
                      setShowExpModal(true);
                    }}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
                  >
                    EXP
                  </button>
                  <button
                    onClick={() => setShowExcludeModal(true)}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
                  >
                    除外
                  </button>
                  <button
                    onClick={() => {
                      setOddsInput(currentRace.odds || {});
                      setOddsPasteText('');
                      setOddsInputMode('manual');
                      setShowOddsModal(true);
                    }}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
                  >
                    <StarPixelArt size={14} />
                    <span className="hidden md:inline">オッズ</span>
                    <span className="md:hidden">odds</span>
                  </button>
                  <button
                    onClick={() => setShowResultModal(true)}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
                  >
                    <MedalPixelArt size={14} />
                    <span className="hidden md:inline">結果</span>
                    <span className="md:hidden">結果</span>
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setBettingBudget(1000);
                  setBettingType('accuracy');
                  setGeneratedBets([]);
                  setShowBettingModal(true);
                }}
                className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
              >
                <TrophyPixelArt size={14} />
                <span className="hidden md:inline">買い目</span>
                <span className="md:hidden">買目</span>
              </button>
              <button
                onClick={() => {
                  setShowVirtualRaceModal(true);
                  setVirtualRaceResults(null);
                }}
                className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
              >
                <DicePixelArt size={14} />
                <span className="hidden md:inline">仮想</span>
                <span className="md:hidden">仮想</span>
              </button>
            </div>
          </div>

        <div className="space-y-3">
          {resultsWithRate.map((horse, idx) => {
            const odds = oddsInput[horse.horseNum] || 0;
            const value = odds * horse.winRate;

            const isSuperExpectation = horse.winRate >= 10 && value >= 220;
            const isGoodExpectation = horse.winRate >= 10 && value >= 150 && value < 220;

            const failedFactors = [];
            Object.keys(cutoffDeviations).forEach(factorKey => {
              const cutoffRaw = cutoffDeviations[factorKey];
              if (cutoffRaw !== null && cutoffRaw !== undefined && !Number.isNaN(cutoffRaw)) {
                const cutoff = parseFloat(cutoffRaw);
                const deviationRaw = allFactorDeviations[factorKey]?.[horse.horseNum];
                const deviation = deviationRaw !== null && deviationRaw !== undefined
                  ? parseFloat(deviationRaw)
                  : null;
                if (deviation !== null && !Number.isNaN(deviation)) {
                  if (deviation + 1e-6 < cutoff) {
                    failedFactors.push(factorKey);
                  }
                }
              }
            });

            const isCutoffFailed = failedFactors.length > 0;
            const cardExpanded = expandedHorseNum === horse.horseNum;
            const totalDeviation = factorTotals[horse.horseNum];
            const averageDeviation = factorAverages[horse.horseNum];

            const baseCardClass = 'rounded-3xl p-4 md:p-5 border-2 transition-all duration-200 cursor-pointer select-none';
            let visualClass = 'bg-white border-pink-100 hover:border-pink-300 hover:shadow-xl';

            if (isCutoffFailed) {
              visualClass = 'bg-gray-200 border-gray-300 text-gray-600 opacity-80';
            } else if (isSuperExpectation) {
              visualClass = 'bg-gradient-to-r from-yellow-200 via-pink-100 to-yellow-100 border-yellow-400 shadow-[0_0_25px_rgba(255,215,0,0.45)]';
            } else if (isGoodExpectation && odds > 0) {
              visualClass = 'bg-gradient-to-r from-yellow-100 via-white to-pink-100 border-yellow-300 shadow-[0_0_18px_rgba(255,235,130,0.35)]';
            }

            const cardClassName = `${baseCardClass} ${visualClass} ${cardExpanded ? 'ring-2 ring-purple-300 shadow-2xl' : 'hover:-translate-y-1'}`;

            return (
              <React.Fragment key={horse.horseNum}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setExpandedHorseNum(cardExpanded ? null : horse.horseNum)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setExpandedHorseNum(cardExpanded ? null : horse.horseNum);
                    }
                  }}
                  className={cardClassName}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 border-2 border-pink-200 shadow-inner">
                        <span className="text-xl font-black font-mono text-gray-800">{idx + 1}位</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {horseMarks[horse.horseNum] ? (
                            <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-xs font-bold border border-yellow-400">
                              {horseMarks[horse.horseNum]}
                            </span>
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200">
                              <HorsePixelArt size={16} />
                            </div>
                          )}
                          <p className="text-base md:text-xl font-bold text-gray-800 truncate">
                            {horse.horseNum}. {horse.name}
                          </p>
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingHorseMark(horse.horseNum);
                                setTempHorseMark(horseMarks[horse.horseNum] || '');
                              }}
                              className="ml-auto inline-flex items-center justify-center rounded-full bg-blue-400 px-3 py-1 text-xs font-bold text-white shadow hover:bg-blue-500 transition"
                            >
                              ✏️印
                            </button>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-pink-500">勝率</span>
                            <span className="font-mono text-sm text-gray-800">{horse.winRate.toFixed(1)}%</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="text-purple-500">オッズ</span>
                            <span className="font-mono text-sm">{odds > 0 ? odds.toFixed(1) : '—'}</span>
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="text-amber-500">期待値</span>
                            <span className="font-mono text-sm">{odds > 0 ? Math.round(value).toString() : '—'}</span>
                            {expectationRanking[horse.horseNum] && (
                              <span className="text-[11px] text-gray-500">
                                ({expectationRanking[horse.horseNum]}位)
                              </span>
                            )}
                          </span>
                          {isSuperExpectation && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700">
                              <StarPixelArt size={14} /> 超期待値馬
                            </span>
                          )}
                          {!isSuperExpectation && isGoodExpectation && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600">
                              <StarPixelArt size={14} /> 期待値馬
                            </span>
                          )}
                          {isCutoffFailed && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full border border-red-300">
                              ⚠️ 基準未達
                            </span>
                          )}
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-white/60 border border-purple-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-purple-600"
                            style={{ width: `${Math.min(Math.max(horse.winRate, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-2 text-xs font-bold text-gray-600">
                      <div className="inline-flex items-center gap-1 bg-white/70 px-3 py-1.5 rounded-full border border-purple-100 text-purple-600">
                        この馬の詳細はタップで表示
                      </div>
                      {failedFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1 max-w-[240px] md:justify-end">
                          {failedFactors.map((factorKey, fIdx) => {
                            const deviation = allFactorDeviations[factorKey]?.[horse.horseNum];
                            return (
                              <span
                                key={fIdx}
                                className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[11px] border border-orange-300"
                              >
                                {factorKey}
                                {deviation !== null && deviation !== undefined && !Number.isNaN(deviation) && (
                                  <span className="ml-1 font-mono">{deviation.toFixed(1)}</span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {cardExpanded && (
                    <div className="mt-4 rounded-2xl bg-white/80 backdrop-blur px-4 py-4 border border-purple-100 shadow-inner">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 px-4 py-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">合計偏差値</p>
                          <p className="mt-2 text-lg font-black text-purple-600">
                            {totalDeviation !== null && totalDeviation !== undefined && !Number.isNaN(totalDeviation)
                              ? totalDeviation.toFixed(1)
                              : '—'}
                            {totalDeviationRanking[horse.horseNum] && (
                              <span className="ml-2 text-sm font-bold text-gray-500">
                                {totalDeviationRanking[horse.horseNum]}位
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 px-4 py-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">平均偏差値</p>
                          <p className="mt-2 text-lg font-black text-pink-600">
                            {averageDeviation !== null && averageDeviation !== undefined && !Number.isNaN(averageDeviation)
                              ? averageDeviation.toFixed(1)
                              : '—'}
                            {averageDeviationRanking[horse.horseNum] && (
                              <span className="ml-2 text-sm font-bold text-gray-500">
                                {averageDeviationRanking[horse.horseNum]}位
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 px-4 py-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">データ数</p>
                          <p className="mt-2 text-lg font-black text-blue-600">
                            {validFactorCounts[horse.horseNum] || 0}項目
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {factorKeys.map((factorKey) => {
                          const deviation = allFactorDeviations[factorKey]?.[horse.horseNum];
                          if (deviation === null || deviation === undefined || Number.isNaN(deviation)) {
                            return null;
                          }
                          const rank = factorRankings[factorKey]?.[horse.horseNum];
                          return (
                            <div
                              key={factorKey}
                              className="flex items-center justify-between rounded-xl border border-purple-100 bg-white px-3 py-2 shadow-sm"
                            >
                              <span className="text-[13px] font-bold text-gray-700">{factorKey}</span>
                              <span className="flex items-center gap-2">
                                <span className="font-mono text-sm text-purple-600">{deviation.toFixed(1)}</span>
                                {rank && <span className="text-[11px] text-gray-500">{rank}位</span>}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {winRateGaps.includes(idx) && (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-600 px-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
                    断層 ({(resultsWithRate[idx].winRate - resultsWithRate[idx + 1].winRate).toFixed(1)}%差)
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

            {Object.keys(excludedHorses).length > 0 && (
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t-2 border-gray-300">
                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 font-bold">🚫 除外対象：</p>
                <div className="space-y-2">
                  {currentRace.horses
                    .filter(horse => excludedHorses[horse.horseNum])
                    .sort((a, b) => a.horseNum - b.horseNum)
                    .map((horse) => (
                      <div
                        key={horse.horseNum}
                        className="p-2 md:p-3 bg-gray-400 rounded-2xl border-2 border-gray-500 opacity-50"
                      >
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="text-sm md:text-lg font-bold text-white">
                            {horse.horseNum}. {horse.name}
                          </div>
                          <div className="text-xs md:text-sm font-bold text-white">
                            【除外】
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {aiRecommendation && (
              <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t-2 border-blue-300">
                <div className="flex items-center gap-2 mb-2 md:mb-3">
                  <TrophyPixelArt size={20} />
                  <p className="text-xs md:text-sm text-blue-600 font-bold">AIおすすめ馬</p>
                </div>
                <div className="p-3 md:p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-400 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <div className="text-xl md:text-2xl font-black text-blue-700">
                        🎯
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm md:text-lg font-bold text-gray-800 truncate">
                          {aiRecommendation.horseNum}. {aiRecommendation.name}
                        </div>
                        <div className="text-xs text-gray-700 mt-1 font-bold">
                          勝率{aiRecommendation.winRate.toFixed(1)}% · 
                          期待値{(oddsInput[aiRecommendation.horseNum] * aiRecommendation.winRate).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 印編集モーダル */}
        {editingHorseMark && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <StarPixelArt size={24} />
                印を編集（{editingHorseMark}番）
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  印（例: ⭐, 🔥, ⚡など）
                </label>
                <input
                  type="text"
                  value={tempHorseMark}
                  onChange={(e) => setTempHorseMark(e.target.value)}
                  placeholder="印を入力（空欄で削除）"
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl text-sm focus:outline-none focus:border-purple-500 font-bold"
                  maxLength={10}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const newMarks = { ...horseMarks };
                    if (tempHorseMark.trim()) {
                      newMarks[editingHorseMark] = tempHorseMark.trim();
                    } else {
                      delete newMarks[editingHorseMark];
                    }
                    
                    // Firebaseに直接保存（部分更新を使用）
                    const raceRef = ref(database, `races/${currentRace.firebaseId}/horseMarks`);
                    set(raceRef, newMarks)
                      .then(() => {
                        // ローカルステートも更新
                        setHorseMarks(newMarks);
                        setCurrentRace({
                          ...currentRace,
                          horseMarks: newMarks
                        });
                        
                        setEditingHorseMark(null);
                        setTempHorseMark('');
                        
                        console.log('印を保存しました:', {
                          raceId: currentRace.firebaseId,
                          raceName: currentRace.name,
                          horseNum: editingHorseMark,
                          mark: tempHorseMark.trim(),
                          allMarks: newMarks
                        });
                      })
                      .catch((error) => {
                        console.error('印の保存に失敗:', error);
                        window.alert('印の保存に失敗しました');
                      });
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditingHorseMark(null);
                    setTempHorseMark('');
                  }}
                  className="px-6 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-3 md:p-6 shadow-lg border-2 border-blue-200">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <HeartPixelArt size={20} />
              <h2 className="text-base md:text-xl font-bold text-gray-700">メモ</h2>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowMemoModal(true)}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:shadow-2xl transition flex items-center gap-1"
              >
                <StarPixelArt size={14} />
                編集
              </button>
            )}
          </div>
          <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 min-h-24 md:min-h-32">
            {memo ? (
              <div 
                className="text-gray-700 font-bold whitespace-pre-wrap text-xs md:text-sm"
                dangerouslySetInnerHTML={{ __html: memo }}
              />
            ) : (
              <p className="text-gray-500 font-bold text-xs md:text-sm">（メモなし）</p>
            )}
          </div>
        </div>

        {/* コース選択モーダル */}
        {showCourseSelectModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <CrownPixelArt size={24} />
                コース設定を選択
              </h3>
              
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    setRaceSelectedCourse(null);
                    setShowCourseSelectModal(false);
                  }}
                  className={`w-full px-4 py-3 rounded-full text-left font-bold transition ${
                    raceSelectedCourse === null
                      ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  デフォルト設定
                </button>
                {Object.keys(courseSettings).map(name => (
                  <button
                    key={name}
                    onClick={() => {
                      setRaceSelectedCourse(name);
                      setShowCourseSelectModal(false);
                    }}
                    className={`w-full px-4 py-3 rounded-full text-left font-bold transition ${
                      raceSelectedCourse === name
                        ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowCourseSelectModal(false)}
                className="w-full px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* EXP設定モーダル */}
        {showExpModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <StarPixelArt size={24} />
                EXP係数を調整
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-4">
                  係数: {tempExpCoefficient.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={tempExpCoefficient}
                  onChange={(e) => setTempExpCoefficient(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-3 font-bold">
                  <span>均等</span>
                  <span>敏感</span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-purple-100 rounded-2xl text-sm text-purple-800 font-bold border-2 border-purple-300">
                <p>📍 低い値: 各馬の勝率がより均等</p>
                <p>📍 高い値: トップ馬との差が顕著</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={saveExpCoefficient}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowExpModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 除外設定モーダル */}
        {showExcludeModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <LockPixelArt size={24} />
                馬を除外（出走取り消しなど）
              </h3>
              
              <div className="space-y-3 mb-6">
                {currentRace.horses.sort((a, b) => a.horseNum - b.horseNum).map((horse) => (
                  <label key={horse.horseNum} className="flex items-center gap-3 p-3 hover:bg-pink-50 rounded-2xl cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={!!excludedHorses[horse.horseNum]}
                      onChange={() => toggleExcludeHorse(horse.horseNum)}
                      className="w-5 h-5 accent-red-500"
                    />
                    <span className="text-sm font-bold text-gray-700">
                      {horse.horseNum}. {horse.name}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={saveExcludeSettings}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowExcludeModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* メモ編集モーダル */}
        {showMemoModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <HeartPixelArt size={24} />
                メモを編集
              </h3>
              
              {/* 書式設定ツールバー */}
              <div className="flex gap-2 mb-3 p-3 bg-gray-100 rounded-2xl flex-wrap">
                <button
                  onClick={() => document.execCommand('bold')}
                  className="px-3 py-2 bg-white rounded-lg font-bold hover:bg-blue-100 transition border-2 border-gray-300"
                  title="太字"
                >
                  <span className="font-bold">B</span>
                </button>
                <button
                  onClick={() => document.execCommand('italic')}
                  className="px-3 py-2 bg-white rounded-lg italic hover:bg-blue-100 transition border-2 border-gray-300"
                  title="斜体"
                >
                  <span className="italic">I</span>
                </button>
                <button
                  onClick={() => document.execCommand('underline')}
                  className="px-3 py-2 bg-white rounded-lg underline hover:bg-blue-100 transition border-2 border-gray-300"
                  title="下線"
                >
                  <span className="underline">U</span>
                </button>
                <div className="h-8 w-px bg-gray-400 mx-2"></div>
                <button
                  onClick={() => document.execCommand('foreColor', false, '#ef4444')}
                  className="px-3 py-2 bg-white rounded-lg hover:bg-red-100 transition border-2 border-gray-300"
                  title="赤"
                >
                  <span className="text-red-500 font-bold">A</span>
                </button>
                <button
                  onClick={() => document.execCommand('foreColor', false, '#3b82f6')}
                  className="px-3 py-2 bg-white rounded-lg hover:bg-blue-100 transition border-2 border-gray-300"
                  title="青"
                >
                  <span className="text-blue-500 font-bold">A</span>
                </button>
                <button
                  onClick={() => document.execCommand('foreColor', false, '#22c55e')}
                  className="px-3 py-2 bg-white rounded-lg hover:bg-green-100 transition border-2 border-gray-300"
                  title="緑"
                >
                  <span className="text-green-500 font-bold">A</span>
                </button>
                <button
                  onClick={() => document.execCommand('foreColor', false, '#a855f7')}
                  className="px-3 py-2 bg-white rounded-lg hover:bg-purple-100 transition border-2 border-gray-300"
                  title="紫"
                >
                  <span className="text-purple-500 font-bold">A</span>
                </button>
                <button
                  onClick={() => document.execCommand('foreColor', false, '#000000')}
                  className="px-3 py-2 bg-white rounded-lg hover:bg-gray-200 transition border-2 border-gray-300"
                  title="黒"
                >
                  <span className="text-black font-bold">A</span>
                </button>
                <div className="h-8 w-px bg-gray-400 mx-2"></div>
                <button
                  onClick={() => document.execCommand('removeFormat')}
                  className="px-3 py-2 bg-white rounded-lg hover:bg-gray-200 transition border-2 border-gray-300 text-sm"
                  title="書式をクリア"
                >
                  🧹
                </button>
              </div>

              <div
                ref={(el) => {
                  if (el && !el.innerHTML && memo) {
                    el.innerHTML = memo.replace(/\n/g, '<br>');
                  }
                }}
                contentEditable
                onInput={(e) => setMemo(e.currentTarget.innerHTML)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    document.execCommand('insertHTML', false, '<br><br>');
                  }
                }}
                className="w-full min-h-48 p-4 border-2 border-blue-300 rounded-2xl text-sm mb-6 focus:outline-none focus:border-blue-500 bg-white overflow-y-auto max-h-96"
                style={{ whiteSpace: 'pre-wrap' }}
                suppressContentEditableWarning
              >
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl text-xs text-blue-800 font-bold mb-6 border-2 border-blue-200">
                💡 ヒント: テキストを選択してから書式ボタンを押すと、選択部分に書式が適用されます
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    updateRaceMemo(memo);
                    setShowMemoModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowMemoModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* オッズ入力モーダル */}
        {showOddsModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <StarPixelArt size={24} />
                オッズを入力
              </h3>

              {/* 入力モード切り替えタブ */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setOddsInputMode('manual')}
                  className={`flex-1 px-4 py-2 rounded-full font-bold transition ${
                    oddsInputMode === 'manual'
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  手入力
                </button>
                <button
                  onClick={() => setOddsInputMode('paste')}
                  className={`flex-1 px-4 py-2 rounded-full font-bold transition ${
                    oddsInputMode === 'paste'
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  📋 貼り付け
                </button>
              </div>

              {oddsInputMode === 'paste' ? (
                <div className="mb-6">
                  <div className="p-3 bg-green-50 rounded-2xl border-2 border-green-200 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">✨</span>
                      <span className="text-sm font-bold text-green-800">自動クリーニング機能</span>
                    </div>
                    <p className="text-xs text-green-700">
                      貼り付けたデータから、馬メモや編集ボタンなどの不要なテキストを自動的に除外します。
                      出馬表をそのままコピーして貼り付けてOKです！
                    </p>
                  </div>

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    オッズデータを貼り付け
                  </label>
                  <textarea
                    value={oddsPasteText}
                    onChange={(e) => setOddsPasteText(e.target.value)}
                    className="w-full h-64 p-4 border-2 border-orange-300 rounded-2xl font-mono text-xs focus:outline-none focus:border-orange-500"
                    placeholder="netkeiba.comなどからコピーしたデータを貼り付けてください"
                  />

                  <div className="mt-4 p-3 bg-blue-50 rounded-2xl border-2 border-blue-200">
                    <p className="text-xs text-blue-800 font-bold mb-2">
                      💡 対応形式：
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 list-disc pl-5">
                      <li>中央競馬：netkeiba形式（後ろから2列目がオッズ）</li>
                      <li>地方競馬：オッズのみの列</li>
                    </ul>
                  </div>

                  <button
                    onClick={parseAndSetOdds}
                    className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                  >
                    オッズを反映
                  </button>

                  {oddsPasteText && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => {
                          const rawLines = oddsPasteText.trim().split(/\r?\n/);

                          const cleaned = rawLines.filter((line) => {
                            const trimmed = line.trim();
                            if (!trimmed || trimmed === '--' || trimmed === '---') return false;
                            if (oddsExcludeKeywords.some((k) => trimmed.includes(k))) return false;
                            return true;
                          });

                          if (console.clear) {
                            console.clear();
                          }
                          console.log('=== データクリーニング ===');
                          console.log('元の行数:', rawLines.length);
                          console.log('クリーニング後:', cleaned.length);
                          console.log('\nクリーニング後のデータ:');
                          cleaned.forEach((line, i) => {
                            console.log(`${i + 1}: ${line}`);
                          });

                          window.alert(
                            `データをクリーニングしました\n\n` +
                              `元の行数: ${rawLines.length}行\n` +
                              `処理後: ${cleaned.length}行\n\n` +
                              `詳細はコンソール（F12）で確認できます`
                          );
                        }}
                        className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-bold text-sm hover:bg-purple-200 transition"
                      >
                        🧹 データをクリーニング（プレビュー）
                      </button>

                      <details className="text-xs">
                        <summary className="cursor-pointer font-bold text-gray-700 hover:text-gray-900">
                          除外される文字列を確認
                        </summary>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-gray-600">
                          馬メモ、レース別馬メモ、全角、文字以内、削除、保存、閉じる、
                          次走買い、次走消し、不利、馬場向かず、ペース合わず、
                          ハイレベル戦、好ラップ、編集、/100、/500 など
                        </div>
                      </details>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    <details>
                      <summary className="text-xs font-bold text-gray-700 cursor-pointer">
                        デバッグ情報を表示
                      </summary>
                      <pre className="text-xs text-gray-600 mt-2 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(oddsInput, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
                  {(currentRace?.horses || [])
                    .slice()
                    .sort((a, b) => a.horseNum - b.horseNum)
                    .map((horse) => (
                      <div key={horse.horseNum} className="flex items-center gap-3">
                        <label className="text-xs font-bold text-gray-700 w-32 truncate">
                          {horse.horseNum}. {horse.name}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={oddsInput[horse.horseNum] ?? ''}
                          onChange={(e) =>
                            setOddsInput({
                              ...oddsInput,
                              [horse.horseNum]: parseFloat(e.target.value) || 0
                            })
                          }
                          className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                          placeholder="オッズ"
                        />
                      </div>
                    ))}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    updateRaceOdds(oddsInput);
                    setShowOddsModal(false);
                    setOddsInputMode('manual');
                    setOddsPasteText('');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setShowOddsModal(false);
                    setOddsInputMode('manual');
                    setOddsPasteText('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 結果記録モーダル */}
        {showResultModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <MedalPixelArt size={28} />
                着順を記録
              </h3>
              
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 mb-3 block">着順を馬番で入力</label>
                <p className="text-xs text-gray-600 mb-4 font-bold">例：8-15-5</p>
                <input
                  type="text"
                  value={resultRanking}
                  onChange={(e) => setResultRanking(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-2xl text-sm focus:outline-none focus:border-green-500 font-bold"
                  placeholder="8-15-5"
                  autoFocus
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveResult}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setShowResultModal(false);
                    setResultRanking('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 買い目生成モーダル */}
        {showBettingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
                <TrophyPixelArt size={24} />
                買い目自動生成
              </h3>
              
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">予算を入力（100円単位）</label>
                <input
                  type="number"
                  step="100"
                  min="100"
                  value={bettingBudget}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setBettingBudget(Math.round(value / 100) * 100);
                  }}
                  className="w-full px-4 py-3 border-2 border-cyan-300 rounded-2xl text-sm focus:outline-none focus:border-cyan-500 font-bold"
                  placeholder="1000"
                />
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">購入タイプ</label>
                <div className="space-y-3">
                  <button
                    onClick={() => setBettingType('accuracy')}
                    className={`w-full px-4 py-3 rounded-2xl text-left font-bold transition text-sm ${
                      bettingType === 'accuracy'
                        ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MedalPixelArt size={18} />
                      <div>
                        <div>🎯 的中率特化型</div>
                        <p className="text-xs mt-1 opacity-80">勝率1位馬から買い目を生成</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setBettingType('value')}
                    className={`w-full px-4 py-3 rounded-2xl text-left font-bold transition text-sm ${
                      bettingType === 'value'
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <StarPixelArt size={18} />
                      <div>
                        <div>💎 回収率特化型</div>
                        <p className="text-xs mt-1 opacity-80">期待値馬から買い目を生成</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {generatedBets.length === 0 ? (
                <button
                  onClick={generateBettingRecommendations}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition mb-4 flex items-center justify-center gap-2"
                >
                  <TrophyPixelArt size={20} />
                  買い目を生成
                </button>
              ) : (
                <div className="mb-6">
                  <h4 className="text-base md:text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <StarPixelArt size={18} />
                    推奨買い目
                  </h4>
                  <div className="space-y-4">
                    {generatedBets.map((bet, idx) => (
                      <div key={idx}>
                        {/* 最適化された買い目の場合 */}
                        {bet.isOptimized ? (
                          <>
                            {/* 選択されたプラン */}
                            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-300">
                              {bet.warning && (
                                <div className="mb-3 p-2 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                                  <p className="text-xs text-yellow-800 font-bold">{bet.warning}</p>
                                </div>
                              )}
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className="text-lg font-bold text-cyan-700">
                                    {bet.type}
                                  </span>
                                  {bet.multiplier > 1 && (
                                    <span className="ml-2 text-sm text-gray-600">
                                      × {bet.multiplier}セット
                                    </span>
                                  )}
                                </div>
                                <span className="text-xl font-black text-cyan-600">
                                  {bet.finalCost.toLocaleString()}円
                                </span>
                              </div>
                              
                              <div className="text-sm text-gray-700 font-bold mb-2">
                                {bet.horses.map((horse, hIdx) => (
                                  <div key={hIdx}>{horse}</div>
                                ))}
                              </div>
                              
                              <div className="text-xs text-gray-600 font-bold">
                                {bet.reason}
                              </div>
                            </div>
                            
                            {/* 予算使用状況 */}
                            <div className="mt-3 p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">予算使用率</span>
                                <span className="text-lg font-bold text-purple-600">
                                  {bet.usageRate}%
                                </span>
                              </div>
                              
                              {/* プログレスバー */}
                              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                                  style={{ width: `${Math.min(parseFloat(bet.usageRate), 100)}%` }}
                                />
                              </div>
                              
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                <div className="text-gray-600">
                                  <span className="font-bold">使用:</span> {bet.finalCost.toLocaleString()}円
                                </div>
                                <div className="text-gray-600">
                                  <span className="font-bold">残り:</span> {bet.unusedBudget.toLocaleString()}円
                                </div>
                              </div>
                            </div>
                            
                            {/* 上位プランへの案内（不足額がある場合） */}
                            {bet.shortage > 0 && (
                              <div className="mt-3 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-300">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-lg">💡</span>
                                  <span className="text-sm font-bold text-yellow-800">
                                    より良い買い目のご提案
                                  </span>
                                </div>
                                <p className="text-xs text-yellow-800 font-bold">
                                  あと<span className="text-lg font-black">{bet.shortage.toLocaleString()}円</span>追加すると、
                                  上位プランの買い目を購入できます！
                                </p>
                              </div>
                            )}
                            
                            {/* 内訳詳細 */}
                            <div className="mt-3 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
                              <h5 className="text-sm font-bold text-gray-700 mb-2">購入内訳</h5>
                              <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex justify-between">
                                  <span>1セットあたり:</span>
                                  <span className="font-bold">{bet.unitCost.toLocaleString()}円</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>購入セット数:</span>
                                  <span className="font-bold">{bet.multiplier}セット</span>
                                </div>
                                {bet.points > 0 && (
                                  <>
                                    <div className="flex justify-between">
                                      <span>点数:</span>
                                      <span className="font-bold">{bet.points}点</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>1点あたり:</span>
                                      <span className="font-bold">
                                        {bet.points * bet.multiplier > 0 
                                          ? Math.floor(bet.finalCost / (bet.points * bet.multiplier))
                                          : 0}円
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* 通常の買い目表示 */
                          <div className="p-3 md:p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-300">
                            {bet.warning && (
                              <div className="mb-3 p-2 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                                <p className="text-xs text-yellow-800 font-bold">{bet.warning}</p>
                              </div>
                            )}
                        <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-cyan-700 text-sm md:text-base">{bet.type}</span>
                          {bet.amount > 0 && (
                                <div className="text-right">
                                  <div className="font-bold text-gray-700 text-sm md:text-base">{bet.amount.toLocaleString()}円</div>
                                  {bet.points > 0 && (
                                    <div className="text-xs text-gray-600 font-bold">{bet.points}点</div>
                                  )}
                                </div>
                          )}
                        </div>
                        {bet.horses.length > 0 && (
                              <div className="text-xs md:text-sm text-gray-700 font-bold mb-2 space-y-1">
                                {bet.horses.map((horse, hIdx) => (
                                  <div key={hIdx}>{horse}</div>
                                ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-600 font-bold">
                          {bet.reason}
                        </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-cyan-100 rounded-2xl text-sm text-cyan-800 font-bold flex items-center gap-2">
                    <TrophyPixelArt size={18} />
                    合計: {generatedBets.reduce((sum, bet) => sum + (bet.finalCost || bet.amount || 0), 0).toLocaleString()}円
                    {generatedBets.reduce((sum, bet) => sum + ((bet.points || 0) * (bet.multiplier || 1)), 0) > 0 && (
                      <span className="ml-2">({generatedBets.reduce((sum, bet) => sum + ((bet.points || 0) * (bet.multiplier || 1)), 0)}点)</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {generatedBets.length > 0 && (
                  <button
                    onClick={() => {
                      setGeneratedBets([]);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-full font-bold hover:bg-gray-400 transition"
                  >
                    再生成
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowBettingModal(false);
                    setGeneratedBets([]);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🎲 仮想レースモーダル */}
        {showVirtualRaceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
                <DicePixelArt size={24} />
                仮想レース着順シミュレーション
              </h3>
              
              {!virtualRaceResults ? (
                <>
                  <div className="mb-6 p-4 bg-purple-50 rounded-2xl">
                    <p className="text-sm text-gray-700 font-bold mb-2">
                      このレースの期待勝率に基づいて、仮想レースを{simulationCount}回実行し、
                      各馬が1着、2着、3着、4着以下になる回数を集計します。
                    </p>
                    <p className="text-xs text-gray-600 font-bold">
                      ※ 4着以下は着外として一括扱いされます
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      シミュレーション回数
                    </label>
                    <input
                      type="number"
                      value={simulationCount}
                      onChange={(e) => setSimulationCount(Math.max(10, Math.min(10000, parseInt(e.target.value) || 1000)))}
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl text-sm focus:outline-none focus:border-purple-500 font-bold"
                      min="10"
                      max="10000"
                      step="100"
                    />
                    <p className="text-xs text-gray-600 mt-2 font-bold">
                      推奨: 1000回以上（精度が向上します）
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={runVirtualRaceSimulation}
                      disabled={isSimulating}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSimulating ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          実行中...
                        </>
                      ) : (
                        <>
                          <DicePixelArt size={20} />
                          シミュレーション開始
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowVirtualRaceModal(false);
                        setVirtualRaceResults(null);
                      }}
                      className="px-6 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                    >
                      閉じる
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-300">
                    <h4 className="font-bold text-gray-800 mb-2">
                      {virtualRaceResults.raceName}
                    </h4>
                    <p className="text-sm text-gray-600 font-bold">
                      シミュレーション回数: {virtualRaceResults.simulationCount}回
                    </p>
                  </div>

                  {/* Track Diagram表示切り替え */}
                  <div className="mb-4 flex gap-2 items-center justify-center">
                    <button
                      onClick={() => setShowTrackDiagram(false)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                        !showTrackDiagram
                          ? 'bg-purple-400 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      結果一覧
                    </button>
                    <button
                      onClick={() => setShowTrackDiagram(true)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                        showTrackDiagram
                          ? 'bg-purple-400 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Track Diagram
                    </button>
                  </div>

                  {showTrackDiagram ? (
                    (() => {
                      // 展開利ファクターで1位の馬を特定
                      const topTenkiHorse = currentRace.horses
                        .filter(h => !excludedHorses[h.horseNum] && h.scores && h.scores['展開利'] !== undefined)
                        .reduce((top, horse) => {
                          const score = horse.scores['展開利'] || 0;
                          return score > (top.scores['展開利'] || 0) ? horse : top;
                        }, currentRace.horses[0]);

                      // 勝率ランキング（現在の予想スコア）から到達順位を作成
                      const ranked = resultsWithRate
                        .filter(h => !excludedHorses[h.horseNum])
                        .sort((a, b) => b.winRate - a.winRate);

                      if (ranked.length === 0) return null;

                      const topRate = ranked[0].winRate || 0;
                      const inContention = ranked.filter(h => (topRate - h.winRate) < 20);
                      const notInContention = ranked
                        .filter(h => (topRate - h.winRate) >= 20)
                        .map(h => h.horseNum)
                        .sort((a, b) => a - b);

                      // 距離スケールを勝率差に基づき作成（右端がゴール）
                      const diffs = inContention.map((h, i) => i === 0 ? 0 : (inContention[i - 1].winRate - h.winRate));
                      const cumulatives = diffs.reduce((arr, d) => {
                        const prev = arr.length > 0 ? arr[arr.length - 1] : 0;
                        arr.push(prev + Math.max(0, d));
                        return arr;
                      }, []);
                      const totalSpan = cumulatives.length > 0 ? (cumulatives[cumulatives.length - 1] || 1) : 1;

                      const horsesWithPositions = inContention.map((h, idx) => {
                        const horse = currentRace.horses.find(x => x.horseNum === h.horseNum);
                        const isTopTenki = topTenkiHorse && horse && horse.horseNum === topTenkiHorse.horseNum;
                        // 右側がゴール。上位ほど右に配置。
                        const leftPct = 95 - (totalSpan === 0 ? 0 : (cumulatives[idx] / totalSpan) * 85);
                        return {
                          horseNum: h.horseNum,
                          leftPct,
                          isTopTenki,
                          index: idx
                        };
                      });

                      // レーンを3つに分割（視認性向上）
                      const lanes = [[], [], []];
                      horsesWithPositions.forEach((horse, idx) => {
                        lanes[idx % 3].push(horse);
                      });

                      // 馬の色を決定
                      const getHorseColor = (horseNum) => {
                        const colors = [
                          'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
                          'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
                          'bg-indigo-500', 'bg-cyan-500', 'bg-gray-500', 'bg-lime-500',
                          'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-emerald-500'
                        ];
                        return colors[(horseNum - 1) % colors.length];
                      };

                      return (
                        <div className="mb-6 relative" style={{ minHeight: '240px' }}>
                          {/* 背景（トラック） */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl opacity-20"></div>
                          
                          {/* レーン線 */}
                          <div className="absolute inset-0 flex flex-col">
                            {[0, 1, 2].map(lane => (
                              <div key={lane} className="flex-1 border-t border-white opacity-30"></div>
                            ))}
                          </div>

                          {/* ゴールライン */}
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white flex items-center justify-center">
                            <div className="transform -rotate-90 text-white font-bold text-xs whitespace-nowrap">
                              Finish
                            </div>
                          </div>

                          {/* 馬を配置（横方向に進行、右端がFinish） */}
                          {lanes.map((lane, laneIdx) => (
                            <div key={laneIdx} className="absolute inset-0">
                              {lane.map((horse) => (
                                <div
                                  key={horse.horseNum}
                                  className="absolute flex items-center gap-2"
                                  style={{
                                    left: `${horse.leftPct}%`,
                                    top: `${25 + laneIdx * 25}%`,
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10 - horse.index
                                  }}
                                >
                                  {/* 速度線 */}
                                  <div className="absolute right-full mr-2 flex gap-1">
                                    {[0, 1, 2, 3].map(i => (
                                      <div key={i} className="w-1 h-4 bg-white opacity-60"></div>
                                    ))}
                                  </div>
                                  {/* 馬のボックス */}
                                  <div
                                    className={`relative ${getHorseColor(horse.horseNum)} rounded-lg px-2 py-1 shadow-lg border-2 border-white ${
                                      horse.isTopTenki ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''
                                    }`}
                                    style={{
                                      minWidth: '50px'
                                    }}
                                  >
                                    <div className="text-white font-bold text-sm leading-none text-center">
                                      {horse.horseNum}
                                    </div>
                                    {horse.isTopTenki && (
                                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-yellow-300 text-lg animate-pulse z-10 pointer-events-none">
                                        ★
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}

                          {/* 凡例 */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 rounded-b-2xl z-20 pointer-events-none">
                            <div className="text-white text-xs font-bold mb-2">
                              {topTenkiHorse && `★ = 最も展開利のある馬`}
                            </div>
                            <div className="text-white text-xs">
                              Not in contention at finish: {notInContention.length > 0 ? notInContention.join(', ') : 'なし'}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="space-y-3 mb-6">
                    {virtualRaceResults.results.map(([horseName, counts], index) => {
                      const first = counts['1着'];
                      const second = counts['2着'];
                      const third = counts['3着'];
                      const fourth = counts['4着以下'];
                      const total = virtualRaceResults.simulationCount;
                      
                      const firstPct = ((first / total) * 100).toFixed(1);
                      const secondPct = ((second / total) * 100).toFixed(1);
                      const thirdPct = ((third / total) * 100).toFixed(1);
                      const fourthPct = ((fourth / total) * 100).toFixed(1);
                      
                      const topThreePct = (((first + second + third) / total) * 100).toFixed(1);
                      
                      const rankColors = [
                        'from-yellow-100 to-yellow-200 border-yellow-400',
                        'from-gray-100 to-gray-200 border-gray-400',
                        'from-orange-100 to-orange-200 border-orange-400'
                      ];
                      const borderClass = index < 3 ? rankColors[index] : 'from-blue-50 to-blue-100 border-blue-300';

                      return (
                        <div key={index} className={`p-3 md:p-4 bg-gradient-to-r ${borderClass} rounded-2xl border-2`}>
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base md:text-lg font-bold text-purple-600">
                                {index + 1}位
                              </span>
                              <span className="font-bold text-gray-800 text-sm md:text-base truncate">
                                {horseName}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 font-bold">
                              期待勝率: {counts['期待勝率'].toFixed(2)}% / 
                              複勝率: {topThreePct}%
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            <div className="text-center p-2 bg-white rounded-lg">
                              <div className="text-xs text-gray-600 font-bold">1着</div>
                              <div className="text-base md:text-lg font-bold text-yellow-600">{first}回</div>
                              <div className="text-xs text-gray-600 font-bold">{firstPct}%</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                              <div className="text-xs text-gray-600 font-bold">2着</div>
                              <div className="text-base md:text-lg font-bold text-gray-600">{second}回</div>
                              <div className="text-xs text-gray-600 font-bold">{secondPct}%</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                              <div className="text-xs text-gray-600 font-bold">3着</div>
                              <div className="text-base md:text-lg font-bold text-orange-600">{third}回</div>
                              <div className="text-xs text-gray-600 font-bold">{thirdPct}%</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded-lg">
                              <div className="text-xs text-gray-600 font-bold">着外</div>
                              <div className="text-base md:text-lg font-bold text-blue-600">{fourth}回</div>
                              <div className="text-xs text-gray-600 font-bold">{fourthPct}%</div>
                            </div>
                          </div>
                          
                          {/* プログレスバー */}
                          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full flex">
                              <div 
                                className="bg-yellow-500" 
                                style={{ width: `${firstPct}%` }}
                              />
                              <div 
                                className="bg-gray-400" 
                                style={{ width: `${secondPct}%` }}
                              />
                              <div 
                                className="bg-orange-500" 
                                style={{ width: `${thirdPct}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setVirtualRaceResults(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition flex items-center justify-center gap-2"
                    >
                      <DicePixelArt size={20} />
                      再シミュレーション
                    </button>
                    <button
                      onClick={() => {
                        setShowVirtualRaceModal(false);
                        setVirtualRaceResults(null);
                      }}
                      className="px-6 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
                    >
                      閉じる
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
);
};

export default HorseAnalysisApp;













