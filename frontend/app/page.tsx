"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { predictImage } from "../services/api";
import "./globals.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ class: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      
      // Get image dimensions
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
        };
        img.src = event.target?.result as string;
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await predictImage(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to predict image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setImageSize(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { label: "High", color: "text-green-600 dark:text-green-400" };
    if (confidence >= 0.5) return { label: "Medium", color: "text-yellow-600 dark:text-yellow-400" };
    return { label: "Low", color: "text-red-600 dark:text-red-400" };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-7xl flex flex-col lg:flex-row gap-6 items-start justify-between">
        
        {/* Left Section - Form */}
        <div className="flex-1 w-full max-w-sm">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            VisionGuard AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Upload an image and let VisionGuard detect and classify visual content using AI.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-800 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            {file && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-md text-xs space-y-1">
                <p className="font-semibold">📄 {file.name}</p>
                <p>Size: {formatFileSize(file.size)} | {imageSize && `Dimensions: ${imageSize.width}×${imageSize.height}px`}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !file}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Predict"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={!file && !result}
                className="px-4 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition text-gray-800 dark:text-white font-semibold py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Middle Section - Image Preview */}
        <div className="flex-1 w-full max-w-2xl flex justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg shadow-md max-h-96 w-full object-cover border border-gray-200 dark:border-gray-700"
            />
          ) : (
            <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h10a4 4 0 004-4v-3a4 4 0 00-4-4H7a4 4 0 00-4 4v3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 10l2-2 3 3 4-4 3 3" />
              </svg>
              <p className="text-sm text-gray-500 dark:text-gray-400">No image selected</p>
              <p className="text-xs text-gray-400 mt-1">Upload an image to see a preview</p>
            </div>
          )}
        </div>

        {/* Right Section - Prediction Result */}
        <div className="flex-1 w-full max-w-sm">
          {result ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-inner">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Prediction Result
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-300 dark:border-indigo-700 rounded-lg p-4">
                  <p className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold uppercase tracking-wide mb-1">Detected Class</p>
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">{result.class}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Confidence Score</p>
                    <p className={`text-lg font-bold ${getConfidenceLevel(result.confidence).color}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden border border-gray-300 dark:border-gray-600">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    result.confidence >= 0.8 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                    result.confidence >= 0.5 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {getConfidenceLevel(result.confidence).label} Confidence
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col items-start justify-center text-gray-500">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">Prediction Result</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">No prediction yet</p>
              <p className="text-xs text-gray-400 mt-2">After you upload and predict an image, results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}