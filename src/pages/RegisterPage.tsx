import { createPortal } from 'react-dom';
import { useState } from 'react';

type RegisterPageProps = {
  onClose: () => void;
  onRegisterSuccess?: () => void;
};

export default function RegisterPage({ onClose, onRegisterSuccess }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || null }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('登録完了しました。ログインしてください。');
        onRegisterSuccess?.();
        onClose();
      } else {
        alert(data.error || '登録に失敗しました');
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
          新規登録
        </h2>

        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="名前（任意）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '16px',
            }}
          />
        </div>

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
          onClick={handleRegister}
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
          {loading ? '登録中...' : '登録する'}
        </button>
      </div>
    </div>,
    document.body
  );
}