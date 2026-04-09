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
      className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* IMAGE */}
        <img
          src={item.images?.[0] || 'https://placehold.co/400'}
          alt={item.title}
          className="w-full h-48 object-cover"
        />

        {/* CONTENT */}
        <div className="p-3">
          <h2 className="text-lg font-semibold">{item.title}</h2>

          <p className="text-sm text-gray-600">
            {item.category} • {item.condition}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;