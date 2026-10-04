export type CarStatus = 'good' | 'upcoming' | 'overdue' | 'maintenance';

export interface Car {
  id: string;
  carNumber: string;         // رقم السيارة
  brandModel: string;        // الماركة والموديل
  year: number;              // سنة الصنع
  plateNumber: string;       // رقم اللوحة
  currentOdometer: number;   // قراءة العداد الحالية (كم)
  driverName: string;        // اسم السائق
  notes?: string;            // ملاحظات
  status: CarStatus;         // الحالة العامة
}

export type MaintenanceStatus = 'healthy' | 'upcoming' | 'overdue';

export interface MaintenanceItem {
  id: string;
  carId: string;
  name: string;              // اسم الصيانة (تغيير الزيت، فلتر الزيت، تيل الفرامل...)
  lastDate: string;          // آخر تاريخ صيانة (YYYY-MM-DD)
  lastOdometer: number;      // العداد وقت الصيانة (كم)
  intervalKm: number;        // فترة التكرار بالكيلومتر
  intervalMonths: number;    // فترة التكرار بالشهور
  nextOdometer: number;      // موعد/عداد الصيانة القادمة
  nextDate: string;          // موعد الصيانة القادم (YYYY-MM-DD)
  status: MaintenanceStatus; // الحالة (🟢 سليم، 🟡 قريباً، 🔴 متأخر)
  notes?: string;
}

export interface MaintenanceLog {
  id: string;
  carId: string;
  carName: string;           // اسم ورقم السيارة للتسهيل
  date: string;              // تاريخ التنفيذ
  odometer: number;          // العداد وقت الصيانة
  itemsDescription: string;  // وصف ما تم عمله (مثل: تغيير زيت + فلتر)
  notes?: string;
}

export type TabType = 'dashboard' | 'cars' | 'schedule' | 'alerts' | 'history' | 'search';
