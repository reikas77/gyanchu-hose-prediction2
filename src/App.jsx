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

// ═══════════════════════════════════════════
// 🐎 競馬場コード定義（netkeiba用）
// ═══════════════════════════════════════════

const VENUE_CODES = {
  // 中央競馬
  '札幌': '01',
  '函館': '02',
  '福島': '03',
  '新潟': '04',
  '東京': '05',
  '中山': '06',
  '中京': '07',
  '京都': '08',
  '阪神': '09',
  '小倉': '10',
  
  // 地方競馬
  '門別': '30',
  '盛岡': '35',
  '水沢': '36',
  '浦和': '42',
  '船橋': '43',
  '大井': '44',
  '川崎': '45',
  '金沢': '46',
  '笠松': '47',
  '名古屋': '48',
  '園田': '50',
  '姫路': '51',
  '高知': '54',
  '佐賀': '55'
};

// 中央競馬の競馬場リスト
const CENTRAL_VENUES = ['札幌', '函館', '福島', '新潟', '東京', '中山', '中京', '京都', '阪神', '小倉'];

// 地方競馬の競馬場リスト
const LOCAL_VENUES = ['門別', '盛岡', '水沢', '浦和', '船橋', '大井', '川崎', '金沢', '笠松', '名古屋', '園田', '姫路', '高知', '佐賀'];

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

  // 新機能用のstate
  const [raceConfidence, setRaceConfidence] = useState(3);
  const [raceStartTime, setRaceStartTime] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [editingRaceId, setEditingRaceId] = useState(null);
  const [newRaceName, setNewRaceName] = useState('');
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [editingCourseKey, setEditingCourseKey] = useState(null);

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

  // ソート・フィルター用のstate
  const [upcomingSortBy, setUpcomingSortBy] = useState('startTime'); // 'startTime' or 'createdAt'
  const [pastSortBy, setPastSortBy] = useState('newest'); // 'newest' or 'oldest'
  const [pastFilterCourse, setPastFilterCourse] = useState(null); // コースフィルター

  // 勝率ランキングの印機能用のstate
  const [horseMarks, setHorseMarks] = useState({}); // { horseNum: mark } の形式
  const [editingHorseMark, setEditingHorseMark] = useState(null);
  const [tempHorseMark, setTempHorseMark] = useState('');

  // 仮想レース視覚化用のstate
  const [showTrackDiagram, setShowTrackDiagram] = useState(false);

  // 🌐 netkeibaオッズ自動取得用のstate
  const [showNetkeibaModal, setShowNetkeibaModal] = useState(false);
  const [netkeibaConfig, setNetkeibaConfig] = useState({
    raceType: 'central', // 'central' or 'local'
    venue: '東京',
    venueCode: '05',
    raceNumber: 1,
    raceDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    enabled: false
  });
  const [isFetchingOdds, setIsFetchingOdds] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [nextFetchAt, setNextFetchAt] = useState(null);
  const [fetchStatus, setFetchStatus] = useState('待機中'); // '待機中', '取得中', 'エラー'
  const [fetchError, setFetchError] = useState(null);
  const [autoUpdateTimer, setAutoUpdateTimer] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info'); // 'info', 'success', 'error', 'warning'

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
    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      excluded: excludedHorses
    });
    setCurrentRace({
      ...currentRace,
      excluded: excludedHorses
    });
    setShowExcludeModal(false);
  };

  const saveExpCoefficient = () => {
    setExpCoefficient(tempExpCoefficient);
    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      expCoefficient: tempExpCoefficient
    });
    setCurrentRace({
      ...currentRace,
      expCoefficient: tempExpCoefficient
    });
    setShowExpModal(false);
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
      setHorseMarks(race.horseMarks || {});
      
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

  const calculateAIRecommendation = (horses) => {
    const candidates = horses.filter(horse => {
      const odds = oddsInput[horse.horseNum] || 0;
      const value = odds * horse.winRate;
      return value >= 100 && horse.winRate >= 10;
    });
    
    if (candidates.length === 0) return null;
    
    return candidates.sort((a, b) => b.winRate - a.winRate)[0];
  };

  // 買い目自動生成
  const generateBettingRecommendations = () => {
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
    
    if (recordedRaces.length === 0) return null;

    let tanshoHits = 0;
    let fukushoHits = 0;

    recordedRaces.forEach(race => {
      const raceWinRates = calculateWinRate(race.horses, race.courseKey);
      
      let targetHorse = null;
      
      if (statsType === 'winrate') {
        targetHorse = raceWinRates[0];
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
      } else if (statsType === 'ai') {
        const candidates = raceWinRates
          .filter(horse => {
            const odds = race.odds[horse.horseNum] || 0;
            const value = odds * horse.winRate;
            return value >= 100 && horse.winRate >= 10;
          })
          .sort((a, b) => b.winRate - a.winRate);
        
        targetHorse = candidates[0] || null;
      }
      
      if (!targetHorse) return;
      
      const ranking = race.result.ranking.split(/[\s\-,]/);
      const resultNums = ranking.map(r => {
        const num = parseInt(r);
        return isNaN(num) ? null : num;
      }).filter(n => n !== null);
      
      if (resultNums[0] === targetHorse.horseNum) {
        tanshoHits++;
      }
      
      if (resultNums.slice(0, 3).includes(targetHorse.horseNum)) {
        fukushoHits++;
      }
    });

    return {
      total: recordedRaces.length,
      tansho: { hits: tanshoHits, rate: ((tanshoHits / recordedRaces.length) * 100).toFixed(1) },
      fukusho: { hits: fukushoHits, rate: ((fukushoHits / recordedRaces.length) * 100).toFixed(1) }
    };
  };

  // ✨ ファクター毎の的中率分析関数
  const calculateFactorStats = (courseKey = null) => {
    let recordedRaces = races.filter(r => r.result && r.odds && Object.keys(r.odds).length > 0);
    
    if (courseKey && courseKey !== 'all') {
      recordedRaces = recordedRaces.filter(r => r.courseKey === courseKey);
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

    recordedRaces.forEach(race => {
      const ranking = race.result.ranking.split(/[\s\-,]/);
      const resultNums = ranking.map(r => {
        const num = parseInt(r);
        return isNaN(num) ? null : num;
      }).filter(n => n !== null);

      if (resultNums.length === 0) return;

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

    const result = {};
    Object.entries(factorStats).forEach(([factor, stats]) => {
      result[factor] = {
        ...stats,
        tanshoRate: stats.total > 0 ? ((stats.tansho / stats.total) * 100).toFixed(1) : '0.0',
        fukushoRate: stats.total > 0 ? ((stats.fukusho / stats.total) * 100).toFixed(1) : '0.0'
      };
    });

    return { results: result, recordedRacesCount: recordedRaces.length };
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
    const analysisResults = calculateFactorStats(selectedAnalysisCourse);
    setFactorAnalysisResults(analysisResults);
  };

  const handleFactorToggle = (factorKey) => {
    setSelectedFactors({
      ...selectedFactors,
      [factorKey]: !selectedFactors[factorKey]
    });
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

    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      result: {
        ranking: resultRanking,
        tansho: tanshoDic,
        fukusho: fukushoHit
      }
    });

    setCurrentRace({
      ...currentRace,
      result: {
        ranking: resultRanking,
        tansho: tanshoDic,
        fukusho: fukushoHit
      }
    });
    setResultRanking('');
    setShowResultModal(false);
  };

  const updateRaceOdds = (odds) => {
    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      odds
    });
    setCurrentRace({ ...currentRace, odds });
  };

  // 🌐 Toast通知を表示
  const showToast = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // 🌐 netkeibaからオッズを取得
  const fetchNetkeibaOdds = async (raceType, venue, raceDate, raceNumber) => {
    const venueCode = VENUE_CODES[venue];
    if (!venueCode) {
      throw new Error('競馬場コードが見つかりません');
    }

    // レースIDを生成: YYYYMMDDCC0R
    const dateStr = raceDate.replace(/-/g, ''); // YYYYMMDD
    const raceId = `${dateStr}${venueCode}0${raceNumber}`;

    // URL構築
    const baseUrl = raceType === 'central' 
      ? 'https://race.netkeiba.com' 
      : 'https://nar.netkeiba.com';
    const targetUrl = `${baseUrl}/odds/${raceId}.html`;

    // CORSプロキシ経由でアクセス
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    try {
      setIsFetchingOdds(true);
      setFetchStatus('取得中');
      showToast('オッズを取得中...', 'info');

      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const html = await response.text();

      // HTMLからオッズを抽出
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const oddsMapping = {};

      // netkeibaのHTML構造に応じてオッズを抽出
      // 単勝オッズのセレクターを複数試行
      let oddsElements = doc.querySelectorAll('.Odds_Odds, .odds, .Odds_OddsTansho, [class*="Odds"], [class*="odds"]');
      
      // もし見つからない場合、テーブルから抽出を試みる
      if (oddsElements.length === 0) {
        const tableRows = doc.querySelectorAll('table tr, .RaceList tr');
        tableRows.forEach((row, index) => {
          const horseNum = index + 1;
          // オッズを含む可能性のあるセルを探す
          const cells = row.querySelectorAll('td, th');
          cells.forEach(cell => {
            const text = cell.textContent.trim();
            // オッズ形式（数値.数値）を探す
            const oddsMatch = text.match(/(\d+\.?\d*)/);
            if (oddsMatch && parseFloat(oddsMatch[1]) > 0 && parseFloat(oddsMatch[1]) < 1000) {
              const odds = parseFloat(oddsMatch[1]);
              if (!oddsMapping[horseNum]) {
                oddsMapping[horseNum] = odds;
              }
            }
          });
        });
      } else {
        oddsElements.forEach((element, index) => {
          const horseNumber = index + 1;
          const oddsText = element.textContent.trim();
          const odds = parseFloat(oddsText.replace(/[^\d.]/g, ''));
          
          if (!isNaN(odds) && odds > 0) {
            oddsMapping[horseNumber] = odds;
          }
        });
      }

      if (Object.keys(oddsMapping).length === 0) {
        throw new Error('オッズが取得できませんでした。ページ構造が異なる可能性があります。');
      }

      setIsFetchingOdds(false);
      setFetchStatus('待機中');
      setLastFetchedAt(new Date());
      showToast(`オッズを取得しました (${Object.keys(oddsMapping).length}頭)`, 'success');

      return oddsMapping;

    } catch (error) {
      console.error('netkeiba取得エラー:', error);
      setIsFetchingOdds(false);
      setFetchStatus('エラー');
      setFetchError(error.message);
      
      let errorMessage = 'オッズの取得に失敗しました';
      if (error.message.includes('HTTP')) {
        errorMessage = '接続エラー。3秒後に再試行';
      } else if (error.message.includes('コード')) {
        errorMessage = 'レースIDが正しいか確認してください';
      } else if (error.message.includes('構造')) {
        errorMessage = 'オッズが公開されていない可能性があります';
      }
      
      showToast(errorMessage, 'error');
      throw error;
    }
  };

  // 🌐 手動でオッズを取得
  const handleFetchOdds = async () => {
    if (!currentRace || !currentRace.firebaseId) {
      showToast('レースが選択されていません', 'error');
      return;
    }

    try {
      const odds = await fetchNetkeibaOdds(
        netkeibaConfig.raceType,
        netkeibaConfig.venue,
        netkeibaConfig.raceDate,
        netkeibaConfig.raceNumber
      );

      // 取得したオッズをFirebaseに保存
      updateRaceOdds(odds);
      
      // 設定も保存
      const raceRef = ref(database, `races/${currentRace.firebaseId}/netkeibaConfig`);
      set(raceRef, {
        ...netkeibaConfig,
        lastFetched: new Date().toISOString(),
        error: null
      });

    } catch (error) {
      // エラーはfetchNetkeibaOdds内で処理済み
      const raceRef = ref(database, `races/${currentRace.firebaseId}/netkeibaConfig`);
      set(raceRef, {
        ...netkeibaConfig,
        error: error.message
      });
    }
  };

  // 🌐 自動更新間隔を計算
  const calculateUpdateInterval = (startTime) => {
    if (!startTime) return 60000; // デフォルト: 1分

    const now = new Date();
    const start = new Date(startTime);
    const diffMs = start - now;
    const diffMinutes = diffMs / (1000 * 60);

    // 発走10分前から自動更新開始
    if (diffMinutes < -5) {
      return null; // 発走後は停止
    } else if (diffMinutes <= 5) {
      return 30000; // 5分前〜発走: 30秒ごと
    } else if (diffMinutes <= 10) {
      return 60000; // 10分前〜5分前: 1分ごと
    } else {
      return null; // 10分前より前は更新しない
    }
  };

  // 🌐 自動更新を開始/停止
  const toggleAutoUpdate = async () => {
    if (!currentRace || !currentRace.firebaseId) {
      showToast('レースが選択されていません', 'error');
      return;
    }

    const newEnabled = !netkeibaConfig.enabled;

    // タイマーをクリア
    if (autoUpdateTimer) {
      clearInterval(autoUpdateTimer);
      setAutoUpdateTimer(null);
    }

    if (newEnabled) {
      // 自動更新を開始
      const startTime = currentRace.startTime || null;
      
      // 10分前より前の場合は警告
      if (startTime) {
        const now = new Date();
        const start = new Date(startTime);
        const diffMinutes = (start - now) / (1000 * 60);
        if (diffMinutes > 10) {
          showToast('発走10分前から自動更新を開始します', 'info');
        }
      }

      // すぐに1回取得（10分前より前でも実行）
      try {
        await handleFetchOdds();
      } catch (error) {
        // エラーは無視（取得失敗しても自動更新は継続）
      }

      // 動的間隔でタイマーを設定
      const updateWithDynamicInterval = async () => {
        const startTime = currentRace.startTime || null;
        const interval = calculateUpdateInterval(startTime);
        
        if (interval === null) {
          // 発走後は停止
          if (autoUpdateTimer) {
            clearInterval(autoUpdateTimer);
            setAutoUpdateTimer(null);
          }
          const raceRef = ref(database, `races/${currentRace.firebaseId}/netkeibaConfig`);
          set(raceRef, {
            ...netkeibaConfig,
            enabled: false
          });
          setNetkeibaConfig({ ...netkeibaConfig, enabled: false });
          showToast('発走後に自動更新を停止しました', 'info');
          return;
        }

        try {
          await handleFetchOdds();
        } catch (error) {
          // エラーは無視して継続
        }

        // 次の間隔を計算して再スケジュール
        const nextInterval = calculateUpdateInterval(startTime);
        if (nextInterval !== null) {
          setTimeout(updateWithDynamicInterval, nextInterval);
          setNextFetchAt(new Date(Date.now() + nextInterval));
        }
      };

      // 最初の間隔で開始
      const initialInterval = calculateUpdateInterval(startTime) || 60000; // デフォルト1分
      const timer = setTimeout(updateWithDynamicInterval, initialInterval);
      setAutoUpdateTimer(timer);
      setNextFetchAt(new Date(Date.now() + initialInterval));
    }

    // Firebaseに設定を保存
    const raceRef = ref(database, `races/${currentRace.firebaseId}/netkeibaConfig`);
    set(raceRef, {
      ...netkeibaConfig,
      enabled: newEnabled
    });

    setNetkeibaConfig({ ...netkeibaConfig, enabled: newEnabled });
    showToast(newEnabled ? '自動更新を開始しました' : '自動更新を停止しました', 'info');
  };

  // 🌐 モーダルを開く時に設定を読み込む
  const handleOpenNetkeibaModal = () => {
    if (currentRace && currentRace.netkeibaConfig) {
      setNetkeibaConfig({
        ...currentRace.netkeibaConfig,
        raceDate: currentRace.netkeibaConfig.raceDate || new Date().toISOString().split('T')[0]
      });
      setLastFetchedAt(currentRace.netkeibaConfig.lastFetched ? new Date(currentRace.netkeibaConfig.lastFetched) : null);
    } else {
      // デフォルト設定
      setNetkeibaConfig({
        raceType: 'central',
        venue: '東京',
        venueCode: '05',
        raceNumber: 1,
        raceDate: new Date().toISOString().split('T')[0],
        enabled: false
      });
      setLastFetchedAt(null);
    }
    setFetchError(null);
    setFetchStatus('待機中');
    setShowNetkeibaModal(true);
  };

  // 🌐 競馬場が変更された時の処理
  const handleVenueChange = (venue) => {
    const venueCode = VENUE_CODES[venue];
    const raceType = CENTRAL_VENUES.includes(venue) ? 'central' : 'local';
    setNetkeibaConfig({
      ...netkeibaConfig,
      venue,
      venueCode,
      raceType
    });
  };

  // 🌐 クリーンアップ: タイマーを停止
  useEffect(() => {
    return () => {
      if (autoUpdateTimer) {
        clearTimeout(autoUpdateTimer);
        clearInterval(autoUpdateTimer);
      }
    };
  }, [autoUpdateTimer]);

  const updateRaceMemo = (newMemo) => {
    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      memo: newMemo
    });
    setCurrentRace({ ...currentRace, memo: newMemo });
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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <HorsePixelArt size={48} />
          </div>
          <p className="text-gray-700 font-semibold mb-4 text-lg">読み込み中...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!currentRace) {
    const availableCourses = getAvailableCourses();

    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-3 md:p-6">
        {/* Toast通知 */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in">
            <div className={`px-6 py-4 rounded-full font-bold shadow-2xl text-white ${
              toastType === 'success' ? 'bg-gradient-to-r from-green-400 to-green-500' :
              toastType === 'error' ? 'bg-gradient-to-r from-red-400 to-red-500' :
              toastType === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
              'bg-gradient-to-r from-blue-400 to-blue-500'
            }`}>
              {toastMessage}
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
                <HorsePixelArt size={32} />
                <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  ギャン中の予想部屋
                </h1>
                <HorsePixelArt size={32} />
              </div>
              <p className="text-gray-600 text-sm md:text-lg">期待値のある馬を探して競馬ライフをもっと楽しく✨</p>
            </div>
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-2xl md:text-3xl hover:scale-110 transition transform"
            >
              ⚙️
            </button>
          </div>

          <div className="flex gap-2 mb-6 md:mb-8 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('races-upcoming')}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform flex items-center gap-2 ${
                activeTab === 'races-upcoming' || activeTab === 'races-past'
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HorsePixelArt size={20} />
              レース予想
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              disabled={!isAdmin}
            >
              <CrownPixelArt size={20} />
              コース設定
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform flex items-center gap-2 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarPixelArt size={20} />
              成績分析
            </button>
            <button
              onClick={() => {
                setActiveTab('factor-analysis');
                setShowFactorAnalysisModal(true);
              }}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform flex items-center gap-2 ${
                activeTab === 'factor-analysis'
                  ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarPixelArt size={20} />
              ファクター分析
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
                    <div className="mb-4 flex gap-2 items-center flex-wrap">
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
                            {race.netkeibaConfig && race.netkeibaConfig.enabled && (
                              <span className="ml-2 inline-flex items-center gap-1">
                                <span className="text-blue-600 animate-spin">🌐</span>
                                <span className="text-blue-600">取得中</span>
                              </span>
                            )}
                            {race.netkeibaConfig && race.netkeibaConfig.lastFetched && !race.netkeibaConfig.enabled && (
                              <span className="ml-2 text-blue-600">🌐</span>
                            )}
                          </p>
                          {race.netkeibaConfig && race.netkeibaConfig.lastFetched && (
                            <p className="text-xs text-blue-600 mt-1">
                              最終取得: {new Date(race.netkeibaConfig.lastFetched).toLocaleString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
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
                              handleRenameRace(race.firebaseId, race.name);
                            }}
                            className="flex-1 px-2 py-1 bg-blue-400 text-white rounded-full text-xs font-bold hover:bg-blue-500 transition"
                          >
                            ✏️ 名称
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
                              handleEditCourse(name);
                            }}
                            className="p-1.5 md:p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                            title="編集"
                          >
                            ✏️
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
                <h2 className="text-xl md:text-2xl font-bold text-gray-700">成績分析</h2>
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
              
              {calculateStats(statsFilterCourse, statsType) ? (
                <div>
                  <div className="mb-4 p-3 bg-gray-100 rounded-2xl text-xs md:text-sm text-gray-700 font-bold">
                    {statsType === 'winrate' && '各レースの勝率1位馬の成績'}
                    {statsType === 'expectation' && '期待値150以上で最も期待値が高い馬の成績'}
                    {statsType === 'ai' && 'AIおすすめ馬の成績'}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-4 md:p-6 border-2 border-pink-300 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <HeartPixelArt size={20} />
                        <h3 className="text-base md:text-lg font-bold text-pink-700">単勝</h3>
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-pink-600">
                        {calculateStats(statsFilterCourse, statsType).tansho.rate}%
                      </div>
                      <div className="text-xs md:text-sm text-pink-700 mt-2 font-bold">
                        {calculateStats(statsFilterCourse, statsType).tansho.hits}/{calculateStats(statsFilterCourse, statsType).total} 的中
                      </div>
                    </div>
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
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12 text-sm md:text-lg">
                  {statsType === 'expectation' && '期待値馬がいるレースの結果がまだありません'}
                  {statsType === 'ai' && 'AIおすすめ馬がいるレースの結果がまだありません'}
                  {statsType === 'winrate' && '結果が記録されたレースがありません'}
                </p>
              )}
            </div>
          )}

          {/* ファクター分析モーダル */}
          {showFactorAnalysisModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                  <BarPixelArt size={32} />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">ファクター毎の的中率分析</h2>
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
                      </p>
                    </div>

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
        </div>
      </div>
    );
  }

  // レース詳細画面
  const resultsWithRate = calculateWinRate(currentRace.horses, raceSelectedCourse);
  const expectationRanking = calculateExpectationRanking(resultsWithRate, oddsInput);
  const aiRecommendation = calculateAIRecommendation(resultsWithRate);
  const winRateGaps = detectWinRateGaps(resultsWithRate);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-3 md:p-6">
      {/* Toast通知 */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in">
          <div className={`px-6 py-4 rounded-full font-bold shadow-2xl text-white ${
            toastType === 'success' ? 'bg-gradient-to-r from-green-400 to-green-500' :
            toastType === 'error' ? 'bg-gradient-to-r from-red-400 to-red-500' :
            toastType === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
            'bg-gradient-to-r from-blue-400 to-blue-500'
          }`}>
            {toastMessage}
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-6 md:mb-8 bg-white rounded-3xl p-3 md:p-6 shadow-lg border-2 border-pink-200">
          <div className="flex-1 min-w-0 flex items-start gap-2 md:gap-3">
            <HorsePixelArt size={28} />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent break-words">
                {currentRace.name}
              </h1>
              <p className="text-xs md:text-base text-gray-600 mt-1 md:mt-2 font-bold break-words">
                {currentRace.createdAt} · {currentRace.horses.length}頭
                {raceSelectedCourse && ` · ${raceSelectedCourse}`}
                {isAdmin && ` · EXP係数: ${expCoefficient}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentRace(null)}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 hover:scale-105 transition transform shadow-lg text-sm md:text-base"
          >
            ← 戻る
          </button>
        </div>

        {currentRace.result && (
          <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-3xl p-4 md:p-6 mb-4 md:mb-6 shadow-lg">
            <h3 className="font-bold text-green-800 mb-2 text-base md:text-lg">✅ 結果記録済み</h3>
            <p className="font-bold text-green-700 text-sm md:text-base">着順: {currentRace.result.ranking}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-3 md:p-6 shadow-lg mb-4 md:mb-6 border-2 border-pink-200">
          <h2 className="text-base md:text-xl font-bold text-gray-700 mb-3 md:mb-4 flex items-center gap-2">
            <StarPixelArt size={20} />
            ファクター選択
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 md:p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
            {Object.entries(selectedFactors).map(([factorKey, isSelected]) => (
              <label key={factorKey} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition text-xs md:text-sm">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFactorToggle(factorKey)}
                  className="w-4 h-4 accent-pink-500"
                />
                <span className="font-bold text-gray-700 truncate">{factorKey}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-3 md:p-6 shadow-lg mb-4 md:mb-6 border-2 border-purple-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 md:mb-6">
            <div className="flex items-start gap-2">
              <CrownPixelArt size={24} />
              <div>
                <h2 className="text-lg md:text-2xl font-bold text-gray-700">勝率ランキング</h2>
                {raceSelectedCourse && (
                  <p className="text-xs md:text-sm text-gray-600 mt-1 font-bold">コース: {raceSelectedCourse}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap w-full md:w-auto">
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
                      setShowOddsModal(true);
                    }}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
                  >
                    <StarPixelArt size={14} />
                    <span className="hidden md:inline">オッズ</span>
                    <span className="md:hidden">odds</span>
                  </button>
                  <button
                    onClick={handleOpenNetkeibaModal}
                    className="flex-1 md:flex-none px-3 py-1.5 md:py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap flex items-center justify-center gap-1"
                  >
                    <span className="text-sm">🌐</span>
                    <span className="hidden md:inline">取得</span>
                    <span className="md:hidden">取得</span>
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

          <div className="space-y-2">
            {resultsWithRate.map((horse, idx) => {
              const odds = oddsInput[horse.horseNum] || 0;
              const value = odds * horse.winRate;
              
              const isSuperExpectation = horse.winRate >= 10 && value >= 220;
              const isGoodExpectation = horse.winRate >= 10 && value >= 150 && value < 220;
              
              return (
                <React.Fragment key={horse.horseNum}>
                  <div
                    className={`p-3 md:p-4 rounded-2xl border-2 transition ${
                      isSuperExpectation
                        ? 'bg-gradient-to-r from-yellow-300 to-orange-300 border-yellow-500 shadow-lg' 
                        : isGoodExpectation && odds > 0
                        ? 'bg-yellow-200 border-yellow-400' 
                        : idx === 0 ? 'bg-gradient-to-r from-pink-200 to-purple-200 border-pink-400' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        <div className="text-xl md:text-3xl font-black text-gray-700 w-12 md:min-w-16 text-center flex-shrink-0">
                          {idx + 1}位
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm md:text-lg font-bold text-gray-800 flex items-center gap-2 truncate">
                            <HorsePixelArt size={16} />
                            {horse.horseNum}. {horse.name}
                            {horseMarks[horse.horseNum] && (
                              <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold border border-yellow-400">
                                {horseMarks[horse.horseNum]}
                              </span>
                            )}
                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingHorseMark(horse.horseNum);
                                  setTempHorseMark(horseMarks[horse.horseNum] || '');
                                }}
                                className="px-2 py-0.5 bg-blue-400 text-white rounded text-xs font-bold hover:bg-blue-500 transition"
                              >
                                {horseMarks[horse.horseNum] ? '✏️' : '➕'}印
                              </button>
                            )}
                          </div>
                          {odds > 0 && (
                            <div className="text-xs text-gray-700 mt-1 font-bold">
                              オッズ{odds.toFixed(1)}×勝{horse.winRate.toFixed(1)}％＝{value.toFixed(0)}
                              {expectationRanking[horse.horseNum] && (
                                <span className="text-purple-600 ml-1">（期待値{expectationRanking[horse.horseNum]}位）</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                          {horse.winRate.toFixed(1)}%
                        </div>
                        {odds > 0 && (
                          <div className={`text-xs md:text-sm font-bold mt-1 flex items-center justify-end gap-1 ${
                            isSuperExpectation ? 'text-orange-700' : isGoodExpectation ? 'text-yellow-700' : 'text-gray-600'
                          }`}>
                            {isSuperExpectation && (
                              <>
                                <span className="hidden md:inline">💎超期待値馬！</span>
                                <span className="md:hidden">💎超期待</span>
                                <StarPixelArt size={14} />
                              </>
                            )}
                            {isGoodExpectation && (
                              <>
                                <span className="hidden md:inline">✨期待値馬！</span>
                                <span className="md:hidden">✨期待</span>
                                <StarPixelArt size={14} />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 🎯 勝率の断層を表示 */}
                  {winRateGaps.includes(idx) && (
                    <div className="flex items-center gap-2 my-1">
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
                      <span className="text-xs font-bold text-red-600 px-2 py-0.5 bg-red-50 rounded-full border border-red-300">
                        断層 ({(resultsWithRate[idx].winRate - resultsWithRate[idx + 1].winRate).toFixed(1)}%差)
                      </span>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

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
                    setHorseMarks(newMarks);
                    
                    // Firebaseに保存
                    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
                    set(raceRef, {
                      ...currentRace,
                      horseMarks: newMarks
                    });
                    
                    setEditingHorseMark(null);
                    setTempHorseMark('');
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

        {/* 🌐 netkeibaオッズ自動取得モーダル */}
        {showNetkeibaModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                オッズ自動取得
              </h3>
              
              <div className="space-y-4 mb-6">
                {/* 競馬種別 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    競馬種別
                  </label>
                  <select
                    value={netkeibaConfig.raceType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const defaultVenue = newType === 'central' ? CENTRAL_VENUES[0] : LOCAL_VENUES[0];
                      handleVenueChange(defaultVenue);
                    }}
                    className="w-full px-4 py-2 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="central">中央競馬</option>
                    <option value="local">地方競馬</option>
                  </select>
                </div>

                {/* 競馬場 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    競馬場
                  </label>
                  <select
                    value={netkeibaConfig.venue}
                    onChange={(e) => handleVenueChange(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 font-bold"
                  >
                    {(netkeibaConfig.raceType === 'central' ? CENTRAL_VENUES : LOCAL_VENUES).map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>

                {/* レース日 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    レース日
                  </label>
                  <input
                    type="date"
                    value={netkeibaConfig.raceDate}
                    onChange={(e) => setNetkeibaConfig({ ...netkeibaConfig, raceDate: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                {/* レース番号 */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    レース番号
                  </label>
                  <select
                    value={netkeibaConfig.raceNumber}
                    onChange={(e) => setNetkeibaConfig({ ...netkeibaConfig, raceNumber: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 font-bold"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}R</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ステータス表示 */}
              <div className="mb-6 p-4 bg-gray-100 rounded-2xl">
                <div className="space-y-2 text-sm">
                  {lastFetchedAt && (
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">最終取得:</span>
                      <span className="text-gray-600">
                        {lastFetchedAt.toLocaleString('ja-JP')}
                      </span>
                    </div>
                  )}
                  {nextFetchAt && netkeibaConfig.enabled && (
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">次回更新:</span>
                      <span className="text-gray-600">
                        {Math.max(0, Math.floor((nextFetchAt - new Date()) / 1000))}秒後
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-700">ステータス:</span>
                    <span className={`font-bold ${
                      fetchStatus === '取得中' ? 'text-blue-600' :
                      fetchStatus === 'エラー' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {fetchStatus === '取得中' ? '🔄 取得中...' :
                       fetchStatus === 'エラー' ? '❌ エラー' :
                       '⚪ 待機中'}
                    </span>
                  </div>
                  {fetchError && (
                    <div className="mt-2 text-xs text-red-600">
                      {fetchError}
                    </div>
                  )}
                </div>
              </div>

              {/* ボタン */}
              <div className="flex gap-4">
                <button
                  onClick={handleFetchOdds}
                  disabled={isFetchingOdds}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isFetchingOdds ? (
                    <>
                      <span className="animate-spin">🔄</span>
                      <span>取得中...</span>
                    </>
                  ) : (
                    <>
                      <span>🌐</span>
                      <span>今すぐ取得</span>
                    </>
                  )}
                </button>
                <button
                  onClick={toggleAutoUpdate}
                  className={`flex-1 px-4 py-3 rounded-full font-bold shadow-lg hover:shadow-2xl transition flex items-center justify-center gap-2 ${
                    netkeibaConfig.enabled
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  }`}
                >
                  <span>{netkeibaConfig.enabled ? '⏸️' : '▶️'}</span>
                  <span>{netkeibaConfig.enabled ? '自動更新OFF' : '自動更新ON'}</span>
                </button>
              </div>

              <button
                onClick={() => setShowNetkeibaModal(false)}
                className="w-full mt-4 px-4 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* オッズ入力モーダル */}
        {showOddsModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <StarPixelArt size={24} />
                オッズを入力
              </h3>
              
              <div className="space-y-3 mb-6">
                {currentRace.horses.sort((a, b) => a.horseNum - b.horseNum).map((horse) => (
                  <div key={horse.horseNum} className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-700 w-32 truncate">{horse.horseNum}. {horse.name}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={oddsInput[horse.horseNum] || ''}
                      onChange={(e) => setOddsInput({...oddsInput, [horse.horseNum]: parseFloat(e.target.value) || 0})}
                      className="flex-1 px-3 py-2 border-2 border-orange-300 rounded-lg text-xs focus:outline-none focus:border-orange-500"
                      placeholder="オッズ"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    updateRaceOdds(oddsInput);
                    setShowOddsModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold shadow-lg hover:shadow-2xl transition"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowOddsModal(false)}
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
                  <div className="space-y-3">
                    {generatedBets.map((bet, idx) => (
                      <div key={idx} className="p-3 md:p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-300">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-cyan-700 text-sm">{bet.type}</span>
                          {bet.amount > 0 && (
                            <span className="font-bold text-gray-700 text-sm">{bet.amount}円</span>
                          )}
                        </div>
                        {bet.horses.length > 0 && (
                          <div className="text-xs md:text-sm text-gray-700 font-bold mb-1">
                            {bet.horses.join(' ')}
                          </div>
                        )}
                        <div className="text-xs text-gray-600 font-bold">
                          {bet.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-cyan-100 rounded-2xl text-sm text-cyan-800 font-bold flex items-center gap-2">
                    <TrophyPixelArt size={18} />
                    合計: {generatedBets.reduce((sum, bet) => sum + bet.amount, 0)}円
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
