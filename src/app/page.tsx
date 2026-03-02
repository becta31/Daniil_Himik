'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, BookOpen, Target, Trophy, Atom, Zap, ChevronRight, Medal, Menu, X, Home, FlaskConical, Sparkles, Award } from 'lucide-react'

interface Element {
  id: string
  atomicNumber: number
  symbol: string
  nameRu: string
  nameEn: string
  mass: number
  category: string
  period: number
  group: number
  electronConfiguration: string
  description: string
}

const COLORS: Record<string, { bg: string; text: string; border: string }> = {
  alkali_metal: { bg: 'bg-red-500/30', text: 'text-red-400', border: 'border-red-500/50' },
  alkaline_earth_metal: { bg: 'bg-orange-500/30', text: 'text-orange-400', border: 'border-orange-500/50' },
  transition_metal: { bg: 'bg-yellow-500/30', text: 'text-yellow-400', border: 'border-yellow-500/50' },
  post_transition_metal: { bg: 'bg-green-500/30', text: 'text-green-400', border: 'border-green-500/50' },
  metalloid: { bg: 'bg-teal-500/30', text: 'text-teal-400', border: 'border-teal-500/50' },
  nonmetal: { bg: 'bg-cyan-500/30', text: 'text-cyan-400', border: 'border-cyan-500/50' },
  halogen: { bg: 'bg-blue-500/30', text: 'text-blue-400', border: 'border-blue-500/50' },
  noble_gas: { bg: 'bg-purple-500/30', text: 'text-purple-400', border: 'border-purple-500/50' },
  lanthanide: { bg: 'bg-pink-500/30', text: 'text-pink-400', border: 'border-pink-500/50' },
  actinide: { bg: 'bg-rose-500/30', text: 'text-rose-400', border: 'border-rose-500/50' },
}

const CAT_NAMES: Record<string, string> = {
  alkali_metal: 'Щелочной металл',
  alkaline_earth_metal: 'Щелочноземельный',
  transition_metal: 'Переходный металл',
  post_transition_metal: 'Постпереходный',
  metalloid: 'Металлоид',
  nonmetal: 'Неметалл',
  halogen: 'Галоген',
  noble_gas: 'Благородный газ',
  lanthanide: 'Лантаноид',
  actinide: 'Актиноид',
}

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Главная' },
  { id: 'table', icon: Table, label: 'Таблица' },
  { id: 'study', icon: BookOpen, label: 'Обучение' },
  { id: 'quiz', icon: Target, label: 'Викторина' },
  { id: 'leaderboard', icon: Trophy, label: 'Рейтинг' },
] as const

type ViewType = 'home' | 'table' | 'study' | 'quiz' | 'leaderboard'

export default function Page() {
  const [view, setView] = useState<ViewType>('home')
  const [elements, setElements] = useState<Element[]>([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)
  const [search, setSearch] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const [quizStarted, setQuizStarted] = useState(false)
  const [questions, setQuestions] = useState<{q: string, opts: string[], ans: string}[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState('')
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [done, setDone] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)
  
  const [leaderboard, setLeaderboard] = useState<{id: string, playerName: string, score: number, correctAnswers: number, totalQuestions: number, createdAt: string}[]>([])

  useEffect(() => {
    fetch('/api/elements')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setElements(data)
      })
      .finally(() => setLoading(false))
    
    fetch('/api/quiz/results')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setLeaderboard(data)
      })
  }, [])

  const filtered = elements.filter(e => 
    !search || e.symbol.toLowerCase().includes(search.toLowerCase()) || e.nameRu.includes(search)
  )

  const genQuiz = () => {
    if (elements.length === 0) return
    const qs = []
    const els = [...elements].sort(() => Math.random() - 0.5)
    for (let i = 0; i < Math.min(10, elements.length); i++) {
      const el = els[i % els.length]
      const t = Math.floor(Math.random() * 3)
      let q: string, ans: string, opts: string[]
      if (t === 0) {
        q = `Какой символ у элемента "${el.nameRu}"?`
        ans = el.symbol
        opts = [ans, ...elements.filter(x => x.symbol !== ans).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.symbol)].sort(() => Math.random() - 0.5)
      } else if (t === 1) {
        q = `Как называется элемент "${el.symbol}"?`
        ans = el.nameRu
        opts = [ans, ...elements.filter(x => x.nameRu !== ans).sort(() => Math.random() - 0.5).slice(0, 3).map(x => x.nameRu)].sort(() => Math.random() - 0.5)
      } else {
        q = `Какой атомный номер у "${el.nameRu}"?`
        ans = String(el.atomicNumber)
        opts = [ans, ...elements.filter(x => x.atomicNumber !== el.atomicNumber).sort(() => Math.random() - 0.5).slice(0, 3).map(x => String(x.atomicNumber))].sort(() => Math.random() - 0.5)
      }
      qs.push({ q, opts, ans })
    }
    setQuestions(qs)
    setQIdx(0)
    setSelected('')
    setScore(0)
    setCorrectAnswers(0)
    setDone(false)
    setShowResult(false)
    setPlayerName('')
    setSaved(false)
    setQuizStarted(true)
  }

  const checkAnswer = () => {
    if (!selected || showResult) return
    setShowResult(true)
    if (selected === questions[qIdx].ans) {
      setScore(s => s + 100)
      setCorrectAnswers(c => c + 1)
    }
  }

  const nextQuestion = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1)
      setSelected('')
      setShowResult(false)
    } else {
      setDone(true)
    }
  }

  const saveResult = async () => {
    if (!playerName.trim()) return
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score,
          correctAnswers,
          totalQuestions: questions.length,
          timeSpent: 0
        })
      })
      const results = await fetch('/api/quiz/results').then(r => r.json())
      setLeaderboard(results)
      setSaved(true)
    } catch (e) {
      console.error('Failed to save result:', e)
    }
  }

  const handleNav = (id: ViewType) => {
    setView(id)
    setMobileMenuOpen(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
    </div>
  )

  const el = filtered[idx]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="px-4 md:px-8 py-3 flex justify-between items-center">
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ХИМИК</span>
          </button>
          
          <nav className="hidden md:flex gap-2">
            {NAV_ITEMS.map(item => (
              <Button key={item.id} size="sm" variant={view === item.id ? 'default' : 'ghost'}
                onClick={() => handleNav(item.id)}
                className={view === item.id ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}>
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-700 bg-slate-900">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  view === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'
                }`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="pt-20 pb-24 md:pb-8 px-4 md:px-8 flex-1 relative z-10">
        {/* Home */}
        {view === 'home' && (
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-12rem)]">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 mb-6">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">118 химических элементов</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">ХИМИК</span>
                </h1>
                
                <p className="text-xl text-slate-400 mb-8 max-w-lg">
                  Интерактивный тренажер для изучения периодической таблицы. 
                  Изучайте элементы и проверяйте знания в викторине!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button size="lg" onClick={() => handleNav('study')} 
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl px-8 py-6 text-lg shadow-lg shadow-cyan-500/20">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Начать обучение
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => handleNav('quiz')} 
                    className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-xl px-8 py-6 text-lg">
                    <Target className="w-5 h-5 mr-2" />
                    Викторина
                  </Button>
                </div>
                
                <div className="flex gap-8 mt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">118</div>
                    <div className="text-slate-500 text-sm">Элементов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">10</div>
                    <div className="text-slate-500 text-sm">Категорий</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{leaderboard.length}</div>
                    <div className="text-slate-500 text-sm">Игроков</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  {icon: Table, title: 'Периодическая таблица', desc: 'Интерактивная таблица Менделеева с 118 элементами', color: 'cyan'},
                  {icon: BookOpen, title: 'Режим обучения', desc: 'Карточки с подробной информацией о каждом элементе', color: 'purple'},
                  {icon: Target, title: 'Викторина', desc: 'Проверьте свои знания и получите очки', color: 'pink'},
                  {icon: Trophy, title: 'Таблица лидеров', desc: 'Соревнуйтесь с другими игроками', color: 'yellow'},
                ].map((item, i) => (
                  <Card key={i} 
                    className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 cursor-pointer hover:-translate-y-1 transition-all group"
                    onClick={() => handleNav(['table', 'study', 'quiz', 'leaderboard'][i] as ViewType)}>
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                      </div>
                      <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {view === 'table' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Периодическая таблица</h2>
                <p className="text-slate-400">Нажмите на элемент для подробной информации</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(COLORS).map(([k, c]) => (
                  <Badge key={k} className={`${c.bg} ${c.text} ${c.border} text-xs`}>{CAT_NAMES[k]}</Badge>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
              <div className="grid gap-1 min-w-[1100px] md:min-w-0" 
                style={{gridTemplateColumns: 'repeat(18, minmax(50px, 1fr))', gridTemplateRows: 'repeat(10, 58px)'}}>
                {elements.map(e => {
                  const pos = e.category === 'lanthanide' 
                    ? {row: 9, col: e.atomicNumber - 54} 
                    : e.category === 'actinide' 
                      ? {row: 10, col: e.atomicNumber - 86} 
                      : {row: e.period, col: e.group}
                  return (
                    <Dialog key={e.id}>
                      <DialogTrigger asChild>
                        <button className={`${COLORS[e.category]?.bg} border ${COLORS[e.category]?.border} flex flex-col items-center justify-center hover:scale-110 hover:z-10 hover:shadow-lg transition-all cursor-pointer rounded-lg`}
                          style={{gridRow: pos.row, gridColumn: pos.col}}>
                          <span className="text-[10px] text-slate-400 font-medium">{e.atomicNumber}</span>
                          <span className={`font-bold text-xl ${COLORS[e.category]?.text}`}>{e.symbol}</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
                        <DialogHeader><DialogTitle className="text-xl text-white">{e.nameRu} ({e.symbol})</DialogTitle></DialogHeader>
                        <div className="space-y-3 mt-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800 rounded-lg p-3">
                              <div className="text-slate-400 text-xs mb-1">Атомный номер</div>
                              <div className="text-2xl font-bold text-cyan-400">{e.atomicNumber}</div>
                            </div>
                            <div className="bg-slate-800 rounded-lg p-3">
                              <div className="text-slate-400 text-xs mb-1">Атомная масса</div>
                              <div className="text-2xl font-bold text-purple-400">{e.mass}</div>
                            </div>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-3">
                            <div className="text-slate-400 text-xs mb-1">Категория</div>
                            <div className="font-semibold text-white">{CAT_NAMES[e.category]}</div>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-3">
                            <div className="text-slate-400 text-xs mb-1">Описание</div>
                            <p className="text-slate-300">{e.description}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Study */}
        {view === 'study' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold">Режим обучения</h2>
                <p className="text-slate-400">Изучайте элементы периодической таблицы</p>
              </div>
              <Input value={search} onChange={e => {setSearch(e.target.value); setIdx(0)}} 
                placeholder="Поиск элемента..." 
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 w-full md:w-64" />
            </div>
            
            {el && (
              <>
                <Progress value={((idx + 1) / filtered.length) * 100} className="h-2 mb-6" />
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Элемент {idx + 1} из {filtered.length}</span>
                </div>
                
                <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 overflow-hidden shadow-2xl">
                  <div className="md:flex min-h-[400px]">
                    {/* Левая часть - карточка элемента */}
                    <div className={`w-full md:w-96 p-8 flex flex-col items-center justify-center relative ${COLORS[el.category]?.bg}`}>
                      {/* Декоративные элементы */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-8 left-8 w-32 h-32 rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-8 right-8 w-40 h-40 rounded-full bg-white blur-3xl" />
                      </div>
                      
                      {/* Карточка элемента */}
                      <div className={`relative w-64 h-64 rounded-3xl ${COLORS[el.category]?.bg} border-4 ${COLORS[el.category]?.border} flex flex-col items-center justify-center shadow-2xl backdrop-blur-sm bg-slate-900/50`}>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-3xl" />
                        <span className="absolute top-4 left-5 text-lg font-semibold text-slate-400">{el.atomicNumber}</span>
                        <span className="absolute top-4 right-5 text-lg font-medium text-slate-500">{el.mass}</span>
                        <span className={`text-9xl font-bold ${COLORS[el.category]?.text} drop-shadow-lg mb-2`}>{el.symbol}</span>
                        <span className="text-xl font-medium text-slate-300">{el.nameRu}</span>
                      </div>
                      
                      {/* Категория */}
                      <Badge className={`mt-8 ${COLORS[el.category]?.bg} ${COLORS[el.category]?.text} ${COLORS[el.category]?.border} text-base px-6 py-2.5 font-medium`}>
                        {CAT_NAMES[el.category]}
                      </Badge>
                    </div>
                    
                    {/* Правая часть - информация */}
                    <div className="flex-1 p-6 md:p-8">
                      {/* Заголовок */}
                      <div className="mb-6">
                        <h3 className="text-4xl font-bold text-white mb-1">{el.nameRu}</h3>
                        <p className="text-slate-400 text-xl">{el.nameEn}</p>
                      </div>
                      
                      {/* Характеристики */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-slate-700/40 rounded-xl p-4 text-center border border-slate-600/30 hover:border-cyan-500/50 transition-colors">
                          <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Атомная масса</div>
                          <div className="text-2xl font-bold text-cyan-400">{el.mass}</div>
                        </div>
                        <div className="bg-slate-700/40 rounded-xl p-4 text-center border border-slate-600/30 hover:border-purple-500/50 transition-colors">
                          <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Период</div>
                          <div className="text-2xl font-bold text-purple-400">{el.period}</div>
                        </div>
                        <div className="bg-slate-700/40 rounded-xl p-4 text-center border border-slate-600/30 hover:border-green-500/50 transition-colors">
                          <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Группа</div>
                          <div className="text-2xl font-bold text-green-400">{el.group}</div>
                        </div>
                      </div>
                      
                      {/* Электронная конфигурация */}
                      <div className="bg-slate-700/30 rounded-xl p-4 mb-6 border border-slate-600/30">
                        <div className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Электронная конфигурация</div>
                        <div className="text-lg font-mono font-semibold text-amber-400">{el.electronConfiguration}</div>
                      </div>
                      
                      {/* Описание */}
                      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-5 border border-slate-600/30">
                        <p className="text-slate-200 text-lg leading-relaxed">{el.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <div className="flex justify-between mt-6 gap-4">
                  <Button variant="outline" onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} 
                    className="flex-1 border-slate-600 h-12">← Назад</Button>
                  <Button onClick={() => setIdx(i => Math.min(filtered.length - 1, i + 1))} 
                    disabled={idx === filtered.length - 1} 
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 h-12">Далее →</Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Quiz Start */}
        {view === 'quiz' && !quizStarted && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Викторина</h2>
              <p className="text-slate-400">Проверьте свои знания химических элементов</p>
            </div>
            
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-slate-700/50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">10 вопросов</div>
                      <div className="text-slate-400 text-sm">Случайные элементы</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-700/50 rounded-xl p-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">+100 очков</div>
                      <div className="text-slate-400 text-sm">За каждый правильный ответ</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button size="lg" onClick={genQuiz} disabled={elements.length === 0}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl h-14 text-lg">
              {elements.length === 0 ? 'Загрузка элементов...' : 'Начать викторину'}
            </Button>
          </div>
        )}

        {/* Quiz In Progress */}
        {view === 'quiz' && quizStarted && !done && (
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Вопрос {qIdx + 1} из {questions.length}</span>
              <span className="text-cyan-400 font-bold text-lg">Очки: {score}</span>
            </div>
            <Progress value={((qIdx + 1) / questions.length) * 100} className="h-2 mb-6" />
            
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardContent className="p-6 md:p-8">
                <p className="text-center text-white text-xl font-medium mb-8">{questions[qIdx].q}</p>
                <div className="grid grid-cols-2 gap-4">
                  {questions[qIdx].opts.map((o, i) => {
                    const isCorrect = o === questions[qIdx].ans
                    const isSelected = o === selected
                    let btnClass = 'border-slate-600 text-white hover:bg-slate-700/50 hover:border-slate-500'
                    
                    if (showResult) {
                      if (isCorrect) btnClass = 'border-green-500 bg-green-500/20 text-green-300'
                      else if (isSelected && !isCorrect) btnClass = 'border-red-500 bg-red-500/20 text-red-300'
                      else btnClass = 'border-slate-600 text-slate-500'
                    } else if (isSelected) {
                      btnClass = 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    }
                    
                    return (
                      <button key={i} onClick={() => !showResult && setSelected(o)}
                        className={`p-6 rounded-xl border-2 text-lg font-medium transition-all ${btnClass}`}>
                        {o}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            {!showResult ? (
              <Button size="lg" onClick={checkAnswer} disabled={!selected} 
                className="w-full bg-cyan-500 hover:bg-cyan-600 h-14 text-lg rounded-xl">
                Ответить
              </Button>
            ) : (
              <Button size="lg" onClick={nextQuestion} 
                className="w-full bg-cyan-500 hover:bg-cyan-600 h-14 text-lg rounded-xl">
                {qIdx < questions.length - 1 ? 'Следующий вопрос' : 'Посмотреть результат'} <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        )}

        {/* Quiz Done */}
        {view === 'quiz' && done && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Результат</h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent my-4">{score}</div>
              <p className="text-slate-400 text-lg">{correctAnswers} из {questions.length} правильных ответов</p>
            </div>
            
            {!saved ? (
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardContent className="p-6">
                  <p className="text-slate-300 mb-4">Введите имя для таблицы лидеров:</p>
                  <Input value={playerName} onChange={e => setPlayerName(e.target.value)}
                    placeholder="Ваше имя..." className="bg-slate-700/50 border-slate-600 text-white mb-4 h-12 text-lg"
                    maxLength={20} />
                  <Button onClick={saveResult} disabled={!playerName.trim()} 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 h-12 text-lg rounded-xl">
                    Сохранить результат
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-300 text-lg">✓ Результат сохранён!</p>
              </div>
            )}
            
            <div className="flex gap-4">
              <Button onClick={() => {setQuizStarted(false); setDone(false)}} variant="outline" 
                className="flex-1 border-slate-600 h-12 text-lg rounded-xl">
                Играть снова
              </Button>
              <Button onClick={() => handleNav('leaderboard')} 
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 h-12 text-lg rounded-xl">
                Рейтинг
              </Button>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {view === 'leaderboard' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-bold">Таблица лидеров</h2>
            </div>
            
            {leaderboard.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                <Medal className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Пока нет результатов</p>
                <p className="text-sm mt-2">Пройдите викторину первым!</p>
                <Button onClick={() => handleNav('quiz')} className="mt-6 bg-cyan-500">
                  Начать викторину
                </Button>
              </div>
            ) : (
              <>
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-700">
                      {leaderboard.map((result, i) => (
                        <div key={result.id} className={`flex items-center gap-6 p-6 ${i < 3 ? 'bg-slate-700/30' : ''}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                            i === 0 ? 'bg-yellow-500 text-yellow-900' :
                            i === 1 ? 'bg-slate-300 text-slate-700' :
                            i === 2 ? 'bg-amber-600 text-amber-900' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white text-lg">{result.playerName}</p>
                            <p className="text-slate-400">{result.correctAnswers}/{result.totalQuestions} правильных ответов</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-cyan-400">{result.score}</p>
                            <p className="text-slate-400 text-sm">очков</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-8 text-center">
                  <Button onClick={() => handleNav('quiz')} size="lg" className="bg-cyan-500 hover:bg-cyan-600 rounded-xl px-8">
                    Пройти викторину
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 z-50">
        <div className="grid grid-cols-5">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                view === item.id ? 'text-cyan-400' : 'text-slate-400'
              }`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <footer className="hidden md:block border-t border-slate-800 py-6 text-center text-slate-500 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <FlaskConical className="w-4 h-4" />
          <span>ХИМИК — Интерактивный тренажер по химии</span>
        </div>
      </footer>
    </div>
  )
}
