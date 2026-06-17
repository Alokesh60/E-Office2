import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import styles from "./Files.module.css";

const Files = () => {
  const fileInputRef = useRef(null);

  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [storage, setStorage] = useState(null);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [namingModal, setNamingModal] = useState({ isOpen: false, type: "", title: "", value: "", target: null });

  const fetchFolders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/folders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        window.location.href = "/";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setFolders(data);
        if (data.length > 0) {
          setActiveFolder(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching folders");
    }
  };

  const fetchFiles = async (folderId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/files/${folderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("Error loading folder files", err);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/storage-info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setStorage(data);
      }
    } catch (err) {
      console.error("Error loading storage info", err);
    }
  };

  useEffect(() => {
    document.body.classList.add("files-page-active");
    
    const initFetch = async () => {
      setLoading(true);
      await fetchFolders();
      await fetchStorageInfo();
      setLoading(false);
    };

    initFetch();

    return () => {
      document.body.classList.remove("files-page-active");
    };
  }, []);

  useEffect(() => {
    if (activeFolder && !searchQuery) {
      fetchFiles(activeFolder.id);
    }
  }, [activeFolder, searchQuery]);

  const handleCreateFolder = () => {
    setNamingModal({
      isOpen: true,
      type: "folder_create",
      title: "Create New Folder",
      value: "",
      target: null
    });
  };

  const handleDeleteFolder = async () => {
    if (!folderToDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/folder/${folderToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("Folder deleted successfully!");
        const remaining = folders.filter((f) => f.id !== folderToDelete.id);
        setFolders(remaining);
        
        // If deleted folder was active, switch active folder to first available or null
        if (activeFolder?.id === folderToDelete.id) {
          setActiveFolder(remaining.length > 0 ? remaining[0] : null);
        }
      } else {
        toast.error("Failed to delete folder");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting folder");
    } finally {
      setFolderToDelete(null);
      fetchStorageInfo();
    }
  };

  const handleRenameFile = (file) => {
    setNamingModal({
      isOpen: true,
      type: "file_rename",
      title: "Rename File",
      value: file.file_name,
      target: file
    });
  };

  const executeNamingAction = async () => {
    const { type, value, target } = namingModal;
    if (!value.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (type === "folder_create") {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/folder/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ name: value }),
        });
        if (res.ok) {
          toast.success("Folder created successfully!");
          const newFolder = await res.json();
          setFolders((prev) => [...prev, newFolder]);
          setActiveFolder(newFolder);
        } else {
          toast.error("Failed to create folder");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error creating folder");
      }
    } else if (type === "file_rename") {
      if (value === target.file_name) {
        setNamingModal({ isOpen: false, type: "", title: "", value: "", target: null });
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/file/${target.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ file_name: value }),
        });

        if (res.ok) {
          toast.success("File renamed successfully!");
          if (searchQuery) {
            handleSearch(searchQuery);
          } else if (activeFolder) {
            fetchFiles(activeFolder.id);
          }
        } else {
          toast.error("Failed to rename file");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error renaming file");
      }
    }
    setNamingModal({ isOpen: false, type: "", title: "", value: "", target: null });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!activeFolder) {
      toast.error("Please select or create a folder first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", activeFolder.id);

    const uploadToast = toast.loading("Uploading file...");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/file/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.ok) {
        toast.success("File uploaded successfully!", { id: uploadToast });
        fetchFiles(activeFolder.id);
        fetchStorageInfo();
      } else {
        toast.error("Upload failed", { id: uploadToast });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file", { id: uploadToast });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
  };

  const executeDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/file/${fileToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        toast.success("File deleted!");
        if (searchQuery) {
          handleSearch(searchQuery);
        } else if (activeFolder) {
          fetchFiles(activeFolder.id);
        }
        fetchStorageInfo();
      } else {
        toast.error("Failed to delete file");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting file");
    } finally {
      setFileToDelete(null);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/file/download/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to download file");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error downloading file");
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      if (activeFolder) {
        fetchFiles(activeFolder.id);
      }
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/files/search?query=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("Error searching files", err);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0 || !bytes) return "0 KB";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatUploadDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return "Today";
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatLastModified = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    if (diffMs < 0) return "Just now";
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getFileIconClass = (type) => {
    if (!type) return "ri-file-line";
    const t = type.toUpperCase();
    if (t === "PDF") return "ri-file-pdf-line";
    if (t === "DOC" || t === "DOCX") return "ri-file-word-line";
    if (t === "XLS" || t === "XLSX") return "ri-file-excel-line";
    if (t === "PPT" || t === "PPTX") return "ri-file-ppt-line";
    if (t === "ZIP" || t === "RAR" || t === "7Z") return "ri-file-zip-line";
    if (["PNG", "JPG", "JPEG", "GIF", "WEBP"].includes(t)) return "ri-image-line";
    return "ri-file-line";
  };

  return (
    <div className={styles.filesPage}>
      <div className={styles.filesLayout}>
        <div className={styles.filesContainer}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <h2>My Files</h2>

            <div className={styles.headerActions}>
              <input
                className={styles.searchInput}
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />

              <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                Upload Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* PATH */}
          <div className={styles.folderPath}>
            Folders &gt; {searchQuery ? `Search results for "${searchQuery}"` : activeFolder?.name || "N/A"}
          </div>

          {/* MAIN GRID */}
          <div className={styles.filesGrid}>
            {/* FOLDER PANEL */}
            <div className={styles.folderPanel}>
              <h4>Folders</h4>

              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={`${styles.folderItem} ${
                    activeFolder?.id === folder.id && !searchQuery ? styles.activeFolder : ""
                  }`}
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFolder(folder);
                  }}
                >
                  <span>{folder.name}</span>
                  <button 
                    className={styles.folderDeleteBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFolderToDelete(folder);
                    }}
                    title="Delete folder"
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                </div>
              ))}

              <button className={styles.createFolder} onClick={handleCreateFolder}>
                + Create New Folder
              </button>
            </div>

            {/* FILE TABLE */}
            <div className={styles.fileTable}>
              <div className={styles.tableHeader}>
                <span>Files</span>
                <span>Upload Date</span>
                <span>Size</span>
                <span>Type</span>
                <span>Last Modified</span>
                <span>Actions</span>
              </div>

              {files.map((file, i) => (
                <div key={file.id || i} className={styles.fileRow}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className={getFileIconClass(file.file_type)} style={{ color: "#475569" }} />
                    <span 
                      style={{ cursor: "pointer", textDecoration: "underline" }} 
                      onClick={() => handleDownloadFile(file.id, file.file_name)}
                    >
                      {file.file_name}
                    </span>
                  </span>
                  <span>{formatUploadDate(file.created_at)}</span>
                  <span>{formatBytes(file.file_size)}</span>
                  <span>{file.file_type}</span>
                  <span>{formatLastModified(file.updated_at)}</span>
                  <div className={styles.fileActions}>
                    <i 
                      className={`ri-eye-line ${styles.fileActionIcon} ${styles.viewIcon}`}
                      title="View File"
                      onClick={() => window.open(`http://127.0.0.1:8000/storage/${file.file_path}`, "_blank")}
                    />
                    <i 
                      className={`ri-edit-line ${styles.fileActionIcon} ${styles.renameIcon}`}
                      title="Rename File"
                      onClick={() => handleRenameFile(file)}
                    />
                    <i 
                      className={`ri-delete-bin-line ${styles.fileActionIcon} ${styles.deleteIcon}`}
                      title="Delete File"
                      onClick={() => handleDeleteFile(file)}
                    />
                  </div>
                </div>
              ))}

              {files.length === 0 && (
                <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", marginTop: "40px" }}>
                  {loading ? "Loading files..." : "No files in this folder."}
                </p>
              )}
            </div>
          </div>

          {/* STORAGE */}
          <div className={styles.storageCard}>
            <h4>Storage Info</h4>

            <div className={styles.storageBar}>
              <div 
                className={styles.storageProgress} 
                style={{ width: `${storage?.percent_used || 0}%` }}
              ></div>
            </div>

            <p>
              {storage ? `${storage.percent_used}% of ${storage.total_formatted} used` : "0% of 10 GB used"}
            </p>
          </div>
        </div>
      </div>

      {/* FOLDER DELETE CONFIRMATION MODAL */}
      {folderToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <i className="ri-error-warning-line" style={{ color: "#ef4444" }} />
              Delete Folder
            </h3>
            
            <p className={styles.modalDescription}>
              Confirm you want to delete folder <strong>"{folderToDelete.name}"</strong>?
            </p>
            
            <div className={styles.modalWarningText}>
              Warning: All your files inside this folder will get deleted.
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.btnCancel} 
                onClick={() => setFolderToDelete(null)}
              >
                Back
              </button>
              <button 
                className={styles.btnDanger} 
                onClick={handleDeleteFolder}
              >
                Delete Option
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILE DELETE CONFIRMATION MODAL */}
      {fileToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <i className="ri-error-warning-line" style={{ color: "#ef4444" }} />
              Delete File
            </h3>
            
            <p className={styles.modalDescription}>
              Confirm you want to delete file <strong>"{fileToDelete.file_name}"</strong>?
            </p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.btnCancel} 
                onClick={() => setFileToDelete(null)}
              >
                Back
              </button>
              <button 
                className={styles.btnDanger} 
                onClick={executeDeleteFile}
              >
                Delete Option
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAMING INPUT OVERLAY MODAL */}
      {namingModal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <i className="ri-edit-line" style={{ color: "#3b82f6" }} />
              {namingModal.title}
            </h3>
            
            <div style={{ marginTop: "16px" }}>
              <input
                type="text"
                className={styles.searchInput}
                style={{ width: "100%", boxSizing: "border-box", padding: "10px", fontSize: "14px" }}
                value={namingModal.value}
                onChange={(e) => setNamingModal(prev => ({ ...prev, value: e.target.value }))}
                placeholder={namingModal.type === "folder_create" ? "Enter folder name..." : "Enter file name..."}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    executeNamingAction();
                  }
                }}
              />
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.btnCancel} 
                onClick={() => setNamingModal({ isOpen: false, type: "", title: "", value: "", target: null })}
              >
                Cancel
              </button>
              <button 
                className={styles.btnDanger} 
                style={{ backgroundColor: "#3b82f6" }}
                onClick={executeNamingAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;
