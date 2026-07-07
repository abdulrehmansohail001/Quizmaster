import { useEffect, useState, useRef } from "react";
import api from "../api";
import { styles } from "../styles";

function QuizGame({ userId, level, onFinish, onFetchError, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  useEffect(() => {
    api
      .get(`/quiz/${level}/${userId}`)
      .then((res) => {
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error("Error fetching quiz:", err);
        onFetchError(
          err.response?.data?.error || "Failed to load quiz. Please try again."
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (questions.length === 0 || finished) return;

    setTimeLeft(10);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleNext();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, questions, finished]);

  const submitScore = (finalScore) => {
    api
      .post("/score", {
        userId,
        level,
        score: finalScore,
        total: questions.length,
      })
      .then((res) => {
        onFinish(res.data.unlockedLevels, res.data.totalXP);
      });
  };

  const handleAnswer = (option) => {
    const current = questions[index];
    const isCorrect = option === current.answer;
    const newScore = isCorrect ? score + 1 : score;

    setScore(newScore);

    const next = index + 1;
    if (next < questions.length) {
      setIndex(next);
    } else {
      setFinished(true);
      submitScore(newScore);
    }
  };

  const handleNext = () => {
    clearInterval(timerRef.current);

    const next = index + 1;
    if (next < questions.length) {
      setIndex(next);
    } else {
      setFinished(true);
      submitScore(score);
    }
  };

  if (questions.length === 0) {
    return (
      <div style={styles.appShell}>
        <div style={{ ...styles.glassCard, maxWidth: "420px" }}>
          <p style={styles.quizLoadingText}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={styles.appShell}>
        <div style={{ ...styles.glassCard, maxWidth: "420px" }}>
          <div style={styles.quizFinishedEmoji}>🎉</div>
          <h1 style={styles.dashboardTitleLg}>Quiz Finished</h1>
          <div style={styles.quizFinishedScore}>
            {score} / {questions.length}
          </div>

          <button
            className="auth-btn-hover"
            style={styles.authPrimaryBtn}
            onClick={onBack}
          >
            Back to Levels
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div style={styles.appShell}>
      <div style={{ ...styles.glassCard, maxWidth: "480px" }}>
        <button
          className="games-back-hover"
          style={styles.gamesBackBtn}
          onClick={onBack}
        >
          ⬅ Back
        </button>

        <div style={styles.dashboardIconBadge}>🌍</div>
        <h1 style={styles.dashboardTitleLg}>Flag Quiz</h1>

        <div style={styles.quizHeaderRow}>
          <div style={styles.quizLevelBadge}>{level?.toUpperCase()}</div>
          <div
            style={{
              ...styles.timerCircle,
              ...(timeLeft <= 3 ? styles.timerCircleWarn : {}),
            }}
          >
            {timeLeft}
          </div>
          <div style={styles.quizScoreBadge}>Score: {score}</div>
        </div>

        <div style={styles.quizFlagCard}>
          <img src={q.flag} alt="flag" style={styles.quizFlagImg} />

          <div style={styles.quizOptions}>
            {q.options.map((opt) => (
              <button
                key={opt}
                className="quiz-option-hover"
                onClick={() => handleAnswer(opt)}
                style={styles.quizOptionBtn}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <p style={styles.quizProgressText}>
          Question {index + 1} / {questions.length}
        </p>
      </div>
    </div>
  );
}

export default QuizGame;