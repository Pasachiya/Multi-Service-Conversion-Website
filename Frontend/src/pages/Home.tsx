import React, { useState } from 'react';
import ServiceSelector from '../components/ServiceSelector';
import FileUploader from '../components/FileUploader';
import ConversionService from '../components/ConversionService';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Convert Any File, Anytime</h1>
        <p className="text-xl text-gray-600">Fast, secure, and high-quality file conversions at your fingertips.</p>
      </section>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-12">
        <ServiceSelector onServiceSelect={setSelectedService} />
        <FileUploader onFileUpload={setUploadedFile} />
        {selectedService && uploadedFile && (
          <ConversionService
            serviceType={selectedService as 'document' | 'image' | 'background' | 'ocr' | 'pdf' | 'compress'}
            file={uploadedFile}
          />
        )}
      </div>

      {/* Rest of the component remains the same */}
    </div>
  );
};

export default Home;