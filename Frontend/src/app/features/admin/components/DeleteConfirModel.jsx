const DeleteConfirmModal = ({
  title,
  message,
  onConfirm,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-red-400">
          {title}
        </h2>

        <p className="text-zinc-400 mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;