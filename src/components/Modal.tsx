import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ title, content, isOpen, onClose }: ModalProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-muted px-6 py-6 text-muted-foreground shadow-xl"
      >
        <Button
          variant="ghost"
          className="absolute top-2 right-2 p-2 text-muted-foreground"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <h2 className="text-2xl font-mono font-bold mb-4 text-foreground">{title}</h2>

        <div className="space-y-4 text-sm leading-relaxed font-mono whitespace-pre-wrap">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
