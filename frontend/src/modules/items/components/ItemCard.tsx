import type { Item } from '../types/item.types';

interface Props {
  item: Item;
}

const ItemCard = ({ item }: Props) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* IMAGE */}
      <img
        src={item.images?.[0] || 'https://via.placeholder.com/300'}
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
  );
};

export default ItemCard;