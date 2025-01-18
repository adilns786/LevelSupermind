// App.jsx
import React, { useState } from 'react';

const Translation = () => {
  const [inputType, setInputType] = useState('text');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('All');
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setInputText(reader.result);
      reader.readAsText(file);
    }
  };

  const handleTranslate = async () => {
    if (inputType === 'text' && !inputText.trim()) {
      return alert('Please enter some text.');
    }
    if (inputType === 'file' && !selectedFile) {
      return alert('Please upload a file.');
    }

    setLoading(true);
    // Mock API call
    setTimeout(() => {
      const mockTranslations = {
        Hindi: 'नमस्ते',
        Marathi: 'नमस्कार',
        Gujarati: 'નમસ્તે',
        Tamil: 'வணக்கம்',
        Kannada: 'ನಮಸ್ಕಾರ',
        Telugu: 'నమస్తే',
        Bengali: 'নমস্কার',
        Malayalam: 'നമസ്കാരം',
        Punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
        Odia: 'ନମସ୍କାର',
      };
      setTranslations(mockTranslations);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          AI Transcription & Translation
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter an English script below or upload a file to get translations in 10 Indian regional languages.
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Input Type:</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="text">Text</option>
            <option value="file">File</option>
          </select>
        </div>

        {inputType === 'text' ? (
          <textarea
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            rows="5"
            placeholder="Type your English text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        ) : (
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          />
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Target Language:</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Tamil">Tamil</option>
            <option value="Kannada">Kannada</option>
            <option value="Telugu">Telugu</option>
            <option value="Bengali">Bengali</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Odia">Odia</option>
          </select>
        </div>

        <button
          className={`w-full py-3 text-white rounded-md font-medium transition-colors ${
            loading ? 'bg-indigo-300' : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
          onClick={handleTranslate}
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>

        {Object.keys(translations).length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Translations:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(translations).map(([language, translation]) => (
                <div
                  key={language}
                  className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {language}
                  </h3>
                  <p className="text-gray-600">{translation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation