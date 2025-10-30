import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, remove, onValue, push } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

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
  const [races, setRaces] = useState([]);
  const [currentRace, setCurrentRace] = useState(null);
  const [pasteText, setPasteText] = useState('');
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

  // Firebase認証とデータ同期
  useEffect(() => {
    signInAnonymously(auth).catch(err => console.error('Auth error:', err));

    onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);
        
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
    if (!pasteText.trim() || !raceName.trim()) {
      setImportMessage('レース名またはデータが入力されていません');
      setImportMessageType('error');
      setTimeout(() => setImportMessage(''), 3000);
      return;
    }

    const horses = parseHorseData(pasteText);
    
    if (horses.length === 0) {
      setImportMessage('データの解析に失敗しました。形式を確認してください。');
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
      createdTime: new Date().toISOString()
    };

    const racesRef = ref(database, 'races');
    push(racesRef, newRace);

    setPasteText('');
    setRaceName('');
    setImportMessage(`${raceName}を追加しました！（${horses.length}頭）`);
    setImportMessageType('success');
    setTimeout(() => {
      setImportMessage('');
      setShowUploadModal(false);
    }, 1500);
  };

  const saveCourseSettings = () => {
    if (!courseName.trim()) {
      alert('コース名を入力してください');
      return;
    }

    const total = Object.values(tempFactors).reduce((a, b) => a + b, 0);
    if (total !== 100) {
      alert(`比重の合計が100%ではありません（現在${total}%）`);
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

  const calculateStats = (courseKey = null) => {
    let recordedRaces = races.filter(r => r.result);
    
    if (courseKey) {
      recordedRaces = recordedRaces.filter(r => r.courseKey === courseKey);
    }
    
    if (recordedRaces.length === 0) return null;

    const tanshoHits = recordedRaces.filter(r => r.result.tansho === 'hit').length;
    const fukushoHits = recordedRaces.filter(r => r.result.fukusho === 'hit').length;

    return {
      total: recordedRaces.length,
      tansho: { hits: tanshoHits, rate: ((tanshoHits / recordedRaces.length) * 100).toFixed(1) },
      fukusho: { hits: fukushoHits, rate: ((fukushoHits / recordedRaces.length) * 100).toFixed(1) }
    };
  };

  const handleFactorToggle = (factorKey) => {
    setSelectedFactors({
      ...selectedFactors,
      [factorKey]: !selectedFactors[factorKey]
    });
  };

  const handleSaveResult = () => {
    if (!resultRanking.trim()) {
      alert('着順を入力してください');
      return;
    }

    const resultsWithRate = calculateWinRate(currentRace.horses, raceSelectedCourse);
    const top1 = resultsWithRate[0];

    if (!top1) {
      alert('評価対象の馬がありません');
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

  const updateRaceMemo = (newMemo) => {
    const raceRef = ref(database, `races/${currentRace.firebaseId}`);
    set(raceRef, {
      ...currentRace,
      memo: newMemo
    });
    setCurrentRace({ ...currentRace, memo: newMemo });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-semibold mb-4 text-lg">読み込み中...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!currentRace) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                🐴 ギャン中の予想部屋
              </h1>
              <p className="text-gray-600 text-base md:text-lg">期待値のある馬を探して競馬ライフをもっと楽しく✨</p>
            </div>
            <button
              onClick={() => setShowAdminModal(true)}
              className="text-3xl hover:scale-110 transition transform"
            >
              ⚙️
            </button>
          </div>

          {/* タブボタン */}
          <div className="flex gap-2 md:gap-4 mb-8 flex-wrap justify-center">
            <button
              onClick={() => setActiveTab('races-upcoming')}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform ${
                activeTab === 'races-upcoming' || activeTab === 'races-past'
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              📤 レース予想
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              disabled={!isAdmin}
            >
              ⚙️ コース設定
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-lg hover:shadow-2xl hover:scale-105 transition transform ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 成績分析
            </button>
          </div>

          {/* レース一覧 */}
          {(activeTab === 'races-upcoming' || activeTab === 'races-past') && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-pink-200">
              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:shadow-2xl hover:scale-105 transition transform font-bold text-lg mb-6 shadow-lg"
                >
                  📤 レースデータを追加
                </button>
              )}
              {!isAdmin && <p className="text-gray-500 text-sm mb-6 text-center">※ 管理者のみ追加可能</p>}

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('races-upcoming')}
                  className={`flex-1 px-4 py-2 rounded-full font-bold transition ${
                    activeTab === 'races-upcoming'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  未出走の予想
                </button>
                <button
                  onClick={() => setActiveTab('races-past')}
                  className={`flex-1 px-4 py-2 rounded-full font-bold transition flex items-center justify-center gap-2 ${
                    activeTab === 'races-past'
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  過去の予想
                  {races.filter(r => r.result?.fukusho === 'hit').length > 0 && (
                    <span className="text-lg">✅</span>
                  )}
                </button>
              </div>

              {races.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {(activeTab === 'races-upcoming' 
                    ? races.filter(r => !r.result)
                    : races.filter(r => r.result)
                  ).map((race) => (
                    <div
                      key={race.firebaseId}
                      onClick={() => {
                        setCurrentRace(race);
                        setRaceSelectedCourse(race.courseKey);
                        setMemo(race.memo || '');
                        setOddsInput(race.odds || {});
                        setExcludedHorses(race.excluded || {});
                        setExpCoefficient(race.expCoefficient || 0.1);
                      }}
                      className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-pink-200 hover:border-purple-400 cursor-pointer hover:shadow-lg transition shadow-md hover:scale-105 group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base md:text-lg text-gray-800 flex items-center gap-2 truncate">
                            <span className="text-xl md:text-2xl flex-shrink-0">🏇</span>
                            <span className="truncate">{race.name}</span>
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-1 break-words">
                            {race.createdAt} · {race.horses.length}頭
                            {race.courseKey && ` · ${race.courseKey}`}
                          </p>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRaceToDelete(race.firebaseId);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                            title="削除"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      {/* 期待値馬のいるレースを表示（修正版） */}
                      {race.odds && Object.keys(race.odds).length > 0 && (() => {
                        // このレースの勝率を計算
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
                            <div className="flex items-center gap-1 text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full shadow-md animate-pulse">
                              <span className="text-base">💎</span>
                              <span>超期待値馬あり！</span>
                              <span className="text-base">✨</span>
                            </div>
                          );
                        } else if (hasExpectation) {
                          return (
                            <div className="flex items-center gap-1 text-sm font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full shadow-md">
                              <span className="text-base">✨</span>
                              <span>期待値馬あり！</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      
                      {race.result && (
                        <div className="flex items-center gap-2 flex-wrap mt-2">
                          <span className="text-xs md:text-sm font-bold text-gray-700">結果: {race.result.ranking}</span>
                          {race.result?.fukusho === 'hit' && <span className="text-base md:text-lg">✅</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12 text-base md:text-lg">レースデータがまだありません</p>
              )}
            </div>
          )}

          {/* コース設定 */}
          {activeTab === 'settings' && isAdmin && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-purple-200">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full hover:shadow-2xl hover:scale-105 transition transform font-bold text-lg mb-6 shadow-lg"
              >
                ➕ 新しいコース設定を作成
              </button>

              {Object.keys(courseSettings).length > 0 ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-700 mb-4">保存済みコース設定</h2>
                  {Object.entries(courseSettings).map(([name, factorData]) => (
                    <div
                      key={name}
                      className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border-2 border-purple-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
                        <button
                          onClick={() => deleteCourseSettings(name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {Object.entries(factorData).map(([factor, weight]) => (
                          <div key={factor} className="bg-white p-2 rounded-lg border border-purple-300">
                            <div className="text-gray-600 text-xs font-bold">{factor}</div>
                            <div className="font-bold text-purple-600 text-lg">{weight}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12">保存されたコース設定がありません</p>
              )}
            </div>
          )}

          {/* 成績分析 */}
          {activeTab === 'stats' && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-700 mb-6">成績分析📊</h2>
              
              {calculateStats(statsFilterCourse) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-3xl p-6 border-2 border-pink-300 shadow-lg">
                    <h3 className="text-lg font-bold text-pink-700 mb-3">単勝</h3>
                    <div className="text-4xl font-black text-pink-600">
                      {calculateStats(statsFilterCourse).tansho.rate}%
                    </div>
                    <div className="text-sm text-pink-700 mt-2 font-bold">
                      {calculateStats(statsFilterCourse).tansho.hits}/{calculateStats(statsFilterCourse).total} 的中
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-6 border-2 border-purple-300 shadow-lg">
                    <h3 className="text-lg font-bold text-purple-700 mb-3">複勝</h3>
                    <div className="text-4xl font-black text-purple-600">
                      {calculateStats(statsFilterCourse).fukusho.rate}%
                    </div>
                    <div className="text-sm text-purple-700 mt-2 font-bold">
                      {calculateStats(statsFilterCourse).fukusho.hits}/{calculateStats(statsFilterCourse).total} 的中
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-12 text-lg">結果が記録されたレースがありません</p>
              )}
            </div>
          )}

          {/* モーダル: アップロード */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">レースデータを追加</h3>

                {importMessage && (
                  <div className={`p-4 rounded-2xl mb-6 font-bold ${
                    importMessageType === 'success' 
                      ? 'bg-green-100 text-green-800 border-2 border-green-400' 
                      : 'bg-red-100 text-red-800 border-2 border-red-400'
                  }`}>
                    {importMessage}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">レース名</label>
                  <input
                    type="text"
                    value={raceName}
                    onChange={(e) => setRaceName(e.target.value)}
                    placeholder="例：京都12R 嵯峨野特別"
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">コース設定を選択（オプション）</label>
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => setSelectedCourse(e.target.value || null)}
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-2xl focus:outline-none focus:border-pink-500"
                  >
                    <option value="">デフォルト設定を使用</option>
                    {Object.keys(courseSettings).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">データ（コピペ）</label>
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    className="w-full h-48 p-4 border-2 border-pink-300 rounded-2xl font-mono text-sm focus:outline-none focus:border-pink-500"
                    placeholder="データをここにペーストしてください"
                  />
                </div>

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

          {/* モーダル: コース設定 */}
          {showSettingsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-96 overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">新しいコース設定を作成</h3>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">コース名</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="例：新潟千直、京都ダ1400"
                    className="w-full px-4 py-3 border-2 border-purple-300 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-3">比重設定（合計100%）</label>
                  <div className="space-y-3">
                    {Object.entries(tempFactors).map(([factor, weight]) => (
                      <div key={factor} className="flex items-center gap-3">
                        <label className="w-40 text-sm font-bold text-gray-700">{factor}</label>
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

          {/* モーダル: 管理者認証 */}
          {showAdminModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">管理者パスコード</h3>
                
                {isAdmin && (
                  <div className="mb-6 p-4 bg-green-100 border-2 border-green-400 rounded-2xl text-sm text-green-800 font-bold">
                    ✓ 管理者モード有効
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
                      if (adminPassword === '1234') {
                        setIsAdmin(true);
                        setAdminPassword('');
                        setShowAdminModal(false);
                      } else {
                        alert('パスコードが違います');
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

          {/* モーダル: 削除確認 */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-red-600">レースを削除しますか？</h3>
                <p className="text-gray-700 mb-6 font-bold">
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
        </div>
      </div>
    );
  }

  const resultsWithRate = calculateWinRate(currentRace.horses, raceSelectedCourse);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white rounded-3xl p-4 md:p-6 shadow-lg border-2 border-pink-200">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent break-words">
              {currentRace.name}
            </h1>
            <p className="text-xs md:text-base text-gray-600 mt-2 font-bold break-words">
              {currentRace.createdAt} · {currentRace.horses.length}頭
              {raceSelectedCourse && ` · ${raceSelectedCourse}`}
              {isAdmin && ` · EXP係数: ${expCoefficient}`}
            </p>
          </div>
          <button
            onClick={() => setCurrentRace(null)}
            className="w-full md:w-auto px-4 md:px-6 py-2 md:py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 hover:scale-105 transition transform shadow-lg text-sm md:text-base"
          >
            ← 戻る
          </button>
        </div>

        {/* 結果済み表示 */}
        {currentRace.result && (
          <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-3xl p-6 mb-6 shadow-lg">
            <h3 className="font-bold text-green-800 mb-2 text-lg">✅ 結果記録済み</h3>
            <p className="font-bold text-green-700">着順: {currentRace.result.ranking}</p>
          </div>
        )}

        {/* ファクター選択 */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg mb-6 border-2 border-pink-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">ファクター選択</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
            {Object.entries(selectedFactors).map(([factorKey, isSelected]) => (
              <label key={factorKey} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition text-xs md:text-sm">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFactorToggle(factorKey)}
                  className="w-4 h-4 md:w-5 md:h-5 accent-pink-500"
                />
                <span className="font-bold text-gray-700">{factorKey}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 勝率ランキング */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-lg mb-6 border-2 border-purple-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-700">勝率ランキング</h2>
              {raceSelectedCourse && (
                <p className="text-xs md:text-sm text-gray-600 mt-1 font-bold">コース設定: {raceSelectedCourse}</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-start md:justify-end w-full md:w-auto">
              {isAdmin && (
                <button
                  onClick={() => setShowCourseSelectModal(true)}
                  className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
                >
                  コース変更
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => {
                    setTempExpCoefficient(expCoefficient);
                    setShowExpModal(true);
                  }}
                  className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
                >
                  EXP設定
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setShowExcludeModal(true)}
                  className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
                >
                  馬を除外
                </button>
              )}
              <button
                onClick={() => {
                  setOddsInput(currentRace.odds || {});
                  setShowOddsModal(true);
                }}
                className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
              >
                オッズ入力
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowResultModal(true)}
                  className="px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full font-bold text-xs md:text-sm shadow-lg hover:shadow-2xl hover:scale-105 transition transform whitespace-nowrap"
                >
                  結果記録
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {resultsWithRate.map((horse, idx) => {
              const odds = oddsInput[horse.horseNum] || 0;
              const value = odds * horse.winRate;
              
              // 期待値の判定（修正版）
              const isSuperExpectation = horse.winRate >= 10 && value >= 220; // 超期待値馬
              const isGoodExpectation = horse.winRate >= 10 && value >= 150 && value < 220; // 期待値馬
              
              return (
                <div
                  key={horse.horseNum}
                  className={`p-4 rounded-2xl border-2 transition ${
                    isSuperExpectation
                      ? 'bg-gradient-to-r from-yellow-300 to-orange-300 border-yellow-500 shadow-lg' 
                      : isGoodExpectation && odds > 0
                      ? 'bg-yellow-200 border-yellow-400' 
                      : idx === 0 ? 'bg-gradient-to-r from-pink-200 to-purple-200 border-pink-400' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-3xl font-black text-gray-700 min-w-16 text-center">
                        {idx + 1}位
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-800">
                          {horse.horseNum}. {horse.name}
                        </div>
                        {odds > 0 && (
                          <div className="text-xs text-gray-700 mt-1 font-bold">
                            オッズ{odds.toFixed(1)}×勝{horse.winRate.toFixed(1)}％＝{value.toFixed(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {horse.winRate.toFixed(1)}%
                      </div>
                      {odds > 0 && (
                        <div className={`text-sm font-bold mt-1 ${
                          isSuperExpectation ? 'text-orange-700' : isGoodExpectation ? 'text-yellow-700' : 'text-gray-600'
                        }`}>
                          {isSuperExpectation ? '💎超期待値馬！' : isGoodExpectation ? '✨期待値馬！' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 除外馬表示 */}
            {Object.keys(excludedHorses).length > 0 && (
              <div className="mt-6 pt-4 border-t-2 border-gray-300">
                <p className="text-sm text-gray-600 mb-3 font-bold">🚫 除外対象：</p>
                <div className="space-y-2">
                  {currentRace.horses
                    .filter(horse => excludedHorses[horse.horseNum])
                    .sort((a, b) => a.horseNum - b.horseNum)
                    .map((horse) => (
                      <div
                        key={horse.horseNum}
                        className="p-3 bg-gray-400 rounded-2xl border-2 border-gray-500 opacity-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-white">
                            {horse.horseNum}. {horse.name}
                          </div>
                          <div className="text-sm font-bold text-white">
                            【除外】
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* メモ */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">📝 メモ</h2>
            {isAdmin && (
              <button
                onClick={() => setShowMemoModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-2xl transition"
              >
                編集
              </button>
            )}
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 min-h-32">
            <p className="text-gray-700 whitespace-pre-wrap font-bold">{memo || '（メモなし）'}</p>
          </div>
        </div>

        {/* 各種モーダル */}
        {showCourseSelectModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800">コース設定を選択</h3>
              
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

        {showExpModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800">EXP係数を調整</h3>
              
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

        {showExcludeModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold mb-6 text-gray-800">馬を除外（出走取り消しなど）</h3>
              
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

        {showMemoModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-6 text-gray-800">メモを編集</h3>
              
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full h-48 p-4 border-2 border-blue-300 rounded-2xl font-mono text-sm mb-6 focus:outline-none focus:border-blue-500"
                placeholder="見解、印、買い目など..."
              />

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

        {showOddsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold mb-6 text-gray-800">オッズを入力</h3>
              
              <div className="space-y-3 mb-6">
                {currentRace.horses.sort((a, b) => a.horseNum - b.horseNum).map((horse) => (
                  <div key={horse.horseNum} className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-700 w-32">{horse.horseNum}. {horse.name}</label>
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

        {showResultModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">着順を記録</h3>
              
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
      </div>
    </div>
  );
};

export default HorseAnalysisApp;
