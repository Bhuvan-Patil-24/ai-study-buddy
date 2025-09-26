import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Notes = () => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleUploadAndSummarize = () => {
    // Handle upload and summarization logic here
    console.log("Uploading files:", uploadedFiles);
    console.log("YouTube link:", youtubeLink);
    console.log("Pasted text:", pastedText);
  };

  const handleClearAll = () => {
    setUploadedFiles([]);
    setYoutubeLink("");
    setPastedText("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">📚</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Notes & Summariser</h2>
            <p className="text-gray-600 mb-6">Upload your notes, and let AI help you revise smarter.</p>

            {/* Upload Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload</h3>
              <p className="text-sm text-gray-500 mb-4">PDF/DOC/TXT, images, or a YouTube link.</p>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-4">📁</div>
                <p className="text-gray-600 mb-2">Drag & drop files here or</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
                >
                  Browse
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected files:</p>
                  <div className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* YouTube Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video Link
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔗</span>
                <input
                  type="url"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Paste Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or paste text
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste notes text here..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleUploadAndSummarize}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Upload & Summarise
              </button>
              <button
                onClick={handleClearAll}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition"
              >
                Clear All
              </button>
              <span className="text-sm text-gray-500">
                {uploadedFiles.length + (youtubeLink ? 1 : 0) + (pastedText ? 1 : 0)} items
              </span>
            </div>
          </div>
        </div>

        {/* Recently Uploaded Notes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Recently Uploaded Notes</h2>
            <p className="text-sm text-gray-600 mb-4">Quick access.</p>
            
            <div className="text-center py-8">
              <div className="text-4xl mb-4 text-gray-300">📄</div>
              <p className="text-gray-500">No items yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
