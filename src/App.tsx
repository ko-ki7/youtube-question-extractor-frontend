import { useState } from "react";


function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [comments, setComments] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("question"); // 初期値は質問


  function extractVideoId(url: string): string | null {
    // 通常のURL
    const normal = url.match(/v=([^&]+)/);
    if (normal) return normal[1];

    // 短縮URL
    const short = url.match(/youtu\.be\/([^?]+)/);
    if (short) return short[1];

    return null;

  }

  const handleFetch = async () => {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      alert("URLが正しくありません");
      return;
    }

    setLoading(true); // ← ローディング開始

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoId,
          mode: mode, // ← UIで選んだ抽出モード
        }),
      });

      const data = await res.json();

      setComments(data.comments);
      setCount(data.count);
    } finally {
      setLoading(false); // ← ローディング終了
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "sans-serif",
    }}>
      <h1>YouTube質問摘出ツール</h1>

      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <input
          type="text"
          placeholder="YouTube動画URLを入力"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={{ flex: 1,
                   padding: "8px",
                   borderRadius: "6px"
          }}
        />

        <button onClick={handleFetch}
          style={{
            background: "#3b82f6",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginLeft: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          抽出する
        </button>
      </div>

      {loading && <p>抽出中です…</p>}

      <select
      className="mode-select"
      value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="question">質問</option>
        <option value="surprise">驚き</option>
        <option value="positive">肯定</option>
        <option value="negative">否定</option>
        <option value="all">すべて</option>
      </select>


      <h1>質問コメント一覧 ({count}件)</h1>
      <p>※無料版では先頭から20件まで表示されます</p> 
      <button
        className="download-button"
        onClick={() => {
          const videoId = extractVideoId(videoUrl);
          if (!videoId) {
            alert("URLが正しくありません");
            return;
          }
          window.location.href = `http://localhost:8000/download_csv?video_id=${videoId}`;
        }}
      >
        CSVダウンロード
      </button>

      <div style={{
        maxHeight: "400px",
        overflowY: "scroll",
        paddingRight: "10px",
        marginTop: "20px"
      }}>
        <ul>
          {comments.slice().map((c, i) => (
            <li key={i} style={{
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              listStyle: "none"
            }}>
              {c}
            </li>
          ))}
        </ul>
      </div>

    </div>

  );
}

export default App;
