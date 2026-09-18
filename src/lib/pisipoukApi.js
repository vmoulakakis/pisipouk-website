export const PISIPOUK_API = 'https://gqpbskssrvpfjtujwezc.supabase.co/functions/v1/pisipouk-api'

async function call(action, { method = 'GET', body, token, params } = {}) {
  const url = new URL(PISIPOUK_API)
  if (method === 'GET') url.searchParams.set('action', action)
  if (params) Object.entries(params).forEach(([k,v]) => v != null && url.searchParams.set(k, v))
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify({ action, ...(body || {}) }) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Αποτυχία επικοινωνίας με τον διακομιστή.')
  return data
}

export const pisipoukApi = {
  publicSettings: () => call('public_settings'),
  publicReviews: () => call('public_reviews'),
  contact: (body) => call('contact', { method: 'POST', body }),
  login: (password) => call('admin_login', { method: 'POST', body: { password } }),
  logout: (token) => call('admin_logout', { method: 'POST', token }),
  stats: (token) => call('admin_stats', { token }),
  messages: (token, status = 'all') => call('admin_messages', { token, params: { status } }),
  updateMessage: (token, body) => call('admin_update_message', { method: 'POST', token, body }),
  deleteMessage: (token, id) => call('admin_delete_message', { method: 'POST', token, body: { id } }),
  reviews: (token) => call('admin_reviews', { token }),
  saveReview: (token, body) => call('admin_save_review', { method: 'POST', token, body }),
  deleteReview: (token, id) => call('admin_delete_review', { method: 'POST', token, body: { id } }),
  settings: (token) => call('admin_settings', { token }),
  saveSetting: (token, key, value, is_public = true) => call('admin_settings', { method: 'POST', token, body: { key, value, is_public } }),
  changePassword: (token, new_password) => call('admin_change_password', { method: 'POST', token, body: { new_password } }),
}
