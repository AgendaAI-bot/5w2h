import { sbFetch } from './supabase'
import { dk } from '../utils/dateUtils'

export async function getExecucoesByWeek(from, to, token) {
  const data = await sbFetch(
    `/rest/v1/tarefas_execucao?data=gte.${from}&data=lte.${to}&order=created_at.asc&select=*,tarefas_template(titulo,empresa_id,projeto_id,tipo_atividade_id,recorrencia_tipo,data_pontual,ativo,empresas(nome,cor),projetos(nome),tipos_atividade(nome))`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function getTemplatesRecorrentes(grupoId, token) {
  const data = await sbFetch(
    `/rest/v1/tarefas_template?grupo_id=eq.${grupoId}&recorrencia_tipo=neq.nenhuma&ativo=eq.true`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function toggleExecucao(id, currentStatus, token) {
  const next = currentStatus === 'concluido' ? 'pendente' : 'concluido'
  await sbFetch(
    `/rest/v1/tarefas_execucao?id=eq.${id}`,
    { method: 'PATCH', body: JSON.stringify({ status: next }) },
    token
  )
  return next
}

export async function createTarefaComExecucao(
  { grupo_id, empresa_id, projeto_id, criado_por, usuario_id, titulo, tipo_atividade_id,
    observacao, recorrencia_tipo, data_pontual },
  token
) {
  const tmplBody = {
    grupo_id, empresa_id, projeto_id, criado_por,
    usuario_responsavel_id: usuario_id,
    titulo, tipo: recorrencia_tipo !== 'nenhuma' ? 'recorrente' : 'pontual',
    tipo_atividade_id, observacao,
    recorrencia_tipo: recorrencia_tipo || 'nenhuma',
    recorrente: recorrencia_tipo !== 'nenhuma',
    data_pontual,
    ativo: true,
  }
  const tmplData = await sbFetch('/rest/v1/tarefas_template', { method: 'POST', body: JSON.stringify(tmplBody) }, token)
  const tmpl = Array.isArray(tmplData) ? tmplData[0] : tmplData
  if (!tmpl?.id) throw new Error('Erro ao criar template')

  // Create the first execution on the launch date
  await sbFetch(
    '/rest/v1/tarefas_execucao',
    {
      method: 'POST',
      body: JSON.stringify({
        template_id: tmpl.id, projeto_id, usuario_id,
        empresa_id, grupo_id, data: data_pontual, status: 'pendente',
      }),
    },
    token
  )
  return tmpl
}

// Generates missing executions for recurring templates within a date range (a week)
export async function gerarExecucoesRecorrentes(grupoId, weekDates, token) {
  const templates = await getTemplatesRecorrentes(grupoId, token)
  if (!templates.length) return

  const from = dk(weekDates[0])
  const to = dk(weekDates[weekDates.length - 1])

  // Get existing executions in this range to avoid duplicates
  const existing = await sbFetch(
    `/rest/v1/tarefas_execucao?data=gte.${from}&data=lte.${to}&select=template_id,data`,
    {},
    token
  )
  const existingSet = new Set((existing || []).map(e => `${e.template_id}_${e.data}`))

  for (const tmpl of templates) {
    if (!tmpl.data_pontual) continue
    const baseDate = new Date(tmpl.data_pontual + 'T00:00:00')

    for (const weekDate of weekDates) {
      let matches = false

      if (tmpl.recorrencia_tipo === 'semanal') {
        matches = weekDate.getDay() === baseDate.getDay() && weekDate >= baseDate
      } else if (tmpl.recorrencia_tipo === 'mensal') {
        matches = weekDate.getDate() === baseDate.getDate() && weekDate >= baseDate
      }

      if (!matches) continue

      const dateStr = dk(weekDate)
      const key = `${tmpl.id}_${dateStr}`
      if (existingSet.has(key)) continue
      if (dateStr === tmpl.data_pontual) continue // already created on launch

      await sbFetch(
        '/rest/v1/tarefas_execucao',
        {
          method: 'POST',
          body: JSON.stringify({
            template_id: tmpl.id,
            projeto_id: tmpl.projeto_id,
            usuario_id: tmpl.usuario_responsavel_id,
            empresa_id: tmpl.empresa_id,
            grupo_id: grupoId,
            data: dateStr,
            status: 'pendente',
          }),
        },
        token
      )
    }
  }
}

export async function desativarRecorrencia(templateId, token) {
  await sbFetch(
    `/rest/v1/tarefas_template?id=eq.${templateId}`,
    { method: 'PATCH', body: JSON.stringify({ ativo: false, recorrencia_tipo: 'nenhuma' }) },
    token
  )
}

export async function excluirTarefaCompleta(templateId, token) {
  // Deletes the template; executions cascade via FK
  await sbFetch(`/rest/v1/tarefas_template?id=eq.${templateId}`, { method: 'DELETE' }, token)
}

export async function updateTemplate(templateId, body, token) {
  await sbFetch(`/rest/v1/tarefas_template?id=eq.${templateId}`, { method: 'PATCH', body: JSON.stringify(body) }, token)
}

export async function syncComoToCalendar({ grupo_id, empresa_id, projeto_id, criado_por, responsavel_id, texto, data_prazo }, token) {
  const tmplBody = {
    grupo_id, empresa_id, projeto_id, criado_por,
    usuario_responsavel_id: responsavel_id,
    titulo: texto, tipo: 'pontual', recorrencia_tipo: 'nenhuma', data_pontual: data_prazo, ativo: true,
  }
  const tmplData = await sbFetch('/rest/v1/tarefas_template', { method: 'POST', body: JSON.stringify(tmplBody) }, token)
  const tmpl = Array.isArray(tmplData) ? tmplData[0] : tmplData
  if (!tmpl?.id) return

  await sbFetch(
    '/rest/v1/tarefas_execucao',
    {
      method: 'POST',
      body: JSON.stringify({
        template_id: tmpl.id, projeto_id,
        usuario_id: responsavel_id, empresa_id,
        grupo_id, data: data_prazo, status: 'pendente',
      }),
    },
    token
  )
}
