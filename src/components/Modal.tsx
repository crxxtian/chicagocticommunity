import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // to handle classnames based on dark/light mode

interface ModalProps {
  title: string;
  content: string | React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ title, content, isOpen, onClose }: ModalProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 max-w-lg w-full space-y-4 shadow-lg overflow-y-auto"
      >
        <Button
          variant="ghost"
          className="absolute top-2 right-2 p-2"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-300" />
        </Button>
        <div>
          <h3 className="text-2xl font-mono font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{content}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
