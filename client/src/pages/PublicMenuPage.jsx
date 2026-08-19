import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { publicAPI } from '../services/api';
import CallWaiterModal from '../components/CallWaiterModal';
import FeedbackModal from '../components/FeedbackModal';
import OrderDrawer from '../components/OrderDrawer';
import { getSubCategory } from '../utils/categoryHelper';
import { getOptimizedImageUrl, getCategoryFallbackImage } from '../utils/imageHelper';
import {
  Zap,
  Search,
  Flame,
  Star,
  Bell,
  ShoppingBag,
  Clock,
  MapPin,
  Plus,
  CheckCircle2,
} from 'lucide-react';

function SubCategoryLabel({ name, count }) {
  const cleanName = (name || '').replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <span>
      {cleanName} {count !== undefined && <span className="opacity-75">({count})</span>}
    </span>
  );
}

export default function PublicMenuPage() {
  const { restaurantSlug } = useParams();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table') || '';
  const isPreviewMode = searchParams.get('preview') === 'true';

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI state
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await publicAPI.getMenu(restaurantSlug, tableParam);
        setRestaurant(res.data.restaurant);
        setCategories(res.data.categories);
        setMenuItems(res.data.menuItems);

        // Update title tag dynamically for SEO
        document.title = `${res.data.restaurant.name} Digital Menu | FlashMenu`;
      } catch (err) {
        setError('Sorry, this restaurant menu could not be found or is unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantSlug, tableParam]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      setActiveSubCategory('all');
      return;
    }
    const catObj = categories.find((c) => c._id === catId);
    const catName = catObj ? catObj.name : '';
    const itemsInCat = menuItems
      .filter((item) => (item.categoryId?._id || item.categoryId) === catId)
      .map((item) => getSubCategory(item, catName));

    const subs = Array.from(new Set(itemsInCat.filter(Boolean)));
    if (subs.length > 0) {
      const vegSub = subs.find((s) => s.toUpperCase().includes('VEG') && !s.toUpperCase().includes('NON VEG'));
      if (vegSub) {
        setActiveSubCategory(vegSub);
      } else {
        setActiveSubCategory(subs[0]);
      }
    } else {
      setActiveSubCategory('all');
    }
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#08080A] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto font-black text-2xl">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-900">Menu Unavailable</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{error || 'Unable to load menu.'}</p>
        </div>
      </div>
    );
  }

  const primaryColor = restaurant.primaryColor || '#F59E0B';
  const activeCategoryObj = categories.find((c) => c._id === activeCategory);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : '';

  // Filter items by main category and search
  const categoryItems = menuItems
    .filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || (item.categoryId._id || item.categoryId) === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .map((item) => {
      const itemCatName = item.categoryId?.name || activeCategoryName;
      return {
        ...item,
        computedSubCategory: getSubCategory(item, itemCatName),
      };
    });

  const availableSubCategories = Array.from(
    new Set(categoryItems.map((i) => i.computedSubCategory).filter(Boolean))
  );

  const filteredItems =
    activeSubCategory === 'all'
      ? categoryItems
      : categoryItems.filter((i) => i.computedSubCategory === activeSubCategory);

  // Group items by subCategory
  const groupedItems = filteredItems.reduce((acc, item) => {
    const sub = item.computedSubCategory || 'DEFAULT';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(item);
    return acc;
  }, {});

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#08080A] text-slate-900 font-sans selection:bg-amber-500 selection:text-black">
      {/* Mobile-Sized Container with Light Theme */}
      <div className="min-h-screen bg-[#FAFAFA] pb-28 max-w-md mx-auto relative shadow-2xl border-x border-slate-200/80">
        
        {/* Top Cover Banner */}
        <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
          {restaurant.coverImage ? (
            <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/40 to-transparent" />

          {/* Table Badge */}
          {tableParam && (
            <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-slate-900 text-white font-extrabold text-xs shadow-lg">
              Table #{tableParam}
            </div>
          )}
        </div>

        {/* Restaurant Info Header */}
        <div className="px-5 -mt-14 relative z-10 space-y-3">
          <div className="flex items-end justify-between">
            <div className="relative">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Zap className="w-10 h-10 text-black fill-black" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Open Now</span>
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{restaurant.name}</h1>
            <p className="text-xs font-extrabold text-amber-600 uppercase tracking-wider mt-0.5">
              {restaurant.cuisineType}
            </p>
            {restaurant.description && (
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">{restaurant.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1 border-t border-slate-200">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{restaurant.openingHours}</span>
            </div>
            {restaurant.city && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{restaurant.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Search & Category Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md pt-4 pb-2 px-5 border-b border-slate-200/80 space-y-2 mt-4 shadow-sm">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-amber-500 focus:bg-white font-medium transition-all"
            />
          </div>

          {/* Categories horizontal scroll pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 font-bold'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat._id
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 font-bold'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub-Category horizontal scroll pills */}
          {activeCategory !== 'all' && availableSubCategories.length > 0 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-2 pb-1 border-t border-slate-200/60">
              <button
                onClick={() => setActiveSubCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeSubCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-md font-extrabold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All ({categoryItems.length})
              </button>
              {availableSubCategories.map((sub) => {
                const count = categoryItems.filter((i) => i.computedSubCategory === sub).length;
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                      activeSubCategory === sub
                        ? 'bg-slate-900 text-white shadow-md font-extrabold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <SubCategoryLabel name={sub} count={count} isActive={activeSubCategory === sub} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Food Items List Grouped by Sub-Category */}
        <div className="px-5 pt-4 space-y-6">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs">No food items matching your query.</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([subGroup, items]) => (
              <div key={subGroup} className="space-y-3">
                {subGroup !== 'DEFAULT' && activeSubCategory === 'all' && (
                  <div className="pt-3 pb-1 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center space-x-2">
                      <SubCategoryLabel name={subGroup} isActive={false} />
                    </h2>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {items.length} items
                    </span>
                  </div>
                )}

                {items.map((item) => {
                  const inCart = cart.find((i) => i._id === item._id);
                  return (
                    <div
                      key={item._id}
                      className={`p-4 rounded-3xl bg-white border transition-all flex space-x-3.5 relative overflow-hidden shadow-sm hover:shadow-md ${
                        item.isAvailable
                          ? 'border-slate-200/90 hover:border-amber-500/50'
                          : 'border-red-200 bg-red-50/50'
                      }`}
                    >
                      {/* Food Image */}
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60 shadow-inner">
                        {(() => {
                          const fallback = getCategoryFallbackImage(
                            item.categoryId?.name,
                            item.computedSubCategory || item.subCategory,
                            item.name
                          );
                          const displayImage = item.image ? getOptimizedImageUrl(item.image, 400) : fallback;
                          return (
                            <img
                              src={displayImage}
                              alt={item.name}
                              loading="lazy"
                              className={`w-full h-full object-cover ${!item.isAvailable && 'grayscale opacity-50'}`}
                              onError={(e) => {
                                e.target.src = fallback;
                              }}
                            />
                          );
                        })()}

                        {/* SOLD OUT Overlay */}
                        {!item.isAvailable && (
                          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest border border-red-400/40 px-2 py-0.5 rounded-full bg-red-500/20">
                              SOLD OUT
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            {/* Dietary dot */}
                            {item.vegType === 'veg' ? (
                              <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                              </span>
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-sm border border-red-600 flex items-center justify-center p-0.5">
                                <span className="w-0 h-0 border-l-[2.5px] border-l-transparent border-r-[2.5px] border-r-transparent border-b-[5px] border-b-red-600"></span>
                              </span>
                            )}

                            <h3 className="text-sm font-extrabold text-slate-900 truncate">{item.name}</h3>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.isBestseller && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase">
                                Bestseller
                              </span>
                            )}
                            {item.isChefSpecial && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-extrabold uppercase">
                                Chef Special
                              </span>
                            )}
                            {item.spicyLevel > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-extrabold flex items-center">
                                <Flame className="w-2.5 h-2.5 mr-0.5" />
                                <span>Spicy</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-sm font-black text-amber-600">
                              {restaurant.currency || '₹'}{item.discountPrice || item.price}
                            </span>
                            {item.discountPrice && (
                              <span className="text-[10px] text-slate-400 line-through">
                                {restaurant.currency || '₹'}{item.price}
                              </span>
                            )}
                          </div>

                          {item.isAvailable && (
                            inCart ? (
                              <div className="flex items-center space-x-2 bg-amber-500 text-black px-2.5 py-1 rounded-xl text-xs font-black shadow-sm">
                                <button onClick={() => updateCartQuantity(item._id, -1)} className="px-1 font-black">-</button>
                                <span>{inCart.quantity}</span>
                                <button onClick={() => updateCartQuantity(item._id, 1)} className="px-1 font-black">+</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item)}
                                className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-black border border-amber-500/30 text-xs font-extrabold transition-all flex items-center space-x-1 shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>ADD</span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Floating Bottom Bar (Call Waiter & Order Cart) */}
        {(!isPreviewMode || cartTotalCount > 0) && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40 flex items-center space-x-3">
            {!isPreviewMode && (
              <>
                <button
                  onClick={() => setIsWaiterModalOpen(true)}
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 text-white font-extrabold text-xs shadow-2xl flex items-center justify-center space-x-2 backdrop-blur-md hover:bg-slate-800 transition-all border border-slate-800"
                >
                  <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Call Waiter</span>
                </button>

                <button
                  onClick={() => setIsFeedbackModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-lg hover:bg-slate-50 transition-all"
                  title="Rate & Review"
                >
                  <Star className="w-5 h-5 text-amber-500" />
                </button>
              </>
            )}

            {cartTotalCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-500 text-black font-black text-xs shadow-2xl shadow-amber-500/30 flex items-center justify-between hover:bg-amber-400 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>{cartTotalCount} Item(s)</span>
                </div>
                <span>View Tray &rarr;</span>
              </button>
            )}
          </div>
        )}

        {/* Modals & Drawers */}
        <CallWaiterModal
          isOpen={isWaiterModalOpen}
          onClose={() => setIsWaiterModalOpen(false)}
          restaurantSlug={restaurantSlug}
          defaultTable={tableParam}
        />

        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          restaurantSlug={restaurantSlug}
          defaultTable={tableParam}
        />

        <OrderDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          updateQuantity={updateCartQuantity}
          clearCart={clearCart}
          restaurant={restaurant}
          tableNumber={tableParam}
        />
      </div>
    </div>
  );
}
