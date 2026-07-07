export const mapStyles = {
  wrapper: {
    padding: "0",
    fontFamily: "'Segoe UI', sans-serif",
    maxWidth: "640px",      // 👈 constrains overall screen width
    margin: "0 auto",       // 👈 centers it
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",            // was 14px
    flexWrap: "wrap",
    marginBottom: "14px",   // was 20px
  },
  title: {
    margin: 0,
    fontSize: "19px",       // was 24px
    fontWeight: "800",
    flex: 1,
    color: "#111827",
    textAlign: "left",
  },
  bestBadge: {
    background: "linear-gradient(135deg, #f9d976 0%, #f39f19 100%)",
    border: "none",
    borderRadius: "999px",
    padding: "6px 12px",    // was 8px 16px
    fontWeight: "700",
    color: "#2f1f00",
    fontSize: "11px",       // was 13px
    boxShadow: "0 8px 20px rgba(243,159,25,0.2)",
  },
  backBtn: {
    padding: "8px 14px",    // was 10px 18px
    border: "none",
    borderRadius: "999px",
    background: "rgba(17,24,39,0.06)",
    color: "#111827",
    fontWeight: "600",
    fontSize: "11px",       // was 13px
    cursor: "pointer",
  },
  statsRow: {
    display: "flex",
    gap: "8px",             // was 12px
    marginBottom: "12px",   // was 18px
    flexWrap: "wrap",
  },
  statBox: {
    flex: 1,
    minWidth: "90px",       // was 120px
    background: "#ffffff",
    borderRadius: "12px",   // was 16px
    padding: "10px",        // was 16px
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 8px 20px rgba(17,24,39,0.06)",
    border: "1px solid rgba(17,24,39,0.04)",
  },
  statNum: {
    fontSize: "19px",       // was 26px
    fontWeight: "800",
    color: "#7c3aed",
  },
  statLabel: {
    fontSize: "10px",       // was 12px
    color: "#6b7280",
    marginTop: "2px",
    fontWeight: "600",
  },
  inputRow: {
    display: "flex",
    gap: "8px",             // was 10px
    marginBottom: "10px",   // was 14px
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "9px 12px",    // was 12px 16px
    borderRadius: "12px",   // was 14px
    border: "1px solid rgba(17,24,39,0.1)",
    fontSize: "13px",       // was 15px
    minWidth: "140px",      // was 180px
    outline: "none",
  },
  guessBtn: {
    padding: "9px 18px",    // was 12px 24px
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "12px",   // was 14px
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    boxShadow: "0 10px 24px rgba(22,163,74,0.25)",
  },
  submitBtn: {
    padding: "9px 18px",    // was 12px 24px
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "white",
    border: "none",
    borderRadius: "12px",   // was 14px
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    boxShadow: "0 10px 24px rgba(124,58,237,0.3)",
  },
  doneRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",            // was 16px
    marginBottom: "10px",   // was 14px
    flexWrap: "wrap",
  },
  doneText: {
    fontWeight: "700",
    color: "#15803d",
    fontSize: "13px",       // was 15px
  },
  restartBtn: {
    padding: "9px 18px",    // was 12px 24px
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    border: "none",
    borderRadius: "12px",   // was 14px
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    boxShadow: "0 10px 24px rgba(22,163,74,0.25)",
  },
  feedback: {
    marginBottom: "8px",    // was 10px
    fontSize: "12px",       // was 14px
    color: "#374151",
    fontWeight: "600",
    minHeight: "18px",
  },
  mapContainer: {
    border: "1px solid rgba(17,24,39,0.06)",
    borderRadius: "16px",   // was 20px
    overflow: "hidden",
    background: "linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%)",
    marginBottom: "14px",   // was 20px
    boxShadow: "0 20px 50px rgba(17,24,39,0.08)",
    maxWidth: "500px",      // 👈 caps map width so it doesn't dominate
    margin: "0 auto 14px",  // centers the map
  },
  guessedList: {
    fontSize: "12px",       // was 14px
    color: "#374151",
    textAlign: "left",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",             // was 8px
    marginTop: "8px",       // was 10px
  },
  tag: {
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#15803d",
    padding: "4px 10px",    // was 5px 12px
    borderRadius: "999px",
    fontSize: "11px",       // was 12px
    fontWeight: "700",
    border: "1px solid rgba(21,128,61,0.15)",
  },
};