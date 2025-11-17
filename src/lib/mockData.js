// ==================== BRANCHES ====================
export const branches = [
  { id: '1', name: 'Koramangala Branch', location: 'Bengaluru, Karnataka', manager: 'Karthik Menon', orders: 430, revenue: 120000, status: 'active', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', address: '80 Feet Road, Koramangala', contactNumber: '+91 98765 43210', adminEmail: 'koramangala@dairydynasty.com', openingHours: '06:00 - 22:00', seatingCapacity: 50 },
  { id: '2', name: 'Andheri West Branch', location: 'Mumbai, Maharashtra', manager: 'Priya Sharma', orders: 320, revenue: 95000, status: 'active', city: 'Mumbai', state: 'Maharashtra', pincode: '400058', address: 'S.V. Road, Andheri West', contactNumber: '+91 98765 43211', adminEmail: 'andheri@dairydynasty.com', openingHours: '06:00 - 22:00', seatingCapacity: 40 },
  { id: '3', name: 'Sector 29 Branch', location: 'Gurugram, Haryana', manager: 'Vijay Reddy', orders: 280, revenue: 78000, status: 'inactive', city: 'Gurugram', state: 'Haryana', pincode: '122001', address: 'Leisure Valley Road, Sector 29', contactNumber: '+91 98765 43212', adminEmail: 'sector29@dairydynasty.com', openingHours: '06:00 - 22:00', seatingCapacity: 45 },
  { id: '4', name: 'T. Nagar Branch', location: 'Chennai, Tamil Nadu', manager: 'Divya Nair', orders: 410, revenue: 110000, status: 'active', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017', address: 'Usman Road, T. Nagar', contactNumber: '+91 98765 43213', adminEmail: 'tnagar@dairydynasty.com', openingHours: '06:00 - 22:00', seatingCapacity: 35 },
];

// ==================== PRODUCTS ====================
export const products = [
  { id: '1', name: 'Full Cream Milk', category: 'Milk', price: 65, stock: 120, unit: '1kg', image: 'https://images.unsplash.com/photo-1745256698394-867c94a3a0b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlJTIwZGFpcnl8ZW58MXx8fHwxNzU5ODMzNzQyfDA&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Koramangala Branch' },
  { id: '2', name: 'Toned Milk', category: 'Milk', price: 55, stock: 95, unit: '1kg', image: 'https://images.unsplash.com/photo-1745256698394-867c94a3a0b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlJTIwZGFpcnl8ZW58MXx8fHwxNzU5ODMzNzQyfDA&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Andheri West Branch' },
  { id: '3', name: 'Paneer', category: 'Dairy', price: 180, stock: 45, unit: '250gm', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBpbmRpYW4lMjBjaGVlc2V8ZW58MXx8fHwxNzU5OTQzODM2fDA&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Koramangala Branch' },
  { id: '4', name: 'Fresh Curd', category: 'Dairy', price: 45, stock: 80, unit: '500gm', image: 'https://images.unsplash.com/photo-1633383718081-22ac93e3db65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJkJTIweW9ndXJ0JTIwYm93bHxlbnwxfHx8fDE3NTk5NDM4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', branch: 'T. Nagar Branch' },
  { id: '5', name: 'Butter', category: 'Dairy', price: 95, stock: 15, unit: '200gm', image: 'https://images.unsplash.com/photo-1709177068446-d5c0f6d25c48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBkYWlyeSUyMGZyZXNofGVufDF8fHx8MTc1OTk0MzgzN3ww&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Sector 29 Branch' },
  { id: '6', name: 'Ghee', category: 'Dairy', price: 550, stock: 30, unit: '500gm', image: 'https://images.unsplash.com/photo-1573812461383-e5f8b759d12e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGVlJTIwY2xhcmlmaWVkJTIwYnV0dGVyfGVufDF8fHx8MTc1OTk0MzIyM3ww&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Koramangala Branch' },
  { id: '7', name: 'Cheese Slices', category: 'Dairy', price: 140, stock: 60, unit: '200gm', image: 'https://images.unsplash.com/photo-1723473620176-8d26dc6314cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjBzbGljZXMlMjBkYWlyeXxlbnwxfHx8fDE3NTk5NDM4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Andheri West Branch' },
  { id: '8', name: 'Lassi', category: 'Beverages', price: 35, stock: 70, unit: '250gm', image: 'https://images.unsplash.com/photo-1637958427185-25a2c0e58419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXNzaSUyMGRyaW5rJTIwaW5kaWFufGVufDF8fHx8MTc1OTk0MzgzOHww&ixlib=rb-4.1.0&q=80&w=1080', branch: 'T. Nagar Branch' },
  { id: '9', name: 'Flavored Milk', category: 'Beverages', price: 40, stock: 0, unit: '200gm', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwYm90dGxlfGVufDB8fHx8MTczMDE5MDQ4MHww&ixlib=rb-4.1.0&q=80&w=1080', branch: 'Andheri West Branch' },
];

// ==================== CUSTOMERS ====================
export const customers = [
  { id: '1', name: 'Rajesh Kumar', email: 'rajesh.k@email.com', phone: '+91 98765 43210', totalOrders: 24, totalSpent: 8950, joinDate: '2025-05-15', status: 'active', branch: 'Koramangala Branch', customerType: 'returning', lastOrderDate: '2025-10-28', membership: 'Silver' },
  { id: '2', name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+91 98765 43211', totalOrders: 18, totalSpent: 6780, joinDate: '2025-06-22', status: 'active', branch: 'Andheri West Branch', customerType: 'returning', lastOrderDate: '2025-10-28', membership: 'Silver' },
  { id: '3', name: 'Amit Patel', email: 'amit.p@email.com', phone: '+91 98765 43212', totalOrders: 32, totalSpent: 12450, joinDate: '2025-04-10', status: 'active', branch: 'T. Nagar Branch', customerType: 'high-value', lastOrderDate: '2025-10-28', membership: 'Gold' },
  { id: '4', name: 'Neha Singh', email: 'neha.s@email.com', phone: '+91 98765 43213', totalOrders: 15, totalSpent: 5340, joinDate: '2025-07-05', status: 'active', branch: 'Koramangala Branch', customerType: 'returning', lastOrderDate: '2025-10-27', membership: 'Silver' },
  { id: '5', name: 'Vijay Reddy', email: 'vijay.r@email.com', phone: '+91 98765 43214', totalOrders: 28, totalSpent: 10230, joinDate: '2025-05-28', status: 'active', branch: 'Sector 29 Branch', customerType: 'high-value', lastOrderDate: '2025-10-27', membership: 'Gold' },
  { id: '6', name: 'Sanjana Gupta', email: 'sanjana.g@email.com', phone: '+91 98765 43215', totalOrders: 3, totalSpent: 890, joinDate: '2025-09-20', status: 'active', branch: 'Andheri West Branch', customerType: 'new', lastOrderDate: '2025-10-26', membership: 'Bronze' },
  { id: '7', name: 'Rahul Mehta', email: 'rahul.m@email.com', phone: '+91 98765 43216', totalOrders: 42, totalSpent: 15670, joinDate: '2025-03-12', status: 'active', branch: 'T. Nagar Branch', customerType: 'high-value', lastOrderDate: '2025-10-25', membership: 'Gold' },
  { id: '8', name: 'Karthik Menon', email: 'karthik.m@email.com', phone: '+91 98765 43217', totalOrders: 21, totalSpent: 7890, joinDate: '2025-06-18', status: 'active', branch: 'Koramangala Branch', customerType: 'returning', lastOrderDate: '2025-10-24', membership: 'Silver' },
];

// ==================== ORDERS (7 Total) ====================
export const orders = [
  { 
    id: 'ORD-1234', 
    customerName: 'Rajesh Kumar', 
    items: 5, 
    total: 425, 
    status: 'completed', 
    date: '2025-10-28', 
    branch: 'Koramangala Branch', 
    payment: 'UPI',
    products: [
      { productId: '1', productName: 'Full Cream Milk', quantity: 2, price: 65 },
      { productId: '3', productName: 'Paneer', quantity: 1, price: 180 },
      { productId: '4', productName: 'Fresh Curd', quantity: 2, price: 45 }
    ]
  },
  { 
    id: 'ORD-1235', 
    customerName: 'Priya Sharma', 
    items: 3, 
    total: 285, 
    status: 'completed', 
    date: '2025-10-28', 
    branch: 'Andheri West Branch', 
    payment: 'Card',
    products: [
      { productId: '2', productName: 'Toned Milk', quantity: 2, price: 55 },
      { productId: '7', productName: 'Cheese Slices', quantity: 1, price: 140 },
      { productId: '8', productName: 'Lassi', quantity: 1, price: 35 }
    ]
  },
  { 
    id: 'ORD-1236', 
    customerName: 'Amit Patel', 
    items: 7, 
    total: 670, 
    status: 'pending', 
    date: '2025-10-28', 
    branch: 'T. Nagar Branch', 
    payment: 'Cash',
    products: [
      { productId: '4', productName: 'Fresh Curd', quantity: 3, price: 45 },
      { productId: '8', productName: 'Lassi', quantity: 4, price: 35 }
    ]
  },
  { 
    id: 'ORD-1237', 
    customerName: 'Neha Singh', 
    items: 2, 
    total: 190, 
    status: 'completed', 
    date: '2025-10-27', 
    branch: 'Koramangala Branch', 
    payment: 'UPI',
    products: [
      { productId: '5', productName: 'Butter', quantity: 2, price: 95 }
    ]
  },
  { 
    id: 'ORD-1238', 
    customerName: 'Vijay Reddy', 
    items: 4, 
    total: 380, 
    status: 'pending', 
    date: '2025-10-27', 
    branch: 'Sector 29 Branch', 
    payment: 'Wallet',
    products: [
      { productId: '5', productName: 'Butter', quantity: 4, price: 95 }
    ]
  },
  { 
    id: 'ORD-1239', 
    customerName: 'Sanjana Gupta', 
    items: 6, 
    total: 545, 
    status: 'completed', 
    date: '2025-10-26', 
    branch: 'Andheri West Branch', 
    payment: 'Card',
    products: [
      { productId: '2', productName: 'Toned Milk', quantity: 3, price: 55 },
      { productId: '9', productName: 'Flavored Milk', quantity: 3, price: 40 }
    ]
  },
  { 
    id: 'ORD-1240', 
    customerName: 'Rahul Mehta', 
    items: 3, 
    total: 225, 
    status: 'cancelled', 
    date: '2025-10-25', 
    branch: 'T. Nagar Branch', 
    payment: 'Cash',
    products: [
      { productId: '4', productName: 'Fresh Curd', quantity: 3, price: 45 },
      { productId: '8', productName: 'Lassi', quantity: 2, price: 35 }
    ]
  },
];

// ==================== DELIVERY BOYS ====================
export const deliveryBoys = [
  { id: '1', name: 'Mohammed Hassan', area: 'Koramangala', orders: 48, rating: 4.8, status: 'active', email: 'mohammed.hassan@dairydynasty.com', phone: '+91 98765 11111', branch: 'Koramangala Branch', joinedDate: '1/15/2024', completedOrders: 152, avgDeliveryTime: '28m', currentOrders: 2, weekOrders: 45, totalEarned: 15000 },
  { id: '2', name: 'Ahmed Al Mansouri', area: 'Andheri West', orders: 42, rating: 4.6, status: 'active', email: 'ahmed.almansouri@dairydynasty.com', phone: '+91 98765 22222', branch: 'Andheri West Branch', joinedDate: '2/20/2024', completedOrders: 181, avgDeliveryTime: '32m', currentOrders: 1, weekOrders: 28, totalEarned: 13500 },
  { id: '3', name: 'Omar Sheikh', area: 'Sector 29', orders: 38, rating: 4.4, status: 'inactive', email: 'omar.sheikh@dairydynasty.com', phone: '+91 98765 33333', branch: 'Sector 29 Branch', joinedDate: '3/10/2024', completedOrders: 76, avgDeliveryTime: '35m', currentOrders: 0, weekOrders: 0, totalEarned: 7000 },
  { id: '4', name: 'Khalid Ibrahim', area: 'T. Nagar', orders: 35, rating: 4.9, status: 'active', email: 'khalid.ibrahim@dairydynasty.com', phone: '+91 98765 44444', branch: 'T. Nagar Branch', joinedDate: '1/5/2023', completedOrders: 189, avgDeliveryTime: '25m', currentOrders: 3, weekOrders: 52, totalEarned: 18000 },
];

// ==================== NOTIFICATIONS ====================
export const notifications = [
  {
    id: '1',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Butter stock running low at Sector 29 Branch',
    time: '2 minutes ago',
    isRead: false,
    createdAt: '2025-10-29T10:28:00Z'
  },
  {
    id: '2',
    type: 'success',
    title: 'Order Milestone',
    message: 'Koramangala Branch reached 430 orders this month',
    time: '15 minutes ago',
    isRead: false,
    createdAt: '2025-10-29T10:15:00Z'
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update',
    message: 'New feature: Advanced analytics dashboard is now available',
    time: '1 hour ago',
    isRead: true,
    createdAt: '2025-10-29T09:30:00Z'
  },
  {
    id: '4',
    type: 'warning',
    title: 'Maintenance Schedule',
    message: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM',
    time: '3 hours ago',
    isRead: true,
    createdAt: '2025-10-29T07:30:00Z'
  },
];

// ==================== USERS ====================
export const users = [
  { id: '1', name: 'Karthik Menon', email: 'karthik.m@dairydynasty.com', role: 'Super Admin', status: 'active', joinDate: '2024-01-15' },
  { id: '2', name: 'Priya Sharma', email: 'priya.s@dairydynasty.com', role: 'Manager', status: 'active', joinDate: '2024-02-20' },
  { id: '3', name: 'Vijay Reddy', email: 'vijay.r@dairydynasty.com', role: 'Manager', status: 'active', joinDate: '2024-03-10' },
  { id: '4', name: 'Divya Nair', email: 'divya.n@dairydynasty.com', role: 'Manager', status: 'active', joinDate: '2024-04-05' },
];

// ==================== WALLET & DISCOUNTS ====================
export const walletData = {
  discounts: [
    { id: '1', code: 'DAIRY20', title: '20% off Dairy', type: 'Percentage', value: 20, status: 'active', redeemedCount: 45, usageLimit: 100, validFrom: '2025-10-01', validUntil: '2025-10-31' },
    { id: '2', code: 'FREEMILK', title: 'Free Milk Jug', type: 'Bonus', value: 65, status: 'active', redeemedCount: 120, usageLimit: 500, validFrom: '2025-10-01', validUntil: '2025-11-30' },
    { id: '3', code: 'FLAT50', title: 'Flat ₹50 Off', type: 'Fixed', value: 50, status: 'expired', redeemedCount: 200, usageLimit: 200, validFrom: '2025-09-15', validUntil: '2025-09-30' },
    { id: '4', code: 'WEEKEND100', title: 'Weekend Bonanza', type: 'Fixed', value: 100, status: 'scheduled', redeemedCount: 0, usageLimit: 1000, validFrom: '2025-11-01', validUntil: '2025-11-02' },
  ],
  transactions: [
    { id: 'TRX-1001', userId: '1', type: 'credit', amount: 500, status: 'completed', date: '2025-10-25' },
    { id: 'TRX-1002', userId: '2', type: 'debit', amount: 150, status: 'completed', date: '2025-10-24' },
    { id: 'TRX-1003', userId: '1', type: 'debit', amount: 425, status: 'completed', date: '2025-10-28' },
    { id: 'TRX-1004', userId: '3', type: 'credit', amount: 1000, status: 'pending', date: '2025-10-29' },
  ]
};

// ==================== MEMBERSHIP ====================
export const mockMemberships = [
  { id: '1', name: 'Bronze', price: 0, minOrders: 0, minSpend: 0, discount: 0, benefits: ['Basic Support'] },
  { id: '2', name: 'Silver', price: 500, minOrders: 10, minSpend: 5000, discount: 5, benefits: ['Priority Support', 'Early access to sales'] },
  { id: '3', name: 'Gold', price: 1000, minOrders: 25, minSpend: 10000, discount: 10, benefits: ['24/7 Support', 'Free Delivery', 'Early access to sales'] },
];

// ==================== HOMEPAGE SETTINGS ====================
export const defaultHomepageSettings = {
  bannerTitle: "Welcome to Our Restaurant",
  bannerSubtitle: "Delicious food delivered fresh to your door",
  ctaButtonText: "Order Now",
  ctaLink: "/menu",
  bannerImage: null,
  publishedBanner: {
    title: "Welcome to Our Restaurant",
    subtitle: "Delicious food delivered fresh to your door",
    ctaText: "Order Now",
    ctaLink: "/menu",
    image: null,
  },
  specialOffer: {
    title: "20% Off Dairy",
    code: "DAIRY20",
    description: "Get 20% off on all dairy products",
    visible: true,
  },
  categoryVisibility: "always",
  offerVisibility: "date",
  offerStartDate: "",
  offerEndDate: "",
  topProductsVisibility: "time",
  topProductsStartTime: "09:00",
  topProductsEndTime: "21:00",
  bannerVisibility: "always",
  topProductRules: [
    {
      id: 1,
      startTime: "11:00",
      endTime: "23:00",
      days: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      },
    },
  ],
  specialOfferRules: [
    {
      id: 1,
      startDate: "2025-01-09",
      endDate: "2025-12-31",
    },
  ],
  sections: [
    {
      id: 1,
      name: "Featured Categories",
      type: "categories",
      visible: true,
      scheduled: false,
    },
    {
      id: 2,
      name: "Special Offers",
      type: "offers",
      visible: true,
      scheduled: true,
    },
    {
      id: 3,
      name: "Top Products",
      type: "products",
      visible: true,
      scheduled: true,
    },
  ],
};


// ==================== CHART DATA ====================
export const revenueDataMonthly = [
  { month: 'Jan', income: 145230, expenses: 98450 },
  { month: 'Feb', income: 167890, expenses: 104230 },
  { month: 'Mar', income: 189450, expenses: 112340 },
  { month: 'Apr', income: 198670, expenses: 118900 },
  { month: 'May', income: 187230, expenses: 115670 },
  { month: 'Jun', income: 215890, expenses: 125430 },
  { month: 'Jul', income: 223450, expenses: 128900 },
  { month: 'Aug', income: 234560, expenses: 132450 },
  { month: 'Sep', income: 242890, expenses: 138670 },
  { month: 'Oct', income: 403000, expenses: 145230 },
];

export const revenueDataWeekly = [
  { month: 'Mon', income: 32450, expenses: 18230 },
  { month: 'Tue', income: 38670, expenses: 21450 },
  { month: 'Wed', income: 41230, expenses: 22890 },
  { month: 'Thu', income: 39450, expenses: 21670 },
  { month: 'Fri', income: 45890, expenses: 24560 },
  { month: 'Sat', income: 52340, expenses: 27890 },
  { month: 'Sun', income: 48900, expenses: 25340 },
];

export const revenueDataToday = [
  { month: '6 AM', income: 2340, expenses: 1450 },
  { month: '9 AM', income: 5670, expenses: 2890 },
  { month: '12 PM', income: 8900, expenses: 4560 },
  { month: '3 PM', income: 7450, expenses: 3890 },
  { month: '6 PM', income: 9890, expenses: 5230 },
  { month: '9 PM', income: 6780, expenses: 3450 },
];

export const orderSummaryDataWeekly = [
  { date: 'Mon', completed: 145, pending: 35 },
  { date: 'Tue', completed: 178, pending: 28 },
  { date: 'Wed', completed: 165, pending: 42 },
  { date: 'Thu', completed: 192, pending: 38 },
  { date: 'Fri', completed: 175, pending: 32 },
  { date: 'Sat', completed: 198, pending: 45 },
  { date: 'Sun', completed: 185, pending: 40 },
];

export const orderSummaryDataMonthly = [
  { date: 'Week 1', completed: 845, pending: 185 },
  { date: 'Week 2', completed: 978, pending: 142 },
  { date: 'Week 3', completed: 1065, pending: 198 },
  { date: 'Week 4', completed: 1142, pending: 156 },
];

// ==================== REPORT DATA (Simple versions) ====================
export const salesReportData = {
  summary: { totalRevenue: 403000, totalSales: 7, avgOrderValue: 57571 },
  chartData: revenueDataMonthly.map(d => ({ date: d.month, sales: d.income })),
  branchPerformance: [ { name: 'Koramangala Branch', orders: 2, revenue: 615 }, { name: 'T. Nagar Branch', orders: 2, revenue: 895 } ],
};

export const customerReportData = {
  summary: { totalCustomers: 8, newCustomers: 1, returningCustomers: 7 },
  topCustomers: customers.slice(0, 3).map(c => ({...c, totalOrders: c.totalOrders, totalSpend: c.totalSpent})),
  newVsReturningData: [ { name: "New", value: 1, color: "#3B82F6" }, { name: "Returning", value: 7, color: "#F59E0B" }]
};

export const productReportData = {
  topProducts: products.slice(0, 5).map(p => ({...p, unitsSold: 20, totalRevenue: p.price * 20})),
};

export const revenueReportData = {
  summary: { totalRevenue: 403000, totalProfit: 120900, profitMargin: 30 },
  chartData: revenueDataMonthly.map(d => ({date: d.month, revenue: d.income, profit: d.income * 0.3}))
};

// ==================== HELPER FUNCTIONS ====================

// Get all branches
export const getAllBranches = () => branches;

// Get branch by ID
export const getBranchById = (id) => branches.find(b => b.id === id);

// Get products by branch
export const getProductsByBranch = (branchName) => 
  products.filter(p => p.branch === branchName);

// Get orders by branch
export const getOrdersByBranch = (branchName) => 
  orders.filter(o => o.branch === branchName);

// Get customers by branch
export const getCustomersByBranch = (branchName) => 
  customers.filter(c => c.branch === branchName);

// Get delivery boys by branch
export const getDeliveryBoysByBranch = (branchName) => 
  deliveryBoys.filter(d => d.branch === branchName);

// Calculate total revenue
export const getTotalRevenue = () => 
  orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);

// Calculate total orders count
export const getTotalOrdersCount = () => orders.length;

// Get active branches count
export const getActiveBranchesCount = () => 
  branches.filter(b => b.status === 'active').length;

// Get total customers count
export const getTotalCustomersCount = () => customers.length;

// Get average order value
export const getAverageOrderValue = () => {
  const completedOrders = orders.filter(o => o.status === 'completed');
  if (completedOrders.length === 0) return 0;
  const total = completedOrders.reduce((sum, o) => sum + o.total, 0);
  return Math.round(total / completedOrders.length);
};

// ==================== REMOVED DUPLICATE EXPORT BLOCK ====================