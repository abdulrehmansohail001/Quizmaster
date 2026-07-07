import { styles } from "../styles";

const GAMES = [
  { key: "levels", icon: "🎮", label: "Quizzes", subtitle: "Test your knowledge", badge: styles.badgePurple },
  { key: "map", icon: "🗺️", label: "Map Game", subtitle: "Guess 197 countries", badge: styles.badgeBlue },
  { key: "dailyfind", icon: "🌡️", label: "Daily Find", subtitle: "Hot or cold hunt", badge: styles.badgeTeal },
  { key: "flagreveal", icon: "🚩", label: "Flag Reveal", subtitle: "Guess the flag", badge: styles.badgeRed },
];

function GamesScreen({ onSelectGame, onBack }) {
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

        <div style={styles.dashboardIconBadge}>🕹️</div>
        <h1 style={styles.dashboardTitleLg}>Games</h1>
        <p style={styles.dashboardSubtitle}>Pick a game to start playing</p>

        <div style={styles.dashCardGrid}>
          {GAMES.map((game) => (
            <div
              key={game.key}
              className="dash-card-hover"
              style={styles.dashCard}
              onClick={() => onSelectGame(game.key)}
            >
              <div style={{ ...styles.cardIconBadge, ...game.badge }}>{game.icon}</div>
              <div style={styles.dashCardTitle}>{game.label}</div>
              <div style={styles.dashCardSubtitle}>{game.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamesScreen;