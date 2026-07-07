import { useEffect, useState } from "react";
import api from "../api";
import { styles } from "../styles";

function getRankStyle(index) {
  if (index === 0) return styles.rankGold;
  if (index === 1) return styles.rankSilver;
  if (index === 2) return styles.rankBronze;
  return styles.rankDefault;
}

function LeaderboardScreen({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    api.get("/leaderboard").then((res) => setLeaderboard(res.data));
  }, []);

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

        <div style={styles.dashboardIconBadge}>🏆</div>
        <h1 style={styles.dashboardTitleLg}>Leaderboard</h1>
        <p style={styles.dashboardSubtitle}>Top players ranked by total XP</p>

        {leaderboard.length === 0 ? (
          <p style={styles.leaderboardEmptyText}>No data yet</p>
        ) : (
          <div style={styles.leaderboardList}>
            {leaderboard.map((l, i) => (
              <div
                key={l._id || i}
                className="leaderboard-row-hover"
                style={styles.leaderboardRow}
              >
                <div style={{ ...styles.rankBadge, ...getRankStyle(i) }}>
                  {i + 1}
                </div>

                <div style={styles.leaderboardEmailCol}>{l.email}</div>

                <div style={styles.leaderboardXpCol}>✨ {l.totalXP} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardScreen;