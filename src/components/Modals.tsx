import React, { useState } from 'react';
import { Car, MaintenanceItem, MaintenanceLog } from '../types';
import { X, Wrench, Car as CarIcon, Gauge, Plus, Calendar, FileText } from 'lucide-react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Add / Edit Car Modal ---
interface AddEditCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (carData: Omit<Car, 'id' | 'status'> & { id?: string }) => void;
  carToEdit?: Car | null;
}

export const AddEditCarModal: React.FC<AddEditCarModalProps> = ({ isOpen, onClose, onSave, carToEdit }) => {
  const [carNumber, setCarNumber] = useState(carToEdit?.carNumber || '');
  const [brandModel, setBrandModel] = useState(carToEdit?.brandModel || '');
  const [year, setYear] = useState(carToEdit?.year ? carToEdit.year.toString() : '2022');
  const [plateNumber, setPlateNumber] = useState(carToEdit?.plateNumber || '');
  const [currentOdometer, setCurrentOdometer] = useState(carToEdit?.currentOdometer ? carToEdit.currentOdometer.toString() : '50000');
  const [driverName, setDriverName] = useState(carToEdit?.driverName || '');
  const [notes, setNotes] = useState(carToEdit?.notes || '');

  React.useEffect(() => {
    if (carToEdit) {
      setCarNumber(carToEdit.carNumber);
      setBrandModel(carToEdit.brandModel);
      setYear(carToEdit.year.toString());
      setPlateNumber(carToEdit.plateNumber);
      setCurrentOdometer(carToEdit.currentOdometer.toString());
      setDriverName(carToEdit.driverName);
      setNotes(carToEdit.notes || '');
    } else {
      setCarNumber('');
      setBrandModel('');
      setYear('2022');
      setPlateNumber('');
      setCurrentOdometer('50000');
      setDriverName('');
      setNotes('');
    }
  }, [carToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandModel || !plateNumber) return;

    onSave({
      id: carToEdit?.id,
      carNumber: carNumber || '05',
      brandModel,
      year: parseInt(year) || 2022,
      plateNumber,
      currentOdometer: parseInt(currentOdometer) || 0,
      driverName: driverName || 'غير محدد',
      notes
    });
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={carToEdit ? 'تعديل بيانات السيارة' : 'إضافة سيارة جديدة'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رقم السيارة (كود)</label>
            <input
              type="text"
              required
              value={carNumber}
              onChange={(e) => setCarNumber(e.target.value)}
              placeholder="مثال: 01"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">سنة الصنع</label>
            <input
              type="number"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">الماركة والموديل</label>
          <input
            type="text"
            required
            value={brandModel}
            onChange={(e) => setBrandModel(e.target.value)}
            placeholder="مثال: شيفروليه أفيو"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">رقم اللوحة</label>
            <input
              type="text"
              required
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="مثال: أ ب ج 1234"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">قراءة العداد الحالية (كم)</label>
            <input
              type="number"
              required
              value={currentOdometer}
              onChange={(e) => setCurrentOdometer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">اسم السائق المسؤول</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="مثال: أحمد محمود"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="ملاحظات حول السيارة..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
          >
            {carToEdit ? 'حفظ التعديلات' : 'إضافة السيارة'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// --- Record Maintenance Modal ---
interface RecordMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
  maintenanceItems: MaintenanceItem[];
  onSaveLog: (log: Omit<MaintenanceLog, 'id'>, updatedOdometer: number, maintenanceItemId?: string) => void;
  preselectedCarId?: string | null;
}

export const RecordMaintenanceModal: React.FC<RecordMaintenanceModalProps> = ({
  isOpen,
  onClose,
  cars,
  maintenanceItems,
  onSaveLog,
  preselectedCarId
}) => {
  const [carId, setCarId] = useState(preselectedCarId || cars[0]?.id || '');
  const [maintenanceType, setMaintenanceType] = useState('تغيير زيت + فلتر');
  const [customType, setCustomType] = useState('');
  const [odometer, setOdometer] = useState('50000');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (preselectedCarId) {
      setCarId(preselectedCarId);
    } else if (cars.length > 0 && !carId) {
      setCarId(cars[0].id);
    }
  }, [preselectedCarId, cars]);

  React.useEffect(() => {
    const car = cars.find(c => c.id === carId);
    if (car) {
      setOdometer(car.currentOdometer.toString());
    }
  }, [carId, cars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    const finalDescription = maintenanceType === 'أخرى' ? customType : maintenanceType;
    const odNum = parseInt(odometer) || car.currentOdometer;

    // Find if there is a matching maintenance item
    const matchingItem = maintenanceItems.find(i => i.carId === carId && i.name === finalDescription);

    onSaveLog({
      carId,
      carName: `${car.brandModel} (${car.carNumber})`,
      date,
      odometer: odNum,
      itemsDescription: finalDescription,
      notes
    }, odNum, matchingItem?.id);

    onClose();
  };

  const commonMaintenanceOptions = [
    'تغيير زيت المحرك والفلتر',
    'فلتر الهواء',
    'فلتر البنزين',
    'تيل الفرامل',
    'زيت الفتيس',
    'السيور',
    'البطارية',
    'الإطارات',
    'أخرى'
  ];

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="تسجيل تنفيذ صيانة جديدة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">السيارة</label>
          <select
            value={carId}
            onChange={(e) => setCarId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {cars.map(car => (
              <option key={car.id} value={car.id}>{car.brandModel} ({car.carNumber}) - لوحة: {car.plateNumber}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">نوع الصيانة / البند</label>
          <select
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            {commonMaintenanceOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {maintenanceType === 'أخرى' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">وصف صيانة أخرى</label>
            <input
              type="text"
              required
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="اكتب اسم الصيانة..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">قراءة العداد وقت الصيانة (كم)</label>
            <input
              type="number"
              required
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">تاريخ التنفيذ</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات فنية (اختياري)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="مثل: تم استخدام قطع غيار أصلية..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
          >
            تسجيل وإحالة الموعد القادم
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

// --- Update Odometer Modal ---
interface UpdateOdometerModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
  onSaveOdometer: (carId: string, newOdometer: number) => void;
}

export const UpdateOdometerModal: React.FC<UpdateOdometerModalProps> = ({
  isOpen,
  onClose,
  car,
  onSaveOdometer
}) => {
  const [odometer, setOdometer] = useState(car ? car.currentOdometer.toString() : '');

  React.useEffect(() => {
    if (car) {
      setOdometer(car.currentOdometer.toString());
    }
  }, [car]);

  if (!car) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(odometer);
    if (isNaN(val)) return;
    onSaveOdometer(car.id, val);
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={`تحديث قراءة العداد لـ ${car.brandModel} (${car.carNumber})`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">قراءة العداد الحالية (كم)</label>
          <input
            type="number"
            required
            value={odometer}
            onChange={(e) => setOdometer(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-1">العداد السابق: {car.currentOdometer.toLocaleString()} كم</p>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-100 transition-all"
          >
            حفظ التحديث
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
