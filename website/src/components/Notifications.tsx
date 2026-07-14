import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Briefcase, 
  BookOpen, 
  ShieldAlert, 
  Info, 
  ArrowRight, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { Notification, ViewType } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onDeleteNotification: (id: string) => void;
  setCurrentView: (view: ViewType) => void;
}

export default function NotificationsView({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onDeleteNotification,
  setCurrentView,
}: NotificationsViewProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'applications' | 'recommendations'>('all');

  // Filter logic
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'applications') return notif.type === 'application';
    if (filter === 'recommendations') return notif.type === 'recommendation';
    return true; // 'all'
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-5 h-5 text-secondary" />;
      case 'recommendation':
        return <BookOpen className="w-5 h-5 text-primary" />;
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'system':
      default:
        return <Info className="w-5 h-5 text-on-surface-variant" />;
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'application': return 'Application Update';
      case 'recommendation': return 'Recommended';
      case 'alert': return 'Profile Alert';
      case 'system': return 'System Update';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto px-5 py-8 min-h-screen">
      {/* Header Info Section */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary stroke-[2.5]" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-on-surface-variant text-sm font-semibold">
            Stay updated with your job applications, tailored course releases, and platform updates.
          </p>
        </div>

        <div className="flex gap-2 self-start sm:self-center">
          {notifications.length > 0 && (
            <>
              <button 
                onClick={onMarkAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant hover:bg-surface-container-low text-primary disabled:opacity-50 disabled:hover:bg-transparent rounded-xl font-bold text-xs transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
              <button 
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-bold text-xs transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </>
          )}
        </div>
      </section>

      {/* Tabs Filter */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-outline-variant/30 pb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white hover:bg-surface-container-low text-on-surface-variant border border-outline-variant/50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            filter === 'unread'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white hover:bg-surface-container-low text-on-surface-variant border border-outline-variant/50'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('applications')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            filter === 'applications'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white hover:bg-surface-container-low text-on-surface-variant border border-outline-variant/50'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setFilter('recommendations')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            filter === 'recommendations'
              ? 'bg-primary text-white shadow-md'
              : 'bg-white hover:bg-surface-container-low text-on-surface-variant border border-outline-variant/50'
          }`}
        >
          Courses Recommendations
        </button>
      </div>

      {/* Notifications List container */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-outline-variant/40 rounded-2xl p-10 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4 text-outline">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">No notifications found</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mb-6">
              {filter === 'unread' 
                ? "You've read all your notifications! Nice job staying up to date." 
                : "When you apply to jobs, enroll in courses, or complete milestones, updates will show up here."}
            </p>
            <button 
              onClick={() => setCurrentView('jobs')}
              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
            >
              Explore Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all duration-200 relative group flex items-start gap-4 shadow-sm ${
                notif.isRead 
                  ? 'bg-white border-outline-variant/30 hover:border-outline-variant' 
                  : 'bg-surface-container-low border-secondary/20 hover:border-secondary/40'
              }`}
            >
              {/* Unread marker bar */}
              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-2xl"></div>
              )}

              {/* Left type icon */}
              <div className={`p-3 rounded-xl shrink-0 ${
                notif.isRead ? 'bg-surface-container text-primary' : 'bg-secondary/10 text-secondary'
              }`}>
                {getIcon(notif.type)}
              </div>

              {/* Center Content */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[11px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                    notif.type === 'application' 
                      ? 'bg-secondary/15 text-secondary' 
                      : notif.type === 'recommendation' 
                      ? 'bg-primary/10 text-primary' 
                      : notif.type === 'alert' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {getTypeLabel(notif.type)}
                  </span>
                  <span className="text-[11px] text-outline font-semibold">
                    {notif.time}
                  </span>
                </div>

                <h3 className={`text-sm sm:text-base mb-1 ${notif.isRead ? 'text-primary font-bold' : 'text-primary font-extrabold'}`}>
                  {notif.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                  {notif.message}
                </p>

                {/* Direct Action Link */}
                {notif.linkToView && (
                  <button 
                    onClick={() => {
                      if (!notif.isRead) {
                        onMarkAsRead(notif.id);
                      }
                      setCurrentView(notif.linkToView!);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-secondary transition-colors"
                  >
                    Go to {notif.linkToView === 'favorites' ? 'My Applications' : notif.linkToView === 'courses' ? 'Learning Center' : notif.linkToView}
                    <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Right Action Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                {!notif.isRead && (
                  <button 
                    onClick={() => onMarkAsRead(notif.id)}
                    className="p-1.5 bg-surface-container hover:bg-secondary hover:text-white text-on-surface-variant rounded-lg transition-all"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}
                <button 
                  onClick={() => onDeleteNotification(notif.id)}
                  className="p-1.5 bg-surface-container hover:bg-red-50 hover:text-red-600 text-on-surface-variant rounded-lg transition-all"
                  title="Delete notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recommended Box */}
      <section className="mt-12 bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
            <Sparkles className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-primary">Need more specific match alerts?</h4>
            <p className="text-xs text-on-surface-variant">Update your skills, career goals, and preferred locations in the Profile settings.</p>
          </div>
        </div>
        <button 
          onClick={() => setCurrentView('settings')}
          className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-xl font-extrabold text-xs transition-all whitespace-nowrap shrink-0"
        >
          Update Settings
        </button>
      </section>
    </div>
  );
}
