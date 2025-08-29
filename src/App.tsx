import React, { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Pencil, Trash, X } from "lucide-react"
import ThemeToggle from "./components/ThemeToggle"

type MeasureEntry = { value: string, date: string }
type MeasuresType = { [part: string]: MeasureEntry[] }

export default function App() {
  // ---------------- PESO ----------------
  const [weight, setWeight] = useState("")
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0])
  const [weights, setWeights] = useState(() => {
    const saved = localStorage.getItem("weights")
    return saved ? JSON.parse(saved) : []
  })
  const [editIndex, setEditIndex] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem("weights", JSON.stringify(weights))
  }, [weights])

  const addWeight = () => {
    if (!weight) return
    const newEntry = { date: date || new Date().toLocaleDateString(), value: parseFloat(weight) }
    setWeights([newEntry, ...weights])
    setWeight("")
    setDate(new Date().toISOString().split("T")[0])
  }

  const deleteWeight = (index: number) => {
    const updated = weights.filter((_, i) => i !== index)
    setWeights(updated)
  }

  const saveEdit = () => {
    if (editIndex === null || !weight) return
    const updated = [...weights]
    updated[editIndex] = { date: date || updated[editIndex].date, value: parseFloat(weight) }
    setWeights(updated)
    setEditIndex(null)
    setWeight("")
    setDate(new Date().toISOString().split("T")[0])
  }

  // ---------------- MEDIDAS ----------------
  const [selectedPart, setSelectedPart] = useState("")
  const [measure, setMeasure] = useState("")
  const [measureDate, setMeasureDate] = useState(() => new Date().toISOString().split("T")[0])
  const [measures, setMeasures] = useState<MeasuresType>(() => {
    const saved = localStorage.getItem("measures")
    return saved ? JSON.parse(saved) : {}
  })

  // Para edição de medida específica
  const [editMeasureIdx, setEditMeasureIdx] = useState<number | null>(null)
  const [editMeasureValue, setEditMeasureValue] = useState("")
  const [editMeasureDate, setEditMeasureDate] = useState("")

  useEffect(() => {
    localStorage.setItem("measures", JSON.stringify(measures))
  }, [measures])

  // Adiciona nova medida para a parte selecionada
  const addMeasure = () => {
    if (!selectedPart || !measure) return
    const entry = { value: measure, date: measureDate }
    setMeasures(prev => ({
      ...prev,
      [selectedPart]: prev[selectedPart] ? [entry, ...prev[selectedPart]] : [entry]
    }))
    setMeasure("")
    setMeasureDate(new Date().toISOString().split("T")[0])
  }

  // Exclui medida específica (por índice)
  const deleteMeasureEntry = (part: string, idx: number) => {
    setMeasures(prev => {
      const updated = { ...prev }
      updated[part] = updated[part].filter((_, i) => i !== idx)
      if (updated[part].length === 0) delete updated[part]
      return updated
    })
  }

  // Edita medida específica
  const saveMeasureEdit = () => {
    if (!selectedPart || editMeasureIdx === null || !editMeasureValue || !editMeasureDate) return
    setMeasures(prev => {
      const updated = { ...prev }
      updated[selectedPart][editMeasureIdx] = {
        value: editMeasureValue,
        date: editMeasureDate
      }
      return updated
    })
    setEditMeasureIdx(null)
    setEditMeasureValue("")
    setEditMeasureDate("")
  }

  // ---------------- UI ----------------
  const [tab, setTab] = useState("peso")

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8 bg-neutral-950 min-h-screen text-white transition-colors">
      {/* Header com botão de tema */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-[#06b6d4] drop-shadow-lg"> Acadimia</h1>
        <ThemeToggle />
      </div>

      {/* Tabs */}
      <div className="flex gap-4 justify-center">
        {[
          { key: "peso", label: "Peso", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="17" r="2" fill="currentColor"/><circle cx="9" cy="11" r="2" fill="currentColor"/><circle cx="13" cy="15" r="2" fill="currentColor"/><circle cx="21" cy="7" r="2" fill="currentColor"/></svg> },
          { key: "medidas", label: "Medidas", icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="10" rx="3" stroke="currentColor" strokeWidth="2.5"/><path d="M7 7v10" stroke="currentColor" strokeWidth="2.5"/><path d="M17 7v10" stroke="currentColor" strokeWidth="2.5"/></svg> }
        ].map((tabItem) => (
          <button
            key={tabItem.key}
            className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-bold text-lg shadow-lg transition-all border-2 ${
              tab === tabItem.key
                ? "bg-[#06b6d4] text-black border-[#06b6d4] scale-105 shadow-cyan-500/30"
                : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:border-[#06b6d4] hover:text-[#06b6d4]"
            }`}
            onClick={() => setTab(tabItem.key)}
          >
            <span className={tab === tabItem.key ? "text-black" : "text-[#06b6d4]"}>{tabItem.icon}</span>
            <span>{tabItem.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      {tab === "peso" && (
        <div className="space-y-8">
          {/* Adicionar peso */}
          <div className="flex flex-col sm:flex-row gap-3 items-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-5 rounded-2xl shadow-xl border border-zinc-700/60">
            <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1">
          <input
            type="number"
            placeholder="Peso (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-neutral-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] transition"
            min="0"
            step="0.1"
            inputMode="decimal"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">kg</span>
              </div>
              <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-3 rounded-lg bg-neutral-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] transition"
            max={new Date().toISOString().split("T")[0]}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs pointer-events-none hidden sm:block">Data</span>
              </div>
            </div>
            <button
              onClick={addWeight}
              className="flex items-center gap-2 bg-[#06b6d4] text-black font-bold px-6 py-3 rounded-lg hover:opacity-90 hover:scale-105 transition shadow-lg active:scale-100"
              disabled={!weight}
            >
              <span className="hidden sm:inline">Adicionar</span>
              <span className="sm:hidden text-lg">+</span>
            </button>
          </div>

            {/* Gráfico Moderno */}
            <div className="h-64 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl shadow-2xl p-4 flex flex-col justify-between border border-zinc-700/60 relative">
              <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-[#06b6d4] flex items-center gap-2">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="3" cy="17" r="2" fill="#06b6d4"/><circle cx="9" cy="11" r="2" fill="#06b6d4"/><circle cx="13" cy="15" r="2" fill="#06b6d4"/><circle cx="21" cy="7" r="2" fill="#06b6d4"/></svg>
                Evolução do Peso
              </span>
              <span className="text-xs text-zinc-400">
                {weights.length > 0
                ? `Última: ${(() => {
                  const [y, m, d] = weights[0].date.split("-")
                  return `${d}/${m}/${y.slice(-2)}`
                })()}`
                : "Sem dados"}
              </span>
              </div>
              <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={weights.slice().reverse()}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                dataKey="date"
                stroke="#aaa"
                tick={{ fontSize: 12, fill: "#aaa" }}
                tickFormatter={(date: string) => {
                  const [year, month, day] = date.split("-")
                  return `${day}/${month}`
                }}
                axisLine={false}
                tickLine={false}
                />
                <YAxis
                stroke="#aaa"
                tick={{ fontSize: 12, fill: "#aaa" }}
                axisLine={false}
                tickLine={false}
                width={40}
                // Ajuste automático do domínio para destacar variações pequenas
                domain={weights.length > 0
                  ? [
                    Math.floor(
                    Math.min(...weights.map(w => w.value)) - 1
                    ),
                    Math.ceil(
                    Math.max(...weights.map(w => w.value)) + 0
                    )
                  ]
                  : [0, 100]
                }
                />
                <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #06b6d4",
                  borderRadius: 12,
                  color: "#fff",
                }}
                labelStyle={{ color: "#06b6d4", fontWeight: 700 }}
                labelFormatter={(date: string) => {
                  const [year, month, day] = date.split("-")
                  return `Data: ${day}/${month}/${year}`
                }}
                formatter={(value: number) => [`${value} kg`, "Peso"]}
                />
                <Line
                type="monotone"
                dataKey="value"
                name="Peso"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "url(#weightGradient)" }}
                fill="url(#weightGradient)"
                />
              </LineChart>
              </ResponsiveContainer>
              {weights.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-zinc-500 text-base">Adicione seu peso para ver o gráfico</span>
              </div>
              )}
            </div>
            

          {/* Histórico */}
            <div className="space-y-3">
            {weights.map((entry, index) => (
              <div
              key={index}
              className="flex justify-between items-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-4 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all border border-zinc-700/60"
              >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-start">
                <span className="text-xs text-zinc-400 font-semibold tracking-wide">
                  {(() => {
                  const [year, month, day] = entry.date.split("-")
                  return `${day}/${month}/${year.slice(-2)}`
                  })()}
                </span>
                <span className="text-2xl font-bold text-[#06b6d4] drop-shadow-sm">
                  {entry.value}
                  <span className="text-base font-medium text-zinc-400 ml-1">kg</span>
                </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                onClick={() => deleteWeight(index)}
                className="rounded-full p-2 bg-zinc-900 hover:bg-red-500/20 transition text-red-400 hover:text-red-600 shadow"
                aria-label="Excluir"
                >
                <Trash size={20} />
                </button>
                <button
                className="rounded-full p-2 bg-zinc-900 hover:bg-cyan-500/20 transition text-[#06b6d4] hover:text-cyan-400 shadow"
                onClick={() => { setEditIndex(index); setWeight(entry.value); setDate(entry.date) }}
                aria-label="Editar"
                >
                <Pencil size={20} />
                </button>
              </div>
              </div>
            ))}
            </div>
        </div>
      )}

      {tab === "medidas" && (
        <div className="space-y-8">
          {/* Boneco SVG */}
          <div className="flex justify-center">
        <div className="relative group">
          <svg width="220" height="440" viewBox="0 0 200 420" className="cursor-pointer drop-shadow-xl transition-all duration-300">
            {/* Glow highlight */}
            <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
            </defs>
            {/* Cabeça */}
            <circle
          cx="100" cy="40" r="25"
          fill={selectedPart==="Cabeça"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Cabeça"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Cabeça"?4:2}
          filter={selectedPart==="Cabeça"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Cabeça")}
          className="transition-all duration-200"
            />
            {/* Peito */}
            <rect
          x="70" y="70" width="60" height="50" rx="12"
          fill={selectedPart==="Peito"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Peito"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Peito"?4:2}
          filter={selectedPart==="Peito"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Peito")}
          className="transition-all duration-200"
            />
            {/* Tronco */}
            <rect
          x="70" y="120" width="60" height="100" rx="16"
          fill={selectedPart==="Tronco"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Tronco"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Tronco"?4:2}
          filter={selectedPart==="Tronco"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Tronco")}
          className="transition-all duration-200"
            />
            {/* Braços */}
            <rect
          x="40" y="70" width="25" height="80" rx="14"
          fill={selectedPart==="Braço esquerdo"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Braço esquerdo"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Braço esquerdo"?4:2}
          filter={selectedPart==="Braço esquerdo"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Braço esquerdo")}
          className="transition-all duration-200"
            />
            <rect
          x="135" y="70" width="25" height="80" rx="14"
          fill={selectedPart==="Braço direito"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Braço direito"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Braço direito"?4:2}
          filter={selectedPart==="Braço direito"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Braço direito")}
          className="transition-all duration-200"
            />
            {/* Antebraços */}
            <rect
          x="40" y="150" width="25" height="60" rx="12"
          fill={selectedPart==="Antebraço esquerdo"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Antebraço esquerdo"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Antebraço esquerdo"?4:2}
          filter={selectedPart==="Antebraço esquerdo"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Antebraço esquerdo")}
          className="transition-all duration-200"
            />
            <rect
          x="135" y="150" width="25" height="60" rx="12"
          fill={selectedPart==="Antebraço direito"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Antebraço direito"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Antebraço direito"?4:2}
          filter={selectedPart==="Antebraço direito"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Antebraço direito")}
          className="transition-all duration-200"
            />
            {/* Coxas */}
            <rect
          x="75" y="220" width="25" height="100" rx="14"
          fill={selectedPart==="Coxa esquerda"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Coxa esquerda"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Coxa esquerda"?4:2}
          filter={selectedPart==="Coxa esquerda"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Coxa esquerda")}
          className="transition-all duration-200"
            />
            <rect
          x="100" y="220" width="25" height="100" rx="14"
          fill={selectedPart==="Coxa direita"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Coxa direita"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Coxa direita"?4:2}
          filter={selectedPart==="Coxa direita"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Coxa direita")}
          className="transition-all duration-200"
            />
            {/* Panturrilhas */}
            <rect
          x="75" y="320" width="25" height="70" rx="12"
          fill={selectedPart==="Panturrilha esquerda"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Panturrilha esquerda"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Panturrilha esquerda"?4:2}
          filter={selectedPart==="Panturrilha esquerda"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Panturrilha esquerda")}
          className="transition-all duration-200"
            />
            <rect
          x="100" y="320" width="25" height="70" rx="12"
          fill={selectedPart==="Panturrilha direita"?"#06b6d4":"#23272e"}
          stroke={selectedPart==="Panturrilha direita"?"#06b6d4":"#374151"}
          strokeWidth={selectedPart==="Panturrilha direita"?4:2}
          filter={selectedPart==="Panturrilha direita"?"url(#glow)":undefined}
          onClick={() => setSelectedPart("Panturrilha direita")}
          className="transition-all duration-200"
            />
          </svg>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#06b6d4] text-lg font-bold min-w-[120px] text-center pointer-events-none select-none drop-shadow-lg">
            {selectedPart ? selectedPart : "Selecione uma parte"}
          </div>
        </div>
          </div>

          {/* Formulário medida */}
          <div className="flex flex-col sm:flex-row gap-3 items-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-5 rounded-2xl shadow-xl border border-zinc-700/60">
            <input
              type="number"
              placeholder={`Medida de ${selectedPart || "parte"} (cm)`}
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] transition"
              min="0"
              step="0.1"
              inputMode="decimal"
              disabled={!selectedPart}
            />
            <input
              type="date"
              value={measureDate}
              onChange={(e) => setMeasureDate(e.target.value)}
              className="px-4 py-3 rounded-lg bg-neutral-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] transition"
              max={new Date().toISOString().split("T")[0]}
              disabled={!selectedPart}
            />
            <button
              onClick={addMeasure}
              className={`flex items-center gap-2 bg-[#06b6d4] text-black font-bold px-6 py-3 rounded-lg hover:opacity-90 hover:scale-105 transition shadow-lg active:scale-100 ${!selectedPart || !measure ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={!selectedPart || !measure}
            >
              <span className="hidden sm:inline">Salvar</span>
              <span className="sm:hidden text-lg">+</span>
            </button>
          </div>

          {/* Histórico medidas */}
          <div className="space-y-3">
            {!selectedPart && (
              <div className="flex items-center justify-center text-zinc-500 text-base py-8">
                Selecione uma parte do corpo para ver o histórico.
              </div>
            )}
            {selectedPart && (!measures[selectedPart] || measures[selectedPart].length === 0) && (
              <div className="flex items-center justify-center text-zinc-500 text-base py-8">
                Nenhuma medida cadastrada para {selectedPart}.
              </div>
            )}
            {selectedPart && measures[selectedPart] && measures[selectedPart].map((entry, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-4 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all border border-zinc-700/60"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400 font-semibold tracking-wide">
                    {(() => {
                      const [year, month, day] = entry.date.split("-")
                      return `${day}/${month}/${year.slice(-2)}`
                    })()}
                  </span>
                  <span className="text-2xl font-bold text-[#06b6d4] drop-shadow-sm">
                    {entry.value}
                    <span className="text-base font-medium text-zinc-400 ml-1">cm</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteMeasureEntry(selectedPart, idx)}
                    className="rounded-full p-2 bg-zinc-900 hover:bg-red-500/20 transition text-red-400 hover:text-red-600 shadow"
                    aria-label="Excluir"
                  >
                    <Trash size={20} />
                  </button>
                  <button
                    className="rounded-full p-2 bg-zinc-900 hover:bg-cyan-500/20 transition text-[#06b6d4] hover:text-cyan-400 shadow"
                    onClick={() => {
                      setEditMeasureIdx(idx)
                      setEditMeasureValue(entry.value)
                      setEditMeasureDate(entry.date)
                    }}
                    aria-label="Editar"
                  >
                    <Pencil size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de edição de peso */}
      {editIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-80 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setEditIndex(null)}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#06b6d4]">Editar Peso</h2>
            <input
              type="number"
              placeholder="Peso (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 mb-3"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 mb-3"
            />
            <button
              onClick={saveEdit}
              className="bg-[#06b6d4] w-full text-black font-bold px-4 py-2 rounded-lg hover:opacity-80 transition"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}

      {/* Modal de edição de medida */}
      {editMeasureIdx !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-80 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={() => setEditMeasureIdx(null)}>
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#06b6d4]">Editar Medida</h2>
            <input
              type="number"
              placeholder="Valor (cm)"
              value={editMeasureValue}
              onChange={(e) => setEditMeasureValue(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 mb-3"
            />
            <input
              type="date"
              value={editMeasureDate}
              onChange={(e) => setEditMeasureDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 mb-3"
            />
            <button
              onClick={saveMeasureEdit}
              className="bg-[#06b6d4] w-full text-black font-bold px-4 py-2 rounded-lg hover:opacity-80 transition"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
