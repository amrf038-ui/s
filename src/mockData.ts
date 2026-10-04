import { Car, MaintenanceItem, MaintenanceLog } from './types';

export const initialCars: Car[] = [
  {
    id: 'car-1',
    carNumber: '01',
    brandModel: 'شيفروليه أفيو',
    year: 2013,
    plateNumber: 'أ ب ج 1234',
    currentOdometer: 128500,
    driverName: 'أحمد محمود',
    notes: 'سيارة استهلاك خفيف داخل المدينة',
    status: 'upcoming'
  },
  {
    id: 'car-2',
    carNumber: '02',
    brandModel: 'شيفروليه أوبترا',
    year: 2019,
    plateNumber: 'س ص ع 5678',
    currentOdometer: 94200,
    driverName: 'محمد إبراهيم',
    notes: 'تحتاج فحص نظام الفرامل والسيور',
    status: 'overdue'
  },
  {
    id: 'car-3',
    carNumber: '03',
    brandModel: 'هيونداي إلنترا',
    year: 2022,
    plateNumber: 'د هـ و 9012',
    currentOdometer: 45000,
    driverName: 'خالد عبد الله',
    notes: 'بحالة ممتازة وجديدة',
    status: 'good'
  },
  {
    id: 'car-4',
    carNumber: '04',
    brandModel: 'تويوتا كورولا',
    year: 2021,
    plateNumber: 'ر ز ح 3456',
    currentOdometer: 78000,
    driverName: 'سعيد حسن',
    notes: 'صيانة دورية منتظمة بالتوكيل',
    status: 'maintenance'
  }
];

export const initialMaintenanceItems: MaintenanceItem[] = [
  // أفيو (car-1)
  {
    id: 'm-1',
    carId: 'car-1',
    name: 'تغيير الزيت',
    lastDate: '2026-06-01',
    lastOdometer: 120000,
    intervalKm: 10000,
    intervalMonths: 6,
    nextOdometer: 130000,
    nextDate: '2026-12-01',
    status: 'upcoming',
    notes: 'باقي حوالي 1500 كم'
  },
  {
    id: 'm-2',
    carId: 'car-1',
    name: 'فلتر الزيت',
    lastDate: '2026-06-01',
    lastOdometer: 120000,
    intervalKm: 10000,
    intervalMonths: 6,
    nextOdometer: 130000,
    nextDate: '2026-12-01',
    status: 'upcoming'
  },
  {
    id: 'm-3',
    carId: 'car-1',
    name: 'فلتر الهواء',
    lastDate: '2026-08-20',
    lastOdometer: 127000,
    intervalKm: 20000,
    intervalMonths: 12,
    nextOdometer: 147000,
    nextDate: '2027-08-20',
    status: 'healthy'
  },
  {
    id: 'm-4',
    carId: 'car-1',
    name: 'تيل الفرامل',
    lastDate: '2026-03-10',
    lastOdometer: 112000,
    intervalKm: 30000,
    intervalMonths: 12,
    nextOdometer: 142000,
    nextDate: '2027-03-10',
    status: 'healthy'
  },

  // أوبترا (car-2)
  {
    id: 'm-5',
    carId: 'car-2',
    name: 'تغيير الزيت',
    lastDate: '2026-02-15',
    lastOdometer: 84000,
    intervalKm: 10000,
    intervalMonths: 6,
    nextOdometer: 94000,
    nextDate: '2026-08-15',
    status: 'overdue',
    notes: 'متأخرة بـ 200 كم'
  },
  {
    id: 'm-6',
    carId: 'car-2',
    name: 'تيل الفرامل',
    lastDate: '2025-10-10',
    lastOdometer: 75000,
    intervalKm: 30000,
    intervalMonths: 12,
    nextOdometer: 105000,
    nextDate: '2026-10-10',
    status: 'overdue',
    notes: 'متأخرة صيانة الفرامل 1,200 كم'
  },
  {
    id: 'm-7',
    carId: 'car-2',
    name: 'السيور',
    lastDate: '2024-05-10',
    lastOdometer: 50000,
    intervalKm: 40000,
    intervalMonths: 24,
    nextOdometer: 90000,
    nextDate: '2026-05-10',
    status: 'overdue'
  },

  // إلنترا (car-3)
  {
    id: 'm-8',
    carId: 'car-3',
    name: 'تغيير الزيت',
    lastDate: '2026-08-01',
    lastOdometer: 40000,
    intervalKm: 10000,
    intervalMonths: 6,
    nextOdometer: 50000,
    nextDate: '2027-02-01',
    status: 'healthy'
  },
  {
    id: 'm-9',
    carId: 'car-3',
    name: 'فلتر البنزين',
    lastDate: '2026-01-10',
    lastOdometer: 30000,
    intervalKm: 30000,
    intervalMonths: 18,
    nextOdometer: 60000,
    nextDate: '2027-07-10',
    status: 'healthy'
  },

  // تويوتا كورولا (car-4)
  {
    id: 'm-10',
    carId: 'car-4',
    name: 'زيت الفتيس',
    lastDate: '2025-05-10',
    lastOdometer: 40000,
    intervalKm: 40000,
    intervalMonths: 24,
    nextOdometer: 80000,
    nextDate: '2027-05-10',
    status: 'upcoming',
    notes: 'قريب جداً (باقي 2000 كم)'
  },
  {
    id: 'm-11',
    carId: 'car-4',
    name: 'البطارية',
    lastDate: '2025-01-15',
    lastOdometer: 55000,
    intervalKm: 50000,
    intervalMonths: 24,
    nextOdometer: 105000,
    nextDate: '2027-01-15',
    status: 'healthy'
  }
];

export const initialLogs: MaintenanceLog[] = [
  {
    id: 'log-1',
    carId: 'car-1',
    carName: 'أفيو (01)',
    date: '2026-06-01',
    odometer: 120000,
    itemsDescription: 'تغيير زيت + فلتر',
    notes: 'تم استخدام زيت موبيل 10w40'
  },
  {
    id: 'log-2',
    carId: 'car-1',
    carName: 'أفيو (01)',
    date: '2026-07-15',
    odometer: 123500,
    itemsDescription: 'فحص الفرامل',
    notes: 'تأكدنا من سلامة التيل والديسكات'
  },
  {
    id: 'log-3',
    carId: 'car-1',
    carName: 'أفيو (01)',
    date: '2026-08-20',
    odometer: 127000,
    itemsDescription: 'تغيير فلتر الهواء',
    notes: 'تم التنظيف وتغيير الفلتر بأصلي'
  },
  {
    id: 'log-4',
    carId: 'car-2',
    carName: 'أوبترا (02)',
    date: '2026-02-15',
    odometer: 84000,
    itemsDescription: 'تغيير زيت المحرك والفلتر',
    notes: 'صيانة دورية منتظمة'
  },
  {
    id: 'log-5',
    carId: 'car-3',
    carName: 'إلنترا (03)',
    date: '2026-08-01',
    odometer: 40000,
    itemsDescription: 'صيانة الـ 40 ألف (زيت، فلاتر، شمعات إشعال)',
    notes: 'صيانة مركز خدمة معتمد'
  }
];
