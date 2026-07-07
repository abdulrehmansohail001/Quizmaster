import { useEffect, useState, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import api from "../api";
import { mapStyles } from "../mapStyles";
import { styles } from "../styles";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Democratic Republic of the Congo", "Costa Rica", "Ivory Coast", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
];

function MapGame({ userId, onBack }) {
  const [guessed, setGuessed] = useState([]);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [bestXP, setBestXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    api
      .get(`/map/best/${userId}`)
      .then((res) => {
        setBestScore(res.data.bestScore || 0);
        setBestXP(res.data.bestXP || 0);
      })
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (submitted) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const normalize = (str) =>
    str.trim().toLowerCase().replace(/[-''.]/g, "").replace(/\s+/g, " ");

  const handleGuess = () => {
    const val = input.trim();
    if (!val) return;

    const match = ALL_COUNTRIES.find((c) => normalize(c) === normalize(val));

    if (!match) {
      setFeedback(`❌ "${val}" not found`);
      setInput("");
      return;
    }

    if (guessed.includes(match)) {
      setFeedback(`⚠️ Already guessed ${match}`);
      setInput("");
      return;
    }

    const newGuessed = [...guessed, match];
    setGuessed(newGuessed);
    setFeedback(`✅ ${match}`);
    setInput("");
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    const xpEarned =
      guessed.length === 197 ? 50 : parseFloat((guessed.length * 0.25).toFixed(2));
    try {
      const res = await api.post("/map/submit", {
        userId,
        score: guessed.length,
        xpOverride: xpEarned,
      });
      setBestXP(res.data.currentBestXP);
      setBestScore(
        res.data.currentBestXP * 4 > bestScore ? guessed.length : bestScore
      );
    } catch {}
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleRestart = () => {
    setGuessed([]);
    setInput("");
    setFeedback("");
    setSubmitted(false);
    setTimeLeft(15 * 60);
  };

  return (
    <div style={styles.appShell}>
      <div style={{ ...styles.glassCard, maxWidth: "900px", textAlign: "left" }}>
        <div style={mapStyles.wrapper}>
          <div style={mapStyles.header}>
            <button
              className="games-back-hover"
              style={mapStyles.backBtn}
              onClick={onBack}
            >
              ⬅ Back
            </button>
            <h2 style={mapStyles.title}>🗺️ World Map Game</h2>
            <div style={mapStyles.bestBadge}>
              Best: {bestScore}/197 &nbsp;|&nbsp; {bestXP.toFixed(2)} XP
            </div>
            <div
              style={{
                ...mapStyles.bestBadge,
                background: timeLeft <= 60 ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white",
                minWidth: "90px",
                textAlign: "center",
              }}
            >
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          <div style={mapStyles.statsRow}>
            <div style={mapStyles.statBox}>
              <span style={mapStyles.statNum}>{guessed.length}</span>
              <span style={mapStyles.statLabel}>Guessed</span>
            </div>
            <div style={mapStyles.statBox}>
              <span style={mapStyles.statNum}>{197 - guessed.length}</span>
              <span style={mapStyles.statLabel}>Remaining</span>
            </div>
            <div style={mapStyles.statBox}>
              <span style={mapStyles.statNum}>{(guessed.length * 0.25).toFixed(2)}</span>
              <span style={mapStyles.statLabel}>XP This Round</span>
            </div>
          </div>

          {!submitted ? (
            <div style={mapStyles.inputRow}>
              <input
                style={mapStyles.input}
                placeholder="Type a country name..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                autoFocus
              />
              <button
                className="map-guess-btn-hover"
                style={mapStyles.guessBtn}
                onClick={handleGuess}
              >
                Guess
              </button>
              <button
                className="map-guess-btn-hover"
                style={mapStyles.submitBtn}
                onClick={handleSubmit}
              >
                Submit Score
              </button>
            </div>
          ) : (
            <div style={mapStyles.doneRow}>
              <span style={mapStyles.doneText}>
                Score submitted! {guessed.length}/197 — XP:{" "}
                {guessed.length === 197 ? "50.00" : (guessed.length * 0.25).toFixed(2)}
              </span>
              <button
                className="map-guess-btn-hover"
                style={mapStyles.restartBtn}
                onClick={handleRestart}
              >
                Play Again
              </button>
            </div>
          )}

          {feedback && <div style={mapStyles.feedback}>{feedback}</div>}

          <div style={mapStyles.mapContainer}>
            <ComposableMap
              projectionConfig={{ scale: 147 }}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name;
                    const isGuessed = guessed.includes(name);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: {
                            fill: isGuessed ? "#4CAF50" : "#CBD5E0",
                            stroke: "#fff",
                            strokeWidth: 0.4,
                            outline: "none",
                          },
                          hover: {
                            fill: isGuessed ? "#388E3C" : "#A0AEC0",
                            stroke: "#fff",
                            strokeWidth: 0.4,
                            outline: "none",
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          <div style={mapStyles.guessedList}>
            <strong>Guessed Countries ({guessed.length}):</strong>
            <div style={mapStyles.tagRow}>
              {guessed.map((c) => (
                <span key={c} className="map-tag-hover" style={mapStyles.tag}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapGame;