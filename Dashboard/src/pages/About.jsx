import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutHeader}>
        <h2 className={styles.aboutTitle}>About</h2>

        <img
          src="/images/About.png"
          alt="About img"
          className={styles.aboutImage}
        />
      </div>

      <div className={styles.aboutContent}>
        <p>
          The E-Office platform is a digital solution designed to streamline
          communication and administrative processes for students of the
          National Institute of Technology Silchar. It enables students to
          submit applications to various administrative departments through an
          efficient online system.
        </p>

        <p>
          By replacing traditional paper-based procedures with a transparent
          digital workflow, the platform allows students to track the real-time
          status of their applications, identify the current processing
          authority, and monitor the progress of their files at every stage.
        </p>

        <p>
          E-Office aims to improve efficiency, transparency, and accountability
          within the administrative framework. Students can easily submit
          requests, follow the movement of their files across departments, and
          receive timely updates without the need for repeated visits to
          administrative offices.
        </p>

        <p>
          The system promotes a paperless environment by digitizing the entire
          application process. This reduces delays, prevents the loss of
          documents, and ensures that all applications are properly recorded and
          tracked within the system.
        </p>

        <p>
          With real-time tracking and a transparent workflow, students gain
          better visibility into how their applications are processed. This
          improves accountability within departments and helps identify
          bottlenecks in administrative procedures.
        </p>

        <p>
          By integrating modern technology with institutional processes,
          E-Office supports the institute’s vision of digital governance. The
          platform ultimately creates a faster, more organized, and more
          convenient administrative experience for both students and staff.
        </p>
        <p>This section demonstrated the implementation of the account management interface, highlighting its structure, usability, and integration within the overall E-Office system.</p>
      </div>
      <div className={styles.aboutFooter}>
        <span className={styles.footerMain}>
          Improving Efficiency, Transparency & Accountability
        </span>

        <span className={styles.footerSub}>
          A Step towards Digital Governance for NIT Silchar
        </span>
      </div>
    </div>
  );
};

export default About;
