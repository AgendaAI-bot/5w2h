import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useWeek } from '../hooks/useWeek'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { WeekBoard } from '../components/planejador/WeekBoard'
import { TarefaModal } from '../components/planejador/TarefaModal'
import { Toast } from '../components/ui/Toast'
import { Spinner } from '../components/ui/Spinner'
import { getExecucoesByWeek, toggleExecucao, createTarefaComExecucao } from '../services/tarefaService'
import { getProjetos } from '../services/projetoService'
import { canManage } from '../utils/calcUtils'

export function PlanejadorPage({ dates, onStatsChange }) {
  const { token, user, profile } = useAuth()
  const { usuarios, selectedEmpresa, filteredUsers } = useApp()
  const { from, to } = useWeek()
  const { toast, showToast } = useToast()
  const tarefaModal = useModal()

  const [execucoes, setExecucoes] = useState([])
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  const loadBoard = useCallback(async () => {
    setLoading(true)
    try {
      const [execs, projs] = await Promise.all([
        getExecucoesByWeek(from, to, token),
        getProjetos(token),
      ])
      setExecucoes(execs)
      setProjetos(projs)
      const done = execs.filter(e => e.status === 'concluido').length
      const pct = execs.length > 0 ? Math.round((done / execs.length) * 100) : 0
      onStatsChange?.({ total: execs.length, pct })
    } catch (e) {
      showToast('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }, [from, to, token])

  useEffect(() => { loadBoard() }, [loadBoard])

  async function handleToggle(id, status) {
    try {
      const next = await toggleExecucao(id, status, token)
      setExecucoes(prev => prev.map(e => e.id === id ? { ...e, status: next } : e))
      showToast(next === 'concluido' ? 'Concluida!' : 'Reaberta', next === 'concluido')
      const updated = execucoes.map(e => e.id === id ? { ...e, status: next } : e)
      const done = updated.filter(e => e.status === 'concluido').length
      const pct = updated.length > 0 ? Math.round((done / updated.length) * 100) : 0
      onStatsChange?.({ total: updated.length, pct })
    } catch (e) {
      showToast('Erro ao atualizar')
    }
  }

  function handleOpenAdd(dateStr) {
    setSelectedDate(dateStr)
    tarefaModal.open()
  }

  async function handleSaveTarefa(payload) {
    await createTarefaComExecucao({
      ...payload,
      grupo_id: profile.grupo_id,
      criado_por: user.id,
    }, token)
    showToast('Tarefa criada!', true)
    await loadBoard()
  }

  return (
    <main>
      {loading
        ? <Spinner />
        : (
          <WeekBoard
            dates={dates}
            execucoes={execucoes}
            usuarios={usuarios}
            currentUserId={user?.id}
            canSeeAll={canManage(profile?.role)}
            canAdd={canManage(profile?.role)}
            selectedEmpresa={selectedEmpresa}
            filteredUsers={filteredUsers}
            onToggle={handleToggle}
            onAdd={handleOpenAdd}
          />
        )
      }

      <TarefaModal
        isOpen={tarefaModal.isOpen}
        onClose={tarefaModal.close}
        dateStr={selectedDate}
        projetos={projetos}
        weekDates={dates}
        onSave={handleSaveTarefa}
      />

      <Toast {...toast} />
    </main>
  )
}
