"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { predictImage } from "../services/api";
import "./globals.css";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ class: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await predictImage(file);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error predicting image");
    } finally {
      setLoading(false);
    }
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
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </form>
        </div>

        {/* Middle Section - Image Preview */}
        {imagePreview && (
          <div className="flex-1 w-full max-w-md flex justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg shadow-md max-h-72 object-contain border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}

        {/* Right Section - Prediction Result */}
        {result && (
          <div className="flex-1 w-full max-w-sm bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-inner">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Prediction Result
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-medium">Class:</span> {result.class}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Confidence:</span> {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
