import React from 'react';
import { FileText, Image, Scissors, FileSearch, FilePlus2, FileOutput } from 'lucide-react';

const services = [
  { id: 'document', name: 'Document Conversion', icon: FileText },
  { id: 'image', name: 'Image Conversion', icon: Image },
  { id: 'background', name: 'Background Removal', icon: Scissors },
  { id: 'ocr', name: 'OCR', icon: FileSearch },
  { id: 'pdf', name: 'PDF Operations', icon: FilePlus2 },
  { id: 'compress', name: 'Image Compression', icon: FileOutput },
];

interface ServiceSelectorProps {
  onServiceSelect: (serviceId: string) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Select a Service</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            className="flex flex-col items-center justify-center p-4 border rounded-lg transition duration-300 hover:bg-gray-100"
            onClick={() => onServiceSelect(service.id)}
          >
            <service.icon size={32} className="mb-2" />
            <span className="text-sm font-medium">{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;