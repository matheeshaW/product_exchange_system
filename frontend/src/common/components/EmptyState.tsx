interface Props {
  message: string;
}

const EmptyState = ({ message }: Props) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
};

export default EmptyState;
