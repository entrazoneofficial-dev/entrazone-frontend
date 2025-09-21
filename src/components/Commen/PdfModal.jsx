import React, { useEffect, useState } from "react";
import axios from "axios";

export function PdfModal({ pdfUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    console.log("PDF URL:", pdfUrl);
    
    const isLocalUrl = pdfUrl.includes("localhost") || pdfUrl.includes("127.0.0.1");
    
    if (isLocalUrl) {
      setLoading(true);
      setError(null);
      
      // Fetch the PDF as a blob
      axios({
        url: pdfUrl,
        method: 'GET',
        responseType: 'blob',
      })
        .then(response => {
          // Create a blob URL from the PDF data
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching PDF:", err);
          setError("Failed to load PDF. Please try again later.");
          setLoading(false);
        });
    } else {
      // For non-local URLs, we'll use the URL directly
      setBlobUrl(null);
      setLoading(false);
    }
    
    // Clean up blob URL when component unmounts
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [pdfUrl]);

  // For remote files that aren't local, we can use Google Docs viewer
  const isLocalUrl = pdfUrl.includes("localhost") || pdfUrl.includes("127.0.0.1");
  const googleViewerUrl = !isLocalUrl && !blobUrl ? `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true` : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">PDF Viewer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <p className="mb-4 text-red-500">{error}</p>
              <a
                href={pdfUrl}
                download
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Download Instead
              </a>
            </div>
          ) : blobUrl ? (
            // Use the blob URL for local files
            <iframe
              src={blobUrl}
              className="w-full h-full"
              frameBorder="0"
              title="PDF Viewer"
            />
          ) : (
            // For remote files, use Google Docs viewer
            <iframe
              src={googleViewerUrl}
              className="w-full h-full bg-white"
              frameBorder="0"
              title="PDF Viewer"
            />
          )}
        </div>
      </div>
    </div>
  );
}