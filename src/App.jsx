import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ledger.entries.v1'

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Utilities', 'Health',
  'Leisure', 'Shopping', 'Salary', 'Freelance', 'Other'
]

const seedEntries = [
  { id: crypto.randomUUID(), description: 'Monthly salary', amount: 65000, type: 'income', category: 'Salary', date: isoDaysAgo(6) },
  { id: crypto.randomUUID(), description: 'Groceries — market run', amount: 1840, type: 'expense', category: 'Food', date: isoDaysAgo(5) },
  { id: crypto.randomUUID(), description: 'Metro pass', amount: 600, type: 'expense', category: 'Transport', date: isoDaysAgo(4) },
  { id: crypto.randomUUID(), description: 'Electricity bill', amount: 1450, type: 'expense', category: 'Utilities', date: isoDaysAgo(2) },
  { id: crypto.randomUUID(), description: 'Design contract', amount: 9500, type: 'income', category: 'Freelance', date: isoDaysAgo(1) },
]

function isoDaysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function formatMoney(n) {
  const sign = n < 0 ? '-' : ''
  const formatted = Math.abs(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${sign}₹${formatted}`
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedEntries
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length) return parsed
    return seedEntries
  } catch {
    return seedEntries
  }
}

export default function App() {
  const [entries, setEntries] = useState(loadEntries)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const totals = useMemo(() => {
    const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0)
    const expense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
    return { income, expense, balance: income - expense }
  }, [entries])

  const visibleEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1))
    if (filter === 'all') return sorted
    return sorted.filter(e => e.type === filter)
  }, [entries, filter])

  function handleSubmit(e) {
    e.preventDefault()
    const amountNum = parseFloat(form.amount)
    if (!form.description.trim()) {
      setFormError('Give this entry a short description.')
      return
    }
    if (!amountNum || amountNum <= 0) {
      setFormError('Amount needs to be a number greater than zero.')
      return
    }
    const entry = {
      id: crypto.randomUUID(),
      description: form.description.trim(),
      amount: Math.round(amountNum * 100) / 100,
      type: form.type,
      category: form.category,
      date: form.date,
    }
    setEntries(prev => [entry, ...prev])
    setForm(f => ({ ...f, description: '', amount: '' }))
    setFormError('')
  }

  function removeEntry(id) {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="page">
      <div className="book">
        <header className="book-header">
          <div className="book-title">
            <span className="mark">L</span>
            <div>
              <h1>Ledger</h1>
              <p className="subtitle">A running record of money in and out.</p>
            </div>
          </div>
          <div className="balance-plate">
            <span className="balance-label">Balance</span>
            <span className={`balance-value ${totals.balance < 0 ? 'is-negative' : ''}`}>
              {formatMoney(totals.balance)}
            </span>
          </div>
        </header>

        <section className="summary-row" aria-label="Summary">
          <div className="summary-card">
            <span className="summary-label">Income</span>
            <span className="summary-value in">{formatMoney(totals.income)}</span>
          </div>
          <div className="summary-divider" aria-hidden="true" />
          <div className="summary-card">
            <span className="summary-label">Expenses</span>
            <span className="summary-value out">{formatMoney(totals.expense)}</span>
          </div>
          <div className="summary-divider" aria-hidden="true" />
          <div className="summary-card">
            <span className="summary-label">Entries</span>
            <span className="summary-value">{entries.length}</span>
          </div>
        </section>

        <section className="entry-form-section">
          <h2>Add an entry</h2>
          <form className="entry-form" onSubmit={handleSubmit} noValidate>
            <div className="field field-description">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="Coffee with Alex"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="field field-amount">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>

            <div className="field field-type">
              <span className="field-legend">Type</span>
              <div className="toggle-group" role="radiogroup" aria-label="Entry type">
                <button
                  type="button"
                  className={`toggle ${form.type === 'expense' ? 'active out' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
                  aria-pressed={form.type === 'expense'}
                >
                  Expense
                </button>
                <button
                  type="button"
                  className={`toggle ${form.type === 'income' ? 'active in' : ''}`}
                  onClick={() => setForm(f => ({ ...f, type: 'income' }))}
                  aria-pressed={form.type === 'income'}
                >
                  Income
                </button>
              </div>
            </div>

            <div className="field field-category">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="field field-date">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>

            <button type="submit" className="add-button">Add entry</button>
          </form>
          {formError && <p className="form-error" role="alert">{formError}</p>}
        </section>

        <section className="entries-section">
          <div className="entries-header">
            <h2>Entries</h2>
            <div className="filter-group" role="radiogroup" aria-label="Filter entries">
              {['all', 'income', 'expense'].map(f => (
                <button
                  key={f}
                  type="button"
                  className={`filter-pill ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                >
                  {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expenses'}
                </button>
              ))}
            </div>
          </div>

          {visibleEntries.length === 0 ? (
            <div className="empty-state">
              <p>No entries yet. Add one above to start the ledger.</p>
            </div>
          ) : (
            <ul className="entry-list">
              {visibleEntries.map(entry => (
                <li key={entry.id} className="entry-row">
                  <div className="entry-main">
                    <span className="entry-description">{entry.description}</span>
                    <span className="entry-meta">{entry.category} · {formatDate(entry.date)}</span>
                  </div>
                  <span className={`entry-amount ${entry.type === 'income' ? 'in' : 'out'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatMoney(entry.amount)}
                  </span>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => removeEntry(entry.id)}
                    aria-label={`Remove ${entry.description}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
