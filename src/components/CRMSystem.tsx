import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { sendEmail } from '../services/emailService';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2, 
  ChevronRight,
  LayoutGrid,
  List,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Briefcase,
  Leaf,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  Plus,
  RefreshCw,
  Tag,
  History,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  value: number;
  source: string;
  lastContact: string;
  tags: string[];
  history: {
    date: string;
    type: 'Call' | 'Email' | 'Meeting' | 'Note';
    note: string;
  }[];
}

const PRIORITY_COLORS = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-gray-100 text-gray-700 border-gray-200',
};

const MOCK_LEADS: Lead[] = [
  { 
    id: '1', 
    name: 'Nguyễn Văn A', 
    company: 'Nhà máy Giấy Bình Dương', 
    email: 'a.nguyen@papermill.vn', 
    phone: '0901234567', 
    status: 'Negotiation', 
    priority: 'High',
    value: 15000, 
    source: 'Website Form', 
    lastContact: '2 giờ trước',
    tags: ['VIP', 'Biomass'],
    history: [
      { date: '2024-03-10', type: 'Call', note: 'Đã gọi điện tư vấn về Wood Pellets' },
      { date: '2024-03-08', type: 'Email', note: 'Gửi báo giá CarbonLoop sơ bộ' }
    ]
  },
  { 
    id: '2', 
    name: 'Trần Thị B', 
    company: 'Thực phẩm ABC', 
    email: 'b.tran@abcfood.com', 
    phone: '0912345678', 
    status: 'New', 
    priority: 'Medium',
    value: 8000, 
    source: 'Google Search', 
    lastContact: '5 giờ trước',
    tags: ['Urgent'],
    history: [
      { date: '2024-03-11', type: 'Note', note: 'Khách hàng mới từ Google Search' }
    ]
  },
  { 
    id: '3', 
    name: 'Lê Văn C', 
    company: 'Dệt nhuộm Thành Công', 
    email: 'c.le@thanhcong.vn', 
    phone: '0987654321', 
    status: 'Qualified', 
    priority: 'Low',
    value: 25000, 
    source: 'Referral', 
    lastContact: '1 ngày trước',
    tags: ['Consulting', 'High Potential'],
    history: [
      { date: '2024-03-09', type: 'Meeting', note: 'Họp trực tiếp khảo sát lò hơi' }
    ]
  },
  { 
    id: '4', 
    name: 'Phạm Minh D', 
    company: 'Gỗ Đức Thành', 
    email: 'd.pham@ducthanhwood.com', 
    phone: '0933445566', 
    status: 'Proposal', 
    priority: 'High',
    value: 12000, 
    source: 'LinkedIn', 
    lastContact: '3 ngày trước',
    tags: ['Wood Pellets'],
    history: [
      { date: '2024-03-07', type: 'Email', note: 'Gửi tài liệu giới thiệu EcoLoop' }
    ]
  },
  { 
    id: '5', 
    name: 'Hoàng An', 
    company: 'Thủy sản Minh Phú', 
    email: 'an.hoang@minhphu.com', 
    phone: '0944556677', 
    status: 'Closed', 
    priority: 'Medium',
    value: 45000, 
    source: 'Exhibition', 
    lastContact: '1 tuần trước',
    tags: ['Closed Won', 'Key Account'],
    history: [
      { date: '2024-03-01', type: 'Note', note: 'Ký kết hợp đồng cung ứng 5 năm' }
    ]
  },
];

const SAVINGS_DATA = [
  { month: 'Jan', savings: 4500 },
  { month: 'Feb', savings: 5200 },
  { month: 'Mar', savings: 4800 },
  { month: 'Apr', savings: 6100 },
  { month: 'May', savings: 5900 },
  { month: 'Jun', savings: 7200 },
];

const PRODUCT_DATA = [
  { name: 'Wood Pellets', value: 45 },
  { name: 'Rice Husk', value: 30 },
  { name: 'Cashew Shell', value: 15 },
  { name: 'Others', value: 10 },
];

const STATUS_COLORS = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'Contacted': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Qualified': 'bg-purple-100 text-purple-700 border-purple-200',
  'Proposal': 'bg-orange-100 text-orange-700 border-orange-200',
  'Negotiation': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Closed': 'bg-green-100 text-green-700 border-green-200',
};

const STATUS_LABELS = {
  'New': 'Mới',
  'Contacted': 'Đã liên hệ',
  'Qualified': 'Tiềm năng',
  'Proposal': 'Báo giá',
  'Negotiation': 'Thương thảo',
  'Closed': 'Đã chốt',
};

export default function CRMSystem({ onBack, dashboardData, onRefresh, lastUpdate, setToast }: { onBack: () => void, dashboardData?: any, onRefresh?: () => Promise<void>, lastUpdate?: Date, setToast: (toast: any) => void }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [newTag, setNewTag] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [diagStatus, setDiagStatus] = useState<any>(null);

  useEffect(() => {
    const fetchDiag = async () => {
      try {
        const res = await fetch('/api/diag');
        const data = await res.json();
        setDiagStatus(data);
      } catch (err) {
        console.error("Failed to fetch diagnostics:", err);
      }
    };
    fetchDiag();
  }, []);
  const [newActivityType, setNewActivityType] = useState<'Call' | 'Email' | 'Meeting' | 'Note'>('Note');
  const [newActivityNote, setNewActivityNote] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const handleOpenEmailModal = () => {
    if (!selectedLead) return;
    setEmailSubject(`Chào mừng ${selectedLead.name} đến với Hoàng Dung Biomass`);
    setEmailContent(`Xin chào ${selectedLead.name},\n\nCảm ơn bạn đã quan tâm đến các giải pháp năng lượng tái tạo của Hoàng Dung Biomass.\n\nChúng tôi đã nhận được yêu cầu từ ${selectedLead.company} và sẽ sớm liên hệ lại với bạn để tư vấn chi tiết.\n\nTrân trọng,\nĐội ngũ Hoàng Dung Biomass`);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedLead) return;
    
    setIsSendingEmail(true);
    try {
      const result = await sendEmail({
        to: selectedLead.email,
        subject: emailSubject,
        htmlContent: emailContent.replace(/\n/g, '<br>')
      });

      if (result.success) {
        // Add to history
        setLeads(prev => prev.map(l => {
          if (l.id === selectedLead.id) {
            return {
              ...l,
              history: [
                { date: new Date().toISOString().split('T')[0], type: 'Email', note: `Đã gửi email: ${emailSubject}` },
                ...l.history
              ]
            };
          }
          return l;
        }));
        setToast({
          message: "Email đã được gửi thành công!",
          type: 'success',
          isVisible: true
        });
        setIsEmailModalOpen(false);
      } else {
        setToast({
          message: "Lỗi khi gửi email: " + result.error,
          type: 'error',
          isVisible: true
        });
      }
    } catch (error) {
      console.error("Error in handleSendEmail:", error);
      setToast({
        message: "Đã có lỗi xảy ra khi gửi email.",
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleAddActivity = () => {
    if (!selectedLead || !newActivityNote.trim()) return;
    
    const newActivity = {
      date: new Date().toISOString().split('T')[0],
      type: newActivityType,
      note: newActivityNote.trim()
    };

    setLeads(prev => prev.map(l => {
      if (l.id === selectedLead.id) {
        return {
          ...l,
          history: [newActivity, ...l.history]
        };
      }
      return l;
    }));

    setNewActivityNote('');
    setNewActivityType('Note');
    setIsAddingActivity(false);
  };

  const handleAddTag = (leadId: string, tag: string) => {
    if (!tag.trim()) return;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        if (l.tags.includes(tag.trim())) return l;
        return { ...l, tags: [...l.tags, tag.trim()] };
      }
      return l;
    }));
    setNewTag('');
  };

  const handleRemoveTag = (leadId: string, tagToRemove: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, tags: l.tags.filter(t => t !== tagToRemove) };
      }
      return l;
    }));
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      if (sortBy === 'Value') return b.value - a.value;
      if (sortBy === 'Status') return a.status.localeCompare(b.status);
      if (sortBy === 'Source') return a.source.localeCompare(b.source);
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      // Default to Newest (mocked by ID for this example)
      return parseInt(b.id) - parseInt(a.id);
    });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { destination, draggableId } = result;
    const newStatus = destination.droppableId as Lead['status'];
    
    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === draggableId ? { ...lead, status: newStatus } : lead
    ));
  };

  const displaySavingsData = dashboardData?.monthlySavings || SAVINGS_DATA;
  const displayStats = dashboardData ? [
    { label: 'Total Leads', value: dashboardData.totalLeads.toString(), trend: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Conversion Rate', value: dashboardData.conversionRate, trend: '+5.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Projects', value: dashboardData.activeProjects.toString(), trend: '+3', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Carbon Offset', value: dashboardData.carbonOffset, trend: '+15%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ] : [
    { label: 'Total Leads', value: '156', trend: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Conversion Rate', value: '24.5%', trend: '+5.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Projects', value: '38', trend: '+3', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Carbon Offset', value: '1,240T', trend: '+15%', icon: Leaf, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#1A1A1A]">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors text-[#6B7280]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-[#E5E7EB]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg tracking-tight">HDB CRM <span className="text-[#6B7280] font-normal">/ {activeTab === 'dashboard' ? 'Dashboard' : 'Leads'}</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#F3F4F6] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#22C55E] w-64 transition-all"
            />
          </div>
          <button className="bg-[#22C55E] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#16A34A] transition-all shadow-lg shadow-green-500/20">
            <UserPlus className="w-4 h-4" />
            Thêm Lead
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#E5E7EB] hidden lg:flex flex-col p-4 gap-2">
          {[
            { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard' },
            { id: 'leads', icon: Users, label: 'Leads' },
            { id: 'clients', icon: Building2, label: 'Khách hàng' },
            { id: 'reports', icon: TrendingUp, label: 'Báo cáo Sales' },
            { id: 'contracts', icon: DollarSign, label: 'Hợp đồng' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => (item.id === 'dashboard' || item.id === 'leads') && setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-[#22C55E]/10 text-[#22C55E]' 
                  : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          
          <div className="mt-auto pt-4 border-t border-[#E5E7EB]">
            <div className="bg-[#F3F4F6] p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Hạn mức Lead tháng này</p>
              <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[#22C55E] w-[65%]" />
              </div>
              <p className="text-xs font-bold text-[#1A1A1A]">65 / 100 Leads</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Dashboard Overview</h2>
                    {lastUpdate && (
                      <p className="text-xs text-[#6B7280] mt-1">
                        Cập nhật lần cuối: {lastUpdate.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={async () => {
                      if (onRefresh) {
                        setIsRefreshing(true);
                        await onRefresh();
                        setIsRefreshing(false);
                      }
                    }}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#6B7280] hover:bg-[#F3F4F6] transition-all disabled:opacity-50 shadow-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Đang làm mới...' : 'Làm mới dữ liệu'}
                  </button>
                </div>

                {/* System Status Banner */}
                {diagStatus && (
                  <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Trạng thái hệ thống:</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {[
                        { label: 'Firebase', status: diagStatus.firebase },
                        { label: 'Google Sheets', status: diagStatus.googleSheets },
                        { label: 'Brevo Email', status: diagStatus.brevo },
                        { label: 'Analytics', status: diagStatus.analytics }
                      ].map((api, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${api.status ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className={`text-[10px] font-bold ${api.status ? 'text-[#1A1A1A]' : 'text-red-500'}`}>
                            {api.label}: {api.status ? 'Đã kết nối' : 'Chưa cấu hình'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                      <div className="flex items-center gap-2 text-[10px] text-[#6B7280]">
                        <span className="font-bold uppercase">Môi trường:</span>
                        <span className="bg-[#F3F4F6] px-2 py-0.5 rounded-full font-mono">{diagStatus.nodeEnv}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                        <AlertCircle className="w-3 h-3" />
                        <span className="font-bold">Lưu ý:</span>
                        <span>Thêm <code className="bg-white px-1 rounded border border-blue-200">{window.location.hostname}</code> vào Authorized Domains trong Firebase Console.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {displayStats.map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                      </div>
                      <p className="text-xs font-medium text-[#6B7280] mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-bold text-[#1A1A1A]">Monthly Savings Trend</h3>
                        <p className="text-xs text-[#6B7280]">Ước tính tiết kiệm chi phí nhiên liệu (USD)</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        +18% vs Last Month
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={displaySavingsData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Line type="monotone" dataKey="savings" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-bold text-[#1A1A1A]">Top Products Interest</h3>
                        <p className="text-xs text-[#6B7280]">Phân bổ nhu cầu theo dòng sản phẩm (%)</p>
                      </div>
                      <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-[#9CA3AF]" />
                      </button>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PRODUCT_DATA} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1A1A1A', fontWeight: 600 }} width={100} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#F9FAFB' }}
                          />
                          <Bar dataKey="value" fill="#22C55E" radius={[0, 8, 8, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h3 className="font-bold">Hoạt động gần đây</h3>
                    <button className="text-xs font-bold text-[#22C55E] hover:underline">Xem tất cả</button>
                  </div>
                  <div className="divide-y divide-[#E5E7EB]">
                    {MOCK_LEADS.slice(0, 3).map((lead, i) => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center font-bold text-[#6B7280]">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1A1A1A]">{lead.name} <span className="font-normal text-[#6B7280]">từ</span> {lead.company}</p>
                            <p className="text-xs text-[#9CA3AF]">Đã cập nhật trạng thái sang <span className="font-bold text-[#22C55E]">{lead.status}</span></p>
                          </div>
                        </div>
                        <p className="text-xs text-[#9CA3AF]">{lead.lastContact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Leads Table View */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex bg-white border border-[#E5E7EB] p-1 rounded-xl w-fit">
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                        viewMode === 'list' ? 'bg-[#F3F4F6] text-[#1A1A1A]' : 'text-[#6B7280] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      Danh sách
                    </button>
                    <button 
                      onClick={() => setViewMode('kanban')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                        viewMode === 'kanban' ? 'bg-[#F3F4F6] text-[#1A1A1A]' : 'text-[#6B7280] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Kanban
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-[#9CA3AF]" />
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#22C55E] outline-none"
                      >
                        <option value="All">Tất cả trạng thái</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <select 
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#22C55E] outline-none"
                    >
                      <option value="All">Tất cả nguồn</option>
                      <option value="Website Form">Website Form</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Referral">Referral</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Exhibition">Exhibition</option>
                    </select>

                    <div className="h-6 w-[1px] bg-[#E5E7EB] hidden md:block" />

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280]">Sắp xếp:</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#22C55E] outline-none"
                      >
                        <option value="Newest">Mới nhất</option>
                        <option value="Value">Giá trị</option>
                        <option value="Status">Trạng thái</option>
                        <option value="Source">Nguồn</option>
                        <option value="Name">Tên A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>

                {viewMode === 'list' ? (
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Khách hàng</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Công ty</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Trạng thái</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Độ ưu tiên</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Giá trị dự kiến</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Liên hệ cuối</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">Tags</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7EB]">
                        {filteredLeads.map((lead) => (
                          <tr 
                            key={lead.id} 
                            className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                            onClick={() => setSelectedLeadId(lead.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center font-bold text-[#6B7280] text-sm">
                                  {lead.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-[#1A1A1A]">{lead.name}</p>
                                  <p className="text-xs text-[#6B7280]">{lead.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-[#1A1A1A]">{lead.company}</p>
                              <p className="text-[10px] text-[#9CA3AF]">{lead.source}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLORS[lead.status]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  lead.status === 'New' ? 'bg-blue-500' :
                                  lead.status === 'Contacted' ? 'bg-yellow-500' :
                                  lead.status === 'Qualified' ? 'bg-purple-500' :
                                  lead.status === 'Proposal' ? 'bg-orange-500' :
                                  lead.status === 'Negotiation' ? 'bg-indigo-500' :
                                  'bg-green-500'
                                }`} />
                                {STATUS_LABELS[lead.status as keyof typeof STATUS_LABELS]}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${PRIORITY_COLORS[lead.priority]}`}>
                                {lead.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-[#1A1A1A]">${lead.value.toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs text-[#6B7280]">{lead.lastContact}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {lead.tags.map((tag, i) => (
                                  <span key={i} className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[9px] font-bold rounded flex items-center gap-1">
                                    <Tag className="w-2 h-2" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors text-[#9CA3AF] group-hover:text-[#1A1A1A]">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 overflow-x-auto pb-6 min-h-[600px]">
                      {(['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed'] as const).map((status) => (
                        <Droppable key={status} droppableId={status}>
                          {(provided, snapshot) => (
                            <div 
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className={`flex-shrink-0 w-80 rounded-2xl transition-colors ${snapshot.isDraggingOver ? 'bg-[#22C55E]/5' : ''}`}
                            >
                              <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-[#1A1A1A]">{STATUS_LABELS[status as keyof typeof STATUS_LABELS]}</h4>
                                  <span className="bg-[#E5E7EB] text-[#6B7280] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {filteredLeads.filter(l => l.status === status).length}
                                  </span>
                                </div>
                                <button className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
                                  <Plus className="w-4 h-4 text-[#9CA3AF]" />
                                </button>
                              </div>
                              <div className="space-y-4 min-h-[100px]">
                                {filteredLeads.filter(l => l.status === status).map((lead, index) => (
                                  // @ts-ignore
                                  <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                    {(provided: any, snapshot: any) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => setSelectedLeadId(lead.id)}
                                        style={{
                                          ...provided.draggableProps.style,
                                          opacity: snapshot.isDragging ? 0.8 : 1
                                        }}
                                        className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                      >
                                        <div className="flex items-start justify-between mb-3">
                                          <div>
                                            <div className="flex items-center gap-2 mb-1">
                                              <p className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#22C55E] transition-colors">{lead.name}</p>
                                              <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${PRIORITY_COLORS[lead.priority]}`}>
                                                {lead.priority}
                                              </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {lead.tags.map((tag, i) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[8px] font-bold rounded flex items-center gap-1">
                                                  <Tag className="w-2 h-2" />
                                                  {tag}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                          <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-3 h-3 text-[#9CA3AF]" />
                                          </button>
                                        </div>
                                        <p className="text-xs text-[#6B7280] mb-4">{lead.company}</p>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1 text-[#22C55E]">
                                            <DollarSign className="w-3 h-3" />
                                            <span className="text-xs font-bold">{lead.value.toLocaleString()}</span>
                                          </div>
                                          <div className="flex items-center gap-1 text-[#9CA3AF]">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px]">{lead.lastContact}</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            </div>
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </DragDropContext>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Lead Detail Slide-over */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeadId(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center text-[#22C55E] font-bold text-xl">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-[#1A1A1A]">{selectedLead.name}</h2>
                    <p className="text-xs text-[#6B7280]">{selectedLead.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLeadId(null)}
                  className="p-2 hover:bg-[#F3F4F6] rounded-xl transition-colors text-[#6B7280]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <div className="p-4 text-center">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Giá trị</p>
                    <p className="text-sm font-bold text-[#1A1A1A]">${selectedLead.value.toLocaleString()}</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Trạng thái</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[selectedLead.status]}`}>
                      <span className={`w-1 h-1 rounded-full ${
                        selectedLead.status === 'New' ? 'bg-blue-500' :
                        selectedLead.status === 'Contacted' ? 'bg-yellow-500' :
                        selectedLead.status === 'Qualified' ? 'bg-purple-500' :
                        selectedLead.status === 'Proposal' ? 'bg-orange-500' :
                        selectedLead.status === 'Negotiation' ? 'bg-indigo-500' :
                        'bg-green-500'
                      }`} />
                      {STATUS_LABELS[selectedLead.status as keyof typeof STATUS_LABELS]}
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[10px] font-bold text-[#9CA3AF] uppercase mb-1">Ưu tiên</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${PRIORITY_COLORS[selectedLead.priority]}`}>
                      {selectedLead.priority}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Contact Information */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                        <UserPlus className="w-3 h-3" /> Thông tin liên hệ
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:border-[#22C55E]/30 transition-all group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#9CA3AF] font-bold uppercase mb-0.5">Email</p>
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">{selectedLead.email}</p>
                        </div>
                        <button 
                          onClick={handleOpenEmailModal}
                          className="p-2 bg-[#22C55E]/10 text-[#22C55E] rounded-lg hover:bg-[#22C55E]/20 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:border-[#22C55E]/30 transition-all group">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#9CA3AF] font-bold uppercase mb-0.5">Số điện thoại</p>
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">{selectedLead.phone}</p>
                        </div>
                        <a 
                          href={`tel:${selectedLead.phone}`}
                          className="p-2 bg-[#22C55E]/10 text-[#22C55E] rounded-lg hover:bg-[#22C55E]/20 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:border-[#22C55E]/30 transition-all group">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[#9CA3AF] font-bold uppercase mb-0.5">Công ty</p>
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">{selectedLead.company}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Source & Last Contact */}
                  <section className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Search className="w-4 h-4 text-blue-500" />
                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase">Nguồn Lead</p>
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{selectedLead.source}</p>
                    </div>
                    <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <p className="text-[10px] text-[#9CA3AF] font-bold uppercase">Liên hệ cuối</p>
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{selectedLead.lastContact}</p>
                    </div>
                  </section>

                  {/* Tags Section */}
                  <section>
                    <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Tag className="w-3 h-3" /> Phân loại & Tags
                    </h4>
                    <div className="bg-[#F9FAFB] p-4 rounded-2xl border border-[#E5E7EB]">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedLead.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white text-[#4B5563] text-xs font-bold rounded-xl flex items-center gap-2 border border-[#E5E7EB] shadow-sm group/tag">
                            <Tag className="w-3 h-3 text-[#9CA3AF]" />
                            {tag}
                            <button 
                              onClick={() => handleRemoveTag(selectedLead.id, tag)}
                              className="text-[#9CA3AF] hover:text-red-500 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {selectedLead.tags.length === 0 && (
                          <p className="text-xs text-[#9CA3AF] italic">Chưa có tag nào</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag(selectedLead.id, newTag)}
                          placeholder="Thêm tag mới..."
                          className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs focus:ring-2 focus:ring-[#22C55E] outline-none transition-all"
                        />
                        <button 
                          onClick={() => handleAddTag(selectedLead.id, newTag)}
                          disabled={!newTag.trim()}
                          className="px-4 py-2 bg-[#22C55E] text-white rounded-xl text-xs font-bold hover:bg-[#16A34A] transition-all disabled:opacity-50"
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Activity Timeline */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
                        <History className="w-3 h-3" /> Lịch sử chăm sóc
                      </h4>
                      <button 
                        onClick={() => setIsAddingActivity(!isAddingActivity)}
                        className="text-xs font-bold text-[#22C55E] flex items-center gap-1 hover:text-[#16A34A] transition-colors"
                      >
                        {isAddingActivity ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {isAddingActivity ? 'Hủy' : 'Thêm hoạt động'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isAddingActivity && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-6 p-4 bg-white border-2 border-[#22C55E]/20 rounded-2xl shadow-sm space-y-4"
                        >
                          <div className="flex gap-2">
                            {(['Call', 'Email', 'Meeting', 'Note'] as const).map(type => (
                              <button
                                key={type}
                                onClick={() => setNewActivityType(type)}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                                  newActivityType === type 
                                    ? 'bg-[#22C55E] text-white border-[#22C55E]' 
                                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          <textarea 
                            value={newActivityNote}
                            onChange={(e) => setNewActivityNote(e.target.value)}
                            placeholder="Nhập nội dung hoạt động..."
                            className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#22C55E] outline-none transition-all min-h-[100px] resize-none"
                          />
                          <button 
                            onClick={handleAddActivity}
                            disabled={!newActivityNote.trim()}
                            className="w-full py-3 bg-[#22C55E] text-white rounded-xl text-sm font-bold hover:bg-[#16A34A] transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                          >
                            Lưu hoạt động
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E5E7EB]">
                      {selectedLead.history.map((activity, i) => {
                        const Icon = activity.type === 'Call' ? Phone :
                                     activity.type === 'Email' ? Mail :
                                     activity.type === 'Meeting' ? Users : FileText;
                        
                        const colorClass = activity.type === 'Call' ? 'bg-blue-500' :
                                           activity.type === 'Email' ? 'bg-orange-500' :
                                           activity.type === 'Meeting' ? 'bg-purple-500' : 'bg-gray-500';

                        return (
                          <div key={i} className="relative pl-12">
                            <div className={`absolute left-0 top-1 w-10 h-10 rounded-2xl border-4 border-white shadow-sm flex items-center justify-center text-white z-10 ${colorClass}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">{activity.type}</span>
                                <span className="text-[10px] font-bold text-[#9CA3AF] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.date}
                                </span>
                              </div>
                              <p className="text-sm text-[#4B5563] leading-relaxed">{activity.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-[#E5E7EB] bg-white grid grid-cols-2 gap-4 sticky bottom-0">
                <button className="py-3.5 bg-white border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#1A1A1A] hover:bg-[#F3F4F6] transition-all">
                  Chỉnh sửa
                </button>
                <button 
                  onClick={handleOpenEmailModal}
                  className="py-3.5 bg-[#22C55E] text-white rounded-2xl text-sm font-bold hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Mail className="w-4 h-4" />
                  Gửi Email
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Email Composition Modal */}
      <AnimatePresence>
        {isEmailModalOpen && selectedLead && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#22C55E]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A]">Soạn Email</h3>
                    <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Gửi đến: {selectedLead.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEmailModalOpen(false)}
                  className="p-2 hover:bg-[#E5E7EB] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Chủ đề</label>
                  <input 
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Nhập chủ đề email..."
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <label className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest ml-1">Nội dung</label>
                  <textarea 
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Soạn nội dung email tại đây..."
                    className="w-full flex-1 px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm focus:ring-2 focus:ring-[#22C55E] outline-none transition-all min-h-[300px] resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-end gap-3">
                <button 
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-[#6B7280] hover:bg-[#E5E7EB] rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || !emailSubject || !emailContent}
                  className="px-8 py-2.5 bg-[#22C55E] text-white rounded-xl text-sm font-bold hover:bg-[#16A34A] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#22C55E]/20"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Gửi ngay
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
