import React, { useState } from "react";
import styles from "./HelpAndSupport.module.css";

const HelpAndSupport = () => {
  const [openFaq, setOpenFaq] = useState(4); // Defaulting last one open as per image

  const faqs = [
    {
      id: 0,
      q: "How to apply for a certificate?",
      a: "Follow the application steps in the dashboard.",
    },
    {
      id: 1,
      q: "Why is my application rejected?",
      a: "Check the remarks provided by the processing authority.",
    },
    {
      id: 2,
      q: "How long does approval take?",
      a: "Typically 3-5 working days depending on the department.",
    },
    {
      id: 3,
      q: "How to upload documents?",
      a: "Ensure files are in PDF format and under 2MB.",
    },
    {
      id: 4,
      q: "I forgot my password, what should I do?",
      a: "If you forgot your password, click here to reset it using your registered email address.",
    },
  ];

  return (
    <div className={styles.helpContainer}>
      <h1 className={styles.title}>Help & Support</h1>

      {/* FAQ Section */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <i className="ri-question-answer-line"></i>
          <span>FAQ</span>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <div
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              >
                <span>{faq.q}</span>
                <i
                  className={
                    openFaq === faq.id ? "ri-subtract-line" : "ri-add-line"
                  }
                ></i>
              </div>
              {openFaq === faq.id && (
                <div className={styles.faqAnswer}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomGrid}>
        {/* Report a Problem */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span>
              <h4>Report a Problem</h4>
            </span>
          </div>

          <textarea
            className={styles.textArea}
            placeholder="Describe the problem"
          ></textarea>
          <div className={styles.uploadSection}>
            <i className="ri-attachment-line"></i>
            <span>Attach Screenshot</span>
            <button className={styles.uploadBtn}>
              <i className="ri-upload-cloud-2-line"></i> Upload Screenshot
            </button>
          </div>
          <button className={styles.submitBtn}>Submit</button>
        </div>

        {/* Language & Region */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <span>
              <h4>Language & Region</h4>
            </span>
          </div>
          <div className={styles.settingRow}>
            <label>Language</label>
            <select className={styles.smallInput}>
              <option>English (US)</option>
            </select>
          </div>
          <div className={styles.settingRow}>
            <label>Region</label>
            <select className={styles.smallInput}>
              <option>India</option>
            </select>
          </div>

          <button className={styles.submitBtn}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
