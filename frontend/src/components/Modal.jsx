export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      
      {/* Modal Box */}
      <div className="bg-white w-full max-w-xl max-h-[80vh] overflow-y-auto rounded-xl p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        {children}
      </div>
    </div>
  );
}