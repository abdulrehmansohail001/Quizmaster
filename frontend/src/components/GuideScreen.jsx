import { useState } from "react";
import { styles } from "../styles";

const GUIDE_ITEMS = [
  {
    key: "xp",
    icon: "⭐",
    label: "XP & Leaderboard",
    desc: "Every game you play feeds into one unified XP pool. Each game type rewards XP differently based on its own difficulty and mechanics — but it all counts toward your total. The leaderboard ranks players purely by accumulated XP across all games, so no single game is your only path to the top.",
  },
  {
    key: "flags",
    icon: "🚩",
    label: "Flag Quizzes Rules",
    desc: "Progress through flag levels one at a time — each level unlocks only after you've conquered the one before it. Score 8 out of 10 or higher to advance. Clear a level with a qualifying score and you'll earn a fixed XP reward set by that level's difficulty, awarded once per level to keep the leaderboard fair.",
  },
  {
    key: "antiabuse",
    icon: "🛡️",
    label: "Anti-XP-Abuse",
    desc: "XP is earned, not farmed. Daily Find and Flag Reveal refresh every 24 hours with a new target — once claimed, that reward is locked until the next reset. Quizzes only pay out XP once per level, and the Map Game only rewards XP again if you beat your personal best. Replaying for the same result won't add to your total.",
  },
  {
    key: "resets",
    icon: "🔄",
    label: "Daily Resets",
    desc: "Daily Find and Flag Reveal are timed challenges — a new country and a new flag drop every 24 hours. Complete the day's challenge to claim your reward, then check back after the reset for a fresh target and another shot at XP.",
  },
];

function GuideScreen({ onBack }) {
  const [activeKey, setActiveKey] = useState(GUIDE_ITEMS[0].key);

  const active = GUIDE_ITEMS.find((item) => item.key === activeKey);

  return (
    <div style={styles.appShell}>
      <div style={styles.glassCard}>
        <button
          className="games-back-hover"
          style={styles.gamesBackBtn}
          onClick={onBack}
        >
          ⬅ Back
        </button>

        <div style={styles.dashboardIconBadge}>📖</div>
        <h1 style={styles.dashboardTitleLg}>Guide</h1>
        <p style={styles.dashboardSubtitle}>Everything you need to know</p>

        <div style={styles.guideRow}>
          {GUIDE_ITEMS.map((item) => (
            <div
              key={item.key}
              className="guide-option-hover"
              style={{
                ...styles.guideOption,
                ...(activeKey === item.key ? styles.guideOptionActive : {}),
              }}
              onMouseEnter={() => setActiveKey(item.key)}
              onClick={() => setActiveKey(item.key)}
            >
              <div style={styles.guideIconCircle}>{item.icon}</div>
              {item.label}
            </div>
          ))}
        </div>

        <div style={styles.guideDescBox}>{active.desc}</div>
      </div>
    </div>
  );
}

export default GuideScreen;