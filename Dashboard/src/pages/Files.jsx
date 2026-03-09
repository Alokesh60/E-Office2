import { useState } from "react";
import styles from "./Files.module.css";

const Files = () => {
  const [folders] = useState([
    "Documents",
    "Assignments",
    "Certificates",
    "Projects",
  ]);

  const [activeFolder, setActiveFolder] = useState("Documents");

  const files = [
    {
      name: "Resume.pdf",
      date: "Today",
      size: "350 KB",
      type: "PDF",
      modified: "3 hours ago",
    },
    {
      name: "Assignment.docx",
      date: "Today",
      size: "350 KB",
      type: "DOC",
      modified: "3 hours ago",
    },
    {
      name: "Identity_card.jpg",
      date: "Today",
      size: "148 KB",
      type: "JPG",
      modified: "4 hours ago",
    },
    {
      name: "Transcript.pdf",
      date: "Today",
      size: "250 KB",
      type: "PDF",
      modified: "3 hours ago",
    },
    {
      name: "Certificate.zip",
      date: "Today",
      size: "120 KB",
      type: "ZIP",
      modified: "5 hours ago",
    },
  ];

  return (
    <div className={styles.filesPage}>
      <div className={styles.filesLayout}>
        {/* LEFT CONTAINER */}

        <div className={styles.filesContainer}>
          {/* HEADER */}
          <div className={styles.headerRow}>
            <h2>My Files</h2>

            <div className={styles.headerActions}>
              <input
                className={styles.searchInput}
                placeholder="Search files..."
              />

              <button className={styles.uploadBtn}>Upload Files</button>
            </div>
          </div>

          {/* PATH */}
          <div className={styles.folderPath}>Folders &gt; {activeFolder}</div>

          {/* MAIN GRID */}
          <div className={styles.filesGrid}>
            {/* FOLDER PANEL */}
            <div className={styles.folderPanel}>
              <h4>Folders</h4>

              {folders.map((folder) => (
                <div
                  key={folder}
                  className={`${styles.folderItem} ${
                    activeFolder === folder ? styles.activeFolder : ""
                  }`}
                  onClick={() => setActiveFolder(folder)}
                >
                  {folder}
                </div>
              ))}

              <button className={styles.createFolder}>
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
              </div>

              {files.map((file, i) => (
                <div key={i} className={styles.fileRow}>
                  <span>{file.name}</span>
                  <span>{file.date}</span>
                  <span>{file.size}</span>
                  <span>{file.type}</span>
                  <span>{file.modified}</span>
                </div>
              ))}
            </div>
          </div>

          {/* STORAGE */}
          <div className={styles.storageCard}>
            <h4>Storage Info</h4>

            <div className={styles.storageBar}>
              <div className={styles.storageProgress}></div>
            </div>

            <p>32% of 10 GB used</p>
          </div>
        </div>

        {/* RIGHT CONTAINER */}
        <div className={styles.previewContainer}>
          <h3>File Information</h3>

          <div className={styles.previewCard}>
            <img
              src="/images/preview.png"
              alt="preview"
              className={styles.previewImage}
            />

            <h4>Resume.pdf</h4>

            <p>Today, 12:25 PM</p>
            <p>350 KB</p>

            <div className={styles.previewActions}>
              <button className={styles.downloadBtn}>Download</button>

              <button className={styles.renameBtn}>Rename</button>

              <button className={styles.deleteBtn}>Delete</button>
            </div>
          </div>

          
            <p className={styles.fileHelpText}>
              Use this panel to preview and manage your uploaded documents.
              Files stored here can be reused when submitting applications
              within the E-Office system.
            </p>
          </div>
        </div>
      </div>
    
  );
};

export default Files;
