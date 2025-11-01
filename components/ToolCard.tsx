import React, { useState, useRef } from 'react';
import { OsintTool } from '../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface ToolCardProps {
  tool: OsintTool;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (selectedFile) {
      setSelectedFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setInputValue(''); // Clear text input when file is selected
    } else {
      setSelectedFile(null);
    }
    // Reset file input to allow selecting the same file again
    if (e.target) e.target.value = '';
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const isFileTool = tool.inputType === 'file';
    if ((isFileTool && !selectedFile) || (tool.inputType === 'text' && !inputValue && !selectedFile)) {
      return;
    }

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      let response: GenerateContentResponse | undefined;

      // Handle dedicated file tools like ExifTool
      if (isFileTool && selectedFile) {
        if (tool.name === 'ExifTool') {
          const base64Image = await fileToBase64(selectedFile);
          response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: { parts: [
                { inlineData: { mimeType: selectedFile.type, data: base64Image } },
                { text: `You are an expert cybersecurity professional simulating the OSINT command-line tool "ExifTool". Your output must be realistic, mimicking the exact format the real tool would produce for the provided image, including fields like Camera Model Name, Date/Time Original, GPS Latitude, GPS Longitude, Image Size, etc. Do not provide any explanations, apologies, or introductory text like "Here is the simulated output:". Provide only the raw, simulated terminal output as if you ran "exiftool ${selectedFile.name}". The data should be plausible for the image provided but can be fictional.` }
              ] },
          });
        }
      // Handle text/hybrid tools
      } else {
        let prompt = '';
        if (tool.name === 'Photon' && selectedFile) {
            const fileContent = await fileToText(selectedFile);
            prompt = `
              You are an expert cybersecurity professional simulating the OSINT command-line tool "Photon".
              The user has uploaded an HTML file named "${selectedFile.name}". Your task is to "crawl" this file's content and extract information like URLs (internal and external), emails, and any other data Photon would typically find.
              Your output must be realistic, mimicking the exact format the real tool would produce, often organized into sections like "URLs", "Emails", etc.
              Do not provide any explanations, apologies, or introductory text like "Here is the simulated output:".
              Provide only the raw, simulated terminal output.
              The data should look authentic and be based *only* on the provided HTML content below.

              --- HTML CONTENT START ---
              ${fileContent}
              --- HTML CONTENT END ---
            `;
        } else if (tool.commandTemplate && inputValue) {
            const command = tool.commandTemplate!.replace('{INPUT}', inputValue);
            prompt = `
              You are an expert cybersecurity professional simulating the OSINT command-line tool "${tool.name}".
              Your output must be realistic, mimicking the exact format the real tool would produce.
              Do not provide any explanations, apologies, or introductory text like "Here is the simulated output:".
              Provide only the raw, simulated terminal output for the command: "$ ${command}".
              The data should look authentic but be completely fictional.
            `;
        }
        
        if (prompt) {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
        }
      }

      if (response) {
        setResult(response.text);
      }

    } catch (e) {
      console.error(e);
      setError('An error occurred. The API key might be invalid or the service is unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const isRunnable = tool.inputType || tool.commandTemplate;
  const commandParts = tool.commandTemplate?.split('{INPUT}');
  const commandPrefix = commandParts?.[0];
  const commandSuffix = commandParts?.[1];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col h-full transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
      <div className="flex-grow">
        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200 bg-opacity-20 last:mr-0 mr-1">
          {tool.category}
        </span>
        <h3 className="text-2xl font-bold text-green-400 mt-3 mb-2">{tool.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
      </div>

      {isRunnable && (
        <div className="mt-auto">
          <form onSubmit={handleExecute}>
            <label className="text-xs text-gray-500 uppercase font-bold">Simulate Command</label>
            <div className="flex items-center space-x-2 mt-1">
              {tool.inputType === 'file' ? (
                <>
                  <label htmlFor={`file-input-${tool.id}`} className="flex-grow cursor-pointer bg-gray-900 border-2 border-gray-700 rounded-md py-2 px-3 text-gray-400 hover:border-green-500 transition-colors truncate">
                    <span className={selectedFile ? 'text-green-400' : ''}>
                      {selectedFile ? selectedFile.name : 'Choose a file...'}
                    </span>
                  </label>
                  <input
                    id={`file-input-${tool.id}`}
                    type="file"
                    accept={tool.accept}
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="flex-grow flex items-center bg-gray-900 border-2 border-gray-700 rounded-md focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 transition-all duration-300 disabled:opacity-50">
                   {commandPrefix && <span className="pl-3 text-gray-500 select-none">$ {commandPrefix}</span>}
                  <input
                    id={`tool-input-${tool.id}`}
                    type="text"
                    placeholder={tool.commandPlaceholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="flex-grow bg-transparent py-2 px-1 text-green-400 placeholder-gray-500 focus:outline-none w-full"
                  />
                  {commandSuffix && <span className="pr-3 text-gray-500 select-none">{commandSuffix}</span>}
                </div>
              )}
              
              {tool.allowFileUpload && (
                <>
                  <button
                    type="button"
                    onClick={triggerFileSelect}
                    disabled={isLoading}
                    className="p-2.5 bg-gray-700 rounded-md text-gray-400 hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Upload file for analysis"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={tool.accept}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              )}

              <button
                type="submit"
                disabled={isLoading || (!selectedFile && !inputValue)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Run'}
              </button>
            </div>
            
            {tool.allowFileUpload && selectedFile && (
              <div className="mt-2 text-sm text-gray-400 flex items-center">
                <span className="text-gray-500 mr-2 flex-shrink-0">Attached:</span>
                <span className="text-green-400 truncate font-medium">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="ml-2 p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  title="Clear file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </form>

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          
          {result && (
            <div className="mt-4">
              <label className="text-xs text-gray-500 uppercase font-bold">Simulated Output</label>
              <div className="relative mt-1 bg-gray-900 rounded-md p-3 text-gray-300 font-mono text-sm group max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words"><code>{result}</code></pre>
                <button
                  onClick={() => handleCopy(result)}
                  className="absolute top-2 right-2 p-1 bg-gray-700 rounded-md text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-green-500 hover:text-white"
                  title="Copy output"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tool.url && (
        <div className="mt-auto pt-4">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-colors"
          >
            Visit Website
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};
