import React from 'react';
import { Car, MaintenanceItem, TabType } from '../types';
import { formatNumber, getStatusBadge } from '../utils';
import { 
  Car as CarIcon, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  Bell, 
  ArrowLeft,
  Calendar,
  Gauge,
  User,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  cars: Car[];
  maintenanceItems: MaintenanceItem[];
  onNavigate: (tab: TabType) => void;
  onSelectCar: (carId: string) => void;
  onOpenRecordMaintenance: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cars,
  maintenanceItems,
  onNavigate,
  onSelectCar,
  onOpenRecordMaintenance
}) => {
  const totalCars = cars.length;

  const healthyCarsCount = cars.filter(c => c.status === 'good').length;
  const upcomingCarsCount = cars.filter(c => c.status === 'upcoming').length;
  const overdueCarsCount = cars.filter(c => c.status === 'overdue').length;
  const maintenanceCarsCount = cars.filter(c => c.status === 'maintenance').length;

  // Gather all upcoming and overdue maintenance items for alerts ticker
  const alertItems = maintenanceItems.filter(item => item.status === 'upcoming' || item.status === 'overdue');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome & Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Cars */}
        <div 
          onClick={() => onNavigate('cars')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">إجمالي السيارات</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{formatNumber(totalCars)}</span>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:underline">
              عرض الكل <ArrowLeft className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Healthy Cars */}
        <div 
          onClick={() => onNavigate('cars')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">سيارات سليمة</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">{formatNumber(healthyCarsCount)}</span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">بدون صيانة قريبة</span>
          </div>
        </div>

        {/* Upcoming Maintenance */}
        <div 
          onClick={() => onNavigate('alerts')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">صيانة قريبة</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-600">{formatNumber(upcomingCarsCount)}</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">تنبيه أصفر 🟡</span>
          </div>
        </div>

        {/* Overdue Maintenance */}
        <div 
          onClick={() => onNavigate('alerts')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">صيانة متأخرة</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-rose-600">{formatNumber(overdueCarsCount)}</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">تنبيه أحمر 🔴</span>
          </div>
        </div>

        {/* Under Maintenance */}
        <div 
          onClick={() => onNavigate('cars')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">تحت الصيانة</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-600">{formatNumber(maintenanceCarsCount)}</span>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">🔧 جاري العمل</span>
          </div>
        </div>

      </div>

      {/* Quick Alerts Section */}
      <div className="bg-gradient-to-l from-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Bell className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-bold">تنبيهات الصيانة الفورية</h2>
              <p className="text-xs text-slate-300">السيارات التي تحتاج إلى اهتمام فوري وصيانة دورية</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('alerts')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
            >
              عرض كل التنبيهات ({alertItems.length})
            </button>
            <button
              onClick={onOpenRecordMaintenance}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all"
            >
              تسجيل صيانة الآن
            </button>
          </div>
        </div>

        {alertItems.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="font-medium">ممتاز! جميع سيارات الأسطول بحالة ممتازة ولا توجد صيانة متأخرة أو قريبة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alertItems.slice(0, 3).map((item) => {
              const car = cars.find(c => c.id === item.carId);
              if (!car) return null;
              const isOverdue = item.status === 'overdue';
              const kmDiff = item.nextOdometer - car.currentOdometer;

              return (
                <div 
                  key={item.id}
                  onClick={() => onSelectCar(car.id)}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-4 transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isOverdue ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isOverdue ? '🔴 متأخرة' : '🟡 قريبة'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{car.plateNumber}</span>
                    </div>
                    <h3 className="font-bold text-lg text-white mb-1">{car.brandModel} ({car.carNumber})</h3>
                    <p className="text-sm text-indigo-200 font-medium mb-3">بند: {item.name}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                    <span>عداد السيارة: {formatNumber(car.currentOdometer)} كم</span>
                    <span className={isOverdue ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>
                      {isOverdue ? `متأخرة بـ ${formatNumber(Math.abs(kmDiff))} كم` : `باقي ${formatNumber(kmDiff)} كم`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cars Summary List */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">حالة أسطول السيارات</h3>
            <p className="text-xs text-slate-500">نظرة سريعة على جميع السيارات ومعدلات العدادات والصيانة</p>
          </div>
          <button
            onClick={() => onNavigate('cars')}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1"
          >
            إدارة السيارات <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cars.map((car) => {
            const badge = getStatusBadge(car.status);
            return (
              <div
                key={car.id}
                onClick={() => onSelectCar(car.id)}
                className="bg-slate-50 hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-200 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {car.carNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900">{car.brandModel} ({car.year})</h4>
                        <span className="text-xs text-slate-500 font-mono">لوحة: {car.plateNumber}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-slate-200/60 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Gauge className="w-4 h-4 text-indigo-600" />
                      <span>العداد: <strong className="text-slate-900">{formatNumber(car.currentOdometer)} كم</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span>السائق: <strong className="text-slate-900">{car.driverName}</strong></span>
                    </div>
                  </div>
                </div>

                {car.notes && (
                  <p className="text-xs text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-200/60">
                    ملاحظات: {car.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
