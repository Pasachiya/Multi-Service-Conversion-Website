import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FileUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const { user } = useAuth();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const uploadFiles = async () => {
    if (!user) {
      setUploadStatus('Please log in to upload files.');
      return;
    }

    setUploadStatus('Uploading...');
    const token = localStorage.getItem('token');

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5001/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        console.log(`File uploaded: ${data.filename}`);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus(`Error uploading ${file.name}`);
        return;
      }
    }

    setUploadStatus('All files uploaded successfully!');
    setFiles([]);
  };

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-lg mb-2">Drag & drop files here, or click to select files</p>
        <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, JPG, PNG, and more</p>
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 rounded p-2">
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(file)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition duration-300"
        >
          Upload Files
        </button>
      )}
      {uploadStatus && (
        <p className="mt-4 text-center font-semibold">{uploadStatus}</p>
      )}
    </div>
  );
};

export default FileUploader;