// src/components/DailyFindGame.jsx
import { useEffect, useState } from "react";
import api from "../api";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { dfStyles } from "../dailyFindStyles";
import { styles } from "../styles";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COUNTRY_CENTROIDS = {
  "Afghanistan": [33.93, 67.71], "Albania": [41.15, 20.17], "Algeria": [28.03, 1.66],
  "Andorra": [42.55, 1.60], "Angola": [-11.20, 17.87], "Argentina": [-38.42, -63.62],
  "Armenia": [40.07, 45.04], "Australia": [-25.27, 133.78], "Austria": [47.52, 14.55],
  "Azerbaijan": [40.14, 47.58], "Bahrain": [26.00, 50.55], "Bangladesh": [23.68, 90.36],
  "Belarus": [53.71, 27.95], "Belgium": [50.50, 4.47], "Belize": [17.19, -88.49],
  "Benin": [9.31, 2.32], "Bhutan": [27.51, 90.43], "Bolivia": [-16.29, -63.59],
  "Bosnia and Herzegovina": [43.92, 17.68], "Botswana": [-22.33, 24.68],
  "Brazil": [-14.24, -51.93], "Brunei": [4.94, 114.95], "Bulgaria": [42.73, 25.49],
  "Burkina Faso": [12.36, -1.56], "Burundi": [-3.37, 29.92], "Cambodia": [12.57, 104.99],
  "Cameroon": [3.85, 11.50], "Canada": [56.13, -106.35], "Central African Republic": [6.61, 20.94],
  "Chad": [15.45, 18.73], "Chile": [-35.68, -71.54], "China": [35.86, 104.20],
  "Colombia": [4.57, -74.30], "Comoros": [-11.88, 43.87], "Congo": [-0.23, 15.83],
  "Democratic Republic of the Congo": [-4.04, 21.76], "Costa Rica": [9.75, -83.75],
  "Ivory Coast": [7.54, -5.55], "Croatia": [45.10, 15.20], "Cuba": [21.52, -77.78],
  "Cyprus": [35.13, 33.43], "Czech Republic": [49.82, 15.47], "Denmark": [56.26, 9.50],
  "Djibouti": [11.83, 42.59], "Dominican Republic": [18.74, -70.16],
  "Ecuador": [-1.83, -78.18], "Egypt": [26.82, 30.80], "El Salvador": [13.79, -88.90],
  "Equatorial Guinea": [1.65, 10.27], "Eritrea": [15.18, 39.78], "Estonia": [58.60, 25.01],
  "Eswatini": [-26.52, 31.47], "Ethiopia": [9.15, 40.49], "Fiji": [-16.58, 179.41],
  "Finland": [61.92, 25.75], "France": [46.23, 2.21], "Gabon": [-0.80, 11.61],
  "Gambia": [13.44, -15.31], "Georgia": [42.32, 43.36], "Germany": [51.17, 10.45],
  "Ghana": [7.95, -1.02], "Greece": [39.07, 21.82], "Guatemala": [15.78, -90.23],
  "Guinea": [11.75, -13.70], "Guinea-Bissau": [11.80, -15.18], "Guyana": [4.86, -58.93],
  "Haiti": [18.97, -72.29], "Honduras": [15.20, -86.24], "Hungary": [47.16, 19.50],
  "Iceland": [64.96, -19.02], "India": [20.59, 78.96], "Indonesia": [-0.79, 113.92],
  "Iran": [32.43, 53.69], "Iraq": [33.22, 43.68], "Ireland": [53.41, -8.24],
  "Israel": [31.05, 34.85], "Italy": [41.87, 12.57], "Jamaica": [18.11, -77.30],
  "Japan": [36.20, 138.25], "Jordan": [30.59, 36.24], "Kazakhstan": [48.02, 66.92],
  "Kenya": [-0.02, 37.91], "Kuwait": [29.31, 47.48], "Kyrgyzstan": [41.20, 74.77],
  "Laos": [19.86, 102.50], "Latvia": [56.88, 24.60], "Lebanon": [33.85, 35.86],
  "Lesotho": [-29.61, 28.23], "Liberia": [6.43, -9.43], "Libya": [26.34, 17.23],
  "Liechtenstein": [47.14, 9.55], "Lithuania": [55.17, 23.88], "Luxembourg": [49.82, 6.13],
  "Madagascar": [-18.77, 46.87], "Malawi": [-13.25, 34.30], "Malaysia": [4.21, 108.96],
  "Maldives": [3.20, 73.22], "Mali": [17.57, -4.00], "Malta": [35.94, 14.38],
  "Mauritania": [21.01, -10.94], "Mauritius": [-20.35, 57.55], "Mexico": [23.63, -102.55],
  "Moldova": [47.41, 28.37], "Monaco": [43.73, 7.40], "Mongolia": [46.86, 103.85],
  "Montenegro": [42.71, 19.37], "Morocco": [31.79, -7.09], "Mozambique": [-18.67, 35.53],
  "Myanmar": [21.92, 95.96], "Namibia": [-22.96, 18.49], "Nepal": [28.39, 84.12],
  "Netherlands": [52.13, 5.29], "New Zealand": [-40.90, 174.89], "Nicaragua": [12.87, -85.21],
  "Niger": [17.61, 8.08], "Nigeria": [9.08, 8.68], "North Korea": [40.34, 127.51],
  "North Macedonia": [41.61, 21.75], "Norway": [60.47, 8.47], "Oman": [21.51, 55.92],
  "Pakistan": [30.38, 69.35], "Palestine": [31.95, 35.23], "Panama": [8.54, -80.78],
  "Papua New Guinea": [-6.31, 143.96], "Paraguay": [-23.44, -58.44],
  "Peru": [-9.19, -75.02], "Philippines": [12.88, 121.77], "Poland": [51.92, 19.15],
  "Portugal": [39.40, -8.22], "Qatar": [25.35, 51.18], "Romania": [45.94, 24.97],
  "Russia": [61.52, 105.32], "Rwanda": [-1.94, 29.87], "Saudi Arabia": [23.89, 45.08],
  "Senegal": [14.50, -14.45], "Serbia": [44.02, 21.01], "Seychelles": [-4.68, 55.49],
  "Sierra Leone": [8.46, -11.78], "Singapore": [1.35, 103.82], "Slovakia": [48.67, 19.70],
  "Slovenia": [46.15, 14.99], "Somalia": [5.15, 46.20], "South Africa": [-30.56, 22.94],
  "South Korea": [35.91, 127.77], "South Sudan": [6.88, 31.31], "Spain": [40.46, -3.75],
  "Sri Lanka": [7.87, 80.77], "Sudan": [12.86, 30.22], "Suriname": [3.92, -56.03],
  "Sweden": [60.13, 18.64], "Switzerland": [46.82, 8.23], "Syria": [34.80, 38.99],
  "Taiwan": [23.70, 120.96], "Tajikistan": [38.86, 71.28], "Tanzania": [-6.37, 34.89],
  "Thailand": [15.87, 100.99], "Timor-Leste": [-8.87, 125.73], "Togo": [8.62, 0.82],
  "Tunisia": [33.89, 9.54], "Turkey": [38.96, 35.24], "Turkmenistan": [40.55, 58.00],
  "Uganda": [1.37, 32.29], "Ukraine": [48.38, 31.17], "United Arab Emirates": [23.42, 53.85],
  "United Kingdom": [55.38, -3.44], "United States of America": [37.09, -95.71],
  "Uruguay": [-32.52, -55.77], "Uzbekistan": [41.38, 64.59], "Venezuela": [6.42, -66.59],
  "Vietnam": [14.06, 108.28], "Yemen": [15.55, 48.52], "Zambia": [-13.13, 27.85],
  "Zimbabwe": [-19.02, 29.15]
};

const ALL_COUNTRIES = Object.keys(COUNTRY_CENTROIDS);

function getDailyCountry() {
  const today = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash * 31 + today.charCodeAt(i)) % ALL_COUNTRIES.length;
  }
  return ALL_COUNTRIES[hash];
}

function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTemperature(km) {
  if (km < 300) return { label: "🔥 BURNING!", color: "#c0392b", bar: 100 };
  if (km < 700) return { label: "🌶️ Very Hot", color: "#e74c3c", bar: 88 };
  if (km < 1200) return { label: "♨️ Hot", color: "#e67e22", bar: 75 };
  if (km < 2000) return { label: "🌤️ Warm", color: "#f1c40f", bar: 58 };
  if (km < 3500) return { label: "🌬️ Cool", color: "#3498db", bar: 38 };
  if (km < 5000) return { label: "❄️ Cold", color: "#2980b9", bar: 20 };
  return { label: "🧊 Freezing!", color: "#1a5276", bar: 5 };
}

export default function DailyFindGame({ userId, onBack }) {
  const targetCountry = getDailyCountry();
  const targetCoords = COUNTRY_CENTROIDS[targetCountry];

  const [lastClick, setLastClick] = useState(null);
  const [found, setFound] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [highlightGeo, setHighlightGeo] = useState(null);

  useEffect(() => {
    api.get(`/dailyfind/stats/${userId}`).then((res) => {
      const today = new Date().toISOString().slice(0, 10);
      setTotalXP(res.data.totalAccumulatedXP || 0);
      if (res.data.lastCompletedDate === today) {
        setAlreadyClaimed(true);
        setClaimed(true);
      }
    }).catch(() => {});
  }, [userId]);

  const handleMapClick = (geo) => {
    if (found) return;
    const clickedName = geo.properties.name;
    const centroid = COUNTRY_CENTROIDS[clickedName];
    if (!centroid) return;

    const km = haversineKm(centroid, targetCoords);
    setHighlightGeo(clickedName);
    setLastClick({ name: clickedName, km });
    setAttempts((a) => a + 1);

    if (clickedName === targetCountry) {
      setFound(true);
    }
  };

  const handleClaim = async () => {
    try {
      const res = await api.post("/dailyfind/claim", { userId });
      const newXP = res.data.totalXP ?? totalXP;
      setTotalXP(newXP);
      setClaimed(true);
      setAlreadyClaimed(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setClaimed(true);
        setAlreadyClaimed(true);
      }
    }
  };

  const temp = lastClick ? getTemperature(lastClick.km) : null;

  return (
    <div style={styles.appShell}>
      <div style={{ ...styles.glassCard, maxWidth: "900px", textAlign: "left" }}>
        <div style={dfStyles.wrapper}>
          <div style={dfStyles.header}>
            <button
              className="games-back-hover"
              style={dfStyles.backBtn}
              onClick={onBack}
            >
              ⬅ Back
            </button>
            <h2 style={dfStyles.title}>🌡️ Daily Find: Hot or Cold</h2>
            <div style={dfStyles.badge}>🗓️ {new Date().toISOString().slice(0, 10)}</div>
            <div style={dfStyles.badge}>⭐ {totalXP} XP</div>
          </div>

          <div style={dfStyles.clue}>
            🎯 Find today's hidden country! Click on the map to get <b>Hot/Cold</b> hints.
            {alreadyClaimed && !found && (
              <span style={{ color: "#15803d", marginLeft: "8px", fontWeight: "700" }}>
                ✅ Already claimed today's XP!
              </span>
            )}
          </div>

          <div style={dfStyles.sequenceRow}>
            <div style={dfStyles.stepCard}>
              <div style={dfStyles.stepNumber}>1</div>
              <div>Click a country</div>
            </div>
            <div style={dfStyles.stepCard}>
              <div style={dfStyles.stepNumber}>2</div>
              <div>Get hot/cold hints</div>
            </div>
            <div style={dfStyles.stepCard}>
              <div style={dfStyles.stepNumber}>3</div>
              <div>Find the target</div>
            </div>
          </div>

          {lastClick && !found && (
            <div style={dfStyles.thermometerWrap}>
              <div style={{ ...dfStyles.tempLabel, color: temp.color }}>{temp.label}</div>
              <div style={dfStyles.thermometerTrack}>
                <div style={{ ...dfStyles.thermometerBar, width: `${temp.bar}%`, background: temp.color }} />
              </div>
              <div style={dfStyles.distText}>
                You clicked <b>{lastClick.name}</b> — {Math.round(lastClick.km).toLocaleString()} km from target
              </div>
            </div>
          )}

          {attempts > 0 && !found && (
            <div style={dfStyles.attemptsText}>Attempts: {attempts}</div>
          )}

          {found && (
            <div style={dfStyles.successBox}>
              <div style={{ fontSize: "32px" }}>🎉</div>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#15803d" }}>
                You found it! The answer was <b>{targetCountry}</b>
              </div>
              <div style={{ marginTop: "6px", color: "#374151" }}>
                Found in {attempts} attempt{attempts !== 1 ? "s" : ""}
              </div>
              {!claimed ? (
                <button
                  className="dailyfind-claim-btn-hover"
                  onClick={handleClaim}
                  style={{
                    marginTop: "14px",
                    padding: "12px 28px",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "white",
                    border: "none",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "15px",
                    boxShadow: "0 12px 28px rgba(22,163,74,0.3)",
                  }}
                >
                  Claim +5 XP
                </button>
              ) : (
                <div style={{ marginTop: "10px", color: "#15803d", fontWeight: "700" }}>
                  ✅ XP Claimed! Total: {totalXP} XP
                </div>
              )}
            </div>
          )}

          <div style={dfStyles.mapContainer}>
            <ComposableMap projectionConfig={{ scale: 147 }} style={{ width: "100%", height: "auto" }}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name;
                    const isTarget = found && name === targetCountry;
                    const isClicked = name === highlightGeo && !found;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleMapClick(geo)}
                        style={{
                          default: {
                            fill: isTarget ? "#4CAF50" : isClicked ? "#f5a623" : "#CBD5E0",
                            stroke: "#fff",
                            strokeWidth: 0.4,
                            outline: "none",
                          },
                          hover: {
                            fill: isTarget ? "#388E3C" : "#A0AEC0",
                            stroke: "#fff",
                            strokeWidth: 0.4,
                            outline: "none",
                            cursor: "pointer",
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
        </div>
      </div>
    </div>
  );
}