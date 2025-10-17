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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 w-full max-w-3xl flex flex-col items-center animate-fadeIn">
        <h1 className="text-5xl font-extrabold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-10">
          VisionGuard
        </h1>

        <form className="flex flex-col gap-6 w-full items-center" onSubmit={handleSubmit}>
          <label className="w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center hover:border-indigo-500 transition">
              <p className="text-gray-500 dark:text-gray-400 mb-2">Click or drag an image here</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 rounded-xl shadow-md max-h-72 object-contain transition-transform hover:scale-105"
                />
              )}
            </div>
          </label>

          <button
            type="submit"
            disabled={loading || !file}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {result && (
          <div className="mt-10 w-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-inner text-center animate-slideUp">
            <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Prediction Result</h2>
            <p className="text-xl mb-2">
              <span className="font-semibold">Class:</span> {result.class}
            </p>
            <p className="text-xl">
              <span className="font-semibold">Confidence:</span> {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
