import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const { refreshEmpresas, refreshUsuarios, refreshTipos, refreshNotificacoes } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) { setError('Preencha email e senha.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      await Promise.all([refreshEmpresas(), refreshUsuarios(), refreshTipos()])
      navigate('/planejador')
    } catch (e) {
      setError(e.message || 'Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${styles.d1}`} />
            <div className={`${styles.dot} ${styles.d2}`} />
          </div>
          <div>
            <div className={styles.title}>Planejador</div>
            <div className={styles.sub}>Gestao de tarefas e projetos</div>
          </div>
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com" autoComplete="email"
          />
        </div>
        <div className="field">
          <label>Senha</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button className={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </div>
      <div className={styles.footer}>Planejador v1.0</div>
    </div>
  )
}
