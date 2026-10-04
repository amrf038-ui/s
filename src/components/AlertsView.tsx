import React from 'react';
import { Car, MaintenanceItem } from '../types';
import { formatNumber } from '../utils';
import { 
  Bell, 
  AlertTriangle, 
  XCircle, 
  Wrench, 
  Car as CarIcon, 
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Gauge
} from 'lucide-react';

interface AlertsViewProps {
  cars: Car[];
  maintenanceItems: MaintenanceItem[];
  onOpenRecordMaintenance: () => void;
  onSelectCar: (carId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  cars,
  maintenanceItems,
  onOpenRecordMaintenance,
  onSelectCar
}) => {
  const overdueItems = maintenanceItems.filter(item => item.status === 'overdue');
  const upcomingItems = maintenanceItems.filter(item => item.status === 'upcoming');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500 animate-pulse" />
            <span>تنبيهات الصيانة الدورية</span>
          </h2>
          <p className="text-xs text-slate-500">متابعة فورية للسيارات التي تجاوزت عداد الصيانة أو اقترب موعدها</p>
        </div>
        <button
          onClick={onOpenRecordMaintenance}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-indigo-100"
        >
          <Wrench className="w-4 h-4" />
          <span>تسجيل صيانة لأي سيارة</span>
        </button>
      </div>

      {/* Overdue Section (🔴) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
          <h3 className="text-lg font-bold text-rose-700">الصيانة المتأخرة (🔴) - تتطلب إجراء فوري</h3>
          <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
            {overdueItems.length}
          </span>
        </div>

        {overdueItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">لا توجد أي صيانات متأخرة حالياً. ممتاز!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueItems.map(item => {
              const car = cars.find(c => c.id === item.carId);
              if (!car) return null;
              const kmDiff = Math.abs(item.nextOdometer - car.currentOdometer);

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-rose-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-1 rounded-full border border-rose-200">
                        🔴 متأخرة
                      </span>
                      <span className="text-xs text-slate-500 font-mono">لوحة: {car.plateNumber}</span>
                    </div>

                    <h4 
                      onClick={() => onSelectCar(car.id)}
                      className="text-lg font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {car.brandModel} ({car.carNumber}) — {item.name}
                    </h4>

                    <div className="my-4 py-3 border-y border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>قراءة عداد السيارة الحالي:</span>
                        <strong className="text-slate-900 font-mono">{formatNumber(car.currentOdometer)} كم</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>العداد المستهدف للصيانة:</span>
                        <strong className="text-rose-600 font-mono">{formatNumber(item.nextOdometer)} كم</strong>
                      </div>
                      <div className="flex items-center justify-between text-rose-700 font-bold bg-rose-50 p-2 rounded-xl">
                        <span>تجاوزت العداد بـ:</span>
                        <span className="font-mono">{formatNumber(kmDiff)} كم</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">السائق: {car.driverName}</span>
                    <button
                      onClick={onOpenRecordMaintenance}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>تسجيل الصيانة الآن</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Section (🟡) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <h3 className="text-lg font-bold text-amber-700">الصيانة القريبة (🟡) - يجب التخطيط لها قريباً</h3>
          <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
            {upcomingItems.length}
          </span>
        </div>

        {upcomingItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-800">لا توجد صيانات قريبة في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingItems.map(item => {
              const car = cars.find(c => c.id === item.carId);
              if (!car) return null;
              const kmDiff = item.nextOdometer - car.currentOdometer;

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200">
                        🟡 صيانة قريبة
                      </span>
                      <span className="text-xs text-slate-500 font-mono">لوحة: {car.plateNumber}</span>
                    </div>

                    <h4 
                      onClick={() => onSelectCar(car.id)}
                      className="text-lg font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {car.brandModel} ({car.carNumber}) — {item.name}
                    </h4>

                    <div className="my-4 py-3 border-y border-slate-100 space-y-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>قراءة عداد السيارة الحالي:</span>
                        <strong className="text-slate-900 font-mono">{formatNumber(car.currentOdometer)} كم</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>موعد الصيانة القادم (عداد):</span>
                        <strong className="text-amber-600 font-mono">{formatNumber(item.nextOdometer)} كم</strong>
                      </div>
                      <div className="flex items-center justify-between text-amber-800 font-bold bg-amber-50 p-2 rounded-xl">
                        <span>المسافة المتبقية:</span>
                        <span className="font-mono">باقي حوالي {formatNumber(kmDiff)} كم</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">السائق: {car.driverName}</span>
                    <button
                      onClick={onOpenRecordMaintenance}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>تسجيل الصيانة</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
