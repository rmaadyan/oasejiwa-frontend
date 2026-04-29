'use client'
import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

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
    const [yearOpen, setYearOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const calendarRef = useRef<HTMLDivElement>(null);
    const yearDropRef = useRef<HTMLDivElement>(null);

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
        (_, i) => MIN_YEAR + i
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setYearOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (yearOpen && yearDropRef.current) {
            const activeEl = yearDropRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
            if (activeEl) {
                activeEl.scrollIntoView({ block: 'center' });
            }
        }
    }, [yearOpen]);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days: (number | null)[] = [];

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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayStr = String(date.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${dayStr}`);
        setIsOpen(false);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-').map(Number);
        return `${day} ${monthsShort[month - 1]} ${year}`;
    };

    const isSelectedDate = (day: number) => {
        if (!value) return false;
        const [year, month, dayVal] = value.split('-').map(Number);
        return (
            dayVal === day &&
            month - 1 === currentMonth &&
            year === currentYear
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
                onClick={() => {
                    setIsOpen(!isOpen);
                    setYearOpen(false);
                }}
                className={`
                    w-full max-w-xl sm:max-w-xl px-4 py-2 border rounded-xl cursor-pointer
                    flex items-center justify-between
                    focus:outline-none focus:ring-1 focus:border-transparent
                    ${error 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-[#234463] focus:ring-blue-200'
                    }
                    ${className}
                `}
            >
                <span className={value ? 'text-[#234463]' : 'text-gray-400'}>
                    {value ? formatDisplayDate(value) : placeholder}
                </span>
                <CalendarIcon size={20} className="text-[#234463]" />
            </div>

            {error && (
                <p className="mt-1.5 text-red-500 text-xs">{error}</p>
            )}

            {isOpen && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full sm:w-80">

                    <div className="flex gap-2 mb-4">
                        <select
                            value={currentMonth}
                            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer"
                        >
                            {months.map((month, index) => (
                                <option key={month} value={index}>
                                    {month}
                                </option>
                            ))}
                        </select>

                        <div className="relative w-24">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setYearOpen(!yearOpen);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                                flex items-center justify-between cursor-pointer
                                hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200"
                            >
                                <span>{currentYear}</span>
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-500 transition-transform duration-150 ${yearOpen ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {yearOpen && (
                                <div
                                    ref={yearDropRef}
                                    className="absolute top-full mt-1 right-0 z-50 bg-white border border-gray-200 rounded-md overflow-y-auto w-full shadow-md"
                                    style={{ maxHeight: '168px' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {years.map((year) => (
                                        <div
                                            key={year}
                                            data-active={year === currentYear ? 'true' : 'false'}
                                            onClick={() => {
                                                setCurrentYear(year);
                                                setYearOpen(false);
                                            }}
                                            className={`
                                                px-3 py-1.5 text-sm cursor-pointer transition-colors
                                                ${year === currentYear
                                                    ? 'bg-[#234463] text-white font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }
                                            `}
                                        >
                                            {year}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Days of Week */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {daysShort.map((day) => (
                            <div key={day} className="text-xs font-medium text-gray-600 py-1">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Date Grid */}
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
                                        ? 'bg-blue-100 text-[#234463] font-medium'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }
                                `}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomCalendar;