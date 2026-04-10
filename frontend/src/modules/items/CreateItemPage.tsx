import { useNavigate } from 'react-router-dom';
import { useCreateItem } from './hooks/use-create-item';
import ItemForm from './components/ItemForm';
import type { ItemFormData } from './types/create-item.types';

const CreateItemPage = () => {
  const navigate = useNavigate();
  const { loading, error, success, createItem, resetForm } = useCreateItem();

  const handleFormSubmit = async (formData: ItemFormData, images: File[]) => {
    const success = await createItem(formData, images);

    if (success) {
      resetForm();
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Listing</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Create New Item</h1>
        <p className="mt-1 text-sm text-slate-600">Add clear details and good photos to improve your chances of a quick match.</p>
      </section>

      {/* Success Message */}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Item created successfully!</h3>
              <p className="mt-1 text-sm text-green-700">Redirecting to home page...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ItemForm onSubmit={handleFormSubmit} loading={loading} />
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Tips for Better Results</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>- Use clear, bright images from multiple angles.</li>
            <li>- Write a concise title with key item details.</li>
            <li>- Mention any wear or defects in description.</li>
            <li>- Pick accurate condition to reduce disputes.</li>
          </ul>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            Listings with complete details usually receive faster swap responses.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateItemPage;
