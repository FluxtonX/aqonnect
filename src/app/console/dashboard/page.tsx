'use client';

import { useState } from 'react';
import Link from 'next/link';

// Component Imports
import DashboardTab from './components/DashboardTab';
import ESimPlansTab from './components/ESimPlansTab';
import MyESimTab from './components/MyESimTab';
import MyOrderTab from './components/MyOrderTab';
import BillingTab from './components/BillingTab';
import TopUpModal from './components/TopUpModal';
import PaymentHistoryModal from './components/PaymentHistoryModal';
import BrandPreferencesTab from './components/BrandPreferencesTab';
import PaymentSettingsTab from './components/PaymentSettingsTab';
import TeamMembersTab from './components/TeamMembersTab';
import MessageCenterTab from './components/MessageCenterTab';
import DeveloperTab from './components/DeveloperTab';
import UserProfileTab from './components/UserProfileTab';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showChecklist, setShowChecklist] = useState(true);
  const [balance, setBalance] = useState(150.00); // Starting sandbox balance

  // Modal visibility states (controlled here to allow header buttons to launch modals)
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [autoRecharge, setAutoRecharge] = useState(false);

  // Dropdown toggles
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [dropdownSubTab, setDropdownSubTab] = useState<'unread' | 'read'>('unread');

  // Lifted notifications list state
  const [notificationsList, setNotificationsList] = useState<any[]>([
    {
      id: 1,
      type: 'PROMO',
      title: '⛱️🍹🌴🐾🌊🛹🥥🛶🍿 「Summer Mega Sale」: Up to 30% OFF All European Plans! (5.22 - 6.30)',
      summary: 'Summer travel is booming! To help you capture peak season traffic and skyrocket your eSIM business, we are launching our Summer Mega Sale with massive price drops across Europe!',
      date: '2026-05-28 08:09:52',
      read: false,
      link: 'https://aqonnect.com/promo/summer-mega-sale'
    },
    {
      id: 2,
      type: 'UPDATE',
      title: 'Monitor our real-time API status',
      summary: "Track our API availability in real time. We've launched a live monitoring website where you can instantly check our API system status, response times, and ongoing maintenance. Click below to view the live dashboard.",
      date: '2026-05-28 08:07:55',
      read: false,
      link: 'https://status.aqonnect.com'
    },
    {
      id: 3,
      type: 'UPDATE',
      title: 'Boost Unlimited FUP Plan Sales with Top-Up Feature',
      summary: "We're excited to introduce a major upgrade to our Unlimited (Daily / Daypass) eSIM products: Top-Up Function is now available for all Daily Plans(covering 1000+ SKUs across 170+ global regions)Now you can extend plan validity days anytime via top-up, without changing the daily high-speed data allowance.",
      date: '2026-05-28 08:00:58',
      read: false,
      link: 'https://aqonnect.com/blog/unlimited-fup-top-up'
    },
    {
      id: 4,
      type: 'NOTICE',
      title: 'Travel eSIM Whitepaper',
      summary: 'Download our comprehensive Travel eSIM Whitepaper to gain insights into global market trends, consumer preferences, and growth opportunities in the eSIM ecosystem. Leverage our research to build a successful roadmap.',
      date: '2026-05-22 12:37:20',
      read: false,
      link: 'https://aqonnect.com/resources/whitepaper-2026'
    },
    {
      id: 5,
      type: 'NOTICE',
      title: 'A Letter for New Partners: Tier Pricing & Brief Intro',
      summary: 'Welcome to the AQonnect Partner Network! We are thrilled to partner with you. In this letter, we outline our tier pricing structures, custom customization capabilities, API integrations, and how to scale your business with our global networks.',
      date: '2026-05-22 12:37:20',
      read: false,
      link: 'https://aqonnect.com/docs/new-partner-guide',
      isPinned: true
    },
    {
      id: 6,
      type: 'UPDATE',
      title: '⚽️ 🥅 Live FIFA SKUs: US 100GB $69.9 / CA 75GB $29 at eSIM Access.',
      summary: '⚽️ Game On! True Local US/CA IPs, Good Rates, Zero Lag, Dominate 2026 FIFA Traffic! May the best team win.',
      date: '2026-06-02 20:20:00',
      read: true,
      link: 'https://aqonnect.com/news/fifa-2026-skus'
    },
    {
      id: 7,
      type: 'PROMO',
      title: '🎰 🌏 2026 World Cup Traffic Season: Rates Optimization & Network Expansion',
      summary: 'At eSIM Access, we continuously improve user experience through pricing optimization, network upgrades, and product enhancements across global destinations. ⚡️ Activation within seconds 📊 Always-on backup network ✔️ Zero-friction installation 🛠️ 24/7 support 🤖 Auto-APN self-service 🌍 Seamless travel continuity + top-up support.',
      date: '2026-05-28 07:58:58',
      read: true,
      link: 'https://aqonnect.com/news/world-cup-expansion'
    }
  ]);

  const unreadNotificationsCount = notificationsList.filter(item => !item.read).length;

  // Purchase/Order/Billing History client-side states
  const [orders, setOrders] = useState<any[]>([]);
  const [esims, setEsims] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

  // Cart & Favorites
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [checkoutMessage, setCheckoutMessage] = useState('');

  // Dummy statistics
  const [stats, setStats] = useState({
    totalOrdersAmount: 0.00,
    totalOrdersCount: 0,
    totalOrdersCancelled: 0,
    activatedOrdersAmount: 0.00,
    activatedOrdersCount: 0,
    baseOrdersAmount: 0.00,
    baseOrdersCount: 0,
    topupOrdersAmount: 0.00,
    topupOrdersCount: 0,
  });

  const sidebarItems = [
    { name: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { name: 'eSIM Plans', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { name: 'My eSIM', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'My Order', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Brand & Preferences', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { name: 'Payment Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { name: 'Team Members', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Message Center', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { name: 'Developer', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { name: 'User Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 hidden md:flex shadow-sm">
        <div className="py-6">
          {/* Logo */}
          <div className="px-6 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">AQ</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              AQonnect <span className="text-amber-500 font-semibold">Console</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 px-3">
            {sidebarItems.map(item => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setCheckoutMessage('');
                  }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer
                      ${isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              DF
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-gray-800 truncate">Developer Fluxtonx</p>
              <p className="text-xs text-gray-500 truncate">developer.fluxtonx@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">AQ</span>
            </div>
            <span className="text-sm font-bold tracking-tight">AQonnect</span>
          </div>

          <div className="hidden md:block text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-gray-850">Developer Fluxtonx</span>!
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-6">
            {/* Clickable Balance (Redirects to Billing) */}
            <div
              onClick={() => setActiveTab('Billing')}
              className="text-right cursor-pointer hover:opacity-80 transition-opacity select-none"
            >
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Balance</p>
              <p className="text-sm font-bold text-indigo-600">${balance.toFixed(2)}</p>
            </div>

            {/* Bell Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationsDropdown(!showNotificationsDropdown);
                  setShowUserDropdown(false);
                }}
                className="relative p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotificationsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 text-xs space-y-4 animate-in fade-in slide-in-from-top-1">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDropdownSubTab('unread')}
                        className={`pb-1 font-bold ${
                          dropdownSubTab === 'unread'
                            ? 'text-indigo-600 border-b border-indigo-600'
                            : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        Unread({unreadNotificationsCount})
                      </button>
                      <button
                        onClick={() => setDropdownSubTab('read')}
                        className={`pb-1 font-bold ${
                          dropdownSubTab === 'read'
                            ? 'text-indigo-600 border-b border-indigo-600'
                            : 'text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        Read
                      </button>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={() => {
                          setNotificationsList(prev => prev.map(item => ({ ...item, read: true })));
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-[10px] select-none transition-all active:scale-95 cursor-pointer"
                      >
                        All as read
                      </button>
                    )}
                  </div>

                  {/* Dropdown List */}
                  <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-gray-50">
                    {notificationsList
                      .filter(item => (dropdownSubTab === 'unread' ? !item.read : item.read))
                      .slice(0, 3)
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
                            setActiveTab('Message Center');
                            setShowNotificationsDropdown(false);
                          }}
                          className="pt-2.5 first:pt-0 cursor-pointer hover:bg-gray-50/50 p-1 rounded transition-colors text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            {item.type !== 'NOTICE' && (
                              <span
                                className={`px-1.5 py-0.2 text-[8px] font-bold uppercase rounded ${
                                  item.type === 'PROMO'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {item.type}
                              </span>
                            )}
                            <h4 className="font-bold text-gray-900 truncate flex-1">{item.title}</h4>
                          </div>
                          {item.type !== 'NOTICE' && (
                            <p className="text-gray-505 mt-1 line-clamp-2 leading-relaxed text-[11px] font-normal text-gray-500">
                              {item.summary}
                            </p>
                          )}
                          <span className="text-[10px] text-gray-400 font-medium mt-1.5 block">{item.date}</span>
                        </div>
                      ))}

                    {notificationsList.filter(item => (dropdownSubTab === 'unread' ? !item.read : item.read)).length === 0 && (
                      <div className="py-6 text-center text-gray-400 font-medium">No Data</div>
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-semibold select-none">
                    <span>
                      {unreadNotificationsCount} unread · {notificationsList.filter(item => item.read).length} read
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('Message Center');
                        setShowNotificationsDropdown(false);
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clickable Profile details with Logout */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserDropdown(!showUserDropdown);
                  setShowNotificationsDropdown(false);
                }}
                className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-xl transition-all cursor-pointer select-none text-left active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  DF
                </div>
                <div className="hidden sm:block">
                  <p className="text-[11px] font-semibold text-gray-800 leading-tight">Developer Fluxtonx</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-none">developer.fluxtonx@gmail.com</p>
                </div>
              </button>

              {/* Log out Dropdown popup */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-55 animate-in fade-in slide-in-from-top-1 text-center">
                  <button
                    onClick={() => {
                      window.location.href = '/console/login';
                    }}
                    className="w-full text-center px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600 cursor-pointer transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Work Area */}
        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          {checkoutMessage && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
              {checkoutMessage}
            </div>
          )}

          {activeTab === 'Dashboard' ? (
            <DashboardTab
              balance={balance}
              stats={stats}
              showChecklist={showChecklist}
              setShowChecklist={setShowChecklist}
              esims={esims}
              setActiveTab={setActiveTab}
            />
          ) : activeTab === 'eSIM Plans' ? (
            <ESimPlansTab
              balance={balance}
              setBalance={setBalance}
              cart={cart}
              setCart={setCart}
              favorites={favorites}
              setFavorites={setFavorites}
              setOrders={setOrders}
              setEsims={setEsims}
              setTransactions={setTransactions}
              setStats={setStats}
              setCheckoutMessage={setCheckoutMessage}
            />
          ) : activeTab === 'My eSIM' ? (
            <MyESimTab esims={esims} />
          ) : activeTab === 'My Order' ? (
            <MyOrderTab orders={orders} />
          ) : activeTab === 'Billing' ? (
            <BillingTab
              balance={balance}
              transactions={transactions}
              payouts={payouts}
              setShowTopUpModal={setShowTopUpModal}
              setShowPaymentHistoryModal={setShowPaymentHistoryModal}
              autoRecharge={autoRecharge}
              setAutoRecharge={setAutoRecharge}
              setCheckoutMessage={setCheckoutMessage}
            />
          ) : activeTab === 'Brand & Preferences' ? (
            <BrandPreferencesTab />
          ) : activeTab === 'Payment Settings' ? (
            <PaymentSettingsTab
              balance={balance}
              setBalance={setBalance}
              setCheckoutMessage={setCheckoutMessage}
            />
          ) : activeTab === 'Team Members' ? (
            <TeamMembersTab setCheckoutMessage={setCheckoutMessage} />
          ) : activeTab === 'Message Center' ? (
            <MessageCenterTab
              notificationsList={notificationsList}
              setNotificationsList={setNotificationsList}
            />
          ) : activeTab === 'Developer' ? (
            <DeveloperTab />
          ) : activeTab === 'User Profile' ? (
            <UserProfileTab />
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-4">
              <svg className="w-16 h-16 text-indigo-100 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-base font-bold text-gray-950">{activeTab} Section</h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                This console section is currently under development. Please check back later.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Top up Modal Overlay */}
      {showTopUpModal && (
        <TopUpModal
          balance={balance}
          setBalance={setBalance}
          setTransactions={setTransactions}
          setPayouts={setPayouts}
          setShowTopUpModal={setShowTopUpModal}
          setCheckoutMessage={setCheckoutMessage}
        />
      )}

      {/* Payment History Modal Overlay */}
      {showPaymentHistoryModal && (
        <PaymentHistoryModal
          payouts={payouts}
          setShowPaymentHistoryModal={setShowPaymentHistoryModal}
        />
      )}
    </div>
  );
}
