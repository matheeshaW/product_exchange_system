interface Props {
  message: string;
}

const EmptyState = ({ message }: Props) => {
  return <div className="p-6 text-center text-gray-500">{message}</div>;
};

export default EmptyState;
