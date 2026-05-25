
import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Settings, 
  Users, 
  Clock, 
  Maximize2, 
  Navigation, 
  Circle, 
  Zap, 
  Move,
  LayoutGrid,
  ChevronRight,
  PlusCircle,
  Tag,
  X,
  ChevronDown,
  Trash2,
  Pencil,
  Check,
  Hash,
  Gift,
  Boxes,
  IndianRupee,
  PlusSquare,
  MinusCircle,
  Pause,
  Play,
  Edit3,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  MoreVertical
} from 'lucide-react';

interface Table {
  id: string;
  status: 'Occupied' | 'Open' | 'Reserved';
  capacity: number;
  time?: string;
  guests?: number;
}

interface Zone {
  id: string;
  title: string;
  tables: Table[];
}

interface BookingPackage {
  id: string;
  name: string;
  price: string;
  included: string[];
  excluded: string[];
  status: 'active' | 'paused';
}

const TableCard: React.FC<{ table: Table, zoneType: string }> = ({ table, zoneType }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusStyles = (status: string) => {
    if (status === 'Occupied') return 'bg-[#FEE2E2] text-[#B91C1C]';
    if (status === 'Reserved') return 'bg-[#FEF3C7] text-[#B45309]';
    return 'bg-[#DCFCE7] text-[#15803D]';
  };

  const getStatusText = (status: string) => {
    if (status === 'Open') return 'Available';
    if (status === 'Reserved') return 'Booked';
    return status;
  };

  const handleCardClick = () => {
    if (table.status === 'Open') {
      console.log('Create new order for', table.id);
    } else if (table.status === 'Occupied') {
      console.log('Open current order details for', table.id);
    } else if (table.status === 'Reserved') {
      console.log('Show reservation details for', table.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#FFFFFF] rounded-[16px] p-4 border border-[#E5E7EB] shadow-sm flex flex-col justify-between h-[140px] relative cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Header Row */}
      <div className="flex justify-between items-center">
        <span className="text-[18px] font-semibold text-[#111827]">{table.id}</span>
        
        <div className="flex items-center gap-2">
          <div className={`h-[26px] px-[10px] py-[6px] rounded-[12px] text-[12px] font-medium flex items-center justify-center ${getStatusStyles(table.status)}`}>
            {getStatusText(table.status)}
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:bg-slate-50 rounded-full"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Action Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-12 right-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] shadow-lg py-2 z-10 min-w-[160px]">
          {table.status === 'Open' && (
            <button className="w-full text-left px-4 py-2 text-[14px] text-[#374151] hover:bg-slate-50">
              Create New Order
            </button>
          )}
          {table.status === 'Occupied' && (
            <>
              <button className="w-full text-left px-4 py-2 text-[14px] text-[#374151] hover:bg-slate-50">
                View Order Details
              </button>
              <button className="w-full text-left px-4 py-2 text-[14px] text-[#374151] hover:bg-slate-50">
                Update Order Status
              </button>
            </>
          )}
          {table.status === 'Reserved' && (
            <button className="w-full text-left px-4 py-2 text-[14px] text-[#374151] hover:bg-slate-50">
              View Reservation
            </button>
          )}
        </div>
      )}

      {/* Table Details Section */}
      <div className="mt-1">
        <p className="text-[14px] text-[#6B7280]">
          Cap: {table.capacity} • {zoneType === 'couple' ? 'Couple' : zoneType === 'family' ? 'Family' : zoneType === 'private' ? 'Private' : 'Normal'}
        </p>
      </div>
      
      {/* Occupancy Row */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-[#6B7280]" />
          <span className="text-[14px] font-medium text-[#111827]">
            {table.guests || 0}/{table.capacity}
          </span>
        </div>
        {table.status === 'Occupied' && table.time && (
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#6B7280]" />
            <span className="text-[14px] font-medium text-[#111827]">{table.time}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const TableView: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('all');
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isAddSeriesOpen, setIsAddSeriesOpen] = useState(false);
  const [isManageTypesOpen, setIsManageTypesOpen] = useState(false);
  const [isBookingSettingsOpen, setIsBookingSettingsOpen] = useState(false);
  const [isCreatePackageOpen, setIsCreatePackageOpen] = useState(false);
  const [isManagePackagesOpen, setIsManagePackagesOpen] = useState(false);
  const [openBookingMenuId, setOpenBookingMenuId] = useState<string | null>(null);
  
  // Floor State
  const [floors, setFloors] = useState(['Ground Floor', 'First Floor', 'Rooftop']);
  const [activeFloor, setActiveFloor] = useState('Ground Floor');
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [newFloorName, setNewFloorName] = useState('');

  // Table Types State
  const [tableTypes, setTableTypes] = useState(['Normal', 'VIP', 'Outdoor', 'Private']);
  const [newTypeName, setNewTypeName] = useState('');
  const [editingTypeIndex, setEditingTypeIndex] = useState<number | null>(null);

  // Add Table State
  const [addTableName, setAddTableName] = useState('');
  const [addTableCapacity, setAddTableCapacity] = useState('');
  const [addTableType, setAddTableType] = useState('Normal');
  const [addTableFloor, setAddTableFloor] = useState('Ground Floor');
  const [addTableError, setAddTableError] = useState('');

  // Add Series State
  const [addSeriesPrefix, setAddSeriesPrefix] = useState('');
  const [addSeriesStart, setAddSeriesStart] = useState('');
  const [addSeriesEnd, setAddSeriesEnd] = useState('');
  const [addSeriesCapacity, setAddSeriesCapacity] = useState('');
  const [addSeriesType, setAddSeriesType] = useState('Normal');
  const [addSeriesFloor, setAddSeriesFloor] = useState('Ground Floor');
  const [addSeriesError, setAddSeriesError] = useState('');

  // Booking Settings State
  const [bookingAmount, setBookingAmount] = useState('500');
  const [isBookingFeeEnabled, setIsBookingFeeEnabled] = useState(true);
  const [bookingFeeType, setBookingFeeType] = useState<'flat' | 'per_type'>('flat');
  const [bookingFeePerType, setBookingFeePerType] = useState<Record<string, string>>({});
  const [bookingTermsEnabled, setBookingTermsEnabled] = useState(false);
  const [bookingTerms, setBookingTerms] = useState('');

  // Packages State
  const [packages, setPackages] = useState<BookingPackage[]>([
    {
      id: 'pkg-1',
      name: 'Birthday Celebration',
      price: '2500',
      included: ['Table Decoration', 'Welcome Drinks', 'Birthday Cake (500g)'],
      excluded: ['Main Course', 'Alcoholic Beverages'],
      status: 'active'
    },
    {
      id: 'pkg-2',
      name: 'Romantic Date',
      price: '1800',
      included: ['Candlelight Setup', '2 Glasses of Wine', 'Appetizer Platter'],
      excluded: ['Dessert', 'Pick & Drop'],
      status: 'active'
    }
  ]);

  // Create/Edit Package Form State
  const [packageForm, setPackageForm] = useState<Partial<BookingPackage> & { termsEnabled?: boolean, terms?: string }>({
    name: '',
    price: '',
    included: [''],
    excluded: [''],
    termsEnabled: false,
    terms: ''
  });
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const upcomingBookings = [
    { id: 'b1', name: 'Rahul Sharma', time: '19:30', guests: 4, type: 'Normal', table: 'T1' },
    { id: 'b2', name: 'Priya Patel', time: '20:00', guests: 2, type: 'Couple', table: 'C1' },
    { id: 'b3', name: 'Amit Kumar', time: '20:30', guests: 6, type: 'Family', table: 'F1' },
  ];

  const zones: Zone[] = [
    {
      id: 'normal',
      title: 'Grand Hall',
      tables: [
        { id: 'T1', status: 'Occupied', capacity: 4, guests: 3, time: '45m' },
        { id: 'T4', status: 'Occupied', capacity: 4, guests: 4, time: '12m' },
        { id: 'T6', status: 'Open', capacity: 4 },
      ]
    },
    {
      id: 'couple',
      title: 'Romantic Wing',
      tables: [
        { id: 'C1', status: 'Open', capacity: 2 },
        { id: 'C2', status: 'Open', capacity: 2 },
        { id: 'C3', status: 'Occupied', capacity: 2, guests: 2, time: '22m' },
      ]
    },
    {
      id: 'family',
      title: 'Family Loft',
      tables: [
        { id: 'F1', status: 'Reserved', capacity: 6, time: '19:00' },
        { id: 'F2', status: 'Open', capacity: 8 },
      ]
    },
    {
      id: 'private',
      title: 'Executive Suite',
      tables: [
        { id: 'P1', status: 'Open', capacity: 8 },
      ]
    }
  ];

  const blueColor = '#1E90FF';

  const filteredZones = activeZone === 'all' 
    ? zones 
    : zones.filter(z => z.id === activeZone);

  const handleAddOrUpdateType = () => {
    if (!newTypeName.trim()) return;
    
    if (editingTypeIndex !== null) {
      const updated = [...tableTypes];
      updated[editingTypeIndex] = newTypeName.trim();
      setTableTypes(updated);
      setEditingTypeIndex(null);
    } else {
      setTableTypes([...tableTypes, newTypeName.trim()]);
    }
    setNewTypeName('');
  };

  const deleteType = (index: number) => {
    setTableTypes(tableTypes.filter((_, i) => i !== index));
    if (editingTypeIndex === index) {
      setEditingTypeIndex(null);
      setNewTypeName('');
    }
  };

  const handleAddFloor = () => {
    if (newFloorName.trim() && !floors.includes(newFloorName.trim())) {
      setFloors([...floors, newFloorName.trim()]);
      setNewFloorName('');
      setIsAddFloorOpen(false);
    }
  };

  const startEdit = (index: number) => {
    setEditingTypeIndex(index);
    setNewTypeName(tableTypes[index]);
  };

  // Package Handlers
  const handleSavePackage = () => {
    if (!packageForm.name || !packageForm.price) return;

    if (editingPackageId) {
      setPackages(prev => prev.map(p => p.id === editingPackageId ? { ...p, ...packageForm as BookingPackage } : p));
    } else {
      const newPkg: BookingPackage = {
        id: `pkg-${Date.now()}`,
        name: packageForm.name!,
        price: packageForm.price!,
        included: (packageForm.included || []).filter(i => i.trim()),
        excluded: (packageForm.excluded || []).filter(i => i.trim()),
        status: 'active'
      };
      setPackages(prev => [...prev, newPkg]);
    }
    closePackageModal();
  };

  const closePackageModal = () => {
    setIsCreatePackageOpen(false);
    setPackageForm({ name: '', price: '', included: [''], excluded: [''] });
    setEditingPackageId(null);
  };

  const startEditPackage = (pkg: BookingPackage) => {
    setPackageForm({ ...pkg });
    setEditingPackageId(pkg.id);
    setIsManagePackagesOpen(false);
    setIsCreatePackageOpen(true);
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const togglePackageStatus = (id: string) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'paused' : 'active' } : p));
  };

  const updateListField = (type: 'included' | 'excluded', index: number, value: string) => {
    const list = [...(packageForm[type] || [])];
    list[index] = value;
    setPackageForm({ ...packageForm, [type]: list });
  };

  const addListItem = (type: 'included' | 'excluded') => {
    setPackageForm({ ...packageForm, [type]: [...(packageForm[type] || []), ''] });
  };

  const removeListItem = (type: 'included' | 'excluded', index: number) => {
    const list = [...(packageForm[type] || [])];
    if (list.length > 1) {
      list.splice(index, 1);
      setPackageForm({ ...packageForm, [type]: list });
    }
  };

  const handleAddTable = () => {
    if (!addTableName.trim()) {
      setAddTableError('Table Name is required');
      return;
    }
    if (!addTableCapacity || isNaN(Number(addTableCapacity)) || Number(addTableCapacity) <= 0) {
      setAddTableError('Capacity must be a valid number greater than 0');
      return;
    }
    
    // Here you would normally save the table to your backend
    console.log('Adding table:', { name: addTableName, capacity: addTableCapacity, type: addTableType });
    
    // Reset and close
    setAddTableName('');
    setAddTableCapacity('');
    setAddTableType(tableTypes[0] || 'Normal');
    setAddTableError('');
    setIsAddTableOpen(false);
  };

  const handleAddSeries = () => {
    if (!addSeriesPrefix.trim()) {
      setAddSeriesError('Series Name is required');
      return;
    }
    if (!addSeriesStart || isNaN(Number(addSeriesStart)) || Number(addSeriesStart) < 0) {
      setAddSeriesError('Start Number must be a valid number');
      return;
    }
    if (!addSeriesEnd || isNaN(Number(addSeriesEnd)) || Number(addSeriesEnd) < Number(addSeriesStart)) {
      setAddSeriesError('End Number must be a valid number greater than or equal to Start Number');
      return;
    }
    if (!addSeriesCapacity || isNaN(Number(addSeriesCapacity)) || Number(addSeriesCapacity) <= 0) {
      setAddSeriesError('Capacity must be a valid number greater than 0');
      return;
    }

    // Here you would normally save the series to your backend
    console.log('Adding series:', { prefix: addSeriesPrefix, start: addSeriesStart, end: addSeriesEnd, capacity: addSeriesCapacity, type: addSeriesType });

    // Reset and close
    setAddSeriesPrefix('');
    setAddSeriesStart('');
    setAddSeriesEnd('');
    setAddSeriesCapacity('');
    setAddSeriesType(tableTypes[0] || 'Normal');
    setAddSeriesError('');
    setIsAddSeriesOpen(false);
  };

  return (
    <div 
      className="pb-40 bg-[#FFFFFF] min-h-screen font-sans animate-in fade-in duration-700 overflow-x-hidden"
      onClick={() => setOpenBookingMenuId(null)}
    >
      
      {/* 1. Header & Technical HUD */}
      <div className="px-6 pt-10 pb-8 bg-[#FFFFFF] border-b border-slate-100 sticky top-0 z-40">
        <h1 className="text-[20px] font-semibold text-[#111827] mb-6">Tables</h1>
        
        {/* Action Buttons */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
            <button 
              onClick={() => setIsAddTableOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#1E90FF] text-white h-[56px] rounded-[14px] active:scale-[0.98] transition-all"
            >
              <span className="text-[14px] font-medium">Add Table</span>
            </button>
            <button 
              onClick={() => setIsAddSeriesOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#1E90FF] text-white h-[56px] rounded-[14px] active:scale-[0.98] transition-all"
            >
              <span className="text-[14px] font-medium">Add Series</span>
            </button>
            <button 
              onClick={() => setIsManageTypesOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[56px] rounded-[14px] active:scale-[0.98] transition-all"
            >
              <span className="text-[14px] font-medium">Types</span>
            </button>
            <button 
              onClick={() => setIsBookingSettingsOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[56px] rounded-[14px] active:scale-[0.98] transition-all"
            >
              <span className="text-[14px] font-medium">Booking Settings</span>
            </button>
            <button 
              onClick={() => setIsCreatePackageOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[56px] rounded-[14px] active:scale-[0.98] transition-all"
            >
              <span className="text-[14px] font-medium">Packages</span>
            </button>
            <button 
              onClick={() => setIsManagePackagesOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 text-[#1E90FF] h-[56px] rounded-[14px] active:scale-[0.98] transition-all"
            >
              <span className="text-[14px] font-medium">Manage Packages</span>
            </button>
          </div>
        </div>

        <h2 className="text-[16px] font-semibold text-[#111827] mb-4">Tables</h2>

        {/* Floor Filter Chips */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar mb-6 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap">
          <button 
            onClick={() => setIsAddFloorOpen(true)}
            className="h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 bg-[#EFF6FF] text-[#1E90FF] flex items-center gap-1.5"
          >
            <Plus size={18} />
            Add Floor
          </button>
          {floors.map(floor => (
            <button 
              key={`floor-${floor}`}
              onClick={() => setActiveFloor(floor)}
              className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                activeFloor === floor 
                  ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        {/* HUD Stats */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
           <div className="bg-[#F0FDF4] rounded-[16px] p-4 border border-[#DCFCE7] min-w-[140px] flex-1">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[12px] font-medium text-[#166534]">Available</p>
                 <CheckCircle2 size={16} className="text-[#166534]" />
              </div>
              <p className="text-[24px] font-bold text-[#166534] leading-none">09</p>
           </div>
           <div className="bg-[#FEF2F2] rounded-[16px] p-4 border border-[#FEE2E2] min-w-[140px] flex-1">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[12px] font-medium text-[#991B1B]">Occupied</p>
                 <Users size={16} className="text-[#991B1B]" />
              </div>
              <p className="text-[24px] font-bold text-[#991B1B] leading-none">03</p>
           </div>
           <div className="bg-[#FFFBEB] rounded-[16px] p-4 border border-[#FEF3C7] min-w-[140px] flex-1">
              <div className="flex items-center justify-between mb-2">
                 <p className="text-[12px] font-medium text-[#92400E]">Booked</p>
                 <CalendarCheck size={16} className="text-[#92400E]" />
              </div>
              <p className="text-[24px] font-bold text-[#92400E] leading-none">01</p>
           </div>
        </div>

        {/* Zone Filters */}
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar mt-6 -mx-1 px-1">
           {['all', ...zones.map(z => z.id)].map(id => (
             <button 
               key={id}
               onClick={() => setActiveZone(id)}
               className={`h-[36px] px-[14px] rounded-[18px] text-[14px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 flex items-center gap-1.5 font-sans ${
                 activeZone === id 
                  ? 'bg-[#EFF6FF] text-[#1E90FF]' 
                  : 'bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151]'
               }`}
             >
               {id === 'all' ? 'All Tables' : zones.find(z => z.id === id)?.title}
             </button>
           ))}
        </div>
      </div>

      {/* 2. Table Grid */}
      <div className="p-6">
        <div className="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          {filteredZones.map((zone, zIdx) => (
            <div key={zone.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${zIdx * 100}ms` }}>
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[16px] font-semibold text-[#111827]">{zone.title}</h3>
                <div className="flex-1 h-[1px] bg-[#E5E7EB]"></div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {zone.tables.map((table) => (
                  <TableCard key={table.id} table={table} zoneType={zone.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Floor Modal */}
      {isAddFloorOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsAddFloorOpen(false)}
        >
           <div 
             className="w-full bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4">
                 <h2 className="text-lg font-bold text-slate-900">Add Floor</h2>
              </div>

              {/* Modal Content */}
              <div className="space-y-4 mb-6">
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Floor Name</label>
                    <input 
                      type="text" 
                      value={newFloorName}
                      onChange={(e) => setNewFloorName(e.target.value)}
                      placeholder="e.g., Ground Floor"
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                 <button 
                   onClick={() => setIsAddFloorOpen(false)}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handleAddFloor}
                   className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Save Floor
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => {
            setIsAddTableOpen(false);
            setAddTableError('');
          }}
        >
           <div 
             className="w-full max-h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4 shrink-0">
                 <h2 className="text-lg font-bold text-slate-900">Add Table</h2>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto space-y-4 mb-6 pr-2">
                 {addTableError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-[12px] flex items-center gap-2 text-red-600 text-[13px] font-medium">
                       <AlertCircle size={16} />
                       {addTableError}
                    </div>
                 )}

                 {/* Table Name */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Table Name</label>
                    <input 
                      type="text" 
                      value={addTableName}
                      onChange={(e) => setAddTableName(e.target.value)}
                      placeholder="e.g., T1"
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                 </div>

                 {/* Capacity */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Capacity</label>
                    <input 
                      type="number" 
                      value={addTableCapacity}
                      onChange={(e) => setAddTableCapacity(e.target.value)}
                      placeholder="e.g., 4"
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                 </div>

                 {/* Type Select */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Table Type</label>
                    <div className="relative">
                       <select 
                         value={addTableType}
                         onChange={(e) => setAddTableType(e.target.value)}
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors appearance-none cursor-pointer"
                       >
                          {tableTypes.map(type => (
                             <option key={type} value={type}>{type}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                    </div>
                 </div>

                 {/* Floor Select */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Floor</label>
                    <div className="relative">
                       <select 
                         value={addTableFloor}
                         onChange={(e) => setAddTableFloor(e.target.value)}
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors appearance-none cursor-pointer"
                       >
                          {floors.map(floor => (
                             <option key={floor} value={floor}>{floor}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                 <button 
                   onClick={() => {
                     setIsAddTableOpen(false);
                     setAddTableError('');
                   }}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handleAddTable}
                   className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Save Table
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Add Table Series Modal */}
      {isAddSeriesOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => {
            setIsAddSeriesOpen(false);
            setAddSeriesError('');
          }}
        >
           <div 
             className="w-full max-h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4 shrink-0">
                 <h2 className="text-lg font-bold text-slate-900">Create Table Series</h2>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto space-y-4 mb-6 pr-2">
                 {addSeriesError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-[12px] flex items-center gap-2 text-red-600 text-[13px] font-medium">
                       <AlertCircle size={16} />
                       {addSeriesError}
                    </div>
                 )}

                 {/* Prefix Input */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Series Name</label>
                    <input 
                      type="text" 
                      value={addSeriesPrefix}
                      onChange={(e) => setAddSeriesPrefix(e.target.value)}
                      placeholder="e.g., S"
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                 </div>

                 {/* Start & End Numbers */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-[14px] font-medium text-[#374151] mb-2">Start Number</label>
                       <input 
                         type="number" 
                         value={addSeriesStart}
                         onChange={(e) => setAddSeriesStart(e.target.value)}
                         placeholder="e.g., 1"
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                       />
                    </div>
                    <div>
                       <label className="block text-[14px] font-medium text-[#374151] mb-2">End Number</label>
                       <input 
                         type="number" 
                         value={addSeriesEnd}
                         onChange={(e) => setAddSeriesEnd(e.target.value)}
                         placeholder="e.g., 10"
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                       />
                    </div>
                 </div>

                 {/* Type Select */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Table Type</label>
                    <div className="relative">
                       <select 
                         value={addSeriesType}
                         onChange={(e) => setAddSeriesType(e.target.value)}
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors appearance-none cursor-pointer"
                       >
                          {tableTypes.map(type => (
                             <option key={type} value={type}>{type}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                    </div>
                 </div>

                 {/* Floor Select */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Floor</label>
                    <div className="relative">
                       <select 
                         value={addSeriesFloor}
                         onChange={(e) => setAddSeriesFloor(e.target.value)}
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors appearance-none cursor-pointer"
                       >
                          {floors.map(floor => (
                             <option key={floor} value={floor}>{floor}</option>
                          ))}
                       </select>
                       <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                    </div>
                 </div>

                 {/* Capacity Input */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Capacity per Table</label>
                    <input 
                      type="number" 
                      value={addSeriesCapacity}
                      onChange={(e) => setAddSeriesCapacity(e.target.value)}
                      placeholder="e.g., 4"
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                 <button 
                   onClick={() => {
                     setIsAddSeriesOpen(false);
                     setAddSeriesError('');
                   }}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handleAddSeries}
                   className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Create Series
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Manage Table Types Modal */}
      {isManageTypesOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => {
            setIsManageTypesOpen(false);
            setEditingTypeIndex(null);
            setNewTypeName('');
          }}
        >
           <div 
             className="w-full max-h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4 shrink-0">
                 <h2 className="text-lg font-bold text-slate-900">Manage Table Types</h2>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto space-y-6 mb-6 pr-2">
                 {/* Input Section */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">{editingTypeIndex !== null ? 'Update Type Name' : 'Type Name'}</label>
                    <div className="flex gap-3">
                       <input 
                         type="text" 
                         value={newTypeName}
                         onChange={(e) => setNewTypeName(e.target.value)}
                         placeholder="e.g., Lounge, Rooftop"
                         className="flex-1 h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                       />
                       <button 
                         onClick={handleAddOrUpdateType}
                         disabled={!newTypeName.trim()}
                         className={`h-[44px] px-4 rounded-[10px] font-medium text-[14px] text-white transition-all active:scale-[0.98] ${newTypeName.trim() ? 'bg-[#1E90FF]' : 'bg-slate-300'}`}
                       >
                          {editingTypeIndex !== null ? 'Update' : 'Add Type'}
                       </button>
                    </div>
                 </div>

                 {/* Managed List Section */}
                 <div className="space-y-3">
                    <h3 className="text-[14px] font-medium text-[#6B7280]">Existing Types</h3>
                    {tableTypes.map((type, idx) => (
                      <div 
                       key={idx} 
                       className="flex items-center justify-between p-3 rounded-[12px] border border-[#E5E7EB] bg-[#FFFFFF]"
                      >
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#6B7280]">
                               <Tag size={14} />
                            </div>
                            <span className="text-[14px] font-medium text-[#111827]">{type}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={() => startEdit(idx)}
                              className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:bg-slate-50 rounded-full transition-colors"
                            >
                               <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteType(idx)}
                              className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                 <button 
                   onClick={() => setIsManageTypesOpen(false)}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={() => setIsManageTypesOpen(false)}
                   className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Done
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Booking Settings Modal */}
      {isBookingSettingsOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsBookingSettingsOpen(false)}
        >
           <div 
             className="w-full max-h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4 shrink-0">
                 <h2 className="text-lg font-bold text-slate-900">Booking Settings</h2>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 flex flex-col gap-6 mb-6 pr-2">
                 {/* Toggle Section */}
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[12px] border border-[#E5E7EB]">
                    <div>
                       <h4 className="text-[14px] font-medium text-[#111827]">Enable Booking Fee</h4>
                       <p className="text-[12px] text-[#6B7280] mt-0.5">Apply to normal bookings</p>
                    </div>
                    <button 
                      onClick={() => setIsBookingFeeEnabled(!isBookingFeeEnabled)}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${isBookingFeeEnabled ? 'bg-[#1E90FF]' : 'bg-slate-300'}`}
                    >
                       <div className={`w-4 h-4 bg-[#FFFFFF] rounded-full transition-transform duration-300 ${isBookingFeeEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                 </div>

                 {/* Amount Input */}
                 <div className={`transition-opacity duration-300 ${isBookingFeeEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setBookingFeeType('flat')}
                        className={`flex-1 py-2 text-[13px] font-medium rounded-[8px] border transition-all ${bookingFeeType === 'flat' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280]'}`}
                      >
                        Flat Charge
                      </button>
                      <button
                        onClick={() => setBookingFeeType('per_type')}
                        className={`flex-1 py-2 text-[13px] font-medium rounded-[8px] border transition-all ${bookingFeeType === 'per_type' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280]'}`}
                      >
                        Per Table Type
                      </button>
                    </div>

                    {bookingFeeType === 'flat' ? (
                      <>
                        <label className="block text-[14px] font-medium text-[#374151] mb-2">Default Fee Amount (₹)</label>
                        <div className="relative">
                           <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                           <input 
                             type="number" 
                             value={bookingAmount}
                             onChange={(e) => setBookingAmount(e.target.value)}
                             placeholder="e.g., 500"
                             className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] pl-10 pr-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                           />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        {tableTypes.map(type => (
                          <div key={type} className="flex items-center gap-3">
                            <span className="w-24 text-[13px] font-medium text-[#4B5563] truncate">{type}</span>
                            <div className="relative flex-1">
                               <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={14} />
                               <input 
                                 type="number" 
                                 value={bookingFeePerType[type] || ''}
                                 onChange={(e) => setBookingFeePerType({...bookingFeePerType, [type]: e.target.value})}
                                 placeholder="Amount"
                                 className="w-full h-[40px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] pl-9 pr-3 text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                               />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[12px] text-[#6B7280] mt-3">
                       This amount will be pre-authorized at the time of table booking.
                    </p>
                 </div>

                 {/* Custom Terms & Conditions */}
                 <div className="pt-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-3">
                       <div>
                          <h4 className="text-[14px] font-medium text-[#111827]">Custom Terms & Conditions</h4>
                          <p className="text-[12px] text-[#6B7280] mt-0.5">Add specific rules for bookings</p>
                       </div>
                       <button 
                         onClick={() => setBookingTermsEnabled(!bookingTermsEnabled)}
                         className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${bookingTermsEnabled ? 'bg-[#1E90FF]' : 'bg-slate-300'}`}
                       >
                          <div className={`w-4 h-4 bg-[#FFFFFF] rounded-full transition-transform duration-300 ${bookingTermsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>
                    {bookingTermsEnabled && (
                      <textarea
                        value={bookingTerms}
                        onChange={(e) => setBookingTerms(e.target.value)}
                        placeholder="Enter your custom terms and conditions here..."
                        className="w-full h-24 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] p-3 text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] resize-none mt-2 transition-colors"
                      />
                    )}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                 <button 
                   onClick={() => setIsBookingSettingsOpen(false)}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={() => setIsBookingSettingsOpen(false)}
                   className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Save Settings
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Create Booking Package Modal */}
      {isCreatePackageOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={closePackageModal}
        >
           <div 
             className="w-full max-h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4 shrink-0">
                 <h2 className="text-lg font-bold text-slate-900">{editingPackageId ? 'Edit Package' : 'Create Package'}</h2>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 flex flex-col gap-6 mb-6 pr-2">
                 {/* Package Name */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Package Name / Title</label>
                    <input 
                      type="text" 
                      value={packageForm.name}
                      onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                      placeholder="e.g., Birthday Package, Corporate Dinner"
                      className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                    />
                 </div>

                 {/* Price */}
                 <div>
                    <label className="block text-[14px] font-medium text-[#374151] mb-2">Package Price (₹)</label>
                    <div className="relative">
                       <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                       <input 
                         type="number" 
                         value={packageForm.price}
                         onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                         placeholder="e.g., 2500"
                         className="w-full h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] pl-10 pr-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                       />
                    </div>
                 </div>

                 {/* What's Included */}
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[14px] font-medium text-[#374151]">What's Included?</label>
                       <button onClick={() => addListItem('included')} className="text-[#1E90FF] flex items-center gap-1 text-[12px] font-medium">
                          <PlusCircle size={14} /> Add Item
                       </button>
                    </div>
                    <div className="space-y-2">
                       {packageForm.included?.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                             <input 
                               value={item}
                               onChange={(e) => updateListField('included', idx, e.target.value)}
                               placeholder={`Point ${idx + 1}`}
                               className="flex-1 h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                             />
                             <button onClick={() => removeListItem('included', idx)} className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-colors">
                                <MinusCircle size={18} />
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* What's Excluded */}
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[14px] font-medium text-[#374151]">What's Excluded?</label>
                       <button onClick={() => addListItem('excluded')} className="text-[#1E90FF] flex items-center gap-1 text-[12px] font-medium">
                          <PlusCircle size={14} /> Add Item
                       </button>
                    </div>
                    <div className="space-y-2">
                       {packageForm.excluded?.map((item, idx) => (
                          <div key={idx} className="flex gap-2">
                             <input 
                               value={item}
                               onChange={(e) => updateListField('excluded', idx, e.target.value)}
                               placeholder={`Point ${idx + 1}`}
                               className="flex-1 h-[44px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] transition-colors"
                             />
                             <button onClick={() => removeListItem('excluded', idx)} className="w-[44px] h-[44px] rounded-[10px] flex items-center justify-center text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-colors">
                                <MinusCircle size={18} />
                             </button>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Custom Terms & Conditions */}
                 <div className="pt-4 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-3">
                       <div>
                          <h4 className="text-[14px] font-medium text-[#111827]">Custom Terms & Conditions</h4>
                          <p className="text-[12px] text-[#6B7280] mt-0.5">Add specific rules for this package</p>
                       </div>
                       <button 
                         onClick={() => setPackageForm({ ...packageForm, termsEnabled: !packageForm.termsEnabled })}
                         className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative ${packageForm.termsEnabled ? 'bg-[#1E90FF]' : 'bg-slate-300'}`}
                       >
                          <div className={`w-4 h-4 bg-[#FFFFFF] rounded-full transition-transform duration-300 ${packageForm.termsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                       </button>
                    </div>
                    {packageForm.termsEnabled && (
                      <textarea
                        value={packageForm.terms || ''}
                        onChange={(e) => setPackageForm({ ...packageForm, terms: e.target.value })}
                        placeholder="Enter your custom terms and conditions here..."
                        className="w-full h-24 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] p-3 text-[14px] text-[#111827] focus:outline-none focus:border-[#1E90FF] resize-none mt-2 transition-colors"
                      />
                    )}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                 <button 
                   onClick={closePackageModal}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                   onClick={handleSavePackage}
                   className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    {editingPackageId ? 'Update Package' : 'Create Package'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Manage Packages Modal */}
      {isManagePackagesOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 sm:items-center transition-opacity"
          onClick={() => setIsManagePackagesOpen(false)}
        >
           <div 
             className="w-full max-h-[90vh] bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl sm:max-w-md p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300 flex flex-col"
             onClick={(e) => e.stopPropagation()}
           >
              {/* Modal Header */}
              <div className="mb-4 shrink-0">
                 <h2 className="text-lg font-bold text-slate-900">Manage Packages</h2>
              </div>

              {/* Package List */}
              <div className="overflow-y-auto flex-1 flex flex-col gap-4 mb-6 pr-2">
                 {packages.length === 0 ? (
                   <div className="py-10 text-center">
                      <Gift size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                      <p className="text-[14px] font-medium text-[#6B7280]">No Packages Created</p>
                   </div>
                 ) : (
                   packages.map((pkg) => (
                     <div 
                       key={pkg.id} 
                       className={`p-4 rounded-[16px] border transition-all duration-300 ${
                         pkg.status === 'paused' ? 'bg-slate-50 border-[#E5E7EB] grayscale' : 'bg-[#FFFFFF] border-[#E5E7EB]'
                       }`}
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                 <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-medium uppercase tracking-wider border ${
                                    pkg.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-[#6B7280] border-[#E5E7EB]'
                                 }`}>
                                    {pkg.status}
                                 </span>
                                 <h3 className="text-[15px] font-semibold text-[#111827]">{pkg.name}</h3>
                              </div>
                              <p className="text-[16px] font-bold text-[#1E90FF]">₹{pkg.price}</p>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => togglePackageStatus(pkg.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                   pkg.status === 'active' ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                                }`}
                              >
                                 {pkg.status === 'active' ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                              </button>
                              <button 
                                onClick={() => startEditPackage(pkg)}
                                className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition-all"
                              >
                                 <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => deletePackage(pkg.id)}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all"
                              >
                                 <Trash2 size={14} />
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E5E7EB]">
                           <div>
                              <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-0.5">Included</p>
                              <p className="text-[13px] font-medium text-[#111827]">{pkg.included.length} Items</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-0.5">Excluded</p>
                              <p className="text-[13px] font-medium text-[#111827]">{pkg.excluded.length} Items</p>
                           </div>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 shrink-0">
                 <button 
                   onClick={() => setIsManagePackagesOpen(false)}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={() => setIsManagePackagesOpen(false)}
                    className="flex-1 py-3 px-4 bg-[#1E90FF] text-white font-semibold rounded-xl active:scale-95 transition-transform"
                 >
                    Done
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};
