import { useEffect, useState, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { 
  Home, 
  Heart, 
  Sparkles, 
  User, 
  Check, 
  ChevronRight,
  Star,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Image as ImageIcon,
  Award,
  Globe,
  ChevronDown,
  Lock,
  Flame
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo Component - Hand with Heart
const AppLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Heart */}
    <path 
      d="M50 35C50 25 40 15 30 20C20 25 20 40 30 50L50 70L70 50C80 40 80 25 70 20C60 15 50 25 50 35Z" 
      fill="#4169E1"
      className="animate-heart-beat"
    />
    {/* Hand */}
    <path 
      d="M25 75C25 75 30 70 40 70H60C70 70 75 75 75 75L80 85C80 85 70 90 50 90C30 90 20 85 20 85L25 75Z" 
      fill="#4169E1"
    />
    <path 
      d="M35 75V65C35 63 37 61 40 61H60C63 61 65 63 65 65V75" 
      fill="#4169E1"
    />
  </svg>
);

// Design Assets
const ASSETS = {
  streakBadge: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/4478c691c14f8311db5d44bb6372ed09849671be4ac968fc1616f184a6647028.png",
  meme: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/20e048668d5d9dbf26765ed57e33180b76dc56b52dac829cce5b065a5257e5df.png",
  goodDeedStar: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/598c2fc244c235ebbdc654568179842693dd702c40ae76754656dbda06f19fd0.png"
};

// Avatar items with unlock requirements
const AVATAR_ITEMS = {
  hair: [
    { id: 0, color: "#8B4513", unlocked: true, cost: 0 },
    { id: 1, color: "#FFD700", unlocked: true, cost: 0 },
    { id: 2, color: "#1a1a1a", unlocked: true, cost: 0 },
    { id: 3, color: "#FF91A4", unlocked: true, cost: 0 },
    { id: 4, color: "#9B59B6", unlocked: false, cost: 50 },
    { id: 5, color: "#87CEEB", unlocked: false, cost: 50 },
    { id: 6, color: "#98D8AA", unlocked: false, cost: 100 },
    { id: 7, color: "#FF6B6B", unlocked: false, cost: 100 },
  ],
  face: [
    { id: 0, emoji: "😊", unlocked: true, cost: 0 },
    { id: 1, emoji: "😄", unlocked: true, cost: 0 },
    { id: 2, emoji: "😎", unlocked: true, cost: 0 },
    { id: 3, emoji: "🥳", unlocked: true, cost: 0 },
    { id: 4, emoji: "😇", unlocked: false, cost: 50 },
    { id: 5, emoji: "🤗", unlocked: false, cost: 50 },
    { id: 6, emoji: "🤩", unlocked: false, cost: 100 },
    { id: 7, emoji: "😜", unlocked: false, cost: 100 },
  ],
  shirt: [
    { id: 0, color: "#FFB6C1", unlocked: true, cost: 0 },
    { id: 1, color: "#87CEEB", unlocked: true, cost: 0 },
    { id: 2, color: "#DDA0DD", unlocked: true, cost: 0 },
    { id: 3, color: "#98D8AA", unlocked: true, cost: 0 },
    { id: 4, color: "#FFD700", unlocked: false, cost: 50 },
    { id: 5, color: "#FF6B6B", unlocked: false, cost: 50 },
    { id: 6, color: "#9B59B6", unlocked: false, cost: 100 },
    { id: 7, color: "#5DADE2", unlocked: false, cost: 100 },
  ],
  pants: [
    { id: 0, color: "#4169E1", unlocked: true, cost: 0 },
    { id: 1, color: "#2B2D42", unlocked: true, cost: 0 },
    { id: 2, color: "#87CEEB", unlocked: true, cost: 0 },
    { id: 3, color: "#DDA0DD", unlocked: true, cost: 0 },
    { id: 4, color: "#FFB6C1", unlocked: false, cost: 50 },
    { id: 5, color: "#98D8AA", unlocked: false, cost: 50 },
    { id: 6, color: "#FFD700", unlocked: false, cost: 100 },
    { id: 7, color: "#FF91A4", unlocked: false, cost: 100 },
  ],
};

// Avatar Character Component
const AvatarCharacter = ({ hair, face, shirt, pants, size = 120 }) => {
  const hairColor = AVATAR_ITEMS.hair[hair]?.color || AVATAR_ITEMS.hair[0].color;
  const faceEmoji = AVATAR_ITEMS.face[face]?.emoji || AVATAR_ITEMS.face[0].emoji;
  const shirtColor = AVATAR_ITEMS.shirt[shirt]?.color || AVATAR_ITEMS.shirt[0].color;
  const pantsColor = AVATAR_ITEMS.pants[pants]?.color || AVATAR_ITEMS.pants[0].color;
  
  return (
    <div className="relative" style={{ width: size, height: size * 1.5 }}>
      {/* Hair */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.7,
          height: size * 0.35,
          backgroundColor: hairColor,
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '50% 50% 0 0',
        }}
      />
      {/* Head */}
      <div 
        className="absolute rounded-full bg-[#FFDAB9] flex items-center justify-center"
        style={{
          width: size * 0.6,
          height: size * 0.5,
          top: size * 0.15,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: size * 0.3,
        }}
      >
        {faceEmoji}
      </div>
      {/* Body/Shirt */}
      <div 
        className="absolute rounded-t-3xl"
        style={{
          width: size * 0.65,
          height: size * 0.45,
          backgroundColor: shirtColor,
          top: size * 0.58,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      {/* Arms */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.15,
          height: size * 0.35,
          backgroundColor: shirtColor,
          top: size * 0.62,
          left: size * 0.08,
          transform: 'rotate(15deg)',
        }}
      />
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.15,
          height: size * 0.35,
          backgroundColor: shirtColor,
          top: size * 0.62,
          right: size * 0.08,
          transform: 'rotate(-15deg)',
        }}
      />
      {/* Pants */}
      <div 
        className="absolute"
        style={{
          width: size * 0.65,
          height: size * 0.35,
          backgroundColor: pantsColor,
          top: size * 0.95,
          left: '50%',
          transform: 'translateX(-50%)',
          borderRadius: '0 0 30% 30%',
        }}
      />
      {/* Legs gap */}
      <div 
        className="absolute"
        style={{
          width: size * 0.08,
          height: size * 0.25,
          backgroundColor: '#FFF5F8',
          top: size * 1.05,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
};

// Mood emojis with scores
const MOOD_OPTIONS = [
  { emoji: "😢", score: 1 },
  { emoji: "😕", score: 2 },
  { emoji: "😐", score: 3 },
  { emoji: "😊", score: 4 },
  { emoji: "😄", score: 5 }
];

// Language Selector Component
const LanguageSelector = () => {
  const { language, setLanguage, languages, languageNames } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" data-testid="language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border-2 border-[#F0D4E0] hover:border-[#87CEEB] transition-all"
        data-testid="language-selector-btn"
      >
        <Globe className="w-4 h-4 text-[#87CEEB]" strokeWidth={3} />
        <span className="text-sm font-semibold text-[#2B2D42]">{languageNames[language]}</span>
        <ChevronDown className={`w-4 h-4 text-[#6C757D] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-lg border-2 border-[#F0D4E0] overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setIsOpen(false); }}
                className={`w-full px-4 py-3 text-left hover:bg-[#F8E8EE] transition-colors flex items-center gap-2 ${language === lang ? 'bg-[#F8E8EE]' : ''}`}
                data-testid={`language-option-${lang}`}
              >
                {language === lang && <Check className="w-4 h-4 text-[#98D8AA]" strokeWidth={3} />}
                <span className={`text-sm font-semibold ${language === lang ? 'text-[#87CEEB]' : 'text-[#2B2D42]'}`}>
                  {languageNames[lang]}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Home Dashboard
const HomeDashboard = ({ user, onCheckIn, todayCheckin, refreshUser }) => {
  const { t } = useLanguage();
  const [showCheckin, setShowCheckin] = useState(false);
  const [moodSelected, setMoodSelected] = useState(null);
  const [isBothered, setIsBothered] = useState(null);
  const [isSad, setIsSad] = useState(null);
  const [step, setStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get random supportive message based on language
  const getRandomMessage = () => {
    const msgKeys = ['msg1', 'msg2', 'msg3', 'msg4', 'msg5', 'msg6', 'msg7', 'msg8', 'msg9', 'msg10'];
    const randomKey = msgKeys[Math.floor(Math.random() * msgKeys.length)];
    return t(randomKey);
  };

  const [supportiveMessage] = useState(getRandomMessage);

  const handleMoodSelect = (mood) => {
    setMoodSelected(mood);
    setStep(1);
  };

  const handleSubmitCheckin = async () => {
    if (moodSelected === null) return;
    
    setLoading(true);
    try {
      await axios.post(`${API}/checkins`, {
        user_id: user.id,
        mood_score: moodSelected.score,
        mood_emoji: moodSelected.emoji,
        is_bothered: isBothered === true,
        is_sad: isSad === true
      });
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowCheckin(false);
        setStep(0);
        setMoodSelected(null);
        setIsBothered(null);
        setIsSad(null);
        onCheckIn();
        refreshUser();
      }, 3000);
    } catch (error) {
      console.error("Check-in error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 pb-24">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} colors={['#FFB6C1', '#87CEEB', '#DDA0DD', '#98D8AA']} />}
      
      {/* Header with Logo and Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AppLogo size={50} />
          <div>
            <h1 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {t('hi')}, {user.name}!
            </h1>
            <p className="text-[#6C757D] text-sm">{t('howAreYouToday')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <div className="streak-badge" data-testid="streak-badge">
            <Flame className="w-5 h-5 text-[#FF6B6B]" />
            <span>{user.current_streak}</span>
          </div>
        </div>
      </div>

      {/* Points Display */}
      <div className="flex justify-center mb-6">
        <div className="points-badge text-lg">
          <Star className="w-5 h-5" />
          <span>{user.total_checkins * 10} {t('points')}</span>
        </div>
      </div>

      {/* Daily Check-in Card */}
      {!todayCheckin?.checked_in ? (
        <motion.div 
          className="card mb-6 cursor-pointer border-2 border-[#FFB6C1]"
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowCheckin(true)}
          data-testid="daily-checkin-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#87CEEB] flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('dailyCheckin')}
              </h3>
              <p className="text-[#6C757D] text-sm">{t('tellMeHowYouFeel')}</p>
            </div>
            <ChevronRight className="text-[#FFB6C1]" />
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="card mb-6 border-2 border-[#98D8AA]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#98D8AA] flex items-center justify-center">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <div>
              <h3 className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('alreadyCheckedIn')} {todayCheckin.checkin?.mood_emoji}
              </h3>
              <p className="text-[#6C757D] text-sm">{t('comeBackTomorrow')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Supportive Message */}
      <motion.div 
        className="card mb-6 bg-gradient-to-r from-[#F8E8EE] to-[#E8F4FD]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        data-testid="supportive-message-card"
      >
        <div className="flex items-start gap-4">
          <AppLogo size={48} />
          <div>
            <p className="text-[#2B2D42] font-semibold leading-relaxed">
              {supportiveMessage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Fun Meme */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        data-testid="daily-meme-card"
      >
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <ImageIcon className="inline w-5 h-5 mr-2 text-[#87CEEB]" strokeWidth={3} />
          {t('dailySmile')}
        </h3>
        <img 
          src={ASSETS.meme} 
          alt="Fun meme" 
          className="w-full rounded-2xl"
        />
        <p className="text-center text-[#6C757D] mt-3 text-sm">{t('yourMemesHere')}</p>
      </motion.div>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckin && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCheckin(false)}
          >
            <motion.div 
              className="bg-white w-full rounded-t-[2rem] p-6 pb-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {step === 0 && (
                <>
                  <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {t('howAreYouFeeling')}
                  </h2>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {MOOD_OPTIONS.map((mood) => (
                      <motion.button
                        key={mood.score}
                        className={`emoji-btn ${moodSelected?.score === mood.score ? "selected" : ""}`}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMoodSelect(mood)}
                        data-testid={`mood-option-${mood.score}`}
                      >
                        {mood.emoji}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-center gap-8 mt-4 text-sm text-[#6C757D]">
                    <span>{t('verySad')}</span>
                    <span>{t('amazing')}</span>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {t('isAnyoneBothering')}
                  </h2>
                  <div className="flex justify-center gap-4">
                    <button 
                      className={`toggle-btn ${isBothered === true ? "yes" : ""}`}
                      onClick={() => { setIsBothered(true); setStep(2); }}
                      data-testid="bothered-yes-btn"
                    >
                      {t('yes')} 😔
                    </button>
                    <button 
                      className={`toggle-btn ${isBothered === false ? "no" : ""}`}
                      onClick={() => { setIsBothered(false); setStep(2); }}
                      data-testid="bothered-no-btn"
                    >
                      {t('no')} 😊
                    </button>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {t('didYouFeelSad')}
                  </h2>
                  <div className="flex justify-center gap-4 mb-6">
                    <button 
                      className={`toggle-btn ${isSad === true ? "yes" : ""}`}
                      onClick={() => setIsSad(true)}
                      data-testid="sad-yes-btn"
                    >
                      {t('yes')} 😢
                    </button>
                    <button 
                      className={`toggle-btn ${isSad === false ? "no" : ""}`}
                      onClick={() => setIsSad(false)}
                      data-testid="sad-no-btn"
                    >
                      {t('no')} 😄
                    </button>
                  </div>
                  {isSad !== null && (
                    <motion.button
                      className="btn-primary w-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleSubmitCheckin}
                      disabled={loading}
                      data-testid="submit-checkin-btn"
                    >
                      {loading ? t('saving') : `${t('done')} 🎉`}
                    </motion.button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Good Deeds Screen
const GoodDeedsScreen = ({ user, completedDeeds, onCompleteDeed }) => {
  const { t } = useLanguage();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedDeed, setCelebratedDeed] = useState(null);

  // Translated deeds
  const deeds = [
    { id: "1", title: t('deed1Title'), description: t('deed1Desc'), points: 10 },
    { id: "2", title: t('deed2Title'), description: t('deed2Desc'), points: 15 },
    { id: "3", title: t('deed3Title'), description: t('deed3Desc'), points: 10 },
    { id: "4", title: t('deed4Title'), description: t('deed4Desc'), points: 15 },
    { id: "5", title: t('deed5Title'), description: t('deed5Desc'), points: 20 },
    { id: "6", title: t('deed6Title'), description: t('deed6Desc'), points: 10 },
    { id: "7", title: t('deed7Title'), description: t('deed7Desc'), points: 15 },
    { id: "8", title: t('deed8Title'), description: t('deed8Desc'), points: 15 },
    { id: "9", title: t('deed9Title'), description: t('deed9Desc'), points: 20 },
    { id: "10", title: t('deed10Title'), description: t('deed10Desc'), points: 15 },
  ];

  const isCompleted = (deedId) => {
    const today = new Date().toISOString().split("T")[0];
    return completedDeeds.some(d => d.deed_id === deedId && d.completed_at.startsWith(today));
  };

  const handleComplete = async (deed) => {
    if (isCompleted(deed.id)) return;
    
    try {
      await axios.post(`${API}/deeds`, {
        user_id: user.id,
        deed_id: deed.id
      });
      setCelebratedDeed(deed);
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onCompleteDeed();
      }, 2500);
    } catch (error) {
      console.error("Error completing deed:", error);
    }
  };

  return (
    <div className="p-6 pb-24">
      {showCelebration && <Confetti recycle={false} numberOfPieces={150} colors={['#FFB6C1', '#87CEEB', '#DDA0DD', '#98D8AA']} />}
      
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#87CEEB] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {t('doGoodThings')}
            </h1>
            <p className="text-[#6C757D] text-sm">{t('pickOneToBrighten')}</p>
          </div>
        </div>
        <LanguageSelector />
      </div>

      <div className="space-y-3">
        {deeds.map((deed, index) => (
          <motion.div
            key={deed.id}
            className={`deed-card ${isCompleted(deed.id) ? "completed" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleComplete(deed)}
            data-testid={`deed-card-${deed.id}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCompleted(deed.id) ? "bg-[#98D8AA]" : "bg-[#F8E8EE]"
            }`}>
              {isCompleted(deed.id) ? (
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              ) : (
                <Star className="w-5 h-5 text-[#FFB6C1]" strokeWidth={3} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {deed.title}
              </h3>
              <p className="text-[#6C757D] text-sm">{deed.description}</p>
            </div>
            <div className="points-badge">
              +{deed.points}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && celebratedDeed && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 text-center max-w-xs border-4 border-[#FFB6C1]"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#87CEEB] flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <Star className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('amazingCelebration')} 🎉
              </h2>
              <p className="text-[#6C757D]">
                {t('youCompleted')} {celebratedDeed.title}
              </p>
              <p className="text-[#FFB6C1] font-bold mt-2 text-lg">+{celebratedDeed.points} {t('points')}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile & Avatar Screen
const ProfileScreen = ({ user, onUpdateAvatar }) => {
  const { t } = useLanguage();
  const [avatarHair, setAvatarHair] = useState(user.avatar_hair || 0);
  const [avatarFace, setAvatarFace] = useState(user.avatar_face || 0);
  const [avatarShirt, setAvatarShirt] = useState(user.avatar_clothes || 0);
  const [avatarPants, setAvatarPants] = useState(0);
  const [saving, setSaving] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState({
    hair: [0, 1, 2, 3],
    face: [0, 1, 2, 3],
    shirt: [0, 1, 2, 3],
    pants: [0, 1, 2, 3],
  });
  
  const userPoints = user.total_checkins * 10;

  const isItemUnlocked = (category, id) => {
    return unlockedItems[category].includes(id);
  };

  const handleSelectItem = (category, id) => {
    if (!isItemUnlocked(category, id)) return;
    
    switch(category) {
      case 'hair': setAvatarHair(id); break;
      case 'face': setAvatarFace(id); break;
      case 'shirt': setAvatarShirt(id); break;
      case 'pants': setAvatarPants(id); break;
      default: break;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/users/${user.id}/avatar`, {
        avatar_face: avatarFace,
        avatar_hair: avatarHair,
        avatar_clothes: avatarShirt
      });
      onUpdateAvatar();
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
    setSaving(false);
  };

  const renderItemSelector = (category, items, selectedId, label) => (
    <div className="card mb-4">
      <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        {label}
      </h3>
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => {
          const unlocked = isItemUnlocked(category, item.id);
          return (
            <button
              key={item.id}
              className={`avatar-option ${selectedId === item.id ? "selected" : ""} ${!unlocked ? "locked" : ""}`}
              style={{ backgroundColor: item.color || '#F8E8EE' }}
              onClick={() => handleSelectItem(category, item.id)}
              data-testid={`${category}-option-${item.id}`}
              disabled={!unlocked}
            >
              {item.emoji && <span className="text-2xl">{item.emoji}</span>}
              {!unlocked && (
                <div className="absolute inset-0 bg-slate-900/30 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {items.some(item => !isItemUnlocked(category, item.id)) && (
        <p className="text-xs text-[#6C757D] mt-2 flex items-center gap-1">
          <Lock className="w-3 h-3" /> {t('lockedItemsHint') || "Earn points to unlock more!"}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 pb-24">
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <User className="inline w-6 h-6 mr-2 text-[#87CEEB]" strokeWidth={3} />
          {t('yourProfile')}
        </h1>
        <LanguageSelector />
      </div>

      {/* Avatar Preview */}
      <motion.div 
        className="card mb-6 flex flex-col items-center py-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <AvatarCharacter 
          hair={avatarHair}
          face={avatarFace}
          shirt={avatarShirt}
          pants={avatarPants}
          size={100}
        />
        <h2 className="text-xl font-bold text-[#2B2D42] mt-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {user.name}
        </h2>
        <div className="points-badge mt-2">
          <Star className="w-4 h-4" />
          <span>{userPoints} {t('points')}</span>
        </div>
      </motion.div>

      {/* Avatar Customization */}
      {renderItemSelector('hair', AVATAR_ITEMS.hair, avatarHair, t('pickHairColor'))}
      {renderItemSelector('face', AVATAR_ITEMS.face, avatarFace, t('pickYourFace'))}
      {renderItemSelector('shirt', AVATAR_ITEMS.shirt, avatarShirt, t('pickClothesColor'))}
      {renderItemSelector('pants', AVATAR_ITEMS.pants, avatarPants, t('pickPantsColor') || "Pick Pants Color")}

      {/* Stats */}
      <div className="card mb-6">
        <h3 className="font-bold text-[#2B2D42] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Award className="inline w-5 h-5 mr-2 text-[#FFB6C1]" strokeWidth={3} />
          {t('yourStats')}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#FF91A4]">{user.current_streak}</div>
            <div className="text-xs text-[#6C757D]">{t('currentStreak')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#87CEEB]">{user.longest_streak}</div>
            <div className="text-xs text-[#6C757D]">{t('longestStreak')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#98D8AA]">{user.total_checkins}</div>
            <div className="text-xs text-[#6C757D]">{t('totalCheckins')}</div>
          </div>
        </div>
      </div>

      <button 
        className="btn-primary w-full"
        onClick={handleSave}
        disabled={saving}
        data-testid="save-avatar-btn"
      >
        {saving ? t('loading') : t('saveChanges')}
      </button>
    </div>
  );
};

// Analysis Screen
const AnalysisScreen = ({ user, analysis, checkins }) => {
  const { t } = useLanguage();
  
  const getTrendIcon = () => {
    switch (analysis?.trend) {
      case "improving": return <Smile className="w-6 h-6 text-[#98D8AA]" strokeWidth={3} />;
      case "needs_attention": return <Frown className="w-6 h-6 text-[#FF91A4]" strokeWidth={3} />;
      default: return <Meh className="w-6 h-6 text-[#87CEEB]" strokeWidth={3} />;
    }
  };

  const getTrendLabel = () => {
    switch (analysis?.trend) {
      case "improving": return t('gettingBetter');
      case "needs_attention": return t('couldUseHug');
      default: return t('doingOkay');
    }
  };

  return (
    <div className="p-6 pb-24">
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Heart className="inline w-6 h-6 mr-2 text-[#FFB6C1]" strokeWidth={3} />
          {t('howYoureDoing')}
        </h1>
        <LanguageSelector />
      </div>

      {/* Overall Score */}
      <motion.div 
        className="card mb-6 text-center bg-gradient-to-br from-[#F8E8EE] to-[#E8F4FD]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          {getTrendIcon()}
          <span className="text-lg font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {getTrendLabel()}
          </span>
        </div>
        <div className="text-5xl font-bold text-[#87CEEB] mb-2" data-testid="overall-score">
          {analysis?.overall_score || 0}/5
        </div>
        <p className="text-[#6C757D] text-sm">
          {analysis?.positive_days || 0} {t('outOf')} {analysis?.total_days || 0} {t('daysWereGreat')}
        </p>
      </motion.div>

      {/* Alerts */}
      {analysis?.alerts?.length > 0 && (
        <motion.div 
          className="card mb-6 border-2 border-[#FF91A4]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#FF91A4] flex-shrink-0" strokeWidth={3} />
            <div>
              <h3 className="font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('friendlyReminder')}
              </h3>
              <p className="text-[#6C757D] text-sm">
                {t('reminderText')}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Check-ins */}
      <div className="card">
        <h3 className="font-bold text-[#2B2D42] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('recentFeelings')}
        </h3>
        <div className="space-y-3">
          {checkins?.slice(0, 7).map((checkin, i) => (
            <div key={checkin.id} className="flex items-center gap-3">
              <span className="text-2xl">{checkin.mood_emoji}</span>
              <div className="flex-1">
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(checkin.mood_score / 5) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-[#6C757D]">
                {new Date(checkin.date).toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            </div>
          ))}
          {(!checkins || checkins.length === 0) && (
            <p className="text-center text-[#6C757D] py-4">
              {t('noCheckinsYet')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Bottom Navigation
const BottomNav = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: "home", icon: Home, label: t('home') },
    { id: "deeds", icon: Sparkles, label: t('goodDeeds') },
    { id: "analysis", icon: Heart, label: t('feelings') },
    { id: "profile", icon: User, label: t('me') }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F0D4E0] flex max-w-md mx-auto" data-testid="bottom-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
          data-testid={`nav-tab-${tab.id}`}
        >
          <tab.icon 
            className="w-6 h-6" 
            strokeWidth={activeTab === tab.id ? 3 : 2}
            style={{ color: activeTab === tab.id ? '#87CEEB' : undefined }}
          />
          <span className="text-xs font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// Main App Content
function AppContent() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [completedDeeds, setCompletedDeeds] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [checkins, setCheckins] = useState([]);

  const fetchUser = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API}/users/${userId}`);
      setUser(response.data);
      return response.data;
    } catch {
      localStorage.removeItem("userId");
      return null;
    }
  }, []);

  const createDemoUser = useCallback(async () => {
    try {
      // Try to get existing demo user first
      const existingUser = await axios.get(`${API}/users/email/demo@thefriend.app`);
      localStorage.setItem("userId", existingUser.data.id);
      return existingUser.data;
    } catch {
      // Create new demo user
      try {
        const response = await axios.post(`${API}/users`, {
          name: "Demo",
          age: 10,
          gender: "other",
          email: "demo@thefriend.app"
        });
        localStorage.setItem("userId", response.data.id);
        return response.data;
      } catch (error) {
        console.error("Error creating demo user:", error);
        return null;
      }
    }
  }, []);

  const fetchTodayCheckin = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API}/checkins/${userId}/today`);
      setTodayCheckin(response.data);
    } catch (error) {
      console.error("Error fetching today's checkin:", error);
    }
  }, []);

  const fetchCompletedDeeds = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API}/deeds/${userId}`);
      setCompletedDeeds(response.data);
    } catch (error) {
      console.error("Error fetching completed deeds:", error);
    }
  }, []);

  const fetchAnalysis = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API}/analysis/${userId}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    }
  }, []);

  const fetchCheckins = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${API}/checkins/${userId}`);
      setCheckins(response.data);
    } catch (error) {
      console.error("Error fetching checkins:", error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      let storedUserId = localStorage.getItem("userId");
      let userData = null;
      
      if (storedUserId) {
        userData = await fetchUser(storedUserId);
      }
      
      // Auto-create demo user if no user exists (skip registration)
      if (!userData) {
        userData = await createDemoUser();
        if (userData) {
          setUser(userData);
        }
      }
      
      if (userData) {
        await Promise.all([
          fetchTodayCheckin(userData.id),
          fetchCompletedDeeds(userData.id),
          fetchAnalysis(userData.id),
          fetchCheckins(userData.id)
        ]);
      }
      setLoading(false);
    };
    init();
  }, [fetchUser, createDemoUser, fetchTodayCheckin, fetchCompletedDeeds, fetchAnalysis, fetchCheckins]);

  const refreshData = async () => {
    if (user) {
      await Promise.all([
        fetchTodayCheckin(user.id),
        fetchCompletedDeeds(user.id),
        fetchAnalysis(user.id),
        fetchCheckins(user.id)
      ]);
    }
  };

  const refreshUser = async () => {
    if (user) {
      await fetchUser(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AppLogo size={100} />
        </motion.div>
        <h2 className="text-xl font-bold text-[#2B2D42] mt-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          The FRIEND app
        </h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex flex-col items-center justify-center p-6">
        <AppLogo size={100} />
        <h2 className="text-xl font-bold text-[#2B2D42] mt-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F8] max-w-md mx-auto relative">
      {activeTab === "home" && (
        <HomeDashboard 
          user={user}
          onCheckIn={refreshData}
          todayCheckin={todayCheckin}
          refreshUser={refreshUser}
        />
      )}
      {activeTab === "deeds" && (
        <GoodDeedsScreen 
          user={user}
          completedDeeds={completedDeeds}
          onCompleteDeed={refreshData}
        />
      )}
      {activeTab === "analysis" && (
        <AnalysisScreen 
          user={user}
          analysis={analysis}
          checkins={checkins}
        />
      )}
      {activeTab === "profile" && (
        <ProfileScreen 
          user={user}
          onUpdateAvatar={refreshUser}
        />
      )}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// Main App with Language Provider
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
