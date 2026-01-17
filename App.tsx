import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Menu, Coffee, Wine, Pizza, CakeSlice, GlassWater, 
  Utensils, Star, ArrowLeft, Sun, Beer, Martini,
  Lock, CheckCircle, XCircle, LogOut, Save, Search, Settings,
  ShoppingBag, CalendarDays, ChevronLeft, Phone, Clock, Users, Mail, MessageSquare, MapPin,
  Plus, Minus, Trash2, ShoppingCart, X, ChevronRight, CreditCard, Receipt, Edit3, Download, Upload, FileSpreadsheet,
  AlertCircle, LayoutGrid, QrCode, Printer, Share2, Copy, ExternalLink
} from 'lucide-react';
import { menuData as initialMenuData } from './data';
import { MenuSection, MenuItem, SubSection } from './types';

// --- Types & Enums for View State ---
type ViewState = 'landing' | 'dashboard' | 'detail' | 'full-menu' | 'collection-menu' | 'login' | 'backoffice';

interface CartItem {
  id: string; // unique id for cart entry
  menuItem: MenuItem;
  quantity: number;
  selectedVariant?: { label: string; price: string };
  selectedExtras: { label: string; price: string }[];
  selectedModifiers: Record<string, string>; // e.g., "Temperature": "Medium"
  specialInstructions: string;
  totalPrice: number;
}

// --- Constants ---
const BACKGROUND_IMAGES = [
  'https://i.imgur.com/tHIRdgC.jpeg',
  'https://i.imgur.com/NK5nud3.jpeg',
  'https://i.imgur.com/NBe9bsz.jpeg',
  'https://i.imgur.com/2ET9ZU6.jpeg',
  'https://i.imgur.com/2Gkfx52.jpeg',
  'https://i.imgur.com/TRE0NWZ.jpeg'
];

// Initial Smart Modifiers Configuration
const INITIAL_MODIFIER_DEFS: Record<string, string[]> = {
  "Temperature": ["Bleu", "Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"],
  "Select Sauce": ["Pepper", "Mushroom", "Cheese", "Chimichurri", "Garlic Butter", "Peri-Peri", "Garlic Sauce"],
  "Select Patty": ["Beef", "Chicken"],
  "Egg Style": ["Fried", "Scrambled", "Poached"],
  "Egg Doneness": ["Soft", "Medium", "Hard"]
};

// --- Helper Functions ---
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
};

const formatPrice = (amount: number): string => {
  return `R${amount}`;
};

// --- Components ---

const AdminLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => (
  <div className="flex items-center gap-3 select-none">
    <div className="relative">
      <div className={`bg-gradient-to-br from-lucy-800 to-lucy-900 text-white rounded-xl shadow-lg shadow-lucy-900/20 flex items-center justify-center ${size === 'lg' ? 'p-3' : 'p-2'}`}>
        <Utensils className={size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'} />
      </div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></div>
    </div>
    <div className="flex flex-col">
      <span className={`font-serif font-bold text-slate-800 leading-none ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>Lucy Blu</span>
      <span className="text-[10px] font-extrabold tracking-[0.2em] text-lucy-600 uppercase mt-1">Online Admin</span>
    </div>
  </div>
);

const BackgroundSlideshow: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Preload images
    BACKGROUND_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-stone-900">
      {BACKGROUND_IMAGES.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
      {/* Texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
    </div>
  );
};

// --- Edit Item Modal ---
const EditItemModal: React.FC<{
  item: MenuItem;
  modifierDefs: Record<string, string[]>;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
  onCreateModifierDef: (name: string) => void;
}> = ({ item, modifierDefs, onSave, onCancel, onCreateModifierDef }) => {
  const [formData, setFormData] = useState<MenuItem>({
    ...item,
    extras: item.extras ? [...item.extras] : [],
    modifiers: item.modifiers ? [...item.modifiers] : [],
    variants: item.variants ? [...item.variants] : [],
  });
  
  const suggestedModifiers = useMemo(() => {
     return [...Object.keys(modifierDefs), "Burger Extras", "Pizza Toppings"];
  }, [modifierDefs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addExtra = () => {
    setFormData(prev => ({
      ...prev,
      extras: [...(prev.extras || []), { label: '', price: '' }]
    }));
  };

  const updateExtra = (index: number, field: 'label' | 'price', value: string) => {
    const newExtras = [...(formData.extras || [])];
    newExtras[index] = { ...newExtras[index], [field]: value };
    setFormData(prev => ({ ...prev, extras: newExtras }));
  };

  const removeExtra = (index: number) => {
    const newExtras = [...(formData.extras || [])];
    newExtras.splice(index, 1);
    setFormData(prev => ({ ...prev, extras: newExtras }));
  };

  const [newModifier, setNewModifier] = useState('');

  const addModifier = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedMod = newModifier.trim();
    
    if (trimmedMod && !formData.modifiers?.includes(trimmedMod)) {
      const isKnown = Object.prototype.hasOwnProperty.call(modifierDefs, trimmedMod) || 
                      ["Burger Extras", "Pizza Toppings"].includes(trimmedMod);
      
      if (!isKnown) {
          onCreateModifierDef(trimmedMod);
      }

      setFormData(prev => ({
        ...prev,
        modifiers: [...(prev.modifiers || []), trimmedMod]
      }));
      setNewModifier('');
    }
  };

  const removeModifier = (mod: string) => {
    setFormData(prev => ({
      ...prev,
      modifiers: (prev.modifiers || []).filter(m => m !== mod)
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50 rounded-t-2xl">
          <h2 className="font-serif text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-lucy-700" /> Edit Item
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
               <input 
                 type="text" 
                 name="name" 
                 value={formData.name} 
                 onChange={handleInputChange} 
                 className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-lucy-600 outline-none font-bold text-slate-800"
               />
            </div>
            
            <div className="md:col-span-2">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
               <textarea 
                 name="description" 
                 value={formData.description || ''} 
                 onChange={handleInputChange} 
                 rows={3}
                 className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-lucy-600 outline-none text-slate-600 text-sm"
               />
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price</label>
               <input 
                 type="text" 
                 name="price" 
                 value={formData.price} 
                 onChange={handleInputChange} 
                 className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-lucy-600 outline-none font-bold text-emerald-700"
               />
            </div>

            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
               <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl bg-stone-50 cursor-pointer hover:bg-white transition-colors">
                  <input 
                    type="checkbox" 
                    name="availableForDelivery" 
                    checked={formData.availableForDelivery !== false} 
                    onChange={(e) => setFormData(prev => ({...prev, availableForDelivery: e.target.checked}))}
                    className="w-5 h-5 text-lucy-600 rounded focus:ring-lucy-500"
                  />
                  <span className="text-sm font-bold text-slate-700">Available for Order</span>
               </label>
            </div>
          </div>

          <div className="border-t border-stone-100 my-4"></div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Super Modifiers</label>
              <div className="flex gap-2 flex-1 ml-4">
                 <div className="relative flex-1">
                    <input 
                       type="text"
                       list="modifier-suggestions-edit"
                       value={newModifier} 
                       onChange={(e) => setNewModifier(e.target.value)}
                       placeholder="Select or Create Modifier..."
                       className="w-full p-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-lucy-500"
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                               e.preventDefault();
                               addModifier();
                           }
                       }}
                    />
                    <datalist id="modifier-suggestions-edit">
                        {suggestedModifiers.filter(m => !formData.modifiers?.includes(m)).map(m => (
                           <option key={m} value={m} />
                        ))}
                    </datalist>
                 </div>
                 <button 
                   type="button" 
                   onClick={(e) => addModifier(e)} 
                   disabled={!newModifier.trim()} 
                   className="bg-lucy-100 text-lucy-800 p-2 rounded-lg hover:bg-lucy-200 disabled:opacity-50"
                 >
                    <Plus className="w-4 h-4" />
                 </button>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 mb-3 italic flex items-center gap-1">
               <AlertCircle className="w-3 h-3" />
               Typing a new name will create a new modifier group.
            </p>

            <div className="flex flex-wrap gap-2">
              {!formData.modifiers || formData.modifiers.length === 0 ? (
                 <span className="text-sm text-slate-400 italic">No modifiers active.</span>
              ) : (
                 formData.modifiers.map(mod => {
                   const options = modifierDefs[mod] || [];
                   const isSpecial = ["Burger Extras", "Pizza Toppings"].includes(mod);
                   const isEmpty = !isSpecial && options.length === 0;

                   return (
                   <span key={mod} className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border ${isEmpty ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-lucy-50 text-lucy-800 border-lucy-100'}`}>
                      {mod}
                      {isEmpty && <span className="text-[10px] font-normal opacity-70">(No options)</span>}
                      <button onClick={() => removeModifier(mod)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                   </span>
                   );
                 })
              )}
            </div>
          </div>

          <div className="border-t border-stone-100 my-4"></div>

          <div>
            <div className="flex justify-between items-center mb-4">
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Item Extras</label>
               <button onClick={addExtra} className="text-xs font-bold text-lucy-700 hover:text-lucy-900 flex items-center gap-1 bg-lucy-50 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus className="w-3 h-3" /> Add New Extra
               </button>
            </div>

            <div className="space-y-3">
               {!formData.extras || formData.extras.length === 0 ? (
                  <span className="text-sm text-slate-400 italic">No extras configured.</span>
               ) : (
                  formData.extras.map((extra, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                       <input 
                         type="text" 
                         placeholder="Extra Label"
                         value={extra.label}
                         onChange={(e) => updateExtra(idx, 'label', e.target.value)}
                         className="flex-1 p-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-lucy-400"
                       />
                       <input 
                         type="text" 
                         placeholder="Price (e.g. +R10)"
                         value={extra.price}
                         onChange={(e) => updateExtra(idx, 'price', e.target.value)}
                         className="w-24 p-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-lucy-400"
                       />
                       <button onClick={() => removeExtra(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))
               )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50 rounded-b-2xl flex justify-end gap-3">
           <button onClick={onCancel} className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-stone-200 transition-colors">Cancel</button>
           <button onClick={() => onSave(formData)} className="px-8 py-2.5 rounded-xl font-bold bg-lucy-800 text-white hover:bg-lucy-900 shadow-lg shadow-lucy-900/10 transition-all flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Modifier Group Editor Component ---
const ModifierGroupEditor: React.FC<{
  groupKey: string;
  options: string[];
  onAddOption: (opt: string) => void;
  onRemoveOption: (opt: string) => void;
  onDeleteGroup: () => void;
}> = ({ groupKey, options, onAddOption, onRemoveOption, onDeleteGroup }) => {
  const [newOption, setNewOption] = useState('');

  const handleAdd = () => {
    if (newOption.trim()) {
        onAddOption(newOption.trim());
        setNewOption('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
               {groupKey.charAt(0).toUpperCase()}
            </div>
            <h4 className="font-bold text-slate-800 text-lg">{groupKey}</h4>
         </div>
         <button onClick={onDeleteGroup} className="text-slate-300 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100">
            <Trash2 className="w-5 h-5" />
         </button>
      </div>
      
      <div className="p-4">
         <div className="flex flex-wrap gap-2 mb-4">
            {options.map(opt => (
               <span key={opt} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 text-slate-700 font-medium text-sm border border-stone-200 group/tag hover:border-lucy-300 transition-colors">
                  {opt}
                  <button onClick={() => onRemoveOption(opt)} className="text-slate-400 hover:text-red-500">
                     <X className="w-3.5 h-3.5" />
                  </button>
               </span>
            ))}
            {options.length === 0 && <span className="text-slate-400 italic text-sm py-1.5">No options defined. Add one below.</span>}
         </div>

         <div className="flex gap-2">
             <input 
                type="text" 
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Add option..."
                className="flex-1 p-2 border border-stone-200 rounded-lg text-sm focus:border-lucy-500 focus:ring-2 focus:ring-lucy-200 outline-none transition-all"
             />
             <button onClick={handleAdd} disabled={!newOption.trim()} className="bg-slate-800 text-white px-4 rounded-lg font-bold text-sm hover:bg-slate-900 disabled:opacity-50 transition-colors">
                Add
             </button>
         </div>
      </div>
    </div>
  );
};

// --- Marketing & QR Tab Component ---
const MarketingTab: React.FC = () => {
  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(currentUrl)}&color=0f172a&bgcolor=ffffff&format=png`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
           <h2 className="text-3xl font-serif font-bold text-slate-800">Marketing & QR Codes</h2>
           <p className="text-slate-500 mt-1">Generate print-ready materials for your customers.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-lucy-800 text-white rounded-xl font-bold hover:bg-lucy-900 transition-all shadow-lg shadow-lucy-900/10">
              <Printer className="w-4 h-4" /> Print Poster
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: QR Tool */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <QrCode className="w-5 h-5 text-lucy-600" /> Digital Link
              </h3>
              <div className="flex flex-col gap-4">
                 <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 break-all text-sm font-mono text-slate-600 relative group">
                    {currentUrl}
                    <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors shadow-sm">
                       {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleCopy} className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                       <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <a href={qrUrl} download="lucy-blu-qr.png" className="flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors">
                       <Download className="w-4 h-4" /> Download QR
                    </a>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Usage Tips</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                 <li className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 text-xs font-bold">1</div>
                    Place QR codes on every table to reduce physical menu handling.
                 </li>
                 <li className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 text-xs font-bold">2</div>
                    Include the QR on delivery flyers to encourage repeat direct orders.
                 </li>
                 <li className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 text-xs font-bold">3</div>
                    Posters at the collection counter help waiting guests browse while they wait.
                 </li>
              </ul>
           </div>
        </div>

        {/* Right Column: Poster Preview */}
        <div className="space-y-4">
           <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Poster Preview (A4/Flyer)</label>
           
           {/* The Printable Area */}
           <div id="printable-poster" className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden print:shadow-none print:border-none aspect-[1/1.414] flex flex-col items-center p-12 text-center">
              <div className="flex flex-col items-center mb-10">
                <div className="bg-lucy-800 text-white p-4 rounded-2xl mb-4">
                   <Utensils className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-serif font-bold text-slate-800 tracking-tight">Lucy Blu</h1>
                <div className="text-xs font-bold tracking-[0.4em] text-lucy-600 uppercase mt-2">Restaurant & Bar</div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center w-full">
                <div className="mb-8">
                   <h2 className="text-3xl font-serif italic text-slate-800 mb-2">Deliciousness is just a scan away.</h2>
                   <p className="text-slate-500 text-lg">Scan to view our complete menu <br/> and order for collection.</p>
                </div>

                <div className="relative p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-inner mb-8">
                   <img src={qrUrl} alt="QR Code" className="w-56 h-56" />
                   <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-lucy-800 text-white rounded-full flex items-center justify-center shadow-lg">
                      <QrCode className="w-5 h-5" />
                   </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="px-6 py-2 border-2 border-lucy-800/20 text-lucy-800 rounded-full font-bold text-sm">
                    Collection & Dine-in
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-100 w-full">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">www.lucyblu.com</p>
              </div>
           </div>
           
           <p className="text-center text-xs text-slate-400 italic">This poster is optimized for A4 and flyer printing.</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-poster, #printable-poster * { visibility: visible; }
          #printable-poster {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 2cm;
            margin: 0;
            box-shadow: none;
            border: none;
          }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  // Application State
  const [menu, setMenu] = useState<MenuSection[]>(initialMenuData);
  const [modifierDefs, setModifierDefs] = useState<Record<string, string[]>>(INITIAL_MODIFIER_DEFS);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isCollectionMode, setIsCollectionMode] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Computed: Pizza Toppings from "Build Your Own"
  const pizzaToppings = useMemo(() => {
    const pizzaSection = menu.find(s => s.id === 'pizza');
    if (!pizzaSection) return [];
    const buildYourOwn = pizzaSection.content.find(sub => sub.title === "Build Your Own");
    if (!buildYourOwn) return [];
    
    const toppings: { label: string; price: string; description?: string }[] = [];
    
    buildYourOwn.items.forEach(group => {
      if (group.description) {
        const items = group.description.split(',').map(s => s.trim().replace(/\.$/, ''));
        items.forEach(itemName => {
          if (itemName) {
            toppings.push({
              label: itemName,
              price: group.price,
            });
          }
        });
      } else {
        toppings.push({
          label: group.name,
          price: group.price,
          description: group.description
        });
      }
    });
    
    return toppings;
  }, [menu]);

  // Computed: Burger Toppings
  const burgerToppings = useMemo(() => {
    const mainsSection = menu.find(s => s.id === 'mains');
    if (!mainsSection) return [];
    const toppingsSub = mainsSection.content.find(sub => sub.title === "Burger Toppings");
    if (!toppingsSub) return [];
    
    return toppingsSub.items.map(item => ({
        label: item.name,
        price: item.price,
        description: item.description
    }));
  }, [menu]);

  // Handlers
  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setSelectedCategoryId(null);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleLoginSuccess = () => {
    setCurrentView('backoffice');
  };

  const handleLogout = () => {
    setCurrentView('landing');
  };

  const handleMenuUpdate = (updatedMenu: MenuSection[]) => {
    setMenu(updatedMenu);
  };
  
  const handleModifierDefsUpdate = (newDefs: Record<string, string[]>) => {
      setModifierDefs(newDefs);
  };

  const handleModeSelect = (collection: boolean) => {
    setIsCollectionMode(collection);
    if (collection) {
      setCurrentView('collection-menu');
    } else {
      setCurrentView('full-menu');
    }
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        const unitPrice = item.totalPrice / item.quantity;
        return { ...item, quantity: newQty, totalPrice: unitPrice * newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen font-sans bg-stone-50 text-slate-800 flex flex-col relative overflow-hidden">
      {(currentView === 'landing' || currentView === 'dashboard') && <BackgroundSlideshow />}

      <div className="relative z-10 flex-1 flex flex-col">
        {currentView === 'detail' && selectedCategoryId ? (
          <DetailView 
            section={menu.find(c => c.id === selectedCategoryId)!} 
            onBack={handleBackToDashboard}
            isCollectionMode={isCollectionMode}
          />
        ) : currentView === 'full-menu' ? (
          <FullMenuView 
            menu={menu}
            onBack={handleBackToLanding}
          />
        ) : currentView === 'collection-menu' ? (
          <CollectionMenuView 
            menu={menu}
            modifierDefs={modifierDefs}
            onBack={handleBackToLanding}
            onAddToCart={addToCart}
            cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
            onOpenCart={() => setIsCartOpen(true)}
            pizzaToppings={pizzaToppings}
            burgerToppings={burgerToppings}
          />
        ) : currentView === 'login' ? (
          <LoginView 
            onSuccess={handleLoginSuccess} 
            onCancel={handleBackToLanding} 
          />
        ) : currentView === 'backoffice' ? (
          <BackOfficeView 
            menu={menu} 
            modifierDefs={modifierDefs}
            onUpdate={handleMenuUpdate}
            onUpdateModifierDefs={handleModifierDefsUpdate}
            onLogout={handleLogout} 
          />
        ) : currentView === 'dashboard' ? (
          <DashboardView 
            menu={menu}
            onSelect={handleCategorySelect}
            onBack={handleBackToLanding}
            isCollectionMode={isCollectionMode}
          />
        ) : (
          <LandingView 
            onSelectMode={handleModeSelect}
            onLoginRequest={() => setCurrentView('login')}
          />
        )}
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQuantity}
        onClear={clearCart}
      />
    </div>
  );
};

// --- Landing View ---
const LandingView: React.FC<{
  onSelectMode: (isCollection: boolean) => void;
  onLoginRequest: () => void;
}> = ({ onSelectMode, onLoginRequest }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="container mx-auto px-4 py-8 flex flex-col h-full max-w-5xl">
        <div className="text-center mt-8 mb-auto relative animate-in fade-in slide-in-from-top-10 duration-700">
          <h1 className="font-serif text-6xl md:text-8xl text-white mb-2 tracking-tight drop-shadow-xl">
            Lucy Blu
          </h1>
          <p className="text-lg md:text-2xl tracking-[0.4em] text-stone-200 uppercase font-light drop-shadow-md">
            Restaurant & Bar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 w-full max-w-4xl mx-auto my-12">
          <button 
            onClick={() => onSelectMode(true)}
            className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl text-left"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-colors"></div>
            <ShoppingBag className="w-12 h-12 text-emerald-300 mb-4 drop-shadow-lg" />
            <h2 className="text-3xl font-serif text-white mb-2">Menu for Collection</h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Order your favourites for takeaway. Customize your meal and track your collection order.
            </p>
          </button>

          <button 
            onClick={() => onSelectMode(false)}
            className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl text-left"
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-lucy-500/20 rounded-full blur-2xl group-hover:bg-lucy-500/30 transition-colors"></div>
            <CalendarDays className="w-12 h-12 text-lucy-300 mb-4 drop-shadow-lg" />
            <h2 className="text-3xl font-serif text-white mb-2">View Full Menu & Book</h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Explore our complete dine-in menu and reserve your table for the full experience.
            </p>
          </button>
        </div>

        <div className="mt-auto flex flex-col sm:flex-row justify-between items-center pb-4 px-2 gap-4 sm:gap-0">
           <div className="w-40 hidden sm:block"></div>
           <div className="text-center opacity-90 flex-1">
              <p className="font-serif italic text-stone-300 drop-shadow-md text-2xl md:text-3xl font-bold tracking-wide">"Just wing it!" — Advice from a Dragonfly</p>
           </div>
           <div className="w-40 flex justify-center sm:justify-end">
             <button 
               onClick={onLoginRequest}
               className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/90 shadow-lg transition-all duration-300"
               title="Access Online Admin"
             >
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 group-hover:bg-lucy-400"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-lucy-500"></span>
               </span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300 group-hover:text-lucy-900 transition-colors">
                 Admin Log In
               </span>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Login View ---
const LoginView: React.FC<{ onSuccess: () => void; onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '790922') { 
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm fixed inset-0 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
         <div className="flex justify-center mb-6">
            <AdminLogo />
         </div>
         <h2 className="text-2xl font-serif font-bold text-center text-slate-800 mb-6">Admin Login</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
             <input 
                type="password" 
                autoFocus
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-lucy-800 outline-none"
                placeholder="Enter admin password"
             />
             {error && <p className="text-red-500 text-xs mt-2">Incorrect password.</p>}
           </div>
           <button type="submit" className="w-full bg-lucy-800 text-white font-bold py-3 rounded-xl hover:bg-lucy-900 transition-all">
             Login
           </button>
           <button type="button" onClick={onCancel} className="w-full text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors">
             Cancel
           </button>
         </form>
      </div>
    </div>
  );
};

// --- Dashboard View ---
const DashboardView: React.FC<{
  menu: MenuSection[];
  onSelect: (id: string) => void;
  onBack: () => void;
  isCollectionMode: boolean;
}> = ({ menu, onSelect, onBack }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-stone-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-full">
        <button onClick={onBack} className="absolute top-6 left-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors z-20">
           <ArrowLeft className="w-6 h-6" /> Back
        </button>
        
        <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 drop-shadow-lg text-center">Browse Menu</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl w-full">
          {menu.map(section => (
            <button 
              key={section.id}
              onClick={() => onSelect(section.id)}
              className="group relative aspect-square rounded-3xl bg-white/10 backdrop-blur border border-white/20 p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-xl"
            >
               <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-lucy-500 group-hover:text-white transition-colors">
                  {section.id === 'breakfast' && <Sun className="w-8 h-8" />}
                  {section.id === 'mains' && <Utensils className="w-8 h-8" />}
                  {section.id === 'pizza' && <Pizza className="w-8 h-8" />}
                  {section.id === 'desserts' && <CakeSlice className="w-8 h-8" />}
                  {section.id === 'drinks' && <Martini className="w-8 h-8" />}
                  {section.id === 'bar' && <Beer className="w-8 h-8" />}
                  {section.id === 'wine' && <Wine className="w-8 h-8" />}
               </div>
               <span className="text-xl font-serif text-white font-medium tracking-wide">{section.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Detail View ---
const DetailView: React.FC<{
  section: MenuSection;
  onBack: () => void;
  isCollectionMode: boolean;
}> = ({ section, onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-white animate-in slide-in-from-right duration-300 relative z-20 h-full">
       <div className="bg-lucy-900 text-white p-6 sticky top-0 z-30 shadow-md flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-serif font-bold">{section.title}</h2>
       </div>
       
       <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
         <div className="max-w-3xl mx-auto space-y-10 pb-20">
           {section.subtitle && <p className="text-center text-lucy-800 font-serif italic text-xl">{section.subtitle}</p>}
           {section.note && <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm text-center">{section.note}</div>}

           {section.content.map((sub, sIdx) => (
             <div key={sIdx}>
               {sub.title && <h3 className="font-serif text-xl text-slate-500 mb-6 pb-2 border-b border-stone-200">{sub.title}</h3>}
               <div className="grid gap-6">
                 {sub.items.map((item, iIdx) => (
                   <div key={iIdx} className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex justify-between items-start gap-4">
                      <div className="flex-1">
                         <h4 className="font-bold text-lg text-slate-800 mb-1">{item.name}</h4>
                         {item.description && <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>}
                         {item.price && <div className="mt-3 font-serif font-bold text-lucy-800">{item.price}</div>}
                      </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
};

// --- Booking Modal ---
const BookingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) setSuccess(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-2xl font-bold text-slate-800">Book a Table</h3>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Request Sent!</h4>
            <p className="text-slate-500">We'll confirm your booking shortly via SMS.</p>
            <button onClick={onClose} className="mt-6 w-full py-3 bg-slate-800 text-white font-bold rounded-xl">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                <input type="date" required className="w-full p-2 border border-stone-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                <input type="time" required className="w-full p-2 border border-stone-200 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Guests</label>
              <select className="w-full p-2 border border-stone-200 rounded-lg">
                {[2, 3, 4, 5, 6, 7, 8, '8+'].map(n => <option key={n}>{n} People</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
              <input type="text" required placeholder="Your Name" className="w-full p-2 border border-stone-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
              <input type="tel" required placeholder="082 123 4567" className="w-full p-2 border border-stone-200 rounded-lg" />
            </div>
            <button type="submit" className="w-full py-3 bg-lucy-800 text-white font-bold rounded-xl hover:bg-lucy-900 transition-colors mt-2">
              Request Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- Full Menu View ---
const FullMenuView: React.FC<{ menu: MenuSection[]; onBack: () => void }> = ({ menu, onBack }) => {
  const [showBooking, setShowBooking] = useState(false);
  
  return (
    <div className="flex-1 flex flex-col bg-stone-50 animate-in slide-in-from-bottom duration-500 relative z-20">
       <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
       
       <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-stone-100 px-4 py-3 flex justify-between items-center">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-lucy-800 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> Back
         </button>
         <button onClick={() => setShowBooking(true)} className="bg-lucy-800 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-lucy-900 transition-all">
            Book Table
         </button>
       </header>
       
       <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="text-center mb-12">
               <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-4">Our Menu</h1>
               <div className="w-24 h-1 bg-lucy-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-16">
               {menu.map(section => (
                 <div key={section.id}>
                   <div className="flex items-center justify-center mb-8">
                     <h2 className="font-serif text-3xl text-lucy-900 bg-stone-50 px-6 z-10">{section.title}</h2>
                     <div className="absolute w-full max-w-xs border-t border-stone-300 z-0"></div>
                   </div>
                   
                   {section.content.map((sub, sIdx) => (
                     <div key={sIdx} className="mb-8">
                       {sub.title && <h3 className="text-center font-serif text-xl text-slate-500 mb-6">{sub.title}</h3>}
                       <div className="space-y-6">
                         {sub.items.map((item, iIdx) => (
                           <div key={iIdx} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-8 group">
                              <div className="flex-1">
                                 <div className="flex items-baseline gap-2">
                                    <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
                                    <div className="flex-1 border-b border-dotted border-slate-300 mx-2 hidden sm:block"></div>
                                 </div>
                                 {item.description && <p className="text-slate-500 text-sm mt-1">{item.description}</p>}
                              </div>
                              <div className="font-bold text-lucy-800 whitespace-nowrap">{item.price}</div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               ))}
            </div>
            
            <div className="mt-20 text-center pb-10">
               <p className="font-serif italic text-slate-400">Items and prices subject to change.</p>
            </div>
          </div>
       </div>
    </div>
  );
};

// --- Product Modal ---
const ProductModal: React.FC<{ 
  item: MenuItem; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: (cartItem: CartItem) => void;
  modifierDefs?: Record<string, string[]>;
  pizzaToppings?: { label: string; price: string; description?: string }[];
  burgerToppings?: { label: string; price: string; description?: string }[];
}> = ({ item, isOpen, onClose, onConfirm, modifierDefs = INITIAL_MODIFIER_DEFS, pizzaToppings = [], burgerToppings = [] }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{ label: string; price: string } | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<Set<number>>(new Set<number>());
  const [selectedPizzaToppings, setSelectedPizzaToppings] = useState<Set<number>>(new Set<number>());
  const [selectedBurgerExtras, setSelectedBurgerExtras] = useState<Set<number>>(new Set<number>());
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [modifiers, setModifiers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedVariant(item.variants ? item.variants[0] : undefined);
      setSelectedExtras(new Set<number>());
      setSelectedPizzaToppings(new Set<number>());
      setSelectedBurgerExtras(new Set<number>());
      setSpecialInstructions('');
      setModifiers({});
      
      const smartModifierKeys = (item.modifiers || []).filter(m => m !== "Pizza Toppings" && m !== "Burger Extras");
      if (smartModifierKeys.length > 0) {
        const initialMods: Record<string, string> = {};
        smartModifierKeys.forEach((key) => {
          const modKey = key as string;
          const options = modifierDefs[modKey];
          if (options && options.length > 0) {
              initialMods[modKey] = options[0];
          }
          if (modKey === 'Egg Style') {
             const donenessOptions = modifierDefs['Egg Doneness'] || ["Soft", "Medium", "Hard"];
             initialMods['Egg Doneness'] = donenessOptions[0];
          }
        });
        setModifiers(initialMods);
      }
    }
  }, [isOpen, item, modifierDefs]);

  if (!isOpen) return null;

  const basePrice = selectedVariant ? parsePrice(selectedVariant.price) : parsePrice(item.price);
  const extrasTotal = (Array.from(selectedExtras) as number[]).reduce((acc: number, idx: number) => {
    return acc + parsePrice(item.extras![idx].price);
  }, 0);
  const toppingsTotal = (Array.from(selectedPizzaToppings) as number[]).reduce((acc: number, idx: number) => {
    return acc + parsePrice(pizzaToppings[idx].price);
  }, 0);
  const burgerExtrasTotal = (Array.from(selectedBurgerExtras) as number[]).reduce((acc: number, idx: number) => {
    return acc + parsePrice(burgerToppings[idx].price);
  }, 0);

  const unitPrice = basePrice + extrasTotal + toppingsTotal + burgerExtrasTotal;
  const totalPrice = unitPrice * quantity;

  // Added explicit type casts to Array.from result to avoid index-type 'unknown' errors.
  const handleConfirm = () => {
    const extrasList = (Array.from(selectedExtras) as number[]).map(idx => item.extras![idx]);
    const toppingsList = (Array.from(selectedPizzaToppings) as number[]).map(idx => ({
      label: pizzaToppings[idx].label,
      price: pizzaToppings[idx].price
    }));
    const burgerExtrasList = (Array.from(selectedBurgerExtras) as number[]).map(idx => ({
      label: burgerToppings[idx].label,
      price: burgerToppings[idx].price
    }));
    
    const cartItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      menuItem: item,
      quantity,
      selectedVariant,
      selectedExtras: [...extrasList, ...toppingsList, ...burgerExtrasList],
      selectedModifiers: modifiers,
      specialInstructions,
      totalPrice
    };
    onConfirm(cartItem);
    onClose();
  };

  const smartModifierKeys: string[] = (item.modifiers || []).filter(m => m !== "Pizza Toppings" && m !== "Burger Extras");
  const hasPizzaToppings = (item.modifiers || []).includes("Pizza Toppings");
  const hasBurgerExtras = (item.modifiers || []).includes("Burger Extras");

  return (
    <div className="fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300" role="dialog">
        <div className="p-5 border-b border-stone-100 flex justify-between items-start bg-stone-50 rounded-t-2xl">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-800">{item.name}</h3>
            <p className="text-emerald-700 font-bold text-lg mt-1">{formatPrice(unitPrice)}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-stone-100 transition-colors shadow-sm text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>

          {item.variants && (
            <div>
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">Select Option</h4>
              <div className="space-y-2">
                {item.variants.map((v, idx) => (
                  <label key={idx} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedVariant?.label === v.label ? 'border-lucy-600 bg-lucy-50 ring-1 ring-lucy-600' : 'border-stone-200 hover:border-lucy-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedVariant?.label === v.label ? 'border-lucy-600' : 'border-slate-300'}`}>
                         {selectedVariant?.label === v.label && <div className="w-2 h-2 rounded-full bg-lucy-600" />}
                      </div>
                      <span className="text-slate-700 font-medium">{v.label}</span>
                    </div>
                    <span className="text-slate-500 text-sm">{v.price}</span>
                    <input type="radio" name="variant" className="hidden" checked={selectedVariant?.label === v.label} onChange={() => setSelectedVariant(v)} />
                  </label>
                ))}
              </div>
            </div>
          )}

          {smartModifierKeys.map((key: string) => {
             const modifierKey = key;
             const options = (modifierDefs && modifierDefs[modifierKey]) ? modifierDefs[modifierKey] : [];
             if (!options || options.length === 0) return null;
             
             return (
              <div key={modifierKey}>
                <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">{modifierKey} <span className="text-lucy-600 text-xs normal-case ml-1">(Required)</span></h4>
                <div className="grid grid-cols-2 gap-2">
                  {options.map((opt, optIdx) => (
                    <label key={optIdx} className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer text-sm font-medium transition-all text-center ${modifiers[modifierKey] === opt ? 'border-red-600 bg-red-50 text-red-600 font-bold shadow-sm' : 'border-stone-200 hover:bg-stone-50 text-slate-600'}`}>
                      {opt}
                      <input type="radio" name={`mod-${modifierKey}`} className="hidden" checked={modifiers[modifierKey] === opt} onChange={() => setModifiers((prev: Record<string, string>) => ({ ...prev, [modifierKey]: opt }))} />
                    </label>
                  ))}
                </div>
                {modifierKey === 'Egg Style' && (
                   <div className="mt-3 bg-stone-50 p-3 rounded-xl border border-stone-200 animate-in fade-in slide-in-from-top-2">
                      <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Doneness</h5>
                      <div className="flex gap-2">
                        {((modifierDefs && modifierDefs['Egg Doneness']) || ["Soft", "Medium", "Hard"]).map((doneness) => (
                          <label key={doneness} className={`flex-1 text-center py-2 rounded-lg border text-sm cursor-pointer transition-all ${modifiers['Egg Doneness'] === doneness ? 'border-red-600 bg-red-50 text-red-600 font-bold shadow-sm' : 'bg-white border-stone-200 text-slate-600 hover:border-lucy-300'}`}>
                             {doneness}
                             <input type="radio" name="egg-doneness" className="hidden" checked={modifiers['Egg Doneness'] === doneness} onChange={() => setModifiers(prev => ({ ...prev, 'Egg Doneness': doneness }))} />
                          </label>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            );
          })}

          {hasPizzaToppings && pizzaToppings.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">Add Extra Toppings</h4>
              <div className="space-y-2">
                {pizzaToppings.map((topping, idx) => {
                  const isSelected = selectedPizzaToppings.has(idx);
                  return (
                    <label key={idx} className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-emerald-300'}`}>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                              {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-slate-700 font-medium">{topping.label}</span>
                         </div>
                         <span className="text-emerald-700 font-bold text-sm">+{topping.price}</span>
                       </div>
                       {topping.description && <p className="text-xs text-slate-500 mt-1 ml-8">{topping.description}</p>}
                       <input type="checkbox" className="hidden" checked={isSelected} onChange={() => {
                          const next = new Set(selectedPizzaToppings);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedPizzaToppings(next);
                        }} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {hasBurgerExtras && burgerToppings.length > 0 && (
            <div>
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">Add Burger Extras</h4>
              <div className="space-y-2">
                {burgerToppings.map((topping, idx) => {
                  const isSelected = selectedBurgerExtras.has(idx);
                  return (
                    <label key={idx} className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-emerald-300'}`}>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                              {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-slate-700 font-medium">{topping.label}</span>
                         </div>
                         <span className="text-emerald-700 font-bold text-sm">+{topping.price}</span>
                       </div>
                       {topping.description && <p className="text-xs text-slate-500 mt-1 ml-8">{topping.description}</p>}
                       <input type="checkbox" className="hidden" checked={isSelected} onChange={() => {
                          const next = new Set(selectedBurgerExtras);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedBurgerExtras(next);
                        }} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {item.extras && (
            <div>
              <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3">Extras</h4>
              <div className="space-y-2">
                {item.extras.map((extra, idx) => {
                  const isSelected = selectedExtras.has(idx);
                  return (
                    <label key={idx} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:border-emerald-300'}`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                            {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className="text-slate-700">{extra.label}</span>
                       </div>
                       <span className="text-emerald-700 font-medium text-sm">+{extra.price}</span>
                       <input type="checkbox" className="hidden" checked={isSelected} onChange={() => {
                          const next = new Set(selectedExtras);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedExtras(next);
                        }} />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Special Instructions</h4>
            <textarea className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-lucy-600 outline-none bg-stone-50 focus:bg-white transition-all" placeholder="E.g. No onions, sauce on side..." rows={3} value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
          </div>
        </div>

        <div className="p-5 border-t border-stone-100 bg-white sm:rounded-b-2xl shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-stone-100 rounded-full p-1 border border-stone-200">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-105 active:scale-95 transition-all text-slate-600"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center font-bold text-lg text-slate-800">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-lucy-800 text-white shadow-sm hover:bg-lucy-900 hover:scale-105 active:scale-95 transition-all"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={handleConfirm} className="flex-1 bg-lucy-800 text-white font-bold py-3.5 rounded-full hover:bg-lucy-900 transition-all shadow-lg shadow-lucy-900/20 active:translate-y-0.5 flex items-center justify-between px-6"><span>Add to Order</span><span>{formatPrice(totalPrice)}</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Collection Menu View ---
const CollectionMenuView: React.FC<{
  menu: MenuSection[];
  modifierDefs: Record<string, string[]>;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  cartCount: number;
  onOpenCart: () => void;
  pizzaToppings: { label: string; price: string; description?: string }[];
  burgerToppings: { label: string; price: string; description?: string }[];
}> = ({ menu, modifierDefs, onBack, onAddToCart, cartCount, onOpenCart, pizzaToppings, burgerToppings }) => {
  const [activeCategory, setActiveCategory] = useState<string>(menu[0]?.id || '');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const scrollToSection = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-50 animate-in slide-in-from-right duration-300 relative z-20 h-full">
      {selectedItem && (
        <ProductModal 
          item={selectedItem} 
          isOpen={!!selectedItem} 
          onClose={() => setSelectedItem(null)}
          onConfirm={onAddToCart}
          modifierDefs={modifierDefs}
          pizzaToppings={pizzaToppings}
          burgerToppings={burgerToppings}
        />
      )}

      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur shadow-sm border-b border-stone-100 px-4 py-3 flex justify-between items-center">
        <button onClick={onBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-slate-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center font-serif font-bold text-xl text-slate-800">Order for Collection</div>
        <button onClick={onOpenCart} className="relative p-2 hover:bg-stone-100 rounded-full transition-colors text-slate-600">
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-lucy-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">{cartCount}</span>
          )}
        </button>
      </header>

      <div className="bg-white border-b border-stone-100 sticky top-[60px] z-20 overflow-x-auto no-scrollbar">
        <div className="flex px-4 gap-2 py-3 min-w-max">
          {menu.map(section => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === section.id ? 'bg-lucy-800 text-white shadow-md' : 'bg-stone-100 text-slate-600 hover:bg-stone-200'}`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-12">
           {menu.map(section => {
             const hasDeliverableItems = section.content.some(sub => sub.items.some(i => i.availableForDelivery !== false));
             if (!hasDeliverableItems) return null;

             return (
               <div key={section.id} id={`section-${section.id}`} className="scroll-mt-36">
                 <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-serif text-3xl font-bold text-slate-800">{section.title}</h2>
                    <div className="h-px bg-stone-200 flex-1"></div>
                 </div>
                 {section.subtitle && <p className="text-slate-400 italic font-serif -mt-4 mb-8 text-lg">{section.subtitle}</p>}
                 {section.content.map((sub, sIdx) => {
                   const deliverableSubItems = sub.items.filter(i => i.availableForDelivery !== false);
                   if (deliverableSubItems.length === 0) return null;
                   return (
                     <div key={sIdx} className="mb-10 last:mb-0">
                       {sub.title && <h3 className="font-bold text-slate-700 text-lg mb-4 pl-2 border-l-4 border-lucy-500">{sub.title}</h3>}
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                         {deliverableSubItems.map((item, iIdx) => (
                           <div key={iIdx} onClick={() => setSelectedItem(item)} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-lucy-200 hover:shadow-md flex flex-col h-full group">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2 gap-2">
                                  <h4 className="font-bold text-slate-800 leading-tight group-hover:text-lucy-800 transition-colors">{item.name}</h4>
                                  <span className="font-bold text-lucy-800 bg-lucy-50 px-2.5 py-1 rounded text-sm whitespace-nowrap">{item.price}</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{item.description}</p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-stone-50 flex justify-end">
                                 <button className="bg-stone-100 py-1.5 px-3 rounded-lg text-lucy-800 text-xs font-bold group-hover:bg-lucy-800 group-hover:text-white transition-colors flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   );
                 })}
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

// --- Back Office View ---
const BackOfficeView: React.FC<{
  menu: MenuSection[];
  modifierDefs: Record<string, string[]>;
  onUpdate: (menu: MenuSection[]) => void;
  onUpdateModifierDefs: (defs: Record<string, string[]>) => void;
  onLogout: () => void;
}> = ({ menu, modifierDefs, onUpdate, onUpdateModifierDefs, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('menu');
  const [editingItemCtx, setEditingItemCtx] = useState<{sIdx: number, subIdx: number, iIdx: number, item: MenuItem} | null>(null);
  const [newGroupKey, setNewGroupKey] = useState('');

  const handleUpdateItem = (sectionIdx: number, subIdx: number, itemIdx: number, updatedItem: MenuItem) => {
    const newMenu = [...menu];
    const newSection = { ...newMenu[sectionIdx] };
    const newContent = [...newSection.content];
    const newSub = { ...newContent[subIdx] };
    const newItems = [...newSub.items];
    newItems[itemIdx] = updatedItem;
    newSub.items = newItems;
    newContent[subIdx] = newSub;
    newSection.content = newContent;
    newMenu[sectionIdx] = newSection;
    onUpdate(newMenu);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 h-full overflow-hidden print:overflow-visible print:bg-white">
      {editingItemCtx && (
         <EditItemModal 
            item={editingItemCtx.item}
            modifierDefs={modifierDefs}
            onSave={(newItem) => {
               handleUpdateItem(editingItemCtx.sIdx, editingItemCtx.subIdx, editingItemCtx.iIdx, newItem);
               setEditingItemCtx(null);
            }}
            onCancel={() => setEditingItemCtx(null)}
            onCreateModifierDef={(name) => {
                if (!modifierDefs[name]) {
                    onUpdateModifierDefs({ ...modifierDefs, [name]: [] });
                }
            }}
         />
      )}

      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg z-20 print:hidden">
        <div className="flex items-center gap-3">
           <AdminLogo size="sm" />
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
           <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden print:overflow-visible">
        <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col print:hidden">
           <nav className="p-4 space-y-2">
             <button onClick={() => setActiveTab('menu')} className={`w-full text-left p-3 rounded-lg font-bold flex items-center gap-3 transition-all ${activeTab === 'menu' ? 'bg-lucy-50 text-lucy-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                <FileSpreadsheet className="w-5 h-5" /> Menu Items
             </button>
             <button onClick={() => setActiveTab('modifiers')} className={`w-full text-left p-3 rounded-lg font-bold flex items-center gap-3 transition-all ${activeTab === 'modifiers' ? 'bg-lucy-50 text-lucy-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                <LayoutGrid className="w-5 h-5" /> Modifiers
             </button>
             <button onClick={() => setActiveTab('marketing')} className={`w-full text-left p-3 rounded-lg font-bold flex items-center gap-3 transition-all ${activeTab === 'marketing' ? 'bg-lucy-50 text-lucy-800' : 'text-slate-500 hover:bg-slate-50'}`}>
                <QrCode className="w-5 h-5" /> Marketing & QR
             </button>
           </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
           {activeTab === 'menu' ? (
             <div className="max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">Menu Management</h2>
                 <div className="text-xs text-slate-500 flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                    <AlertCircle className="w-3 h-3" /> Double-click any item to edit details
                 </div>
               </div>
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 {menu.map((section: MenuSection, sIdx) => (
                   <div key={section.id} className="border-b border-slate-100 last:border-0">
                     <div className="bg-slate-50 p-4 font-bold text-slate-700 flex justify-between items-center sticky top-0">
                        {section.title}
                        <span className="text-xs text-slate-400 font-normal uppercase tracking-wider">{section.id}</span>
                     </div>
                     <div className="divide-y divide-slate-100">
                       {section.content.map((sub: SubSection, subIdx) => sub.items.map((item: MenuItem, iIdx) => (
                         <div key={`${section.id}-${subIdx}-${iIdx}`} onDoubleClick={() => setEditingItemCtx({ sIdx, subIdx, iIdx, item: { ...item } })} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div>
                               <div className="font-bold text-slate-800 group-hover:text-lucy-700 transition-colors">{item.name}</div>
                               <div className="text-xs text-slate-500">{item.price}</div>
                            </div>
                            <div className="flex items-center gap-6">
                               <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
                                  <input type="checkbox" checked={item.availableForDelivery !== false} onChange={(e) => handleUpdateItem(sIdx, subIdx, iIdx, { ...item, availableForDelivery: e.target.checked })} className="rounded text-lucy-600 focus:ring-lucy-500 w-4 h-4" />
                                  <span className={item.availableForDelivery === false ? 'text-slate-400' : 'text-slate-700 font-medium'}>Available</span>
                               </label>
                               <button onClick={(e) => { e.stopPropagation(); setEditingItemCtx({ sIdx, subIdx, iIdx, item: { ...item } }); }} className="p-2 text-slate-300 hover:text-lucy-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                            </div>
                         </div>
                       )))}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ) : activeTab === 'modifiers' ? (
             <div className="max-w-4xl mx-auto space-y-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">Smart Modifiers</h2>
                    <p className="text-slate-500 mt-1">Manage modifier groups and their options.</p>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                    <input type="text" value={newGroupKey} onChange={(e) => setNewGroupKey(e.target.value)} placeholder="New Group Name (e.g. Bread)" className="p-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-lucy-500 w-full md:w-64" onKeyDown={(e) => { if (e.key === 'Enter' && newGroupKey && !modifierDefs[newGroupKey]) { onUpdateModifierDefs({...modifierDefs, [newGroupKey]: []}); setNewGroupKey(''); } }} />
                    <button onClick={() => { if(newGroupKey && !modifierDefs[newGroupKey]) { onUpdateModifierDefs({...modifierDefs, [newGroupKey]: []}); setNewGroupKey(''); } }} disabled={!newGroupKey} className="bg-lucy-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-lucy-900 whitespace-nowrap flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /> Create</button>
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Added explicit type cast to Object.entries to resolve 'unknown' property access errors. */}
                  {(Object.entries(modifierDefs) as [string, string[]][]).map(([key, options]) => (
                     <ModifierGroupEditor key={key} groupKey={key} options={options} onAddOption={(opt) => { if (!options.includes(opt)) { const newOptions = [...options, opt]; onUpdateModifierDefs({...modifierDefs, [key]: newOptions}); } }} onRemoveOption={(opt) => { const newOptions = options.filter(o => o !== opt); onUpdateModifierDefs({...modifierDefs, [key]: newOptions}); }} onDeleteGroup={() => { if (window.confirm(`Are you sure you want to delete the "${key}" modifier group?`)) { const {[key]: deleted, ...rest} = modifierDefs; onUpdateModifierDefs(rest); } }} />
                  ))}
               </div>
             </div>
           ) : (
             <MarketingTab />
           )}
        </div>
      </div>
    </div>
  );
};

// --- Cart Drawer ---
const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onClear: () => void;
}> = ({ isOpen, onClose, cart, onRemove, onUpdateQty, onClear }) => {
  const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[70] transition-opacity" onClick={onClose} />}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-[80] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="font-serif text-2xl font-bold text-slate-800 flex items-center gap-2"><ShoppingBag className="w-6 h-6" /> Your Order</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-500"><X className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
           {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p>Your cart is empty.</p>
                <button onClick={onClose} className="text-lucy-600 font-bold hover:underline">Browse Menu</button>
             </div>
           ) : (
             cart.map(item => (
               <div key={item.id} className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm relative group">
                  <button onClick={() => onRemove(item.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold text-slate-800 pr-6">{item.menuItem.name}</h4>
                     <span className="font-bold text-lucy-800">{formatPrice(item.totalPrice)}</span>
                  </div>
                  {item.selectedVariant && <div className="text-xs text-slate-500 mb-1">Option: {item.selectedVariant.label}</div>}
                  {Object.entries(item.selectedModifiers).map(([key, val]) => (
                    <div key={key} className="text-xs text-slate-500 mb-1"><span className="font-semibold">{key}:</span> {val}</div>
                  ))}
                  {item.selectedExtras.length > 0 && (
                    <div className="text-xs text-slate-500 mb-1"><span className="font-semibold">Extras:</span> {item.selectedExtras.map(e => e.label).join(', ')}</div>
                  )}
                  {item.specialInstructions && <div className="text-xs text-amber-600 italic mt-2 bg-amber-50 p-2 rounded">Note: {item.specialInstructions}</div>}
                  <div className="flex items-center gap-3 mt-4">
                     <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-slate-600"><Minus className="w-3 h-3" /></button>
                     <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                     <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-slate-600"><Plus className="w-3 h-3" /></button>
                  </div>
               </div>
             ))
           )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50">
             <div className="flex justify-between items-center mb-4">
                <span className="text-slate-500 font-medium">Total</span>
                <span className="text-2xl font-bold text-slate-800">{formatPrice(total)}</span>
             </div>
             <button className="w-full bg-lucy-800 text-white font-bold py-4 rounded-xl hover:bg-lucy-900 transition-all shadow-lg shadow-lucy-900/20 mb-3">Checkout</button>
             <button onClick={onClear} className="w-full text-slate-400 text-sm font-medium hover:text-red-500 transition-colors">Clear Cart</button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;