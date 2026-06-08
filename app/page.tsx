"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { MemoryRecord } from "../lib/types";

const baseSet = ["A", "T", "C", "G", "N", "X"];

type TabKey = "overview" | "double" | "quad";

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

function HelixVisualizer({
  evolved,
  title,
  subtitle
}: {
  evolved: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={`${styles.card} ${styles.helixPanel}`}>
      <div className={styles.panelHeader}>
        <div>
          <strong>{title}</strong>
          <p className={styles.metaText}>{subtitle}</p>
        </div>
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
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [evolved, setEvolved] = useState(false);
  const [dnaBuilds, setDnaBuilds] = useState(0);
  const [sequenceText, setSequenceText] = useState("Memory ready. No saved DNA found yet. Start learning to create the first sequence.");
  const [autosaveStatus, setAutosaveStatus] = useState("Memory vault is checking for saved DNA...");
  const [isRunning, setIsRunning] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordCountRef = useRef(0);

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
      recordCountRef.current = records.length;

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
    setRecordCount((count) => {
      const nextCount = count + 1;
      recordCountRef.current = nextCount;
      return nextCount;
    });
    setAutosaveStatus(
      `Autosaved genome #${record.genomeNumber.toLocaleString()} to persistent memory. ${(
        recordCountRef.current + 1
      ).toLocaleString()} total records tracked.`
    );
  }

  function startDoubleHelix() {
    if (loopRef.current) {
      clearInterval(loopRef.current);
    }

    setActiveTab("double");
    setIsRunning(true);
    setEvolved(false);

    let nextGenomeNumber = dnaBuilds;

    void emitDNA(nextGenomeNumber + 1, false);
    nextGenomeNumber += 1;

    loopRef.current = setInterval(() => {
      nextGenomeNumber += 1;
      void emitDNA(nextGenomeNumber, false);
    }, 1600);
  }

  function startQuadHelix() {
    if (loopRef.current) {
      clearInterval(loopRef.current);
    }

    setActiveTab("quad");
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
          <div className={styles.eyebrow}>Catalyst6 Demon Control Surface</div>
          <h1 className={styles.title}>
            <span className={styles.gradient}>Catalyst6 Demon</span>
          </h1>
          <p className={styles.lead}>
            A Google-first intelligence brain with separate operational views for stable collection,
            active learning, and evolved reasoning. Use the tabs to move between the overview, the
            double-helix collector, and the quadruple-helix evolved engine.
          </p>

          <div className={styles.tabBar}>
            <button
              className={`${styles.tabButton} ${activeTab === "overview" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("overview")}
              type="button"
            >
              Overview
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "double" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("double")}
              type="button"
            >
              Double Helix
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === "quad" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("quad")}
              type="button"
            >
              Quadruple Helix
            </button>
          </div>

          <div className={styles.ctaRow}>
            <button className={`${styles.button} ${styles.primary}`} onClick={startDoubleHelix} type="button">
              Run Double Helix
            </button>
            <button className={`${styles.button} ${styles.secondary}`} onClick={startQuadHelix} type="button">
              Run Quadruple Helix
            </button>
            <Link className={`${styles.button} ${styles.secondary} ${styles.navLink}`} href="/memory">
              Open Memory Vault
            </Link>
          </div>

          <div className={styles.status}>
            <strong>Current state</strong>
            <p className={styles.statusText}>
              {isRunning
                ? `Catalyst6 Demon is actively collecting and autosaving in ${evolved ? "quadruple" : "double"} helix mode.`
                : "Catalyst6 Demon is idle and ready to start either helix mode."}
            </p>
          </div>
        </article>

        <aside className={`${styles.card} ${styles.brainShell}`}>
          <div className={styles.brainHeader}>
            <span>Neural Genome Visualizer</span>
            <span className={styles.live}>{evolved ? "QUADRUPLE HELIX MODE" : "DOUBLE HELIX MODE"}</span>
          </div>

          {activeTab === "overview" ? (
            <div className={styles.overviewStack}>
              <HelixVisualizer
                evolved={false}
                title="Double Helix Collector"
                subtitle="Stable collection mode for intake, ranking, and first-pass pattern capture."
              />
              <HelixVisualizer
                evolved={true}
                title="Quadruple Helix Engine"
                subtitle="Evolved mode for accelerated adaptation, memory reinforcement, and autonomous sequencing."
              />
            </div>
          ) : activeTab === "double" ? (
            <HelixVisualizer
              evolved={false}
              title="Double Helix Working Tab"
              subtitle="This tab represents the collection state while Catalyst6 Demon is gathering information."
            />
          ) : (
            <HelixVisualizer
              evolved={true}
              title="Quadruple Helix Working Tab"
              subtitle="This tab represents the evolved state after learning pressure pushes the brain into higher-density reasoning."
            />
          )}

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
                <span className={styles.metricLabel}>Active Tab</span>
                <span className={styles.metricValue}>
                  {activeTab === "overview" ? "Overview" : activeTab === "double" ? "Double" : "Quadruple"}
                </span>
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
        </aside>
      </section>

      <section className={styles.sectionGrid}>
        <article className={`${styles.card} ${styles.panelBody}`}>
          <h2 className={styles.heading}>Operational Tabs</h2>
          <div className={styles.specGrid}>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Overview</span>
              <p>Shows both helix states together so you can compare the collection state against the evolved state.</p>
            </div>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Double Helix</span>
              <p>Dedicated tab for the active intake system while the demon is working and getting information.</p>
            </div>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Quadruple Helix</span>
              <p>Dedicated tab for the expanded post-learning state with more aggressive autonomous reasoning.</p>
            </div>
            <div className={styles.spec}>
              <span className={styles.specLabel}>Memory Vault</span>
              <p>Separate route for reviewing the saved DNA records, timestamps, and persistent sequence history.</p>
            </div>
          </div>
        </article>

        <article className={`${styles.card} ${styles.panelBody}`}>
          <h2 className={styles.heading}>Collection Focus</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>Double helix mode stays focused on intake, organization, and stable persistence.</li>
            <li className={styles.listItem}>Quadruple helix mode stays focused on evolved patterning and denser reasoning loops.</li>
            <li className={styles.listItem}>Both tabs write into the same persistent memory system through the VPS-backed API.</li>
            <li className={styles.listItem}>The `/memory` route remains the long-term record of what the demon has collected.</li>
          </ul>
        </article>
      </section>

      <p className={styles.footerNote}>
        Catalyst6 Demon now has distinct operational tabs for overview, collection-state double helix, and evolved-state quadruple helix.
      </p>
    </main>
  );
}
