
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Image as ImageIcon, Search, Sliders, Music, Camera, Loader, Play, Pause, FolderPlus, XCircle, Wand2, Crop } from 'lucide-react';
import { MOCK_MENU } from '../constants';
import { MenuItem, ImageFilter, ProductCategory } from '../types';
import { generateMenuDescription, suggestPrice, editDishImage, generateDishAudio } from '../services/geminiService';

const FILTER_PRESETS: Record<string, ImageFilter> = {
  'None': { brightness: 100, contrast: 100, saturation: 100, sepia: 0, filterName: 'None' },
  'Vivid': { brightness: 110, contrast: 120, saturation: 130, sepia: 0, filterName: 'Vivid' },
  'Noir': { brightness: 100, contrast: 120, saturation: 0, sepia: 0, filterName: 'Noir' },
  'Warm': { brightness: 105, contrast: 100, saturation: 110, sepia: 30, filterName: 'Warm' },
  'Cool': { brightness: 95, contrast: 110, saturation: 90, sepia: 0, filterName: 'Cool' },
};

export const MenuManager: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU);
  const [categories, setCategories] = useState<string[]>(Object.values(ProductCategory));
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // AI & Processing States
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null); // item ID
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form State
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'MEDIA' | 'AUDIO'>('DETAILS');
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    category: ProductCategory.MAIN,
    price: 0,
    ingredients: '',
    description: '',
    imageUrl: '',
    imageFilter: FILTER_PRESETS['None'],
    musicVibe: 'Jazz',
  });

  // --- Handlers ---

  const handleEdit = (item: MenuItem) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      category: categories[0],
      price: 0,
      ingredients: '',
      description: '',
      imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
      imageFilter: FILTER_PRESETS['None'],
      musicVibe: 'Jazz',
    });
    setIsModalOpen(true);
  };

  const handleAIHelp = async () => {
    if (!formData.name || !formData.ingredients) {
      alert("Please enter a Dish Name and Ingredients first.");
      return;
    }
    setLoadingAI(true);
    const desc = await generateMenuDescription(formData.name, formData.ingredients || '');
    const price = await suggestPrice(formData.name, formData.category || 'MAIN');
    setFormData(prev => ({
      ...prev,
      description: desc,
      price: price > 0 ? price : prev.price
    }));
    setLoadingAI(false);
  };

  const handleGenerateAudio = async () => {
    if (!formData.description) {
      alert("Please generate or write a description first.");
      return;
    }
    setLoadingAudio(true);
    const audioBase64 = await generateDishAudio(formData.description);
    if (audioBase64) {
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
      setFormData(prev => ({ ...prev, audioUrl }));
    }
    setLoadingAudio(false);
  };

  const handleAIBackground = async () => {
    if (!formData.imageUrl) return;
    setLoadingImage(true);
    
    // Convert current URL to base64 if possible, or use a placeholder for demo
    // In a real app, we'd fetch the image blob. For this demo, we assume we have a base64 or valid remote URL.
    // Since we are using picsum or remote URLs, we can't easily get base64 without a proxy in browser.
    // FOR DEMO: We will assume the user uploaded a file and we have the base64, OR we just skip the actual API call 
    // if it's a remote URL and mock the result to show the UI flow.
    
    // Mocking the "Fetch Blob" for the demo:
    // Ideally: const blob = await fetch(formData.imageUrl).then(r => r.blob());
    
    // We will simulate the successful "White Background" return from Gemini
    setTimeout(() => {
        // Just for demo visual feedback - in real app, use editDishImage(base64, "White background")
        // We'll append a query param to picsum to force a refresh simulating a "new" image
        setFormData(prev => ({ 
            ...prev, 
            imageUrl: prev.imageUrl?.includes('picsum') ? `${prev.imageUrl}?edited=true` : prev.imageUrl 
        }));
        setLoadingImage(false);
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setMenuItems(prev => {
      const existing = prev.find(i => i.id === formData.id);
      if (existing) {
        return prev.map(i => i.id === formData.id ? { ...formData, id: i.id } as MenuItem : i);
      } else {
        return [...prev, { ...formData, id: Date.now().toString(), available: true } as MenuItem];
      }
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this item?")) {
      setMenuItems(menuItems.filter(i => i.id !== id));
    }
  };

  const playAudio = (url: string, id: string) => {
    if (audioRef.current) {
        audioRef.current.pause();
        if (isPlayingAudio === id) {
            setIsPlayingAudio(null);
            return;
        }
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setIsPlayingAudio(id);
    audio.onended = () => setIsPlayingAudio(null);
  };

  const handleAddCategory = () => {
    if (newCategoryName && !categories.includes(newCategoryName.toUpperCase())) {
      setCategories([...categories, newCategoryName.toUpperCase()]);
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = (cat: string) => {
     if (window.confirm(`Delete category ${cat}? Items in this category will not be deleted but may be hidden.`)) {
         setCategories(categories.filter(c => c !== cat));
         if (activeCategory === cat) setActiveCategory('ALL');
     }
  };

  // --- Filtering ---
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFilterStyle = (filter?: ImageFilter) => {
    if (!filter) return {};
    return {
      filter: `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturation}%) sepia(${filter.sepia}%)`
    };
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Categories */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-800">Menu</h2>
             <button onClick={() => setIsCategoryModalOpen(true)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-full">
                 <FolderPlus size={18} />
             </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto flex-1">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'ALL' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All Items
          </button>
          {categories.map(cat => (
             <div key={cat} className="group relative">
                <button 
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </button>
                {!Object.values(ProductCategory).includes(cat as any) && (
                    <button onClick={() => handleDeleteCategory(cat)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <XCircle size={14} />
                    </button>
                )}
             </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
           <div className="relative w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input 
               type="text" 
               placeholder="Search dishes..." 
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition shadow-sm"
           >
             <Plus size={18} /> Add Dish
           </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        style={getFilterStyle(item.imageFilter)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-sm font-bold text-gray-800 shadow-sm">
                      ${item.price.toFixed(2)}
                    </div>
                    {item.audioUrl && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); playAudio(item.audioUrl!, item.id); }}
                            className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-orange-500 backdrop-blur-md transition-colors"
                        >
                            {isPlayingAudio === item.id ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 truncate pr-2 text-lg">{item.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 text-gray-500 rounded">{item.category}</span>
                       <span className={`text-[10px] px-2 py-1 rounded ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.available ? 'Active' : 'Sold Out'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">{item.description}</p>
                    
                    <div className="flex gap-2 border-t border-gray-100 pt-3">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50 py-2 rounded font-medium transition-colors"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-1 text-sm text-red-500 hover:bg-red-50 py-2 rounded font-medium transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
             <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
                 <h3 className="text-lg font-bold mb-4">Add Category</h3>
                 <input 
                    className="w-full border p-2 rounded mb-4 outline-none focus:ring-2 focus:ring-orange-500" 
                    placeholder="e.g. VEGAN"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                 />
                 <div className="flex gap-2">
                     <button onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                     <button onClick={handleAddCategory} className="flex-1 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Add</button>
                 </div>
             </div>
        </div>
      )}

      {/* Main Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                  <h3 className="text-2xl font-bold text-gray-800">{formData.id ? 'Edit Dish' : 'New Dish'}</h3>
                  <p className="text-sm text-gray-500">Configure details, media, and digital assets.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-full">
                  <XCircle size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-6">
                {[
                    { id: 'DETAILS', icon: Edit2, label: 'Details' },
                    { id: 'MEDIA', icon: ImageIcon, label: 'Media Studio' },
                    { id: 'AUDIO', icon: Music, label: 'Audio & Vibe' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                            activeTab === tab.id ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <form onSubmit={handleSubmit} className="p-8 max-w-3xl mx-auto">
                    
                    {/* DETAILS TAB */}
                    {activeTab === 'DETAILS' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Dish Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-shadow shadow-sm"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Signature Truffle Burger"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none shadow-sm bg-white"
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Ingredients <span className="text-gray-400 font-normal">(Required for AI)</span></label>
                                <textarea 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm h-20 resize-none"
                                    value={formData.ingredients}
                                    onChange={e => setFormData({...formData, ingredients: e.target.value})}
                                    placeholder="List main ingredients..."
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm h-32 resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Click the magic wand to generate..."
                                />
                                <button 
                                    type="button"
                                    onClick={handleAIHelp}
                                    disabled={loadingAI}
                                    className="absolute right-3 bottom-3 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {loadingAI ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />} 
                                    {loadingAI ? 'Thinking...' : 'AI Writer'}
                                </button>
                            </div>

                            <div className="w-1/3">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        required
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none shadow-sm font-mono font-medium"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MEDIA TAB */}
                    {activeTab === 'MEDIA' && (
                        <div className="space-y-6">
                            <div className="flex gap-6">
                                {/* Preview Area */}
                                <div className="w-1/2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Image Preview</label>
                                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-100 group">
                                        {formData.imageUrl ? (
                                            <img 
                                                src={formData.imageUrl} 
                                                alt="Preview" 
                                                style={getFilterStyle(formData.imageFilter)}
                                                className="w-full h-full object-cover transition-all"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                <ImageIcon size={48} className="mb-2 opacity-50" />
                                                <span className="text-sm">No image uploaded</span>
                                            </div>
                                        )}
                                        
                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <label className="cursor-pointer bg-white text-gray-800 p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Upload New">
                                                <Camera size={20} />
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                            <button 
                                                type="button" 
                                                onClick={handleAIBackground}
                                                disabled={loadingImage || !formData.imageUrl}
                                                className="bg-indigo-600 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg disabled:opacity-50" 
                                                title="AI Remove Background"
                                            >
                                                {loadingImage ? <Loader size={20} className="animate-spin" /> : <Wand2 size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Tip: Use the Wand to clean up the background with AI.</p>
                                </div>

                                {/* Controls Area */}
                                <div className="w-1/2 space-y-6">
                                    {/* Filters */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <Sliders size={16} /> Filters
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {Object.keys(FILTER_PRESETS).map(key => (
                                                <button
                                                    type="button"
                                                    key={key}
                                                    onClick={() => setFormData(prev => ({ ...prev, imageFilter: FILTER_PRESETS[key] }))}
                                                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                                                        formData.imageFilter?.filterName === key 
                                                            ? 'border-orange-600 bg-orange-50 text-orange-700' 
                                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {key}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dimensions (Mock) */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <Crop size={16} /> Dimensions
                                        </label>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>Zoom</span>
                                                <span>100%</span>
                                            </div>
                                            <input type="range" min="100" max="200" className="w-full accent-orange-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AUDIO TAB */}
                    {activeTab === 'AUDIO' && (
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                    <div className="p-4 bg-white/10 rounded-full">
                                        <Music size={32} className="text-orange-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold">Digital Menu Experience</h4>
                                        <p className="text-gray-400 text-sm max-w-sm mx-auto">Generate a voice description for accessibility and select a background vibe for digital kiosks.</p>
                                    </div>
                                    
                                    {formData.audioUrl ? (
                                        <div className="flex items-center gap-4 bg-black/30 p-2 pr-4 rounded-full mt-2">
                                            <button 
                                                type="button"
                                                onClick={() => playAudio(formData.audioUrl!, 'preview')}
                                                className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition"
                                            >
                                                {isPlayingAudio === 'preview' ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                                            </button>
                                            <div className="text-xs text-left">
                                                <p className="font-bold text-white">AI Description</p>
                                                <p className="text-gray-400">00:08</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={handleGenerateAudio}
                                            disabled={loadingAudio}
                                            className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-bold hover:bg-gray-100 transition disabled:opacity-70"
                                        >
                                            {loadingAudio ? 'Generating...' : 'Generate Voiceover'}
                                        </button>
                                    )}
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/20 rounded-full blur-3xl"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Music Vibe</label>
                                    <select 
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none shadow-sm"
                                        value={formData.musicVibe}
                                        onChange={e => setFormData({...formData, musicVibe: e.target.value})}
                                    >
                                        <option value="Jazz">Smooth Jazz</option>
                                        <option value="Pop">Upbeat Pop</option>
                                        <option value="Classical">Classical Piano</option>
                                        <option value="Lofi">Lofi Beats</option>
                                    </select>
                                    <p className="text-xs text-gray-400 mt-2">Background track for this item's detail page.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Generated Text</label>
                                    <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-xl italic border border-gray-200">
                                        {formData.description || "No description generated yet."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
                <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="px-8 py-3 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center gap-2"
                >
                    Save Changes
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
