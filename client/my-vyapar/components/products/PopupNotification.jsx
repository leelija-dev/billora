import { FiCheck } from 'react-icons/fi';

const PopupNotification = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-xl z-[9999] animate-slide-up text-sm flex items-center gap-2">
      <FiCheck className="w-4 h-4" />
      {message}
    </div>
  );
};

export default PopupNotification;