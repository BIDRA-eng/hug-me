import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import Spinner from './components/Spinner';
import { generateHugImage } from './services/geminiService';
import { UploadedImage } from './types';

const KidIcon = () => (
    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 5.029-1.656 5.093 5.093 0 0 0-2.3-2.734 5.2 5.2 0 0 0-5.458 0 5.093 5.093 0 0 0-2.3 2.734A8.949 8.949 0 0 0 10 19Zm-2.91-11.22a2.91 2.91 0 1 1 5.82 0 2.91 2.91 0 0 1-5.82 0Z"/>
    </svg>
);

const AdultIcon = () => (
    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 18">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 0v10M5.442 16.324A.5.5 0 0 0 6 16.5h2a.5.5 0 0 0 .558-.176l1-2 .002-.002a.5.5 0 0 0-.44- .798h-4.24a.5.5 0 0 0-.44.798l1 2 .002.002Z"/>
    </svg>
);


const App: React.FC = () => {
  const [kidImage, setKidImage] = useState<UploadedImage | null>(null);
  const [adultImage, setAdultImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!kidImage || !adultImage) {
      setError('Please upload both a kid and an adult photo.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await generateHugImage(kidImage, adultImage);
      setGeneratedImage(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setKidImage(null);
    setAdultImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  const isButtonDisabled = !kidImage || !adultImage || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-blue-100 flex items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto space-y-8">
        <Header />

        {!generatedImage && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUpload id="kid-photo" label="Your Kid Photo" icon={<KidIcon />} onImageUpload={setKidImage} image={kidImage} />
            <ImageUpload id="adult-photo" label="Your Adult Photo" icon={<AdultIcon />} onImageUpload={setAdultImage} image={adultImage} />
          </div>
        )}

        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[300px]">
          {isLoading ? (
            <Spinner />
          ) : generatedImage ? (
            <div className="w-full text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-700">Your Timeless Hug!</h2>
              <div className="relative group w-full max-w-lg mx-auto overflow-hidden rounded-xl shadow-2xl">
                <img src={generatedImage} alt="Generated hug" className="w-full h-auto object-contain" />
              </div>
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
              >
                Create Another
              </button>
            </div>
          ) : (
            <>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                onClick={handleGenerate}
                disabled={isButtonDisabled}
                className={`px-10 py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 transform
                  ${isButtonDisabled
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-teal-400 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300'
                  }`}
              >
                Generate Hug
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
