import { useEffect, useState } from "react";
import api from "../api";
import { frStyles } from "../flagRevealStyles";
import { styles } from "../styles";

const ISO_TO_NAME = {
  PK: "Pakistan", BR: "Brazil", FR: "France", CA: "Canada", JP: "Japan",
  DE: "Germany", AR: "Argentina", US: "United States", TR: "Turkey", ID: "Indonesia",
  GB: "United Kingdom", CN: "China", IN: "India", RU: "Russia", IT: "Italy",
  ES: "Spain", MX: "Mexico", AU: "Australia", KR: "South Korea", SA: "Saudi Arabia",
  ZA: "South Africa", NG: "Nigeria", EG: "Egypt", TH: "Thailand", VN: "Vietnam",
  PH: "Philippines", MY: "Malaysia", SG: "Singapore", NL: "Netherlands", BE: "Belgium",
  CH: "Switzerland", SE: "Sweden", NO: "Norway", DK: "Denmark", FI: "Finland",
  PL: "Poland", PT: "Portugal", GR: "Greece", IE: "Ireland", AT: "Austria",
  NZ: "New Zealand", CO: "Colombia", CL: "Chile", PE: "Peru", UA: "Ukraine",
  RO: "Romania", HU: "Hungary", CZ: "Czech Republic", IL: "Israel", AE: "United Arab Emirates"
};

const XP_TABLE = [15, 12, 9, 6, 3, 1];

export default function FlagRevealGame({ userId, onBack }) {
  const [countryCode, setCountryCode] = useState(null);
  const [tilesRevealed, setTilesRevealed] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [input, setInput] = useState("");
  const [gameState, setGameState] = useState("playing");
  const [claimed, setClaimed] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const MAX_WRONG = 6;
  const targetName = countryCode ? ISO_TO_NAME[countryCode] : "";
  const xpEarned = XP_TABLE[wrongGuesses.length] ?? 1;

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError("");

    const targetRequest = api.get("/flag-reveal/daily-target");
    const statsRequest = api.get(`/flag-reveal/stats/${userId}`);

    Promise.all([targetRequest, statsRequest])
      .then(([targetRes, statsRes]) => {
        setCountryCode(targetRes.data.countryCode);
        setTotalXP(statsRes.data.totalXP || 0);

        const today = new Date().toISOString().slice(0, 10);
        if (statsRes.data.lastPlayed === today) {
          setAlreadyPlayed(true);
          setGameState("won");
          setClaimed(true);
        }
      })
      .catch((err) => {
        console.error("Flag Reveal load error:", err);
        setError("Unable to load Flag Reveal. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const TILE_ORDER = [4, 0, 2, 5, 1, 3];

  const handleGuess = () => {
    const val = input.trim();
    if (!val || gameState !== "playing") return;

    const normalize = (s) => s.trim().toLowerCase().replace(/[-'.]/g, "").replace(/\s+/g, " ");

    if (normalize(val) === normalize(targetName)) {
      setGameState("won");
      setFeedback(`✅ Correct! It was ${targetName}`);
    } else {
      const newWrong = [...wrongGuesses, val];
      setWrongGuesses(newWrong);
      const newTiles = Math.min(newWrong.length, MAX_WRONG);
      setTilesRevealed(newTiles);
      setFeedback(`❌ "${val}" is wrong`);

      if (newWrong.length >= MAX_WRONG) {
        setGameState("lost");
      }
    }
    setInput("");
  };

  const handleClaim = async () => {
    try {
      const res = await api.post("/flag-reveal/claim", {
        userId,
        points: xpEarned,
      });
      setTotalXP(res.data.newTotal);
      setClaimed(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setClaimed(true);
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.appShell}>
        <div style={{ ...styles.glassCard, maxWidth: "420px" }}>
          <p style={styles.quizLoadingText}>Loading today's flag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.appShell}>
        <div style={{ ...styles.glassCard, maxWidth: "420px" }}>
          <div style={styles.authErrorBox}>{error}</div>
        </div>
      </div>
    );
  }

  if (!countryCode) {
    return (
      <div style={styles.appShell}>
        <div style={{ ...styles.glassCard, maxWidth: "420px" }}>
          <p style={styles.dashboardSubtitle}>No flag available right now.</p>
        </div>
      </div>
    );
  }

  const revealedSet = new Set(TILE_ORDER.slice(0, tilesRevealed));

  return (
    <div style={styles.appShell}>
      <div style={{ ...styles.glassCard, maxWidth: "600px", textAlign: "left" }}>
        <div style={frStyles.wrapper}>
          <div style={frStyles.header}>
            <button
              className="games-back-hover"
              style={frStyles.backBtn}
              onClick={onBack}
            >
              ⬅ Back
            </button>
            <h2 style={frStyles.title}>🚩 Daily Flag Reveal</h2>
            <div style={frStyles.badge}>🗓️ {new Date().toISOString().slice(0, 10)}</div>
            <div style={frStyles.badge}>⭐ {totalXP} XP</div>
          </div>

          <div style={frStyles.attemptsRow}>
            {Array.from({ length: MAX_WRONG }).map((_, i) => (
              <div key={i} style={frStyles.dot(i < wrongGuesses.length)} />
            ))}
          </div>

          <div style={{ position: "relative", width: "360px", margin: "0 auto 20px" }}>
            <img
              src={`https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`}
              alt="flag"
              style={{
                width: "360px",
                height: "240px",
                objectFit: "cover",
                borderRadius: "18px",
                display: "block",
                border: "1px solid rgba(17,24,39,0.08)",
                boxShadow: "0 20px 50px rgba(17,24,39,0.1)",
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(2, 1fr)",
              borderRadius: "18px",
              overflow: "hidden",
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: revealedSet.has(i) || gameState !== "playing"
                      ? "transparent"
                      : "rgba(17,24,39,1)",
                    borderRadius: "0px",
                    transition: "background 0.5s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {gameState === "won" && (
            <div style={frStyles.successBox}>
              <div style={{ fontSize: "32px" }}>🎉</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#15803d" }}>
                {alreadyPlayed && claimed
                  ? `Already completed! The flag was ${targetName}`
                  : `Correct! It was ${targetName}`}
              </div>
              {!alreadyPlayed && (
                <div style={{ marginTop: "6px", color: "#374151" }}>
                  Guessed in {wrongGuesses.length} wrong attempt{wrongGuesses.length !== 1 ? "s" : ""} — +{xpEarned} XP
                </div>
              )}
              {!claimed ? (
                <button
                  className="flag-claim-btn-hover"
                  style={frStyles.claimBtn}
                  onClick={handleClaim}
                >
                  Claim +{xpEarned} XP
                </button>
              ) : (
                <div style={{ marginTop: "10px", color: "#15803d", fontWeight: "700" }}>
                  ✅ XP Claimed! Total: {totalXP}
                </div>
              )}
            </div>
          )}

          {gameState === "lost" && (
            <div style={frStyles.failBox}>
              <div style={{ fontSize: "32px" }}>😔</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#b91c1c" }}>
                The answer was <b>{targetName}</b>
              </div>
              <div style={{ marginTop: "6px", color: "#374151" }}>Better luck tomorrow!</div>
            </div>
          )}

          {gameState === "playing" && (
            <>
              <div style={frStyles.feedbackText}>{feedback}</div>
              <div style={frStyles.inputRow}>
                <input
                  style={frStyles.input}
                  placeholder="Guess the country..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                  autoFocus
                />
                <button
                  className="flag-guess-btn-hover"
                  style={frStyles.guessBtn}
                  onClick={handleGuess}
                >
                  Guess
                </button>
              </div>

              {wrongGuesses.length > 0 && (
                <div style={frStyles.wrongGuesses}>
                  {wrongGuesses.map((w, i) => (
                    <span key={i} style={frStyles.wrongTag}>❌ {w}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}