import React, { useState, useEffect } from 'react';
import { categoryAPI, itemAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSubCategory } from '../utils/categoryHelper';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Plus,
  GripVertical,
  Copy,
  Trash2,
  Edit3,
  Flame,
  Star,
  Sparkles,
  CheckCircle2,
  XCircle,
  Image,
  UtensilsCrossed,
  Layers,
} from 'lucide-react';

export default function MenuItemsPage() {
  const { restaurant } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    subCategory: '',
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    image: '',
    vegType: 'veg',
    spicyLevel: 0,
    isBestseller: false,
    isChefSpecial: false,
    isNewItem: false,
    isAvailable: true,
  });

  const fetchData = async () => {
    try {
      const catsRes = await categoryAPI.getAll();
      setCategories(catsRes.data);
      const itemsRes = await itemAPI.getAll();
      setItems(itemsRes.data);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubCategory('all');
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        categoryId: item.categoryId._id || item.categoryId,
        subCategory: item.subCategory || '',
        name: item.name,
        description: item.description || '',
        price: item.price,
        discountPrice: item.discountPrice || '',
        image: item.image || '',
        vegType: item.vegType || 'veg',
        spicyLevel: item.spicyLevel || 0,
        isBestseller: item.isBestseller || false,
        isChefSpecial: item.isChefSpecial || false,
        isNewItem: item.isNewItem || false,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      });
    } else {
      setEditingItem(null);
      setFormData({
        categoryId: categories.length > 0 ? categories[0]._id : '',
        subCategory: '',
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        image: '',
        vegType: 'veg',
        spicyLevel: 0,
        isBestseller: false,
        isChefSpecial: false,
        isNewItem: false,
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await itemAPI.update(editingItem._id, formData);
      } else {
        await itemAPI.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleToggleAvailable = async (id) => {
    try {
      await itemAPI.toggleAvailability(id);
      fetchData();
    } catch (error) {
      alert('Failed to toggle availability');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await itemAPI.duplicate(id);
      fetchData();
    } catch (error) {
      alert('Failed to duplicate item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await itemAPI.delete(id);
      fetchData();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(filteredItems);
    const [moved] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, moved);

    const newItemsMap = reorderedItems.map((item, idx) => ({
      id: item._id,
      order: idx + 1,
    }));

    setItems((prev) => {
      const remaining = prev.filter((i) => !reorderedItems.some((r) => r._id === i._id));
      return [...reorderedItems, ...remaining];
    });

    try {
      await itemAPI.reorder(newItemsMap);
    } catch (error) {
      fetchData();
    }
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategory);
  const currentCategoryName = selectedCategoryObj ? selectedCategoryObj.name : '';

  const categoryItems = (
    selectedCategory === 'all'
      ? items
      : items.filter((item) => (item.categoryId._id || item.categoryId) === selectedCategory)
  ).map((item) => {
    const itemCatName = item.categoryId?.name || currentCategoryName;
    return {
      ...item,
      computedSubCategory: getSubCategory(item, itemCatName),
    };
  });

  const availableSubCategories = Array.from(
    new Set(categoryItems.map((i) => i.computedSubCategory).filter(Boolean))
  );

  const filteredItems =
    selectedSubCategory === 'all'
      ? categoryItems
      : categoryItems.filter((i) => i.computedSubCategory === selectedSubCategory);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Menu Items Management</h1>
          <p className="text-xs text-gray-400">Add dishes, set prices, and toggle instant SOLD OUT status</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Category filter tabs */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar border-b border-dark-border">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => (i.categoryId._id || i.categoryId) === cat._id).length;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat._id
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-dark-card text-gray-400 hover:text-white border border-dark-border'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Sub-Category filter options */}
        {availableSubCategories.length > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto py-2 px-3 no-scrollbar bg-amber-500/5 rounded-2xl border border-amber-500/30 shadow-inner">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center space-x-1.5 whitespace-nowrap mr-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Sub Sections:</span>
            </span>

            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                selectedSubCategory === 'all'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-dark-card text-gray-300 hover:text-white border border-dark-border'
              }`}
            >
              All ({categoryItems.length})
            </button>

            {availableSubCategories.map((sub) => {
              const subCount = categoryItems.filter((i) => i.computedSubCategory === sub).length;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    selectedSubCategory === sub
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-dark-card text-gray-300 hover:text-white border border-dark-border'
                  }`}
                >
                  {sub} ({subCount})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Drag and drop item list */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="menu-items-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredItems.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-3 bg-dark-card rounded-3xl border border-dark-border">
                  <UtensilsCrossed className="w-12 h-12 text-gray-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Menu Items Found</h3>
                  <p className="text-xs text-gray-400">Click "Add New Menu Item" above to add dishes to your menu.</p>
                </div>
              ) : (
                filteredItems.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 rounded-3xl bg-dark-card border transition-all flex flex-col justify-between relative group ${
                          item.isAvailable
                            ? 'border-dark-border hover:border-amber-500/40'
                            : 'border-red-500/40 bg-red-950/10'
                        }`}
                      >
                        <div>
                          {/* Item Top Row with Drag Handle */}
                          <div className="flex items-center justify-between mb-3">
                            <div {...provided.dragHandleProps} className="text-gray-500 hover:text-white cursor-grab">
                              <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Veg / Non-Veg badge */}
                            <div className="flex items-center space-x-2">
                              {item.vegType === 'veg' ? (
                                <span className="w-4 h-4 rounded-sm border border-emerald-500 flex items-center justify-center p-0.5" title="Vegetarian">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                </span>
                              ) : (
                                <span className="w-4 h-4 rounded-sm border border-red-500 flex items-center justify-center p-0.5" title="Non-Vegetarian">
                                  <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-500"></span>
                                </span>
                              )}

                              {/* Instant Availability Toggle Switch */}
                              <button
                                onClick={() => handleToggleAvailable(item._id)}
                                className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                                  item.isAvailable
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                {item.isAvailable ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Available</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>SOLD OUT</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Image & Main Info */}
                          <div className="flex space-x-3 mb-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className={`w-20 h-20 rounded-2xl object-cover border border-dark-border ${
                                  !item.isAvailable && 'grayscale opacity-60'
                                }`}
                              />
                            ) : (
                              <div className="w-20 h-20 rounded-2xl bg-dark-base border border-dark-border flex items-center justify-center text-gray-600">
                                <Image className="w-8 h-8" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                              {item.computedSubCategory && (
                                <span className="inline-block text-[10px] font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 mt-0.5 mb-1">
                                  {item.computedSubCategory}
                                </span>
                              )}
                              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                {item.description || 'No description'}
                              </p>

                              <div className="flex items-baseline space-x-2 mt-2">
                                <span className="text-base font-extrabold text-amber-400">
                                  {restaurant?.currency || '₹'}{item.discountPrice || item.price}
                                </span>
                                {item.discountPrice && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {restaurant?.currency || '₹'}{item.price}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {item.isBestseller && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                                Bestseller
                              </span>
                            )}
                            {item.isChefSpecial && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
                                Chef Special
                              </span>
                            )}
                            {item.isNewItem && (
                              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                                NEW
                              </span>
                            )}
                            {item.spicyLevel > 0 && (
                              <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center space-x-0.5">
                                <Flame className="w-3 h-3" />
                                <span>Spicy Lvl {item.spicyLevel}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="pt-3 border-t border-dark-border flex items-center justify-between text-xs text-gray-400">
                          <button
                            onClick={() => handleDuplicate(item._id)}
                            className="inline-flex items-center space-x-1 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOpenModal(item)}
                              className="p-1.5 rounded-lg bg-dark-base hover:bg-dark-hover text-gray-300 hover:text-white"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 rounded-lg bg-dark-base hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Sub-Section (e.g. 🥗 VEG STARTERS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🥗 VEG STARTERS or 🍗 NON VEG STARTERS"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chicken Biryani"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Price ({restaurant?.currency || '₹'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="250"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, taste profile, portion size..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Food Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Dietary Type
                  </label>
                  <select
                    value={formData.vegType}
                    onChange={(e) => setFormData({ ...formData, vegType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="egg">Egg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Spicy Level (0 to 3)
                  </label>
                  <select
                    value={formData.spicyLevel}
                    onChange={(e) => setFormData({ ...formData, spicyLevel: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-base border border-dark-border text-white text-sm"
                  >
                    <option value={0}>0 - Not Spicy</option>
                    <option value={1}>1 - Mild</option>
                    <option value={2}>2 - Medium</option>
                    <option value={3}>3 - Extra Hot</option>
                  </select>
                </div>
              </div>

              {/* Checkbox badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <label className="flex items-center space-x-2 text-xs font-semibold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isChefSpecial}
                    onChange={(e) => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                  />
                  <span>Chef Special</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewItem}
                    onChange={(e) => setFormData({ ...formData, isNewItem: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                  />
                  <span>New Item</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-dark-hover text-gray-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
