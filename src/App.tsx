import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Video, 
  Image as ImageIcon, 
  ChevronRight,
  Target,
  Circle,
  Square,
  Hash,
  X,
  Maximize2,
  Activity,
  Compass,
  Layers,
  Cpu,
  Zap,
  Globe,
  Terminal,
  MousePointer2,
  Code2,
  Brush,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { DATA } from './constants';
import { Work } from './types';

// Text Scramble Effect Hook
const useTextScramble = (text: string, trigger: boolean) => {
  const [displayValue, setDisplayValue] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    if (!trigger) {
      setDisplayValue(text);
      return;
    };
    
    let frame = 0;
    const maxFrames = 10;
    const interval = setInterval(() => {
      const scrambled = text.split('').map((char, i) => {
        if (char === ' ') return char;
        if (frame > (maxFrames / text.length) * i) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      
      setDisplayValue(scrambled);
      frame++;
      
      if (frame >= maxFrames) {
        setDisplayValue(text);
        clearInterval(interval);
      }
    }, 40);
    
    return () => clearInterval(interval);
  }, [trigger, text]);
  
  return displayValue;
};

// Custom Scroll Progress Indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  return (
    <div className="fixed bottom-0 left-0 w-full h-1 z-[60] bg-klein-blue/5 border-t border-klein-blue/10">
      <motion.div 
        className="h-full bg-klein-blue origin-left flex items-center justify-end" 
        style={{ scaleX }}
      >
        <div className="w-1 h-3 bg-sacred-gold -mr-0.5" />
      </motion.div>
      <div className="absolute bottom-4 right-6 text-[8px] font-mono text-klein-blue/40 flex items-center gap-2">
        <Cpu size={10} className="animate-pulse" />
        PROCESSED_BUFFER: {(scrollYProgress.get() * 100).toFixed(0)}%
      </div>
    </div>
  );
};

// Custom Cursor Component
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[100]">
      <motion.div 
        className="absolute w-8 h-8 border border-klein-blue/40 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        animate={{ 
          x: mousePos.x, 
          y: mousePos.y,
          scale: isPointer ? 1.5 : 1,
          rotate: isPointer ? 90 : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 150, mass: 0.5 }}
      >
        <div className="w-[1px] h-3 bg-klein-blue/60 absolute -top-1" />
        <div className="w-[1px] h-3 bg-klein-blue/60 absolute -bottom-1" />
        <div className="w-3 h-[1px] bg-klein-blue/60 absolute -left-1" />
        <div className="w-3 h-[1px] bg-klein-blue/60 absolute -right-1" />
      </motion.div>
      <motion.div 
        className="absolute w-1 h-1 bg-sacred-gold rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
      />
    </div>
  );
};

// Work Card Component with Detail Overlay
const WorkCard = ({ work }: { work: Work }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]));
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const titleScrambled = useTextScramble(work.title, isHovered);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative bg-white border border-klein-blue/10 overflow-hidden cursor-pointer h-full flex flex-col perspective-1000 preserve-3d"
        onClick={() => setShowDetail(true)}
      >
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          <motion.img 
            src={work.thumbnail} 
            alt={work.title}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            className="w-full h-full object-cover grayscale-[0.2] transition-all"
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-klein-blue/60 backdrop-blur-[2px] p-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <div className="text-[10px] font-mono text-white/80 space-y-1">
                    <div className="flex items-center gap-2"><Activity size={10} /> DATA_STREAM: ACTIVE</div>
                    <div className="flex items-center gap-2"><Maximize2 size={10} /> RES: 4K_NATIVE</div>
                    <div className="flex items-center gap-2"><Compass size={10} /> LAT: 23.1291°</div>
                  </div>
                  <div className="p-1 border border-white/20">
                    <Zap size={12} className="text-sacred-gold animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-klein-blue shadow-lg"
                  >
                    {work.category === 'video' ? <Video size={20} /> : work.category === 'digital' ? <Globe size={20} /> : <ImageIcon size={20} />}
                  </motion.div>
                </div>
                <div className="text-[10px] font-mono text-white/60 text-right uppercase tracking-[0.2em] animate-pulse">
                  Accessing Data →
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 border border-klein-blue/10 text-[8px] font-mono text-klein-blue">
            ID_{work.id.toUpperCase()}
          </div>
        </div>
        
        <div className="p-6 flex-1 flex flex-col relative z-10">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] font-mono text-sacred-gold font-bold">{work.typeEn}</span>
             <span className="text-[10px] font-mono text-klein-blue/30">/</span>
             <span className="text-[10px] font-display text-klein-blue font-medium">{work.type}</span>
          </div>
          <h3 className="text-xl font-display font-bold text-klein-blue mb-1 h-7">
            {isHovered ? titleScrambled : work.title}
          </h3>
          <p className="text-xs font-serif text-sacred-gold/80 italic mb-4">{work.titleEn}</p>
          
          <div className="mt-auto space-y-2 pt-4 border-t border-dotted border-klein-blue/20">
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{work.description}</p>
          </div>
        </div>

        {/* Decorative corner markers */}
        <div className="absolute top-0 right-0 w-4 h-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-[1px] h-full bg-klein-blue/20" />
          <div className="absolute top-0 right-0 w-full h-[1px] bg-klein-blue/20" />
        </div>
      </motion.div>

      {/* Work Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blueprint-bg/20 backdrop-blur-xl"
            onClick={() => setShowDetail(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white border border-klein-blue/20 max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 z-10 p-2 text-klein-blue hover:bg-klein-blue/5 rounded-full"
              >
                <X size={24} />
              </button>

              <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-900 border-r border-klein-blue/10">
                <img src={work.thumbnail} alt={work.title} className="w-full h-full object-contain" />
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/40">STORAGE_LOCATION: SERVER_02</div>
              </div>

              <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 border border-klein-blue flex items-center justify-center text-klein-blue">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-klein-blue leading-none">{work.title}</h2>
                    <p className="text-xs font-mono text-sacred-gold uppercase mt-1">{work.titleEn}</p>
                  </div>
                </div>

                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                  <div>
                    <p className="mb-4">{work.description}</p>
                    <p className="text-xs italic font-mono text-klein-blue/40">{work.descriptionEn}</p>
                  </div>

                  {work.responsibilities && (
                    <div className="bg-klein-blue/5 p-4 border border-klein-blue/10">
                      <div className="text-[10px] font-mono text-sacred-gold uppercase mb-2">RESPONSIBILITIES / 负责内容</div>
                      <p className="text-xs font-display text-klein-blue">{work.responsibilities}</p>
                      <p className="text-[10px] font-mono text-klein-blue/40 mt-1 italic">{work.responsibilitiesEn}</p>
                    </div>
                  )}

                  {work.keywords && (
                    <div className="flex flex-wrap gap-2">
                       {work.keywords.map((k, i) => (
                         <span key={i} className="px-2 py-1 bg-white border border-klein-blue/20 text-[10px] font-mono text-klein-blue">
                           #{k}
                         </span>
                       ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 border-t border-klein-blue/10 pt-6">
                    <div>
                      <div className="text-[10px] font-mono text-sacred-gold uppercase mb-1">CATEGORY / 类别</div>
                      <div className="font-display font-medium text-klein-blue">{work.type}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-sacred-gold uppercase mb-1">FORMAT / 格式</div>
                      <div className="font-display font-medium text-klein-blue">
                        {work.category === 'video' ? 'MP4 / 4K' : work.category === 'digital' ? 'WEB_LINK' : 'TIFF / 600DPI'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-end">
                  {work.link ? (
                    <a 
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-klein-blue text-white font-mono text-xs tracking-widest hover:bg-klein-blue/90 transition-all text-center flex items-center gap-2"
                    >
                      VISIT_EXT_ENDPOINT <ChevronRight size={12} />
                    </a>
                  ) : (
                    <button className="px-8 py-3 bg-klein-blue text-white font-mono text-xs tracking-widest hover:bg-klein-blue/90 transition-all">
                      LOAD_RAW_ASSETS
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Interactive Background Decorations
const BlueprintDecorations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const rotateSpring = useSpring(useTransform(scrollYProgress, [0, 1], [0, 180]));

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      <div className="absolute inset-0 blueprint-grid opacity-30" />
      <div className="absolute inset-0 blueprint-grid-fine opacity-10" />
      <div className="absolute inset-0 noise-overlay" />
      
      {/* Dynamic Halo */}
      <motion.div 
        style={{ rotate: rotateSpring }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] border-[0.5px] border-klein-blue/10 rounded-full"
      >
        {[0, 90, 180, 270].map((deg) => (
          <div 
            key={deg}
            className="absolute w-2 h-2 bg-klein-blue/20"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: `rotate(${deg}deg) translate(40vw) translateX(-50%) translateY(-50%)` 
            }}
          />
        ))}
      </motion.div>

              <motion.div 
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[5%] w-32 h-32 border border-klein-blue/10 rounded-full flex items-center justify-center"
              >
                <div className="w-16 h-[1px] bg-klein-blue/20 rotate-45" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-white border border-klein-blue/10 text-[6px] font-mono text-klein-blue">REF_FLOAT_01</div>
              </motion.div>

              <motion.div 
                animate={{ 
                  x: [0, 30, 0],
                  y: [0, 15, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[10%] w-48 h-48 border border-klein-blue/5 flex items-center justify-center opacity-40"
              >
                <div className="w-full h-full blueprint-grid-fine opacity-20" />
              </motion.div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const contactIcons: Record<string, any> = {
    Mail: <Mail size={16} />,
    MessageSquare: <MessageSquare size={16} />,
    Linkedin: <Linkedin size={16} />
  };

  const SectionHeader = ({ title, titleEn, id }: { title: string, titleEn: string, id?: string }) => (
    <div id={id} className="mb-12 relative overflow-hidden">
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'circOut' }}
        className="flex items-baseline gap-3 mb-2 pt-8"
      >
        <span className="font-mono text-[10px] text-white bg-klein-blue px-2 py-0.5 leading-none shadow-sm">
          {id === 'skills' ? '01' : 
           id === 'video' ? '02' : 
           id === 'visual' ? '03' : 
           id === 'digital' ? '04' : 
           id === 'experience' ? '05' : '06'}
        </span>
        <h2 className="text-3xl font-display font-medium text-klein-blue tracking-tight">{title}</h2>
      </motion.div>
      <div className="text-xs font-mono uppercase tracking-[0.2em] text-klein-blue/40 flex items-center gap-2">
        <ChevronRight size={10} />
        {titleEn}
      </div>
      <div className="absolute left-0 -bottom-4 w-full h-[1px] bg-gradient-to-r from-klein-blue/30 via-klein-blue/10 to-transparent" />
    </div>
  );

  return (
    <>
      <ScrollProgress />
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-blueprint-bg flex flex-col items-center justify-center font-mono gap-4"
          >
            <div className="w-64 h-[2px] bg-klein-blue/10 overflow-hidden relative">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-klein-blue"
              />
            </div>
            <div className="text-[10px] text-klein-blue tracking-widest uppercase">
              Initializing Sacred Information System...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`relative min-h-screen font-sans selection:bg-klein-blue selection:text-white pb-32 overflow-x-hidden ${!isLoaded ? 'pointer-events-none' : ''}`}>
        <CustomCursor />
        <BlueprintDecorations />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-40 bg-blueprint-bg/80 backdrop-blur-md border-b border-klein-blue/10">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-klein-blue flex items-center justify-center text-white font-mono text-sm leading-none pt-0.5">TY</div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xs tracking-widest text-klein-blue">{DATA.hero.name.toUpperCase()}</span>
                <span className="text-[8px] font-mono text-klein-blue/50">PORTFOLIO_V2.5.0</span>
              </div>
            </div>
            <div className="flex gap-4 md:gap-8 text-[10px] md:text-[11px] font-mono tracking-widest text-klein-blue/60">
              {[
                { id: 'home', cn: '首页', en: 'HOME' },
                { id: 'skills', cn: '能力', en: 'SKILLS' },
                { id: 'video', cn: '视频', en: 'VIDEO' },
                { id: 'visual', cn: '视觉', en: 'VISUAL' },
                { id: 'digital', cn: '数字', en: 'DIGITAL' },
                { id: 'experience', cn: '运营', en: 'OPS' },
                { id: 'contact', cn: '联系', en: 'CONTACT' }
              ].map((tab) => (
                <a 
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`hover:text-klein-blue transition-colors relative py-1 flex flex-col items-center ${activeTab === tab.id ? 'text-klein-blue' : ''}`}
                >
                  <span className="hidden md:inline">{tab.en}</span>
                  <span className="text-[9px] font-display font-bold leading-none mt-0.5">{tab.cn}</span>
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-[2px] bg-klein-blue"
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 pt-24">
          {/* Hero Section - New Style */}
          <section id="home" className="mb-32 lg:mb-48 min-h-[70vh] flex flex-col">
            {/* Top Info Bar - Blue Style */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center bg-klein-blue text-white mb-8 overflow-hidden"
            >
              {/* DATE Section */}
              <div className="flex items-center gap-2 px-4 py-3 border-r border-white/20">
                <span className="text-xs font-mono font-bold">DATE:2024-2026</span>
                <span className="text-[10px] font-mono text-white/60">→</span>
                <span className="text-[10px] font-mono text-white/60">Collection of works</span>
              </div>
              
              {/* COLLECTION OF WORKS - Vertical */}
              <div className="flex items-center px-3 py-3 border-r border-white/20">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-mono font-bold tracking-wider" style={{ writingMode: 'vertical-rl' }}>COLLECTION</span>
                  <span className="text-[9px] font-mono font-bold tracking-wider" style={{ writingMode: 'vertical-rl' }}>OF</span>
                  <span className="text-[9px] font-mono font-bold tracking-wider" style={{ writingMode: 'vertical-rl' }}>WORKS</span>
                </div>
                <div className="ml-2 w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                  </svg>
                </div>
              </div>
              
              {/* Designer */}
              <div className="flex items-center gap-2 px-4 py-3 border-r border-white/20">
                <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2v20"/>
                  <path d="M12 12 8 8"/>
                  <path d="M12 16l-4-4"/>
                </svg>
                <span className="text-xs font-mono font-bold">Designer @{DATA.hero.name.split(' ')[0]}</span>
              </div>
              
              {/* ECG Waveform */}
              <div className="flex-1 flex items-center justify-center px-4 py-3 border-r border-white/20">
                <svg className="w-full h-6 text-white/40" viewBox="0 0 200 20" preserveAspectRatio="none">
                  <polyline fill="none" stroke="currentColor" strokeWidth="1.5" 
                    points="0,10 30,10 40,10 50,2 55,18 60,10 80,10 90,5 95,15 100,10 130,10 140,10 150,2 155,18 160,10 180,10 200,10"/>
                </svg>
              </div>
              
              {/* Stamp */}
              <div className="px-3 py-3 border-r border-white/20">
                <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center">
                  <span className="text-white/80 font-bold text-xs">策</span>
                </div>
              </div>
              
              {/* Recycling */}
              <div className="px-4 py-3">
                <svg className="w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
                  <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/>
                  <path d="m14 16-3 3 3 3"/>
                  <path d="M8.293 13.596 7.196 9.5 3.1 10.598"/>
                  <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 12.013 3a1.784 1.784 0 0 1 1.575.882l3.974 6.812"/>
                  <path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>
                </svg>
              </div>
            </motion.div>

            {/* Main Content with 3D Grid Background */}
            <div className="flex-1 relative">
              {/* 3D Perspective Grid Background */}
              <div className="absolute inset-0 overflow-hidden">
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a365d" strokeWidth="0.5" opacity="0.15"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid3d)" />
                  {/* Perspective lines */}
                  <line x1="50%" y1="0" x2="20%" y2="100%" stroke="#1a365d" strokeWidth="0.5" opacity="0.1"/>
                  <line x1="50%" y1="0" x2="80%" y2="100%" stroke="#1a365d" strokeWidth="0.5" opacity="0.1"/>
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1a365d" strokeWidth="0.5" opacity="0.1"/>
                </svg>
                {/* Vortex effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
                  <svg viewBox="0 0 400 400" className="w-full h-full opacity-20">
                    <defs>
                      <radialGradient id="vortex" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1a365d" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#1a365d" stopOpacity="0"/>
                      </radialGradient>
                    </defs>
                    <ellipse cx="200" cy="200" rx="180" ry="60" fill="none" stroke="#1a365d" strokeWidth="0.5"/>
                    <ellipse cx="200" cy="200" rx="140" ry="45" fill="none" stroke="#1a365d" strokeWidth="0.5"/>
                    <ellipse cx="200" cy="200" rx="100" ry="30" fill="none" stroke="#1a365d" strokeWidth="0.5"/>
                    <ellipse cx="200" cy="200" rx="60" ry="18" fill="none" stroke="#1a365d" strokeWidth="0.5"/>
                  </svg>
                </div>
              </div>

              {/* Main Title */}
              <div className="relative z-10 flex flex-col justify-end h-full pb-12">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* 姓名 - 突出显示 */}
                  <div className="mb-2">
                    <span className="text-xs font-mono text-klein-blue/40 tracking-widest block mb-1">DESIGNER / 设计师</span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-klein-blue tracking-tight">
                      {DATA.hero.name}
                    </h2>
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-black text-klein-blue leading-none tracking-tight">
                    Portfolio
                  </h1>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-3 h-3 bg-sacred-gold rotate-45"/>
                    <span className="text-sm font-mono text-klein-blue/60 tracking-widest">PERSONAL WORKS COLLECTION / 个人作品集</span>
                  </div>
                </motion.div>

                {/* Folder Icon - Clickable Resume Link */}
                <motion.a 
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute right-0 bottom-12 cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-24 h-20 bg-pink-300 rounded-lg relative overflow-hidden shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all">
                      <div className="absolute top-0 left-0 w-full h-6 bg-pink-400 rounded-t-lg"/>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-pink-200 rounded-full"/>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-mono text-white bg-pink-500 px-2 py-1 rounded">OPEN / 打开</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md group-hover:bg-klein-blue group-hover:text-white transition-colors">
                      <MousePointer2 size={14} className="text-klein-blue group-hover:text-white"/>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-[10px] font-mono text-klein-blue/60 bg-white px-2 py-1 rounded">Resume.pdf / 简历</span>
                    </div>
                  </div>
                </motion.a>

                {/* Tags */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap gap-3 mt-8"
                >
                  {DATA.hero.positioning.map((p, i) => (
                    <span key={i} className="px-3 py-1 border border-klein-blue/30 text-xs font-mono text-klein-blue bg-white/80">
                      {p} / {DATA.hero.positioningEn[i]}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="mt-8 border-t-2 border-klein-blue pt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] font-mono text-klein-blue/50">
                <span>SCROLL TO EXPLORE / 向下滚动探索</span>
                <ChevronRight size={12} className="animate-pulse"/>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-klein-blue/40"/>
                <span className="text-[10px] font-mono text-klein-blue/40">PORTFOLIO_V2024</span>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="mb-32">
            <SectionHeader title="个人能力" titleEn="CORE COMPETENCIES" id="skills" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DATA.skills.map((skill, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-white border border-klein-blue/10 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-8 h-8 bg-klein-blue/5 flex items-center justify-center">
                    {idx === 0 ? <Video size={14} className="text-klein-blue" /> : 
                     idx === 1 ? <Brush size={14} className="text-klein-blue" /> : 
                     idx === 2 ? <Terminal size={14} className="text-klein-blue" /> : 
                     <MousePointer2 size={14} className="text-klein-blue" />}
                  </div>
                  <h3 className="text-lg font-display font-bold text-klein-blue mb-1">{skill.category}</h3>
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="text-[9px] font-mono bg-klein-blue/10 text-klein-blue px-2 py-0.5 rounded-sm">TOOLS</div>
                    <p className="text-[10px] font-mono text-sacred-gold uppercase tracking-widest">{skill.categoryEn}</p>
                  </div>
                  <div className="space-y-2">
                    {skill.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600 font-mono">
                        <div className="w-1 h-1 bg-klein-blue/40" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-klein-blue group-hover:w-full transition-all duration-500" />
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: '二次元账号运营', 
                  en: 'ACG Account Operation', 
                  icon: <MessageSquare size={14}/>,
                  desc: '小红书、微博、抖音、画加等多平台运营，同人创作累计浏览量15w+，粉丝突破千人'
                },
                { 
                  title: '接稿与创作经验', 
                  en: 'Commission Experience', 
                  icon: <Code2 size={14}/>,
                  desc: '在画加、临界等约稿平台与上百位约稿方合作，累计达成1w+接稿收入'
                },
                { 
                  title: '漫展活动经历', 
                  en: 'Convention Experience', 
                  icon: <Activity size={14}/>,
                  desc: 'CD26、CP28、CP30摊主经历，同时参与cosplay演出，兼具台前幕后经验'
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col p-5 border border-dotted border-klein-blue/30 bg-klein-blue/5 hover:border-klein-blue/50 transition-all">
                   <div className="flex items-center gap-3 mb-3">
                     <div className="text-klein-blue">{item.icon}</div>
                     <div>
                       <div className="text-sm font-display font-medium text-klein-blue">{item.title}</div>
                       <div className="text-[9px] font-mono text-klein-blue/40 uppercase">{item.en}</div>
                     </div>
                   </div>
                   <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Video Works Section */}
          <section id="video" className="mb-32">
            <SectionHeader title="视频作品" titleEn="VIDEO WORKS" id="video" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {DATA.works.filter(w => w.category === 'video').map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>

          {/* Visual Design Section */}
          <section id="visual" className="mb-32">
            <SectionHeader title="视觉设计" titleEn="VISUAL DESIGN" id="visual" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DATA.works.filter(w => w.category === 'image').map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </section>

          {/* Digital Media Section */}
          <section id="digital" className="mb-32">
            <SectionHeader title="网站与数字媒体" titleEn="DIGITAL MEDIA" id="digital" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {DATA.works.filter(w => w.category === 'digital').map((work) => (
                <div key={work.id} className="relative group">
                   <WorkCard work={work} />
                   <div className="mt-4 flex items-center justify-between px-2">
                     <div className="flex items-center gap-2">
                        <Terminal size={12} className="text-klein-blue/40" />
                        <span className="text-[10px] font-mono text-klein-blue/60 uppercase">Interactive_Module_Active</span>
                     </div>
                     <div className="text-[10px] font-mono text-sacred-gold">UI_PROTO_V1</div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="mb-32">
            <SectionHeader title="运营与经历" titleEn="OPERATIONS & EXPERIENCE" id="experience" />
            <div className="space-y-8">
              {DATA.experiences.map((exp, idx) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex flex-col md:flex-row gap-6 p-8 bg-white border border-klein-blue/10 relative hover:border-sacred-gold/40 transition-all group"
                >
                  <div className="md:w-1/4">
                    <div className="text-xs font-mono text-sacred-gold font-bold mb-1">{exp.period}</div>
                    <div className="text-[10px] font-mono text-klein-blue/30 uppercase tracking-widest">TIMELINE_ENTRY_{idx + 1}</div>
                    <div className="mt-4 p-2 border border-klein-blue/10 bg-klein-blue/5 inline-flex items-center gap-2">
                       <Briefcase size={12} className="text-klein-blue/40" />
                       <span className="text-[10px] font-mono text-klein-blue font-bold">{exp.role}</span>
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <div className="flex items-baseline gap-4 mb-4">
                       <h3 className="text-2xl font-display font-bold text-klein-blue">{exp.title}</h3>
                       <span className="text-xs font-mono text-klein-blue/40 uppercase">{exp.titleEn}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{exp.description}</p>
                    <p className="text-[11px] font-mono text-klein-blue/50 italic leading-relaxed">{exp.descriptionEn}</p>
                    
                    <div className="mt-6 flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-sacred-gold/40" />
                      <div className="w-2 h-2 rounded-full bg-sacred-gold/20" />
                      <div className="w-2 h-2 rounded-full bg-sacred-gold/10" />
                    </div>
                  </div>
                  
                  {/* Vertical bar on hover */}
                  <div className="absolute left-0 top-0 w-0 h-full bg-sacred-gold group-hover:w-1 transition-all" />
                </motion.div>
              ))}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-8 border border-klein-blue/20 bg-klein-blue/5">
                   <div className="flex items-center gap-2 mb-4">
                     <Activity size={16} className="text-klein-blue" />
                     <h4 className="font-display font-bold text-klein-blue tracking-wider">ACG内容生产与实践 / ACG CONTENT PRODUCTION</h4>
                   </div>
                   <p className="text-xs text-gray-600 leading-relaxed mb-2">
                     "真实参与二次元内容生态与传播实践"。从同人企划的策划到谷圈周边开发，我在实践中理解亚文化传播的逻辑。
                   </p>
                   <p className="text-[10px] font-mono text-klein-blue/40 italic leading-relaxed">
                     "Deeply involved in the production and communication practice of ACG content ecology. From planning fanzine projects to merch development, I explore the logic of subculture communication through practice."
                   </p>
                </div>
                <div className="p-8 border border-sacred-gold/20 bg-sacred-gold/5 flex items-center justify-center text-center">
                   <div className="space-y-2">
                     <div className="text-xl font-serif italic text-sacred-gold opacity-60">"Stay Curious, Stay Fandom."</div>
                     <div className="text-[10px] font-mono text-sacred-gold tracking-[0.3em]">- TY_CIPHER_2024</div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-32">
            <SectionHeader title="联系我" titleEn="CONTACT ME" id="contact" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {DATA.contact.methods.map((method, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group p-8 bg-white border border-klein-blue/10 flex flex-col items-center text-center hover:border-klein-blue transition-all cursor-pointer relative"
                >
                  <div className="w-16 h-16 rounded-full border border-klein-blue/20 flex items-center justify-center text-klein-blue mb-6 group-hover:bg-klein-blue group-hover:text-white transition-colors relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                    />
                    {contactIcons[method.icon]}
                  </div>
                  <div className="text-[10px] font-mono text-klein-blue/40 uppercase tracking-widest mb-1">{method.label}</div>
                  <div className="text-sm font-display text-klein-blue font-bold">{method.value}</div>
                  
                  {/* Decorative line */}
                  <div className="mt-6 flex gap-1">
                    <div className="w-8 h-[1px] bg-klein-blue/20" />
                    <div className="w-1 h-[1px] bg-klein-blue/20" />
                    <div className="w-1 h-[1px] bg-klein-blue/20" />
                  </div>
                </motion.div>
              ))}
              
              {/* Thank You */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="p-8 bg-klein-blue text-white border border-klein-blue flex flex-col items-center justify-center text-center transition-all relative md:col-span-3"
              >
                <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center mb-4">
                  <Sparkles size={20} className="text-sacred-gold" />
                </div>
                <div className="text-lg font-display font-bold mb-1">感谢您的观看</div>
                <div className="text-xs font-mono text-white/60 tracking-widest">THANK YOU FOR WATCHING</div>
                <div className="mt-3 text-[9px] font-mono text-white/40">ALL WORKS ARE ORIGINAL / 所有作品均为原创</div>
              </motion.div>
            </div>
          </section>
        </main>

        <footer className="mt-48 py-24 border-t border-klein-blue/10 text-center relative overflow-hidden bg-white/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl opacity-[0.05]">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-klein-blue to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div 
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-mono text-[9px] text-klein-blue/30 tracking-[0.5em]"
            >
              SYSTEM_TIME: {new Date().toISOString().split('T')[0].replace(/-/g, '_')}
            </motion.div>
            <div className="flex items-center gap-6">
               <div className="w-4 h-[1px] bg-klein-blue/10" />
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-klein-blue animate-pulse" />
                  <span className="text-[10px] font-mono text-klein-blue/50 tracking-widest">ORDER // HARMONY // INFORMATION</span>
               </div>
               <div className="w-4 h-[1px] bg-klein-blue/10" />
            </div>
            <div className="text-[8px] font-mono text-klein-blue/20 mt-4 italic max-w-xs leading-relaxed uppercase tracking-widest">
              "In the algorithm we trust, in the spirit we reside."
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
