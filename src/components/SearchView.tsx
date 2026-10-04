import React, { useState } from 'react';
import { Car, MaintenanceItem } from '../types';
import { formatNumber, getStatusBadge } from '../utils';
import { 
  Search, 
  Filter, 
  Calendar, 
  Gauge, 
  Wrench, 
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Car as CarIcon
} from 'lucide-react';

interface SearchViewProps {
  cars: Car[];
  maintenanceItems: MaintenanceItem[];
  onSelectCar: (carId: string) => void;
  onOpenRecordMaintenance: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  cars,
  maintenanceItems,
  onSelectCar,
  onOpenRecordMaintenance
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'overdue' | 'upcoming' | 'car' | 'date'>('all');
  const [selectedCarId, setSelectedCarId] = useState<string>(cars[0]?.id || '');
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = maintenanceItems.filter(item => {
    const car = cars.find(c => c.id === item.carId);
    if (!car) return false;

    // General text search
    const matchesQuery = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brandModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.driverName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (filterMode === 'overdue') {
      return item.status === 'overdue';
    } else if (filterMode === 'upcoming') {
      return item.status === 'upcoming';
    } else if (filterMode === 'car') {
      return item.carId === selectedCarId;
    } else if (filterMode === 'date') {
      return item.nextDate >= startDate && item.nextDate <= endDate;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1">
          <Search className="w-6 h-6 text-indigo-600" />
          <span>البحث المتقدم وتصفية الصيانة</span>
        </h2>
        <p className="text-xs text-slate-500">اختر طريقة التصفية المطلوبة لاستعراض حالة بنود الصيانة بدقة وسرعة</p>
      </div>

      {/* Filter Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setFilterMode('all')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            filterMode === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold opacity-80">الكل</span>
          <span className="text-base font-bold mt-2">جميع البنود</span>
        </button>

        <button
          onClick={() => setFilterMode('overdue')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            filterMode === 'overdue'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold opacity-80">🔴 حالة حرجة</span>
          <span className="text-base font-bold mt-2">الصيانة المتأخرة فقط</span>
        </button>

        <button
          onClick={() => setFilterMode('upcoming')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            filterMode === 'upcoming'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold opacity-80">🟡 انتباه</span>
          <span className="text-base font-bold mt-2">الصيانة القريبة</span>
        </button>

        <button
          onClick={() => setFilterMode('car')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
            filterMode === 'car'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold opacity-80">🚗 تخصيص</span>
          <span className="text-base font-bold mt-2">صيانة سيارة معينة</span>
        </button>

        <button
          onClick={() => setFilterMode('date')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between col-span-2 sm:col-span-1 ${
            filterMode === 'date'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-semibold opacity-80">📅 زمني</span>
          <span className="text-base font-bold mt-2">خلال فترة معينة</span>
        </button>
      </div>

      {/* Sub-filters based on mode */}
      {filterMode === 'car' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
          <span className="text-sm font-bold text-slate-700 whitespace-nowrap">اختر السيارة:</span>
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            className="w-full bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
          >
            {cars.map(car => (
              <option key={car.id} value={car.id}>{car.brandModel} ({car.carNumber}) - لوحة: {car.plateNumber}</option>
            ))}
          </select>
        </div>
      )}

      {filterMode === 'date' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700 whitespace-nowrap">من تاريخ:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700 whitespace-nowrap">إلى تاريخ:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium"
            />
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث إضافي بالاسم، الماركة، أو رقم اللوحة..."
          className="w-full bg-white pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
        />
      </div>

      {/* Results */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">لا توجد نتائج مطابقة لخيارات البحث</h3>
          <p className="text-sm text-slate-500">جرب تعديل خيارات التصفية أو التواريخ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const car = cars.find(c => c.id === item.carId);
            if (!car) return null;
            const badge = getStatusBadge(item.status);
            const kmRemaining = item.nextOdometer - car.currentOdometer;

            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between p-6"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      onClick={() => onSelectCar(car.id)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 cursor-pointer hover:bg-indigo-100"
                    >
                      {car.brandModel} ({car.carNumber})
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.name}</h3>

                  <div className="space-y-2 text-xs text-slate-600 py-3 border-y border-slate-100">
                    <div className="flex items-center justify-between">
                      <span>عداد السيارة الحالي:</span>
                      <strong className="text-slate-900 font-mono">{formatNumber(car.currentOdometer)} كم</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>عداد الصيانة القادمة:</span>
                      <strong className="text-indigo-600 font-mono">{formatNumber(item.nextOdometer)} كم</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>موعد الصيانة القادم:</span>
                      <strong className="text-slate-900 font-mono">{item.nextDate}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-xs font-bold ${
                    item.status === 'overdue' ? 'text-rose-600' : item.status === 'upcoming' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {item.status === 'overdue' ? `متأخرة بـ ${formatNumber(Math.abs(kmRemaining))} كم` : `باقي ${formatNumber(kmRemaining)} كم`}
                  </span>
                  <button
                    onClick={onOpenRecordMaintenance}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" /> تسجيل صيانة
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
