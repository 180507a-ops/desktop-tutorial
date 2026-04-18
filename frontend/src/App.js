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
  ChevronLeft,
  Star,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Award,
  Globe,
  ChevronDown,
  Lock,
  Flame,
  Gamepad2,
  RotateCcw,
  Trophy
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Logo Component - Hand with Heart
const AppLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFB6C1" />
        <stop offset="100%" stopColor="#FF91A4" />
      </linearGradient>
      <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" />
        <stop offset="100%" stopColor="#5DADE2" />
      </linearGradient>
    </defs>
    <path 
      d="M50 30C50 18 38 8 26 14C14 20 14 38 26 50L50 74L74 50C86 38 86 20 74 14C62 8 50 18 50 30Z" 
      fill="url(#heartGrad)"
    />
    <path 
      d="M30 78C30 78 36 72 46 72H54C64 72 70 78 70 78L74 88C74 88 64 94 50 94C36 94 26 88 26 88L30 78Z" 
      fill="url(#handGrad)"
    />
    <path 
      d="M38 78V68C38 65 41 62 46 62H54C59 62 62 65 62 68V78" 
      fill="url(#handGrad)"
    />
  </svg>
);

// Detailed Avatar SVG Component with 5 face expressions
const DetailedAvatar = ({ face = 0, hair = 0, shirt = 0, pants = 0, size = 150 }) => {
  const hairColors = ['#8B4513', '#FFD700', '#1a1a1a', '#FF91A4', '#9B59B6', '#87CEEB', '#98D8AA', '#FF6B6B'];
  const shirtColors = ['#FFB6C1', '#87CEEB', '#DDA0DD', '#98D8AA', '#FFD700', '#FF6B6B', '#9B59B6', '#5DADE2'];
  const pantsColors = ['#4169E1', '#2B2D42', '#87CEEB', '#DDA0DD', '#FFB6C1', '#98D8AA', '#FFD700', '#FF91A4'];
  
  const hairColor = hairColors[hair] || hairColors[0];
  const shirtColor = shirtColors[shirt] || shirtColors[0];
  const pantsColor = pantsColors[pants] || pantsColors[0];

  // Face expressions: 0=happy smile, 1=big laugh, 2=wink, 3=tongue out, 4=closed eyes smile
  const renderFace = (faceType) => {
    switch(faceType) {
      case 0: // Happy smile - open eyes
        return (
          <>
            {/* Eyes */}
            <ellipse cx="42" cy="42" rx="4" ry="5" fill="#2B2D42"/>
            <ellipse cx="58" cy="42" rx="4" ry="5" fill="#2B2D42"/>
            <circle cx="43" cy="41" r="1.5" fill="white"/>
            <circle cx="59" cy="41" r="1.5" fill="white"/>
            {/* Smile */}
            <path d="M40 52 Q50 62 60 52" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Blush */}
            <ellipse cx="35" cy="50" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
            <ellipse cx="65" cy="50" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
          </>
        );
      case 1: // Big laugh - open mouth
        return (
          <>
            {/* Happy eyes - curved */}
            <path d="M38 42 Q42 38 46 42" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M54 42 Q58 38 62 42" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Big open mouth */}
            <ellipse cx="50" cy="55" rx="10" ry="8" fill="#2B2D42"/>
            <ellipse cx="50" cy="52" rx="8" ry="4" fill="#FF6B6B"/>
            {/* Blush */}
            <ellipse cx="35" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.6"/>
            <ellipse cx="65" cy="48" rx="5" ry="3" fill="#FFB6C1" opacity="0.6"/>
          </>
        );
      case 2: // Wink
        return (
          <>
            {/* Left eye open */}
            <ellipse cx="42" cy="42" rx="4" ry="5" fill="#2B2D42"/>
            <circle cx="43" cy="41" r="1.5" fill="white"/>
            {/* Right eye wink */}
            <path d="M54 43 Q58 40 62 43" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Playful smile */}
            <path d="M42 52 Q50 60 58 52" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Blush */}
            <ellipse cx="35" cy="50" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
            <ellipse cx="65" cy="50" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
          </>
        );
      case 3: // Tongue out
        return (
          <>
            {/* Eyes */}
            <ellipse cx="42" cy="42" rx="4" ry="5" fill="#2B2D42"/>
            <ellipse cx="58" cy="42" rx="4" ry="5" fill="#2B2D42"/>
            <circle cx="43" cy="41" r="1.5" fill="white"/>
            <circle cx="59" cy="41" r="1.5" fill="white"/>
            {/* Smile with tongue */}
            <path d="M40 52 Q50 60 60 52" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <ellipse cx="50" cy="58" rx="5" ry="6" fill="#FF91A4"/>
            {/* Blush */}
            <ellipse cx="35" cy="50" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
            <ellipse cx="65" cy="50" rx="5" ry="3" fill="#FFB6C1" opacity="0.5"/>
          </>
        );
      case 4: // Closed eyes happy
        return (
          <>
            {/* Closed happy eyes */}
            <path d="M38 42 Q42 46 46 42" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M54 42 Q58 46 62 42" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Sweet smile */}
            <path d="M40 52 Q50 62 60 52" stroke="#2B2D42" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Rosy cheeks */}
            <ellipse cx="35" cy="50" rx="6" ry="4" fill="#FFB6C1" opacity="0.6"/>
            <ellipse cx="65" cy="50" rx="6" ry="4" fill="#FFB6C1" opacity="0.6"/>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`shirtGrad-${shirt}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shirtColor} />
          <stop offset="100%" stopColor={shirtColor} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Hair back */}
      <ellipse cx="50" cy="28" rx="28" ry="20" fill={hairColor}/>
      
      {/* Head */}
      <ellipse cx="50" cy="45" rx="25" ry="28" fill="#FFDAB9"/>
      
      {/* Hair front/bangs */}
      <path d={`M25 35 Q30 15 50 12 Q70 15 75 35 Q65 25 50 22 Q35 25 25 35`} fill={hairColor}/>
      
      {/* Face expression */}
      {renderFace(face)}
      
      {/* Neck */}
      <rect x="44" y="70" width="12" height="8" fill="#FFDAB9"/>
      
      {/* Body/Shirt */}
      <path d={`M30 78 Q30 75 40 75 L60 75 Q70 75 70 78 L72 105 Q72 110 65 110 L35 110 Q28 110 28 105 Z`} fill={`url(#shirtGrad-${shirt})`}/>
      
      {/* Shirt collar */}
      <path d="M44 75 L50 82 L56 75" stroke="white" strokeWidth="2" fill="none" opacity="0.5"/>
      
      {/* Arms */}
      <ellipse cx="26" cy="90" rx="6" ry="15" fill={shirtColor}/>
      <ellipse cx="74" cy="90" rx="6" ry="15" fill={shirtColor}/>
      
      {/* Hands */}
      <circle cx="26" cy="105" r="5" fill="#FFDAB9"/>
      <circle cx="74" cy="105" r="5" fill="#FFDAB9"/>
      
      {/* Pants */}
      <path d={`M32 108 L30 135 Q30 140 35 140 L45 140 L48 115 L52 115 L55 140 L65 140 Q70 140 70 135 L68 108 Z`} fill={pantsColor}/>
      
      {/* Shoes */}
      <ellipse cx="40" cy="140" rx="8" ry="4" fill="#2B2D42"/>
      <ellipse cx="60" cy="140" rx="8" ry="4" fill="#2B2D42"/>
    </svg>
  );
};

// Face preview for selection
const FacePreview = ({ faceType, selected, onClick }) => {
  const faces = ['😊', '😄', '😉', '😜', '😌'];
  const labels = ['Happy', 'Laugh', 'Wink', 'Playful', 'Peaceful'];
  
  return (
    <motion.button
      className={`avatar-option flex-col gap-1 ${selected ? 'selected' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-2xl">{faces[faceType]}</span>
      <span className="text-[8px] text-[#6C757D]">{labels[faceType]}</span>
    </motion.button>
  );
};

// Motivational messages after check-in
const MOTIVATION_MESSAGES = [
  { emoji: "🌟", title: "Amazing!", subtitle: "You're doing great today!" },
  { emoji: "💪", title: "So Brave!", subtitle: "Thanks for sharing your feelings!" },
  { emoji: "🎉", title: "Awesome!", subtitle: "Have a wonderful day!" },
  { emoji: "💖", title: "You Rock!", subtitle: "You are loved and special!" },
  { emoji: "🌈", title: "Fantastic!", subtitle: "Keep being awesome!" },
];

// Slideshow images (placeholders)
const SLIDESHOW_IMAGES = [
  { id: 1, placeholder: "😊 Your meme #1 here!", gradient: "from-[#FFB6C1] to-[#DDA0DD]" },
  { id: 2, placeholder: "🎉 Your meme #2 here!", gradient: "from-[#87CEEB] to-[#98D8AA]" },
  { id: 3, placeholder: "⭐ Your meme #3 here!", gradient: "from-[#DDA0DD] to-[#87CEEB]" },
];

// Avatar items with unlock requirements
const AVATAR_ITEMS = {
  face: [
    { id: 0, unlocked: true, cost: 0 },
    { id: 1, unlocked: true, cost: 0 },
    { id: 2, unlocked: true, cost: 0 },
    { id: 3, unlocked: true, cost: 0 },
    { id: 4, unlocked: true, cost: 0 },
  ],
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
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full glass hover:shadow-lg transition-all"
        whileTap={{ scale: 0.95 }}
        data-testid="language-selector-btn"
      >
        <Globe className="w-4 h-4 text-[#87CEEB]" strokeWidth={3} />
        <span className="text-sm font-semibold text-[#2B2D42]">{languageNames[language]}</span>
        <ChevronDown className={`w-4 h-4 text-[#6C757D] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#F0D4E0] overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang}
                onClick={() => { setLanguage(lang); setIsOpen(false); }}
                className={`w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-[#F8E8EE] hover:to-[#E8F4FD] transition-all flex items-center gap-2 ${language === lang ? 'bg-gradient-to-r from-[#F8E8EE] to-[#E8F4FD]' : ''}`}
                whileHover={{ x: 4 }}
                data-testid={`language-option-${lang}`}
              >
                {language === lang && <Check className="w-4 h-4 text-[#98D8AA]" strokeWidth={3} />}
                <span className={`text-sm font-semibold ${language === lang ? 'text-[#87CEEB]' : 'text-[#2B2D42]'}`}>
                  {languageNames[lang]}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Slideshow Component
const Slideshow = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="card">
      <h3 className="font-bold text-[#2B2D42] mb-4 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        <Sparkles className="w-5 h-5 text-[#FFB6C1]" strokeWidth={3} />
        {t('dailySmile')}
      </h3>
      
      <div className="slideshow-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${SLIDESHOW_IMAGES[currentSlide].gradient} flex items-center justify-center`}
          >
            <div className="text-center text-white p-4">
              <div className="text-4xl mb-2">{SLIDESHOW_IMAGES[currentSlide].placeholder.split(' ')[0]}</div>
              <p className="font-semibold opacity-90">{SLIDESHOW_IMAGES[currentSlide].placeholder.slice(2)}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-lg"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDESHOW_IMAGES.length) % SLIDESHOW_IMAGES.length)}
        >
          <ChevronLeft className="w-5 h-5 text-[#2B2D42]" />
        </button>
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-lg"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length)}
        >
          <ChevronRight className="w-5 h-5 text-[#2B2D42]" />
        </button>
      </div>
      
      {/* Dots */}
      <div className="slideshow-dots">
        {SLIDESHOW_IMAGES.map((_, index) => (
          <button
            key={index}
            className={`slideshow-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Motivation Popup Component
const MotivationPopup = ({ show, onClose }) => {
  const [message] = useState(() => 
    MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)]
  );

  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Confetti recycle={false} numberOfPieces={150} colors={['#FFB6C1', '#87CEEB', '#DDA0DD', '#98D8AA', '#FFD700']} />
          <motion.div 
            className="motivation-popup max-w-xs"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div 
              className="text-7xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              {message.emoji}
            </motion.div>
            <h2 className="text-2xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {message.title}
            </h2>
            <p className="text-[#6C757D]">{message.subtitle}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [showMotivation, setShowMotivation] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setShowCheckin(false);
      setShowMotivation(true);
      setStep(0);
      setMoodSelected(null);
      setIsBothered(null);
      setIsSad(null);
      onCheckIn();
      refreshUser();
    } catch (error) {
      console.error("Check-in error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 pb-28 safe-bottom">
      <MotivationPopup show={showMotivation} onClose={() => setShowMotivation(false)} />
      
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <AppLogo size={50} />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {t('hi')}, {user.name}!
            </h1>
            <p className="text-[#6C757D] text-sm">{t('howAreYouToday')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <motion.div 
            className="streak-badge" 
            data-testid="streak-badge"
            whileHover={{ scale: 1.05 }}
          >
            <Flame className="w-5 h-5" />
            <span>{user.current_streak}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Points Display */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="points-badge text-lg px-6 py-2">
          <Star className="w-5 h-5" />
          <span>{user.total_checkins * 10} {t('points')}</span>
        </div>
      </motion.div>

      {/* Daily Check-in Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!todayCheckin?.checked_in ? (
          <motion.div 
            className="card card-interactive mb-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCheckin(true)}
            data-testid="daily-checkin-card"
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#87CEEB] flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-white" strokeWidth={3} />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-[#2B2D42] text-lg" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {t('dailyCheckin')}
                </h3>
                <p className="text-[#6C757D]">{t('tellMeHowYouFeel')}</p>
              </div>
              <ChevronRight className="text-[#FFB6C1] w-6 h-6" />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="card mb-6"
            style={{ borderColor: '#98D8AA', borderWidth: '2px' }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#98D8AA] to-[#87CEEB] flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-bold text-[#2B2D42] text-lg" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {t('alreadyCheckedIn')} {todayCheckin.checkin?.mood_emoji}
                </h3>
                <p className="text-[#6C757D]">{t('comeBackTomorrow')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Supportive Message */}
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        data-testid="supportive-message-card"
      >
        <div className="flex items-start gap-4">
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <AppLogo size={48} />
          </motion.div>
          <p className="text-[#2B2D42] font-semibold leading-relaxed flex-1">
            {supportiveMessage}
          </p>
        </div>
      </motion.div>

      {/* Slideshow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Slideshow />
      </motion.div>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckin && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCheckin(false)}
          >
            <motion.div 
              className="bg-white w-full rounded-t-[2.5rem] p-6 pb-10 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      s <= step ? 'w-8 bg-gradient-to-r from-[#FFB6C1] to-[#87CEEB]' : 'w-4 bg-[#F0D4E0]'
                    }`}
                  />
                ))}
              </div>

              {step === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {t('howAreYouFeeling')}
                  </h2>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {MOOD_OPTIONS.map((mood) => (
                      <motion.button
                        key={mood.score}
                        className={`emoji-btn ${moodSelected?.score === mood.score ? "selected" : ""}`}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
                        onClick={() => handleMoodSelect(mood)}
                        data-testid={`mood-option-${mood.score}`}
                      >
                        {mood.emoji}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-[#6C757D] px-4">
                    <span>{t('verySad')}</span>
                    <span>{t('amazing')}</span>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {t('isAnyoneBothering')}
                  </h2>
                  <div className="flex justify-center gap-4">
                    <motion.button 
                      className={`toggle-btn ${isBothered === true ? "yes" : ""}`}
                      onClick={() => { setIsBothered(true); setStep(2); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="bothered-yes-btn"
                    >
                      {t('yes')} 😔
                    </motion.button>
                    <motion.button 
                      className={`toggle-btn ${isBothered === false ? "no" : ""}`}
                      onClick={() => { setIsBothered(false); setStep(2); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="bothered-no-btn"
                    >
                      {t('no')} 😊
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-2xl font-bold text-center text-[#2B2D42] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {t('didYouFeelSad')}
                  </h2>
                  <div className="flex justify-center gap-4 mb-6">
                    <motion.button 
                      className={`toggle-btn ${isSad === true ? "yes" : ""}`}
                      onClick={() => setIsSad(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="sad-yes-btn"
                    >
                      {t('yes')} 😢
                    </motion.button>
                    <motion.button 
                      className={`toggle-btn ${isSad === false ? "no" : ""}`}
                      onClick={() => setIsSad(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid="sad-no-btn"
                    >
                      {t('no')} 😄
                    </motion.button>
                  </div>
                  {isSad !== null && (
                    <motion.button
                      className="btn-primary w-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleSubmitCheckin}
                      disabled={loading}
                      data-testid="submit-checkin-btn"
                    >
                      {loading ? t('saving') : `${t('done')} 🎉`}
                    </motion.button>
                  )}
                </motion.div>
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
    <div className="p-6 pb-28 safe-bottom">
      {showCelebration && <Confetti recycle={false} numberOfPieces={150} colors={['#FFB6C1', '#87CEEB', '#DDA0DD', '#98D8AA']} />}
      
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#87CEEB] flex items-center justify-center shadow-lg">
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
      </motion.div>

      {/* Counter */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-r from-[#98D8AA] to-[#87CEEB] px-8 py-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <Trophy className="w-8 h-8 text-white" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{completedDeeds.length}</div>
            <div className="text-xs text-white/80">{t('goodDeedsCompleted')}</div>
          </div>
        </div>
      </motion.div>

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
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
              isCompleted(deed.id) 
                ? "bg-gradient-to-br from-[#98D8AA] to-[#87CEEB]" 
                : "bg-gradient-to-br from-[#F8E8EE] to-[#E8F4FD]"
            }`}>
              {isCompleted(deed.id) ? (
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              ) : (
                <Star className="w-6 h-6 text-[#FFB6C1]" strokeWidth={3} />
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
              className="motivation-popup max-w-xs"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
              >
                ⭐
              </motion.div>
              <h2 className="text-2xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('amazingCelebration')} 🎉
              </h2>
              <p className="text-[#6C757D]">
                {t('youCompleted')} {celebratedDeed.title}
              </p>
              <p className="text-[#FFB6C1] font-bold mt-2 text-xl">+{celebratedDeed.points} {t('points')}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Memory Game
const MEMORY_CARDS = ['🌸', '🦋', '🌈', '⭐', '🎀', '💖', '🐱', '🌺'];

const MemoryGame = () => {
  const { t } = useLanguage();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const initializeGame = useCallback(() => {
    const shuffled = [...MEMORY_CARDS, ...MEMORY_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setShowCelebration(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (cardId) => {
    if (flipped.length === 2) return;
    if (flipped.includes(cardId)) return;
    if (matched.includes(cardId)) return;

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === cards.length) {
          setGameWon(true);
          setShowCelebration(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const isCardFlipped = (cardId) => flipped.includes(cardId) || matched.includes(cardId);

  return (
    <div className="p-6 pb-28 safe-bottom">
      {showCelebration && <Confetti recycle={false} numberOfPieces={200} colors={['#FFB6C1', '#87CEEB', '#DDA0DD', '#98D8AA']} />}
      
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DDA0DD] to-[#87CEEB] flex items-center justify-center shadow-lg">
            <Gamepad2 className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {t('memoryGame')}
            </h1>
            <p className="text-[#6C757D] text-sm">{t('findThePairs')}</p>
          </div>
        </div>
        <LanguageSelector />
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="flex justify-center gap-4 mb-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="card py-3 px-6 text-center">
          <div className="text-2xl font-bold text-[#FF91A4]">{moves}</div>
          <div className="text-xs text-[#6C757D]">{t('moves')}</div>
        </div>
        <div className="card py-3 px-6 text-center">
          <div className="text-2xl font-bold text-[#87CEEB]">{matched.length / 2}/{MEMORY_CARDS.length}</div>
          <div className="text-xs text-[#6C757D]">{t('pairs')}</div>
        </div>
      </motion.div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {cards.map((card) => (
          <motion.button
            key={card.id}
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-md ${
              isCardFlipped(card.id) 
                ? matched.includes(card.id)
                  ? 'bg-gradient-to-br from-[#98D8AA] to-[#87CEEB]'
                  : 'bg-gradient-to-br from-[#FFB6C1] to-[#87CEEB]'
                : 'bg-gradient-to-br from-[#F8E8EE] to-[#E8F4FD]'
            }`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid={`memory-card-${card.id}`}
          >
            <AnimatePresence mode="wait">
              {isCardFlipped(card.id) ? (
                <motion.span
                  key="emoji"
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {card.emoji}
                </motion.span>
              ) : (
                <motion.span 
                  key="question"
                  className="text-[#FFB6C1] text-2xl font-bold"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <motion.button
        className="btn-secondary w-full flex items-center justify-center gap-2"
        onClick={initializeGame}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="play-again-btn"
      >
        <RotateCcw className="w-5 h-5" />
        {t('playAgain')}
      </motion.button>

      {/* Win Modal */}
      <AnimatePresence>
        {gameWon && (
          <motion.div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="motivation-popup max-w-xs"
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div 
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('youWon')}
              </h2>
              <p className="text-[#6C757D] mb-2">{t('congratsMemory')}</p>
              <p className="text-[#87CEEB] font-bold text-lg">{moves} {t('moves')}</p>
              <motion.button
                className="btn-primary mt-4"
                onClick={initializeGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('playAgain')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile Screen with Detailed Avatar
const ProfileScreen = ({ user, onUpdateAvatar }) => {
  const { t } = useLanguage();
  const [avatarFace, setAvatarFace] = useState(user.avatar_face || 0);
  const [avatarHair, setAvatarHair] = useState(user.avatar_hair || 0);
  const [avatarShirt, setAvatarShirt] = useState(user.avatar_clothes || 0);
  const [avatarPants, setAvatarPants] = useState(0);
  const [saving, setSaving] = useState(false);
  
  const userPoints = user.total_checkins * 10;

  const isItemUnlocked = (category, id) => {
    const item = AVATAR_ITEMS[category]?.find(i => i.id === id);
    return item?.unlocked || (item?.cost && userPoints >= item.cost);
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

  return (
    <div className="p-6 pb-28 safe-bottom">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-[#2B2D42] flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <User className="w-6 h-6 text-[#87CEEB]" strokeWidth={3} />
          {t('yourProfile')}
        </h1>
        <LanguageSelector />
      </motion.div>

      {/* Avatar Preview */}
      <motion.div 
        className="card mb-6 flex flex-col items-center py-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <DetailedAvatar 
            face={avatarFace}
            hair={avatarHair}
            shirt={avatarShirt}
            pants={avatarPants}
            size={120}
          />
        </motion.div>
        <h2 className="text-xl font-bold text-[#2B2D42] mt-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {user.name}
        </h2>
        <div className="points-badge mt-2">
          <Star className="w-4 h-4" />
          <span>{userPoints} {t('points')}</span>
        </div>
      </motion.div>

      {/* Face Selection */}
      <motion.div 
        className="card mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickYourFace')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_ITEMS.face.map((item) => (
            <FacePreview
              key={item.id}
              faceType={item.id}
              selected={avatarFace === item.id}
              onClick={() => setAvatarFace(item.id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Hair Selection */}
      <motion.div 
        className="card mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickHairColor')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_ITEMS.hair.map((item) => {
            const unlocked = isItemUnlocked('hair', item.id);
            return (
              <motion.button
                key={item.id}
                className={`avatar-option ${avatarHair === item.id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                style={{ backgroundColor: item.color }}
                onClick={() => unlocked && setAvatarHair(item.id)}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                data-testid={`hair-option-${item.id}`}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Shirt Selection */}
      <motion.div 
        className="card mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickClothesColor')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_ITEMS.shirt.map((item) => {
            const unlocked = isItemUnlocked('shirt', item.id);
            return (
              <motion.button
                key={item.id}
                className={`avatar-option ${avatarShirt === item.id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                style={{ backgroundColor: item.color }}
                onClick={() => unlocked && setAvatarShirt(item.id)}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                data-testid={`shirt-option-${item.id}`}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Pants Selection */}
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-bold text-[#2B2D42] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('pickPantsColor')}
        </h3>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_ITEMS.pants.map((item) => {
            const unlocked = isItemUnlocked('pants', item.id);
            return (
              <motion.button
                key={item.id}
                className={`avatar-option ${avatarPants === item.id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                style={{ backgroundColor: item.color }}
                onClick={() => unlocked && setAvatarPants(item.id)}
                whileTap={unlocked ? { scale: 0.95 } : {}}
                data-testid={`pants-option-${item.id}`}
              />
            );
          })}
        </div>
        <p className="text-xs text-[#6C757D] mt-3 flex items-center gap-1">
          <Lock className="w-3 h-3" /> {t('lockedItemsHint')}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-bold text-[#2B2D42] mb-4 flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Award className="w-5 h-5 text-[#FFB6C1]" strokeWidth={3} />
          {t('yourStats')}
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="card py-3">
            <div className="text-2xl font-bold text-[#FF91A4]">{user.current_streak}</div>
            <div className="text-xs text-[#6C757D]">{t('currentStreak')}</div>
          </div>
          <div className="card py-3">
            <div className="text-2xl font-bold text-[#87CEEB]">{user.longest_streak}</div>
            <div className="text-xs text-[#6C757D]">{t('longestStreak')}</div>
          </div>
          <div className="card py-3">
            <div className="text-2xl font-bold text-[#98D8AA]">{user.total_checkins}</div>
            <div className="text-xs text-[#6C757D]">{t('totalCheckins')}</div>
          </div>
        </div>
      </motion.div>

      <motion.button 
        className="btn-primary w-full"
        onClick={handleSave}
        disabled={saving}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="save-avatar-btn"
      >
        {saving ? t('loading') : t('saveChanges')}
      </motion.button>
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
    <div className="p-6 pb-28 safe-bottom">
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-[#2B2D42] flex items-center gap-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          <Heart className="w-6 h-6 text-[#FFB6C1]" strokeWidth={3} />
          {t('howYoureDoing')}
        </h1>
        <LanguageSelector />
      </motion.div>

      {/* Overall Score */}
      <motion.div 
        className="card mb-6 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          {getTrendIcon()}
          <span className="text-lg font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {getTrendLabel()}
          </span>
        </div>
        <motion.div 
          className="text-6xl font-bold bg-gradient-to-r from-[#FFB6C1] via-[#87CEEB] to-[#98D8AA] bg-clip-text text-transparent mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          data-testid="overall-score"
        >
          {analysis?.overall_score || 0}/5
        </motion.div>
        <p className="text-[#6C757D]">
          {analysis?.positive_days || 0} {t('outOf')} {analysis?.total_days || 0} {t('daysWereGreat')}
        </p>
      </motion.div>

      {/* Alerts */}
      {analysis?.alerts?.length > 0 && (
        <motion.div 
          className="card mb-6"
          style={{ borderColor: '#FF91A4', borderWidth: '2px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-[#FF91A4] flex-shrink-0" strokeWidth={3} />
            <div>
              <h3 className="font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {t('friendlyReminder')}
              </h3>
              <p className="text-[#6C757D] text-sm">{t('reminderText')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Check-ins */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-bold text-[#2B2D42] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          {t('recentFeelings')}
        </h3>
        <div className="space-y-4">
          {checkins?.slice(0, 7).map((checkin, i) => (
            <motion.div 
              key={checkin.id} 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-3xl">{checkin.mood_emoji}</span>
              <div className="flex-1">
                <div className="progress-bar">
                  <motion.div 
                    className="progress-bar-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(checkin.mood_score / 5) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                </div>
              </div>
              <span className="text-xs text-[#6C757D] font-medium">
                {new Date(checkin.date).toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            </motion.div>
          ))}
          {(!checkins || checkins.length === 0) && (
            <p className="text-center text-[#6C757D] py-4">{t('noCheckinsYet')}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Bottom Navigation
const BottomNav = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: "home", icon: Home, label: t('home') },
    { id: "deeds", icon: Sparkles, label: t('goodDeeds') },
    { id: "games", icon: Gamepad2, label: t('miniGames') },
    { id: "analysis", icon: Heart, label: t('feelings') },
    { id: "profile", icon: User, label: t('me') }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#F0D4E0] flex max-w-md mx-auto shadow-2xl" data-testid="bottom-navigation">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
          whileTap={{ scale: 0.9 }}
          data-testid={`nav-tab-${tab.id}`}
        >
          <motion.div
            animate={activeTab === tab.id ? { y: -2 } : { y: 0 }}
          >
            <tab.icon 
              className="w-5 h-5" 
              strokeWidth={activeTab === tab.id ? 3 : 2}
            />
          </motion.div>
          <span className="text-[10px] font-semibold">{tab.label}</span>
        </motion.button>
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

  const createDemoUser = useCallback(async () => {
    try {
      const existingUser = await axios.get(`${API}/users/email/demo@thefriend.app`);
      localStorage.setItem("userId", existingUser.data.id);
      return existingUser.data;
    } catch {
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <AppLogo size={100} />
        </motion.div>
        <motion.h2 
          className="text-xl font-bold text-[#2B2D42] mt-4"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          The FRIEND app
        </motion.h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <AppLogo size={100} />
        <h2 className="text-xl font-bold text-[#2B2D42] mt-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto relative">
      <AnimatePresence mode="wait">
        {activeTab === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeDashboard 
              user={user}
              onCheckIn={refreshData}
              todayCheckin={todayCheckin}
              refreshUser={refreshUser}
            />
          </motion.div>
        )}
        {activeTab === "deeds" && (
          <motion.div key="deeds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GoodDeedsScreen 
              user={user}
              completedDeeds={completedDeeds}
              onCompleteDeed={refreshData}
            />
          </motion.div>
        )}
        {activeTab === "games" && (
          <motion.div key="games" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MemoryGame />
          </motion.div>
        )}
        {activeTab === "analysis" && (
          <motion.div key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalysisScreen 
              user={user}
              analysis={analysis}
              checkins={checkins}
            />
          </motion.div>
        )}
        {activeTab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfileScreen 
              user={user}
              onUpdateAvatar={refreshUser}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// Main App
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
