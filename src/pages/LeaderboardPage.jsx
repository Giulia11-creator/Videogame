import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // usa il tuo export
import { useNavigate } from "react-router-dom";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Legge dai documenti di TravelLevel, ordina per campo numerico "points" (disc), prende 20
    const q = query(
      collection(db, "Leaderboard"),
      orderBy("totalPoints", "desc"),
      limit(20)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data();
          const points =
            typeof data.totalPoints === "number"
              ? data.totalPoints
              : Number.parseInt(data.totalPoints, 10) || 0;

        return {
            id: d.id,
            name: data.nick, // mostra qualcosa di utile
            points,
            lastUpdate: data.lastUpdate?.toDate?.() ?? null,
          };
        });
        setPlayers(rows);
        setLoading(false);
      },
      (e) => {
        console.error(e);
        setErr("Errore nel caricamento classifica");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Caricamento classifica…</div>;
  if (err) return <div style={{ padding: 24, color: "crimson" }}>{err}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 16 }}>Classifica – Top 20</h1>

      <div style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr 120px 200px",
          padding: "12px 16px",
          background: "#9c3aed",
          fontWeight: 600
        }}>
          <div>#</div>
          <div>Giocatore</div>
          <div>Punti</div>
        </div>

        {players.map((p, i) => (
          <div key={p.name} style={{
            display: "grid",
            gridTemplateColumns: "64px 1fr 120px 200px",
            padding: "12px 16px",
            borderTop: "1px solid #f1f5f9",
            alignItems: "center"
          }}>
            <div style={{ fontWeight: 600 }}>{i + 1}</div>
            <div>{p.name}</div>
            <div style={{ fontVariantNumeric: "tabular-nums" }}>{p.points}</div>
          </div>
        ))}
      </div>

     <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
        <button
          onClick={() => navigate("/game")}
          style={{
            background: "#9c3aed", // viola
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}
        >
          Torna al gioco
        </button>
      </div>
    </div>
  );
}
