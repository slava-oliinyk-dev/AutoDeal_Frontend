import styles from "./LegalDocument.module.scss";

type LegalSection = {
  title: string;
  content: readonly string[];
};

type LegalDocumentProps = {
  title: string;
  sections: readonly LegalSection[];
};

const LegalDocument = ({ title, sections }: LegalDocumentProps) => {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.content}>
          {sections.map((section) => (
            <article key={section.title} className={styles.section}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegalDocument;
