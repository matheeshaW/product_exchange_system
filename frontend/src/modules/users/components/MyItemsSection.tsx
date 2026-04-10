import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../../common/components/Spinner';
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

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items],
  );

  const startEditing = (item: MyItem) => {
    setEditingItemId(item.id);
    setDraftTitle(item.title || '');
    setDraftDescription(item.description || '');
    setDraftCategory(item.category || '');
    setDraftCondition(item.condition || '');
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setDraftTitle('');
    setDraftDescription('');
    setDraftCategory('');
    setDraftCondition('');
  };

  const handleSave = async (itemId: string) => {
    const ok = await onSave(itemId, {
      title: draftTitle,
      description: draftDescription,
      category: draftCategory,
      condition: draftCondition,
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
                  <input
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Category"
                  />
                  <input
                    value={draftCondition}
                    onChange={(e) => setDraftCondition(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Condition"
                  />

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
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                  <p className="text-sm text-gray-600">
                    {item.category} • {item.condition}
                  </p>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => startEditing(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-60"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
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
