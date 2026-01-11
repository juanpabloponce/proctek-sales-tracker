import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import emailjs from '@emailjs/browser'

// EmailJS Config
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "8-a4VEOPm7U05fd1U",
  SERVICE_ID: "service_uniumre",
  TEMPLATE_ID: "template_ol568ej",
  ADMIN_EMAIL: "juan.ponce@proctek.com"
}

// SVG Icons
const Icons = {
  target: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  phone: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  trending: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  user: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  chevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  chevronDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  chevronUp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>,
  arrowLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  userPlus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  send: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  mail: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  alert: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  team: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  meeting: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  proposal: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  checkCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
}

const ROLES = { ADMIN: 'admin', USER: 'user', VIEWER: 'viewer' }

// Components
const GlassCard = ({ children, className = '', glow = false }) => (
  <div className={`relative ${className}`}>
    {glow && <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full" style={{background: 'rgba(6,182,212,0.3)', filter: 'blur(16px)'}} />}
    <div className="relative rounded-3xl p-5" style={{background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)'}}>{children}</div>
  </div>
)

const Toast = ({ message, show, type = 'success' }) => show ? (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl flex items-center gap-2" style={{background: type === 'success' ? 'rgba(34,197,94,0.2)' : type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.2)'}`}}>
    {type === 'success' && <span className="text-green-400"><Icons.checkCircle /></span>}
    {type === 'error' && <span className="text-red-400"><Icons.alert /></span>}
    <span className={`font-medium text-sm ${type === 'success' ? 'text-green-300' : type === 'error' ? 'text-red-300' : 'text-white'}`}>{message}</span>
  </div>
) : null

// Email notification
const sendEmailNotification = async (user, log, score) => {
  try {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
    const templateParams = {
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      user_name: user.name,
      user_email: user.email,
      date: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      contactos: log.contactos || 0,
      followups: log.followups || 0,
      reuniones: log.reuniones || 0,
      propuestas: log.propuestas || 0,
      crm_updated: log.crm_updated ? 'Sí' : 'No',
      lista_manana: log.lista_manana ? 'Sí' : 'No',
      score: Math.round(score)
    }
    await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
    return { success: true }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error }
  }
}

// Login Page
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (fetchError || !data) {
        setError('Usuario no encontrado')
      } else {
        onLogin(data)
      }
    } catch (err) {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0a1628 0%, #1a1a4e 50%, #0a1628 100%)'}}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 rounded-full" style={{background: 'rgba(6,182,212,0.2)', filter: 'blur(60px)'}} />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full" style={{background: 'rgba(139,92,246,0.1)', filter: 'blur(60px)'}} />
      
      <GlassCard className="w-full max-w-sm" glow>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}>
            <Icons.target />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">PROCTEK</h1>
          <p className="text-white/60 text-sm">Sales Daily Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="flex items-center gap-2 p-3 rounded-xl text-red-300 text-sm" style={{background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)'}}><span className="text-red-400"><Icons.alert /></span> {error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"><Icons.mail /></span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white/5 border border-white/10" placeholder="tu@email.com" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-white/90 transition-all text-sm disabled:opacity-50">
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-xs text-white/50 mb-2">Usuarios registrados:</p>
          <div className="space-y-1 text-xs text-white/60">
            <p><span className="text-cyan-400">Admin:</span> juan.ponce@proctek.com</p>
            <p><span className="text-purple-400">Users:</span> fernando.nieto@ / jose.pena@</p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

// Dashboard Page
const DashboardPage = ({ user, onLogout, onNavigate }) => {
  const today = new Date().toISOString().split('T')[0]
  const [log, setLog] = useState({ contactos: 0, followups: 0, crm_updated: false, lista_manana: false, reuniones: 0, propuestas: 0, submitted: false })
  const [weeklyLogs, setWeeklyLogs] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [toast, setToast] = useState({ message: '', show: false, type: 'success' })
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)

  const isViewer = user.role === ROLES.VIEWER
  const isAdmin = user.role === ROLES.ADMIN

  useEffect(() => {
    loadDayLog()
    loadWeeklyLogs()
  }, [user.id, today])

  const loadDayLog = async () => {
    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()
    if (data) setLog(data)
  }

  const loadWeeklyLogs = async () => {
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toISOString().split('T')[0])
    }
    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .in('date', dates)
      .order('date', { ascending: true })
    if (data) setWeeklyLogs(data)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, show: true, type })
    setTimeout(() => setToast({ message: '', show: false, type: 'success' }), 2500)
  }

  const saveLog = async (updates) => {
    setSaving(true)
    const newLog = { ...log, ...updates, user_id: user.id, date: today }
    
    const { error } = await supabase
      .from('daily_logs')
      .upsert(newLog, { onConflict: 'user_id,date' })
    
    if (!error) {
      setLog(newLog)
      showToast('Guardado')
    } else {
      showToast('Error al guardar', 'error')
    }
    setSaving(false)
  }

  const increment = (field) => saveLog({ [field]: (log[field] || 0) + 1 })
  const decrement = (field) => saveLog({ [field]: Math.max((log[field] || 0) - 1, 0) })
  const toggle = (field) => saveLog({ [field]: !log[field] })

  const score = (Math.min(log.contactos / 8, 1) * 40) + (Math.min(log.followups / 4, 1) * 30) + (log.crm_updated ? 15 : 0) + (log.lista_manana ? 15 : 0)
  const weeklyTotals = weeklyLogs.reduce((acc, l) => ({ contactos: acc.contactos + (l.contactos || 0), followups: acc.followups + (l.followups || 0), reuniones: acc.reuniones + (l.reuniones || 0), propuestas: acc.propuestas + (l.propuestas || 0) }), { contactos: 0, followups: 0, reuniones: 0, propuestas: 0 })
  const todayFormatted = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  const handleSendReport = async () => {
    setSending(true)
    const result = await sendEmailNotification(user, log, score)
    if (result.success) {
      await saveLog({ submitted: true, submitted_at: new Date().toISOString() })
      showToast(`Reporte de ${user.name} enviado`, 'success')
    } else {
      showToast('Error al enviar', 'error')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{background: 'linear-gradient(180deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)'}}>
      <Toast message={toast.message} show={toast.show} type={toast.type} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full h-48 rounded-full pointer-events-none" style={{background: 'rgba(6,182,212,0.1)', filter: 'blur(60px)'}} />
      
      <div className="relative z-10 p-4 pb-8">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-cyan-400" style={{background: 'rgba(6,182,212,0.2)'}}><Icons.target /></div>
              <span className="text-white font-bold text-lg">PROCTEK</span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && <button onClick={() => onNavigate('admin')} className="p-2 rounded-xl text-white/70 hover:text-white bg-white/5 border border-white/10"><Icons.settings /></button>}
              <button onClick={onLogout} className="p-2 rounded-xl text-white/70 hover:text-white bg-white/5 border border-white/10"><Icons.logout /></button>
            </div>
          </div>

          {/* User Card */}
          <GlassCard className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}><Icons.user /></div>
              <div>
                <p className="text-white font-semibold">{user.name}</p>
                <p className="text-white/50 text-xs capitalize">{todayFormatted}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60 text-sm">Score del día</span>
              <span className="text-white font-bold text-xl">{Math.round(score)}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden bg-white/10">
              <div className="h-full rounded-full transition-all duration-700" style={{width: `${score}%`, background: 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)'}} />
            </div>
            {log.submitted && <div className="mt-3 flex items-center gap-2 text-green-400 text-xs"><Icons.checkCircle /><span>Reporte enviado</span></div>}
          </GlassCard>

          {/* Scorecard */}
          <GlassCard className="mb-4">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2 text-sm"><span className="text-cyan-400"><Icons.target /></span> Scorecard Diario</h2>

            {/* Contactos */}
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-cyan-400" style={{background: 'rgba(6,182,212,0.2)'}}><Icons.users /></div>
                <div><p className="font-medium text-white text-sm">Contactos nuevos</p><p className="text-xs text-white/50">LinkedIn + Email</p></div>
              </div>
              {!isViewer ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => decrement('contactos')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white/70 text-sm bg-white/5 border border-white/10 disabled:opacity-50">-</button>
                  <div className="w-14 text-center"><span className={`text-xl font-bold ${log.contactos >= 8 ? 'text-cyan-400' : 'text-white'}`}>{log.contactos}</span><span className="text-white/40 text-xs">/8</span></div>
                  <button onClick={() => increment('contactos')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm disabled:opacity-50" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}>+</button>
                </div>
              ) : <span className="text-xl font-bold text-white">{log.contactos}/8</span>}
            </div>

            {/* Follow-ups */}
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-400" style={{background: 'rgba(139,92,246,0.2)'}}><Icons.phone /></div>
                <div><p className="font-medium text-white text-sm">Follow-ups</p><p className="text-xs text-white/50">Contactos previos</p></div>
              </div>
              {!isViewer ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => decrement('followups')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white/70 text-sm bg-white/5 border border-white/10 disabled:opacity-50">-</button>
                  <div className="w-14 text-center"><span className={`text-xl font-bold ${log.followups >= 4 ? 'text-purple-400' : 'text-white'}`}>{log.followups}</span><span className="text-white/40 text-xs">/4</span></div>
                  <button onClick={() => increment('followups')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm disabled:opacity-50" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'}}>+</button>
                </div>
              ) : <span className="text-xl font-bold text-white">{log.followups}/4</span>}
            </div>

            {/* CRM */}
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-green-400" style={{background: 'rgba(34,197,94,0.2)'}}><Icons.chart /></div>
                <p className="font-medium text-white text-sm">CRM actualizado</p>
              </div>
              {!isViewer ? (
                <button onClick={() => toggle('crm_updated')} disabled={saving} className="w-14 h-8 rounded-full transition-all duration-300 relative disabled:opacity-50" style={{background: log.crm_updated ? 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.1)', border: log.crm_updated ? 'none' : '1px solid rgba(255,255,255,0.2)'}}>
                  <div className="w-6 h-6 bg-white rounded-full shadow-lg absolute top-1 transition-all duration-300" style={{left: log.crm_updated ? '28px' : '4px'}} />
                </button>
              ) : <span className={`px-3 py-1 rounded-full text-xs font-medium ${log.crm_updated ? 'text-green-400 bg-green-400/20' : 'text-white/50 bg-white/10'}`}>{log.crm_updated ? 'Sí' : 'No'}</span>}
            </div>

            {/* Lista */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-pink-400" style={{background: 'rgba(236,72,153,0.2)'}}><Icons.calendar /></div>
                <p className="font-medium text-white text-sm">Lista de mañana</p>
              </div>
              {!isViewer ? (
                <button onClick={() => toggle('lista_manana')} disabled={saving} className="w-14 h-8 rounded-full transition-all duration-300 relative disabled:opacity-50" style={{background: log.lista_manana ? 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)' : 'rgba(255,255,255,0.1)', border: log.lista_manana ? 'none' : '1px solid rgba(255,255,255,0.2)'}}>
                  <div className="w-6 h-6 bg-white rounded-full shadow-lg absolute top-1 transition-all duration-300" style={{left: log.lista_manana ? '28px' : '4px'}} />
                </button>
              ) : <span className={`px-3 py-1 rounded-full text-xs font-medium ${log.lista_manana ? 'text-green-400 bg-green-400/20' : 'text-white/50 bg-white/10'}`}>{log.lista_manana ? 'Sí' : 'No'}</span>}
            </div>
          </GlassCard>

          {/* Extra Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <GlassCard>
              <div className="flex items-center gap-2 mb-2"><span className="text-cyan-400"><Icons.meeting /></span><p className="text-xs text-white/50">Reuniones hoy</p></div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{log.reuniones}</span>
                {!isViewer && <div className="flex gap-1">
                  <button onClick={() => decrement('reuniones')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white/70 text-sm bg-white/5 border border-white/10 disabled:opacity-50">-</button>
                  <button onClick={() => increment('reuniones')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm disabled:opacity-50" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}>+</button>
                </div>}
              </div>
            </GlassCard>
            <GlassCard>
              <div className="flex items-center gap-2 mb-2"><span className="text-green-400"><Icons.proposal /></span><p className="text-xs text-white/50">Propuestas</p></div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{log.propuestas}</span>
                {!isViewer && <div className="flex gap-1">
                  <button onClick={() => decrement('propuestas')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white/70 text-sm bg-white/5 border border-white/10 disabled:opacity-50">-</button>
                  <button onClick={() => increment('propuestas')} disabled={saving} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm disabled:opacity-50" style={{background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'}}>+</button>
                </div>}
              </div>
            </GlassCard>
          </div>

          {/* Weekly */}
          <GlassCard className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2 text-sm"><span className="text-cyan-400"><Icons.trending /></span> Esta Semana</h2>
              <button onClick={() => setShowHistory(!showHistory)} className="text-xs text-cyan-400">{showHistory ? 'Ocultar' : 'Ver detalle'}</button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xl font-bold text-cyan-400">{weeklyTotals.contactos}</p>
                <p className="text-xs text-white/50">Contactos</p>
                <p className="text-xs" style={{color: weeklyTotals.contactos >= 40 ? '#22c55e' : '#ef4444'}}>Meta: 40</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xl font-bold text-purple-400">{weeklyTotals.followups}</p>
                <p className="text-xs text-white/50">Follow-ups</p>
                <p className="text-xs" style={{color: weeklyTotals.followups >= 20 ? '#22c55e' : '#ef4444'}}>Meta: 20</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-xl font-bold text-green-400">{weeklyTotals.reuniones}</p>
                <p className="text-xs text-white/50">Reuniones</p>
                <p className="text-xs" style={{color: weeklyTotals.reuniones >= 2 ? '#22c55e' : '#ef4444'}}>Meta: 2</p>
              </div>
            </div>
            {showHistory && weeklyLogs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                {weeklyLogs.map((l, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                    <span className="text-white/60">{new Date(l.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}</span>
                    <div className="flex gap-3">
                      <span><span className="font-semibold text-cyan-400">{l.contactos}</span> cnt</span>
                      <span><span className="font-semibold text-purple-400">{l.followups}</span> flw</span>
                      <span><span className="font-semibold text-green-400">{l.reuniones}</span> reu</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Formula */}
          <GlassCard className="mb-4" glow>
            <p className="text-white/60 text-xs mb-1 text-center">La Matemática del Éxito</p>
            <p className="text-white font-medium text-center text-sm">
              <span className="text-cyan-400 font-bold">8</span>/día → <span className="text-cyan-400 font-bold">40</span>/sem → <span className="text-purple-400 font-bold">2</span> reuniones → <span className="text-yellow-400 font-bold">$339K</span>
            </p>
          </GlassCard>

          {/* Team Dashboard */}
          {isAdmin && (
            <button onClick={() => onNavigate('team')} className="w-full mb-4">
              <GlassCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-purple-400" style={{background: 'rgba(139,92,246,0.2)'}}><Icons.team /></div>
                    <div className="text-left"><p className="font-medium text-white text-sm">Dashboard del Equipo</p><p className="text-xs text-white/50">Ver métricas de todos</p></div>
                  </div>
                  <span className="text-white/30"><Icons.chevronRight /></span>
                </div>
              </GlassCard>
            </button>
          )}

          {/* ENVIAR REPORTE */}
          {!isViewer && (
            <button 
              onClick={handleSendReport} 
              disabled={sending || log.submitted}
              className={`w-full mb-4 py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 transition-all ${log.submitted ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              style={{background: log.submitted ? 'rgba(34,197,94,0.3)' : 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}
            >
              {log.submitted ? (<><Icons.checkCircle /> Reporte Enviado</>) : sending ? (<><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Enviando...</>) : (<><Icons.send /> Enviar Reporte del Día</>)}
            </button>
          )}

          <p className="text-center text-white/30 text-xs">"La disciplina es elegir entre lo que quieres AHORA y lo que quieres MÁS."</p>
        </div>
      </div>
    </div>
  )
}

// Admin Page
const AdminPage = ({ onNavigate }) => {
  const [users, setUsers] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: ROLES.USER })
  const [toast, setToast] = useState({ message: '', show: false, type: 'success' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at')
    if (data) setUsers(data)
    setLoading(false)
  }

  const showToastMsg = (message, type = 'success') => { 
    setToast({ message, show: true, type })
    setTimeout(() => setToast({ message: '', show: false, type: 'success' }), 2000)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('users').insert([newUser])
    if (!error) {
      await loadUsers()
      setShowAdd(false)
      setNewUser({ name: '', email: '', role: ROLES.USER })
      showToastMsg('Usuario creado')
    } else {
      showToastMsg('Error al crear', 'error')
    }
  }

  const updateRole = async (id, role) => {
    const { error } = await supabase.from('users').update({ role }).eq('id', id)
    if (!error) {
      await loadUsers()
      showToastMsg('Rol actualizado')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(180deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)'}}><p className="text-white">Cargando...</p></div>

  return (
    <div className="min-h-screen relative" style={{background: 'linear-gradient(180deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)'}}>
      <Toast message={toast.message} show={toast.show} type={toast.type} />
      <div className="relative z-10 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl text-white/70 bg-white/5 border border-white/10"><Icons.arrowLeft /></button>
            <div><h1 className="text-xl font-bold text-white">Administración</h1><p className="text-white/50 text-xs">Gestión de usuarios</p></div>
          </div>

          <button onClick={() => setShowAdd(true)} className="w-full mb-4 p-4 rounded-2xl border-2 border-dashed border-white/20 hover:bg-white/5">
            <div className="flex items-center justify-center gap-2 text-white/40"><Icons.userPlus /><span className="font-medium text-sm">Agregar Usuario</span></div>
          </button>

          {showAdd && (
            <GlassCard className="mb-4">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm"><span className="text-cyan-400"><Icons.userPlus /></span> Nuevo Usuario</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <input type="text" placeholder="Nombre" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" required />
                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" required />
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10">
                  <option value={ROLES.USER} className="bg-gray-900">Usuario</option>
                  <option value={ROLES.VIEWER} className="bg-gray-900">Viewer</option>
                  <option value={ROLES.ADMIN} className="bg-gray-900">Admin</option>
                </select>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl text-white/70 text-sm border border-white/20">Cancelar</button>
                  <button type="submit" className="flex-1 py-2 rounded-xl text-white text-sm" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}>Crear</button>
                </div>
              </form>
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm"><span className="text-cyan-400"><Icons.users /></span> Usuarios ({users.length})</h3>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}><span className="text-white font-bold">{u.name?.charAt(0)?.toUpperCase()}</span></div>
                    <div><p className="font-medium text-white text-sm">{u.name}</p><p className="text-xs text-white/50">{u.email}</p></div>
                  </div>
                  <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} className="px-2 py-1 rounded-lg text-xs font-medium cursor-pointer border-none" style={{background: u.role === ROLES.ADMIN ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.2)', color: u.role === ROLES.ADMIN ? '#a855f7' : '#22d3ee'}}>
                    <option value={ROLES.USER} className="bg-gray-900">Usuario</option>
                    <option value={ROLES.VIEWER} className="bg-gray-900">Viewer</option>
                    <option value={ROLES.ADMIN} className="bg-gray-900">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

// Team Page
const TeamPage = ({ onNavigate }) => {
  const [users, setUsers] = useState([])
  const [logs, setLogs] = useState([])
  const [expandedUser, setExpandedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const { data: usersData } = await supabase.from('users').select('*').neq('role', ROLES.VIEWER)
    const { data: logsData } = await supabase.from('daily_logs').select('*')
    if (usersData) setUsers(usersData)
    if (logsData) setLogs(logsData)
    setLoading(false)
  }

  const getUserTodayLog = (userId) => logs.find(l => l.user_id === userId && l.date === today) || {}
  const getUserWeeklyTotals = (userId) => logs.filter(l => l.user_id === userId).reduce((acc, l) => ({ contactos: acc.contactos + (l.contactos || 0), followups: acc.followups + (l.followups || 0), reuniones: acc.reuniones + (l.reuniones || 0), propuestas: acc.propuestas + (l.propuestas || 0) }), { contactos: 0, followups: 0, reuniones: 0, propuestas: 0 })
  const calculateScore = (log) => (Math.min((log.contactos || 0) / 8, 1) * 40) + (Math.min((log.followups || 0) / 4, 1) * 30) + (log.crm_updated ? 15 : 0) + (log.lista_manana ? 15 : 0)
  const teamTotals = users.reduce((acc, u) => { const t = getUserWeeklyTotals(u.id); return { contactos: acc.contactos + t.contactos, followups: acc.followups + t.followups, reuniones: acc.reuniones + t.reuniones, propuestas: acc.propuestas + t.propuestas } }, { contactos: 0, followups: 0, reuniones: 0, propuestas: 0 })

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(180deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)'}}><p className="text-white">Cargando...</p></div>

  return (
    <div className="min-h-screen relative" style={{background: 'linear-gradient(180deg, #0a1628 0%, #0f1f3d 50%, #0a1628 100%)'}}>
      <div className="relative z-10 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl text-white/70 bg-white/5 border border-white/10"><Icons.arrowLeft /></button>
            <div><h1 className="text-xl font-bold text-white">Dashboard del Equipo</h1></div>
          </div>

          <GlassCard className="mb-4" glow>
            <p className="text-white/60 text-xs mb-3">Resumen Semanal</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div><p className="text-xl font-bold text-white">{teamTotals.contactos}</p><p className="text-xs text-cyan-400">Contactos</p></div>
              <div><p className="text-xl font-bold text-white">{teamTotals.followups}</p><p className="text-xs text-purple-400">Follow-ups</p></div>
              <div><p className="text-xl font-bold text-white">{teamTotals.reuniones}</p><p className="text-xs text-green-400">Reuniones</p></div>
              <div><p className="text-xl font-bold text-white">{teamTotals.propuestas}</p><p className="text-xs text-pink-400">Propuestas</p></div>
            </div>
          </GlassCard>

          {users.map((u) => {
            const todayLog = getUserTodayLog(u.id)
            const weeklyTotals = getUserWeeklyTotals(u.id)
            const score = calculateScore(todayLog)
            const isExpanded = expandedUser === u.id

            return (
              <GlassCard key={u.id} className="mb-3">
                <button onClick={() => setExpandedUser(isExpanded ? null : u.id)} className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'}}><span className="text-white font-bold">{u.name?.charAt(0)?.toUpperCase()}</span></div>
                    <div className="text-left">
                      <div className="flex items-center gap-2"><p className="font-semibold text-white text-sm">{u.name}</p>{todayLog.submitted && <span className="text-green-400"><Icons.checkCircle /></span>}</div>
                      <p className="text-xs text-white/50">{u.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right"><p className="text-xs text-white/50">Score</p><p className={`text-lg font-bold ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{Math.round(score)}%</p></div>
                    <span className="text-white/40">{isExpanded ? <Icons.chevronUp /> : <Icons.chevronDown />}</span>
                  </div>
                </button>

                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 text-center border-t border-white/10">
                  <div><p className={`text-lg font-bold ${todayLog.contactos >= 8 ? 'text-cyan-400' : 'text-white'}`}>{todayLog.contactos || 0}</p><p className="text-xs text-white/50">Cnt</p></div>
                  <div><p className={`text-lg font-bold ${todayLog.followups >= 4 ? 'text-purple-400' : 'text-white'}`}>{todayLog.followups || 0}</p><p className="text-xs text-white/50">Flw</p></div>
                  <div><p className="text-lg font-bold text-white">{todayLog.reuniones || 0}</p><p className="text-xs text-white/50">Reu</p></div>
                  <div><p className="text-lg font-bold text-white">{todayLog.propuestas || 0}</p><p className="text-xs text-white/50">Prop</p></div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs font-medium text-white/60 mb-2 flex items-center gap-1"><span className="text-cyan-400"><Icons.trending /></span> Totales Semana</p>
                    <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-white/5">
                      <div><p className="text-lg font-bold text-cyan-400">{weeklyTotals.contactos}</p></div>
                      <div><p className="text-lg font-bold text-purple-400">{weeklyTotals.followups}</p></div>
                      <div><p className="text-lg font-bold text-green-400">{weeklyTotals.reuniones}</p></div>
                      <div><p className="text-lg font-bold text-pink-400">{weeklyTotals.propuestas}</p></div>
                    </div>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Main App
export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')

  if (!user) return <LoginPage onLogin={setUser} />
  if (page === 'admin') return <AdminPage onNavigate={setPage} />
  if (page === 'team') return <TeamPage onNavigate={setPage} />
  return <DashboardPage user={user} onLogout={() => { setUser(null); setPage('dashboard') }} onNavigate={setPage} />
}
