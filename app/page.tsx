"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { MemoryRecord } from "../lib/types";

const baseSet = ["A", "T", "C", "G", "N", "X"];

type TabKey = "overview" | "double" | "quad";

const liveTopics = [
  "public figures interviews",
  "YouTube creator trends",
  "Facebook community discussions",
  "emerging technology news",
  "government disclosures",
  "music releases",
  "sports headlines",
  "startup founders",
  "internet culture trends",
  "breaking world events"
];

function createSequence(length: number) {
  let sequence = "";

  for (let index = 0; index < length; index += 1) {
    sequence += baseSet[Math.floor(Math.random() * baseSet.length)];
  }

  return sequence;
}

function createGoogleSourceUrl(genomeNumber: number, evolved: boolean) {
  const topic = liveTopics[genomeNumber % liveTopics.length];
  const query = evolved
    ? `${topic} advanced analysis`
    : `${topic} latest updates`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function createLearningDelta(genomeNumber: number, evolved: boolean) {
  const topic = liveTopics[genomeNumber % liveTopics.length];
  return evolved
    ? `${topic}, pattern extraction, cross-platform clustering, accelerated reasoning`
    : `${topic}, discovery intake, ranking adaptation, source reinforcement`;
}

function createRecord(genomeNumber: number, evolved: boolean): MemoryRecord {
  return {
    id: crypto.randomUUID(),
    genomeNumber,
    segments: [createSequence(24), createSequence(24), createSequence(24), createSequence(24)],
    learningDelta: createLearningDelta(genomeNumber, evolved),
    evolved,
    source: "Google search intelligence",
    sourceTitle: "Pending Google result",
    sourceSnippet: "Catalyst6 Demon is fetching a real world result from Google search intelligence.",
    sourceUrl: createGoogleSourceUrl(genomeNumber, evolved),
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
  const rungCount = 24;
  const width = 420;
  const height = 420;
  const center = width / 2;
  const amplitude = 68;
  const secondaryAmplitude = 102;
  const topPadding = 24;
  const step = (height - topPadding * 2) / (rungCount - 1);

  function buildHelixData(offset: number, amp: number) {
    const left: string[] = [];
    const right: string[] = [];
    const rungs: Array<{
      y: number;
      leftX: number;
      rightX: number;
      depth: number;
      angle: number;
    }> = [];

    for (let index = 0; index < rungCount; index += 1) {
      const y = topPadding + index * step;
      const t = index / (rungCount - 1);
      const phase = t * Math.PI * 4 + offset;
      const spread = Math.sin(phase) * amp;
      const depth = (Math.cos(phase) + 1) / 2;
      const taper = 0.84 + Math.sin(t * Math.PI) * 0.16;
      const leftX = center - spread * taper;
      const rightX = center + spread * taper;

      left.push(`${index === 0 ? "M" : "L"} ${leftX.toFixed(2)} ${y.toFixed(2)}`);
      right.push(`${index === 0 ? "M" : "L"} ${rightX.toFixed(2)} ${y.toFixed(2)}`);
      rungs.push({
        y,
        leftX,
        rightX,
        depth,
        angle: Math.sin(phase) * 18
      });
    }

    return {
      leftPath: left.join(" "),
      rightPath: right.join(" "),
      rungs
    };
  }

  const primary = buildHelixData(0, amplitude);
  const secondary = buildHelixData(Math.PI / 2, secondaryAmplitude);

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
        <div className={styles.helixCore}>
          <svg className={styles.helixSvg} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
            <defs>
              <linearGradient id="helixBlueCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#66dfff" />
                <stop offset="48%" stopColor="#dffcff" />
                <stop offset="100%" stopColor="#43b8f5" />
              </linearGradient>
              <linearGradient id="helixBlueCoreSoft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38a7dd" />
                <stop offset="50%" stopColor="#dffcff" />
                <stop offset="100%" stopColor="#7ee9ff" />
              </linearGradient>
              <linearGradient id="helixGreenCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#41d58f" />
                <stop offset="52%" stopColor="#effff7" />
                <stop offset="100%" stopColor="#1fae71" />
              </linearGradient>
              <linearGradient id="helixGoldCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d8a63a" />
                <stop offset="52%" stopColor="#fff4cc" />
                <stop offset="100%" stopColor="#ffdc74" />
              </linearGradient>
            </defs>

            <path
              d={primary.leftPath}
              className={`${styles.helixPath} ${styles.pathBlue}`}
            />
            <path
              d={primary.rightPath}
              className={`${styles.helixPath} ${styles.pathBlueSoft}`}
            />
            {primary.rungs.map((rung, index) => (
              <g className={styles.rung} key={`primary-${index}`} style={{ animationDelay: `${index * -0.12}s` }}>
                <line
                  x1={rung.leftX}
                  y1={rung.y}
                  x2={rung.rightX}
                  y2={rung.y}
                  className={styles.rungLine}
                  style={{
                    opacity: 0.2 + rung.depth * 0.8,
                    transform: `rotate(${rung.angle}deg)`,
                    transformOrigin: `${center}px ${rung.y}px`
                  }}
                />
                <circle cx={rung.leftX} cy={rung.y} r={2.5 + rung.depth * 2.8} className={styles.rungNodeBlue} />
                <circle cx={rung.rightX} cy={rung.y} r={2.5 + rung.depth * 2.8} className={styles.rungNodeBlue} />
              </g>
            ))}

            {evolved && (
              <>
                <path
                  d={secondary.leftPath}
                  className={`${styles.helixPath} ${styles.pathGreen}`}
                />
                <path
                  d={secondary.rightPath}
                  className={`${styles.helixPath} ${styles.pathGold}`}
                />
                {secondary.rungs.map((rung, index) => (
                  <g className={styles.rungSecondary} key={`secondary-${index}`} style={{ animationDelay: `${index * -0.14}s` }}>
                    <line
                      x1={rung.leftX}
                      y1={rung.y}
                      x2={rung.rightX}
                      y2={rung.y}
                      className={styles.rungLineSecondary}
                      style={{
                        opacity: 0.18 + rung.depth * 0.75,
                        transform: `rotate(${rung.angle * -1}deg)`,
                        transformOrigin: `${center}px ${rung.y}px`
                      }}
                    />
                  </g>
                ))}
              </>
            )}
          </svg>
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
