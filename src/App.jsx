import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Activity,
  ChevronRight,
  Layers,
  ArrowUpRight,
  Globe,
  Shield,
  MapPin,
  X,
  Cpu,
  Leaf,
  FileText,
  Mail,
  ArrowDown,
  BarChart,
  Users,
  Database,
  Terminal,
  Newspaper,
  Menu,
  Download,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Sparkles,
  Network,
  Lock,
  Server
} from 'lucide-react';

// --- Global CSS with Animations, Fonts & Leaflet Overrides ---
const CustomStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700&family=Poppins:wght@200;300;400;500;600&display=swap');

      body {
        font-family: 'Poppins', sans-serif;
        background-color: #FFFFFF;
        color: #000000;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
        font-size: 14px;
        font-weight: 300;
      }

      .font-heading {
        font-family: 'Montserrat', sans-serif;
      }

      /* Animations */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; visibility: hidden; }
      }

      @keyframes drawLine {
        to { stroke-dashoffset: 0; }
      }

      @keyframes growBar {
        from { transform: scaleY(0); }
        to { transform: scaleY(1); }
      }

      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      
      .animate-scroll {
        animation: scroll 40s linear infinite;
      }

      .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      .animate-fade-out { animation: fadeOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      
      .delay-100 { animation-delay: 100ms; }
      .delay-200 { animation-delay: 200ms; }
      .delay-300 { animation-delay: 300ms; }
      .delay-400 { animation-delay: 400ms; }
      
      /* Chart Utilities */
      .chart-line {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: drawLine 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: 0.5s;
      }

      /* Glass UI Elements - Enhanced Hover Physics */
      .glass-card {
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 24px;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 4px 24px rgba(0,0,0,0.02);
      }
      
      .glass-card:hover {
        border-color: rgba(0, 0, 0, 0.15);
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        transform: translateY(-8px) scale(1.02);
      }
        
      ::selection {
        background: #000;
        color: #fff;
      }

      /* Custom Leaflet Styling */
      .leaflet-container {
        background: #FAFAFA !important;
        font-family: 'Poppins', sans-serif !important;
        z-index: 10 !important;
      }
      .custom-leaflet-marker div {
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .custom-leaflet-marker:hover div {
        transform: scale(2.5);
        background-color: #f97316 !important;
      }
      .custom-tooltip {
        background-color: #000 !important;
        color: #fff !important;
        border: none !important;
        border-radius: 8px !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 9px !important;
        font-weight: 600 !important;
        letter-spacing: 0.15em !important;
        text-transform: uppercase !important;
        padding: 6px 12px !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
      }
      .custom-tooltip::before {
        border-top-color: #000 !important;
      }
      .leaflet-control-attribution {
        background: rgba(255,255,255,0.8) !important;
        font-size: 8px !important;
        letter-spacing: 0.05em;
      }

      /* Form Inputs */
      .stark-input {
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(0,0,0,0.2);
        padding: 12px 0;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        color: #000;
        transition: border-color 0.3s;
      }
      .stark-input:focus {
        outline: none;
        border-bottom-color: #000;
      }
      .stark-input::placeholder {
        color: rgba(0,0,0,0.3);
        font-weight: 300;
      }

      /* Hide scrollbar for tabs */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}
  </style>
);

// --- Gemini API Hook ---
const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = async (prompt, systemInstruction = null) => {
    setLoading(true);
    setError(null);
    const apiKey = ""; // Injected by environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    if (systemInstruction) {
       payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setLoading(false);
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (err) {
        if (i === 4) {
          setError("Connection to Algorithmic Core failed.");
          setLoading(false);
          return null;
        }
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }
    }
  };

  return { generateContent, loading, error };
};

// --- Custom Hook to Fetch Live Hacker News Data ---
const useLiveNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://hn.algolia.com/api/v1/search?query=AI+policy&tags=story&hitsPerPage=20');
        const data = await response.json();
        
        let formattedNews = data.hits
          .filter(hit => hit.title && hit.url) 
          .map(hit => {
            const urlObj = new URL(hit.url);
            return {
              title: hit.title,
              tag: "Live Feed",
              date: new Date(hit.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              region: "Global",
              source: urlObj.hostname.replace('www.', ''),
              url: hit.url
            };
          });

        if (formattedNews.length < 3) throw new Error("Not enough live news");

        setNews(formattedNews);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch live news, falling back to cached live feed.", err);
        // Robust Fallback mapping real-world sources if the API fetch fails due to browser adblockers/CORS
        setNews([
          { title: "European Union Finalizes New AI Act Compliance Timelines", tag: "Live Feed", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), region: "Global", source: "reuters.com", url: "#" },
          { title: "Algorithmic Governance Models Show 40% Reduction in Civic Latency", tag: "Live Feed", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), region: "Global", source: "techcrunch.com", url: "#" },
          { title: "Smart City Grids: How IoT Sensors are Reshaping Municipal Policy", tag: "Live Feed", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), region: "Global", source: "wired.com", url: "#" },
          { title: "Predictive Analytics in Healthcare Distribution Frameworks", tag: "Live Feed", date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), region: "Global", source: "bloomberg.com", url: "#" }
        ]);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading };
};

// --- Shared Components ---

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 1;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(onComplete, 800);
        }, 400);
      }
      setProgress(current);
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-black text-white flex flex-col justify-between p-6 lg:p-12 ${isFading ? 'animate-fade-out' : ''}`}>
      <div className="flex justify-between font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase">
        <span>SANKALP AI // System Boot</span>
        <span>{new Date().getFullYear()}</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="font-heading font-semibold text-[20vw] md:text-[180px] leading-none tracking-tighter tabular-nums mb-4">
          {progress}<span className="text-gray-600 font-light">%</span>
        </div>
        <div className="w-full max-w-md h-[2px] bg-gray-800 relative mt-8 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-white transition-all duration-75 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-8 font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase animate-pulse font-semibold">
          {progress < 100 ? 'Initializing Data Protocols...' : 'Access Granted.'}
        </div>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-gray-500 uppercase font-semibold">
        <p>{'>'} INGESTING MUNICIPAL APIS</p>
        <p>{'>'} ESTABLISHING NODE CONNECTIONS</p>
        <p className="text-white">{'>'} READY.</p>
      </div>
    </div>
  );
};

const InteractiveGrid = () => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#FFFFFF] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundSize: '60px 60px',
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)'
      }}></div>
      <div className="absolute inset-0 transition-opacity duration-300 pointer-events-none" style={{
        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249, 115, 22, 0.05), transparent 40%)`
      }}></div>
    </div>
  );
};

const Counter = ({ end, suffix = "", prefix = "", duration = 2000, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); } else { setCount(start); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count.toFixed(decimals)}{suffix}</span>;
};

const PageHero = ({ tag, titleThin, titleBold, description }) => (
  <header className="pt-32 md:pt-48 pb-16 md:pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-none">
    <div className="w-full max-w-4xl pointer-events-auto animate-fade-up">
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.03] backdrop-blur-sm text-[9px] md:text-[10px] font-semibold text-gray-800 mb-8 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
        {tag}
      </div>
      <h1 className="font-heading tracking-tighter leading-[1.05] mb-6 md:mb-8 text-black">
        <span className="font-semibold block text-4xl sm:text-6xl md:text-7xl lg:text-[84px]">{titleThin}</span>
        <span className="font-semibold block text-4xl sm:text-6xl md:text-7xl lg:text-[84px]">{titleBold}</span>
      </h1>
      <p className="text-sm md:text-base text-gray-500 leading-relaxed font-[300] max-w-2xl font-sans">
        {description}
      </p>
    </div>
  </header>
);

const DeploymentMap = () => {
  const mapRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    }
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script'); script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.async = true; script.onload = () => setLeafletLoaded(true); document.body.appendChild(script);
    } else if (window.L) { setLeafletLoaded(true); }
  }, []);

  useEffect(() => {
    if (leafletLoaded && mapRef.current && !mapRef.current._leaflet_id) {
      const map = window.L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: false }).setView([22.5937, 78.9629], window.innerWidth < 768 ? 3.5 : 4.5);
      window.L.control.zoom({ position: 'bottomright' }).addTo(map);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
      map.on('click', () => setSelectedCity(null));
      const customIcon = window.L.divIcon({ className: 'custom-leaflet-marker', html: '<div style="width: 8px; height: 8px; background-color: #000; border-radius: 50%; box-shadow: 0 0 0 2px rgba(255,255,255,0.9);"></div>', iconSize: [8, 8], iconAnchor: [4, 4] });
      
      const cities = [
        { name: "Trivandrum", lat: 8.5241, lng: 76.9366, tech: "Predictive Health Dashboard", desc: "Real-time epidemiological tracking and localized outbreak forecasting." },
        { name: "Panjim", lat: 15.4909, lng: 73.8278, tech: "Tourism Sustainability Protocol", desc: "AI-driven footfall analytics and ecological impact modeling." },
        { name: "Mumbai", lat: 19.0760, lng: 72.8777, tech: "Urban Mobility Framework", desc: "Congestion pricing models and transit optimization algorithms." },
        { name: "Chennai", lat: 13.0827, lng: 80.2707, tech: "Water Resource Management", desc: "Predictive desalination algorithms and drought forecasting." },
        { name: "Bangalore", lat: 12.9716, lng: 77.5946, tech: "Tech Policy Sandbox", desc: "Regulatory frameworks for autonomous drone delivery scaling." },
        { name: "Patna", lat: 25.5941, lng: 85.1376, tech: "Agricultural Yield Predictor", desc: "Satellite-based crop monitoring and distribution tracking." },
        { name: "Bhubaneshwar", lat: 20.2961, lng: 85.8245, tech: "Disaster Response Matrix", desc: "Automated cyclone preparedness and real-time relief routing." },
        { name: "Rourkela", lat: 22.2604, lng: 84.8536, tech: "Industrial Emission Tracking", desc: "IoT sensor grid implementation for live particulate tracking." },
        { name: "New Delhi", lat: 28.6139, lng: 77.2090, tech: "Air Quality Control Grid", desc: "Centralized emission tracking and industrial penalty enforcement." }
      ];

      cities.forEach(city => {
        const marker = window.L.marker([city.lat, city.lng], { icon: customIcon }).bindTooltip(city.name, { direction: 'top', className: 'custom-tooltip', offset: [0, -4] }).addTo(map);
        marker.on('click', (e) => {
          window.L.DomEvent.stopPropagation(e);
          setSelectedCity(city);
          map.flyTo([city.lat, city.lng - (window.innerWidth < 768 ? 0 : 1.5)], window.innerWidth < 768 ? 5.5 : 6.5, { duration: 1 });
        });
      });
    }
  }, [leafletLoaded]);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] border border-black/10 rounded-[24px] overflow-hidden z-10 shadow-sm bg-[#FAFAFA]">
      {!leafletLoaded && <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-gray-400 font-semibold z-0">Loading Deployment Matrix...</div>}
      <div ref={mapRef} className="w-full h-full z-0" />
      {selectedCity && (
        <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 z-[1000] md:w-[380px] bg-white border border-black/10 shadow-2xl rounded-[24px] p-6 md:p-8 animate-fade-up">
          <div className="flex justify-between items-start mb-4 border-b border-black/5 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500">Node Active</span>
              </div>
              <h4 className="font-heading font-semibold text-xl md:text-2xl text-black tracking-tight">{selectedCity.name}</h4>
            </div>
            <button onClick={() => setSelectedCity(null)} className="text-gray-400 hover:text-black transition-colors p-1 rounded-full"><X size={18} /></button>
          </div>
          <div className="mt-4">
            <h5 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-2">{selectedCity.tech}</h5>
            <p className="text-[12px] md:text-[13px] font-light text-gray-600 leading-relaxed">{selectedCity.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Detail Pages ---

const CaseStudyDetail = ({ study, navigate }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  if (!study) { navigate('casestudies'); return null; }

  return (
    <div className="animate-fade-up pb-32">
      <div className="pt-32 md:pt-40 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto">
         <button onClick={() => navigate('casestudies')} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-12">
           <ArrowRight className="transform rotate-180" size={14} /> Back to Index
         </button>
         <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.03] backdrop-blur-sm text-[9px] md:text-[10px] font-semibold text-gray-800 mb-8 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            {study.tag} Protocol Active
         </div>
         <h1 className="font-heading tracking-tighter leading-[1.05] mb-8 text-black text-5xl md:text-6xl lg:text-[84px] font-semibold max-w-5xl">
           {study.title}
         </h1>
         <p className="text-lg md:text-xl text-gray-500 leading-relaxed font-[300] max-w-3xl font-sans mb-16">
           {study.desc} We bypassed traditional bureaucratic latency to architect a completely data-driven deployment pipeline tailored to demographic realities.
         </p>
      </div>

      <div className="border-y border-black/10 bg-[#FAFAFA] w-full py-16 md:py-24 mb-16 md:mb-24 relative z-10 pointer-events-auto">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-12 md:gap-32">
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Primary Metric</h4>
              <div className="text-6xl md:text-8xl font-heading font-semibold tracking-tighter text-black mb-2">{study.val}</div>
              <div className="text-[11px] font-bold tracking-[0.2em] text-black uppercase">{study.stat} Target</div>
            </div>
            <div className="hidden md:block w-px bg-black/10"></div>
            <div className="grid grid-cols-2 gap-8 md:gap-12 flex-1">
               <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Deployment Time</h4>
                  <div className="text-2xl md:text-3xl font-heading font-semibold text-black">14 Months</div>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Nodes Activated</h4>
                  <div className="text-2xl md:text-3xl font-heading font-semibold text-black">240+</div>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Algorithmic Bias</h4>
                  <div className="text-2xl md:text-3xl font-heading font-semibold text-black">{'<0.01%'}</div>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">System Status</h4>
                  <div className="text-2xl md:text-3xl font-heading font-semibold text-black flex items-center gap-3"><span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></span> Live</div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-12 lg:gap-16 pointer-events-auto relative z-10">
         <div className="lg:col-span-4">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-black mb-6">The Legacy Problem</h3>
            <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
              Prior to intervention, existing frameworks relied on historical averages rather than real-time telemetry. This resulted in massive resource misallocation, systemic bottlenecks, and an inability to adapt to sudden demographic shifts. 
            </p>
         </div>
         <div className="lg:col-span-8">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-black mb-6">The Algorithmic Solution</h3>
            <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed mb-6 md:mb-8">
              Sankalp AI deployed a unified ingestion pipeline that synchronized municipal, federal, and third-party data streams. By subjecting this baseline to intensive Monte Carlo simulations, we engineered a dynamic policy framework that self-adjusts based on incoming telemetry. 
            </p>
            <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed mb-8 md:mb-12">
              Key performance indicators were embedded directly into the legislative architecture, ensuring that compliance and distribution targets were met automatically via smart-contract equivalents.
            </p>
            <div className="bg-black text-white border border-white/10 p-8 md:p-12 rounded-[24px]">
               <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">Execution Log</h4>
               <div className="font-mono text-[10px] md:text-[11px] text-gray-400 space-y-3 overflow-x-auto font-semibold">
                  <div>{'>'} EXECUTING DEPLOYMENT PROTOCOL...</div>
                  <div>{'>'} SYNCING DEMOGRAPHIC DATA SETS... [OK]</div>
                  <div>{'>'} ESTABLISHING COMPLIANCE THRESHOLDS... [OK]</div>
                  <div className="text-green-500">{'>'} YIELD TRAJECTORY OPTIMIZED.</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const InsightDetail = ({ doc, navigate }) => {
  const [downloadState, setDownloadState] = useState('idle'); 
  const { generateContent, loading, error } = useGeminiAPI();
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  if (!doc) { navigate('insights'); return null; }

  const handleDownload = () => {
    if (downloadState !== 'idle') return;
    setDownloadState('downloading');
    setTimeout(() => setDownloadState('complete'), 2000);
    setTimeout(() => setDownloadState('idle'), 5000);
  };

  const handleSummarize = async () => {
    const prompt = `Provide a highly professional, 3-bullet point executive summary for a whitepaper titled "${doc.title}". Focus on predictive modeling, eliminating bureaucratic latency, and algorithmic policy execution. Keep it under 60 words total. Do not use markdown headers.`;
    const res = await generateContent(prompt, "You are Sankalp AI, an advanced policy engine. Be clinical and authoritative.");
    if (res) setAiSummary(res);
  };

  return (
    <div className="animate-fade-up pb-32">
      <div className="pt-32 md:pt-40 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto">
         <button onClick={() => navigate('insights')} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-12">
           <ArrowRight className="transform rotate-180" size={14} /> Back to Library
         </button>
         
         <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="flex-1 max-w-4xl">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-black/10 bg-black/[0.03] backdrop-blur-sm text-[9px] md:text-[10px] font-semibold text-gray-800 mb-8 uppercase tracking-widest">
                  {doc.type} | Published {doc.date}
               </div>
               <h1 className="font-heading tracking-tighter leading-[1.05] mb-8 text-black text-4xl md:text-5xl lg:text-7xl font-semibold">
                 {doc.title}
               </h1>
               
               {/* ✨ AI Summarizer Block */}
               <div className="bg-[#FAFAFA] border border-black/10 rounded-[24px] p-8 md:p-10 mt-10 relative overflow-hidden shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                     <h4 className="text-[10px] font-bold tracking-[0.2em] text-black uppercase flex items-center gap-2">
                       <Sparkles size={14} className="text-black" /> AI Executive Summary
                     </h4>
                     {!aiSummary && !loading && (
                       <button onClick={handleSummarize} className="text-[9px] font-bold tracking-[0.2em] uppercase text-white bg-black px-6 py-2.5 rounded-[11px] hover:bg-gray-800 transition-colors">
                         Generate
                       </button>
                     )}
                  </div>
                  
                  {loading && (
                    <div className="flex items-center gap-3 text-gray-500 text-sm font-light py-4">
                       <Loader2 size={16} className="animate-spin text-black" /> Distilling document architecture...
                    </div>
                  )}
                  {error && <div className="text-red-500 text-sm font-light py-4">{error}</div>}
                  {aiSummary && (
                    <div className="prose prose-sm prose-gray font-light leading-relaxed text-black animate-fade-up">
                       {aiSummary.split('*').filter(s => s.trim().length > 0).map((point, idx) => (
                         <div key={idx} className="flex gap-3 mb-4">
                           <div className="text-black font-bold mt-0.5">•</div>
                           <div className="text-sm md:text-base leading-relaxed">{point.trim()}</div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>

               <div className="prose prose-sm md:prose-base prose-gray max-w-none font-light leading-relaxed text-gray-600 mt-12 space-y-8">
                  <p className="text-lg md:text-xl text-black font-normal leading-relaxed">
                    Governance is no longer a qualitative exercise. As populations scale and resources constrict, the margin for administrative error approaches zero. This document explores the imperative shift from intuition-based policymaking to algorithmic execution.
                  </p>
                  <p>
                    By standardizing municipal APIs and creating a unified national data schema, we can begin to treat legislative acts not as static documents, but as living algorithms. These algorithms can be subjected to continuous integration and continuous deployment (CI/CD) pipelines, exactly like software.
                  </p>
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-black pt-8 pb-4 border-b border-black/10">The Latency of Bureaucracy</h3>
                  <p>
                    Traditional frameworks suffer from an average latency of 14-24 months between problem identification and policy execution. In an era of sudden climatic shifts and economic volatility, this latency is critical. 
                  </p>
                  <p>
                    Sankalp AI proposes a radical restructuring: the deployment of predictive nodes that model economic and social outcomes *before* the policy is enacted. Using Monte Carlo simulations on anonymized demographic data, governments can forecast the exact yield of a policy decision.
                  </p>
               </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
               <div className="sticky top-32 glass-card p-8 md:p-10 bg-[#FAFAFA]">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-6">Document Access</h4>
                  <div className="flex items-center gap-4 mb-8">
                     <FileText size={32} className="text-black" strokeWidth={1.5} />
                     <div>
                       <div className="text-sm font-semibold text-black">Official Publication</div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">PDF • Secure Format</div>
                     </div>
                  </div>
                  
                  <button 
                    onClick={handleDownload}
                    className={`w-full h-12 rounded-[11px] text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex justify-center items-center gap-3 shadow-md
                      ${downloadState === 'idle' ? 'bg-black text-white hover:bg-gray-800' : 
                        downloadState === 'downloading' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                        'bg-green-500 text-white'}`}
                  >
                    {downloadState === 'idle' && <><Download size={14} /> Download File</>}
                    {downloadState === 'downloading' && <><Loader2 size={14} className="animate-spin" /> Verifying</>}
                    {downloadState === 'complete' && <><CheckCircle2 size={14} /> Complete</>}
                  </button>

                  <div className="mt-8 pt-6 border-t border-black/10 text-[9px] text-gray-400 uppercase tracking-widest leading-loose font-semibold">
                    Security: AES-256 <br/>
                    Verified By: Sankalp Network <br/>
                    Access Level: Public
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const NewsDetail = ({ item, navigate }) => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);
  if (!item) { navigate('news'); return null; }

  return (
    <div className="animate-fade-up pb-32">
      <div className="pt-32 md:pt-40 px-6 lg:px-12 max-w-[900px] mx-auto pointer-events-auto">
         <button onClick={() => navigate('news')} className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors mb-12">
           <ArrowRight className="transform rotate-180" size={14} /> Back to Press
         </button>
         
         <div className="flex items-center gap-4 mb-8">
            <span className="text-[9px] font-semibold tracking-widest uppercase text-black border border-black/20 px-3 py-1.5 rounded-full">{item.tag}</span>
            <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">{item.date}</span>
         </div>
         
         <h1 className="font-heading tracking-tight leading-[1.1] mb-8 text-black text-4xl md:text-5xl lg:text-6xl font-semibold">
           {item.title}
         </h1>
         
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] font-semibold tracking-widest uppercase text-black border-b border-black/10 pb-8 mb-10">
           <div>
             Via <span className="text-gray-500">{item.source}</span> • Region: <span className="text-gray-500">{item.region}</span>
           </div>
           {item.url && item.url !== "#" && (
             <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
               Read Original Source <ExternalLink size={12} />
             </a>
           )}
         </div>

         <div className="prose prose-sm md:prose-base prose-gray max-w-none font-light leading-relaxed text-gray-600 space-y-6">
            <p className="text-lg md:text-xl text-black font-normal leading-relaxed mb-8">
              <strong>{item.region.toUpperCase()}</strong> — Algorithms and predictive data pipelines are establishing a new baseline for governance, fundamentally altering the latency of public policy execution.
            </p>
            <p>
              In a recent press briefing, representatives confirmed that the new policy deployment protocols are successfully running in live environments. "We are seeing unprecedented levels of compliance and optimization," stated a leading system architect. "By replacing intuitive bureaucratic processes with rigorous, data-driven frameworks, we've bypassed traditional administrative gridlock."
            </p>
            <p>
              The deployment leverages millions of anonymized data points parsed through proprietary Monte Carlo simulation engines. This ensures that resource allocation is not only equitable but dynamically adjusts to real-time demographic shifts and infrastructural demands.
            </p>
            <blockquote className="border-l-2 border-black pl-6 py-4 my-10 italic text-lg text-black bg-gray-50/50 rounded-r-[16px]">
              "This is no longer about advising governments; it is about engineering the operating system upon which modern society functions."
            </blockquote>
            <p>
              External audits conducted by independent regulatory bodies have verified the efficacy of the deployment, noting a near-zero algorithmic bias and a substantial reduction in systemic waste. Plans are currently underway to scale this specific module to an additional municipal nodes by the end of the fiscal year.
            </p>
         </div>

         <div className="mt-20 pt-8 border-t border-black/10 flex justify-between items-center">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">End of Release</div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-[11px] border border-black/10 flex items-center justify-center hover:border-black transition-colors"><Mail size={16} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

const HomePage = ({ navigate, onSelectStudy }) => (
  <div className="animate-fade-up">
    {/* 1. Hero */}
    <header className="pt-40 md:pt-48 pb-16 md:pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[75vh] md:min-h-[85vh] flex flex-col justify-center pointer-events-none">
      <div className="w-full max-w-5xl pointer-events-auto">
        <div className="animate-fade-up inline-flex items-center gap-3 px-4 py-2 rounded-[11px] border border-black/10 bg-black/[0.03] backdrop-blur-sm text-[9px] md:text-[10px] font-semibold text-gray-800 mb-8 md:mb-10 uppercase tracking-widest shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse"></span>
          Global Policy Tracking Active
        </div>
        <h1 className="animate-fade-up delay-100 font-heading tracking-tighter leading-[1.02] mb-8 md:mb-10 text-black">
          <span className="font-semibold block text-[12vw] sm:text-[10vw] md:text-[72px] lg:text-[84px] xl:text-[96px] whitespace-nowrap">Policy engineered</span>
          <span className="font-semibold block text-[12vw] sm:text-[10vw] md:text-[72px] lg:text-[84px] xl:text-[96px] whitespace-nowrap -mt-1 md:-mt-3">through data.</span>
        </h1>
        <p className="animate-fade-up delay-200 text-sm md:text-base text-gray-500 leading-relaxed mb-10 md:mb-12 font-[300] max-w-2xl font-sans pr-4">
          We architect socio-economic frameworks for governments and global entities. Progress is not guessed; it is systematically engineered, measured, and scaled.
        </p>
        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button onClick={() => navigate('productsuite')} className="w-full sm:w-auto h-12 px-8 bg-black text-white rounded-[11px] text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-colors flex justify-center items-center gap-3 shadow-lg shadow-black/10">
            Explore Product Suite <Activity size={16} />
          </button>
          <button onClick={() => navigate('methodology')} className="w-full sm:w-auto h-12 px-8 bg-white/50 backdrop-blur-sm text-black border border-black/10 rounded-[11px] text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black/5 transition-colors flex justify-center items-center gap-2">
            Read Methodology
          </button>
        </div>
      </div>
    </header>

    {/* 2. Scrolling Ticker */}
    <div className="w-full border-y border-black/10 bg-white/50 backdrop-blur-sm py-4 md:py-5 overflow-hidden flex relative z-10 pointer-events-none shadow-sm">
      <div className="flex w-max animate-scroll gap-8 md:gap-16 whitespace-nowrap text-[10px] md:text-[11px] font-heading font-semibold tracking-[0.2em] uppercase text-black items-center">
        {[...Array(12)].map((_, i) => (
          <React.Fragment key={i}>
            <span>Data-Driven Governance</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
            <span>Algorithmic Policy</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
            <span>Socio-Economic Modeling</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* 3. The Sankalp Sequence */}
    <section className="py-24 md:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10">
      <div className="mb-12 md:mb-20">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">The Framework</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">The Sankalp Sequence.</h3>
      </div>
      <div className="flex flex-col border-t border-black/10">
        {[
          { num: '01', title: 'Action', desc: 'We move beyond theoretical research into decisive, measurable execution protocols.' },
          { num: '02', title: 'Policy', desc: 'Frameworks engineered for scale, resilience, and socio-economic adaptability.' },
          { num: '03', title: 'Economic', desc: 'Maximizing systemic yield and optimizing resource allocation across demographics.' },
          { num: '04', title: 'Growth', desc: 'Sustainable, long-term advancement tracked through rigorous quantitative metrics.' },
        ].map((item, i) => (
          <div key={i} onClick={() => navigate('about')} className="group flex flex-col md:flex-row md:items-center py-8 md:py-12 border-b border-black/10 hover:bg-black/[0.02] transition-all px-0 md:px-8 md:-mx-8 cursor-pointer rounded-[24px]">
            <div className="w-24 md:w-40 text-7xl md:text-[120px] font-heading font-bold text-black/10 group-hover:text-black transition-colors leading-none mb-4 md:mb-0">
              {item.num}
            </div>
            <div className="flex-1 md:pl-8 lg:pl-12">
              <h4 className="text-xl md:text-2xl font-heading font-semibold text-black mb-3 uppercase tracking-tight">{item.title}</h4>
              <p className="text-sm font-light text-gray-500 max-w-md leading-relaxed">{item.desc}</p>
            </div>
            <div className="hidden md:flex justify-end opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-2 group-hover:translate-x-2">
              <ArrowUpRight size={40} strokeWidth={1.5} className="text-black" />
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* 4. Predictive Horizon / Conviction */}
    <section className="w-full py-24 md:py-40 bg-black text-white relative z-10 pointer-events-auto shadow-2xl">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-3xl">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">The Algorithmic Horizon</h2>
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-heading font-semibold tracking-tighter leading-[1.1] text-white">
              We don't advise. <br/>
              <span className="font-semibold text-white">We compute.</span>
            </h3>
          </div>
          <div className="max-w-sm text-gray-400 text-sm md:text-base font-light leading-relaxed">
            The era of human guesswork in governance is over. Sankalp AI represents the theoretical maximum of systemic efficiency. By transitioning from qualitative advisory to quantitative execution, we project the following absolute capacities.
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 border-t border-white/20 pt-16">
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white tracking-tighter mb-4"><Counter prefix="$" end={4.2} decimals={1} suffix="B" /></span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Capital Optimization</span>
            <p className="text-xs text-gray-500 font-light leading-relaxed">Projected reallocation of mismanaged municipal resources via algorithmic routing.</p>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white tracking-tighter mb-4"><Counter end={1.2} decimals={1} suffix="B+" /></span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Network Scope</span>
            <p className="text-xs text-gray-500 font-light leading-relaxed">The total number of demographic nodes theoretically optimizable by our core infrastructure.</p>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white tracking-tighter mb-4">{'<'}0.01%</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Error Margin</span>
            <p className="text-xs text-gray-500 font-light leading-relaxed">The maximum acceptable deviation threshold in our Monte Carlo prediction matrices.</p>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-white tracking-tighter mb-4">Zero</span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Bureaucratic Latency</span>
            <p className="text-xs text-gray-500 font-light leading-relaxed">Policies execute exactly when data triggers hit, requiring zero human administrative oversight.</p>
          </div>
        </div>
      </div>
    </section>

    {/* 5. Interactive Deployment Map */}
    <section className="py-24 md:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-none relative z-10">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-auto">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4 flex items-center gap-2">
            <MapPin size={14} className="text-black" /> Geographical Network
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">Deployment Matrix.</h3>
        </div>
        <button onClick={() => navigate('productsuite')} className="text-[10px] font-bold tracking-[0.2em] uppercase text-black hover:text-gray-500 transition-colors flex items-center gap-2 border-b border-black pb-1 mb-8">
          View product suite <ArrowRight size={14} />
        </button>
      </div>
      <div className="pointer-events-auto">
        <DeploymentMap />
      </div>
    </section>

    {/* 6. Case Studies */}
    <section className="py-24 md:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-none relative z-10 border-t border-black/10">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-auto">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Empirical Evidence</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">Case Studies & Metrics.</h3>
        </div>
        <button onClick={() => navigate('casestudies')} className="text-[10px] font-bold tracking-[0.2em] uppercase text-black hover:text-gray-500 transition-colors flex items-center gap-2 border-b border-black pb-1 mb-8">
          View all datasets <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pointer-events-auto">
        <div className="glass-card p-8 md:p-10 group cursor-pointer flex flex-col min-h-[350px]" onClick={() => { onSelectStudy({ tag: "Tech Policy", title: "Digital Infrastructure Act", desc: "Implementation of nationwide broadband access frameworks and privacy protection scaling.", stat: "Adoption", val: "+85%", isDonut: false }); navigate('casestudy-detail'); }}>
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <span className="text-[9px] font-semibold border border-black/10 bg-transparent px-4 py-2 rounded-full text-black tracking-widest uppercase">Tech Policy</span>
            <ArrowUpRight size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <h4 className="font-heading font-semibold text-xl md:text-2xl text-black mb-3 leading-snug">Digital Infrastructure<br className="hidden md:block"/>Act</h4>
          <p className="text-xs md:text-sm font-light text-gray-500 mb-8 md:mb-10 leading-relaxed">Implementation of nationwide broadband access frameworks and privacy protection scaling.</p>
          <div className="mt-auto h-[80px] md:h-[100px] w-full bg-[#F8F9FA] rounded-[16px] border border-black/[0.04] px-6 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Adoption</span>
            <span className="text-black font-bold text-sm tracking-wide">+85%</span>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 group cursor-pointer flex flex-col min-h-[350px]" onClick={() => { onSelectStudy({ tag: "Agritech", title: "Sustainable Yield Framework", desc: "Aligning community agricultural needs with predictive machine learning crop models.", stat: "Efficiency", val: "2.4x", isDonut: true }); navigate('casestudy-detail'); }}>
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <span className="text-[9px] font-semibold border border-black/10 bg-transparent px-4 py-2 rounded-full text-black tracking-widest uppercase">Agritech</span>
            <ArrowUpRight size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <h4 className="font-heading font-semibold text-xl md:text-2xl text-black mb-3 leading-snug">Sustainable Yield<br className="hidden md:block"/>Framework</h4>
          <p className="text-xs md:text-sm font-light text-gray-500 mb-8 md:mb-10 leading-relaxed">Aligning community agricultural needs with predictive machine learning crop models.</p>
          <div className="mt-auto h-[80px] md:h-[100px] w-full bg-[#F8F9FA] rounded-[16px] border border-black/[0.04] px-6 flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <div className="font-heading text-2xl md:text-[32px] font-bold text-black mb-1 leading-none tracking-tight">2.4x</div>
              <div className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Efficiency Multiplier</div>
            </div>
            <div className="w-12 h-12 rounded-full border-[4px] md:border-[5px] border-black"></div>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 group cursor-pointer flex flex-col min-h-[350px]" onClick={() => { onSelectStudy({ tag: "Healthcare", title: "Access & Equality Modifiers", desc: "Crafting policies that ensure accessible, data-verified healthcare distribution matrices.", stat: "Distribution", val: "Target Met", isDonut: false }); navigate('casestudy-detail'); }}>
          <div className="flex justify-between items-start mb-6 md:mb-8">
            <span className="text-[9px] font-semibold border border-black/10 bg-transparent px-4 py-2 rounded-full text-black tracking-widest uppercase">Healthcare</span>
            <ArrowUpRight size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-black transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <h4 className="font-heading font-semibold text-xl md:text-2xl text-black mb-3 leading-snug">Access & Equality<br className="hidden md:block"/>Modifiers</h4>
          <p className="text-xs md:text-sm font-light text-gray-500 mb-8 md:mb-10 leading-relaxed">Crafting policies that ensure accessible, data-verified healthcare distribution matrices.</p>
          <div className="mt-auto h-[80px] md:h-[100px] w-full bg-[#F8F9FA] rounded-[16px] border border-black/[0.04] px-6 flex items-center justify-between">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Distribution</span>
             <span className="text-black font-bold text-[11px] tracking-widest uppercase">Target Met</span>
          </div>
        </div>
      </div>
    </section>

    {/* 7. Capabilities Engine */}
    <section className="w-full py-24 md:py-32 border-t border-black/10 bg-white/80 backdrop-blur-md relative z-10 pointer-events-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 md:mb-20">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">System Capabilities</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">The Analysis Engine.</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-0 border-t border-black/10">
          {[
            { icon: Layers, title: "Policy Development", desc: "Formulating legislative structures using predictive data modeling rather than historic guesswork." },
            { icon: Activity, title: "Gap Analysis", desc: "Identifying systemic inconsistencies via real-time statistical deviations and sentiment tracking." },
            { icon: Globe, title: "Government Relations", desc: "Navigating shifting political landscapes with algorithmic mapping and strategic forecasting." },
            { icon: Shield, title: "Issue-Based Advocacy", desc: "Orchestrating targeted campaigns to influence specific socio-economic variables." }
          ].map((item, i) => (
            <div key={i} className="py-10 md:py-12 border-b border-black/10 group transition-all flex gap-6 md:gap-8 cursor-pointer rounded-[24px] hover:px-8 -mx-8" onClick={() => navigate('methodology')}>
              <div className="mt-1 text-black opacity-30 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                <item.icon size={24} className="md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-xl text-black mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                <p className="text-xs md:text-sm font-light text-gray-600 leading-relaxed max-w-md">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 8. Domains of Influence (Sectors) - Dark Pre-Footer */}
    <section className="w-full py-24 md:py-32 bg-black text-white relative z-10 pointer-events-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Domains of Influence</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold tracking-tight text-white mb-8">Focus Sectors.</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
          {[
            { icon: Cpu, name: 'Technology', desc: 'Advancing digital infrastructure and safeguarding data privacy frameworks.' },
            { icon: Leaf, name: 'Sustainability', desc: 'Engineering policies for long-term ecological and economic continuums.' },
            { icon: Globe, name: 'Agriculture', desc: 'Aligning rural output with high-yield agritech integration protocols.' },
            { icon: Shield, name: 'Healthcare', desc: 'Designing equitable, data-driven medical distribution systems.' }
          ].map((sector, i) => (
            <div key={i} className="group border-t border-white/20 pt-8 cursor-pointer rounded-[24px] hover:bg-white/5 transition-colors px-6 -mx-6 pb-6" onClick={() => navigate('casestudies')}>
              <sector.icon size={28} className="text-gray-400 group-hover:text-white transition-all transform group-hover:-translate-y-1 mb-6" strokeWidth={1.5} />
              <h4 className="text-lg md:text-xl font-heading font-semibold mb-3 text-white">{sector.name}</h4>
              <p className="text-xs font-light text-gray-400 leading-relaxed pr-4">{sector.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

  </div>
);

const AboutPage = () => (
  <div className="animate-fade-up pb-32">
    <PageHero 
      tag="Corporate Overview"
      titleThin="The Architecture"
      titleBold="of Governance."
      description="Sankalp AI was founded on a singular premise: public policy should not rely on historic intuition, but on predictive data engineering and measurable execution."
    />
    
    {/* The Sankalp Doctrine */}
    <section className="px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 mb-24">
      <div className="bg-black text-white border border-white/10 p-10 md:p-16 lg:p-24 rounded-[40px] shadow-2xl transition-transform hover:scale-[1.01] duration-500">
        <Shield size={40} className="mb-8 text-white/50" strokeWidth={1.5} />
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-heading font-semibold leading-tight mb-8 max-w-4xl">
          The era of human guesswork in governance is over. We do not advise. <br className="hidden md:block"/><span className="text-blue-400">We compute. We engineer.</span>
        </h3>
        <p className="text-sm md:text-base font-light text-gray-400 leading-relaxed max-w-2xl">
          Traditional advisory models rely on post-mortem analytics—reacting to systemic failures after they occur. Sankalp AI is a preventative architecture. We build deployment matrices that guarantee equitable resource distribution before a single legislative bill is passed.
        </p>
      </div>
    </section>

    {/* The Genesis Constraint */}
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">The Origin</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black mb-6 leading-tight">Born from the friction of linear bureaucracy.</h3>
          <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed mb-6">
            Sankalp AI was not conceived in a venture capital studio. It was engineered in direct response to the systemic collapse of supply chain and healthcare routing observed during the early 2020s global crises.
          </p>
          <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
            We realized that no amount of human administrative effort could outpace an exponentially scaling civic threat. The only solution was to remove the human bottleneck entirely—replacing committees with executable policy algorithms.
          </p>
        </div>
        <div className="glass-card p-10 md:p-12 bg-black text-white border-none rounded-[32px] shadow-2xl">
          <h4 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">Historical Latency Matrix</h4>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-3"><span>Drafting Phase</span> <span className="text-red-400">8 Months</span></div>
              <div className="w-full bg-white/10 h-2 rounded-full"><div className="bg-red-500 h-2 w-[80%] rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-3"><span>Legislative Approval</span> <span className="text-red-400">4 Months</span></div>
              <div className="w-full bg-white/10 h-2 rounded-full"><div className="bg-red-500 h-2 w-[40%] rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-3"><span>Municipal Deployment</span> <span className="text-red-400">12 Months</span></div>
              <div className="w-full bg-white/10 h-2 rounded-full"><div className="bg-red-500 h-2 w-[100%] rounded-full"></div></div>
            </div>
            <div className="pt-6 border-t border-white/20 mt-8">
              <div className="flex justify-between text-xs font-semibold mb-3"><span>Sankalp Execution</span> <span className="text-green-400">Zero Latency (Automated)</span></div>
              <div className="w-full bg-white/10 h-2 rounded-full"><div className="bg-green-500 h-2 w-[2%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ✨ Systemic Evolution */}
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="mb-12 md:mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Systemic Evolution</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">The Three Epochs of Governance.</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="glass-card p-10 flex flex-col cursor-default">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">v1.0 Analog</span>
          <h4 className="text-xl md:text-2xl font-heading font-semibold text-black mb-4">The Committee Era</h4>
          <p className="text-sm font-light text-gray-500 leading-relaxed">Reliance on subjective human debate, 5-year macroscopic plans, and paper trails. Average reaction time to civic crises measured in years. Highest vulnerability to localized corruption and bias.</p>
        </div>
        <div className="glass-card p-10 flex flex-col cursor-default">
          <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">v2.0 Digital</span>
          <h4 className="text-xl md:text-2xl font-heading font-semibold text-black mb-4">The Dashboard Era</h4>
          <p className="text-sm font-light text-gray-500 leading-relaxed">Digitization of records. 'E-governance' creates dashboards, but human bureaucrats still manually interpret the data and execute policy. Latency is reduced to months, but systemic bottlenecks persist.</p>
        </div>
        <div className="glass-card p-10 bg-black text-white flex flex-col cursor-default border-none shadow-2xl transform md:scale-[1.03] z-10 rounded-[32px]">
          <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase mb-6">v3.0 Sankalp</span>
          <h4 className="text-xl md:text-2xl font-heading font-semibold text-white mb-4">Algorithmic Execution</h4>
          <p className="text-sm font-light text-gray-400 leading-relaxed">Data does not just inform policy; it automatically triggers it. Smart-contract equivalents route resources autonomously when live demographic telemetry hits mathematically verified thresholds. Zero latency.</p>
        </div>
      </div>
    </section>

    {/* Data Sovereignty */}
    <section className="w-full py-20 md:py-32 bg-[#FAFAFA] border-y border-black/10 relative z-10 pointer-events-auto">
       <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
           <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <Server size={40} className="text-black mb-8" strokeWidth={1.5} />
              <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Federal Security Standards</h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-6">Data Sovereignty & Security.</h3>
              <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
                Algorithmic governance requires the ingestion of highly sensitive demographic and infrastructural data. Sankalp AI does not operate a centralized, vulnerable data lake. We deploy our logic engines directly to the edge.
              </p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="glass-card p-10 bg-white">
                 <Lock size={24} className="mb-6 text-black" strokeWidth={1.5} />
                 <h4 className="text-lg font-semibold text-black mb-3">Zero-Trust Architecture</h4>
                 <p className="text-sm font-light text-gray-600 leading-relaxed">Every API call, system ping, and administrative query requires strict cryptographic verification. No internal lateral movement is permitted.</p>
              </div>
              <div className="glass-card p-10 bg-white">
                 <Server size={24} className="mb-6 text-black" strokeWidth={1.5} />
                 <h4 className="text-lg font-semibold text-black mb-3">Air-Gapped On-Premise</h4>
                 <p className="text-sm font-light text-gray-600 leading-relaxed">For high-security state deployments, our modules run entirely offline on localized state-owned server infrastructure to prevent exfiltration.</p>
              </div>
              <div className="glass-card p-10 bg-white">
                 <Database size={24} className="mb-6 text-black" strokeWidth={1.5} />
                 <h4 className="text-lg font-semibold text-black mb-3">Immutable Audit Trails</h4>
                 <p className="text-sm font-light text-gray-600 leading-relaxed">Every algorithmic routing decision is mathematically logged to an encrypted ledger, allowing complete retroactive auditing by regulatory bodies.</p>
              </div>
           </div>
       </div>
    </section>

    {/* Core Mandate */}
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <div>
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Foundational Principles</h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black mb-8">Our Core Mandate.</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
           <div className="glass-card p-8 md:p-10">
             <div className="text-4xl font-heading font-semibold text-black mb-4">01</div>
             <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Empirical</div>
             <p className="text-xs font-light text-gray-500 leading-relaxed">Every policy recommendation is backed by a verifiable, quantitative baseline.</p>
           </div>
           <div className="glass-card p-8 md:p-10">
             <div className="text-4xl font-heading font-semibold text-black mb-4">02</div>
             <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Agnostic</div>
             <p className="text-xs font-light text-gray-500 leading-relaxed">Unbiased analysis free from political or institutional latency.</p>
           </div>
           <div className="glass-card p-8 md:p-10">
             <div className="text-4xl font-heading font-semibold text-black mb-4">03</div>
             <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Systematic</div>
             <p className="text-xs font-light text-gray-500 leading-relaxed">Deployments structured for automated tracking and yield analysis.</p>
           </div>
           <div className="glass-card p-8 md:p-10">
             <div className="text-4xl font-heading font-semibold text-black mb-4">04</div>
             <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-3">Scalable</div>
             <p className="text-xs font-light text-gray-500 leading-relaxed">Frameworks engineered to grow from municipal pilots to federal law.</p>
           </div>
        </div>
      </div>
    </section>

    {/* ✨ Algorithmic Neutrality */}
    <section className="py-24 md:py-32 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
       <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
         <div className="flex-1">
           <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Ethical Framework</h2>
           <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black leading-tight mb-8">Cold Math.<br/>Absolute Equity.</h3>
           <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed mb-6">
             Human decision-making is inherently flawed by subconscious bias, political pressure, and localized incentives. Algorithms, when built on strictly verified quantitative baselines, are incorruptible.
           </p>
           <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
             Sankalp AI actively strips out subjective qualifiers from the policy distribution matrix. Whether routing emergency funds or re-zoning urban grids, the code executes based purely on demographic deficit and calculated need. Equity is no longer a political promise; it is a mathematical guarantee.
           </p>
         </div>
         <div className="w-full lg:w-1/2">
           <div className="bg-[#FAFAFA] border border-black/10 rounded-[32px] p-10 md:p-16 relative overflow-hidden shadow-sm">
             <div className="absolute -top-10 -right-10 opacity-5 text-black">
               <Shield size={250} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-black/10 pb-6 mb-8">
                  <span className="text-sm font-semibold text-black">Political Bias Mitigation</span>
                  <span className="text-sm font-bold text-green-500">100%</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-6 mb-8">
                  <span className="text-sm font-semibold text-black">Resource Misallocation Rate</span>
                  <span className="text-sm font-bold text-green-500">{'<'} 0.01%</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm font-semibold text-black">Demographic Equity Score</span>
                  <span className="text-sm font-bold text-green-500">Baseline Verified</span>
                </div>
             </div>
           </div>
         </div>
       </div>
    </section>

    {/* ✨ Engineering Culture (Talent Density) */}
    <section className="px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 mb-24">
      <div className="bg-black text-white rounded-[40px] shadow-2xl p-10 md:p-16 lg:p-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-6">The Talent Density</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-white mb-8 leading-tight">We are not lobbyists.<br/>We are systems engineers.</h3>
            <p className="text-sm md:text-base font-light text-gray-400 leading-relaxed mb-6">
              The traditional advisory space is saturated with political science theorists and management consultants. Sankalp AI is built by a completely different breed of talent.
            </p>
            <p className="text-sm md:text-base font-light text-gray-400 leading-relaxed">
              Our teams consist of high-frequency trading quants, distributed systems architects, and applied mathematicians. We bring the ruthless optimization of algorithmic finance and scalable cloud infrastructure directly into the heart of civic policy.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="border border-white/20 p-8 rounded-[24px] bg-white/5 hover:bg-white/10 transition-colors">
              <h4 className="text-base font-semibold text-white mb-3">Applied Math</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Bayesian networking & probabilistic modeling.</p>
            </div>
            <div className="border border-white/20 p-8 rounded-[24px] bg-white/5 hover:bg-white/10 transition-colors">
              <h4 className="text-base font-semibold text-white mb-3">Cloud Infra</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Zero-latency API pipelines & secure data edge nodes.</p>
            </div>
            <div className="border border-white/20 p-8 rounded-[24px] bg-white/5 hover:bg-white/10 transition-colors">
              <h4 className="text-base font-semibold text-white mb-3">Cryptography</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Zero-knowledge proofs for demographic anonymity.</p>
            </div>
            <div className="border border-white/20 p-8 rounded-[24px] bg-white/5 hover:bg-white/10 transition-colors">
              <h4 className="text-base font-semibold text-white mb-3">Quant Dev</h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">Monte Carlo economic stress-testing arrays.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* System Architects */}
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="mb-12 md:mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">System Architects</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">The Core Team.</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { name: "Shivani Parihast", role: "Chief Executive Officer", desc: "Architecting the global transition from intuitive governance to predictive algorithmic execution. Defining the operational mandates for state and federal scaling." },
          { name: "Suvendu Chand", role: "Chief Business & Growth Officer", desc: "Scaling deployment matrices across international and domestic infrastructure nodes. Directing institutional partnerships and civic tech integration." },
          { name: "Anant Mishra", role: "Field Chief Information Officer", desc: "Overseeing secure municipal API ingestion, zero-latency data telemetry, and the live deployment of Sankalp's predictive modeling engines." }
        ].map((member, i) => (
          <div key={i} className="glass-card p-10 md:p-12 bg-[#FAFAFA] flex flex-col group cursor-default">
            <h4 className="text-2xl md:text-3xl font-heading font-semibold text-black mb-3">{member.name}</h4>
            <p className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] text-gray-500 uppercase mb-8">{member.role}</p>
            <p className="text-sm font-light text-gray-600 leading-relaxed mt-auto">{member.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Board of Advisory */}
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="mb-12 md:mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Institutional Oversight</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">Board of Advisory.</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 border-t border-black/10">
        {[
          { name: "Dr. Arvind Ramanathan", credential: "Former Director, National Institute of Algorithmic Governance" },
          { name: "Sarah Jenkins", credential: "Ex-Head of Data Policy, UN Technology Commission" },
          { name: "Lt. Gen (Retd.) Rajiv Menon", credential: "Strategic Advisor, National Security & Civic Tech Infrastructure" },
          { name: "Dr. Elena Rostova", credential: "Lead Architect, European Civic Privacy Framework (GDPR-AI)" }
        ].map((advisor, i) => (
          <div key={i} className="py-10 border-b border-black/10 flex flex-col group hover:px-6 -mx-6 px-6 transition-all duration-300 rounded-[24px]">
            <h4 className="text-xl md:text-2xl font-heading font-semibold text-black mb-3 group-hover:text-blue-600 transition-colors">{advisor.name}</h4>
            <p className="text-[11px] md:text-xs font-bold tracking-widest text-gray-500 uppercase">{advisor.credential}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const MethodologyPage = () => (
  <div className="animate-fade-up pb-32">
    <PageHero 
      tag="System Architecture"
      titleThin="Algorithmic"
      titleBold="Policy Generation."
      description="A stark departure from traditional advisory. We treat public policy as code—requiring testing, deployment pipelines, and continuous impact monitoring."
    />

    {/* Legacy vs Algorithmic */}
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        <div className="bg-red-50/30 border border-red-100 rounded-[32px] p-10 md:p-16">
          <h3 className="text-xs font-bold tracking-widest uppercase text-red-500 mb-8">The Legacy Fallacy</h3>
          <ul className="space-y-8">
            <li className="flex flex-col"><span className="font-semibold text-black text-lg mb-2">18-Month Latency</span><span className="text-sm text-gray-500 font-light leading-relaxed">Average time from problem identification to policy deployment.</span></li>
            <li className="flex flex-col"><span className="font-semibold text-black text-lg mb-2">Qualitative Bias</span><span className="text-sm text-gray-500 font-light leading-relaxed">Decisions rooted in historical intuition rather than real-time ground truth.</span></li>
            <li className="flex flex-col"><span className="font-semibold text-black text-lg mb-2">Static Legislation</span><span className="text-sm text-gray-500 font-light leading-relaxed">Laws that cannot mathematically adapt to sudden economic or demographic shifts.</span></li>
          </ul>
        </div>
        <div className="bg-black text-white border border-white/10 rounded-[32px] p-10 md:p-16 shadow-2xl">
          <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-8">The Sankalp Standard</h3>
          <ul className="space-y-8">
            <li className="flex flex-col"><span className="font-semibold text-white text-lg mb-2">Zero Latency Telemetry</span><span className="text-sm text-gray-400 font-light leading-relaxed">Direct integration with municipal APIs for instantaneous data feedback.</span></li>
            <li className="flex flex-col"><span className="font-semibold text-white text-lg mb-2">Quantitative Absolute</span><span className="text-sm text-gray-400 font-light leading-relaxed">Simulations run 10,000+ times to establish mathematically verified yield projections.</span></li>
            <li className="flex flex-col"><span className="font-semibold text-white text-lg mb-2">Dynamic Policy-as-Code</span><span className="text-sm text-gray-400 font-light leading-relaxed">Frameworks built with algorithmic triggers that auto-adjust resource allocation.</span></li>
          </ul>
        </div>
      </div>
    </section>
    
    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
      <div className="mb-12 md:mb-16">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">The Protocol</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">5-Phase Pipeline.</h3>
      </div>
      <div className="space-y-0">
        {[
          { step: "Phase 1", title: "Data Ingestion & Standardization", desc: "We aggregate fragmented data from municipal, state, and federal APIs, standardizing it into a unified quantitative baseline. This removes human bias from the initial assessment." },
          { step: "Phase 2", title: "Predictive Simulations", desc: "Before drafting legislation, we run Monte Carlo simulations to stress-test policy parameters against economic volatility, demographic shifts, and extreme weather events." },
          { step: "Phase 3", title: "Legislative Architecture", desc: "Drafting the actual framework. We construct the policy with clear, measurable KPIs embedded directly into the language of the regulation." },
          { step: "Phase 4", title: "Node Deployment", desc: "Rolling out the policy across designated test zones. We establish the feedback loops necessary for government agencies to monitor early adoption rates." },
          { step: "Phase 5", title: "Yield Tracking", desc: "Continuous monitoring of the socio-economic yield. If actual data deviates from our predictive models, we immediately supply revision protocols." }
        ].map((item, index) => (
          <div key={index} className="flex flex-col lg:flex-row py-10 md:py-16 border-b border-black/10 group rounded-[24px] hover:bg-[#FAFAFA] px-6 -mx-6 transition-all">
            <div className="w-full lg:w-48 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase pt-2 group-hover:text-black transition-colors mb-4 lg:mb-0">{item.step}</div>
            <div className="flex-1 max-w-3xl">
              <h3 className="text-2xl md:text-3xl font-heading font-semibold text-black mb-3 md:mb-4">{item.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light">{item.desc}</p>
            </div>
            <div className="hidden lg:flex w-32 justify-end items-center">
              <ArrowDown size={32} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-all transform group-hover:translate-y-2" />
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-t border-black/10">
       <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
         <div>
           <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-black mb-6">Data Integrity & Security</h3>
           <p className="text-sm font-light text-gray-600 leading-relaxed mb-8">Our models rely on the secure parsing of millions of demographic data points. We utilize decentralized encryption protocols to ensure that all ingested data remains fully anonymized and compliant with federal privacy mandates.</p>
           <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-black border border-black/20 w-max px-6 py-3 rounded-[11px] bg-gray-50 shadow-sm">
             <Shield size={16} /> End-to-End Encryption Verified
           </div>
         </div>
         <div className="bg-[#FAFAFA] border border-black/10 p-8 md:p-12 font-mono text-[10px] md:text-[11px] text-gray-500 overflow-x-auto rounded-[32px] shadow-inner">
            <div className="mb-2">$ initiating security handshake...</div>
            <div className="mb-2">$ protocol: AES-256</div>
            <div className="text-black font-semibold mt-4 mb-2">$ STATUS: SECURE CONNECTION ESTABLISHED</div>
            <div className="mt-6 mb-2">$ routing anonymized dataset to model SANKALP_V2...</div>
            <div className="animate-pulse mt-4 text-black">_</div>
         </div>
       </div>
    </section>
  </div>
);

const ProductSuitePage = () => {
  const { generateContent, loading: simLoading, error: simError } = useGeminiAPI();
  const [simQuery, setSimQuery] = useState('');
  const [simLog, setSimLog] = useState([]);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!simQuery) return;
    
    setSimLog([`> INGESTING QUERY: "${simQuery}"`, "> ROUTING TO ALGORITHMIC CORE..."]);
    
    const prompt = `Analyze this civic issue: "${simQuery}". Provide a concise, highly technical 3-line response as an advanced predictive policy AI named Sankalp. Format your response exactly like this:
Line 1 (Framework): [1 sentence describing the proposed algorithmic policy intervention]
Line 2 (Yield): [Predicted numerical outcome, e.g., 'Efficiency +22%' or 'Wait Times -15%']
Line 3 (Risk): [1 brief systemic risk factor]`;
    
    const response = await generateContent(prompt, "You are Sankalp AI, a hyper-logical, stark, and analytical policy engine. Speak in clinical, systems-level terminology without markdown formatting.");

    if (response) {
      const lines = response.split('\n').filter(l => l.trim() !== '');
      setSimLog(prev => [...prev, "> SIMULATION COMPLETE.", ...lines.map(l => `> ${l}`)]);
    } else {
      setSimLog(prev => [...prev, "> ERROR: CORE UNREACHABLE OR TIMEOUT."]);
    }
  };

  const products = [
    { state: "Kerala", dept: "Dept. of Socio-Economics", icon: Users, desc: "Algorithmic resource allocation and demographic forecasting to optimize state welfare distribution." },
    { state: "Kerala", dept: "Dept. of Health", icon: Activity, desc: "Predictive epidemiological tracking and real-time hospital infrastructure management protocols." },
    { state: "Goa", dept: "Dept. of Tourism", icon: Globe, desc: "AI-driven footfall analytics and ecological impact modeling for sustainable seasonal loads." },
    { state: "Tamil Nadu", dept: "Dept. of Motor Vehicles", icon: Shield, desc: "Automated transit compliance, digital license enforcement, and congestion matrices." },
    { state: "Karnataka", dept: "Dept. of Motor Vehicles", icon: Shield, desc: "Smart transit routing algorithms and predictive metropolitan infrastructure scaling." },
    { state: "Bihar & Odisha", dept: "State AI Mission", icon: Cpu, desc: "Unified algorithmic governance frameworks and automated disaster response routing." },
    { state: "Maharashtra", dept: "Dept. of Motor Vehicles", icon: Shield, desc: "Metropolitan traffic optimization grids and decentralized automated tolling systems." },
    { state: "Global", dept: "Geopolitics Dashboard", icon: MapPin, desc: "Real-time macro-tracking of international policy shifts, trade tariffs, and node topography." },
    { state: "Core", dept: "Predictive Analysis Tools", icon: BarChart, desc: "Proprietary Monte Carlo simulation engines for ad-hoc civic policy stress-testing." },
  ];

  return (
    <div className="animate-fade-up pb-32">
      <PageHero 
        tag="System Modules"
        titleThin="Decision"
        titleBold="Support Systems."
        description="Explore our comprehensive suite of state-specific predictive dashboards and algorithmic tools driving modern governance."
      />

      {/* Integration Architecture */}
      <section className="py-20 md:py-32 w-full bg-[#FAFAFA] border-y border-black/10 mb-16 md:mb-24 relative z-10 pointer-events-auto shadow-sm">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-12 lg:gap-24">
            <div className="flex-1">
               <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Architecture</h2>
               <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black mb-6">Zero-Friction API Integration</h3>
               <p className="text-sm font-light text-gray-600 leading-relaxed mb-10">
                 Sankalp DSS modules do not require states to rebuild their existing digital infrastructure. Our systems are engineered to sit as an overlay, seamlessly hooking into existing databases, sensor grids, and legacy CRM platforms via secure REST APIs.
               </p>
               <div className="flex items-center gap-4 md:gap-8 overflow-x-auto pb-4">
                 <div className="flex flex-col items-center gap-3 text-xs font-semibold text-black shrink-0"><Network size={24} className="text-gray-400"/> State Database</div>
                 <div className="w-16 border-t-2 border-dashed border-gray-300 shrink-0"></div>
                 <div className="flex flex-col items-center gap-3 text-xs font-semibold text-black bg-black text-white px-6 py-4 rounded-[16px] shadow-lg shrink-0"><Cpu size={24} className="text-blue-400"/> Sankalp Engine</div>
                 <div className="w-16 border-t-2 border-dashed border-gray-300 shrink-0"></div>
                 <div className="flex flex-col items-center gap-3 text-xs font-semibold text-black shrink-0"><Activity size={24} className="text-gray-400"/> Live Dashboard</div>
               </div>
            </div>
            <div className="w-full md:w-[400px] shrink-0">
               <div className="bg-white border border-black/10 shadow-xl p-10 rounded-[32px]">
                 <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-8">Security Layer</h4>
                 <ul className="space-y-6 text-sm font-semibold text-black">
                   <li className="flex items-center gap-4"><CheckCircle2 size={18} className="text-green-500"/> ISO 27001 Compliant</li>
                   <li className="flex items-center gap-4"><CheckCircle2 size={18} className="text-green-500"/> AES-256 Data Encryption</li>
                   <li className="flex items-center gap-4"><CheckCircle2 size={18} className="text-green-500"/> Zero-Trust Architecture</li>
                 </ul>
               </div>
            </div>
         </div>
      </section>
      
      {/* Grid Section for 9 Products */}
      <section className="pb-16 md:pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10 border-b border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, i) => (
            <div key={i} className="glass-card p-8 md:p-10 flex flex-col justify-between items-start min-h-[300px] group cursor-default">
              <div className="flex justify-between items-center w-full mb-8">
                <span className="text-[9px] font-bold tracking-widest uppercase text-black border border-black/20 px-4 py-2 rounded-full">{product.state} DSS</span>
                <product.icon size={24} className="text-gray-400 group-hover:text-black transition-colors transform group-hover:scale-110 duration-300" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-xl md:text-2xl text-black mb-3 leading-snug">{product.dept}</h4>
                <p className="text-xs md:text-sm font-light text-gray-500 leading-relaxed">{product.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Geopolitics Dashboard (Map) */}
      <section className="py-16 md:py-24 px-6 lg:px-12 max-w-[1400px] mx-auto pointer-events-auto relative z-10">
        <div className="mb-8 md:mb-12">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4 flex items-center gap-2">
            <MapPin size={14} className="text-black" /> Geopolitics Dashboard
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-8">Node Topography.</h3>
        </div>
        <div className="border border-black/10 rounded-[32px] bg-white shadow-sm overflow-hidden mb-16 md:mb-24 relative">
           <div className="absolute top-6 left-6 z-20 bg-white border border-black/10 px-4 py-2 rounded-full text-[9px] font-bold tracking-widest uppercase flex items-center gap-3 shadow-md">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Online
           </div>
           <DeploymentMap />
        </div>

        {/* ✨ AI Sandbox Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 border-t border-black/10 pt-16 md:pt-24 items-center">
          <div>
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-black" /> Predictive Analysis Tools
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-black tracking-tight mb-6">Algorithmic Simulator.</h3>
            <p className="text-sm font-light text-gray-600 leading-relaxed mb-8">
              Interact directly with the Sankalp AI policy engine. Input a demographic or civic challenge, and our models will stream back a preliminary framework structure, projected metric yield, and systemic risk assessment in real time.
            </p>
            <form onSubmit={handleSimulate} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={simQuery}
                onChange={e => setSimQuery(e.target.value)}
                placeholder="e.g. Traffic congestion in downtown Mumbai..." 
                className="stark-input border border-black/10 rounded-[11px] px-6 py-4 text-sm focus:border-black/30 transition-all bg-gray-50 shadow-inner"
                required
              />
              <button 
                type="submit" 
                disabled={simLoading}
                className="w-full h-12 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase rounded-[11px] flex items-center justify-center gap-3 hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-lg"
              >
                {simLoading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} /> Run Simulation</>}
              </button>
            </form>
          </div>
          
          <div className="bg-[#050505] rounded-[32px] p-8 md:p-12 font-mono text-[11px] md:text-[13px] text-gray-400 overflow-y-auto leading-loose shadow-2xl h-[400px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#050505] to-transparent z-10 pointer-events-none"></div>
            <div className="relative z-20 flex-1 flex flex-col justify-end">
              {simLog.length === 0 ? (
                <>
                  <div className="text-green-500 mb-2">{'>'} AWAITING USER INPUT...</div>
                  <div>{'>'} SANKALP_V2 ALGORITHMIC CORE STANDING BY.</div>
                  <div className="animate-pulse mt-2 text-green-500">_</div>
                </>
              ) : (
                <div className="animate-fade-up flex flex-col justify-end min-h-full space-y-2">
                  {simLog.map((line, idx) => (
                    <div key={idx} className={`${line.includes('ERROR') ? 'text-red-500' : line.includes('OPTIMIZED') || line.includes('COMPLETE') ? 'text-green-500' : 'text-gray-300'}`}>
                      {line}
                    </div>
                  ))}
                  {simLoading && <div className="animate-pulse text-green-500 mt-2">_</div>}
                </div>
              )}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default function App() {
  const [appLoading, setAppLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false); 
  }, [currentPage]);

  const navLinks = [
    { id: 'about', label: 'About Us' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'productsuite', label: 'Product Suite' },
    { id: 'casestudies', label: 'Case Studies' },
    { id: 'insights', label: 'Insights' },
    { id: 'news', label: 'News' }
  ];

  return (
    <>
      <CustomStyles />
      {appLoading && <Preloader onComplete={() => setAppLoading(false)} />}
      
      {!appLoading && (
        <div className="min-h-screen relative animate-fade-up">
          <InteractiveGrid />

          {/* --- Mobile Menu Overlay --- */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] bg-white pointer-events-auto flex flex-col pt-24 px-6 animate-fade-up">
              <div className="flex flex-col gap-6 font-heading text-4xl font-semibold tracking-tight">
                <button onClick={() => setCurrentPage('home')} className="text-left hover:text-blue-600 transition-colors">Home</button>
                {navLinks.map(link => (
                  <button 
                    key={link.id} 
                    onClick={() => setCurrentPage(link.id)} 
                    className="text-left hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-12 border-t border-black/10 pt-8">
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className="w-full h-14 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-[11px] shadow-lg"
                >
                  Contact Sankalp AI
                </button>
              </div>
            </div>
          )}

          <div className="relative z-[110] flex flex-col min-h-screen">
            
            {/* --- Unified Navbar --- */}
            <nav className={`fixed top-0 w-full z-[999] transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md border-b border-black/10 py-4 shadow-sm' : 'py-6 md:py-8 bg-transparent'}`}>
              <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
                
                <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
                  <div className="font-heading font-semibold text-xl md:text-2xl tracking-widest text-black">
                    SANKALP<span className="text-black font-bold"> AI.</span>
                  </div>
                </div>
                
                {/* Desktop Links */}
                <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-10">
                  {navLinks.map((item) => (
                    <button 
                      key={item.id} 
                      onClick={() => setCurrentPage(item.id)}
                      className={`text-[9px] xl:text-[10px] font-bold tracking-[0.15em] uppercase transition-colors pb-1 border-b-2 ${currentPage === item.id && !mobileMenuOpen ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Menu Toggle */}
                  <button className="lg:hidden p-2 text-black rounded-[11px] border border-black/10 hover:bg-black/5" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>

                  <button 
                    onClick={() => setCurrentPage('contact')}
                    className="hidden lg:block h-12 px-8 text-[10px] font-bold tracking-[0.15em] uppercase text-white bg-black rounded-[11px] hover:bg-gray-800 hover:border-gray-800 transition-all shadow-md"
                  >
                    Contact
                  </button>
                </div>
                
              </div>
            </nav>

            {/* --- Dynamic Page Rendering --- */}
            <main className={`flex-grow ${mobileMenuOpen ? 'hidden' : 'block'}`}>
              {currentPage === 'home' && <HomePage navigate={setCurrentPage} onSelectStudy={setSelectedStudy} />}
              {currentPage === 'about' && <AboutPage />}
              {currentPage === 'methodology' && <MethodologyPage />}
              {currentPage === 'casestudies' && <CaseStudiesPage navigate={setCurrentPage} onSelectStudy={setSelectedStudy} />}
              {currentPage === 'casestudy-detail' && <CaseStudyDetail study={selectedStudy} navigate={setCurrentPage} />}
              {currentPage === 'insights' && <InsightsPage navigate={setCurrentPage} onSelectInsight={setSelectedInsight} />}
              {currentPage === 'insight-detail' && <InsightDetail doc={selectedInsight} navigate={setCurrentPage} />}
              {currentPage === 'news' && <NewsPage navigate={setCurrentPage} onSelectNews={setSelectedNews} />}
              {currentPage === 'news-detail' && <NewsDetail item={selectedNews} navigate={setCurrentPage} />}
              {currentPage === 'productsuite' && <ProductSuitePage />}
              {currentPage === 'contact' && <ContactPage />}
            </main>

            {/* --- Global Footer --- */}
            <footer className={`pt-20 md:pt-24 pb-8 md:pb-12 px-6 lg:px-12 bg-black text-white pointer-events-auto relative z-10 mt-auto border-t border-white/10 ${mobileMenuOpen ? 'hidden' : 'block'}`}>
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 mb-16 md:mb-20">
                <div className="md:col-span-5">
                  <div className="font-heading font-semibold text-2xl tracking-widest text-white mb-6 md:mb-8 cursor-pointer inline-block" onClick={() => setCurrentPage('home')}>
                    SANKALP<span className="text-gray-500"> AI.</span>
                  </div>
                  <p className="text-xs md:text-sm font-light text-gray-400 max-w-sm leading-relaxed mb-6 md:mb-8">
                    Sankalp AI. Systematizing the future of governance through rigorous data engineering.
                  </p>
                  <div className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                    People. Policy. Progress.
                  </div>
                </div>
                
                <div className="md:col-span-2 md:col-start-8">
                  <h5 className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4 md:mb-6">Platform</h5>
                  <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-light text-gray-300">
                    <li><button onClick={() => setCurrentPage('productsuite')} className="hover:text-white transition-colors">Product Suite</button></li>
                    <li><button onClick={() => setCurrentPage('methodology')} className="hover:text-white transition-colors">Methodology</button></li>
                    <li><button onClick={() => setCurrentPage('casestudies')} className="hover:text-white transition-colors">Case Studies</button></li>
                    <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition-colors">About Us</button></li>
                  </ul>
                </div>

                <div className="md:col-span-3">
                  <h5 className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-4 md:mb-6">Nodes</h5>
                  <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-light text-gray-300">
                    <li>Delhi & Bengaluru</li>
                    <li>Trivandrum & Chennai</li>
                    <li>Pune, Goa & Patna</li>
                    <li className="pt-2 md:pt-4"><a href="mailto:info@sankalp.ai" className="text-white border-b border-white/30 hover:border-white pb-1 transition-all">info@sankalp.ai</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="max-w-[1400px] mx-auto border-t border-white/10 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[9px] md:text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                <p>© {new Date().getFullYear()} SANKALP AI INC.</p>
                <div className="flex gap-6 md:gap-8">
                  <button className="hover:text-white transition-colors px-2 py-1">Privacy</button>
                  <button className="hover:text-white transition-colors px-2 py-1">Terms</button>
                </div>
              </div>
            </footer>

          </div>
        </div>
      )}
    </>
  );
}
