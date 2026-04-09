import type { Item } from '../types/item.types';
import { useNavigate } from 'react-router-dom';

interface Props {
  item: Item;
}

const ItemCard = ({ item }: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/items/${item.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={item.images?.[0] || 'https://placehold.co/400'}
          alt={item.title}
          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

        <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
          {item.condition}
        </span>
      </div>

      <div className="space-y-2 p-4">
        <h2 className="truncate text-lg font-semibold text-gray-900">
          {item.title}
        </h2>

        <p className="text-sm text-gray-500">
          {item.category}
        </p>

        <div className="pt-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
          View details
        </div>
      </div>
    </div>
  );
};

export default ItemCard;