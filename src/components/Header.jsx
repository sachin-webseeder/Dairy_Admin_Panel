import { useState } from 'react';
import { 
  Bell, Search, ChevronDown, User, Settings, HelpCircle, LogOut 
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { notifications } from '../lib/mockData';
import { cn } from './ui/utils';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

export function Header({ onPageChange }) {
  const [notifs, setNotifs] = useState(notifications);
  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  return (
    <header className="h-16 border-b border-border bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers, menu items..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-red-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Time Display */}
        <span className="text-sm text-muted-foreground hidden sm:block bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </span>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-red-50 hover:text-red-600 transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600 border-2 border-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-red-500">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifs.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer",
                      !notification.isRead && "bg-red-50/30"
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn("mt-0.5", notificationColors[notification.type])}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-red-500 mt-1.5 ring-2 ring-white"></span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Dropdown with Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 pl-3 border-l cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-9 w-9 border border-gray-200">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-orange-500 text-white">SA</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">Super Admin</p>
                <p className="text-xs text-muted-foreground mt-1">admin@dairydash.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* ADDED PROFILE OPTION HERE */}
            <DropdownMenuItem 
              className="cursor-pointer" 
              onClick={() => onPageChange && onPageChange('profile')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => onPageChange && onPageChange('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}