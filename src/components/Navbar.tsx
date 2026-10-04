import React from 'react';
import { TabType } from '../types';
import { 
  LayoutDashboard, 
  Car as CarIcon, 
  Wrench, 
  Bell, 
  History, 
  Search, 
  PlusCircle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddCar: () => void;
  onOpenRecordMaintenance: () => void;
  onResetData: () => void;
  upcomingCount: number;
  overdueCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddCar,
  onOpenRecordMaintenance,
  onResetData,
  upcomingCount,
  overdueCount
}) => {
  const totalAlerts = upcomingCount + overdueCount;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'cars' as TabType, label: 'السيارات', icon: CarIcon },
    { id: 'schedule' as TabType, label: 'جدول الصيانة', icon: Wrench },
    { 
      id: 'alerts' as TabType, 
      label: 'التنبيهات', 
      icon: Bell, 
      badge: totalAlerts > 0 ? totalAlerts : null,
      badgeColor: overdueCount > 0 ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
    },
    { id: 'history' as TabType, label: 'سجل الصيانة', icon: History },
    { id: 'search' as TabType, label: 'البحث والتصفية', icon: Search },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">إدارة وصيانة السيارات</h1>
              <p className="text-xs text-slate-500 font-medium">متابعة الأسطول والصيانة الدورية بدقة وسهولة</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenRecordMaintenance}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-indigo-100 hover:shadow"
            >
              <Wrench className="w-4 h-4" />
              <span>تسجيل صيانة جديدة</span>
            </button>
            <button
              onClick={onOpenAddCar}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة سيارة</span>
            </button>
            <button
              onClick={onResetData}
              title="إعادة ضبط البيانات الأصلية"
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto pb-3 pt-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all relative ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-slate-50 border-t border-slate-200 gap-2">
        <button
          onClick={onOpenRecordMaintenance}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 text-white py-2 rounded-xl text-xs font-semibold shadow-xs"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>تسجيل صيانة</span>
        </button>
        <button
          onClick={onOpenAddCar}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 text-white py-2 rounded-xl text-xs font-semibold shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>إضافة سيارة</span>
        </button>
        <button
          onClick={onResetData}
          title="إعادة ضبط"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
