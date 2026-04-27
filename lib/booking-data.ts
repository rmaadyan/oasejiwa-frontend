
//UPDATE interface DateOption, sesuaikan dengan struktur baru
export interface DateOption {
  label: string;
  value: string;    
  dayName: string;
  dayNum: string;
  month: string;
}

export const generateDates = (): DateOption[] => {
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  const dates: DateOption[] = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const value = `${year}-${month}-${day}`;

    dates.push({
      label: `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`,
      value,
      dayName: days[date.getDay()],
      dayNum: String(date.getDate()),
      month: months[date.getMonth()],
    });
  }
  return dates;
};

export interface RawSchedule {
  id: string;
  date: string;
  startTime: string;
  duration: number;
  isAvailable: boolean;
}

export const deriveUniqueDates = (schedules: RawSchedule[]): DateOption[] => {
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  const seen = new Set<string>();
  const result: DateOption[] = [];

  const sorted = [...schedules]
    .filter(s => s.isAvailable)
    .sort((a, b) => a.date.localeCompare(b.date));

  for (const sch of sorted) {
    const value = sch.date.split('T')[0];
    if (seen.has(value)) continue;
    seen.add(value);

    const d = new Date(value + 'T00:00:00');
    result.push({
      label: `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`,
      value,
      dayName: days[d.getDay()],
      dayNum: String(d.getDate()),
      month: months[d.getMonth()],
    });
  }
  return result;
};