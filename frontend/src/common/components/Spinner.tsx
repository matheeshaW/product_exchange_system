const Spinner = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
      </div>
    </div>
  );
};

export default Spinner;
