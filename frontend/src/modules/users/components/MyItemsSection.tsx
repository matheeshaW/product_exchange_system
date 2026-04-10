import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../../common/components/Spinner';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../../../utils/constants';
import type { MyItem } from '../types/user-items.types';

interface Props {
  items: MyItem[];
  loading: boolean;
  error: string | null;
  savingId: string | null;
  deletingId: string | null;
  onSave: (itemId: string, payload: {
    title?: string;
    description?: string;
    category?: string;
    condition?: string;
    keepImageUrls?: string[];
    newImages?: File[];
  }) => Promise<boolean>;
  onDelete: (itemId: string) => Promise<boolean>;
}

const MyItemsSection = ({
  items,
  loading,
  error,
  savingId,
  deletingId,
  onSave,
  onDelete,
}: Props) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftCategory, setDraftCategory] = useState('');
  const [draftCondition, setDraftCondition] = useState('');
  const [draftKeptImageUrls, setDraftKeptImageUrls] = useState<string[]>([]);
  const [draftNewImages, setDraftNewImages] = useState<File[]>([]);
  const [draftNewImagePreviews, setDraftNewImagePreviews] = useState<string[]>([]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items],
  );

  const startEditing = (item: MyItem) => {
    if (item.status === 'SWAPPED') {
      return;
    }

    setEditingItemId(item.id);
    setDraftTitle(item.title || '');
    setDraftDescription(item.description || '');
    setDraftCategory(item.category || '');
    setDraftCondition(item.condition || '');
    setDraftKeptImageUrls(item.images || []);
    setDraftNewImages([]);
    setDraftNewImagePreviews([]);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setDraftTitle('');
    setDraftDescription('');
    setDraftCategory('');
    setDraftCondition('');
    setDraftKeptImageUrls([]);
    setDraftNewImages([]);
    setDraftNewImagePreviews([]);
  };

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const selected = Array.from(files);
    const totalCount = draftKeptImageUrls.length + draftNewImages.length + selected.length;

    if (totalCount > 5) {
      return;
    }

    const previews = selected.map((file) => URL.createObjectURL(file));
    setDraftNewImages((prev) => [...prev, ...selected]);
    setDraftNewImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (imageUrl: string) => {
    setDraftKeptImageUrls((prev) => prev.filter((url) => url !== imageUrl));
  };

  const removeNewImage = (index: number) => {
    setDraftNewImages((prev) => prev.filter((_, i) => i !== index));
    setDraftNewImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = async (itemId: string) => {
    const ok = await onSave(itemId, {
      title: draftTitle,
      description: draftDescription,
      category: draftCategory,
      condition: draftCondition,
      keepImageUrls: draftKeptImageUrls,
      newImages: draftNewImages,
    });

    if (ok) {
      cancelEditing();
    }
  };

  const handleDelete = async (itemId: string) => {
    const confirmed = window.confirm('Delete this item? This cannot be undone.');
    if (!confirmed) return;
    await onDelete(itemId);
  };

  return (
    <section className="bg-white border rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">My Items</h2>
          <p className="text-sm text-gray-600">Manage your listed and swapped items.</p>
        </div>
        <Link
          to="/items/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
        >
          Create Item
        </Link>
      </div>

      {loading && <Spinner />}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>
      )}

      {!loading && sortedItems.length === 0 && (
        <p className="text-sm text-gray-500">You have not created any items yet.</p>
      )}

      <div className="space-y-3">
        {sortedItems.map((item) => {
          const isEditing = editingItemId === item.id;
          const isSaving = savingId === item.id;
          const isDeleting = deletingId === item.id;
          const isSwapped = item.status === 'SWAPPED';

          return (
            <article key={item.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'SWAPPED'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <input
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Title"
                  />
                  <textarea
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    className="w-full border p-2 rounded"
                    rows={3}
                    placeholder="Description"
                  />
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select category</option>
                    {ITEM_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={draftCondition}
                    onChange={(e) => setDraftCondition(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select condition</option>
                    {ITEM_CONDITIONS.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Images (max 5)</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {draftKeptImageUrls.map((imageUrl) => (
                        <div key={imageUrl} className="relative">
                          <img src={imageUrl} alt="Item" className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(imageUrl)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs"
                          >
                            x
                          </button>
                        </div>
                      ))}
                      {draftNewImagePreviews.map((previewUrl, index) => (
                        <div key={previewUrl} className="relative">
                          <img src={previewUrl} alt="New item" className="w-full h-20 object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewImageSelect}
                      disabled={draftKeptImageUrls.length + draftNewImages.length >= 5}
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(item.id)}
                      disabled={isSaving}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {item.images && item.images.length > 0 && (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                  <p className="text-sm text-gray-600">
                    {item.category} • {item.condition}
                  </p>
                  {item.images && item.images.length > 1 && (
                    <p className="text-xs text-gray-500">
                      +{item.images.length - 1} more image{item.images.length - 1 > 1 ? 's' : ''}
                    </p>
                  )}

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => startEditing(item)}
                      disabled={isSwapped}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting || isSwapped}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                  {isSwapped && (
                    <p className="text-xs text-amber-700">
                      Swapped items are locked and cannot be edited or deleted.
                    </p>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MyItemsSection;
