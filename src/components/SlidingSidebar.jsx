import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, UserCog, 
  Wallet, Crown, Layout, Settings, LogOut, 
  HelpCircle, FolderOpen, BarChart3, Bell
} from 'lucide-react';
import { cn } from '../components/ui/utils';

// Single flat menu structure in your requested order
const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' }, // Public
  { icon: UserCog, label: 'User Management', id: 'user-management', permission: 'userManagement' },
  { icon: Package, label: 'Products', id: 'products', permission: 'products' },
  { icon: FolderOpen, label: 'Category', id: 'category-management', permission: 'categoryManagement' },
  { icon: ShoppingCart, label: 'Orders', id: 'orders', permission: 'orders' },
  { icon: Users, label: 'Customers', id: 'customers', permission: 'customers' },
  // Delivery Staff REMOVED
  { icon: Wallet, label: 'Wallet', id: 'wallet', permission: 'wallet' },
  { icon: Crown, label: 'Membership', id: 'membership', permission: 'membership' },
  { icon: BarChart3, label: 'Reports', id: 'reports', permission: 'reports' },
  { icon: Layout, label: 'Home Page', id: 'home-page', permission: 'homepage' },
  { icon: Bell, label: 'Push Notifications', id: 'notifications', permission: 'notifications' },
  { icon: Settings, label: 'Settings', id: 'updated-settings' }, // Public
  // Profile REMOVED (Moved to Header)
  { icon: HelpCircle, label: 'Help & Support', id: 'help-support' }, // Public
];

export function SlidingSidebar({ currentPage, onPageChange, onLogout, userRole = "Admin", currentUser }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter items based on permissions
  const filteredItems = useMemo(() => {
    const userPerms = currentUser?.permissions || [];
    const currentRole = (userRole || '').toLowerCase();
    const isAdmin = currentRole === 'admin' || currentRole === 'super admin';

    return MENU_ITEMS.filter(item => {
      // 1. If Admin/Super Admin, show EVERYTHING
      if (isAdmin) return true;

      // 2. If item has NO permission key (like Dashboard/Settings), show it to everyone
      if (!item.permission) return true;
      
      // 3. For other roles, check if permission exists
      return userPerms.includes(item.permission);
    });
  }, [currentUser, userRole]);

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-xl",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center h-20 flex-shrink-0 overflow-hidden bg-white relative">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm relative z-10">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        
        <div className={cn(
          "ml-3 flex flex-col justify-center transition-all duration-300 overflow-hidden whitespace-nowrap min-w-[150px]",
          isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
        )}>
          <span className="font-bold text-xl text-red-600">Dynasty Premium</span>
          <span className="text-xs text-gray-500 font-medium">Welcome {userRole}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar bg-white">
        <div className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-red-50 text-red-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <div className={cn(
                  "flex items-center justify-center transition-colors flex-shrink-0 w-6 h-6",
                  isActive ? "text-red-600" : "text-gray-500 group-hover:text-gray-700"
                )}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                
                <span className={cn(
                  "ml-3 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden text-left",
                  isExpanded ? "opacity-100 w-32" : "opacity-0 w-0"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-l-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto bg-white relative">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 group"
        >
          <div className="flex items-center justify-center text-gray-500 group-hover:text-red-600 flex-shrink-0 w-6 h-6">
            <LogOut size={22} strokeWidth={1.5} />
          </div>
          <span className={cn(
            "ml-3 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}