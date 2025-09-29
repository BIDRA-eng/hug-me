import React, { useRef, useState } from 'react';
import { UploadedImage } from '../types';

interface ImageUploadProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onImageUpload: (image: UploadedImage) => void;
  image: UploadedImage | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ id, label, icon, onImageUpload, image }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const mimeType = result.substring(result.indexOf(':') + 1, result.indexOf(';'));
        const base64 = result.split(',')[1];
        onImageUpload({ previewUrl: result, base64, mimeType });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      >
        {image ? (
          <img src={image.previewUrl} alt={label} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            {icon}
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">{label}</span></p>
            <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
          </div>
        )}
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
