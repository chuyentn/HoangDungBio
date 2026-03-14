import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Factory, 
  TrendingDown, 
  CloudOff, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe,
  Menu,
  X,
  Download,
  Quote,
  FileText,
  Share2,
  MessageSquare,
  Send,
  LogIn,
  LogOut,
  User,
  UserPlus,
  TrendingUp,
  RefreshCw,
  Calendar,
  Clock,
  Plus,
  AlertCircle,
  Pencil,
  Trash2,
  Save,
  LayoutDashboard,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  ExternalLink,
  GanttChartSquare
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import SavingsCalculator from './components/SavingsCalculator';
import ProductCatalog from './components/ProductCatalog';
import CRMSystem from './components/CRMSystem';
import { CASE_STUDIES, ADMIN_EMAILS } from './constants';
import { initGA, trackPageView } from './services/analytics';
import { auth } from './services/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';

export default function App() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalService, setModalService] = useState('');
  const [customService, setCustomService] = useState('');
  const [isQuotationMode, setIsQuotationMode] = useState(false);
  const [isDownloadMode, setIsDownloadMode] = useState(false);
  const [selectedDatasheet, setSelectedDatasheet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, userId: 'admin', user: 'Admin HDB', text: 'Đã cập nhật lộ trình CarbonLoop mới nhất.', time: '10 phút trước', photoURL: null },
    { id: 2, userId: 'clientA', user: 'Khách hàng A', text: 'Tôi muốn xem thêm bảng so sánh nhiệt trị.', time: '1 giờ trước', photoURL: null },
    { id: 3, userId: 'consultant', user: 'Consultant', text: 'Đã thêm phần Case Study nhà máy giấy.', time: '3 giờ trước', photoURL: null }
  ]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Kiểm toán năng lượng nhà máy Giấy', dueDate: '2024-04-15', status: 'upcoming', priority: 'high' },
    { id: 2, title: 'Thiết kế hệ thống cấp liệu Biomass', dueDate: '2024-03-25', status: 'overdue', priority: 'medium' },
    { id: 3, title: 'Ký kết hợp đồng cung ứng EcoLoop™', dueDate: '2024-05-01', status: 'upcoming', priority: 'low' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskFilter, setTaskFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [activeHubTab, setActiveHubTab] = useState<'brief' | 'dashboard' | 'hub'>('brief');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [prices, setPrices] = useState({
    woodPellets: 155,
    riceHuskPellets: 120,
    cashewShellCake: 180
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'landing' | 'crm'>('landing');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const isAdmin = user && user.email && ADMIN_EMAILS.includes(user.email);

  const MOCK_PROJECTS = [
    { 
      id: 1, 
      name: 'Bình Dương Paper Mill Net Zero', 
      client: 'Bình Dương Paper Mill',
      status: 'In Progress', 
      progress: 65,
      manager: 'Nguyễn Văn A',
      startDate: '2024-01-15',
      description: 'Energy audit and fuel transition to biomass pellets for the main boiler system.',
      comments: [
        { user: 'Admin', text: 'Audit report submitted.', time: '2 days ago' },
        { user: 'Client', text: 'Looking forward to the fuel transition phase.', time: '1 day ago' }
      ]
    },
    { 
      id: 2, 
      name: 'ABC Food Factory Biomass Supply', 
      client: 'ABC Food',
      status: 'Planning', 
      progress: 20,
      manager: 'Trần Thị B',
      startDate: '2024-03-01',
      description: 'Setting up long-term supply chain for rice husk pellets and cashew shell cake.',
      comments: [
        { user: 'Admin', text: 'Initial logistics plan drafted.', time: '5 hours ago' }
      ]
    },
    { 
      id: 3, 
      name: 'Thành Công Textile Energy Audit', 
      client: 'Thành Công Textile',
      status: 'Completed', 
      progress: 100,
      manager: 'Lê Văn C',
      startDate: '2023-11-10',
      description: 'Full energy audit and optimization of the steam distribution network.',
      comments: [
        { user: 'Client', text: 'Great results, 15% energy saving achieved.', time: '1 week ago' }
      ]
    }
  ];

  // Initialize GA
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
      trackPageView(window.location.pathname);
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      console.log("Initiating dashboard fetch...");
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
        setLastUpdate(new Date());
      } else {
        console.error("Dashboard API returned success:false", result.error);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      // Fallback to mock data if fetch fails completely
      if (!dashboardData) {
        console.log("Using fallback mock data due to fetch error");
        setDashboardData({
          totalLeads: 0,
          conversionRate: "0%",
          activeProjects: 0,
          carbonOffset: "0 Tons",
          topProducts: [],
          monthlySavings: [],
          leadStatus: []
        });
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Auth listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Mock dynamic pricing update
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        woodPellets: prev.woodPellets + (Math.random() * 2 - 1),
        riceHuskPellets: prev.riceHuskPellets + (Math.random() * 2 - 1),
        cashewShellCake: prev.cashewShellCake + (Math.random() * 2 - 1)
      }));
      setLastUpdate(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!auth) {
      alert(i18n.language === 'vi' ? 'Cấu hình Firebase chưa hoàn tất. Vui lòng kiểm tra API Key.' : 'Firebase configuration is incomplete. Please check your API Key.');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    if (!window.confirm(t('hub.confirmComment'))) return;

    const commentObj = {
      id: Date.now(),
      userId: user.uid,
      user: user.displayName || user.email || 'Anonymous',
      text: newComment,
      time: t('hub.justNow'),
      photoURL: user.photoURL
    };

    // Optimistic update
    setComments(prev => [commentObj, ...prev]);
    setNewComment('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...commentObj,
          userEmail: user.email
        })
      });

      if (!response.ok) {
        console.error("Failed to save comment to Google Sheets");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleSaveEditComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCommentText.trim()) return;

    setComments(prev => prev.map(c => 
      c.id === editingCommentId ? { ...c, text: editCommentText } : c
    ));
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleDeleteComment = (id: number) => {
    if (window.confirm(t('hub.confirmDeleteComment'))) {
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTaskTitle.trim() || !newTaskDueDate) return;

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      status: new Date(newTaskDueDate) < new Date() ? 'overdue' : 'upcoming'
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: task.status === 'completed' ? (new Date(task.dueDate) < new Date() ? 'overdue' : 'upcoming') : 'completed' } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm(t('hub.confirmDelete'))) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const startEditing = (task: any) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate);
    setEditPriority(task.priority || 'medium');
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editDueDate) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTaskId 
        ? { 
            ...task, 
            title: editTitle, 
            dueDate: editDueDate,
            priority: editPriority,
            status: task.status === 'completed' ? 'completed' : (new Date(editDueDate) < new Date() ? 'overdue' : 'upcoming')
          } 
        : task
    ));
    setEditingTaskId(null);
  };

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    company: '',
    country: '',
    email: '',
    boilerCapacity: '',
    fuelConsumption: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number to allow only numeric and leading +
    if (name === 'phone') {
      const filteredValue = value.replace(/(?!^\+)[^\d]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (intent: string = '', isQuote: boolean = false, isDownload: boolean = false, datasheetName: string = '') => {
    setIsQuotationMode(isQuote);
    setIsDownloadMode(isDownload);
    setSelectedDatasheet(datasheetName);
    
    const standardValues = [
      "Net Zero Roadmap",
      "Energy Audit",
      "Fuel Conversion",
      "Biomass Supply",
      i18n.language === 'vi' ? "Báo giá nhanh" : "Quick Quote"
    ];

    if (standardValues.includes(intent)) {
      setModalService(intent);
      setCustomService('');
    } else if (intent) {
      setModalService('Other');
      setCustomService(intent);
    } else {
      setModalService(isQuote ? (i18n.language === 'vi' ? 'Báo giá nhanh' : 'Quick Quote') : isDownload ? 'Download Datasheet' : standardValues[0]);
      setCustomService('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      service: isDownloadMode ? `Download: ${selectedDatasheet}` : (modalService === 'Other' ? customService : modalService),
      type: isQuotationMode ? 'Quotation' : isDownloadMode ? 'Download' : 'Consultation',
      source: 'Website Lead',
      datasheet: selectedDatasheet
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(t('form.success'));
        setIsModalOpen(false);
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          company: '',
          country: '',
          email: '',
          boilerCapacity: '',
          fuelConsumption: ''
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const standardServices = [
    "Net Zero Roadmap",
    "Energy Audit",
    "Fuel Conversion",
    "Biomass Supply",
    "Báo giá nhanh"
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'vi', label: 'VN', flag: 'vn' },
    { code: 'en', label: 'EN', flag: 'us' },
    { code: 'ko', label: 'KR', flag: 'kr' },
    { code: 'ja', label: 'JP', flag: 'jp' },
    { code: 'zh', label: 'CN', flag: 'cn' },
    { code: 'es', label: 'ES', flag: 'es' }
  ];

  const toggleLanguage = () => {
    const currentIndex = languages.findIndex(l => l.code === i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex].code);
  };

  const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];
    return (
      <button 
        onClick={toggleLanguage}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${scrolled ? 'border-hdb-dark/20 text-hdb-dark hover:bg-hdb-dark/5' : 'border-white/20 text-white hover:bg-white/10'} ${className}`}
      >
        <img src={`https://flagcdn.com/w20/${currentLang.flag}.png`} alt={currentLang.label} className="w-5 h-auto rounded-sm" />
        <span className="text-xs font-bold uppercase">{currentLang.label}</span>
      </button>
    );
  };

  if (currentView === 'crm') {
    if (!isAdmin) {
      setCurrentView('landing');
      return null;
    }
    return <CRMSystem onBack={() => setCurrentView('landing')} dashboardData={dashboardData} onRefresh={fetchDashboard} lastUpdate={lastUpdate} />;
  }

  return (
    <div className="min-h-screen bg-white selection:bg-hdb-green selection:text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-hdb-green rounded-lg flex items-center justify-center">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className={`text-xl font-display font-bold tracking-tighter ${scrolled ? 'text-hdb-dark' : 'text-white'}`}>
              HDB <span className="text-hdb-accent">Biomass</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {isAdmin && (
              <button 
                onClick={() => setCurrentView('crm')}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${scrolled ? 'text-hdb-green hover:text-hdb-accent' : 'text-white hover:text-hdb-accent'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                {t('nav.crmDashboard')}
              </button>
            )}
            {[
              { key: 'solutions', label: t('nav.solutions') },
              { key: 'products', label: t('nav.products') },
              { key: 'carbonloop', label: t('nav.carbonloop') },
              { key: 'projects', label: t('nav.projects') },
              { key: 'contact', label: t('nav.contact') }
            ].map((item) => (
              <a 
                key={item.key} 
                href={`#${item.key}`} 
                className={`text-sm font-medium hover:text-hdb-accent transition-colors ${scrolled ? 'text-hdb-dark' : 'text-white'}`}
              >
                {item.label}
              </a>
            ))}
            <LanguageSwitcher />
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-hdb-green/20 flex items-center justify-center overflow-hidden border border-hdb-green/30">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-hdb-green" />
                    )}
                  </div>
                  <span className={`text-xs font-bold ${scrolled ? 'text-hdb-dark' : 'text-white'}`}>{user.displayName?.split(' ')[0]}</span>
                </div>
                <button onClick={handleLogout} className={`p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-all`} title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleLogin}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${scrolled ? 'border-hdb-dark/20 text-hdb-dark hover:bg-hdb-dark/5' : 'border-white/20 text-white hover:bg-white/10'}`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{i18n.language === 'vi' ? 'Đăng nhập' : 'Login'}</span>
                </button>
                <button 
                  onClick={handleLogin}
                  className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all ${scrolled ? 'border-hdb-dark/20 text-hdb-dark hover:bg-hdb-dark/5' : ''}`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{i18n.language === 'vi' ? 'Đăng ký' : 'Register'}</span>
                </button>
              </div>
            )}

            <button 
              onClick={() => openModal('Báo giá nhanh')}
              className="bg-hdb-green text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-hdb-accent transition-all shadow-lg shadow-hdb-green/20"
            >
              {t('nav.getQuote')}
            </button>
          </div>

          <button className="md:hidden text-hdb-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className={scrolled ? 'text-hdb-dark' : 'text-white'} /> : <Menu className={scrolled ? 'text-hdb-dark' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-hdb-earth overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {[
                  { key: 'solutions', label: t('nav.solutions') },
                  { key: 'products', label: t('nav.products') },
                  { key: 'carbonloop', label: t('nav.carbonloop') },
                  { key: 'projects', label: t('nav.projects') },
                  { key: 'contact', label: t('nav.contact') }
                ].map((item) => (
                  <a 
                    key={item.key} 
                    href={`#${item.key}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-hdb-dark hover:text-hdb-green transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                {isAdmin && (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentView('crm');
                    }}
                    className="text-lg font-bold text-hdb-green flex items-center gap-2 transition-colors"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    {t('nav.crmDashboard')}
                  </button>
                )}
                <div className="pt-4 border-t border-hdb-earth flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-hdb-dark/40 uppercase tracking-widest">{i18n.language === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                    <LanguageSwitcher className="!border-hdb-dark/20 !text-hdb-dark" />
                  </div>
                  
                  {user ? (
                    <div className="flex items-center justify-between p-4 bg-hdb-earth/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-hdb-green/20 flex items-center justify-center overflow-hidden">
                          {user.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-hdb-green" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-hdb-dark">{user.displayName || 'User'}</p>
                          <p className="text-[10px] text-hdb-dark/50">{user.email}</p>
                        </div>
                      </div>
                      <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 text-xl rounded-lg">
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { setIsMenuOpen(false); handleLogin(); }}
                        className="flex items-center justify-center gap-2 py-3 border border-hdb-dark/20 rounded-xl font-bold text-hdb-dark"
                      >
                        <LogIn className="w-4 h-4" />
                        {i18n.language === 'vi' ? 'Đăng nhập' : 'Login'}
                      </button>
                      <button 
                        onClick={() => { setIsMenuOpen(false); handleLogin(); }}
                        className="flex items-center justify-center gap-2 py-3 bg-hdb-dark text-white rounded-xl font-bold"
                      >
                        <UserPlus className="w-4 h-4" />
                        {i18n.language === 'vi' ? 'Đăng ký' : 'Register'}
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    openModal('Báo giá nhanh');
                  }}
                  className="w-full bg-hdb-green text-white py-4 rounded-xl font-bold shadow-lg shadow-hdb-green/20"
                >
                  {t('nav.getQuote')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Section: Dynamic Pricing */}
      <section className="py-12 bg-hdb-dark border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-hdb-accent/20 flex items-center justify-center">
                <TrendingUp className="text-hdb-accent w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  {i18n.language === 'vi' ? 'Giá thị trường thời gian thực' : 'Real-time Market Pricing'}
                  <RefreshCw className="w-3 h-3 text-hdb-green animate-spin" />
                </h4>
                <p className="text-white/40 text-xs uppercase tracking-widest">
                  {i18n.language === 'vi' ? 'Cập nhật:' : 'Last update:'} {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
              {[
                { name: t('products.woodPellets.name'), price: prices.woodPellets, unit: 'USD/Ton' },
                { name: t('products.riceHuskPellets.name'), price: prices.riceHuskPellets, unit: 'USD/Ton' },
                { name: t('products.cashewShellCake.name'), price: prices.cashewShellCake, unit: 'USD/Ton' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center min-w-[180px]">
                  <span className="text-[10px] font-bold text-white/40 uppercase mb-1 text-center">{item.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-display font-bold text-hdb-accent">${item.price.toFixed(2)}</span>
                    <span className="text-[10px] text-white/60">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-hdb-dark">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=2000" 
            alt="Biomass Energy" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-hdb-dark via-hdb-dark/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-hdb-green/20 border border-hdb-green/30 text-hdb-green mb-8">
              <span className="w-2 h-2 rounded-full bg-hdb-green animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/80">{t('hero.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
              {t('hero.title')} <br /> 
              <span className="text-hdb-accent italic">{t('hero.subtitle')}</span>
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('savings-calculator');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-hdb-green text-white px-8 py-4 rounded-xl font-bold hover:bg-hdb-accent transition-all flex items-center justify-center gap-2 group"
              >
                {i18n.language === 'vi' ? 'Tính toán tiết kiệm' : 'Calculate Savings'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => openModal('Net Zero Roadmap')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                {t('hero.cta2')}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Section 1: Factory Energy Problem */}
      <section id="solutions" className="section-padding bg-hdb-earth/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-hdb-green uppercase tracking-[0.2em] mb-4">{t('challenges.tag')}</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
                {t('challenges.title')}
              </h3>
              <div className="space-y-6">
                {[
                  { icon: TrendingDown, title: t('challenges.item1.title'), desc: t('challenges.item1.desc') },
                  { icon: CloudOff, title: t('challenges.item2.title'), desc: t('challenges.item2.desc') },
                  { icon: Factory, title: t('challenges.item3.title'), desc: t('challenges.item3.desc') }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm border border-hdb-earth"
                  >
                    <div className="w-14 h-14 bg-hdb-earth rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="text-hdb-green w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-hdb-dark/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1000" 
                  alt="Industrial Factory" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass-card p-8 rounded-2xl max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-hdb-green rounded-full flex items-center justify-center">
                    <BarChart3 className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-hdb-green">{t('challenges.stats.value')}</p>
                    <p className="text-xs font-bold uppercase text-hdb-dark/50">{t('challenges.stats.label')}</p>
                  </div>
                </div>
                <p className="text-sm text-hdb-dark/70 italic">
                  {t('challenges.stats.quote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SavingsCalculator onOpenModal={openModal} />

      {/* Fuel Comparison Table */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-hdb-green uppercase tracking-[0.2em] mb-4">
              {i18n.language === 'vi' ? 'So sánh hiệu quả' : 'Efficiency Comparison'}
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {i18n.language === 'vi' ? 'Tại sao chọn Biomass?' : 'Why Choose Biomass?'}
            </h3>
            <p className="text-hdb-dark/60 text-lg">
              {i18n.language === 'vi' 
                ? 'So sánh trực tiếp giữa nhiên liệu sinh khối và các loại nhiên liệu truyền thống.' 
                : 'Direct comparison between biomass fuel and traditional fuels.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-hdb-earth">
                  <th className="py-6 px-4 text-left text-hdb-dark/40 font-bold uppercase tracking-widest text-xs">{i18n.language === 'vi' ? 'Chỉ số' : 'Metric'}</th>
                  <th className="py-6 px-4 text-center bg-hdb-green/5 text-hdb-green font-bold uppercase tracking-widest text-xs">Biomass (EcoLoop™)</th>
                  <th className="py-6 px-4 text-center text-hdb-dark/40 font-bold uppercase tracking-widest text-xs">{i18n.language === 'vi' ? 'Than đá' : 'Coal'}</th>
                  <th className="py-6 px-4 text-center text-hdb-dark/40 font-bold uppercase tracking-widest text-xs">DO / FO Oil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hdb-earth/30">
                {[
                  { 
                    label: i18n.language === 'vi' ? 'Chi phí năng lượng' : 'Energy Cost', 
                    biomass: i18n.language === 'vi' ? 'Thấp nhất' : 'Lowest', 
                    coal: i18n.language === 'vi' ? 'Trung bình' : 'Medium', 
                    oil: i18n.language === 'vi' ? 'Rất cao' : 'Very High' 
                  },
                  { 
                    label: i18n.language === 'vi' ? 'Phát thải CO2' : 'CO2 Emissions', 
                    biomass: i18n.language === 'vi' ? 'Trung hòa (~0)' : 'Neutral (~0)', 
                    coal: i18n.language === 'vi' ? 'Rất cao' : 'Very High', 
                    oil: i18n.language === 'vi' ? 'Cao' : 'High' 
                  },
                  { 
                    label: i18n.language === 'vi' ? 'Tro xỉ' : 'Ash Content', 
                    biomass: '< 1-3%', 
                    coal: '15-30%', 
                    oil: 'Negligible' 
                  },
                  { 
                    label: i18n.language === 'vi' ? 'Tác động lò hơi' : 'Boiler Impact', 
                    biomass: i18n.language === 'vi' ? 'Sạch, ít ăn mòn' : 'Clean, low corrosion', 
                    coal: i18n.language === 'vi' ? 'Ăn mòn cao' : 'High corrosion', 
                    oil: i18n.language === 'vi' ? 'Đóng cặn' : 'Soof build-up' 
                  }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-hdb-earth/5 transition-colors">
                    <td className="py-6 px-4 font-bold text-hdb-dark">{row.label}</td>
                    <td className="py-6 px-4 text-center bg-hdb-green/5 font-bold text-hdb-green">{row.biomass}</td>
                    <td className="py-6 px-4 text-center text-hdb-dark/60">{row.coal}</td>
                    <td className="py-6 px-4 text-center text-hdb-dark/60">{row.oil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partners & Certifications */}
      <section className="py-12 bg-white border-y border-hdb-earth/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-hdb-dark/30 mb-8">
            {i18n.language === 'vi' ? 'Đối tác & Chứng nhận tiêu chuẩn' : 'Partners & Global Certifications'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using placeholders for logos */}
            <div className="flex items-center gap-2 font-display font-bold text-2xl">
              <span className="text-hdb-green">ISO</span> 9001:2015
            </div>
            <div className="flex items-center gap-2 font-display font-bold text-2xl">
              <span className="text-hdb-green">FSC</span> Certified
            </div>
            <div className="flex items-center gap-2 font-display font-bold text-2xl">
              <span className="text-hdb-green">SGS</span> Verified
            </div>
            <div className="flex items-center gap-2 font-display font-bold text-2xl">
              <span className="text-hdb-green">GIZ</span> Partner
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Biomass Fuel Solution (EcoLoop) */}
      <ProductCatalog onDownload={(productName) => openModal('Download', false, true, productName)} />

      {/* Section 3: CarbonLoop Consulting */}
      <section id="carbonloop" className="section-padding bg-hdb-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg viewBox="0 0 800 800" className="w-full h-full text-hdb-accent" preserveAspectRatio="none">
            <motion.path
              d="M -100 400 Q 200 100 400 400 T 900 400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              animate={{
                d: [
                  "M -100 400 Q 200 100 400 400 T 900 400",
                  "M -100 400 Q 200 700 400 400 T 900 400",
                  "M -100 400 Q 200 100 400 400 T 900 400"
                ]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M -100 500 Q 300 200 500 500 T 900 500"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              animate={{
                d: [
                  "M -100 500 Q 300 800 500 500 T 900 500",
                  "M -100 500 Q 300 200 500 500 T 900 500",
                  "M -100 500 Q 300 800 500 500 T 900 500"
                ]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx="600"
              cy="200"
              r="100"
              fill="currentColor"
              className="opacity-10"
              animate={{
                y: [0, 50, 0],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-hdb-accent/20 border border-hdb-accent/30 text-hdb-accent mb-6">
                <span className="text-xs font-bold uppercase tracking-widest">{t('carbonloop.tag')}</span>
              </div>
              <h3 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
                {i18n.language === 'vi' ? (
                  <>Lộ Trình <span className="text-hdb-accent">Net Zero</span> <br /> Cho Doanh Nghiệp</>
                ) : (
                  <>Net Zero <span className="text-hdb-accent">Roadmap</span> <br /> For Businesses</>
                )}
              </h3>
              <p className="text-xl text-white/60 mb-12 leading-relaxed">
                {t('carbonloop.description')}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {(t('carbonloop.services', { returnObjects: true }) as any[]).map((item, i) => (
                  <div key={i} className="group">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-4 group-hover:bg-hdb-accent group-hover:border-hdb-accent transition-all">
                      <CheckCircle2 className="w-6 h-6 text-hdb-accent group-hover:text-white" />
                    </div>
                    <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl">
              <h4 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Quote className="text-hdb-accent w-8 h-8" />
                {t('carbonloop.whyChoose.title')}
              </h4>
              <div className="space-y-8">
                {(t('carbonloop.whyChoose.items', { returnObjects: true }) as any[]).map((stat, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold uppercase tracking-widest text-hdb-accent mb-1">{stat.label}</p>
                    <p className="text-xl font-medium">{stat.value}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => openModal('Net Zero Roadmap')}
                className="w-full mt-12 py-5 bg-hdb-accent text-white rounded-2xl font-bold hover:bg-hdb-accent/80 transition-all"
              >
                {t('hero.cta2')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Case Studies */}
      <section id="projects" className="section-padding bg-hdb-earth/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-hdb-green uppercase tracking-[0.2em] mb-4">{t('projects.tag')}</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold">{t('projects.title')}</h3>
            </div>
            <button className="flex items-center gap-2 text-hdb-green font-bold hover:gap-4 transition-all">
              {t('projects.viewAll')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {CASE_STUDIES.map((study) => (
              <div key={study.id} className="group cursor-pointer">
                <div className="relative h-80 rounded-3xl overflow-hidden mb-6">
                  <img 
                    src={study.image} 
                    alt={t(`projects.${study.id.replace(/-/g, '')}.title`)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hdb-dark/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex gap-2 mb-4">
                      {study.tags.map(tag => {
                        const tagKey = tag.toLowerCase().replace(/\s+/g, '');
                        const translatedTag = t(`projects.tags.${tagKey === 'woodpellets' ? 'woodPellets' : tagKey === 'energyaudit' ? 'energyAudit' : tagKey}`, tag);
                        return (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full">
                            {translatedTag}
                          </span>
                        );
                      })}
                    </div>
                    <h4 className="text-2xl font-bold text-white group-hover:text-hdb-accent transition-colors">
                      {t(`projects.${study.id.replace(/-/g, '')}.title`)}
                    </h4>
                  </div>
                </div>
                <div className="px-4">
                  <p className="text-hdb-dark/40 text-sm font-bold uppercase tracking-widest mb-2">{t(`projects.${study.id.replace(/-/g, '')}.client`)}</p>
                  <p className="text-hdb-dark/70 text-lg leading-relaxed">
                    <span className="text-hdb-green font-bold">{t('projects.result')}:</span> {t(`projects.${study.id.replace(/-/g, '')}.result`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Request Quotation */}
      <section id="contact" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="bg-hdb-green rounded-[3rem] overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
                alt="Nature" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 items-center">
              <div className="p-12 lg:p-20 text-white">
                <h3 className="text-4xl md:text-6xl font-display font-bold mb-8">
                  {i18n.language === 'vi' ? (
                    <>Sẵn sàng chuyển đổi <br /> sang năng lượng sạch?</>
                  ) : (
                    <>Ready to switch <br /> to clean energy?</>
                  )}
                </h3>
                <p className="text-xl text-white/70 mb-12">
                  {t('contactSection.description')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-white/50">Hotline 24/7</p>
                      <p className="text-xl font-bold">+84 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-white/50">Email</p>
                      <p className="text-xl font-bold">sales@hdb-biomass.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-white/50">{t('footer.address')}</p>
                      <p className="text-xl font-bold">{t('footer.address')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-12 lg:p-20">
                <form 
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(t('form.success'));
                    (e.target as HTMLFormElement).reset();
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('form.fullName')}</label>
                      <input required type="text" className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all" placeholder={t('formFields.placeholderName')} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('form.phone')}</label>
                      <input required type="tel" className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all" placeholder="090 123 4567" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('form.company')}</label>
                    <input required type="text" className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all" placeholder={t('formFields.placeholderCompany')} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('form.email')}</label>
                    <input 
                      required 
                      type="email" 
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      title={t('formFields.emailTitle')}
                      className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all" 
                      placeholder="name@company.com" 
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('form.boilerCapacity')}</label>
                      <input required type="text" className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all" placeholder={t('formFields.placeholderCapacity')} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('formFields.currentFuel')}</label>
                      <select className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all">
                        <option>{t('formFields.fuelOptions.coal')}</option>
                        <option>{t('formFields.fuelOptions.oil')}</option>
                        <option>{t('formFields.fuelOptions.biomass')}</option>
                        <option>{t('formFields.fuelOptions.other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-hdb-dark/50 mb-2">{t('formFields.consultationNeed')}</label>
                    <textarea required rows={4} className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green transition-all" placeholder={t('formFields.placeholderConsultation')}></textarea>
                  </div>
                    <button 
                      type="submit"
                      className="w-full py-5 bg-hdb-green text-white rounded-2xl font-bold hover:bg-hdb-accent transition-all shadow-xl shadow-hdb-green/20"
                    >
                      {t('form.submit')}
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-hdb-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-hdb-green/5 skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-hdb-accent uppercase tracking-[0.2em] mb-4">
              {i18n.language === 'vi' ? 'Khách hàng nói gì' : 'Testimonials'}
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold">
              {i18n.language === 'vi' ? 'Niềm tin từ đối tác' : 'Trusted by Partners'}
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mr. Nguyễn Văn A',
                role: i18n.language === 'vi' ? 'Giám đốc vận hành, Nhà máy Giấy X' : 'COO, Paper Factory X',
                quote: i18n.language === 'vi' ? 'Từ khi chuyển sang dùng củi trấu viên của HDB, chi phí năng lượng của chúng tôi giảm 25% và không còn lo ngại về khí thải đen.' : 'Since switching to HDB rice husk pellets, our energy costs have dropped by 25% and we no longer worry about black smoke emissions.'
              },
              {
                name: 'Ms. Lê Thị B',
                role: i18n.language === 'vi' ? 'Quản lý năng lượng, Tập đoàn Dệt may Y' : 'Energy Manager, Textile Group Y',
                quote: i18n.language === 'vi' ? 'Dịch vụ kiểm toán năng lượng của HDB rất chuyên nghiệp. Họ giúp chúng tôi nhìn ra những lãng phí mà trước đây không hề biết.' : 'HDB energy audit service is very professional. They helped us identify wastes we never knew existed.'
              },
              {
                name: 'Mr. David Tran',
                role: i18n.language === 'vi' ? 'Giám đốc bền vững, Công ty Thực phẩm Z' : 'Sustainability Director, Food Co Z',
                quote: i18n.language === 'vi' ? 'HDB là đối tác chiến lược giúp chúng tôi đạt được mục tiêu Net Zero sớm hơn dự kiến 2 năm.' : 'HDB is a strategic partner helping us achieve our Net Zero goals 2 years ahead of schedule.'
              }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all group">
                <Quote className="w-10 h-10 text-hdb-accent mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                <p className="text-lg italic mb-8 text-white/80 leading-relaxed">"{t.quote}"</p>
                <div>
                  <h4 className="font-bold text-hdb-accent">{t.name}</h4>
                  <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Collaboration Hub */}
      <section className="py-24 bg-hdb-earth/10 border-y border-hdb-earth/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hdb-green/10 text-hdb-green text-[10px] font-bold uppercase tracking-wider mb-4">
                <FileText className="w-3 h-3" />
                {t('hub.tag')}
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
                {i18n.language === 'vi' ? (
                  <>Trung tâm <span className="text-hdb-green italic">Tài liệu & Cộng tác</span></>
                ) : (
                  <>Document & <span className="text-hdb-green italic">Collaboration Hub</span></>
                )}
              </h2>
              <p className="text-hdb-dark/60 text-lg">
                {t('hub.description')}
              </p>
            </div>
            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl border border-hdb-earth shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-hdb-earth overflow-hidden flex items-center justify-center border-2 border-hdb-green/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-5 h-5 text-hdb-green" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-hdb-dark">{user.displayName || user.email}</p>
                    <button 
                      onClick={handleLogout}
                      className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="px-6 py-3 bg-hdb-green text-white rounded-xl text-sm font-bold hover:bg-hdb-accent transition-all flex items-center gap-2 shadow-lg shadow-hdb-green/20"
                >
                  <LogIn className="w-4 h-4" />
                  {t('nav.login')}
                </button>
              )}
              <div className="hidden md:flex -space-x-3">
                {[1, 2].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-hdb-earth flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-hdb-green text-white flex items-center justify-center text-xs font-bold">
                  +5
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl border border-hdb-earth/30 overflow-hidden">
              <div className="bg-hdb-earth/20 px-8 py-4 border-b border-hdb-earth/30 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setActiveHubTab('brief')}
                    className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
                      activeHubTab === 'brief' 
                        ? 'border-hdb-green text-hdb-green font-bold' 
                        : 'border-transparent text-hdb-dark/40 hover:text-hdb-dark'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">Project Brief</span>
                  </button>
                  <button 
                    onClick={() => setActiveHubTab('dashboard')}
                    className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
                      activeHubTab === 'dashboard' 
                        ? 'border-hdb-green text-hdb-green font-bold' 
                        : 'border-transparent text-hdb-dark/40 hover:text-hdb-dark'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">Data Dashboard</span>
                  </button>
                  <button 
                    onClick={() => setActiveHubTab('hub')}
                    className={`flex items-center gap-2 py-2 border-b-2 transition-all ${
                      activeHubTab === 'hub' 
                        ? 'border-hdb-green text-hdb-green font-bold' 
                        : 'border-transparent text-hdb-dark/40 hover:text-hdb-dark'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-wider">Project Hub</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-green-600 uppercase">{t('hub.liveEditing')}</span>
                </div>
              </div>
              <div className="p-10 h-[600px] overflow-y-auto scrollbar-hide">
                {activeHubTab === 'brief' ? (
                  <div className="prose prose-sm max-w-none">
                    <h1 className="text-3xl font-display font-bold mb-8">{t('hub.content.title')}</h1>
                    
                    <section className="mb-8">
                      <h2 className="text-xl font-bold text-hdb-green mb-4">{t('hub.content.section1Title')}</h2>
                      <p>{t('hub.content.section1Text')}</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {(t('hub.content.section1Items', { returnObjects: true }) as string[]).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </section>

                    <section className="mb-8 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                      <h2 className="text-xl font-bold text-hdb-green mb-4">{t('hub.content.section2Title')}</h2>
                      <p>{t('hub.content.section2Text')}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-yellow-700 font-bold">
                        <MessageSquare className="w-3 h-3" />
                        {t('hub.content.section2Comment')}
                      </div>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-xl font-bold text-hdb-green mb-4">{t('hub.content.section3Title')}</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-hdb-green/5 rounded-xl border border-hdb-green/20">
                          <h3 className="font-bold mb-2">CarbonLoop™</h3>
                          <p className="text-xs text-hdb-dark/60">{i18n.language === 'vi' ? 'Tư vấn Năng lượng Net Zero: Kiểm toán năng lượng, Chuyển đổi nhiên liệu, Tối ưu hóa lò hơi.' : 'Net Zero Energy Consulting: Energy audit, Fuel transition, Boiler optimization.'}</p>
                        </div>
                        <div className="p-4 bg-hdb-accent/5 rounded-xl border border-hdb-accent/20">
                          <h3 className="font-bold mb-2">EcoLoop™</h3>
                          <p className="text-xs text-hdb-dark/60">{i18n.language === 'vi' ? 'Cung ứng Nhiên liệu Sinh khối: Viên nén gỗ, Viên nén trấu, Bã điều.' : 'Biomass Fuel Supply: Wood pellets, Rice husk pellets, Cashew shell cake.'}</p>
                        </div>
                      </div>
                    </section>

                    <section className="mb-8">
                      <h2 className="text-xl font-bold text-hdb-green mb-4">{t('hub.content.section4Title')}</h2>
                      <p>{t('hub.content.section4Text')}</p>
                    </section>
                  </div>
                ) : activeHubTab === 'hub' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-display font-bold text-hdb-dark">Active Global Projects</h2>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                          3 Active
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {MOCK_PROJECTS.map((project) => (
                        <motion.button
                          key={project.id}
                          whileHover={{ scale: 1.01, x: 5 }}
                          onClick={() => {
                            setSelectedProject(project);
                            setIsProjectModalOpen(true);
                          }}
                          className="w-full text-left p-6 bg-white rounded-2xl border border-hdb-earth/30 hover:border-hdb-green/50 hover:shadow-lg transition-all group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                project.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>
                                <GanttChartSquare className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="font-bold text-hdb-dark group-hover:text-hdb-green transition-colors">{project.name}</h3>
                                <p className="text-xs text-hdb-dark/40">{project.client}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {project.status}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-hdb-earth/20 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    className={`h-full ${
                                      project.status === 'Completed' ? 'bg-emerald-500' :
                                      project.status === 'In Progress' ? 'bg-blue-500' :
                                      'bg-orange-500'
                                    }`}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-hdb-dark/60">{project.progress}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-hdb-earth/20">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-[10px] text-hdb-dark/60">
                                <User className="w-3 h-3" />
                                {project.manager}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] text-hdb-dark/60">
                                <Calendar className="w-3 h-3" />
                                {project.startDate}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-hdb-green">
                              View Details
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-display font-bold text-hdb-dark">Real-time Performance Metrics</h2>
                      <div className="text-[10px] font-bold text-hdb-dark/40 uppercase tracking-widest flex items-center gap-2">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Last updated: {lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Leads', value: dashboardData?.totalLeads || '0', icon: User, color: 'bg-blue-500' },
                        { label: 'Conversion', value: dashboardData?.conversionRate || '0%', icon: TrendingUp, color: 'bg-emerald-500' },
                        { label: 'Active Projects', value: dashboardData?.activeProjects || '0', icon: FileText, color: 'bg-orange-500' },
                        { label: 'Carbon Offset', value: dashboardData?.carbonOffset || '0 Tons', icon: Leaf, color: 'bg-hdb-green' }
                      ].map((stat, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-hdb-earth/10 p-4 rounded-2xl border border-hdb-earth/30 hover:shadow-md transition-all"
                        >
                          <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-white mb-3`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                          <p className="text-[10px] font-bold text-hdb-dark/40 uppercase mb-1">{stat.label}</p>
                          <p className="text-xl font-bold text-hdb-dark">{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-hdb-earth/30 shadow-sm">
                          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-hdb-accent" />
                            Monthly Savings Trend (USD)
                          </h3>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={dashboardData?.monthlySavings || []}>
                                <defs>
                                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="savings" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSavings)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-hdb-earth/30 shadow-sm">
                          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-hdb-green" />
                            Product Interest Distribution
                          </h3>
                          <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dashboardData?.topProducts || []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={100} />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                  cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-hdb-earth/30 shadow-sm">
                          <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                            <PieChartIcon className="w-4 h-4 text-blue-500" />
                            Lead Status
                          </h3>
                          <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={dashboardData?.leadStatus || []}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {(dashboardData?.leadStatus || []).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="bg-hdb-green/5 p-6 rounded-2xl border border-hdb-green/20">
                          <h4 className="text-xs font-bold text-hdb-green uppercase tracking-widest mb-4">Insights</h4>
                          <ul className="space-y-3">
                            <li className="text-xs text-hdb-dark/70 flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-hdb-green mt-1 shrink-0" />
                              Wood Pellets remain the top product with 45% of total interest.
                            </li>
                            <li className="text-xs text-hdb-dark/70 flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-hdb-green mt-1 shrink-0" />
                              Conversion rate increased by 2.1% compared to last month.
                            </li>
                            <li className="text-xs text-hdb-dark/70 flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-hdb-green mt-1 shrink-0" />
                              New leads from the Northern region are up by 15%.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-hdb-dark text-white p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-hdb-green/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Connected to Google Sheets</h3>
                          <p className="text-sm text-white/60 max-w-md">
                            This dashboard is live-synced with your Google Sheets database via secure webhooks. All lead generation and project updates are reflected here in real-time.
                          </p>
                        </div>
                        <button className="px-6 py-3 bg-hdb-green text-white rounded-xl font-bold hover:bg-hdb-accent transition-all flex items-center gap-2 whitespace-nowrap">
                          <Download className="w-4 h-4" />
                          Export Full Report
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <section className="mt-12 pt-12 border-t border-hdb-earth/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-display font-bold text-hdb-dark flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-hdb-green" />
                        {t('hub.tasks')}
                      </h2>
                      <div className="flex bg-hdb-earth/10 p-1 rounded-xl">
                        {(['all', 'upcoming', 'overdue', 'completed'] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setTaskFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                              taskFilter === f 
                                ? 'bg-white text-hdb-green shadow-sm' 
                                : 'text-hdb-dark/40 hover:text-hdb-dark'
                            }`}
                          >
                            {t(`hub.${f}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                    {user ? (
                      <form onSubmit={handleTaskSubmit} className="flex gap-2 flex-wrap md:flex-nowrap">
                        <input 
                          type="text" 
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder={t('hub.taskTitle')}
                          className="flex-1 min-w-[150px] px-4 py-2 bg-hdb-earth/10 border border-hdb-earth rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hdb-green"
                        />
                        <input 
                          type="date" 
                          value={newTaskDueDate}
                          onChange={(e) => setNewTaskDueDate(e.target.value)}
                          className="px-4 py-2 bg-hdb-earth/10 border border-hdb-earth rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hdb-green"
                        />
                        <select
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value as any)}
                          className="px-4 py-2 bg-hdb-earth/10 border border-hdb-earth rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hdb-green"
                        >
                          <option value="low">{i18n.language === 'vi' ? 'Thấp' : 'Low'}</option>
                          <option value="medium">{i18n.language === 'vi' ? 'Vừa' : 'Medium'}</option>
                          <option value="high">{i18n.language === 'vi' ? 'Cao' : 'High'}</option>
                        </select>
                        <button 
                          type="submit"
                          disabled={!newTaskTitle.trim() || !newTaskDueDate}
                          className="bg-hdb-green text-white p-2 rounded-xl hover:bg-hdb-accent transition-all disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-3 bg-hdb-earth/10 px-4 py-2 rounded-xl">
                        <span className="text-xs text-hdb-dark/60">{t('hub.loginToComment')}</span>
                        <button 
                          onClick={handleLogin}
                          className="text-xs font-bold text-hdb-green hover:text-hdb-accent flex items-center gap-1"
                        >
                          <LogIn className="w-3 h-3" />
                          {i18n.language === 'vi' ? 'Đăng nhập' : 'Login'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {tasks
                        .filter(task => taskFilter === 'all' || task.status === taskFilter)
                        .map((task) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ 
                            opacity: task.status === 'completed' ? 0.8 : 1, 
                            y: 0,
                            scale: task.status === 'completed' ? 0.98 : 1,
                            transition: { duration: 0.3, ease: "easeOut" }
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.9, 
                            x: -50, 
                            transition: { duration: 0.2, ease: "easeIn" } 
                          }}
                          key={task.id} 
                          className={`p-6 rounded-2xl border border-l-4 transition-colors flex items-center justify-between overflow-hidden ${
                            task.status === 'completed' ? 'bg-emerald-50/30 border-emerald-100 border-l-emerald-500' : 
                            task.status === 'overdue' ? 'bg-red-50 border-red-100 border-l-red-500' : 
                            'bg-white border-hdb-earth/30 border-l-blue-400 shadow-sm'
                          }`}
                        >
                        <div className="flex items-center gap-4 flex-1">
                          <button 
                            onClick={() => user && toggleTaskStatus(task.id)}
                            disabled={!user}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              task.status === 'completed' ? 'bg-hdb-green border-hdb-green text-white' : 'border-hdb-earth/50 hover:border-hdb-green'
                            } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
                          >
                            <AnimatePresence mode="wait">
                              {task.status === 'completed' && (
                                <motion.div
                                  key="check"
                                  initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
                                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                  exit={{ opacity: 0, scale: 0.2, rotate: 45 }}
                                  transition={{ 
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                  }}
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                          
                          {user && editingTaskId === task.id ? (
                            <div className="flex-1 flex flex-col gap-2">
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="flex-1 px-3 py-1 bg-white border border-hdb-earth rounded-lg text-sm focus:ring-2 focus:ring-hdb-green"
                                />
                                <input 
                                  type="date" 
                                  value={editDueDate}
                                  onChange={(e) => setEditDueDate(e.target.value)}
                                  className="px-3 py-1 bg-white border border-hdb-earth rounded-lg text-sm focus:ring-2 focus:ring-hdb-green"
                                />
                              </div>
                              <select
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value as any)}
                                className="w-full px-3 py-1 bg-white border border-hdb-earth rounded-lg text-sm focus:ring-2 focus:ring-hdb-green"
                              >
                                <option value="low">{i18n.language === 'vi' ? 'Ưu tiên: Thấp' : 'Priority: Low'}</option>
                                <option value="medium">{i18n.language === 'vi' ? 'Ưu tiên: Vừa' : 'Priority: Medium'}</option>
                                <option value="high">{i18n.language === 'vi' ? 'Ưu tiên: Cao' : 'Priority: High'}</option>
                              </select>
                            </div>
                          ) : (
                            <div>
                              <h4 className="relative font-bold text-sm text-hdb-dark flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${
                                  task.status === 'completed' ? 'bg-emerald-500' :
                                  task.status === 'overdue' ? 'bg-red-500 animate-pulse' :
                                  'bg-blue-400'
                                }`} />
                                <motion.span
                                  animate={{ 
                                    color: task.status === 'completed' ? '#94a3b8' : '#1e293b',
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {task.title}
                                </motion.span>
                                {task.status === 'completed' && (
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    className="absolute left-0 top-1/2 h-[1px] bg-slate-400"
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  />
                                )}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  {t('hub.dueDate')}: {task.dueDate}
                                </div>
                                
                                {/* Priority Tag */}
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  task.priority === 'high' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                                  task.priority === 'medium' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}>
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  {task.priority === 'high' ? (i18n.language === 'vi' ? 'Cao' : 'High') :
                                   task.priority === 'medium' ? (i18n.language === 'vi' ? 'Vừa' : 'Medium') :
                                   (i18n.language === 'vi' ? 'Thấp' : 'Low')}
                                </span>

                                {task.status === 'overdue' && (
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500 text-[9px] font-black text-white uppercase tracking-widest shadow-sm shadow-red-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    {t('hub.overdue')}
                                  </span>
                                )}
                                {task.status === 'upcoming' && (
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500 text-[9px] font-black text-white uppercase tracking-widest shadow-sm shadow-blue-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                    {t('hub.upcoming')}
                                  </span>
                                )}
                                {task.status === 'completed' && (
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-[9px] font-black text-white uppercase tracking-widest shadow-sm shadow-emerald-200">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    {t('hub.completed')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          {editingTaskId === task.id ? (
                            <>
                              <button 
                                onClick={handleSaveEdit}
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                title={t('hub.save')}
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setEditingTaskId(null)}
                                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                title={t('hub.cancel')}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              {user && (
                                <>
                                  <button 
                                    onClick={() => startEditing(task)}
                                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                    title={t('hub.edit')}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                                    title={t('hub.delete')}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  </div>
                </section>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-hdb-earth/30">
                <h4 className="font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-hdb-green" />
                  {t('hub.discussion')} ({comments.length})
                </h4>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {comments.map((comment, i) => (
                    <div key={comment.id || i} className="flex gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-hdb-earth shrink-0 overflow-hidden flex items-center justify-center">
                        {comment.photoURL ? (
                          <img src={comment.photoURL} alt={comment.user} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-4 h-4 text-hdb-green" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{comment.user}</span>
                            <span className="text-[10px] text-hdb-dark/40">{comment.time}</span>
                          </div>
                          {user && comment.userId === user.uid && editingCommentId !== comment.id && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEditComment(comment)}
                                className="text-[10px] text-hdb-green hover:text-hdb-accent font-bold flex items-center gap-1"
                              >
                                <Pencil className="w-2.5 h-2.5" />
                                {i18n.language === 'vi' ? 'Sửa' : 'Edit'}
                              </button>
                              <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                                {i18n.language === 'vi' ? 'Xóa' : 'Delete'}
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {editingCommentId === comment.id ? (
                          <form onSubmit={handleSaveEditComment} className="relative mt-2">
                            <input 
                              type="text" 
                              autoFocus
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-hdb-green rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hdb-green pr-16"
                            />
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                              <button 
                                type="submit"
                                className="p-1.5 text-hdb-green hover:bg-hdb-green/10 rounded-lg transition-colors"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => setEditingCommentId(null)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-xs text-hdb-dark/70 leading-relaxed bg-hdb-earth/10 p-3 rounded-2xl rounded-tl-none">{comment.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-hdb-earth/30">
                  {user ? (
                    <form onSubmit={handleCommentSubmit} className="relative">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={t('hub.writeComment')} 
                        className="w-full px-4 py-3 bg-hdb-earth/20 border border-hdb-earth rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hdb-green pr-10" 
                      />
                      <button 
                        type="submit"
                        disabled={!newComment.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-hdb-green hover:text-hdb-accent transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 bg-hdb-earth/5 rounded-xl border border-dashed border-hdb-earth/40">
                      <p className="text-[10px] text-hdb-dark/50 mb-3">{t('hub.loginToComment')}</p>
                      <button 
                        onClick={handleLogin}
                        className="inline-flex items-center gap-2 bg-white border border-hdb-earth px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-hdb-earth/20 transition-all shadow-sm"
                      >
                        <LogIn className="w-3 h-3 text-hdb-green" />
                        {t('nav.login')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-hdb-dark rounded-3xl p-8 text-white shadow-xl">
                <h4 className="font-bold mb-4">{t('hub.shareRights')}</h4>
                <p className="text-xs text-white/50 mb-6 leading-relaxed">
                  {t('hub.shareDescription')}
                </p>
                <div className="space-y-3">
                  <button className="w-full py-3 bg-hdb-green rounded-xl text-xs font-bold hover:bg-hdb-accent transition-all">
                    {t('hub.inviteEmail')}
                  </button>
                  <button className="w-full py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-all">
                    {t('hub.copyLink')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Global Reach */}
      <section className="py-24 bg-hdb-dark text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
            alt="Global Network" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hdb-accent/20 text-hdb-accent text-[10px] font-bold uppercase tracking-wider mb-6">
                <Globe className="w-3 h-3" />
                {t('global.tag')}
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
                {i18n.language === 'vi' ? (
                  <>Kết nối <span className="text-hdb-accent italic">Năng lượng Xanh</span> Toàn cầu</>
                ) : (
                  <>Connecting Global <span className="text-hdb-accent italic">Green Energy</span></>
                )}
              </h2>
              <p className="text-white/60 text-lg mb-12 leading-relaxed">
                {t('global.description')}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-display font-bold text-hdb-accent mb-2">15+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">{t('global.countries')}</p>
                </div>
                <div>
                  <p className="text-4xl font-display font-bold text-hdb-accent mb-2">500k</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">{t('global.capacity')}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem]">
              <h4 className="text-2xl font-bold mb-6">{t('global.inquiryTitle')}</h4>
              <p className="text-white/60 text-sm mb-8">{t('global.inquiryDescription')}</p>
              <button 
                onClick={() => openModal('International Inquiry')}
                className="w-full py-4 bg-hdb-accent text-white rounded-xl font-bold hover:bg-white hover:text-hdb-dark transition-all"
              >
                {t('global.contactSales')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t('library.title')}</h2>
            <p className="text-hdb-dark/60 max-w-2xl mx-auto">
              {t('library.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: i18n.language === 'vi' ? 'Hướng dẫn Kỹ thuật CarbonLoop™' : 'CarbonLoop™ Technical Guide', size: '4.2 MB', type: 'PDF' },
              { title: 'Biomass Fuel Comparison 2024', size: '2.8 MB', type: 'XLSX' },
              { title: 'Boiler Efficiency Case Study', size: '3.5 MB', type: 'PDF' }
            ].map((doc, i) => (
              <div key={i} className="group p-8 bg-hdb-earth/10 rounded-3xl border border-hdb-earth/30 hover:border-hdb-green transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-hdb-green" />
                </div>
                <h4 className="font-bold text-lg mb-2">{doc.title}</h4>
                <div className="flex items-center gap-4 text-xs text-hdb-dark/40 mb-6">
                  <span>{doc.type}</span>
                  <span>{doc.size}</span>
                </div>
                <button 
                  onClick={() => openModal('Download', false, true, doc.title)}
                  className="w-full py-3 bg-white border border-hdb-earth rounded-xl text-sm font-bold hover:bg-hdb-green hover:text-white hover:border-hdb-green transition-all"
                >
                  Tải xuống ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-hdb-green uppercase tracking-[0.2em] mb-4">FAQ</h2>
            <h3 className="text-4xl font-display font-bold">{i18n.language === 'vi' ? 'Câu hỏi thường gặp' : 'Common Questions'}</h3>
          </div>
          <div className="space-y-6">
            {[
              {
                q: i18n.language === 'vi' ? 'Chuyển sang Biomass có cần thay đổi lò hơi không?' : 'Do I need to change my boiler to switch to Biomass?',
                a: i18n.language === 'vi' ? 'Tùy thuộc vào loại lò hiện tại. Đa số lò hơi tầng sôi có thể chuyển đổi dễ dàng với chi phí thấp. HDB sẽ khảo sát và tư vấn giải pháp tối ưu nhất cho bạn.' : 'It depends on your current boiler type. Most fluidized bed boilers can be converted easily at low cost. HDB will survey and advise the most optimal solution for you.'
              },
              {
                q: i18n.language === 'vi' ? 'Nguồn cung nhiên liệu có ổn định không?' : 'Is the fuel supply stable?',
                a: i18n.language === 'vi' ? 'HDB sở hữu hệ thống kho bãi và mạng lưới thu mua rộng khắp, đảm bảo cung ứng liên tục 24/7 ngay cả trong mùa cao điểm.' : 'HDB owns a warehouse system and an extensive purchasing network, ensuring continuous 24/7 supply even during peak seasons.'
              },
              {
                q: i18n.language === 'vi' ? 'Biomass có gây hại cho môi trường không?' : 'Is Biomass harmful to the environment?',
                a: i18n.language === 'vi' ? 'Ngược lại, Biomass là năng lượng tái tạo trung hòa carbon. Sử dụng Biomass giúp doanh nghiệp giảm đến 90% phát thải khí nhà kính so với than đá.' : 'On the contrary, Biomass is carbon-neutral renewable energy. Using Biomass helps businesses reduce up to 90% of greenhouse gas emissions compared to coal.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-hdb-earth/10 rounded-2xl border border-hdb-earth/30">
                <h4 className="font-bold text-lg mb-3 flex items-start gap-3">
                  <span className="text-hdb-green">Q:</span> {faq.q}
                </h4>
                <p className="text-hdb-dark/60 text-sm leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Lead Button */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3"
          >
            <button 
              onClick={() => openModal('Quick Quote')}
              className="bg-hdb-green text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:bg-hdb-accent transition-all flex items-center gap-2 group"
            >
              <span className="hidden md:inline">{i18n.language === 'vi' ? 'Nhận báo giá ngay' : 'Get Quick Quote'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-hdb-dark text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-hdb-green rounded-lg flex items-center justify-center">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-bold tracking-tighter">
                  HDB <span className="text-hdb-accent">Biomass</span>
                </span>
              </div>
              <p className="text-white/50 max-w-sm mb-8 leading-relaxed">
                {t('footer.description')}
              </p>
              <div className="flex gap-4">
                {['Facebook', 'LinkedIn', 'Alibaba', 'TikTok'].map(social => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-hdb-accent hover:border-hdb-accent transition-all">
                    <span className="sr-only">{social}</span>
                    <Globe className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-hdb-accent">{t('footer.solutions')}</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{i18n.language === 'vi' ? 'Tư vấn CarbonLoop™' : 'CarbonLoop™ Consulting'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{i18n.language === 'vi' ? 'Cung ứng EcoLoop™' : 'EcoLoop™ Supply'}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('projects.tags.energyAudit')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{i18n.language === 'vi' ? 'Tối ưu hóa lò hơi' : 'Boiler Optimization'}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-hdb-accent">{t('footer.support')}</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><button onClick={() => setCurrentView('crm')} className="hover:text-white transition-colors">{t('nav.crmDashboard')}</button></li>
                <li><button onClick={() => openModal('Contact Support')} className="hover:text-white transition-colors">{t('footer.contactSupport')}</button></li>
                <li><button onClick={() => openModal('Request Quote')} className="hover:text-white transition-colors">{t('footer.quote')}</button></li>
                <li><button onClick={() => openModal('Download Datasheet', false, true)} className="hover:text-white transition-colors">{t('footer.datasheet')}</button></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 font-bold uppercase tracking-widest">
            <p>{t('footer.rights')}</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">MST: 3604011176</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-hdb-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="flex">
                <div className="hidden md:block w-1/3 bg-hdb-green p-10 text-white">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-8">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-4">CarbonLoop™</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {i18n.language === 'vi' ? 'Bắt đầu hành trình Net Zero của bạn cùng đội ngũ chuyên gia hàng đầu từ HDB.' : 'Start your Net Zero journey with the leading expert team from HDB.'}
                  </p>
                </div>
                <div className="flex-1 p-10 relative">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-hdb-earth/30 rounded-full transition-all"
                  >
                    <X className="w-5 h-5 text-hdb-dark/40" />
                  </button>
                  
                  <h3 className="text-2xl font-display font-bold mb-2">
                    {isQuotationMode ? t('footer.quote') : isDownloadMode ? t('footer.datasheet') : t('form.title')}
                  </h3>
                  <p className="text-hdb-dark/50 text-sm mb-8">
                    {isQuotationMode 
                      ? (i18n.language === 'vi' ? 'Vui lòng cung cấp thông số kỹ thuật để chúng tôi tính toán phương án tối ưu nhất.' : 'Please provide technical specifications so we can calculate the most optimal solution.')
                      : isDownloadMode
                      ? (i18n.language === 'vi' ? `Vui lòng để lại thông tin để nhận link tải tài liệu: ${selectedDatasheet}` : `Please leave your information to receive the document download link: ${selectedDatasheet}`)
                      : (i18n.language === 'vi' ? 'Vui lòng để lại thông tin, chúng tôi sẽ liên hệ lại trong vòng 24h.' : 'Please leave your information, we will contact you within 24 hours.')}
                  </p>
                  
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.fullName')}</label>
                        <input 
                          required 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                          placeholder={t('formFields.placeholderName')} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.phone')}</label>
                        <input 
                          required 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          pattern="^\+?[0-9]+$"
                          title={t('formFields.phoneTitle')}
                          className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                          placeholder="090..." 
                        />
                      </div>
                    </div>

                    {isQuotationMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.company')}</label>
                          <input 
                            required 
                            type="text" 
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                            placeholder={t('formFields.placeholderCompany')} 
                          />
                        </div>
                        <div>
                        <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{i18n.language === 'vi' ? 'Quốc gia' : 'Country'}</label>
                        <input 
                          required 
                          type="text" 
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                          placeholder={i18n.language === 'vi' ? 'Việt Nam' : 'Vietnam'} 
                        />
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.email')}</label>
                      <input 
                        required 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title={t('formFields.emailTitle')}
                        className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                        placeholder="name@company.com" 
                      />
                    </div>

                    {isQuotationMode && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.boilerCapacity')}</label>
                          <input 
                            required 
                            type="number" 
                            name="boilerCapacity"
                            value={formData.boilerCapacity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                            placeholder="10" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.fuelConsumption')}</label>
                          <input 
                            required 
                            type="number" 
                            name="fuelConsumption"
                            value={formData.fuelConsumption}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm" 
                            placeholder="500" 
                          />
                        </div>
                      </div>
                    )}

                    {!isQuotationMode && !isDownloadMode && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-hdb-dark/40 mb-1.5">{t('form.service')}</label>
                        <select 
                          value={modalService}
                          onChange={(e) => {
                            setModalService(e.target.value);
                            if (e.target.value !== 'Other') setCustomService('');
                          }}
                          className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm mb-3"
                        >
                        <option value="Net Zero Roadmap">{i18n.language === 'vi' ? 'Lộ trình Net Zero (CarbonLoop™)' : 'Net Zero Roadmap (CarbonLoop™)'}</option>
                        <option value="Energy Audit">{i18n.language === 'vi' ? 'Kiểm toán năng lượng' : 'Energy Audit'}</option>
                        <option value="Fuel Conversion">{i18n.language === 'vi' ? 'Chuyển đổi nhiên liệu' : 'Fuel Conversion'}</option>
                        <option value="Biomass Supply">{i18n.language === 'vi' ? 'Cung ứng sinh khối (EcoLoop™)' : 'Biomass Supply (EcoLoop™)'}</option>
                        <option value="Báo giá nhanh">{i18n.language === 'vi' ? 'Yêu cầu báo giá nhanh' : 'Quick Quote Request'}</option>
                        <option value="Other">{t('form.other')}</option>
                      </select>
                      
                      <AnimatePresence>
                        {modalService === 'Other' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <input 
                              required
                              type="text"
                              value={customService}
                              onChange={(e) => setCustomService(e.target.value)}
                              placeholder={i18n.language === 'vi' ? 'Nhập nhu cầu cụ thể của bạn...' : 'Enter your specific needs...'}
                              className="w-full px-4 py-2.5 bg-hdb-earth/20 border border-hdb-earth rounded-xl focus:outline-none focus:ring-2 focus:ring-hdb-green text-sm"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    )}
                    <button 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-hdb-green text-white rounded-xl font-bold hover:bg-hdb-accent transition-all shadow-lg shadow-hdb-green/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        isQuotationMode 
                          ? (i18n.language === 'vi' ? 'Nhận báo giá ngay' : 'Get Quote Now') 
                          : isDownloadMode 
                          ? (i18n.language === 'vi' ? 'Tải tài liệu ngay' : 'Download Now') 
                          : (i18n.language === 'vi' ? 'Gửi yêu cầu ngay' : 'Submit Request Now')
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Project Detail Modal */}
      <AnimatePresence>
        {isProjectModalOpen && selectedProject && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute inset-0 bg-hdb-dark/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 100 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
            >
              <div className="w-full md:w-1/3 bg-hdb-dark p-8 text-white flex flex-col">
                <div className="mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                    selectedProject.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    selectedProject.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    <GanttChartSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{selectedProject.name}</h3>
                  <p className="text-white/40 text-sm">{selectedProject.client}</p>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/30 mb-2 tracking-widest">Status</label>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedProject.status === 'Completed' ? 'bg-emerald-500 text-white' :
                        selectedProject.status === 'In Progress' ? 'bg-blue-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {selectedProject.status}
                      </span>
                      <span className="text-xl font-bold">{selectedProject.progress}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/30 mb-2 tracking-widest">Project Manager</label>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-hdb-green/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-hdb-green" />
                      </div>
                      <span className="text-sm font-medium">{selectedProject.manager}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-white/30 mb-2 tracking-widest">Timeline</label>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                      <Calendar className="w-4 h-4" />
                      Started: {selectedProject.startDate}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Project Docs
                  </button>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[#F8F9FA]">
                <button 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="absolute top-8 right-8 p-2 hover:bg-hdb-earth/30 rounded-full transition-all z-10"
                >
                  <X className="w-6 h-6 text-hdb-dark/40" />
                </button>

                <div className="max-w-xl">
                  <section className="mb-10">
                    <h4 className="text-[10px] font-bold uppercase text-hdb-dark/40 mb-4 tracking-widest flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Description
                    </h4>
                    <p className="text-hdb-dark/70 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </section>

                  <section className="mb-10">
                    <h4 className="text-[10px] font-bold uppercase text-hdb-dark/40 mb-4 tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Milestones
                    </h4>
                    <div className="space-y-4">
                      {[
                        { title: 'Initial Assessment', date: 'Jan 20, 2024', completed: true },
                        { title: 'Technical Design', date: 'Feb 15, 2024', completed: true },
                        { title: 'Equipment Procurement', date: 'Mar 10, 2024', completed: selectedProject.progress > 50 },
                        { title: 'Installation & Testing', date: 'Apr 05, 2024', completed: selectedProject.progress > 80 },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-hdb-earth/30">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                            m.completed ? 'bg-hdb-green border-hdb-green text-white' : 'border-hdb-earth/50'
                          }`}>
                            {m.completed && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-bold ${m.completed ? 'text-hdb-dark' : 'text-hdb-dark/40'}`}>{m.title}</p>
                            <p className="text-[10px] text-hdb-dark/30">{m.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold uppercase text-hdb-dark/40 mb-4 tracking-widest flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      Project Updates
                    </h4>
                    <div className="space-y-4">
                      {selectedProject.comments.map((c: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-hdb-earth flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-hdb-green" />
                          </div>
                          <div className="flex-1 bg-white p-4 rounded-2xl border border-hdb-earth/30 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold">{c.user}</span>
                              <span className="text-[9px] text-hdb-dark/30">{c.time}</span>
                            </div>
                            <p className="text-xs text-hdb-dark/70">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
