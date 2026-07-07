import { useEffect, useState } from "react";
import "./App.css";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import LevelsScreen from "./components/LevelsScreen";
import QuizGame from "./components/QuizGame";
import LeaderboardScreen from "./components/LeaderboardScreen";
import MapGame from "./components/MapGame";
import DailyFindGame from "./components/DailyFindGame";
import FlagRevealGame from "./components/FlagRevealGame";
import GamesScreen from "./components/GamesScreen";
import GuideScreen from "./components/GuideScreen";

function App() {
  // ---------------- AUTH / SESSION ----------------
  const [userId, setUserId] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState(["easy"]);
  const [totalXP, setTotalXP] = useState(0);

  // ---------------- NAVIGATION ----------------
  const [screen, setScreen] = useState("auth");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [fetchError, setFetchError] = useState("");

  // Kept as-is intentionally: this is currently how "logout" behaves on refresh.
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleLoginSuccess = ({ userId, unlockedLevels, totalXP }) => {
    setUserId(userId);
    setUnlockedLevels(unlockedLevels);
    setTotalXP(totalXP);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.clear();
    setScreen("auth");
    setUnlockedLevels(["easy"]);
    setTotalXP(0);
    setSelectedLevel(null);
    setFetchError("");
  };

  const handleQuizFinish = (newUnlockedLevels, newTotalXP) => {
    setUnlockedLevels(newUnlockedLevels || unlockedLevels);
    setTotalXP(newTotalXP ?? totalXP);
  };

  const backToLevels = () => {
    setSelectedLevel(null);
    setFetchError("");
    setScreen("levels");
  };

  // Not logged in -> always show auth screen
  if (!userId) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  switch (screen) {
    case "levels":
      return (
        <LevelsScreen
          userId={userId}
          unlockedLevels={unlockedLevels}
          setUnlockedLevels={setUnlockedLevels}
          fetchError={fetchError}
          onSelectLevel={(level) => {
            setSelectedLevel(level);
            setFetchError("");
            setScreen("quiz");
          }}
          onBack={() => setScreen("dashboard")}
        />
      );

    case "quiz":
      return (
        <QuizGame
          userId={userId}
          level={selectedLevel}
          onFinish={handleQuizFinish}
          onFetchError={(msg) => {
            setFetchError(msg);
            backToLevels();
          }}
          onBack={backToLevels}
        />
      );

    case "games":
      return (
        <GamesScreen
          onSelectGame={(key) => setScreen(key)}
          onBack={() => setScreen("dashboard")}
        />
      );
      case "guide":
      return <GuideScreen onBack={() => setScreen("dashboard")} />;
      
    case "leaderboard":
      return <LeaderboardScreen onBack={() => setScreen("dashboard")} />;

    case "map":
      return <MapGame userId={userId} onBack={() => setScreen("dashboard")} />;

    case "dailyfind":
      return <DailyFindGame userId={userId} onBack={() => setScreen("dashboard")} />;

    case "flagreveal":
      return <FlagRevealGame userId={userId} onBack={() => setScreen("dashboard")} />;

    case "dashboard":
    default:
      return <Dashboard onNavigate={setScreen} onLogout={handleLogout} userId={userId} />;
  }
}

export default App;
