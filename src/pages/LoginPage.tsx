import { createPortal } from 'react-dom';
import { useState } from 'react';

type LoginPageProps = {
  onClose: () => void;
  onLoginSuccess?: () => void; // ログイン成功時に呼びたい処理があれば
};

export default function LoginPage({ onClose, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ログイン成功 → user_id を保存
        localStorage.setItem('user_id', data.user_id.toString());
        alert('ログイン成功');
        onLoginSuccess?.();
        onClose();
      } else {
        alert(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          width: '90%',
          maxWidth: '400px',
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

        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
          ログイン
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '16px',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '16px',
            }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </div>
    </div>,
    document.body
  );
}
