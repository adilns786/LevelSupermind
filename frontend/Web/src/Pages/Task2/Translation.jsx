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

    setTimeout(() => {
      const mockTranslations = {
        Hindi: 'नमस्ते, यह उदाहरण वाक्य है।',
        Marathi: 'नमस्कार, हा एक उदाहरण वाक्य आहे.',
        Gujarati: 'નમસ્તે, આ ઉદાહરણ વાક્ય છે.',
        Tamil: 'வணக்கம், இது ஒரு உதாரண வாக்கியம்.',
        Kannada: 'ನಮಸ್ಕಾರ, ಇದು ಒಂದು ಉದಾಹರಣೆಯ ವಾಕ್ಯ.',
        Telugu: 'నమస్తే, ఇది ఒక ఉదాహరణ వాక్యం.',
        Bengali: 'নমস্কার, এটি একটি উদাহরণ বাক্য।',
        Malayalam: 'നമസ്കാരം, ഇതൊരു ഉദാഹരണ വാക്യം.',
        Punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਇਹ ਇੱਕ ਉਦਾਹਰਣ ਵਾਕ ਹੈ।',
        Odia: 'ନମସ୍କାର, ଏହା ଏକ ଉଦାହରଣ ବାକ୍ୟ।'
      };

      setTranslations(mockTranslations);
      setLoading(false);
    }, 2000);
  };

  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
  };

  const availableLanguages = Object.keys(translations);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-4">AI Transcription & Translation</h1>
        <p className="text-gray-300 text-center mb-6">
          Enter an English script below or upload a file to get translations in 10 Indian regional languages.
        </p>

        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-2">Input Type:</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
          >
            <option value="text">Text</option>
            <option value="file">File</option>
          </select>
        </div>

        {inputType === 'text' ? (
          <textarea
            className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 bg-gray-700 text-white placeholder-gray-400"
            rows="6"
            placeholder="Type your English text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        ) : (
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 bg-gray-700 text-white"
          />
        )}

        <button
          className={`w-full py-4 text-white font-bold rounded-lg transition-colors shadow-md ${
            loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handleTranslate}
          disabled={loading}
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>

        {Object.keys(translations).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Translations:</h2>
            
            <div className="mb-6">
              <label className="block text-gray-300 font-medium mb-2">Select Language for Translation:</label>
              <select
                value={targetLanguage}
                onChange={handleLanguageChange}
                className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
              >
                <option value="All">All Languages</option>
                {availableLanguages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {targetLanguage === 'All' ? (
                Object.entries(translations).map(([language, translation]) => (
                  <div
                    key={language}
                    className="p-6 border border-gray-700 rounded-lg shadow-md bg-gray-700 hover:bg-gray-800"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{language}</h3>
                    <p className="text-gray-300">{translation}</p>
                  </div>
                ))
              ) : (
                translations[targetLanguage] && (
                  <div className="p-6 border border-gray-700 rounded-lg shadow-md bg-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-2">{targetLanguage}</h3>
                    <p className="text-gray-300">{translations[targetLanguage]}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;
