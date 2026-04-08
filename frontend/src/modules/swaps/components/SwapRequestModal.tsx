import { useContext, useEffect, useState } from 'react';
import api from '../../../common/api/axios.instance';
import { AuthContext } from '../../../context/AuthContext';
import type { Item } from '../../../modules/items/types/item.types';
import type { ApiResponse } from '../../../common/api/api.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    requestedItemId: string;
    defaultIsDonation?: boolean;
}

const SwapRequestModal = ({
    isOpen,
    onClose,
    requestedItemId,
    defaultIsDonation = false,
}: Props) => {
    const auth = useContext(AuthContext);
    const [myItems, setMyItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [isDonation, setIsDonation] = useState(defaultIsDonation);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //  fetch user's own items
    useEffect(() => {
        if (!isOpen) return;

        const fetchMyItems = async () => {
            try {
                const res = await api.get<ApiResponse<Item[]>>('/items');

                const currentUserId = auth?.user?.id;

                if (!currentUserId) {
                    setMyItems([]);
                    setError('Unable to identify your account. Please log in again.');
                    return;
                }

                setMyItems(
                    res.data.data.filter((item) => item.ownerId === currentUserId)
                );
            } catch (err) {
                console.error('Failed to fetch user items');
                setError('Failed to load your items');
            }
        };

        setSelectedItem('');
        setError(null);
        setIsDonation(defaultIsDonation);
        fetchMyItems();
    }, [auth?.user?.id, defaultIsDonation, isOpen]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!isDonation && !selectedItem) {
                setError('Please select one of your items to offer');
                return;
            }

            await api.post('/swaps', {
                requestedItemId,
                offeredItemId: isDonation ? null : selectedItem,
                isDonation,
            });

            alert('Swap request sent!');
            onClose();
        } catch (err) {
            console.error('Failed to create swap');
            setError('Failed to create swap request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {isDonation ? 'Request Donation' : 'Request Swap'}
                </h2>

                {error && (
                    <p className="mb-3 text-sm text-red-600">{error}</p>
                )}

                {/* Donation toggle */}
                <label className="flex items-center mb-3">
                    <input
                        type="checkbox"
                        checked={isDonation}
                        onChange={(e) => {
                            setIsDonation(e.target.checked);
                            setSelectedItem('');
                            setError(null);
                        }}
                    />
                    <span className="ml-2">Request as Donation</span>
                </label>

                {/* Select item (only if not donation) */}
                {!isDonation && (
                    <>
                        <select
                            value={selectedItem}
                            onChange={(e) => setSelectedItem(e.target.value)}
                            className="w-full border p-2 mb-2"
                        >
                            <option value="">Select one of your items</option>
                            {myItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.title}
                                </option>
                            ))}
                        </select>

                        {myItems.length === 0 && (
                            <p className="text-sm text-gray-500 mb-4">
                                You do not have any items to offer yet.
                            </p>
                        )}
                    </>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || (!isDonation && myItems.length === 0)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {loading ? 'Sending...' : isDonation ? 'Send Donation Request' : 'Send Swap Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwapRequestModal;