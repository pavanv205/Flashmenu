import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Edit3, Trash2, FolderTree } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
    } else {
      setEditingCategory(null);
      setName('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, { name });
      } else {
        await categoryAPI.create({ name });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this category will also remove all food items inside it. Continue?')) return;
    try {
      await categoryAPI.delete(id);
      fetchCategories();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(categories);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setCategories(reordered);

    const payload = reordered.map((cat, idx) => ({
      id: cat._id,
      order: idx + 1,
    }));

    try {
      await categoryAPI.reorder(payload);
    } catch (error) {
      fetchCategories();
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Menu Categories</h1>
          <p className="text-xs text-gray-400">Organize your dishes into clear sections (Starters, Main Course, Drinks)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {categories.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-[#0E0E14] rounded-3xl border border-white/[0.07]">
                  <FolderTree className="w-12 h-12 text-gray-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Categories Added</h3>
                  <p className="text-xs text-gray-400">Create your first category to start organizing your menu.</p>
                </div>
              ) : (
                categories.map((cat, index) => (
                  <Draggable key={cat._id} draggableId={cat._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="minimal-card p-4 rounded-2xl flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <div {...provided.dragHandleProps} className="text-gray-500 hover:text-gray-300 cursor-grab">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <span className="font-extrabold text-white text-sm">{cat.name}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E14] border border-white/[0.08] w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-white">
            <h3 className="text-lg font-bold text-white">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starters & Appetizers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#08080A] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 rounded-full bg-[#08080A] border border-white/[0.08] text-gray-400 hover:text-white font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-full bg-white text-black font-extrabold text-xs transition-all hover:bg-gray-200 shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
