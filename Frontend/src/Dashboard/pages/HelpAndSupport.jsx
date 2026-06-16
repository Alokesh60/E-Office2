import React, { useState } from "react";
import styles from "./HelpAndSupport.module.css";

const HelpAndSupport = () => {
  const [openFaq, setOpenFaq] = useState(4);

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
      a: "Click the 'Forgot Password' option on the login page and follow the instructions sent to your registered email address.",
    },
  ];

  return (
    <div className={styles.helpContainer}>
      <div className={styles.headerRow}>
      <h2 className={styles.title}>Help & Support</h2>
 <img
          src="/images/Help.png"
          alt="About img"
          className={styles.helpIllustration}
        />
</div>
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
                onClick={() =>
                  setOpenFaq(openFaq === faq.id ? null : faq.id)
                }
              >
                <span>{faq.q}</span>

                <i
                  className={`${styles.icon} ${
                    openFaq === faq.id
                      ? "ri-subtract-line"
                      : "ri-add-line"
                  }`}
                ></i>
              </div>

              <div
                className={`${styles.faqAnswer} ${
                  openFaq === faq.id ? styles.open : ""
                }`}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;