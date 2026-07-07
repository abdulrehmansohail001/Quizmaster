import { useEffect } from "react";
import api from "../api";
import { styles } from "../styles";

const allLevels = ["easy", "medium", "hard", "extreme", "impossible"];

const LEVEL_COLORS = {
  easy: "#22c55e",
  medium: "#eab308",
  hard: "#f97316",
  extreme: "#ef4444",
  impossible: "#7c3aed",
};

function LevelsScreen({
  userId,
  unlockedLevels,
  setUnlockedLevels,
  fetchError,
  onSelectLevel,
  onBack,
}) {
  useEffect(() => {
    api
      .get(`/user/${userId}`)
      .then((res) => {
        const unlocked = res.data.unlockedLevels || ["easy"];
        if (!unlocked.includes("easy")) {
          unlocked.unshift("easy");
        }
        setUnlockedLevels(unlocked);
      })
      .catch((err) => {
        console.error("Failed to refresh user data:", err);
      });
  }, [userId]);

  return (
    <div style={styles.appShell}>
      <div style={{ ...styles.glassCard, maxWidth: "540px" }}>
        <button
          className="games-back-hover"
          style={styles.gamesBackBtn}
          onClick={onBack}
        >
          ⬅ Back
        </button>

        <div style={styles.dashboardIconBadge}>🎮</div>
        <h1 style={styles.dashboardTitleLg}>Select Level</h1>
        <p style={styles.dashboardSubtitle}>Clear each level to unlock the next</p>

        {fetchError && <div style={styles.authErrorBox}>{fetchError}</div>}

        <div style={styles.levelsListWrap}>
          {allLevels.map((level) => {
            const isUnlocked = level === "easy" || unlockedLevels.includes(level);
            return (
              <div
                key={level}
                className={isUnlocked ? "level-row-hover" : ""}
                style={{
                  ...styles.levelRow,
                  ...(isUnlocked ? {} : styles.levelRowLocked),
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                }}
                onClick={() => {
                  if (isUnlocked) onSelectLevel(level);
                }}
              >
                <div
                  style={{
                    ...styles.levelDot,
                    background: isUnlocked ? LEVEL_COLORS[level] : "#d1d5db",
                  }}
                />

                <div
                  style={{
                    ...styles.levelNameNew,
                    ...(isUnlocked ? {} : styles.levelNameLocked),
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </div>

                {!isUnlocked && <div style={styles.lockIconNew}>🔒</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LevelsScreen;