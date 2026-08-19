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
  Minus,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Layers,
  Fish,
  Leaf,
  Drumstick,
  Utensils,
} from 'lucide-react';

function SubCategoryLabel({ name, count }) {
  const cleanName = (name || '').replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <span>
      {cleanName} {count !== undefined && <span className="opacity-80">({count})</span>}
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
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i._id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => setCart([]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-amber-400 font-extrabold uppercase tracking-widest animate-pulse">
          Opening FlashMenu...
        </p>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/30">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">{error || 'Menu Unavailable'}</h2>
        <p className="text-xs text-gray-400 max-w-sm">Please ask your server or scan the table QR code again.</p>
      </div>
    );
  }

  const isInactive = restaurant.isActive === false || restaurant.isOpen === false;

  if (isInactive) {
    return (
      <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-sm bg-dark-card border-2 border-red-500/30 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
            <XCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/30">
              OFFLINE / INACTIVE
            </span>
            <h2 className="text-xl font-extrabold text-white pt-2">{restaurant.name}</h2>
            <p className="text-xs text-gray-400 leading-relaxed pt-1">
              This restaurant digital menu is currently inactive. Food items cannot be viewed or ordered at this time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dark-base border border-dark-border text-center space-y-1">
            <p className="text-xs font-bold text-gray-300">Need Assistance?</p>
            <p className="text-[11px] text-gray-400">Please speak directly to your waiter or restaurant staff.</p>
          </div>
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

  // Group items by subCategory if viewing all sub-categories
  const groupedItems = filteredItems.reduce((acc, item) => {
    const sub = item.computedSubCategory || 'DEFAULT';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(item);
    return acc;
  }, {});

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#08080A] text-white selection:bg-amber-500 selection:text-black font-sans">
      <div className="min-h-screen bg-[#08080A] pb-28 max-w-md mx-auto relative shadow-2xl border-x border-white/[0.08]">
        {/* Top Cover Banner */}
        <div className="relative h-48 w-full bg-[#0E0E14] overflow-hidden">
          {restaurant.coverImage ? (
            <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-amber-600 to-amber-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/40 to-transparent" />

          {/* Table Badge */}
          {tableParam && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-xs shadow-lg">
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
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-[#08080A] shadow-xl"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-[#08080A] shadow-xl flex items-center justify-center"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Zap className="w-10 h-10 text-black fill-black" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Open Now</span>
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">{restaurant.name}</h1>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mt-0.5">
              {restaurant.cuisineType}
            </p>
            {restaurant.description && (
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{restaurant.description}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs text-gray-400 pt-1 border-t border-white/[0.08]">
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{restaurant.openingHours}</span>
            </div>
            {restaurant.city && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{restaurant.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Search & Category Bar */}
        <div className="sticky top-0 z-30 bg-[#08080A]/95 backdrop-blur-md pt-4 pb-2 px-5 border-b border-white/[0.08] space-y-2 mt-4">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search dishes or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E0E14] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Categories horizontal scroll pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                  : 'bg-[#0E0E14] text-gray-400 hover:text-white border border-white/[0.08]'
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
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-extrabold'
                    : 'bg-[#0E0E14] text-gray-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub-Category horizontal scroll pills */}
          {activeCategory !== 'all' && availableSubCategories.length > 0 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-2 pb-1 border-t border-white/[0.08]">
              <button
                onClick={() => setActiveSubCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeSubCategory === 'all'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                    : 'bg-[#0E0E14] text-gray-300 hover:text-white border border-white/[0.08]'
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
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-extrabold'
                        : 'bg-[#0E0E14] text-gray-300 hover:text-white border border-white/[0.08]'
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
          <div className="py-12 text-center text-gray-500 space-y-2">
            <Search className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-xs">No food items matching your query.</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([subGroup, items]) => (
            <div key={subGroup} className="space-y-3">
              {subGroup !== 'DEFAULT' && activeSubCategory === 'all' && (
                <div className="pt-3 pb-1 border-b border-amber-500/30 flex items-center justify-between">
                  <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center space-x-2">
                    <SubCategoryLabel name={subGroup} isActive={false} />
                  </h2>
                  <span className="text-[10px] font-bold text-gray-400 bg-[#0E0E14] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                    {items.length} items
                  </span>
                </div>
              )}

              {items.map((item) => {
                const inCart = cart.find((i) => i._id === item._id);
                return (
                  <div
                    key={item._id}
                    className={`p-4 rounded-3xl bg-[#0E0E14] border transition-all flex space-x-3 relative overflow-hidden ${
                      item.isAvailable
                        ? 'border-white/[0.08] hover:border-amber-500/40'
                        : 'border-red-900/40 bg-red-950/10'
                    }`}
                  >
                    {/* Food Image */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#08080A] flex-shrink-0 border border-white/[0.06]">
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
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest border border-red-500/40 px-2 py-0.5 rounded-full bg-red-500/20">
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
                            <span className="w-3.5 h-3.5 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            </span>
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-sm border border-red-500 flex items-center justify-center p-0.5">
                              <span className="w-0 h-0 border-l-[2.5px] border-l-transparent border-r-[2.5px] border-r-transparent border-b-[5px] border-b-red-500"></span>
                            </span>
                          )}

                          <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                        </div>

                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.isBestseller && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-extrabold uppercase">
                              Bestseller
                            </span>
                          )}
                          {item.isChefSpecial && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-extrabold uppercase">
                              Chef Special
                            </span>
                          )}
                          {item.spicyLevel > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-extrabold flex items-center">
                              <Flame className="w-2.5 h-2.5 mr-0.5" />
                              <span>Spicy</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Add Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-sm font-black text-amber-400">
                            {restaurant.currency || '₹'}{item.discountPrice || item.price}
                          </span>
                          {item.discountPrice && (
                            <span className="text-[10px] text-gray-500 line-through">
                              {restaurant.currency || '₹'}{item.price}
                            </span>
                          )}
                        </div>

                        {item.isAvailable && (
                          inCart ? (
                            <div className="flex items-center space-x-2 bg-amber-500 text-black px-2 py-1 rounded-xl text-xs font-bold">
                              <button onClick={() => updateCartQuantity(item._id, -1)} className="px-1 font-bold">-</button>
                              <span>{inCart.quantity}</span>
                              <button onClick={() => updateCartQuantity(item._id, 1)} className="px-1 font-bold">+</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/30 text-xs font-bold transition-all flex items-center space-x-1"
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
                className="flex-1 py-3 px-4 rounded-2xl bg-[#0E0E14]/90 border border-amber-500/40 text-amber-400 font-extrabold text-xs shadow-2xl flex items-center justify-center space-x-2 backdrop-blur-md"
              >
                <Bell className="w-4 h-4 animate-bounce" />
                <span>Call Waiter</span>
              </button>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="p-3 rounded-2xl bg-[#0E0E14] border border-white/[0.08] text-gray-300 font-bold text-xs"
                title="Rate & Review"
              >
                <Star className="w-5 h-5 text-amber-400" />
              </button>
            </>
          )}

          {cartTotalCount > 0 && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 text-black font-black text-xs shadow-2xl flex items-center justify-between gold-glow"
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
