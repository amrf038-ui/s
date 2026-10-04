import React, { useState } from 'react';
import { Car, MaintenanceItem } from '../types';
import { formatNumber, getStatusBadge } from '../utils';
import { 
  Car as CarIcon, 
  Plus, 
  Search, 
  Gauge, 
  User, 
  FileText, 
  Edit3, 
  Trash2, 
  Wrench,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface CarsViewProps {
  cars: Car[];
  maintenanceItems: MaintenanceItem[];
  onOpenAddCar: () => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (carId: string) => void;
  onUpdateOdometer: (car: Car) => void;
  onSelectCarDetails: (carId: string) => void;
  onOpenRecordMaintenanceForCar: (carId: string) => void;
}

export const CarsView: React.FC<CarsViewProps> = ({
  cars,
  maintenanceItems,
  onOpenAddCar,
  onEditCar,
  onDeleteCar,
  onUpdateOdometer,
  onSelectCarDetails,
  onOpenRecordMaintenanceForCar
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.brandModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carNumber.includes(searchTerm);
      
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">إدارة أسطول السيارات</h2>
          <p className="text-xs text-slate-500">عرض بيانات السيارات، قراءات العدادات الحالية، والسائقين</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenAddCar}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-indigo-100"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة سيارة جديدة</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم السيارة، الماركة، رقم اللوحة، أو اسم السائق..."
            className="w-full bg-white pr-12 pl-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-semibold text-slate-700"
          >
            <option value="all">جميع الحالات</option>
            <option value="good">سليم (🟢)</option>
            <option value="upcoming">صيانة قريبة (🟡)</option>
            <option value="overdue">صيانة متأخرة (🔴)</option>
            <option value="maintenance">تحت الصيانة (🔧)</option>
          </select>
        </div>
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <CarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">لا توجد سيارات مطابقة للبحث</h3>
          <p className="text-sm text-slate-500">جرب تغيير كلمات البحث أو إزالة الفلاتر</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const badge = getStatusBadge(car.status);
            const carItems = maintenanceItems.filter(i => i.carId === car.id);

            return (
              <div 
                key={car.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold text-sm flex items-center justify-center border border-indigo-100">
                        {car.carNumber}
                      </span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{car.brandModel}</h3>
                        <span className="text-xs text-slate-500">سنة الصنع: {car.year}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 py-3 border-y border-slate-100 text-sm">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-xs">
                        <FileText className="w-4 h-4 text-slate-400" /> رقم اللوحة:
                      </span>
                      <strong className="text-slate-900 font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg text-xs">
                        {car.plateNumber}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Gauge className="w-4 h-4 text-indigo-500" /> العداد الحالي:
                      </span>
                      <strong className="text-indigo-600 font-bold">
                        {formatNumber(car.currentOdometer)} كم
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-xs">
                        <User className="w-4 h-4 text-slate-400" /> السائق المسؤول:
                      </span>
                      <strong className="text-slate-900">{car.driverName}</strong>
                    </div>
                  </div>

                  {/* Notes */}
                  {car.notes && (
                    <p className="mt-3 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {car.notes}
                    </p>
                  )}

                  {/* Maintenance count summary */}
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>بنود الصيانة المتابعة: {carItems.length}</span>
                    <button
                      onClick={() => onSelectCarDetails(car.id)}
                      className="text-indigo-600 hover:text-indigo-700 underline"
                    >
                      عرض جدول الصيانة
                    </button>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onUpdateOdometer(car)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-colors shadow-xs"
                  >
                    <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                    <span>تحديث العداد</span>
                  </button>

                  <button
                    onClick={() => onOpenRecordMaintenanceForCar(car.id)}
                    title="تسجيل صيانة"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-xs"
                  >
                    <Wrench className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEditCar(car)}
                    title="تعديل السيارة"
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCar(car.id)}
                    title="حذف السيارة"
                    className="p-2 bg-white hover:bg-rose-50 text-rose-600 rounded-xl border border-slate-200 transition-colors"
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
