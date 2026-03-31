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
  ChevronDown
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Design Assets from guidelines
const ASSETS = {
  mascot: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/a7e6c1ecac09cc5261306e2177d71a467786b7530823b768a025b5aa543e89ba.png",
  streakBadge: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/4478c691c14f8311db5d44bb6372ed09849671be4ac968fc1616f184a6647028.png",
  meme: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/20e048668d5d9dbf26765ed57e33180b76dc56b52dac829cce5b065a5257e5df.png",
  goodDeedStar: "https://static.prod-images.emergentagent.com/jobs/bb226fb4-4779-4934-af23-4313df1205b3/images/598c2fc244c235ebbdc654568179842693dd702c40ae76754656dbda06f19fd0.png"
};

// Avatar options
const FACES = ["😊", "😎", "🤗", "😄", "🥳", "😇"];
const HAIR_COLORS = ["#8B4513", "#FFD700", "#1a1a1a", "#FF6B6B", "#9B59B6", "#3498DB"];
const CLOTHES_COLORS = ["#FFD166", "#118AB2", "#F78C6B", "#06D6A0", "#9B59B6", "#FF6B6B"];

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
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border-2 border-[#E2E8F0] hover:border-[#118AB2] transition-all"
        data-testid="language-selector-btn"
      >
        <Globe className="w-4 h-4 text-[#118AB2]" strokeWidth={3} />
        <span className="text-sm font-semibold text-[#2B2D42]">{languageNames[language]}</span>
        <ChevronDown className={`w-4 h-4 text-[#6C757D] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-lg border border-[#E2E8F0] overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setIsOpen(false); }}
                className={`w-full px-4 py-3 text-left hover:bg-[#F0F7FF] transition-colors flex items-center gap-2 ${language === lang ? 'bg-[#F0F7FF]' : ''}`}
                data-testid={`language-option-${lang}`}
              >
                {language === lang && <Check className="w-4 h-4 text-[#06D6A0]" strokeWidth={3} />}
                <span className={`text-sm font-semibold ${language === lang ? 'text-[#118AB2]' : 'text-[#2B2D42]'}`}>
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

// Registration Screen
const RegistrationScreen = ({ onRegister }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", age: "", gender: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.age || form.age < 5 || form.age > 18) newErrors.age = true;
    if (!form.gender) newErrors.gender = true;
    if (!form.email.includes("@")) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/users`, {
        ...form,
        age: parseInt(form.age)
      });
      localStorage.setItem("userId", response.data.id);
      onRegister(response.data);
    } catch (error) {
      if (error.response?.data?.detail === "Email already registered") {
        try {
          const existingUser = await axios.get(`${API}/users/email/${form.email}`);
          localStorage.setItem("userId", existingUser.data.id);
          onRegister(existingUser.data);
        } catch {
          setErrors({ email: true });
        }
      } else {
        setErrors({ email: true });
      }
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#FFFDF5] p-6 flex flex-col items-center"
    >
      {/* Language Selector at top */}
      <div className="w-full max-w-sm flex justify-end mb-4">
        <LanguageSelector />
      </div>

      <motion.img 
        src={ASSETS.mascot} 
        alt="FRIEND Mascot"
        className="w-32 h-32 mb-4"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <h1 className="text-3xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        {t('welcome')}
      </h1>
      <p className="text-[#6C757D] mb-8 text-center">
        {t('letsGetToKnow')}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <input
            type="text"
            placeholder={t('whatsYourName')}
            className={`input-field ${errors.name ? 'ring-2 ring-[#F78C6B]' : ''}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            data-testid="registration-name-input"
          />
        </div>

        <div>
          <input
            type="number"
            placeholder={t('howOldAreYou')}
            className={`input-field ${errors.age ? 'ring-2 ring-[#F78C6B]' : ''}`}
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            data-testid="registration-age-input"
          />
        </div>

        <div>
          <div className="flex gap-3">
            {[{ key: "boy", label: t('boy') }, { key: "girl", label: t('girl') }, { key: "other", label: t('other') }].map((g) => (
              <button
                key={g.key}
                type="button"
                className={`toggle-btn flex-1 ${form.gender === g.key ? "yes" : ""}`}
                onClick={() => setForm({ ...form, gender: g.key })}
                data-testid={`registration-gender-${g.key}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            type="email"
            placeholder={t('parentsEmail')}
            className={`input-field ${errors.email ? 'ring-2 ring-[#F78C6B]' : ''}`}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            data-testid="registration-email-input"
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full mt-6"
          disabled={loading}
          data-testid="registration-submit-btn"
        >
          {loading ? t('loading') : t('letsGo')}
        </button>
      </form>
    </motion.div>
  );
};

// Home Dashboard
const HomeDashboard = ({ user, onCheckIn, todayCheckin, refreshUser }) => {
  const { t, language } = useLanguage();
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
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {t('hi')}, {user.name}!
          </h1>
          <p className="text-[#6C757D]">{t('howAreYouToday')}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <div className="streak-badge" data-testid="streak-badge">
            <img src={ASSETS.streakBadge} alt="Streak" className="w-6 h-6" />
            <span>{user.current_streak}</span>
          </div>
        </div>
      </div>

      {/* Daily Check-in Card */}
      {!todayCheckin?.checked_in ? (
        <motion.div 
          className="card mb-6 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowCheckin(true)}
          data-testid="daily-checkin-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FFD166] flex items-center justify-center">
              <Heart className="w-7 h-7 text-[#2B2D42]" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('dailyCheckin')}
              </h3>
              <p className="text-[#6C757D] text-sm">{t('tellMeHowYouFeel')}</p>
            </div>
            <ChevronRight className="text-[#6C757D]" />
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="card mb-6 border-2 border-[#06D6A0]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#06D6A0] flex items-center justify-center">
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
        className="card mb-6 bg-gradient-to-r from-[#F0F7FF] to-[#FFFDF5]"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        data-testid="supportive-message-card"
      >
        <div className="flex items-start gap-4">
          <img src={ASSETS.mascot} alt="Mascot" className="w-12 h-12" />
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
          <ImageIcon className="inline w-5 h-5 mr-2" strokeWidth={3} />
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
      {showCelebration && <Confetti recycle={false} numberOfPieces={150} />}
      
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={ASSETS.goodDeedStar} alt="Star" className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {t('doGoodThings')}
            </h1>
            <p className="text-[#6C757D]">{t('pickOneToBrighten')}</p>
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
              isCompleted(deed.id) ? "bg-[#06D6A0]" : "bg-[#F0F7FF]"
            }`}>
              {isCompleted(deed.id) ? (
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              ) : (
                <Star className="w-5 h-5 text-[#FFD166]" strokeWidth={3} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {deed.title}
              </h3>
              <p className="text-[#6C757D] text-sm">{deed.description}</p>
            </div>
            <div className="text-[#FFD166] font-bold text-sm">
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
              className="bg-white rounded-3xl p-8 text-center max-w-xs"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.img 
                src={ASSETS.goodDeedStar}
                alt="Star"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              />
              <h2 className="text-2xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('amazingCelebration')} 🎉
              </h2>
              <p className="text-[#6C757D]">
                {t('youCompleted')} {celebratedDeed.title}
              </p>
              <p className="text-[#FFD166] font-bold mt-2">+{celebratedDeed.points} {t('points')}</p>
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
  const [avatarFace, setAvatarFace] = useState(user.avatar_face || 0);
  const [avatarHair, setAvatarHair] = useState(user.avatar_hair || 0);
  const [avatarClothes, setAvatarClothes] = useState(user.avatar_clothes || 0);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/users/${user.id}/avatar`, {
        avatar_face: avatarFace,
        avatar_hair: avatarHair,
        avatar_clothes: avatarClothes
      });
      onUpdateAvatar();
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
    setSaving(false);
  };

  return (
    <div className="p-6 pb-24">
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <User className="inline w-6 h-6 mr-2" strokeWidth={3} />
          {t('yourProfile')}
        </h1>
        <LanguageSelector />
      </div>

      {/* Avatar Preview */}
      <motion.div 
        className="card mb-6 flex flex-col items-center py-8"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div 
          className="w-32 h-32 rounded-full flex items-center justify-center text-6xl mb-4"
          style={{ 
            backgroundColor: CLOTHES_COLORS[avatarClothes],
            border: `4px solid ${HAIR_COLORS[avatarHair]}`
          }}
          data-testid="avatar-preview"
        >
          {FACES[avatarFace]}
        </div>
        <h2 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {user.name}
        </h2>
        <p className="text-[#6C757D]">{user.age} {t('yearsOld')}</p>
      </motion.div>

      {/* Face Selection */}
      <div className="card mb-4">
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickYourFace')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {FACES.map((face, i) => (
            <button
              key={i}
              className={`avatar-option text-2xl ${avatarFace === i ? "selected" : ""}`}
              onClick={() => setAvatarFace(i)}
              data-testid={`face-option-${i}`}
            >
              {face}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color Selection */}
      <div className="card mb-4">
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickHairColor')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {HAIR_COLORS.map((color, i) => (
            <button
              key={i}
              className={`avatar-option ${avatarHair === i ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => setAvatarHair(i)}
              data-testid={`hair-option-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Clothes Color Selection */}
      <div className="card mb-6">
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickClothesColor')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {CLOTHES_COLORS.map((color, i) => (
            <button
              key={i}
              className={`avatar-option ${avatarClothes === i ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => setAvatarClothes(i)}
              data-testid={`clothes-option-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="card mb-6">
        <h3 className="font-bold text-[#2B2D42] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Award className="inline w-5 h-5 mr-2" strokeWidth={3} />
          {t('yourStats')}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#FFD166]">{user.current_streak}</div>
            <div className="text-xs text-[#6C757D]">{t('currentStreak')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#118AB2]">{user.longest_streak}</div>
            <div className="text-xs text-[#6C757D]">{t('longestStreak')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#06D6A0]">{user.total_checkins}</div>
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
      case "improving": return <Smile className="w-6 h-6 text-[#06D6A0]" strokeWidth={3} />;
      case "needs_attention": return <Frown className="w-6 h-6 text-[#F78C6B]" strokeWidth={3} />;
      default: return <Meh className="w-6 h-6 text-[#FFD166]" strokeWidth={3} />;
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
        <h1 className="text-2xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Sparkles className="inline w-6 h-6 mr-2" strokeWidth={3} />
          {t('howYoureDoing')}
        </h1>
        <LanguageSelector />
      </div>

      {/* Overall Score */}
      <motion.div 
        className="card mb-6 text-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          {getTrendIcon()}
          <span className="text-lg font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {getTrendLabel()}
          </span>
        </div>
        <div className="text-5xl font-bold text-[#118AB2] mb-2" data-testid="overall-score">
          {analysis?.overall_score || 0}/5
        </div>
        <p className="text-[#6C757D] text-sm">
          {analysis?.positive_days || 0} {t('outOf')} {analysis?.total_days || 0} {t('daysWereGreat')}
        </p>
      </motion.div>

      {/* Alerts */}
      {analysis?.alerts?.length > 0 && (
        <motion.div 
          className="card mb-6 border-2 border-[#F78C6B]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#F78C6B] flex-shrink-0" strokeWidth={3} />
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] flex max-w-md mx-auto" data-testid="bottom-navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
          data-testid={`nav-tab-${tab.id}`}
        >
          <tab.icon className="w-6 h-6" strokeWidth={activeTab === tab.id ? 3 : 2} />
          <span className="text-xs font-semibold">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// Main App Content
function AppContent() {
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
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        const userData = await fetchUser(storedUserId);
        if (userData) {
          await Promise.all([
            fetchTodayCheckin(storedUserId),
            fetchCompletedDeeds(storedUserId),
            fetchAnalysis(storedUserId),
            fetchCheckins(storedUserId)
          ]);
        }
      }
      setLoading(false);
    };
    init();
  }, [fetchUser, fetchTodayCheckin, fetchCompletedDeeds, fetchAnalysis, fetchCheckins]);

  const handleRegister = async (userData) => {
    setUser(userData);
    setTodayCheckin({ checked_in: false });
  };

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
      <div className="min-h-screen bg-[#FFFDF5] flex items-center justify-center">
        <motion.img 
          src={ASSETS.mascot}
          alt="Loading"
          className="w-24 h-24"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    );
  }

  if (!user) {
    return <RegistrationScreen onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] max-w-md mx-auto relative">
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
