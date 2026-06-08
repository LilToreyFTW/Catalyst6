"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { MemoryRecord } from "../lib/types";

const baseSet = ["A", "T", "C", "G", "N", "X"];

function createSequence(length: number) {
  let sequence = "";

  for (let index = 0; index < length; index += 1) {
    sequence += baseSet[Math.floor(Math.random() * baseSet.length)];
  }

  return sequence;
}

function createRecord(genomeNumber: number, evolved: boolean): MemoryRecord {
  return {
    id: crypto.randomUUID(),
    genomeNumber,
    segments: [createSequence(24), createSequence(24), createSequence(24), createSequence(24)],
    learningDelta: "search memory, ranking adaptation, transformer reinforcement.",
    evolved,
    source: "Google search intelligence",
    mediaTypes: ["image", "video", "mp4", "mp3"],
    createdAt: new Date().toISOString()
  };
}

export default function HomePage() {
  const [evolved, setEvolved] = useState(false);
  const [dnaBuilds, setDnaBuilds] = useState(0);
  const [sequenceText, setSequenceText] = useState("Memory ready. No saved DNA found yet. Start learning to create the first sequence.");
  const [autosaveStatus, setAutosaveStatus] = useState("Memory vault is checking for saved DNA...");
  const [isRunning, setIsRunning] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function loadMemory() {
      const response = await fetch("/api/memory", { cache: "no-store" });
      if (!response.ok) {
        setAutosaveStatus("Memory route is online, but the VPS memory backend is not reachable yet.");
        return;
      }
      const payload = await response.json();
      const records = Array.isArray(payload.records) ? payload.records : [];
      setRecordCount(records.length);

      if (!records.length) {
        setAutosaveStatus("Memory ready. No saved DNA found yet. Start learning to create the first sequence.");
        return;
      }

      const latest = records[0] as MemoryRecord;
      setDnaBuilds(latest.genomeNumber);
      setEvolved(Boolean(latest.evolved));
      setSequenceText(
        `Genome ${latest.genomeNumber} :: ${latest.segments.join(" | ")}\nLearning delta: ${latest.learningDelta}`
      );
      setAutosaveStatus(
        `Recovered genome #${latest.genomeNumber.toLocaleString()} from persistent memory. ${records.length.toLocaleString()} total DNA records visible.`
      );
    }

    void loadMemory();

    return () => {
      if (loopRef.current) {
        clearInterval(loopRef.current);
      }
    };
  }, []);

  async function emitDNA(nextGenomeNumber: number, nextEvolved: boolean) {
    const record = createRecord(nextGenomeNumber, nextEvolved);

    setSequenceText(
      `Genome ${record.genomeNumber} :: ${record.segments.join(" | ")}\nLearning delta: ${record.learningDelta}`
    );

    const response = await fetch("/api/memory", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(record)
    });

    if (!response.ok) {
      setAutosaveStatus("Persistent save failed. Check VPS API key, VPS URL, firewall rules, or server process.");
      return;
    }

    setDnaBuilds(record.genomeNumber);
    setRecordCount((count) => count + 1);
    setAutosaveStatus(
      `Autosaved genome #${record.genomeNumber.toLocaleString()} to persistent memory. ${(
        recordCount + 1
      ).toLocaleString()} total records tracked.`
    );
  }

  function startLearningLoop() {
    if (loopRef.current) {
      clearInterval(loopRef.current);
    }

    setIsRunning(true);
    setEvolved(true);

    let nextGenomeNumber = dnaBuilds;

    void emitDNA(nextGenomeNumber + 1, true);
    nextGenomeNumber += 1;

    loopRef.current = setInterval(() => {
      nextGenomeNumber += 1;
      void emitDNA(nextGenomeNumber, true);
    }, 1200);
  }

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <article className={`${styles.card} ${styles.copy}`}>
          <div className={styles.eyebrow}>Catalyst6 Demon Core Sequence</div>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Catalyst6 Demon</span>
          </h1>
          <p className={styles.lead}>
            This concept frames Catalyst6 Demon as a search-intelligence brain focused on Google-centered
            discovery, ranking analysis, pattern memory, and self-improving knowledge paths. It is designed to
            pull pictures, videos, MP4s, and MP3s from Google search intelligence and Google-surfaced public media.
          </p>
          <div className={styles.ctaRow}>
            <button className={`${styles.button} ${styles.primary}`} onClick={startLearningLoop} type="button">
              {isRunning ? "Learning In Progress" : "Trigger Learning Evolution"}
            </button>
            <Link className={`${styles.button} ${styles.secondary} ${styles.navLink}`} href="/memory">
              Open Memory Vault
            </Link>
          </div>
          <div className={styles.status}>
            <strong>Important product boundary</strong>
            <p className={styles.statusText}>
              A Google-focused assistant is safest when built around search workflows, research synthesis,
              ranking interpretation, and user-guided automation. Public-access ingestion should respect each
              source site&apos;s published access rules, robots controls, and media rights.
            </p>
          </div>
        </article>

        <aside className={`${styles.card} ${styles.brainShell}`}>
          <div className={styles.brainHeader}>
            <span>Neural Genome Visualizer</span>
            <span className={styles.live}>{evolved ? "QUADRUPLE HELIX MODE" : "DOUBLE HELIX MODE"}</span>
          </div>

          <div className={`${styles.helixWrap} ${evolved ? styles.evolved : ""}`}>
            <div className={`${styles.strand} ${styles.s1}`} />
            <div className={`${styles.strand} ${styles.s2}`} />
            <div className={`${styles.strand} ${styles.s3}`} />
            <div className={`${styles.strand} ${styles.s4}`} />
            <div className={styles.basePairs}>
              {Array.from({ length: 9 }).map((_, index) => (
                <div className={styles.pair} key={index} />
              ))}
            </div>
          </div>

          <div className={styles.signalPanel}>
            <div className={styles.signal}>
              <strong>Strand I</strong>
              <span>Query intake, language parsing, intent capture.</span>
            </div>
            <div className={styles.signal}>
              <strong>Strand II</strong>
              <span>Google source ranking, SERP interpretation, media intake, memory binding.</span>
            </div>
            <div className={styles.signal}>
              <strong>Strand III</strong>
              <span>Unlocked after learning: self-refinement, media classification, and strategy adaptation.</span>
            </div>
          </div>

          <div className={styles.dnaStream}>
            <strong className={styles.streamTitle}>Persistent DNA Stream</strong>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Mutation Rhythm</span>
                <span className={styles.metricValue}>1.2s persistent cycle</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>DNA Builds</span>
                <span className={styles.metricValue}>{dnaBuilds.toLocaleString()}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Visible Records</span>
                <span className={styles.metricValue}>{recordCount.toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.sequenceBox}>{sequenceText}</div>
            <div className={styles.autosaveStatus}>{autosaveStatus}</div>
          </div>

          <div className={styles.viewerPreview}>
            <strong>Backend Route</strong>
            <p className={styles.statusText}>
              Vercel frontend and API can proxy persistent saves to your VPS when `VPS_MEMORY_API_URL` is set.
            </p>
          </div>
        </aside>
      </section>

      <section className={styles.sectionGrid}>
        <article className={`${styles.card} ${styles.panelBody}`}>
          <h2 className={styles.heading}>Catalyst6 Demon Architecture</h2>
          <p className={styles.statusText}>
            Catalyst6 Demon can be treated as four layered systems that gradually become visible as the product matures.
          </p>
          <div className={styles.specGrid}>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Genome A</span>
              <p>Google-first ingestion for query understanding, trend capture, topic clustering, and public media discovery.</p>
            </div>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Genome B</span>
              <p>Transformer reasoning for summarization, contrast, ranking, and intent prediction.</p>
            </div>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Genome C</span>
              <p>Learning memory for repeated discoveries, saved source media, user preferences, and pattern carry-over.</p>
            </div>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Genome D</span>
              <p>Autonomous planning that proposes what to research next while staying user-controlled.</p>
            </div>
          </div>
        </article>

        <article className={`${styles.card} ${styles.panelBody}`}>
          <h2 className={styles.heading}>What Hard Focused On Google Means</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>Build a search strategy cockpit that helps users formulate, compare, and refine Google searches.</li>
            <li className={styles.listItem}>Pull pictures, videos, MP4s, and MP3s from Google search intelligence and Google-surfaced public media.</li>
            <li className={styles.listItem}>Collect public government media surfaced through Google and published at sites such as war.gov/UFO.</li>
            <li className={styles.listItem}>Store high-value findings and connect them into a growing memory graph.</li>
            <li className={styles.listItem}>Route persistent saves through your VPS-backed memory API when you are ready to plug it in.</li>
          </ul>
        </article>
      </section>

      <p className={styles.footerNote}>
        Catalyst6 Demon now has a real memory route and a memory viewer, not just browser-only autosave text.
      </p>
    </main>
  );
}
