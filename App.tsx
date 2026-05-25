
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { OrdersView } from './components/OrdersView';
import { EarningsView } from './components/EarningsView';
import { MenuView } from './components/MenuView';
import { ProfileView } from './components/ProfileView';
import { UploadBannersView } from './components/UploadBannersView';
import { SubscriptionView } from './components/SubscriptionView';
import { SettingsView } from './components/SettingsView';
import { AdsMarketingView } from './components/AdsMarketingView';
import { OffersView } from './components/OffersView';
import { CreateOfferView } from './components/CreateOfferView';
import { StoreView } from './components/StoreView';
import { OutletInfoView } from './components/OutletInfoView';
import { OwnerInfoView } from './components/OwnerInfoView';
import { OpeningHoursView } from './components/OpeningHoursView';
import { DigitalMenuView } from './components/DigitalMenuView';
import { BankAccountView } from './components/BankAccountView';
import { BusinessDocumentsView } from './components/BusinessDocumentsView';
import { OfflineOrdersView } from './components/OfflineOrdersView';
import { NotificationsView } from './components/NotificationsView';
import { LoginView } from './components/LoginView';
import { OnboardingView } from './components/OnboardingView';
import { IntegrationsView } from './components/IntegrationsView';
import { TableView } from './components/TableView';
import { CustomerDataView } from './components/CustomerDataView';
import { AnalyticsView } from './components/AnalyticsView';
import { SalesReportView } from './components/SalesReportView';
import { RefundsView } from './components/RefundsView';
import { RelationshipManagerView } from './components/RelationshipManagerView';
import { StaffManagementView } from './components/StaffManagementView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { InventoryView } from './components/InventoryView';
import { PartnerStoreView } from './components/PartnerStoreView';
import { PartnerStoreProductDetailView } from './components/PartnerStoreProductDetailView';
import { PartnerStoreCheckoutView } from './components/PartnerStoreCheckoutView';
import { PartnerStoreTrackingView } from './components/PartnerStoreTrackingView';
import { PinOnMapView } from './components/PinOnMapView';
import { OutletManagementView } from './components/OutletManagementView';
import { ManageBillingView } from './components/ManageBillingView';
import { StoreAndStaffManagementView } from './components/StoreAndStaffManagementView';
import { RatingDetailView } from './components/RatingDetailView';
import { Tab, Order } from './types';
import { HashRouter } from 'react-router-dom';
import { Bell, Mic, AlertTriangle, MapPin, Image as ImageIcon } from 'lucide-react';

const BRANCHES = [
  { name: 'Gourmet Kitchen', location: 'Downtown Precinct', id: 'branch-1', status: 'Active' },
  { name: 'Gourmet Express', location: 'Business Bay', id: 'branch-2', status: 'Online' },
  { name: 'Gourmet Hub', location: 'Cyber City', id: 'branch-3', status: 'Active' }
];

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-011', time: '12:43', customer: 'Simran Kaur', items: '1 Item • Large Pepperoni Pizza', itemList: [{ name: 'Large Pepperoni Pizza', quantity: 1 }], total: '899.00', channel: 'Crevings', status: 'Preparing', type: 'Delivery' },
  { id: 'ORD-012', time: '32:15', customer: 'Rahul Dravid', items: '2 Items • Veg Burger Meal', itemList: [{ name: 'Veg Burger', quantity: 1 }, { name: 'Fries', quantity: 1 }], total: '450.00', channel: 'Zomato', status: 'Cooking', type: 'Delivery' },
  { id: 'ORD-014', time: '12:05', customer: 'Amit Patel', items: '3 Items • Family Feast Combo', itemList: [{ name: 'Paneer Pizza (Full)', quantity: 2 }, { name: 'Garlic Bread', quantity: 1 }, { name: 'Coke', quantity: 3 }], total: '1250.00', channel: 'Crevings', status: 'Ready', type: 'Delivery', offer: 'BOGO: Buy 1 Get 1 Free on Pizza' },
  { id: 'ORD-015', time: '08:20', customer: 'Amit Sharma', total: '450.00', items: '2 Items • Veg Burger Meal', itemList: [{ name: 'Veg Burger', quantity: 1 }, { name: 'Fries', quantity: 1 }], channel: 'Zomato', status: 'Cooking', type: 'Offline Orders' },
  { id: 'ORD-022', time: '15:10', customer: 'Table 4', total: '1,250.00', items: '3 Items • Family Feast Combo', itemList: [{ name: 'Paneer Pizza (Full)', quantity: 2 }, { name: 'Garlic Bread', quantity: 1 }, { name: 'Coke', quantity: 3 }], channel: 'Internal', status: 'Ready', type: 'Dine-in' }
];

import { SideNav } from './components/SideNav';
import { CreateOrderView } from './components/CreateOrderView';

import { CustomChargesView } from './components/CustomChargesView';
import { BillingDetailsView } from './components/BillingDetailsView';

import { SupportView } from './components/SupportView';
import { CrevingsStudioView } from './components/CrevingsStudioView';
import { CrevingsLegalView } from './components/CrevingsLegalView';
import { PartnerVideoView } from './components/PartnerVideoView';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [showingPartnerVideo, setShowingPartnerVideo] = useState(false);
  const [isSupport, setIsSupport] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [rushHour, setRushHour] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [quickOrderType, setQuickOrderType] = useState<'Offline Orders' | 'Dine-in' | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(true);
  const [permissionStep, setPermissionStep] = useState<'location' | 'gallery' | 'notification' | 'mic' | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [trackingDetails, setTrackingDetails] = useState<{type: 'Delivery'|'Takeaway', paymentMethod: 'UPI'|'COD'}>({type: 'Delivery', paymentMethod: 'UPI'});

  useEffect(() => {
    if (isLoggedIn) {
      setIsInitialLoading(true);
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleTabChange = (tab: Tab) => {
    if (tab === currentTab) return;
    setCurrentTab(tab);
  };

  const showBottomNav = [
    Tab.HOME, Tab.MENU, Tab.ORDERS, Tab.EARNINGS, Tab.TABLES
  ].includes(currentTab);

  const showHeader = [Tab.HOME, Tab.MENU, Tab.ORDERS, Tab.EARNINGS, Tab.TABLES].includes(currentTab);

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => {
      if (prev.some(o => o.id === newOrder.id)) {
        return prev;
      }
      return [newOrder, ...prev];
    });
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    setOrders(prev => {
      const orderIndex = prev.findIndex(o => o.id === orderId);
      if (orderIndex === -1) return prev;

      const order = prev[orderIndex];
      let nextStatus = order.status;

      if (order.status === 'Incoming' || order.status === 'Accepted') nextStatus = 'Preparing';
      else if (order.status === 'Preparing' || order.status === 'Cooking') nextStatus = 'Ready';
      else if (order.status === 'Ready') nextStatus = 'Completed';

      if (nextStatus === 'Completed') {
        return prev.filter(o => o.id !== orderId);
      }

      const updatedOrders = [...prev];
      updatedOrders[orderIndex] = { ...order, status: nextStatus };
      return updatedOrders;
    });
  };

  const handleNextPermission = () => {
    if (permissionStep === 'location') setPermissionStep('gallery');
    else if (permissionStep === 'gallery') setPermissionStep('notification');
    else if (permissionStep === 'notification') setPermissionStep('mic');
    else setPermissionStep(null);
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.HOME:
        return (
          <Dashboard 
            orders={orders}
            onAddOrder={handleAddOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onNavigateToOrders={() => handleTabChange(Tab.ORDERS)} 
            onNavigateToTables={() => handleTabChange(Tab.TABLES)}
            onQuickOrder={(type) => setQuickOrderType(type)}
            onCreateOrder={() => handleTabChange(Tab.CREATE_ORDER)}
            onNavigateToOffers={() => handleTabChange(Tab.OFFERS)}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            rushHour={rushHour}
            setRushHour={setRushHour}
            selectedBranch={selectedBranch}
          />
        );
      case Tab.ORDERS:
        return <OrdersView 
          orders={orders} 
          onUpdateOrderStatus={handleUpdateOrderStatus} 
          onUpdateOrder={handleUpdateOrder} 
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          onAddMoreItems={(order) => {
            setEditingOrder(order);
            handleTabChange(Tab.CREATE_ORDER);
          }}
        />;
      case Tab.EARNINGS:
        return <EarningsView />;
      case Tab.CREATE_ORDER:
        return <CreateOrderView 
          onBack={() => {
            setEditingOrder(null);
            handleTabChange(Tab.HOME);
          }} 
          onCreateOrder={(order) => {
            if (editingOrder) {
              handleUpdateOrder(order);
              setSelectedOrder(order);
              setEditingOrder(null);
              handleTabChange(Tab.ORDERS);
            } else {
              handleAddOrder(order);
            }
          }} 
          existingOrder={editingOrder}
        />;
      case Tab.MENU:
        return <MenuView />;
      case Tab.INVENTORY:
        return <InventoryView onBack={() => handleTabChange(Tab.HOME)} />;
      case Tab.SUBSCRIPTION:
        return <SubscriptionView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.SETTINGS:
        return <SettingsView onBack={() => handleTabChange(Tab.HOME)} />;
      case Tab.ADS_MARKETING:
        return <AdsMarketingView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.OFFERS:
        return <OffersView onNavigateToCreateOffer={() => handleTabChange(Tab.CREATE_OFFER)} onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.CREATE_OFFER:
        return <CreateOfferView onBack={() => handleTabChange(Tab.OFFERS)} />;
      case Tab.BUSINESS_SETUP:
        return <StoreAndStaffManagementView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.OUTLET:
        return <StoreView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.OUTLET_INFO:
        return <OutletInfoView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} onNavigateToPinOnMap={() => handleTabChange(Tab.PIN_ON_MAP)} />;
      case Tab.OWNER_INFO:
        return <OwnerInfoView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.OPENING_HOURS:
        return <OpeningHoursView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.DIGITAL_MENU:
        return <DigitalMenuView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.UPLOAD_BANNERS:
        return <UploadBannersView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.BANK_ACCOUNTS:
        return <BankAccountView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.BUSINESS_DOCS:
        return <BusinessDocumentsView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.TABLES:
        return <TableView />;
      case Tab.NOTIFICATIONS:
        return <NotificationsView onBack={() => handleTabChange(Tab.HOME)} />;
      case Tab.INTEGRATIONS:
        return <IntegrationsView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.ORDER_HISTORY:
        return <OrderHistoryView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.SALES_REPORT:
        return <SalesReportView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.REFUNDS:
        return <RefundsView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.CUSTOMER_DATA:
        return <CustomerDataView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.ANALYTICS:
        return <AnalyticsView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.CUSTOMER_RATINGS:
        return <RatingDetailView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.RELATIONSHIP_MANAGER:
        return <RelationshipManagerView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.MANAGE_BILLING:
        return <ManageBillingView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} />;
      case Tab.PARTNER_STORE:
        return <PartnerStoreView onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }} onNavigateToProduct={() => handleTabChange(Tab.PARTNER_STORE_PRODUCT)} onNavigateToCheckout={() => handleTabChange(Tab.PARTNER_STORE_CHECKOUT)} onNavigateToPinOnMap={() => handleTabChange(Tab.PIN_ON_MAP)} />;
      case Tab.PARTNER_STORE_PRODUCT:
        return <PartnerStoreProductDetailView onBack={() => handleTabChange(Tab.PARTNER_STORE)} onAddToCart={() => handleTabChange(Tab.PARTNER_STORE_CHECKOUT)} />;
      case Tab.PARTNER_STORE_CHECKOUT:
        return <PartnerStoreCheckoutView 
          onBack={() => handleTabChange(Tab.PARTNER_STORE)} 
          onTrackOrder={(details) => {
            setTrackingDetails(details);
            handleTabChange(Tab.PARTNER_STORE_TRACKING);
          }}
        />;
      case Tab.PARTNER_STORE_TRACKING:
        return <PartnerStoreTrackingView 
          onBack={() => handleTabChange(Tab.PARTNER_STORE)}
          orderType={trackingDetails.type}
          paymentMethod={trackingDetails.paymentMethod}
        />;
      case Tab.PIN_ON_MAP:
        return <PinOnMapView 
          onBack={() => handleTabChange(Tab.OUTLET_INFO)} 
        />;
      case Tab.SUPPORT:
        return <SupportView 
          onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }}
        />;
      case Tab.CREVINGS_STUDIO:
        return <CrevingsStudioView 
          onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }}
        />;
      case Tab.CREVINGS_LEGAL:
        return <CrevingsLegalView 
          onBack={() => { handleTabChange(Tab.HOME); setIsProfileOpen(true); }}
        />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400 animate-in fade-in">
            <p>Coming Soon</p>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    if (showingPartnerVideo) {
      return <PartnerVideoView 
        onComplete={() => { setShowingPartnerVideo(false); setIsOnboarding(true); }} 
        onCancel={() => setShowingPartnerVideo(false)} 
      />;
    }
    if (isOnboarding) {
      return <OnboardingView onComplete={() => { setIsOnboarding(false); setIsLoggedIn(true); setPermissionStep('location'); }} onBack={() => setIsOnboarding(false)} />;
    }
    return <LoginView onLogin={() => { setIsLoggedIn(true); setPermissionStep('location'); }} onNavigateToOnboarding={() => setShowingPartnerVideo(true)} />;
  }

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
        {/* Header Skeleton */}
        <div className="h-16 bg-[#FFFFFF] border-b border-slate-200 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
              <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
        </div>
        
        {/* Content Skeleton */}
        <div className="p-4 space-y-4 flex-1">
          <div className="w-full h-32 bg-[#FFFFFF] rounded-2xl border border-slate-100 animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-[#FFFFFF] rounded-2xl border border-slate-100 animate-pulse" />
            <div className="h-24 bg-[#FFFFFF] rounded-2xl border border-slate-100 animate-pulse" />
          </div>
          <div className="w-full h-64 bg-[#FFFFFF] rounded-2xl border border-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#FFFFFF] relative z-10 overflow-x-hidden lg:flex lg:bg-[#FFFFFF]">
        <SideNav 
          currentTab={currentTab} 
          onTabChange={handleTabChange} 
          activeOrdersCount={orders.filter(o => o.status !== 'Completed').length}
          onLogout={() => setIsLoggedIn(false)}
        />

        <div className="flex-1 flex flex-col min-h-screen w-full lg:px-8 bg-[#FFFFFF] lg:bg-transparent">
          <div className={`lg:mt-6 lg:mb-6 ${showHeader ? '' : 'hidden lg:block'}`}>
            <Header 
              title={
                currentTab === Tab.HOME ? 'Dashboard' :
                currentTab === Tab.ORDERS ? 'Orders' :
                currentTab === Tab.EARNINGS ? 'Payout' :
                currentTab === Tab.TABLES ? 'Tables' :
                currentTab === Tab.MENU ? 'Menu' :
                currentTab === Tab.INVENTORY ? 'Inventory Management' :
                currentTab === Tab.SUBSCRIPTION ? 'Subscription' :
                currentTab === Tab.SETTINGS ? 'Settings' :
                currentTab === Tab.ADS_MARKETING ? 'Ads & Marketing' :
                currentTab === Tab.OFFERS ? 'Offers' :
                currentTab === Tab.CREATE_OFFER ? 'Create Offer' :
                currentTab === Tab.OUTLET ? 'Store Settings' :
                currentTab === Tab.OUTLET_INFO ? 'Outlet Info' :
                currentTab === Tab.OWNER_INFO ? 'Owner Info' :
                currentTab === Tab.OPENING_HOURS ? 'Opening Hours' :
                currentTab === Tab.DIGITAL_MENU ? 'Digital Menu' :
                currentTab === Tab.UPLOAD_BANNERS ? 'Upload Banners' :
                currentTab === Tab.BANK_ACCOUNTS ? 'Bank Accounts' :
                currentTab === Tab.BUSINESS_DOCS ? 'Business Documents' :
                currentTab === Tab.NOTIFICATIONS ? 'Notifications' :
                currentTab === Tab.INTEGRATIONS ? 'Integrations' :
                currentTab === Tab.SALES_REPORT ? 'Sales Report' :
                currentTab === Tab.REFUNDS ? 'Refunds' :
                currentTab === Tab.CUSTOMER_DATA ? 'Customer Data' :
                currentTab === Tab.ANALYTICS ? 'Analytics' :
                currentTab === Tab.CUSTOMER_RATINGS ? 'Customer Ratings' :
                currentTab === Tab.RELATIONSHIP_MANAGER ? 'Relationship Manager' :
                currentTab === Tab.BUSINESS_SETUP ? 'Business Setup' :
                currentTab === Tab.PARTNER_STORE ? 'Partner Store' :
                currentTab === Tab.PARTNER_STORE_PRODUCT ? 'Product Details' :
                currentTab === Tab.PARTNER_STORE_CHECKOUT ? 'Checkout' :
                currentTab === Tab.PARTNER_STORE_TRACKING ? 'Track Order' :
                currentTab === Tab.CREATE_ORDER ? 'Create Order' : 'Dashboard'
              }
              onProfileClick={() => setIsProfileOpen(true)}
              onNotificationClick={() => handleTabChange(Tab.NOTIFICATIONS)}
              isOnline={isOnline}
              onToggleOnline={() => setIsOnline(!isOnline)}
              rushHour={rushHour}
              onToggleRush={() => setRushHour(!rushHour)}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused(!isPaused)}
              restaurantName={selectedBranch.name}
              showOperationalControls={currentTab === Tab.HOME}
              onCreateOrder={() => handleTabChange(Tab.CREATE_ORDER)}
            />
          </div>

          <ProfileView 
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            onNavigateToTab={(tab) => {
              setIsProfileOpen(false);
              handleTabChange(tab);
            }} 
            onLogout={() => setIsLoggedIn(false)}
          />
          
          <main className="max-w-md mx-auto w-full relative lg:max-w-none lg:w-full">
            <div className="transition-opacity duration-300">
              {renderContent()}
            </div>
          </main>
        </div>

        {showBottomNav && (
          <div className="lg:hidden">
            <BottomNav 
              currentTab={currentTab} 
              onTabChange={handleTabChange} 
              activeOrdersCount={orders.filter(o => o.status !== 'Completed').length}
            />
          </div>
        )}

        {/* Floating New Order Snackbar */}
        {showSnackbar && currentTab === Tab.HOME && (
          <div className="fixed bottom-[90px] left-4 right-4 z-50 max-w-md mx-auto">
            <div className="h-[72px] rounded-[20px] bg-gradient-to-r from-[#1E90FF] to-[#1D4ED8] p-[16px] shadow-sm flex items-center justify-between">
              {/* Left side: dot */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
                
                {/* Center: Text content */}
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-white leading-tight">Incoming Order</span>
                  <span className="text-[13px] text-white/80 leading-tight mt-0.5">1 waiting to confirm</span>
                </div>
              </div>

              {/* Right side: Action button */}
              <button 
                onClick={() => {
                  setCurrentTab(Tab.ORDERS);
                  setShowSnackbar(false);
                }}
                className="h-[36px] px-[16px] rounded-[18px] bg-[#FFFFFF] text-[#1E90FF] text-[14px] font-medium active:scale-95 transition-transform"
              >
                Review
              </button>
            </div>
          </div>
        )}

        {/* Quick Order Overlay */}
        {quickOrderType && (
            <OfflineOrdersView 
                type={quickOrderType} 
                onBack={() => setQuickOrderType(null)} 
            />
        )}

        {/* Permissions Bottom Sheet Flow */}
        {permissionStep && (
          <div className="fixed inset-0 z-[1000] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in transition-opacity">
            <div className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] sm:rounded-[24px] p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 flex flex-col items-center text-center pb-8 sm:pb-6 relative">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                {permissionStep === 'location' && <MapPin size={32} />}
                {permissionStep === 'gallery' && <ImageIcon size={32} />}
                {permissionStep === 'notification' && <Bell size={32} />}
                {permissionStep === 'mic' && <Mic size={32} />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {permissionStep === 'location' && 'Allow Location Access'}
                {permissionStep === 'gallery' && 'Allow Gallery Access'}
                {permissionStep === 'notification' && 'Allow Notifications'}
                {permissionStep === 'mic' && 'Allow Microphone Access'}
              </h3>
              <p className="text-[15px] text-slate-500 mb-6 leading-relaxed">
                {permissionStep === 'location' && 'We need your location to help customers find your restaurant and calculate delivery distances accurately.'}
                {permissionStep === 'gallery' && 'Access to your gallery is required to upload menu items, restaurant photos, and promotional banners.'}
                {permissionStep === 'notification' && 'Get instant alerts for new orders, table bookings, and important updates to serve your customers better.'}
                {permissionStep === 'mic' && 'Microphone access enables voice search and quick voice notes for order instructions.'}
              </p>
              <div className="w-full space-y-3">
                <button 
                  onClick={handleNextPermission}
                  className="w-full h-12 bg-[#1E90FF] text-white rounded-xl font-semibold text-[15px] active:scale-[0.98] transition-all shadow-sm"
                >
                  Allow Access
                </button>
                <button 
                  onClick={handleNextPermission}
                  className="w-full h-12 bg-slate-50 text-slate-500 rounded-xl font-medium text-[15px] active:bg-slate-100 transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-color: #FFFFFF;
          -webkit-tap-highlight-color: transparent;
        }
        main {
          -webkit-overflow-scrolling: touch;
        }
      `}} />
    </HashRouter>
  );
};

export default App;
