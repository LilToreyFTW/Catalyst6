import Link from "next/link";
import { listMemoryRecords } from "../../lib/memory-store";
import styles from "../page.module.css";

export default async function MemoryPage() {
  const records = await listMemoryRecords();

  return (
    <main className={styles.main}>
      <section className={styles.card}>
        <div className={styles.panelBody}>
          <div className={styles.memoryHeader}>
            <div>
              <div className={styles.eyebrow}>Catalyst6 Demon Memory Vault</div>
              <h1 className={styles.title}>
                <span className={styles.gradient}>Memory Archive</span>
              </h1>
            </div>
            <Link className={`${styles.button} ${styles.secondary} ${styles.navLink}`} href="/">
              Return To Brain
            </Link>
          </div>

          <p className={styles.lead}>
            This is the persistent view of what Catalyst6 Demon has saved. In production, point
            `VPS_MEMORY_API_URL` at your VPS so Vercel reads and writes cloud memory through your server.
          </p>

          <div className={styles.viewerPreview}>
            <strong>Total Records</strong>
            <p className={styles.statusText}>{records.length.toLocaleString()} saved genomes are currently visible.</p>
          </div>

          <div className={styles.memoryList} style={{ marginTop: 16 }}>
            {records.length === 0 ? (
              <div className={styles.memoryItem}>
                <strong>No memory saved yet</strong>
                <p className={styles.statusText}>
                  Start the learning loop on the main page to create the first record.
                </p>
              </div>
            ) : (
              records.map((record) => (
                <article className={styles.memoryItem} key={record.id}>
                  <div className={styles.memoryMeta}>
                    <strong>Genome #{record.genomeNumber.toLocaleString()}</strong>
                    <span className={styles.metaText}>{new Date(record.createdAt).toLocaleString()}</span>
                    <span className={styles.metaText}>{record.source}</span>
                    <a
                      className={styles.sourceLink}
                      href={record.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open Google Source
                    </a>
                  </div>
                  <p className={styles.sourceTitle}>{record.sourceTitle}</p>
                  <p className={styles.sourceSnippet}>{record.sourceSnippet}</p>
                  <p className={styles.sequenceBox} style={{ marginTop: 12 }}>
                    {record.segments.join(" | ")}
                    {"\n"}
                    Learning delta: {record.learningDelta}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
