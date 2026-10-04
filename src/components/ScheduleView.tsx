import React, { useState } from 'react';
import { Car, MaintenanceItem } from '../types';
import { formatNumber, getStatusBadge } from '../utils';
import { 
  Wrench, 
  Plus, 
  Search, 
  Calendar, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';

interface ScheduleViewProps {
  cars: Car[];
  maintenanceItems: MaintenanceItem[];
  onOpenRecordMaintenance: () => void;
  onOpenAddMaintenanceItem: () => void;
  onEditMaintenanceItem: (item: MaintenanceItem) => void;
  onDeleteMaintenanceItem: (itemId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  cars,
  maintenanceItems,
  onOpenRecordMaintenance,
  onOpenAddMaintenanceItem,
  onEditMaintenanceItem,
  onDeleteMaintenanceItem
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredItems = maintenanceItems.filter(item => {
    const car = cars.find(c => c.id === item.carId);
    if (!car) return false;

    const matchesCar = selectedCarId === 'all' || item.carId === selectedCarId;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carNumber.includes(searchTerm);

    return matchesCar && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">جدول صيانة الأسطول</h2>
          <p className="text-xs text-slate-500">متابعة مواعيد وعدادات تغيير الزيوت، الفلاتر، الفرامل، والسيور بدقة</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenAddMaintenanceItem}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة بند صيانة</span>
          </button>
          <button
            onClick={onOpenRecordMaintenance}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-indigo-100"
          >
            <Wrench className="w-4 h-4" />
            <span>تسجيل تنفيذ صيانة</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold text-slate-700"
          >
            <option value="all">جميع السيارات ({cars.length})</option>
            {cars.map(c => (
              <option key={c.id} value={c.id}>{c.brandModel} ({c.carNumber})</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold text-slate-700"
          >
            <option value="all">جميع حالات الصيانة</option>
            <option value="healthy">سليم (🟢)</option>
            <option value="upcoming">قريب (🟡)</option>
            <option value="overdue">متأخر (🔴)</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم بند الصيانة..."
            className="w-full bg-white pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Maintenance Items Table / Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">لا توجد بنود صيانة مطابقة</h3>
          <p className="text-sm text-slate-500">جرب تغيير خيارات الفلترة أو البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const car = cars.find(c => c.id === item.carId);
            const badge = getStatusBadge(item.status);
            const kmRemaining = item.nextOdometer - (car?.currentOdometer || 0);

            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {car ? `${car.brandModel} (${car.carNumber})` : 'سيارة محذوفة'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-4">{item.name}</h3>

                  {/* Details grid */}
                  <div className="space-y-2.5 text-xs text-slate-600 py-3 border-y border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" /> آخر صيانة:
                      </span>
                      <strong className="text-slate-900 font-mono">{item.lastDate}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Gauge className="w-3.5 h-3.5" /> عداد آخر صيانة:
                      </span>
                      <strong className="text-slate-900 font-mono">{formatNumber(item.lastOdometer)} كم</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> التكرار (كم / أشهر):
                      </span>
                      <strong className="text-slate-900">{formatNumber(item.intervalKm)} كم / {item.intervalMonths} شهر</strong>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-700">الصيانة القادمة (عداد):</span>
                      <strong className="text-indigo-600 font-bold font-mono">{formatNumber(item.nextOdometer)} كم</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">الموعد القادم (تاريخ):</span>
                      <strong className="text-slate-900 font-mono">{item.nextDate}</strong>
                    </div>
                  </div>

                  {/* Remaining KM indicator */}
                  <div className={`mt-4 p-3 rounded-2xl flex items-center justify-between text-xs font-bold ${
                    item.status === 'overdue' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : item.status === 'upcoming' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    <span>حالة العداد:</span>
                    <span>
                      {item.status === 'overdue' 
                        ? `متأخرة بـ ${formatNumber(Math.abs(kmRemaining))} كم` 
                        : `باقي ${formatNumber(kmRemaining)} كم`}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="mt-3 text-xs text-slate-500 italic">
                      ملاحظات: {item.notes}
                    </p>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onOpenRecordMaintenance()}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" /> تنفيذ وتسجيل الصيانة
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditMaintenanceItem(item)}
                      title="تعديل"
                      className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMaintenanceItem(item.id)}
                      title="حذف"
                      className="p-1.5 text-rose-600 hover:text-rose-700 bg-white border border-slate-200 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
