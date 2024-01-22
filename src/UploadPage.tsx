import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";

interface BlobInfo {
  uri: string;
  name: string;
  contentType: string;
  content: string | null;
}

const UploadPage: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [images, setImages] = useState<BlobInfo[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAllFiles();
  }, []);

  const fetchAllFiles = () => {
    fetch("https://fs16fileupload.azurewebsites.net/file")
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDeleteClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const confirmDeletion = async () => {
    if (selectedImage) {
      const baseUrl = "https://fs16fileupload.azurewebsites.net/file/filename";
      const encodedFilename = encodeURIComponent(selectedImage);
      const url = `${baseUrl}?filename=${encodedFilename}`;

      try {
        const response = await fetch(url, {
          method: "DELETE",
        });

        if (!response.ok) {
          setStatus("File deletion failed");
        }

        // Handle successful deletion
        setStatus("File deleted successfully");
        setSelectedImage(null);
        fetchAllFiles();
      } catch (error) {
        setStatus(`Error: ${error}`);
      }
    }
    setShowModal(false);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    fetch("https://fs16fileupload.azurewebsites.net/file", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          setStatus("Upload failed");
          throw new Error("Upload failed");
        }
      })
      .then(() => {
        setStatus("Upload successful!");
        fetchAllFiles();
      })
      .catch((error) => {
        setStatus(error.message);
      });
  };

  const handleDownload = async (filename: string) => {
    const baseUrl = "https://fs16fileupload.azurewebsites.net/file/filename";
    const encodedFilename = encodeURIComponent(filename);
    const url = `${baseUrl}?filename=${encodedFilename}`;
    console.log("Downloading... ", url);

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("File download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename); // Set the download attribute with the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error:", error);
      // Handle the error
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "50px",
      }}
    >
      <h1>Welcome to My React Vite App</h1>
      <p>
        This is a basic app to perform CRUD operations with Azure blobs storage.
      </p>

      <div
        className="upload-container"
        style={{
          margin: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <h2>Upload Image</h2>
        <form id="file-upload-form" method="post" onSubmit={handleFormSubmit}>
          <input type="file" name="file" accept="image/*" required />
          <br />
          <br />
          <button type="submit">Upload Image</button>
        </form>
      </div>
      <p>{status}</p>
      <div>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              margin: "10px",
            }}
          >
            <img
              src={image.uri}
              alt="Uploaded"
              style={{
                margin: "5px",
                width: "200px",
                height: "200px",
                objectFit: "cover",
                border: "1px solid green",
                borderRadius: "10px",
              }}
            />
            <button
              onClick={() => handleDeleteClick(image.name)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                border: "1px solid black",
              }}
            >
              X
            </button>
            <button
              onClick={() => handleDownload(image.name)}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                border: "1px solid black",
              }}
            >
              ⬇
            </button>
          </div>
        ))}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDeletion}
        fileName={selectedImage}
      />
    </div>
  );
};

export default UploadPage;
