import React, { useState } from 'react';
import { MaintenanceLog, Car } from '../types';
import { formatNumber } from '../utils';
import { 
  History, 
  Search, 
  Calendar, 
  Gauge, 
  FileText, 
  Car as CarIcon,
  Trash2
} from 'lucide-react';

interface HistoryViewProps {
  logs: MaintenanceLog[];
  cars: Car[];
  onDeleteLog: (logId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  logs,
  cars,
  onDeleteLog
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.itemsDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCar = selectedCarId === 'all' || log.carId === selectedCarId;

    return matchesSearch && matchesCar;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600" />
            <span>سجل صيانة الأسطول</span>
          </h2>
          <p className="text-xs text-slate-500">سجل تاريخي كامل لكل أعمال الصيانة والقطع التي تم تغييرها للسيارات (بدون أسعار أو تكاليف)</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في سجل الصيانة (اسم البند، الوصف، أو الملاحظات)..."
            className="w-full bg-white pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
          />
        </div>

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
      </div>

      {/* History Timeline / Cards */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">لا توجد سجلات صيانة مطابقة</h3>
          <p className="text-sm text-slate-500">جرب تغيير شروط البحث أو إضافة عمليات صيانة جديدة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map(log => {
            return (
              <div 
                key={log.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm shrink-0 border border-indigo-100">
                    <CarIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-extrabold text-slate-900 text-base">{log.carName}</h4>
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {log.date}
                      </span>
                    </div>

                    <p className="text-base font-bold text-indigo-700 pt-1">
                      {log.itemsDescription}
                    </p>

                    {log.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                        ملاحظات الفني: {log.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-6">
                  <div className="flex items-center gap-2 text-slate-600 bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100/50">
                    <Gauge className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs">العداد: <strong className="text-slate-900 font-mono">{formatNumber(log.odometer)} كم</strong></span>
                  </div>

                  <button
                    onClick={() => onDeleteLog(log.id)}
                    title="حذف السجل"
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-200"
                  >
                    <Trash2 className="w-4 h-4" />
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
