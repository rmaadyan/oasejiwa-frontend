'use client'
import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCalendarProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
    value,
    onChange,
    placeholder = "Pilih tanggal",
    className = "",
    error,
}: CustomCalendarProps) => {
    const CURRENT_YEAR = new Date().getFullYear();
    const MIN_YEAR = CURRENT_YEAR - 120; 
    const MAX_YEAR = CURRENT_YEAR;     
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const calendarRef = useRef<HTMLDivElement>(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthsShort = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    const daysShort = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const years = Array.from(
        { length: MAX_YEAR - MIN_YEAR + 1 },
        (_, i) => MAX_YEAR - i 
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentYear, currentMonth, day);
        if (date > new Date()) return;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${dayStr}`;

        onChange(formattedDate);
        setIsOpen(false);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = monthsShort[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const isSelectedDate = (day: number) => {
        if (!value) return false;
        const selectedDate = new Date(value);
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear
        );
    };

    const isToday = (day: number) => {
        if (value) return false;
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear
        );
    };

    return (
        <div ref={calendarRef} className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full max-w-xl sm:max-w-xl px-4 py-2 border rounded-md cursor-pointer
                    flex items-center justify-between
                    focus:outline-none focus:ring-1 focus:border-transparent
                    ${error 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-[#234463] focus:ring-blue-200'
                    }
                    ${className}
                `}
            >
                <span className={value ? 'text-blue-950' : 'text-gray-400'}>
                    {value ? formatDisplayDate(value) : placeholder}
                </span>
                <CalendarIcon size={20} className="text-[#234463]" />
            </div>

            {error && (
                <p className="mt-1.5 text-red-500 text-xs">
                {error}
                </p>
            )}

            {isOpen && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full sm:w-80">
                    {/* Month & Year Selectors */}
                    <div className="flex gap-2 mb-4">
                        <select
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                        >
                            {months.map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        <select
                            value={currentYear}
                            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {daysShort.map((day) => (
                                <div
                                    key={day}
                                    className="text-xs font-medium text-gray-600 py-1"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays().map((day, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => day && handleDateClick(day)}
                                    disabled={!day}
                                    className={`
                                        aspect-square flex items-center justify-center
                                        text-sm rounded-md transition-colors
                                        ${!day ? 'invisible' : ''}
                                        ${isSelectedDate(day || 0)
                                            ? 'bg-[#234463] text-white font-semibold'
                                            : isToday(day || 0)
                                            ? 'bg-blue-100 text-blue-950 font-medium' 
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }
                                        ${day ? 'cursor-pointer' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCalendar;