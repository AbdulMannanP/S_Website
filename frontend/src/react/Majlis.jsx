import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

// -------------------------------------------------------------
// DATA PAYLOAD
// -------------------------------------------------------------
const lookbookData = [
  { id: "fmin-1", name: "Flush Monolithic Sectional", collection: "Flush Minimalist Collection", gallery: ["Set E2.png"], desc: "Sits entirely flat on the floor with perfectly smooth, un-tufted upholstery." },
  { id: "fmin-2", name: "Flush Monolithic Curved Sectional", collection: "Flush Minimalist Collection", gallery: ["type_elevated_contemporary_gallery_1.png"], desc: "Sweeping curves meeting the floor seamlessly." },
  { id: "fmin-3", name: "Flush Bolster-Arm Sectional", collection: "Flush Minimalist Collection", gallery: ["Set G.png"], desc: "Low-profile back with oversized bolster armrests." },
  { id: "fmin-4", name: "Flush Piped-Edge Modular Sofa", collection: "Flush Minimalist Collection", gallery: ["item_001_gallery_1.png"], desc: "Clean modular blocks outlined with tailored piping." },
  { id: "fmin-5", name: "Flush Banded-Curve Sofa", collection: "Flush Minimalist Collection", gallery: ["Set K2.png", "Set K1.png"], desc: "Smooth cushions with sharply downward-curving armrests highlighted by thick, rigid outer banding." },
  
  { id: "fflu-1", name: "Flush Fluted Platform Sectional", collection: "Flush Fluted Collection", gallery: ["Set C2.png", "Set C1.png"], desc: "Deep channel tufting extending down to the floor." },
  { id: "fflu-2", name: "Flush Fluted Crescent Sectional", collection: "Flush Fluted Collection", gallery: ["WhatsApp Image 2026-05-12 at 9.29.54 PM.jpeg"], desc: "A sweeping crescent sofa backed with heavy vertical fluting." },
  { id: "fflu-3", name: "Flush Wide-Fluted Sectional", collection: "Flush Fluted Collection", gallery: ["Set J2.png", "Set J1.png"], desc: "Broad, aggressive vertical tufting for a bold statement." },
  { id: "fflu-4", name: "Flush Narrow-Fluted Sectional", collection: "Flush Fluted Collection", gallery: ["Set L2.png"], desc: "Tight, elegant fluting wrapping around a low-profile base." },
  
  { id: "fpli-1", name: "Hidden Plinth Slab-Seat Sofa", collection: "The Floating Plinth Collection", gallery: ["Set I2.png"], desc: "Massive seating block floating above a deeply recessed dark base." },
  { id: "fpli-2", name: "Hidden Plinth Track-Arm Sofa", collection: "The Floating Plinth Collection", gallery: ["subtype_hidden_plinth_gallery_1.png"], desc: "Tailored track arms hovering above the ground." },
  { id: "fpli-3", name: "Hidden Plinth Dual-Shell Sofa", collection: "The Floating Plinth Collection", gallery: ["item_004.png"], desc: "A rigid outer shell floating independently of the soft inner cushions." },
  { id: "fpli-4", name: "Recessed Plinth Curved Sectional", collection: "The Floating Plinth Collection", gallery: ["item_006.png"], desc: "A floating curved silhouette designed for grand majlis spaces." },
  
  { id: "elig-1", name: "Elevated Pin-Leg Sectional", collection: "Elevated Lightweight Collection", gallery: ["item_007_gallery_1.png"], desc: "Ultra-minimalist profile supported by impossibly thin metal legs." },
  { id: "elig-2", name: "Elevated Pin-Leg Modular Sectional", collection: "Elevated Lightweight Collection", gallery: ["subtype_hidden_plinth_gallery_1.png"], desc: "Airy, floating modular pieces connected by delicate metalwork." },
  
  { id: "ehea-1", name: "Elevated Block Sectional", collection: "Elevated Heavy Wood Collection", gallery: ["Set D2.png"], desc: "Resting firmly on heavy, solid walnut block legs." },
  { id: "ehea-2", name: "Elevated Heavy-Block Sectional", collection: "Elevated Heavy Wood Collection", gallery: ["item_007.png"], desc: "A grounded, masculine aesthetic driven by prominent timber supports." },
  { id: "ehea-3", name: "Elevated Table-Arm Sofa", collection: "Elevated Heavy Wood Collection", gallery: ["item_005_gallery_1.png"], desc: "Integrated wooden side tables acting as structural arms." },
  { id: "ehea-4", name: "Elevated Soft-Edge Underframe Sofa", collection: "Elevated Heavy Wood Collection", gallery: ["WhatsApp Image 2026-05-12 at 9.26.05 PM.jpeg"], desc: "A continuous, organically shaped wooden underframe." },
  
  { id: "etai-1", name: "Elevated Sloped-Arm Sofa", collection: "Elevated Tailored Collection", gallery: ["Set A1.png", "Set A2.png"], desc: "Multi-seater sofa elevated on a thick wooden perimeter frame with a distinct, sweeping downward curve." },
  { id: "etai-2", name: "Elevated Track-Arm Set", collection: "Elevated Tailored Collection", gallery: ["Set H2.png"], desc: "Perfectly proportioned, structured seating raised on an elegant perimeter frame." },
  { id: "etai-3", name: "Elevated Fluted-Back Sofa", collection: "Elevated Tailored Collection", gallery: ["Set H2.png"], desc: "A fusion of classic tailoring with contemporary fluted details." },
  { id: "etai-4", name: "Elevated Barrel-Back Loveseats", collection: "Elevated Tailored Collection", gallery: ["Set F2.png"], desc: "Enveloping curved backs providing intimate, structured seating." },
  
  { id: "arch-1", name: "Framed Grid-Tufted Sectional", collection: "Architectural Platform Collection", gallery: ["Set B1.png", "Set B2.png"], desc: "Seating trapped within a highly decorative, grid-tufted architectural cage." },
  { id: "arch-2", name: "Framed Slab-Arm Set", collection: "Architectural Platform Collection", gallery: ["Set M1.png"], desc: "Massive wooden slab arms acting as structural room dividers." },
  { id: "arch-3", name: "Exoskeleton Platform Majlis", collection: "Architectural Platform Collection", gallery: ["WhatsApp Image 2026-05-12 at 9.32.29 PM.jpeg"], desc: "Upholstery suspended within a visible, decorative timber exoskeleton." },
  { id: "arch-4", name: "Stepped-Wood Framed Majlis", collection: "Architectural Platform Collection", gallery: ["subtype_framed_base_gallery_1.png"], desc: "A grand, stepped wooden platform anchoring the entire majlis." },
  { id: "arch-5", name: "Cylinder-Base Fluted Sofa", collection: "Architectural Platform Collection", gallery: ["item_003.png"], desc: "Resting on monumental wooden cylinders rather than traditional legs." }
];

const collections = [
  "All",
  "Flush Minimalist Collection",
  "Flush Fluted Collection",
  "The Floating Plinth Collection",
  "Elevated Lightweight Collection",
  "Elevated Heavy Wood Collection",
  "Elevated Tailored Collection",
  "Architectural Platform Collection"
];

// -------------------------------------------------------------
// HOOKS & UTILS
// -------------------------------------------------------------
const useTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const checkTouch = () => setIsTouch(window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window);
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);
  return isTouch;
};

// JS-level device detection — drives feature-dropping and layout routing
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 1024px)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

// -------------------------------------------------------------
// COMPONENTS
// -------------------------------------------------------------
const CustomCursor = ({ isHovering, isTouchDevice }) => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor, { passive: true });
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [isTouchDevice, cursorX, cursorY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] rounded-full origin-center"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        backdropFilter: isHovering ? "blur(8px)" : "none",
        mixBlendMode: isHovering ? "difference" : "normal",
        willChange: "transform, width, height"
      }}
      animate={{
        width: isHovering ? 80 : 16,
        height: isHovering ? 80 : 16,
        backgroundColor: isHovering ? "rgba(166, 138, 86, 0.1)" : "#A68A56",
        borderColor: isHovering ? "rgba(166, 138, 86, 0.2)" : "transparent",
        borderWidth: isHovering ? "1px" : "0px",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
    />
  );
};

// ImageKit LQIP with Blur-Up
const ImageKitLQIP = ({ item, layoutId, width = 800, className }) => {
  const [loaded, setLoaded] = useState(false);
  const defaultClass = "absolute inset-0 w-full h-full object-cover";
  const appliedClass = className || defaultClass;
  return (
    <>
      <motion.img 
        src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-40,bl-6`}
        alt=""
        className={appliedClass}
        style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.6s ease-out', z: 0 }}
      />
      <motion.img
        layoutId={layoutId}
        src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-${width},q-80,f-auto`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        alt=""
        className={appliedClass}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease-out', z: 0, willChange: 'transform, opacity' }}
      />
    </>
  );
}

// Mobile-only: lightweight static image — zero zoom physics, no motion values
const MobileStaticImage = ({ item }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-0 sm:p-4">
      <img
        src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-900,q-80,f-auto`}
        loading="lazy"
        alt="Product"
        className="w-full h-full object-cover rounded-[2rem] bg-[#FDFBF7]/50 border border-[#A68A56]/10 shadow-lg"
      />
    </div>
  );
};

// Synchronized Zoom Image Viewer
const SynchronizedZoomImage = ({ item, isTouchDevice, isZoomingLeft, isZoomingRight, zoomXLeft, zoomYLeft, zoomXRight, zoomYRight, side }) => {
  const [loaded, setLoaded] = useState(false);
  
  const myZoomX = side === 'left' ? zoomXLeft : zoomXRight;
  const myZoomY = side === 'left' ? zoomYLeft : zoomYRight;
  const otherZoomX = side === 'left' ? zoomXRight : zoomXLeft;
  const otherZoomY = side === 'left' ? zoomYRight : zoomYLeft;

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const y = ((clientY - rect.top) / Math.max(1, rect.height)) * 100;
    
    myZoomX.set(x);
    myZoomY.set(y);
    otherZoomX.set(x);
    otherZoomY.set(y);
  };
  
  const handlePointerEnter = () => {
    isZoomingLeft.set(1);
    isZoomingRight.set(1);
  };

  const handlePointerLeave = () => {
    isZoomingLeft.set(0);
    isZoomingRight.set(0);
  };

  const isZooming = side === 'left' ? isZoomingLeft : isZoomingRight;
  const scale = useTransform(isZooming, [0, 1], [1, 1.5]);
  const transformOrigin = useMotionTemplate`${myZoomX}% ${myZoomY}%`;

  return (
    <div 
      className={`w-full h-auto aspect-square lg:aspect-auto lg:h-full relative overflow-hidden bg-transparent lg:bg-[#FDFBF7]/50 lg:border lg:border-[#A68A56]/20 cursor-crosshair rounded-[2rem]`}
      onMouseMove={!isTouchDevice ? handlePointerMove : undefined}
      onTouchMove={isTouchDevice ? handlePointerMove : undefined}
      onMouseEnter={!isTouchDevice ? handlePointerEnter : undefined}
      onMouseLeave={!isTouchDevice ? handlePointerLeave : undefined}
      onTouchStart={isTouchDevice ? handlePointerEnter : undefined}
      onTouchEnd={isTouchDevice ? handlePointerLeave : undefined}
    >
       <motion.img
         src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-40,bl-6`}
         className="absolute inset-0 w-full h-full object-cover lg:object-contain p-0 lg:p-4"
         style={{ opacity: loaded ? 0 : 1, transformOrigin, scale }}
       />
       <motion.img
         src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${item}?tr=w-1600,q-80,f-auto`}
         onLoad={() => setLoaded(true)}
         className="absolute inset-0 w-full h-full object-cover lg:object-contain p-0 lg:p-4 drop-shadow-2xl"
         style={{ opacity: loaded ? 1 : 0, transformOrigin, scale, willChange: 'transform' }}
       />
    </div>
  );
};


export default function InteractiveLookbook() {
  const [activeCollection, setActiveCollection] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [displayItems, setDisplayItems] = useState([]);
  
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [compareGalleryIndex, setCompareGalleryIndex] = useState(0);
  
  const [compareItem, setCompareItem] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparePage, setComparePage] = useState(0);

  const [isInterceptDrawerOpen, setIsInterceptDrawerOpen] = useState(false);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState(false);
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [bespokeForm, setBespokeForm] = useState({ name: '', email: '', phone: '', details: '' });
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  
  const isTouchDevice = useTouchDevice();
  // JS-level mobile detection — drives layout routing, feature dropping, animation routing
  const isMobile = useIsMobile();

  // Sync Zoom Physics
  const zoomXLeft = useMotionValue(50);
  const zoomYLeft = useMotionValue(50);
  const zoomXRight = useMotionValue(50);
  const zoomYRight = useMotionValue(50);
  const isZoomingLeft = useMotionValue(0);
  const isZoomingRight = useMotionValue(0);

  // Gyroscopic Tilt (Mobile Focus Mode Physics)
  useEffect(() => {
    if (!isTouchDevice || !selectedItem) return;
    const handleOrientation = (e) => {
      const x = Math.min(Math.max(e.gamma || 0, -15), 15);
      const y = Math.min(Math.max((e.beta || 45) - 45, -15), 15);
      setGyro({ x, y });
    };
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isTouchDevice, selectedItem]);

  // Exit Intent Blocker (Desktop Only)
  useEffect(() => {
    if (isTouchDevice) return;
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && !sessionStorage.getItem('exitIntentFired')) {
        setIsExitIntentOpen(true);
        sessionStorage.setItem('exitIntentFired', 'true');
      }
    };
    const handleMouseMove = (e) => {
      if (e.clientY <= 10 && !sessionStorage.getItem('exitIntentFired')) {
        setIsExitIntentOpen(true);
        sessionStorage.setItem('exitIntentFired', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isTouchDevice]);

  // Smooth Scroll
  useEffect(() => {
    if (isTouchDevice) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [isTouchDevice]);

  // Data Shuffle
  useEffect(() => {
    const filtered = activeCollection === "All" 
      ? lookbookData 
      : lookbookData.filter(item => item.collection === activeCollection);
    
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    
    const randomizedWithLayout = shuffled.map((item) => {
      const rand = Math.random();
      let spanClass = "col-span-1 row-span-1";
      if (isTouchDevice) {
        if (rand > 0.85) spanClass = "col-span-2 row-span-1";
      } else {
        if (rand > 0.8) spanClass = "col-span-2 row-span-2";
        else if (rand > 0.6) spanClass = "col-span-2 row-span-1";
      }
      return { ...item, spanClass };
    });

    setDisplayItems(randomizedWithLayout);
  }, [activeCollection, isTouchDevice]);

  useEffect(() => {
    if (selectedItem || isExitIntentOpen || isCompareModalOpen || isBespokeModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }, [selectedItem, isExitIntentOpen, isCompareModalOpen, isBespokeModalOpen]);

  // Intercept Logic Helpers
  const handleCloseFocusMode = () => {
    if (!isInterceptDrawerOpen && selectedItem) {
       setIsInterceptDrawerOpen(true);
    } else {
       setSelectedItem(null);
       setCompareItem(null);
       setIsInterceptDrawerOpen(false);
       setIsCompareModalOpen(false);
       setIsBespokeModalOpen(false);
    }
  };

  // Recommendations Logic
  const getRecommendations = () => {
    if (!selectedItem) return [];
    return lookbookData.filter(item => item.collection === selectedItem.collection && item.id !== selectedItem.id).slice(0, 4);
  };

  // Compare Pagination Logic
  const itemsPerPage = 6;
  const filteredCompareData = selectedItem ? lookbookData.filter(i => i.id !== selectedItem.id) : [];
  const totalPages = Math.ceil(filteredCompareData.length / itemsPerPage);
  const currentCompareData = filteredCompareData.slice(comparePage * itemsPerPage, (comparePage + 1) * itemsPerPage);

  const watermarkSvg = "url(\"data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23A68A56' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M200 0 L400 200 L200 400 L0 200 Z M100 100 L300 100 L300 300 L100 300 Z' stroke='%23A68A56' stroke-opacity='0.02' stroke-width='1' /%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' font-family='serif' opacity='0.04'%3ESaeed%3C/text%3E%3C/g%3E%3C/svg%3E\")";

  return (
    <div 
      className={`min-h-screen w-full bg-transparent text-[#1C1A17] font-sans selection:bg-[#A68A56] selection:text-white overflow-x-hidden ${isTouchDevice ? 'cursor-auto' : 'cursor-none'}`}
      style={{ backgroundImage: watermarkSvg, backgroundSize: '400px 400px' }}
    >
      
      <CustomCursor isHovering={hoveredItem !== null} isTouchDevice={isTouchDevice} />

      {/* Page Framing: Adding pt-[100px] to account for the fixed native HTML header */}
      <div className="p-4 md:p-8 pt-[100px] md:pt-[120px] min-h-screen flex flex-col relative">

        {/* Minimalist Text-Link Filter Bar (Solid Gold Update) */}
        <div className="sticky top-[80px] z-40 w-full mb-8 overflow-hidden">
          <div className="flex items-center gap-6 md:gap-8 overflow-x-auto hide-scrollbar py-2 px-4 md:px-8">
            {collections.map(col => {
              const isActive = activeCollection === col;
              return (
                <button
                  key={col}
                  onClick={() => {
                    if (isTouchDevice && navigator.vibrate) navigator.vibrate(5);
                    setActiveCollection(col);
                  }}
                  className={`whitespace-nowrap text-[0.65rem] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 pb-1 ${isTouchDevice ? 'cursor-auto' : 'cursor-none'} text-[#A68A56] ${
                    isActive 
                      ? "font-bold border-b-2 border-[#A68A56] opacity-100" 
                      : "font-normal border-b-2 border-transparent hover:font-bold opacity-100"
                  }`}
                >
                  {col.replace(' Collection', '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-grow rounded-[2rem] overflow-hidden bg-[#F4EFE6]/50 border border-[#A68A56]/20 p-4 md:p-8 relative">
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8 auto-rows-[160px] sm:auto-rows-[220px] md:auto-rows-[300px] grid-flow-row-dense">
            <AnimatePresence mode="popLayout">
              {displayItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#FDFBF7] border border-[#A68A56]/20 shadow-xl ${item.spanClass}`}
                  onClick={() => {
                    if (isTouchDevice && navigator.vibrate) navigator.vibrate(10);
                    setSelectedItem(item);
                    setGalleryIndex(0);
                  }}
                  onMouseEnter={() => !isTouchDevice && setHoveredItem(item.id)}
                  onMouseLeave={() => !isTouchDevice && setHoveredItem(null)}
                >
                  <ImageKitLQIP item={item.gallery[0]} layoutId={`image-${item.id}`} width={800} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-8 border-t border-[#A68A56]/20 flex flex-col md:flex-row items-center justify-between px-8 text-[#1C1A17]/50 text-xs tracking-widest uppercase">
           <span>© 2026 Saeed Furniture</span>
           <span className="mt-4 md:mt-0">The Royal Standard</span>
        </footer>

      </div>

      {/* Bespoke Concierge Expandable Pill — touch-aware toggle */}
      <div
        onClick={() => {
          if (isTouchDevice) {
            if (isConciergeOpen) {
              setIsBespokeModalOpen(true);
              setIsSubmitted(false);
              setIsConciergeOpen(false);
            } else {
              setIsConciergeOpen(true);
            }
          } else {
            window.open("https://wa.me/9288004450?text=I%20would%20like%20to%20share%20a%20reference", "_blank");
          }
        }}
        className={`group fixed bottom-10 right-10 md:bottom-12 md:right-12 z-[150] flex items-center justify-start overflow-hidden rounded-full backdrop-blur-md bg-[#25d366] border border-[#25d366]/40 shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.05,1)] h-14 ${
          isTouchDevice
            ? isConciergeOpen ? 'w-72' : 'w-14'
            : 'w-14 hover:w-72'
        } ${isTouchDevice ? 'cursor-pointer' : 'cursor-pointer'}`}
      >
        <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
        <span className={`font-sans font-bold tracking-[0.1em] text-[10px] text-white whitespace-nowrap pr-6 transition-opacity duration-500 delay-100 ${
          isTouchDevice
            ? isConciergeOpen ? 'opacity-100' : 'opacity-0'
            : 'opacity-0 group-hover:opacity-100'
        }`}>
          SHARE YOUR REFERENCE WITH US
        </span>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* FOCUS MODE (Showroom Inspect Layout)                        */}
      {/* ----------------------------------------------------------- */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-3xl pt-[80px] ${
              isMobile 
                ? 'flex flex-col h-[100dvh] overflow-hidden' 
                : 'flex items-center justify-center p-4 md:p-8 overflow-y-auto'
            }`}
            style={{ willChange: "opacity" }}
          >
            {/* Ambient Background Glow */}
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              src={`https://ik.imagekit.io/de7qvcvqv/images/catalog/${selectedItem.gallery[0]}?tr=w-400,q-50`}
              className="absolute inset-0 w-full h-full object-cover blur-[150px] z-0 pointer-events-none"
            />

            {/* Mobile Absolute Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleCloseFocusMode}
              className={`absolute top-24 right-6 md:top-28 md:right-8 z-[60] px-6 h-12 md:h-14 rounded-full bg-[#1C1A17]/5 backdrop-blur-xl border border-[#A68A56]/20 flex items-center justify-center gap-3 text-[#1C1A17] md:hover:bg-[#1C1A17]/10 hover:scale-105 transition-all shadow-xl ${isTouchDevice ? 'cursor-pointer' : 'cursor-none'}`}
            >
              {isInterceptDrawerOpen ? (
                 <span className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                   Back
                 </span>
              ) : (
                 <svg className="transition-transform duration-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              )}
            </motion.button>

            <div className={`relative w-full h-full max-w-[1600px] flex flex-col lg:flex-row gap-6 lg:gap-10 z-10 pt-24 lg:pt-0`}>
                     {/* Image Inspection Area
                  Layout Routing: Mobile = vertical stack (45vh each), Desktop = side-by-side flex-row */}
               <motion.div 
                 layout
                 className={`w-full relative flex items-center justify-center transition-all duration-500
                   ${compareItem
                     ? isMobile
                       ? 'flex-col gap-4 flex-none'        // Mobile: stacked
                       : 'flex-row gap-4 flex-1'           // Desktop: side-by-side
                     : 'flex-1 flex-col'
                   }`}
                 style={{ height: isInterceptDrawerOpen ? (isMobile ? 'auto' : '60%') : '100%' }}
              >
                 {/* ── PRIMARY IMAGE ─────────────────────────────────────
                     Phase 2 fix: forced min-height so text panel cannot crush the image on mobile */}
                 <div
                   style={compareItem && isMobile ? { height: '45vh', width: '100%', position: 'relative' } : (!isMobile ? { flex: 1, width: '100%', height: '100%', position: 'relative' } : { position: 'relative' })}
                   className={
                     !compareItem && isMobile 
                        ? 'w-full h-[45vh] min-h-[300px] flex-none relative' 
                        : 'relative w-full h-full flex items-center justify-center'
                   }
                 >
                   {isMobile ? (
                     // MOBILE: strictly positioned, clean static img
                     <div className="w-full h-full absolute inset-0">
                       <MobileStaticImage item={selectedItem.gallery[galleryIndex]} />
                     </div>
                   ) : (
                     // DESKTOP: full synchronized magnifier engine
                     <motion.div
                       className="absolute inset-0 w-full h-full"
                     >
                       <SynchronizedZoomImage
                         item={selectedItem.gallery[galleryIndex]}
                         isTouchDevice={isTouchDevice}
                         isZoomingLeft={isZoomingLeft} isZoomingRight={isZoomingRight}
                         zoomXLeft={zoomXLeft} zoomYLeft={zoomYLeft}
                         zoomXRight={zoomXRight} zoomYRight={zoomYRight}
                         side="left"
                       />
                     </motion.div>
                   )}

                   {/* Winner Selection UI (Primary side) */}
                   {compareItem && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}
                           className={`px-6 py-3 rounded-full backdrop-blur-md bg-white/20 border border-[#A68A56]/30 text-[#1C1A17] text-xs font-bold uppercase tracking-widest hover:bg-[#A68A56] hover:text-white transition-all shadow-xl flex items-center gap-2 whitespace-nowrap ${isTouchDevice ? 'cursor-pointer' : 'cursor-none'}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                          Choose This Design
                        </button>
                      </div>
                   )}

                 </div>

                 {/* ── COMPARE IMAGE ─────────────────────────────────────
                     Layout: Mobile = 45vh height block, Desktop = flex-1 side panel */}
                 {compareItem && (
                   <div
                     style={isMobile ? { height: '45vh', width: '100%', position: 'relative' } : { flex: 1, width: '100%', height: '100%', position: 'relative' }}
                     className="relative w-full h-full"
                   >
                     <motion.div
                       style={{ x: isMobile ? gyro.x : 0, y: isMobile ? gyro.y : 0 }}
                       className="absolute inset-0 w-full h-full"
                     >
                       {isMobile ? (
                         // MOBILE: lightweight static image — no zoom engine overhead
                         <MobileStaticImage item={compareItem.gallery[compareGalleryIndex]} />
                       ) : (
                         // DESKTOP: full synchronized magnifier
                         <SynchronizedZoomImage
                           item={compareItem.gallery[compareGalleryIndex]}
                           isTouchDevice={isTouchDevice}
                           isZoomingLeft={isZoomingLeft} isZoomingRight={isZoomingRight}
                           zoomXLeft={zoomXLeft} zoomYLeft={zoomYLeft}
                           zoomXRight={zoomXRight} zoomYRight={zoomYRight}
                           side="right"
                         />
                       )}
                     </motion.div>

                     <button
                       onClick={() => setCompareItem(null)}
                       className="absolute top-4 right-4 bg-[#FDFBF7]/80 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-[#1C1A17]/60 hover:text-[#1C1A17] hover:bg-[#FDFBF7] transition-all border border-[#A68A56]/20 shadow-2xl z-30"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                     </button>

                     {/* Winner Selection UI (Compare side) */}
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedItem(compareItem);
                             setCompareItem(null);
                             setIsBespokeModalOpen(true);
                           }}
                           className={`px-6 py-3 rounded-full backdrop-blur-md bg-white/20 border border-[#A68A56]/30 text-[#1C1A17] text-xs font-bold uppercase tracking-widest hover:bg-[#A68A56] hover:text-white transition-all shadow-xl flex items-center gap-2 whitespace-nowrap ${isTouchDevice ? 'cursor-pointer' : 'cursor-none'}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                          Choose This Design
                        </button>
                     </div>
                   </div>
                 )}
              </motion.div>

              {/* Data Panel - SILENT SPLIT SCREEN (Hides during comparison)
                  Phase 2 fix: overflow-y-auto so content scrolls on short mobile screens */}
              {!compareItem && (
                 <motion.div
                   layout
                   className={`shrink-0 flex flex-col justify-start lg:justify-center py-8 lg:py-0 ${
                     isMobile ? 'flex-1 w-full min-h-0 overflow-y-auto pb-32 px-4 sm:px-8' : 'w-full lg:w-[450px]'
                   }`}
                 >
                   {/* Primary Gallery Controls (Moved from absolute image overlay) */}
                   {selectedItem.gallery.length > 1 && (
                      <div className="flex items-center justify-start gap-3 mb-6 w-full">
                         <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev > 0 ? prev - 1 : selectedItem.gallery.length - 1); }} className="text-[#1C1A17]/50 hover:text-[#1C1A17]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                         {selectedItem.gallery.map((_, idx) => (
                           <button key={idx} onClick={(e) => { e.stopPropagation(); setGalleryIndex(idx); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${galleryIndex === idx ? 'bg-[#A68A56] scale-125' : 'bg-[#1C1A17]/20'}`} />
                         ))}
                         <button onClick={(e) => { e.stopPropagation(); setGalleryIndex(prev => prev < selectedItem.gallery.length - 1 ? prev + 1 : 0); }} className="text-[#1C1A17]/50 hover:text-[#1C1A17]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
                      </div>
                   )}

                   {/* Elegant Bronze Dash */}
                   <div className="w-12 h-[2px] bg-[#A68A56] mb-6" />
                   
                   <p className="text-[#A68A56] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                     {selectedItem.collection}
                   </p>
                   <h2 className="text-4xl lg:text-5xl font-light text-[#1C1A17] mb-6 leading-snug tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                     {selectedItem.name}
                   </h2>
                   <p className="text-[#1C1A17]/70 text-sm leading-relaxed mb-10 font-light">
                     {selectedItem.desc}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-3 mt-8 w-full">
                     <button 
                       onClick={() => setIsBespokeModalOpen(true)}
                       className={`w-full py-4 px-2 bg-[#A68A56] text-white rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17] active:scale-95 transition-all shadow-[0_0_30px_rgba(166,138,86,0.2)] ${isTouchDevice ? 'cursor-pointer' : 'cursor-none'}`}
                     >
                       Request Bespoke
                     </button>
                     <button 
                       onClick={() => { setComparePage(0); setIsCompareModalOpen(true); }}
                       className={`w-full py-4 px-2 bg-transparent border border-[#A68A56]/30 text-[#1C1A17] rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase text-center hover:bg-[#1C1A17]/5 transition-all ${isTouchDevice ? 'cursor-pointer' : 'cursor-none'}`}
                     >
                       Compare Models
                     </button>
                   </div>
                 </motion.div>
              )}
              
            </div>

            {/* Intercept Drawer (Similar Models) */}
            <AnimatePresence>
               {isInterceptDrawerOpen && (
                 <motion.div 
                   initial={{ y: "100%", opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   exit={{ y: "100%", opacity: 0 }}
                   transition={{ type: "spring", damping: 25, stiffness: 200 }}
                   className="absolute bottom-0 md:bottom-4 left-0 md:left-4 right-0 md:right-4 bg-[#FDFBF7]/95 backdrop-blur-3xl border-t md:border border-[#A68A56]/20 rounded-t-[2rem] md:rounded-[2rem] p-6 lg:p-8 z-50 shadow-2xl"
                 >
                    <h3 className="text-[#1C1A17]/80 text-sm tracking-widest uppercase font-bold mb-6">Similar in this Collection</h3>
                    <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory gap-4 pb-4 lg:pb-0 hide-scrollbar">
                      {getRecommendations().map(rec => (
                        <div 
                           key={rec.id} 
                           onClick={() => { setSelectedItem(rec); setIsInterceptDrawerOpen(false); }}
                           className="min-w-[70vw] sm:min-w-[40vw] lg:min-w-0 snap-center relative aspect-video rounded-xl overflow-hidden bg-white border border-[#A68A56]/20 cursor-pointer hover:border-[#A68A56] transition-all group"
                        >
                           <ImageKitLQIP item={rec.gallery[0]} width={400} className="absolute inset-0 w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#F4EFE6]/90 via-[#F4EFE6]/0 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-end p-4">
                             <p className="text-xs text-[#1C1A17] font-bold tracking-tight">{rec.name}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Compare Swatch Book
                Animation Routing:
                  Mobile  → Bottom-Sheet Drawer: slides up from 100% to 10vh (anchored feel)
                  Desktop → Centered Glass Modal: scales up from 0.95
                Phase 4 fix: invisible backdrop tap target in the 10vh gap to dismiss drawer on mobile */}
            {isCompareModalOpen && isMobile && (
              <div
                className="fixed top-0 left-0 w-full h-[10vh] z-[190]"
                onClick={() => setIsCompareModalOpen(false)}
                aria-label="Close compare panel"
              />
            )}
            <AnimatePresence>
            {isCompareModalOpen && (
              <motion.div
                key="compare-modal"
                initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, scale: 0.95 }}
                animate={isMobile ? { y: '10vh', opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, scale: 0.95 }}
                transition={isMobile
                  ? { type: 'spring', damping: 30, stiffness: 250 }
                  : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
                }
                className={`fixed bg-[#FDFBF7]/95 backdrop-blur-3xl z-[70] flex flex-col items-center
                  ${ isMobile
                    ? 'inset-x-0 bottom-0 top-0 rounded-t-[2rem] shadow-2xl border-t border-[#A68A56]/20 overflow-y-auto'
                    : 'inset-0 justify-center p-4 md:p-8'
                  }`}
              >
                
                <div className="absolute top-8 left-0 w-full px-8 flex justify-between items-center max-w-6xl mx-auto">
                  <h2 className="text-2xl font-light text-[#1C1A17]" style={{ fontFamily: "'Playfair Display', serif" }}>Select a Model to Compare</h2>
                  <button onClick={() => setIsCompareModalOpen(false)} className="w-12 h-12 rounded-full bg-[#1C1A17]/5 border border-[#A68A56]/20 flex items-center justify-center text-[#1C1A17] hover:bg-[#1C1A17]/10 transition-all shadow-sm"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>

                <div className="relative w-full max-w-6xl flex items-center justify-between mt-12 md:mt-16">
                  
                  {/* Left Arrow */}
                  <button 
                    onClick={() => setComparePage(p => Math.max(0, p - 1))}
                    disabled={comparePage === 0}
                    className="w-12 h-12 flex items-center justify-center rounded-full disabled:opacity-20 hover:bg-[#1C1A17]/5 transition-all text-[#1C1A17]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>

                  {/* Slider Window */}
                  <div className="flex-1 px-4 lg:px-12 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={comparePage}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 md:gap-6 w-full"
                      >
                         {currentCompareData.map(item => (
                           <div 
                             key={item.id}
                             onClick={() => { setCompareItem(item); setCompareGalleryIndex(0); setIsCompareModalOpen(false); }}
                             className="relative block w-full aspect-square rounded-2xl overflow-hidden shadow-xl border border-[#A68A56]/20 bg-white group cursor-pointer"
                           >
                              <ImageKitLQIP item={item.gallery[0]} width={400} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#F4EFE6] to-transparent">
                                <p className="text-[#1C1A17] text-xs font-bold leading-tight drop-shadow-md">{item.name}</p>
                              </div>
                           </div>
                         ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  <button 
                    onClick={() => setComparePage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={comparePage === totalPages - 1}
                    className="w-12 h-12 flex items-center justify-center rounded-full disabled:opacity-20 hover:bg-[#1C1A17]/5 transition-all text-[#1C1A17]"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>

                </div>

                {/* Page Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                   <p className="text-xs font-bold tracking-widest text-[#1C1A17]/50 uppercase">
                      Page {comparePage + 1} / {totalPages}
                   </p>
                </div>

              </motion.div>
            )}
            </AnimatePresence>

            {/* Bespoke Request Modal — Phase 3: real form fields + success state */}
            <AnimatePresence>
               {isBespokeModalOpen && (
                 <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute inset-0 z-[80] flex items-center justify-center p-4 bg-[#FDFBF7]/80 backdrop-blur-md overflow-y-auto"
                 >
                    <div className="bg-white border border-[#A68A56]/20 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative my-auto">
                       <button
                         onClick={() => { setIsBespokeModalOpen(false); setIsSubmitted(false); setBespokeForm({ name: '', email: '', phone: '', details: '' }); }}
                         className="absolute top-6 right-6 text-[#1C1A17]/50 hover:text-[#1C1A17] transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                       </button>

                       {isSubmitted ? (
                         /* ── SUCCESS STATE ── */
                         <motion.div
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="flex flex-col items-center py-4"
                         >
                           <div className="w-16 h-16 rounded-full border border-[#A68A56]/40 flex items-center justify-center mb-6">
                             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A68A56" strokeWidth="1.5"><path d="M20 6L9 17l-5-5"/></svg>
                           </div>
                           <div className="w-12 h-[2px] bg-[#A68A56] mx-auto mb-6" />
                           <h2 className="text-2xl font-light text-[#1C1A17] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Inquiry Received</h2>
                           <p className="text-[#1C1A17]/70 text-sm leading-relaxed">
                             Thank you. A bespoke artisan will contact you shortly to discuss your vision.
                           </p>
                         </motion.div>
                       ) : (
                         /* ── FORM STATE ── */
                         <>
                           <div className="w-12 h-[2px] bg-[#A68A56] mx-auto mb-6" />
                           <h2 className="text-3xl font-light text-[#1C1A17] mb-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Request Bespoke</h2>
                           <p className="text-[#A68A56] text-xs font-bold uppercase tracking-[0.2em] mb-8">{selectedItem.name}</p>

                           <form
                             onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}
                             className="flex flex-col gap-6 text-left"
                           >
                             {/* Name */}
                             <div className="flex flex-col gap-1">
                               <label className="text-[#1C1A17]/50 text-[0.65rem] uppercase tracking-[0.2em]">Full Name *</label>
                               <input
                                 type="text" required
                                 value={bespokeForm.name}
                                 onChange={e => setBespokeForm(f => ({ ...f, name: e.target.value }))}
                                 className="bg-transparent border-b border-[#A68A56]/40 focus:border-[#A68A56] outline-none py-2 text-sm text-[#1C1A17] placeholder:text-[#1C1A17]/30 transition-colors"
                                 placeholder="Your full name"
                               />
                             </div>
                             {/* Email */}
                             <div className="flex flex-col gap-1">
                               <label className="text-[#1C1A17]/50 text-[0.65rem] uppercase tracking-[0.2em]">Email *</label>
                               <input
                                 type="email" required
                                 value={bespokeForm.email}
                                 onChange={e => setBespokeForm(f => ({ ...f, email: e.target.value }))}
                                 className="bg-transparent border-b border-[#A68A56]/40 focus:border-[#A68A56] outline-none py-2 text-sm text-[#1C1A17] placeholder:text-[#1C1A17]/30 transition-colors"
                                 placeholder="your@email.com"
                               />
                             </div>
                             {/* Phone */}
                             <div className="flex flex-col gap-1">
                               <label className="text-[#1C1A17]/50 text-[0.65rem] uppercase tracking-[0.2em]">Phone</label>
                               <input
                                 type="tel"
                                 value={bespokeForm.phone}
                                 onChange={e => setBespokeForm(f => ({ ...f, phone: e.target.value }))}
                                 className="bg-transparent border-b border-[#A68A56]/40 focus:border-[#A68A56] outline-none py-2 text-sm text-[#1C1A17] placeholder:text-[#1C1A17]/30 transition-colors"
                                 placeholder="+971 xx xxx xxxx"
                               />
                             </div>
                             {/* Additional Details */}
                             <div className="flex flex-col gap-1">
                               <label className="text-[#1C1A17]/50 text-[0.65rem] uppercase tracking-[0.2em]">Additional Details</label>
                               <textarea
                                 rows={3}
                                 value={bespokeForm.details}
                                 onChange={e => setBespokeForm(f => ({ ...f, details: e.target.value }))}
                                 className="bg-transparent border-b border-[#A68A56]/40 focus:border-[#A68A56] outline-none py-2 text-sm text-[#1C1A17] placeholder:text-[#1C1A17]/30 transition-colors resize-none"
                                 placeholder="Fabric preference, dimensions, delivery timeline…"
                               />
                             </div>

                             <button
                               type="submit"
                               className="mt-2 px-10 py-4 w-full bg-[#A68A56] text-white rounded-full uppercase tracking-widest text-xs font-bold shadow-lg hover:bg-[#1C1A17] active:scale-95 transition-all"
                             >
                               Submit Inquiry
                             </button>
                           </form>
                         </>
                       )}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------- */}
      {/* EXIT INTENT BLOCKER                                         */}
      {/* ----------------------------------------------------------- */}
      <AnimatePresence>
         {isExitIntentOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/95 backdrop-blur-3xl p-8"
            >
               <div className="max-w-2xl text-center flex flex-col items-center">
                  <div className="w-12 h-[2px] bg-[#A68A56] mb-8" />
                  <h1 className="text-5xl md:text-7xl font-light text-[#1C1A17] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Before you leave, let us build your vision.
                  </h1>
                  <p className="text-[#1C1A17]/70 text-lg md:text-xl font-light mb-12">
                    Our master artisans are ready to customize any piece to your exact specifications. Don't settle for standard.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                    <button className="px-10 py-5 bg-[#A68A56] text-white rounded-full text-sm font-bold uppercase tracking-[0.15em] shadow-[0_0_30px_rgba(166,138,86,0.3)] hover:scale-105 transition-all">
                      Contact a Designer
                    </button>
                    <button 
                      onClick={() => setIsExitIntentOpen(false)}
                      className="px-10 py-5 bg-transparent border border-[#A68A56]/30 text-[#1C1A17] rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:bg-[#1C1A17]/5 transition-all"
                    >
                      Return to Gallery
                    </button>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
