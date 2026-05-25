
import React from 'react';

export interface OrderStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  size?: string;
  addOns?: string[];
  note?: string;
  price?: number;
}

export interface Order {
  id: string;
  customer: string;
  type: 'Delivery' | 'Offline Orders' | 'Dine-in' | 'Table Booking' | 'Takeaway';
  channel: string;
  items: string;
  itemList?: OrderItem[];
  total: string;
  status: string;
  time: string;
  paymentStatus?: 'Paid' | 'Unpaid';
  address?: string;
  customerType?: 'Regular' | 'First Time' | 'Inactive';
  phone?: string;
  offer?: string;
  customerNote?: string;
  subtotal?: number;
  tax?: number;
  discount?: number;
}

export interface Booking {
  id: string;
  customer: string;
  phone: string;
  time: string;
  date: string;
  guests: number;
  tableCount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  type: 'Table Booking' | 'Table Booking with Food' | 'Booking Package';
  source: string;
  preOrderItems?: { name: string; quantity: number }[];
  packageInfo?: string;
}

export enum Tab {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  SCANNER = 'SCANNER',
  ORDERS = 'ORDERS',
  ORDER_HISTORY = 'ORDER_HISTORY',
  EARNINGS = 'EARNINGS',
  MENU = 'MENU',
  INVENTORY = 'INVENTORY',
  PROFILE = 'PROFILE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SETTINGS = 'SETTINGS',
  ADS_MARKETING = 'ADS_MARKETING',
  OFFERS = 'OFFERS',
  OUTLET = 'OUTLET',
  BUSINESS_SETUP = 'BUSINESS_SETUP',
  OUTLET_INFO = 'OUTLET_INFO',
  OWNER_INFO = 'OWNER_INFO',
  OPENING_HOURS = 'OPENING_HOURS',
  DIGITAL_MENU = 'DIGITAL_MENU',
  BANK_ACCOUNTS = 'BANK_ACCOUNTS',
  BUSINESS_DOCS = 'BUSINESS_DOCS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  INTEGRATIONS = 'INTEGRATIONS',
  TABLES = 'TABLES',
  SALES_REPORT = 'SALES_REPORT',
  REFUNDS = 'REFUNDS',
  CUSTOMER_DATA = 'CUSTOMER_DATA',
  CREATE_OFFER = 'CREATE_OFFER',
  CREATE_ORDER = 'CREATE_ORDER',
  ANALYTICS = 'ANALYTICS',
  RELATIONSHIP_MANAGER = 'RELATIONSHIP_MANAGER',
  UPLOAD_BANNERS = 'UPLOAD_BANNERS',
  MANAGE_BILLING = 'MANAGE_BILLING',
  PARTNER_STORE = 'PARTNER_STORE',
  PARTNER_STORE_PRODUCT = 'PARTNER_STORE_PRODUCT',
  PARTNER_STORE_CHECKOUT = 'PARTNER_STORE_CHECKOUT',
  PARTNER_STORE_TRACKING = 'PARTNER_STORE_TRACKING',
  PIN_ON_MAP = 'PIN_ON_MAP',
  PAYOUT = 'PAYOUT',
  CUSTOMER_RATINGS = 'CUSTOMER_RATINGS',
  CUSTOMER_INFO = 'CUSTOMER_INFO',
  SUPPORT = 'SUPPORT',
  CREVINGS_STUDIO = 'CREVINGS_STUDIO',
  CREVINGS_LEGAL = 'CREVINGS_LEGAL'
}

export interface NavItem {
  id: Tab;
  label: string;
  icon: React.FC<any>;
}