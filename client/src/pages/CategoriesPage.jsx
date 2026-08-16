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
      alert('Error saving category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deleting this category will also remove all food items inside it. Continue?')) return;
    try {
      await categoryAPI.delete(id);
      fetchCategories();
    } catch (error) {
      alert('Error deleting category');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Menu Categories</h1>
          <p className="text-xs text-gray-400">Organize your dishes into clear sections (Starters, Main Course, Drinks)</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20"
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
                <div className="py-16 text-center space-y-3 bg-dark-card rounded-3xl border border-dark-border">
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
                        className="p-4 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-between group hover:border-amber-500/40 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div {...provided.dragHandleProps} className="text-gray-500 hover:text-white cursor-grab">
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                            <span className="text-[11px] text-gray-400">Display Position #{index + 1}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="p-2 rounded-xl bg-dark-base hover:bg-dark-hover text-gray-300 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="p-2 rounded-xl bg-dark-base hover:bg-red-500/20 text-red-400"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingCategory ? 'Rename Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desserts or Chef Specials"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-base border border-dark-border text-white text-sm focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
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
