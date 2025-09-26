import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import aiService from "../services/aiService";

const Notes = () => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [textContent, setTextContent] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [aiResults, setAiResults] = useState(null);
  const [userNotes, setUserNotes] = useState([]);

  useEffect(() => {
    fetchUserNotes();
  }, []);

  const fetchUserNotes = async () => {
    try {
      const response = await aiService.getUserNotes();
      setUserNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const extractYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const processContent = async () => {
    if (!subject || !title) {
      alert("Please provide subject and title");
      return;
    }

    setLoading(true);
    try {
      let content = "";
      let contentType = "";

      if (youtubeLink) {
        const videoId = extractYouTubeVideoId(youtubeLink);
        if (!videoId) {
          alert("Invalid YouTube URL");
          setLoading(false);
          return;
        }
        content = `YouTube Video: ${youtubeLink}`;
        contentType = "youtube";
      } else if (textContent) {
        content = textContent;
        contentType = "text";
      } else if (uploadedFiles.length > 0) {
        // For now, we'll use the file name as content
        // In a real implementation, you'd process the file content
        content = uploadedFiles.map(f => f.name).join(", ");
        contentType = uploadedFiles[0].type.includes("pdf") ? "pdf" : "image";
      } else {
        alert("Please provide content to process");
        setLoading(false);
        return;
      }

      const response = await aiService.processNoteContent(content, contentType, subject, title);
      setAiResults(response.data);
    } catch (error) {
      console.error("Error processing content:", error);
      alert("Error processing content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveToLibrary = async () => {
    if (!aiResults) return;
    
    try {
      // The note is already saved in the backend during processing
      alert("Note saved to your library!");
      fetchUserNotes();
    } catch (error) {
      console.error("Error saving to library:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">📚</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Notes & AI Summarizer</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Files</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="text-4xl text-gray-400 mb-4">📁</div>
              <p className="text-gray-600 mb-4">Drag & drop files here or click to browse</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
              >
                Choose Files
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Link */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">YouTube Link</h2>
            <input
              type="url"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="Paste YouTube video URL here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Text Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Text Content</h2>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste or type your study material here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="6"
            />
          </div>

          {/* Subject and Title */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  <option value="GATE CS">GATE CS</option>
                  <option value="GATE EC">GATE EC</option>
                  <option value="GATE ME">GATE ME</option>
                  <option value="GATE CE">GATE CE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={processContent}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "🤖 Generate AI Summary & Quiz"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {aiResults ? (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">AI Generated Content</h2>
                <button
                  onClick={saveToLibrary}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  💾 Save to Library
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === "summary"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Summary
                </button>
                <button
                  onClick={() => setActiveTab("flashcards")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === "flashcards"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Flashcards
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    activeTab === "quiz"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Quiz
                </button>
              </div>

              {/* Tab Content */}
              <div className="max-h-96 overflow-y-auto">
                {activeTab === "summary" && (
                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {aiResults.summary}
                    </div>
                  </div>
                )}

                {activeTab === "flashcards" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Flashcards</h3>
                    <div className="space-y-4">
                      {aiResults.flashcards.map((card, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="font-medium text-gray-900 mb-2">
                            Q{index + 1}: {card.question}
                          </div>
                          <div className="text-gray-600">
                            A: {card.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz</h3>
                    <div className="space-y-4">
                      {aiResults.quiz.map((question, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="font-medium text-gray-900 mb-3">
                            Q{index + 1}: {question.question}
                          </div>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  className="mr-2"
                                />
                                <span className="text-gray-700">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center py-12">
                <div className="text-4xl text-gray-400 mb-4">🤖</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Generator</h3>
                <p className="text-gray-600">
                  Upload files, paste text, or add a YouTube link to generate AI-powered summaries, flashcards, and quizzes.
                </p>
              </div>
            </div>
          )}

          {/* Recent Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Uploaded Notes</h2>
            <div className="space-y-3">
              {userNotes.length > 0 ? (
                userNotes.slice(0, 5).map((note) => (
                  <div key={note._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{note.title}</p>
                      <p className="text-sm text-gray-500">{note.subject} • {note.contentType}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      View
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;