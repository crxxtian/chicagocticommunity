import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ title, content, isOpen, onClose }: ModalProps) => {
  const overlayRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [onClose]);

  // Close when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onClick={handleClickOutside}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className={cn(
              "relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-background p-6 text-foreground shadow-xl",
              "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
            )}
          >
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </Button>

            <h2 className="text-2xl font-mono font-semibold mb-4 text-blue-400">
              {title}
            </h2>

            <div className="prose dark:prose-invert prose-sm max-w-none font-mono whitespace-pre-wrap text-muted-foreground">
              {content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
