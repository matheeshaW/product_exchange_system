import { useState, useCallback } from 'react';
import { ITEM_CATEGORIES, ITEM_CONDITIONS } from '../../../utils/constants';
import type { ItemFormData } from '../types/create-item.types';

interface ItemFormProps {
  onSubmit: (formData: ItemFormData, images: File[]) => Promise<void>;
  loading: boolean;
}

const ItemForm = ({ onSubmit, loading }: ItemFormProps) => {
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    category: '',
    condition: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 150) {
      newErrors.title = 'Title must be less than 150 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, images]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalImages = images.length + newFiles.length;

    if (totalImages > 5) {
      setErrors((prev) => ({
        ...prev,
        images: `Maximum 5 images allowed. You selected ${totalImages}`,
      }));
      return;
    }

    // Create preview URLs
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setErrors((prev) => ({ ...prev, images: '' }));
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData, images);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
          Title *
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="e.g., Vintage Coffee Table"
          maxLength={150}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <p className="mt-1 text-xs text-slate-500">
          {formData.title.length}/150 characters
        </p>
        {errors.title && <p className="mt-1 text-sm text-rose-600">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="Describe your item's condition, features, and any notable details..."
          maxLength={500}
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <p className="mt-1 text-xs text-slate-500">
          {formData.description.length}/500 characters
        </p>
        {errors.description && <p className="mt-1 text-sm text-rose-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Select a category</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-rose-600">{errors.category}</p>}
        </div>

        {/* Condition */}
        <div>
          <label htmlFor="condition" className="mb-1 block text-sm font-medium text-slate-700">
            Condition *
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Select condition</option>
            {ITEM_CONDITIONS.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>
          {errors.condition && <p className="mt-1 text-sm text-rose-600">{errors.condition}</p>}
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label htmlFor="images" className="mb-1 block text-sm font-medium text-slate-700">
          Images * (Max 5)
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          disabled={loading || images.length >= 5}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        <p className="mt-1 text-xs text-slate-500">
          {images.length}/5 images selected
        </p>
        {errors.images && <p className="mt-1 text-sm text-rose-600">{errors.images}</p>}
      </div>

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-700">Image Preview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={loading}
                      className="absolute top-1 right-1 rounded-full bg-rose-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? 'Creating Item...' : 'Create Item'}
      </button>
    </form>
  );
};

export default ItemForm;
