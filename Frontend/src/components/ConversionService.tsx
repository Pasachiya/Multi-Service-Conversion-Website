import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ConversionServiceProps {
  serviceType: 'document' | 'image' | 'background' | 'ocr' | 'pdf' | 'compress';
  file: File;
}

const ConversionService: React.FC<ConversionServiceProps> = ({ serviceType, file }) => {
  const [outputFormat, setOutputFormat] = useState('');
  const [conversionStatus, setConversionStatus] = useState<string | null>(null);
  const { user } = useAuth();

  const handleConversion = async () => {
    if (!user) {
      setConversionStatus('Please log in to use conversion services.');
      return;
    }

    setConversionStatus('Converting...');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    if (outputFormat) {
      formData.append('output_format', outputFormat);
    }

    let endpoint = '';
    switch (serviceType) {
      case 'document':
        endpoint = 'http://localhost:5002/convert';
        break;
      case 'image':
        endpoint = 'http://localhost:5003/convert';
        break;
      case 'background':
        endpoint = 'http://localhost:5004/remove_background';
        break;
      case 'ocr':
        endpoint = 'http://localhost:5005/ocr';
        break;
      case 'pdf':
        endpoint = 'http://localhost:5006/merge'; // Assuming merge operation for simplicity
        break;
      case 'compress':
        endpoint = 'http://localhost:5003/convert'; // Reusing image conversion service for compression
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `converted_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setConversionStatus('Conversion successful! File downloaded.');
    } catch (error) {
      console.error('Error during conversion:', error);
      setConversionStatus('Conversion failed. Please try again.');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Convert {file.name}</h3>
      {serviceType !== 'background' && (
        <div className="mb-4">
          <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">
            Output Format
          </label>
          <select
            id="outputFormat"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select format</option>
            {serviceType === 'document' && (
              <>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="txt">TXT</option>
              </>
            )}
            {serviceType === 'image' && (
              <>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </>
            )}
            {serviceType === 'ocr' && (
              <>
                <option value="txt">TXT</option>
                <option value="pdf">PDF</option>
              </>
            )}
          </select>
        </div>
      )}
      <button
        onClick={handleConversion}
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition duration-300"
      >
        Start Conversion
      </button>
      {conversionStatus && (
        <p className="mt-2 text-sm font-medium">{conversionStatus}</p>
      )}
    </div>
  );
};

export default ConversionService;