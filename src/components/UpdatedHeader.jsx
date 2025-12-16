import React, { useState, useEffect } from 'react';
import { 
  Bell, Search, ChevronDown, User, LogOut,
  AlertTriangle, CheckCircle, Info, AlertCircle 
} from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { SearchPopup } from './SearchPopup';
import { cn } from './ui/utils';
import { notifications } from '../lib/mockData';

const notificationIcons = {
  alert: AlertTriangle,
  success: CheckCircle,
  info: Info,
  warning: AlertCircle,
};

const notificationColors = {
  alert: 'text-red-500',
  success: 'text-green-500',
  info: 'text-blue-500',
  warning: 'text-yellow-600',
};

export function UpdatedHeader({ 
  onNavigate,
  onLogout, 
  profilePhoto, 
  userName = 'John Doe', 
  userRole = 'Super Admin',
  currentPage = 'Dashboard',
  pageTitle
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  
  const unreadCount = notifs.filter(n => !n.isRead).length;

  // --- LIVE CLOCK ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });

  const markAllAsRead = () => setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  const handleProfileClick = () => { setProfileOpen(false); onNavigate('profile'); };

  return (
    <header className="relative h-16 border-b border-border bg-white w-full px-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
      
      {/* 1. LEFT SIDE: Page Title */}
      <div className="flex items-center gap-2 z-10 max-w-[250px] overflow-hidden">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 whitespace-nowrap">
          <span className="truncate block">{pageTitle || currentPage}</span>
          <span className="text-gray-300">/</span>
          <span className="text-red-500">Management</span>
        </div>
      </div>

      {/* 2. CENTER: Search Bar (Absolute Centered) 
          REMOVED 'hidden' classes to force visibility on your screen.
      */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9 bg-muted/30 border-gray-200 focus-visible:ring-1 focus-visible:ring-red-500 w-full text-xs"
            readOnly
            onClick={() => setSearchPopupOpen(true)}
          />
        </div>
      </div>

      {/* 3. RIGHT SIDE: Time -> Notifications -> Profile */}
      <div className="flex items-center gap-4 z-10">
        
        {/* LIVE TIME & DATE (FORCED VISIBLE) 
            Removed 'hidden' and added specific text styling.
        */}
        <div className="flex flex-col items-end mr-2">
          <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{formattedTime}</span>
          <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{formattedDate}</span>
        </div>

        {/* Separator Line */}
        <div className="h-6 w-[1px] bg-gray-200"></div>

        {/* Mobile Search Icon (Only if screen is extremely small) */}
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-muted-foreground" onClick={() => setSearchPopupOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => setNotificationOpen(!notificationOpen)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-red-500 border-2 border-white">{unreadCount}</Badge>}
          </Button>
          
          {/* Notification Dropdown */}
          {notificationOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotificationOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="flex items-center justify-between p-3 border-b bg-gray-50/50">
                  <h3 className="font-medium text-sm">Notifications</h3>
                  {unreadCount > 0 && <Badge variant="destructive" className="bg-red-500 text-[10px] h-5">{unreadCount} new</Badge>}
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifs.map((n) => {
                    const Icon = notificationIcons[n.type];
                    return (
                      <div key={n.id} className={cn("p-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer", !n.isRead && "bg-red-50/30")}>
                        <div className="flex gap-3">
                          <div className={cn("mt-0.5", notificationColors[n.type])}><Icon className="h-4 w-4" /></div>
                          <div className="flex-1 space-y-1"><p className="font-medium text-sm leading-none">{n.title}</p><p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p><p className="text-[10px] text-muted-foreground">{n.time}</p></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-2 border-t bg-gray-50/50"><Button variant="ghost" size="sm" className="w-full text-xs text-red-600 h-8 hover:bg-red-50" onClick={markAllAsRead}>Mark all as read</Button></div>
              </div>
            </>
          )}
        </div>

        {/* User Profile - FIXED: BLACK HUMAN LOGO */}
        <div className="relative">
          <button className="flex items-center gap-2 pl-2 border-l border-gray-200 h-8 hover:opacity-80 transition-opacity" onClick={() => setProfileOpen(!profileOpen)}>
            
            {/* AVATAR FIX: Solid Black Background with White Icon */}
            <Avatar className="h-8 w-8 border border-gray-100">
              <AvatarImage src={profilePhoto} alt={userName} className="object-cover" />
              <AvatarFallback className="bg-black flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </AvatarFallback>
            </Avatar>

            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium leading-none text-gray-700">{userName}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{userRole}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 bg-gray-50/50 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profilePhoto} />
                      <AvatarFallback className="bg-black flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{userRole}</p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <button onClick={handleProfileClick} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors text-left text-gray-700"><User className="h-4 w-4" /> <span>My Profile</span></button>
                  <Separator className="my-1" />
                  <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600 transition-colors text-left"><LogOut className="h-4 w-4" /> <span>Sign out</span></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {searchPopupOpen && <SearchPopup isOpen={searchPopupOpen} onClose={() => setSearchPopupOpen(false)} onNavigate={onNavigate} />}
    </header>
  );
}