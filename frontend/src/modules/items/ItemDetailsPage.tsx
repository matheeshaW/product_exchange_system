import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../common/api/axios.instance';
import { getApiErrorMessage } from '../../common/api/error-message';
import type { Item } from './types/item.types';
import type { ApiResponse } from '../../common/api/api.types';
import SwapRequestModal from '../../modules/swaps/components/SwapRequestModal';

const ItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDonationMode, setIsDonationMode] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setError(null);
        const res = await api.get<ApiResponse<Item>>(`/items/${id}`);

        setItem(res.data.data);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to fetch item'));
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [item?.id]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  if (!item) return <div className="p-4">Item not found</div>;

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://placehold.co/900x600?text=No+Image'];

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* IMAGE GALLERY */}
      <div className="mb-6">
        <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
          <img
            src={images[selectedImageIndex]}
            alt={`${item.title} image ${selectedImageIndex + 1}`}
            className="w-full h-80 sm:h-96 object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePreviousImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition"
                aria-label="Previous image"
              >
                <span className="text-lg leading-none">&#8249;</span>
              </button>

              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/60 text-white w-9 h-9 rounded-full flex items-center justify-center transition"
                aria-label="Next image"
              >
                <span className="text-lg leading-none">&#8250;</span>
              </button>

              <div className="absolute bottom-3 right-3 bg-black/55 text-white text-xs px-2 py-1 rounded-full">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
            {images.map((imageUrl, index) => (
              <button
                type="button"
                key={`${imageUrl}-${index}`}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative rounded-lg overflow-hidden border-2 transition ${
                  selectedImageIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`Show image ${index + 1}`}
              >
                <img
                  src={imageUrl}
                  alt={`${item.title} thumbnail ${index + 1}`}
                  className="w-full h-16 object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETAILS */}
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>

      <p className="text-gray-600 mb-2">
        {item.category} • {item.condition}
      </p>

      <p className="mb-4">{item.description}</p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setIsDonationMode(false);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Request Swap
        </button>

        <button
          onClick={() => {
            setIsDonationMode(true);
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Request Donation
        </button>
      </div>
      <SwapRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        requestedItemId={item.id}
        defaultIsDonation={isDonationMode}
      />
    </div>
  );
};

export default ItemDetailsPage;