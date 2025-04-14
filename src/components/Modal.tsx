import { FC } from "react";
import { Dialog } from "@headlessui/react";
import { XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  sector: string;
  attackHistory: string[];
  iocs: string[];
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, description, sector, attackHistory, iocs }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Dialog.Panel className="bg-white rounded-lg p-6 w-11/12 sm:w-1/2 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-mono font-semibold text-xl">{title}</h3>
          <button onClick={onClose}>
            <XCircle className="h-6 w-6 text-red-500" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Badge variant="secondary">{sector}</Badge>

        <div className="mt-6">
          <h4 className="font-mono font-semibold text-lg">Attack History:</h4>
          <ul className="list-disc pl-5 text-sm">
            {attackHistory.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="font-mono font-semibold text-lg">Indicators of Compromise (IOCs):</h4>
          <ul className="list-disc pl-5 text-sm">
            {iocs.map((ioc, index) => (
              <li key={index} className="text-blue-500">{ioc}</li>
            ))}
          </ul>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
