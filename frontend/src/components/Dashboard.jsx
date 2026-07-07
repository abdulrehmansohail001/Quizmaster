import { useEffect, useState } from "react";
import api from "../api";
import { styles } from "../styles";

function Dashboard({ onNavigate, onLogout, userId, username = "" }) {
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    api.get("/leaderboard").then((res) => {
      const me = res.data.find((entry) => entry._id === userId);
      if (me) setTotalXP(me.totalXP);
    }).catch(() => {});
  }, [userId]);

  return (
    <div style={styles.appShell}>
      <div style={styles.glassCard}>
        <div style={styles.brandLogo}>QuizMaster</div>
        <div style={styles.xpBadgeTop}>⭐ {totalXP} XP</div>

        <div style={styles.dashboardIconBadge}>📊</div>
        <h1 style={styles.dashboardTitleLg}>Dashboard</h1>
        <p style={styles.dashboardSubtitle}>
          Welcome back, <span style={styles.subtitleHighlight}>{username}</span>. Ready to sharpen your skills today?
        </p>

        <div style={styles.dashCardGrid}>
          <div
            className="dash-card-hover"
            style={styles.dashCard}
            onClick={() => onNavigate("games")}
          >
            <div style={{ ...styles.cardIconBadge, ...styles.badgePurple }}>🎮</div>
            <div style={styles.dashCardTitle}>Games</div>
            <div style={styles.dashCardSubtitle}>4 Games Available</div>
          </div>

          <div
            className="dash-card-hover"
            style={styles.dashCard}
            onClick={() => onNavigate("leaderboard")}
          >
            <div style={{ ...styles.cardIconBadge, ...styles.badgeGreen }}>🏆</div>
            <div style={styles.dashCardTitle}>Leaderboard</div>
            <div style={styles.dashCardSubtitle}>See Global Ranks</div>
          </div>

          <div
            className="dash-card-hover"
            style={styles.dashCard}
            onClick={() => onNavigate("guide")}
          >
            <div style={{ ...styles.cardIconBadge, ...styles.badgeAmber }}>📖</div>
            <div style={styles.dashCardTitle}>Guide</div>
            <div style={styles.dashCardSubtitle}>Master the Rules</div>
          </div>
        </div>

        <button
          className="logout-btn-hover"
          style={styles.pillLogoutBtn}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;