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
          <div className="flex justify-center mb-4">
            <svg width="200" height="100" viewBox="140 170 390 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M361.44,232.85c-5.74,2.77-11.66,4.6-17.99,5.56-2.47.38-4.59.36-6.99.49-7.21.42-14.22.22-21.19-1.2-12.39-2.53-25.8-8.61-33.51-19.01-.04.78-.07,1.56-.07,2.35,0,9.68,3.33,18.59,8.9,25.64,5.7,3,13.18,4.52,19.4,4.93.48.03,8.47-.14,11.55-.44,3.22-.3,6.22-.96,9.38-1.73,6.93-1.7,14.09-4.74,20.24-8.57,2.93-1.82,5.78-3.79,8.47-5.93.19-.02-.15.35-.29.51-2.59,3.08-6.06,6.17-9.37,8.47-10.29,7.16-24.88,12.27-37.5,12.51-.82.02-9.62-.3-12-.72,6.5,4.25,14.26,6.72,22.6,6.72,19.03,0,35.05-12.84,39.89-30.33l-1.54.75Z"/>
              <path fill="#fff" d="M310.33,203.31c12.2,14.58,31.7,23.52,50.2,23.74.05,0,.1,0,.16,0l3.4-.28c.26-1.87.4-3.78.4-5.72,0-22.86-18.53-41.39-41.39-41.39-7.81,0-15.12,2.17-21.36,5.93,0,0,0,0,0,0,.86,6.22,3.58,11.72,8.6,17.71Z"/>
              <path fill="#fff" d="M295.7,223.36c12.78,9.51,29.91,12.83,45.6,12.31.95-.03,4.91-.22,6.25-.47,3.3-.62,6.55-1.2,9.83-2.02,2.1-.52,3.89-1.12,5.81-1.83.35-1.36.63-2.75.84-4.16-.57.14-1.14.29-1.7.4-1.57.31-3.09.45-4.63.63-10.83,1.26-22.34-1.39-32.29-5.9-12.42-5.64-26.79-17.02-28.92-31.33l-.22-1.45c-5.83,4.97-10.26,11.53-12.63,19,2.19,5.47,6.36,10.57,12.07,14.82Z"/>
              <path fill="#fff" d="M244.36,312.48l-7.95-6.13h.26c2.29,0,4.29-.72,5.93-2.14,1.68-1.44,2.56-3.32,2.64-5.58.11-2.38-.68-4.51-2.34-6.33-1.67-1.83-3.7-2.76-6.03-2.76h-33.54c-.44,0-.84.15-1.16.44-.35.31-.53.73-.53,1.2v1.83c0,.91.32,1.69.95,2.32.63.63,1.41.95,2.32.95h32.2c.27,0,.68.06,1.16.6.39.44.59.89.6,1.39.01.47-.14.86-.48,1.2-.33.35-.71.51-1.18.51h-32.29c-.91,0-1.69.32-2.32.95-.63.63-.95,1.41-.95,2.32v11.45c0,.46.17.87.49,1.19.32.33.74.5,1.19.5h1.44c.91,0,1.69-.32,2.32-.95.63-.63.95-1.41.95-2.32v-6.78h16.6c.9,0,1.69.27,2.4.83l10.46,8.1c1.01.75,2.18,1.13,3.45,1.13h2.12c.62,0,1.18-.24,1.62-.71.46-.49.64-1.1.55-1.74-.05-.6-.36-1.11-.88-1.49Z"/>
              <path fill="#fff" d="M282.32,289.55h-17.9c-3.53,0-6.58,1.27-9.09,3.77-2.5,2.5-3.77,5.56-3.77,9.09v1.16c0,3.53,1.27,6.59,3.77,9.09,2.5,2.5,5.56,3.77,9.09,3.77h17.9c3.53,0,6.59-1.27,9.09-3.77s3.77-5.56,3.77-9.09v-1.16c0-3.53-1.27-6.58-3.77-9.09-2.5-2.5-5.56-3.77-9.09-3.77ZM282.71,309.67h-18.67c-1.7,0-3.1-.58-4.29-1.79-1.19-1.21-1.77-2.62-1.77-4.32v-1.16c0-1.7.58-3.12,1.77-4.32,1.19-1.2,2.59-1.79,4.29-1.79h18.67c1.7,0,3.11.59,4.32,1.79,1.2,1.21,1.79,2.62,1.79,4.32v1.16c0,1.7-.59,3.11-1.79,4.32-1.2,1.2-2.62,1.79-4.32,1.79Z"/>
              <path fill="#fff" d="M343.73,289.55h-29.12c-3.53,0-6.58,1.27-9.09,3.77-2.5,2.5-3.77,5.56-3.77,9.09v1.16c0,3.53,1.27,6.59,3.77,9.09,2.5,2.5,5.56,3.77,9.09,3.77h29.12c.48,0,.89-.18,1.2-.53.29-.32.44-.72.44-1.16v-1.83c0-.88-.32-1.64-.95-2.28-.63-.63-1.4-.95-2.27-.95h-27.91c-1.7,0-3.1-.58-4.29-1.79-1.19-1.21-1.77-2.62-1.77-4.32v-1.16c0-1.7.58-3.12,1.77-4.32,1.19-1.2,2.59-1.79,4.29-1.79h27.91c.88,0,1.64-.32,2.28-.95.63-.63.95-1.41.95-2.32v-1.83c0-.46-.16-.86-.47-1.17-.31-.31-.71-.47-1.17-.47Z"/>
              <path fill="#fff" d="M393.55,289.55h-38.69c-.91,0-1.69.32-2.32.95-.63.63-.95,1.4-.95,2.28v1.88c0,.43.17.82.49,1.14.32.33.74.5,1.19.5h16.94v18.43c0,.46.17.87.49,1.19.32.33.72.5,1.15.5h1.49c.87,0,1.64-.32,2.29-.94.66-.63.99-1.42.99-2.33v-16.84h15.35c.88,0,1.64-.32,2.28-.95.63-.63.95-1.41.95-2.32v-1.83c0-.46-.16-.86-.47-1.17s-.71-.47-1.17-.47Z"/>
              <path fill="#fff" d="M443.62,289.55h-29.12c-3.53,0-6.58,1.27-9.09,3.77-2.5,2.5-3.77,5.56-3.77,9.09v1.16c0,3.53,1.27,6.59,3.77,9.09,2.5,2.5,5.56,3.77,9.09,3.77h29.12c.48,0,.89-.18,1.2-.53.29-.32.44-.72.44-1.16v-1.83c0-.88-.32-1.64-.95-2.28-.63-.63-1.4-.95-2.27-.95h-27.91c-1.7,0-3.1-.58-4.29-1.79-.58-.58-1.01-1.22-1.3-1.91h28.18c1.01,0,1.91-.29,2.67-.87.83-.63,1.26-1.46,1.26-2.4v-1.44c0-.51-.24-.96-.68-1.26-.35-.25-.77-.38-1.24-.38h-30.02c.28-.55.66-1.06,1.12-1.53,1.19-1.2,2.59-1.79,4.29-1.79h27.91c.88,0,1.64-.32,2.28-.95.63-.63.95-1.41.95-2.32v-1.83c0-.46-.16-.86-.47-1.17-.31-.31-.71-.47-1.17-.47Z"/>
              <path fill="#fff" d="M494.12,312.49l-12.39-9.51,12.4-9.57c.53-.42.81-1.01.81-1.69,0-.62-.23-1.17-.66-1.57-.42-.39-.94-.6-1.51-.6h-2.17c-1.24,0-2.39.38-3.42,1.14l-11.5,8.9h-17.94s0-6.82,0-6.82c0-.88-.32-1.64-.95-2.28-.63-.63-1.41-.95-2.32-.95h-1.44c-.44,0-.84.15-1.16.44-.35.31-.53.73-.53,1.2v23.53c0,.46.17.87.49,1.19.32.33.74.5,1.19.5h1.44c.91,0,1.69-.32,2.32-.95.63-.63.95-1.41.95-2.32v-6.78h17.95s11.5,8.86,11.5,8.86c1.02.79,2.19,1.19,3.47,1.19h2.12c.62,0,1.17-.23,1.57-.66.39-.42.6-.94.6-1.51,0-.71-.28-1.31-.82-1.75Z"/>
              <path fill="#fff" d="M186.48,289.55h-33.54c-.44,0-.84.15-1.16.44-.35.31-.53.73-.53,1.2v1.83c0,.91.32,1.69.95,2.32.63.63,1.41.95,2.32.95h32.29c.26,0,.66.06,1.12.6.38.45.47.93.47,1.32,0,.44-.06.95-.39,1.28s-.71.49-1.19.49l-31.91.18c-.91,0-2.07.14-2.7.77-.63.63-.95,1.41-.95,2.32v11.45c0,.46.17.87.49,1.19.32.33.74.5,1.19.5h1.44c.91,0,1.69-.32,2.32-.95.63-.63.95-1.41.95-2.32v-6.78h28.82c2.3,0,4.29-.76,5.91-2.25,1.64-1.51,2.47-3.44,2.47-5.74s-.82-4.4-2.45-6.15c-1.64-1.77-3.64-2.66-5.93-2.66Z"/>
              <path fill="#fff" d="M515,311.28v.47c0,2.6-2.12,4.72-4.72,4.72h-2.77c-2.6,0-4.72-2.12-4.72-4.72v-.47c0-2.6,2.12-4.72,4.72-4.72h2.77c2.6,0,4.72,2.12,4.72,4.72ZM513.43,311.27c0-1.65-1.34-2.99-2.99-2.99h-3.08c-1.65,0-2.99,1.34-2.99,2.99v.48c0,1.65,1.34,2.99,2.99,2.99h3.08c1.65,0,2.99-1.34,2.99-2.99v-.48ZM512.14,313.31c.02.13-.02.27-.11.37s-.21.16-.35.16h-.33c-.22,0-.44-.07-.61-.21l-1.63-1.25c-.08-.07-.19-.1-.3-.1h-1.61v.93c0,.35-.28.63-.63.63h-.23c-.21,0-.38-.17-.38-.38v-3.66c0-.21.17-.38.38-.38h4.37c.37,0,.73.15,1,.43.29.3.44.7.43,1.11-.02.66-.51,1.17-1.16,1.29l.98.75c.1.08.17.19.18.31ZM510.9,310.79c0-.18-.14-.32-.32-.32h-3.27c-.06,0-.11.05-.11.11v.43c0,.06.05.11.11.11h3.26s0,0,0,0h0c.18,0,.32-.14.32-.32Z"/>
            </svg>
          </div>
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
    
    if (data) {
      setLog(data)
    } else {
      // Reset to empty state for new day
      setLog({ contactos: 0, followups: 0, crm_updated: false, lista_manana: false, reuniones: 0, propuestas: 0, submitted: false })
    }
  }

  const loadWeeklyLogs = async () => {
    // Get Monday of current week
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=Sunday, 1=Monday, etc.
    const monday = new Date(now)
    monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    
    // Get dates from Monday to today
    const dates = []
    const current = new Date(monday)
    while (current <= now) {
      dates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
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
      await loadWeeklyLogs() // Reload weekly totals
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
              <svg width="180" height="36" viewBox="80 200 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#fff" d="M168.24,259.93c-5.76,2.79-11.72,4.62-18.08,5.59-2.48.38-4.62.36-7.02.5-7.25.42-14.29.23-21.29-1.2-12.45-2.54-25.93-8.66-33.67-19.11-.04.78-.07,1.57-.07,2.37,0,9.73,3.34,18.68,8.94,25.76,5.72,3.02,13.24,4.54,19.5,4.95.48.03,8.51-.15,11.61-.44,3.23-.31,6.25-.97,9.43-1.74,6.96-1.71,14.16-4.76,20.34-8.61,2.95-1.83,5.81-3.81,8.51-5.96.19-.02-.15.35-.29.51-2.6,3.09-6.09,6.2-9.42,8.51-10.34,7.2-25,12.33-37.69,12.58-.82.02-9.66-.31-12.06-.72,6.53,4.27,14.33,6.75,22.72,6.75,19.12,0,35.23-12.9,40.09-30.48l-1.55.75Z"/>
                <path fill="#fff" d="M116.87,230.24c12.27,14.65,31.86,23.64,50.44,23.86.05,0,.1,0,.16,0l3.42-.28c.26-1.88.4-3.8.4-5.75,0-22.97-18.62-41.59-41.59-41.59-7.85,0-15.2,2.18-21.46,5.96,0,0,0,0,0,0,.86,6.25,3.6,11.78,8.64,17.8Z"/>
                <path fill="#fff" d="M102.17,250.39c12.84,9.56,30.06,12.9,45.82,12.37.95-.03,4.94-.23,6.28-.48,3.32-.62,6.58-1.2,9.88-2.03,2.11-.53,3.91-1.12,5.84-1.84.35-1.37.63-2.76.84-4.18-.57.14-1.14.29-1.71.4-1.58.31-3.11.46-4.65.64-10.88,1.27-22.45-1.39-32.45-5.93-12.49-5.67-26.92-17.1-29.07-31.48l-.22-1.46c-5.86,4.99-10.31,11.58-12.69,19.1,2.2,5.49,6.4,10.62,12.13,14.89Z"/>
                <path fill="#fff" d="M294.54,257.77l-8.14-6.28h.26c2.35,0,4.39-.74,6.08-2.19,1.72-1.48,2.63-3.41,2.7-5.72.11-2.44-.7-4.62-2.4-6.49-1.72-1.88-3.8-2.83-6.18-2.83h-34.38c-.45,0-.86.16-1.19.45-.35.32-.54.74-.54,1.23v1.87c0,.93.33,1.74.98,2.38.65.65,1.45.98,2.38.98h33c.27,0,.69.06,1.18.61.4.45.6.92.61,1.42.01.49-.14.88-.49,1.23-.34.35-.73.52-1.21.52h-33.1c-.93,0-1.73.33-2.38.98-.65.65-.98,1.45-.98,2.38v11.74c0,.47.18.89.51,1.22.33.33.75.51,1.22.51h1.48c.93,0,1.73-.33,2.38-.98.65-.65.98-1.45.98-2.38v-6.95h17.01c.92,0,1.73.28,2.46.85l10.72,8.3c1.04.77,2.23,1.16,3.54,1.16h2.17c.64,0,1.21-.25,1.66-.72.47-.5.66-1.13.56-1.78-.06-.62-.37-1.14-.9-1.52Z"/>
                <path fill="#fff" d="M333.45,234.26h-18.35c-3.62,0-6.75,1.3-9.31,3.86-2.56,2.56-3.86,5.7-3.86,9.31v1.18c0,3.62,1.3,6.75,3.86,9.31,2.56,2.56,5.69,3.86,9.31,3.86h18.35c3.62,0,6.75-1.3,9.31-3.86s3.86-5.7,3.86-9.31v-1.18c0-3.62-1.3-6.75-3.86-9.31-2.56-2.56-5.7-3.86-9.31-3.86ZM333.84,254.88h-19.14c-1.74,0-3.18-.6-4.4-1.83-1.22-1.24-1.81-2.68-1.81-4.43v-1.18c0-1.74.59-3.19,1.81-4.43,1.22-1.23,2.66-1.83,4.4-1.83h19.14c1.74,0,3.19.6,4.43,1.84,1.24,1.24,1.84,2.68,1.84,4.43v1.18c0,1.74-.6,3.19-1.84,4.43-1.24,1.24-2.68,1.84-4.43,1.84Z"/>
                <path fill="#fff" d="M396.38,234.26h-29.84c-3.62,0-6.75,1.3-9.31,3.86-2.56,2.56-3.86,5.7-3.86,9.31v1.18c0,3.62,1.3,6.75,3.86,9.31,2.56,2.56,5.69,3.86,9.31,3.86h29.84c.49,0,.91-.19,1.23-.54.3-.33.45-.74.45-1.19v-1.87c0-.9-.33-1.68-.98-2.33-.65-.65-1.43-.98-2.33-.98h-28.61c-1.74,0-3.18-.6-4.4-1.83-1.22-1.24-1.81-2.68-1.81-4.43v-1.18c0-1.74.59-3.19,1.81-4.43,1.22-1.23,2.66-1.83,4.4-1.83h28.61c.9,0,1.68-.33,2.33-.98.65-.65.98-1.45.98-2.38v-1.87c0-.47-.17-.88-.48-1.2-.32-.32-.73-.48-1.2-.48Z"/>
                <path fill="#fff" d="M447.45,234.26h-39.66c-.93,0-1.73.33-2.38.98-.65.65-.98,1.43-.98,2.33v1.92c0,.44.18.84.51,1.17.33.33.75.51,1.22.51h17.36v18.89c0,.47.18.89.51,1.22.33.33.74.51,1.17.51h1.53c.89,0,1.68-.33,2.35-.97.67-.65,1.01-1.45,1.01-2.39v-17.26h15.73c.9,0,1.68-.33,2.33-.98.65-.65.98-1.45.98-2.38v-1.87c0-.47-.17-.88-.48-1.2s-.73-.48-1.2-.48Z"/>
                <path fill="#fff" d="M498.77,234.26h-29.84c-3.62,0-6.75,1.3-9.31,3.86-2.56,2.56-3.86,5.7-3.86,9.31v1.18c0,3.62,1.3,6.75,3.86,9.31,2.56,2.56,5.69,3.86,9.31,3.86h29.84c.49,0,.91-.19,1.23-.54.3-.33.45-.74.45-1.19v-1.87c0-.9-.33-1.68-.98-2.33-.65-.65-1.43-.98-2.33-.98h-28.61c-1.74,0-3.18-.6-4.4-1.83-.59-.6-1.03-1.25-1.33-1.96h28.88c1.03,0,1.96-.3,2.74-.9.85-.64,1.3-1.49,1.3-2.46v-1.48c0-.52-.25-.98-.69-1.3-.36-.26-.79-.38-1.27-.38h-30.77c.29-.56.67-1.09,1.15-1.56,1.22-1.23,2.66-1.83,4.4-1.83h28.61c.9,0,1.68-.33,2.33-.98.65-.65.98-1.45.98-2.38v-1.87c0-.47-.17-.88-.48-1.2-.32-.32-.73-.48-1.2-.48Z"/>
                <path fill="#fff" d="M550.52,257.78l-12.7-9.75,12.71-9.81c.54-.43.83-1.03.83-1.73,0-.64-.23-1.2-.68-1.61-.43-.4-.96-.61-1.55-.61h-2.22c-1.27,0-2.45.39-3.5,1.17l-11.79,9.13h-18.39s0-6.99,0-6.99c0-.9-.33-1.68-.98-2.33-.65-.65-1.45-.98-2.38-.98h-1.48c-.45,0-.86.16-1.19.45-.36.32-.54.74-.54,1.23v24.12c0,.47.18.89.51,1.22.33.33.75.51,1.22.51h1.48c.93,0,1.73-.33,2.38-.98.65-.65.98-1.45.98-2.38v-6.95h18.39s11.79,9.09,11.79,9.09c1.04.81,2.24,1.22,3.56,1.22h2.17c.64,0,1.2-.23,1.61-.68.4-.43.61-.96.61-1.55,0-.73-.29-1.35-.84-1.79Z"/>
                <path fill="#fff" d="M235.22,234.26h-34.38c-.45,0-.86.16-1.19.45-.36.32-.54.74-.54,1.23v1.87c0,.93.33,1.74.98,2.38.65.65,1.45.98,2.38.98h33.1c.27,0,.67.06,1.14.62.39.46.58.95.58,1.5,0,.45-.16.83-.5,1.17s-.73.5-1.22.5l-32.71.18c-.93,0-2.12.15-2.77.79-.65.65-.98,1.45-.98,2.38v11.74c0,.47.18.89.51,1.22.33.33.75.51,1.22.51h1.48c.93,0,1.73-.33,2.38-.98.65-.65.98-1.45.98-2.38v-6.95h29.54c2.36,0,4.4-.78,6.06-2.31,1.68-1.55,2.53-3.53,2.53-5.88s-.84-4.51-2.51-6.3c-1.68-1.81-3.73-2.73-6.08-2.73Z"/>
                <path fill="#fff" d="M572,256.69v.49c0,2.67-2.17,4.84-4.84,4.84h-2.83c-2.67,0-4.84-2.17-4.84-4.84v-.49c0-2.67,2.17-4.84,4.84-4.84h2.83c2.67,0,4.84,2.17,4.84,4.84ZM570.39,256.69c0-1.69-1.38-3.07-3.07-3.07h-3.15c-1.69,0-3.07,1.38-3.07,3.07v.49c0,1.69,1.38,3.07,3.07,3.07h3.15c1.69,0,3.07-1.38,3.07-3.07v-.49ZM569.07,258.78c.02.14-.02.27-.11.38s-.22.16-.36.16h-.34c-.23,0-.45-.08-.63-.21l-1.67-1.28c-.09-.07-.19-.1-.3-.1h-1.65v.96c0,.36-.29.65-.65.65h-.23c-.22,0-.39-.18-.39-.39v-3.75c0-.22.18-.39.39-.39h4.48c.38,0,.75.16,1.03.44.29.31.45.72.44,1.14-.02.67-.52,1.2-1.19,1.32l1,.77c.1.08.17.19.19.32ZM567.8,256.19c0-.18-.15-.33-.33-.33h-3.35c-.06,0-.11.05-.11.11v.44c0,.06.05.11.11.11h3.35s0,0,0,0h0c.18,0,.33-.15.33-.33Z"/>
              </svg>
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

          <p className="text-center text-white/30 text-xs">Engineering the Evolution</p>
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

  const deleteUser = async (id, name) => {
    if (!confirm(`¿Eliminar a ${name}?`)) return
    const { error } = await supabase.from('users').delete().eq('id', id)
    if (!error) {
      await loadUsers()
      showToastMsg('Usuario eliminado')
    } else {
      showToastMsg('Error al eliminar', 'error')
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
                  <div className="flex items-center gap-2">
                    <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} className="px-2 py-1 rounded-lg text-xs font-medium cursor-pointer border-none" style={{background: u.role === ROLES.ADMIN ? 'rgba(139,92,246,0.2)' : 'rgba(6,182,212,0.2)', color: u.role === ROLES.ADMIN ? '#a855f7' : '#22d3ee'}}>
                      <option value={ROLES.USER} className="bg-gray-900">Usuario</option>
                      <option value={ROLES.VIEWER} className="bg-gray-900">Viewer</option>
                      <option value={ROLES.ADMIN} className="bg-gray-900">Admin</option>
                    </select>
                    <button onClick={() => deleteUser(u.id, u.name)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
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
