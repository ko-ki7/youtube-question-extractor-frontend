import { useState, useEffect } from "react";
import PricingPage from "./pages/PricingPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [comments, setComments] = useState<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("question"); // 初期値は質問
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Pro状態を確認する関数
  const checkProStatus = async () => {
    const userIdStr = localStorage.getItem("user_id");
    if (!userIdStr) {
      setIsPro(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/is-pro/${userIdStr}`);
      const data = await res.json();
      setIsPro(data.is_pro);
    } catch {
      setIsPro(false);
    }
  };

  // コンポーネント読み込み時に実行
  useEffect(() => {
    // Pro状態を確認
    checkProStatus();

    // 決済成功・キャンセルの処理
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const userId = params.get("user_id");

    if (success === "true" && userId) {
      fetch(`https://youtube-question-extractor-backend-production.up.railway.app/payment-success?user_id=${userId}`)
        .then(res => res.json())
        .then(() => {
          alert("Proプランの支払いが完了しました!");
          window.history.replaceState({}, document.title, window.location.pathname);
          checkProStatus(); // Pro状態を再確認
        })
        .catch(err => {
          console.error(err);
          alert("決済は完了しましたが、プランの反映に失敗しました");
        });
    }

    if (params.get("canceled") === "true") {
      alert("決済がキャンセルされました");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
      {/* ヘッダー */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h1 style={{ margin: 0 }}>YouTube質問摘出ツール</h1>

        <div>
          {localStorage.getItem("user_id") ? (
            // ログイン済みの場合
            <button
              onClick={() => {
                localStorage.removeItem("user_id");
                setIsPro(false);
                alert("ログアウトしました");
                window.location.reload();
              }}
              style={{
                background: "#64748b",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginLeft: "8px",
              }}
            >
              ログアウト
            </button>
          ) : (
            // 未ログインの場合
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  background: "#334155",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                ログイン
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                style={{
                  background: "#2563eb",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginLeft: "8px",
                }}
              >
                新規登録
              </button>
            </>
          )}
        </div>

      </div>

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
          style={{
            flex: 1,
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
        {/* <option value="surprise">驚き</option> */}
        {/* <option value="positive">肯定</option> */}
        {/* <option value="negative">否定</option> */}
        {/* <option value="all">すべて</option> */}
      </select>


      <h1>質問コメント一覧 ({count}件)</h1>
      <p>{isPro
        ? "Proプラン：最大1000件まで表示"
        : "※無料版では先頭から20件まで表示されます"}
      </p>
      <button
        className="download-button"
        onClick={async () => {
          const userIdStr = localStorage.getItem("user_id");
          if (!userIdStr) {
            alert("ログインしてください");
            setShowLoginModal(true);
            return;
          }

          const userId = parseInt(userIdStr);

          // Proかどうかを確認
          try {
            const res = await fetch(`https://youtube-question-extractor-backend-production.up.railway.app/is-pro/${userId}`);
            const data = await res.json();

            if (data.is_pro) {
              // Proユーザー → ダウンロード実行
              const videoId = extractVideoId(videoUrl);
              if (!videoId) {
                alert("URLが正しくありません");
                return;
              }
              window.location.href = `https://youtube-question-extractor-backend-production.up.railway.app/download_csv?video_id=${videoId}`;
            } else {
              // 無料ユーザー → 料金プランを表示
              setShowPricingModal(true);
            }
          } catch (error) {
            console.error(error);
            alert("エラーが発生しました");
          }
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
          {comments.slice(0, isPro ? 1000 : 20).map((c, i) => (
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
      {showPricingModal && <PricingPage
        onClose={() => setShowPricingModal(false)}
      />}
      {/* ログインモーダルを追加 */}
      {showLoginModal && (
        <LoginPage onClose={() => setShowLoginModal(false)} />
      )}

      {showRegisterModal && (
        <RegisterPage onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}

export default App;
