import { createPortal } from 'react-dom';

type PricingPageProps = {
    onClose: () => void;
};

export default function PricingPage({ onClose }: PricingPageProps) {
    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(10, 10, 10, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '32px',
                    maxWidth: '900px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        fontSize: '24px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    ×
                </button>

                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>
                    料金プラン
                </h1>

                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '48px' }}>
                    YouTubeコメント分析をもっと便利に。
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* Free */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '24px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Free</h2>
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: `#0f172a` }}>¥0</span>
                            <span style={{ color: '#64748b' }}> /月</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', lineHeight: '2', color: `#1e293b` }}>
                            <li>✅ 最大20件取得</li>
                            <li>✅ 質問抽出機能</li>
                        </ul>
                        <button
                            style={{
                                width: '100%',
                                backgroundColor: '#334155',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                alert("無料プランで利用を開始します");
                                onClose(); // モーダルを閉じる
                            }}
                        >
                            無料で始める
                        </button>
                    </div>

                    {/* Pro */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '24px', border: '2px solid #3b82f6', position: 'relative' }}>
                        <div
                            style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                padding: '4px 16px',
                                borderRadius: '9999px',
                                fontSize: '14px',
                            }}
                        >
                            おすすめ
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Pro</h2>
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb' }}>¥980</span>
                            <span style={{ color: '#64748b' }}> /月</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', lineHeight: '2', color: `#1e293b` }}>
                            <li>✅ 無制限解析</li>
                            <li>✅ 最大1000件取得</li>
                            <li>✅ AI質問分類</li>
                            <li>✅ CSVダウンロード</li>
                            <li>✅ 優先サポート</li>
                            <li>※ 今だけ特別価格!!</li>
                        </ul>
                        <button
                            style={{
                                width: '100%',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                padding: '12px',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                            onClick={async () => {
                                // localStorage から user_id を取得
                                const userIdStr = localStorage.getItem("user_id");
                                if (!userIdStr) {
                                    alert("ログインしてください");
                                    return;
                                }
                                const userId = parseInt(userIdStr);

                                try {
                                    const response = await fetch("http://localhost:8000/create-checkout-session", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            user_id: userId,
                                            days: 30,
                                        }),
                                    });

                                    const data = await response.json();

                                    if (data.url) {
                                        // Stripeの決済画面に遷移
                                        window.location.href = data.url;
                                    } else {
                                        alert("エラーが発生しました: " + (data.error || "不明なエラー"));
                                    }
                                } catch (error) {
                                    console.error(error);
                                    alert("通信エラーが発生しました");
                                }
                            }}
                        >
                            Proを始める
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
