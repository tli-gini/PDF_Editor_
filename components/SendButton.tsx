import { MdSend } from "react-icons/md";

interface SendButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export default function SendButton({ onClick, loading }: SendButtonProps) {
  return (
    <div className="flex justify-end w-full max-w-lg mt-8 mb-2">
      {loading ? (
        <button
          className="px-5 pt-2 pb-2 text-white bg-gray-400 cursor-not-allowed rounded-2xl"
          disabled
        >
          Loading...
        </button>
      ) : (
        <button
          onClick={onClick}
          className="px-5 pt-2 pb-2 text-white transition-transform rounded-2xl bg-primary hover:scale-105 hover:shadow-[0_6px_24px_rgba(255,255,255,0.6)] active:scale-95 focus:ring-2 focus:ring-white"
        >
          <MdSend className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
