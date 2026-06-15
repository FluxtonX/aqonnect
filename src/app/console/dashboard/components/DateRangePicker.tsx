'use client';

import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  label?: string;
  placeholderStart?: string;
  placeholderEnd?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label = 'Date',
  placeholderStart = 'Start time',
  placeholderEnd = 'End time'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // View state for calendar (tracks the left month)
  const [viewDate, setViewDate] = useState(() => {
    return startDate ? new Date(startDate) : new Date();
  });

  // Inputs state inside dropdown
  const [typedStartDate, setTypedStartDate] = useState('');
  const [typedStartTime, setTypedStartTime] = useState('00:00:00');
  const [typedEndDate, setTypedEndDate] = useState('');
  const [typedEndTime, setTypedEndTime] = useState('23:59:59');

  // Hover date state for drawing hover ranges
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Sync inputs with selected dates
  useEffect(() => {
    if (startDate) {
      setTypedStartDate(formatDate(startDate));
      setTypedStartTime(formatTime(startDate));
    } else {
      setTypedStartDate('');
      setTypedStartTime('00:00:00');
    }

    if (endDate) {
      setTypedEndDate(formatDate(endDate));
      setTypedEndTime(formatTime(endDate));
    } else {
      setTypedEndDate('');
      setTypedEndTime('23:59:59');
    }
  }, [startDate, endDate]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Utility to format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Utility to format time as HH:MM:SS
  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Display trigger string formatting
  const getDisplayString = () => {
    if (!startDate && !endDate) return '';
    const startStr = startDate ? `${formatDate(startDate)} ${formatTime(startDate).substring(0, 5)}` : placeholderStart;
    const endStr = endDate ? `${formatDate(endDate)} ${formatTime(endDate).substring(0, 5)}` : placeholderEnd;
    return { startStr, endStr };
  };

  const displays = getDisplayString();

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setViewDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const handleNextYear = () => {
    setViewDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateMonthDays = (year: number, month: number) => {
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0
    const totalDays = getDaysInMonth(year, month);

    // Prev month padding days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthTotalDays = getDaysInMonth(prevYear, prevMonth);
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, prevMonthTotalDays - i),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Next month padding days to complete 6 weeks (42 days)
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextYear, nextMonth, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const leftMonth = viewDate.getMonth();
  const leftYear = viewDate.getFullYear();
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  const leftDays = generateMonthDays(leftYear, leftMonth);
  const rightDays = generateMonthDays(rightYear, rightMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day click logic
  const handleDayClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Set start date and clear end date
      const startDateTime = new Date(date);
      const [h, m, s] = typedStartTime.split(':').map(Number);
      startDateTime.setHours(h || 0, m || 0, s || 0);
      onChange(startDateTime, null);
    } else {
      // Set end date
      if (date < startDate) {
        // Selected date is earlier, make it start date
        const startDateTime = new Date(date);
        const [h, m, s] = typedStartTime.split(':').map(Number);
        startDateTime.setHours(h || 0, m || 0, s || 0);
        onChange(startDateTime, null);
      } else {
        const endDateTime = new Date(date);
        const [h, m, s] = typedEndTime.split(':').map(Number);
        endDateTime.setHours(h || 23, m || 59, s || 59);
        onChange(startDate, endDateTime);
      }
    }
  };

  // Check if date is selected
  const isStartDate = (date: Date) => {
    return startDate && formatDate(startDate) === formatDate(date);
  };

  const isEndDate = (date: Date) => {
    return endDate && formatDate(endDate) === formatDate(date);
  };

  // Check if date is in range
  const isInRange = (date: Date) => {
    if (startDate && endDate) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
      const e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
      return d > s && d < e;
    }
    if (startDate && hoverDate && !endDate) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
      const h = new Date(hoverDate.getFullYear(), hoverDate.getMonth(), hoverDate.getDate()).getTime();
      if (h > s) {
        return d > s && d < h;
      }
    }
    return false;
  };

  // Apply inputs manual edits
  const handleOk = () => {
    let finalStart = startDate;
    let finalEnd = endDate;

    if (typedStartDate) {
      const [y, m, d] = typedStartDate.split('-').map(Number);
      const [hr, min, sec] = typedStartTime.split(':').map(Number);
      finalStart = new Date(y, m - 1, d, hr || 0, min || 0, sec || 0);
    } else {
      finalStart = null;
    }

    if (typedEndDate) {
      const [y, m, d] = typedEndDate.split('-').map(Number);
      const [hr, min, sec] = typedEndTime.split(':').map(Number);
      finalEnd = new Date(y, m - 1, d, hr || 23, min || 59, sec || 59);
    } else {
      finalEnd = null;
    }

    onChange(finalStart, finalEnd);
    setIsOpen(false);
  };

  // Clear selections
  const handleClear = () => {
    onChange(null, null);
    setTypedStartDate('');
    setTypedStartTime('00:00:00');
    setTypedEndDate('');
    setTypedEndTime('23:59:59');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input trigger element styling */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center border border-gray-200 rounded-xl px-3.5 py-1.5 bg-white cursor-pointer hover:border-gray-300 transition-all select-none h-[38px] min-w-[280px]"
      >
        <span className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        
        <svg className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>

        <div className="flex items-center text-xs font-semibold text-gray-700 w-full">
          {displays ? (
            <>
              <span className="flex-1 text-left">{displays.startStr}</span>
              <span className="text-gray-400 text-[10px] px-2 font-bold shrink-0">to</span>
              <span className="flex-1 text-left">{displays.endStr}</span>
            </>
          ) : (
            <span className="text-gray-400 font-medium">Select time range</span>
          )}
        </div>
      </div>

      {/* Calendar Double Dropdown Card */}
      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white rounded-3xl border border-gray-150 shadow-2xl z-55 p-6 space-y-5 flex flex-col w-[600px] animate-in fade-in slide-in-from-top-1 duration-200">
          
          {/* Top Row Manual Inputs (matching eSimAccess layout) */}
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={typedStartDate}
                onChange={e => setTypedStartDate(e.target.value)}
                placeholder="Start Date"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-white"
              />
              <input
                type="text"
                value={typedStartTime}
                onChange={e => setTypedStartTime(e.target.value)}
                placeholder="Start Time"
                className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-center focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>
            
            <span className="text-gray-400 text-xs font-semibold px-1">&gt;</span>

            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={typedEndDate}
                onChange={e => setTypedEndDate(e.target.value)}
                placeholder="End Date"
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-indigo-500 bg-white"
              />
              <input
                type="text"
                value={typedEndTime}
                onChange={e => setTypedEndTime(e.target.value)}
                placeholder="End Time"
                className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-center focus:outline-none focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Double Calendar Grid */}
          <div className="grid grid-cols-2 gap-8 text-xs font-semibold text-gray-800">
            
            {/* Left Calendar (View Date Month) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button type="button" onClick={handlePrevYear} className="p-1 hover:bg-gray-50 rounded text-gray-400 cursor-pointer font-bold select-none">&lt;&lt;</button>
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-50 rounded text-gray-400 cursor-pointer font-bold select-none">&lt;</button>
                </div>
                <span className="font-bold text-gray-900">{leftYear} {monthNames[leftMonth]}</span>
                <span className="w-12" /> {/* alignment spacer */}
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
                  <span key={w} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none py-1">{w}</span>
                ))}
                
                {leftDays.map((d, i) => {
                  const isStart = isStartDate(d.date);
                  const isEnd = isEndDate(d.date);
                  const inRange = isInRange(d.date);
                  
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleDayClick(d.date)}
                      onMouseEnter={() => startDate && !endDate && setHoverDate(d.date)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center text-xs font-bold transition-all relative select-none cursor-pointer
                        ${d.isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                        ${isStart || isEnd ? 'bg-blue-600 text-white rounded-full z-10 shadow-sm' : ''}
                        ${inRange && !(isStart || isEnd) ? 'bg-blue-50/70 text-blue-700 rounded-full' : ''}
                        ${!isStart && !isEnd && !inRange ? 'hover:bg-gray-50 rounded-full' : ''}
                      `}
                    >
                      {d.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Calendar (View Date Month + 1) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12" /> {/* alignment spacer */}
                <span className="font-bold text-gray-900">{rightYear} {monthNames[rightMonth]}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-50 rounded text-gray-400 cursor-pointer font-bold select-none">&gt;</button>
                  <button type="button" onClick={handleNextYear} className="p-1 hover:bg-gray-50 rounded text-gray-400 cursor-pointer font-bold select-none">&gt;&gt;</button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
                  <span key={w} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none py-1">{w}</span>
                ))}
                
                {rightDays.map((d, i) => {
                  const isStart = isStartDate(d.date);
                  const isEnd = isEndDate(d.date);
                  const inRange = isInRange(d.date);

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleDayClick(d.date)}
                      onMouseEnter={() => startDate && !endDate && setHoverDate(d.date)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center text-xs font-bold transition-all relative select-none cursor-pointer
                        ${d.isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}
                        ${isStart || isEnd ? 'bg-blue-600 text-white rounded-full z-10 shadow-sm' : ''}
                        ${inRange && !(isStart || isEnd) ? 'bg-blue-50/70 text-blue-700 rounded-full' : ''}
                        ${!isStart && !isEnd && !inRange ? 'hover:bg-gray-50 rounded-full' : ''}
                      `}
                    >
                      {d.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-50 pt-4 text-xs font-bold">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-1.5 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleOk}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              OK
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
