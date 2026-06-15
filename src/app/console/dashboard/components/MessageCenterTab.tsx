'use client';

import { useState, useEffect } from 'react';

export interface NotificationItem {
  id: number;
  type: 'PROMO' | 'UPDATE' | 'NOTICE';
  title: string;
  summary: string;
  date: string;
  read: boolean;
  link: string;
  isPinned?: boolean;
}

interface MessageCenterTabProps {
  notificationsList: NotificationItem[];
  setNotificationsList: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

export default function MessageCenterTab({ notificationsList, setNotificationsList }: MessageCenterTabProps) {
  // State for active tab: 'unread' or 'read'
  const [activeSubTab, setActiveSubTab] = useState<'unread' | 'read'>('unread');

  // Filter States
  const [keyword, setKeyword] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Search Action States (applied filters)
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedDateRange, setAppliedDateRange] = useState('All');
  const [appliedType, setAppliedType] = useState('All');

  // Expand/Shrink state for descriptions in the list
  const [isExpandedAll, setIsExpandedAll] = useState(true);

  // Selected notification for the detail drawer
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handle Search action
  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setAppliedDateRange(selectedDateRange);
    setAppliedType(selectedType);
  };

  // Handle Reset action
  const handleReset = () => {
    setKeyword('');
    setSelectedDateRange('All');
    setSelectedType('All');
    setAppliedKeyword('');
    setAppliedDateRange('All');
    setAppliedType('All');
  };

  // Click notification to open drawer and mark as read
  const handleOpenNotification = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);

    if (!notification.read) {
      // Mark as read in state
      setNotificationsList(prevList =>
        prevList.map(item =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      );
    }
  };

  // Date filtering logic helper
  const isWithinDateRange = (itemDateStr: string, range: string) => {
    if (range === 'All') return true;
    const itemDate = new Date(itemDateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (range === '7days') return diffDays <= 7;
    if (range === '30days') return diffDays <= 30;
    if (range === '90days') return diffDays <= 90;
    return true;
  };

  // Filter the list of notifications
  const displayedNotifications = notificationsList.filter(item => {
    // 1. Tab match
    const isTabMatch = activeSubTab === 'unread' ? !item.read : item.read;
    if (!isTabMatch) return false;

    // 2. Keyword match
    if (appliedKeyword) {
      const kw = appliedKeyword.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(kw);
      const matchSummary = item.summary.toLowerCase().includes(kw);
      if (!matchTitle && !matchSummary) return false;
    }

    // 3. Date Range match
    if (!isWithinDateRange(item.date, appliedDateRange)) return false;

    // 4. Type match
    if (appliedType !== 'All' && item.type !== appliedType) return false;

    return true;
  });

  const unreadCount = notificationsList.filter(item => !item.read).length;

  return (
    <div className="space-y-6 relative overflow-hidden animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Message center</h1>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-gray-100 flex gap-6">
        <button
          onClick={() => setActiveSubTab('unread')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'unread'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Unread({unreadCount})
        </button>
        <button
          onClick={() => setActiveSubTab('read')}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'read'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Read
        </button>
      </div>

      {/* Filters & Actions Panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Keyword */}
          <div className="min-w-[180px]">
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Keyword"
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
            />
          </div>

          {/* Publication Date dropdown */}
          <div>
            <select
              value={selectedDateRange}
              onChange={e => setSelectedDateRange(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
            >
              <option value="All">Publication date</option>
              <option value="7days">Past 7 days</option>
              <option value="30days">Past 30 days</option>
              <option value="90days">Past 90 days</option>
            </select>
          </div>

          {/* Type dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
            >
              <option value="All">Type</option>
              <option value="PROMO">PROMO</option>
              <option value="UPDATE">UPDATE</option>
              <option value="NOTICE">NOTICE</option>
            </select>
          </div>

          {/* Buttons */}
          <button
            onClick={handleSearch}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Shrink / Expand Toggle */}
        <button
          onClick={() => setIsExpandedAll(!isExpandedAll)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1 self-end md:self-center"
        >
          {isExpandedAll ? (
            <>
              Shrink
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Expand
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Messages List Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {displayedNotifications.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-medium">No Data</div>
        ) : (
          <div className="space-y-6">
            {displayedNotifications.map((item, index) => {
              const isNotice = item.type === 'NOTICE';
              // Check if we should display summary for this list item
              // NOTICE type or simple whitepaper items don't have summaries in list view
              const hasSummaryToShow = !isNotice && isExpandedAll;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-start pb-6 ${
                    index < displayedNotifications.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5 w-full">
                    {/* Badge / Pinned icon */}
                    {!isNotice && (
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider ${
                          item.type === 'PROMO'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.type}
                      </span>
                    )}

                    {item.isPinned && (
                      <span className="text-red-500 text-sm mt-[-2px]" title="Pinned Announcement">
                        📌
                      </span>
                    )}

                    {/* Notification Title */}
                    <h3
                      onClick={() => handleOpenNotification(item)}
                      className="text-sm font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors leading-snug flex-1"
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Body description (shown conditionally based on type and expand state) */}
                  {hasSummaryToShow && (
                    <p className="text-xs text-gray-500 mt-2 pl-0 leading-relaxed font-normal max-w-5xl">
                      {item.summary}
                    </p>
                  )}

                  {/* Date */}
                  <span className="text-[11px] text-gray-400 font-medium mt-2 block">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer (Total and Pagination) */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold select-none">
          <span>{displayedNotifications.length} Total</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold shadow-sm text-[11px]">
              1
            </span>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Details Drawer (Slide-out Overlay from Right) */}
      {isDrawerOpen && selectedNotification && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 border-l border-gray-100">
            {/* Top Area */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Notification details</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Notification Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {selectedNotification.type !== 'NOTICE' ? (
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider ${
                        selectedNotification.type === 'PROMO'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {selectedNotification.type}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider bg-gray-100 text-gray-700">
                      NOTICE
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {selectedNotification.title}
                </h3>

                <p className="text-[11px] text-gray-400 font-medium">
                  {selectedNotification.date}
                </p>
              </div>

              {/* Notification Body Content */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  {selectedNotification.summary}
                </p>

                {selectedNotification.type === 'NOTICE' && (
                  <p className="text-sm text-gray-600 leading-relaxed font-normal">
                    This notification introduces new features and resources for your partner dashboard integrations. Reach out to developer support for assistance.
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <a
                href={selectedNotification.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors hover:underline"
              >
                View details
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
