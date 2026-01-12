import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import emailjs from '@emailjs/browser'

// Supabase config
const supabaseUrl = 'https://rxbhadpyytdzktwwomxb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YmhhZHB5eXRkemt0d3dvbXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNjQ5MDcsImV4cCI6MjA4Mzc0MDkwN30.XCaA1UZpkLe9MkdkhHXgythjplbrU11HLrzfZEAbVGU'
const supabase = createClient(supabaseUrl, supabaseKey)

// EmailJS config
const EMAILJS_PUBLIC_KEY = '8-a4VEOPm7U05fd1U'
const EMAILJS_SERVICE_ID = 'service_uniumre'
const EMAILJS_TEMPLATE_ID = 'template_ol568ej'

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Icons
const Icons = {
  logo: () => (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" />
      <path d="M12 20 L18 26 L28 14" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  ),
  user: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  team: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  send: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
}

function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('login')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  
  // Form state - RESET DAILY
  const [todayDate, setTodayDate] = useState(getTodayDate())
  const [scorecard, setScorecard] = useState({
    contactos: '',
    followups: '',
    crm: false,
    lista: false
  })
  
  // Weekly data
  const [weeklyLogs, setWeeklyLogs] = useState([])
  const [teamData, setTeamData] = useState([])

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Login handler
  const handleLogin = async (email) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()
      
      if (error || !data) {
        showToast('Usuario no encontrado', 'error')
      } else {
        setUser(data)
        setPage('dashboard')
        await loadTodayLog(data.id)
        await loadWeeklyLogs(data.id)
      }
    } catch (err) {
      showToast('Error de conexión', 'error')
    }
    setLoading(false)
  }

  // FIX: Load TODAY's log only
  const loadTodayLog = async (userId) => {
    const today = getTodayDate()
    setTodayDate(today)
    
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', today)
      .single()
    
    if (data && !error) {
      // Found today's log - load it
      setScorecard({
        contactos: data.contactos?.toString() || '',
        followups: data.followups?.toString() || '',
        crm: data.crm_updated || false,
        lista: data.lista_updated || false
      })
    } else {
      // No log for today - reset to empty
      setScorecard({
        contactos: '',
        followups: '',
        crm: false,
        lista: false
      })
    }
  }

  // Load weekly logs for summary
  const loadWeeklyLogs = async (userId) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('log_date', weekAgo.toISOString().split('T')[0])
      .order('log_date', { ascending: false })
    
    setWeeklyLogs(data || [])
  }

  // Save scorecard - WITH DATE
  const saveScorecard = async () => {
    if (!user) return
    
    const today = getTodayDate()
    
    // Check if log exists for today
    const { data: existing } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('log_date', today)
      .single()
    
    const logData = {
      user_id: user.id,
      log_date: today,
      contactos: parseInt(scorecard.contactos) || 0,
      followups: parseInt(scorecard.followups) || 0,
      crm_updated: scorecard.crm,
      lista_updated: scorecard.lista,
      updated_at: new Date().toISOString()
    }
    
    if (existing) {
      // Update existing log
      await supabase
        .from('daily_logs')
        .update(logData)
        .eq('id', existing.id)
    } else {
      // Insert new log
      await supabase
        .from('daily_logs')
        .insert([logData])
    }
    
    await loadWeeklyLogs(user.id)
    showToast('Guardado')
  }

  // Auto-save on change
  useEffect(() => {
    if (user && page === 'dashboard') {
      const timer = setTimeout(saveScorecard, 1000)
      return () => clearTimeout(timer)
    }
  }, [scorecard])

  // Check for day change every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = getTodayDate()
      if (newDate !== todayDate && user) {
        setTodayDate(newDate)
        loadTodayLog(user.id)
        showToast('Nuevo día - scorecard reiniciado', 'info')
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [todayDate, user])

  // Send report via email
  const sendReport = async () => {
    if (!user) return
    setLoading(true)
    
    try {
      const weekTotal = weeklyLogs.reduce((acc, log) => ({
        contactos: acc.contactos + (log.contactos || 0),
        followups: acc.followups + (log.followups || 0)
      }), { contactos: 0, followups: 0 })
      
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: 'juan.ponce@proctek.com',
        from_name: user.name,
        date: new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        contactos_hoy: scorecard.contactos || '0',
        followups_hoy: scorecard.followups || '0',
        crm_hoy: scorecard.crm ? 'Sí' : 'No',
        lista_hoy: scorecard.lista ? 'Sí' : 'No',
        contactos_semana: weekTotal.contactos,
        followups_semana: weekTotal.followups,
      }, EMAILJS_PUBLIC_KEY)
      
      showToast('Reporte enviado')
    } catch (err) {
      showToast('Error al enviar', 'error')
    }
    setLoading(false)
  }

  // Load team data (admin only)
  const loadTeamData = async () => {
    const { data: users } = await supabase.from('users').select('*')
    const { data: logs } = await supabase.from('daily_logs').select('*')
    
    const today = getTodayDate()
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const teamStats = users?.map(u => {
      const userLogs = logs?.filter(l => l.user_id === u.id && l.log_date >= weekAgo.toISOString().split('T')[0]) || []
      const todayLog = userLogs.find(l => l.log_date === today)
      
      return {
        ...u,
        todayContactos: todayLog?.contactos || 0,
        todayFollowups: todayLog?.followups || 0,
        weekContactos: userLogs.reduce((sum, l) => sum + (l.contactos || 0), 0),
        weekFollowups: userLogs.reduce((sum, l) => sum + (l.followups || 0), 0),
      }
    }) || []
    
    setTeamData(teamStats)
  }

  // Glassmorphism styles
  const glassCard = "backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl"
  const gradientBg = "min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a1a4e] to-[#0a1628]"
  const inputStyle = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
  const buttonPrimary = "w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"

  // LOGIN PAGE
  if (page === 'login') {
    return (
      <div className={`${gradientBg} flex items-center justify-center p-4`}>
        <div className={`${glassCard} p-8 w-full max-w-md`}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Icons.logo />
            <h1 className="text-2xl font-bold text-white">PROCTEK</h1>
          </div>
          <p className="text-white/60 text-center mb-8">Sales Tracker 2026</p>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(e.target.email.value) }}>
            <div className="mb-6">
              <label className="block text-white/80 text-sm mb-2">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Icons.mail /></span>
                <input 
                  type="email" 
                  name="email"
                  className={`${inputStyle} pl-10`}
                  placeholder="tu.email@proctek.com"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className={buttonPrimary}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
        {toast && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl text-white ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {toast.message}
          </div>
        )}
      </div>
    )
  }

  // DASHBOARD PAGE
  if (page === 'dashboard') {
    const weekTotal = weeklyLogs.reduce((acc, log) => ({
      contactos: acc.contactos + (log.contactos || 0),
      followups: acc.followups + (log.followups || 0)
    }), { contactos: 0, followups: 0 })

    return (
      <div className={gradientBg}>
        {/* Header */}
        <header className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Icons.logo />
            <span className="text-white font-bold">PROCTEK</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm hidden sm:block">{user?.name}</span>
            {user?.role === 'admin' && (
              <button onClick={() => { setPage('team'); loadTeamData() }} className="text-white/60 hover:text-white">
                <Icons.team />
              </button>
            )}
            <button onClick={() => { setUser(null); setPage('login') }} className="text-white/60 hover:text-white">
              <Icons.logout />
            </button>
          </div>
        </header>

        <main className="p-4 max-w-2xl mx-auto">
          {/* Date display - Shows current date */}
          <div className="flex items-center gap-2 text-white/60 mb-6">
            <Icons.calendar />
            <span>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          {/* Today's Scorecard */}
          <div className={`${glassCard} p-6 mb-6`}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Icons.chart /> Scorecard de Hoy
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Contactos Nuevos</label>
                <input
                  type="number"
                  value={scorecard.contactos}
                  onChange={(e) => setScorecard({...scorecard, contactos: e.target.value})}
                  className={inputStyle}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-2">Follow-ups</label>
                <input
                  type="number"
                  value={scorecard.followups}
                  onChange={(e) => setScorecard({...scorecard, followups: e.target.value})}
                  className={inputStyle}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scorecard.crm}
                  onChange={(e) => setScorecard({...scorecard, crm: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span className="text-white/80">Actualicé el CRM/Excel</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scorecard.lista}
                  onChange={(e) => setScorecard({...scorecard, lista: e.target.checked})}
                  className="w-5 h-5 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span className="text-white/80">Preparé lista de mañana</span>
              </label>
            </div>

            <button onClick={sendReport} disabled={loading} className={buttonPrimary}>
              <Icons.send /> {loading ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </div>

          {/* Weekly Summary */}
          <div className={`${glassCard} p-6`}>
            <h2 className="text-white font-semibold mb-4">Resumen Semanal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-cyan-400">{weekTotal.contactos}</div>
                <div className="text-white/60 text-sm">Contactos</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-purple-400">{weekTotal.followups}</div>
                <div className="text-white/60 text-sm">Follow-ups</div>
              </div>
            </div>
            
            {/* Daily breakdown */}
            <div className="mt-4 space-y-2">
              {weeklyLogs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex justify-between text-sm text-white/60 py-2 border-b border-white/10">
                  <span>{new Date(log.log_date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}</span>
                  <span>{log.contactos || 0} contactos / {log.followups || 0} follow-ups</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {toast && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl text-white ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-green-500'}`}>
            {toast.message}
          </div>
        )}
      </div>
    )
  }

  // TEAM PAGE (Admin only)
  if (page === 'team') {
    return (
      <div className={gradientBg}>
        <header className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <Icons.logo />
            <span className="text-white font-bold">PROCTEK</span>
          </div>
          <button onClick={() => setPage('dashboard')} className="text-white/60 hover:text-white">
            ← Volver
          </button>
        </header>

        <main className="p-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Dashboard del Equipo</h1>
          
          <div className="grid gap-4">
            {teamData.filter(u => u.role !== 'viewer').map((member, i) => (
              <div key={i} className={`${glassCard} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {member.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.name}</div>
                      <div className="text-white/40 text-sm">{member.email}</div>
                    </div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">{member.role}</div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-cyan-400">{member.todayContactos}</div>
                    <div className="text-xs text-white/40">Hoy</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{member.todayFollowups}</div>
                    <div className="text-xs text-white/40">Follow-ups</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-cyan-400">{member.weekContactos}</div>
                    <div className="text-xs text-white/40">Sem. Cont.</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{member.weekFollowups}</div>
                    <div className="text-xs text-white/40">Sem. FU</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return null
}

export default App
