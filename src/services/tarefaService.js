import { sbFetch } from './supabase'

export async function getExecucoesByWeek(from, to, token) {
  const data = await sbFetch(
    `/rest/v1/tarefas_execucao?data=gte.${from}&data=lte.${to}&order=created_at.asc&select=*,tarefas_template(titulo,empresa_id,projeto_id,tipo_atividade_id,empresas(nome,cor),projetos(nome),tipos_atividade(nome))`,
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
    observacao, recorrente, dias_semana, data_pontual, datas },
  token
) {
  const tmplBody = {
    grupo_id, empresa_id, projeto_id, criado_por,
    usuario_responsavel_id: usuario_id,
    titulo, tipo: recorrente ? 'recorrente' : 'pontual',
    tipo_atividade_id, observacao, recorrente,
    dias_semana: recorrente ? dias_semana : [],
    data_pontual: recorrente ? null : data_pontual,
    ativo: true,
  }
  const tmplData = await sbFetch('/rest/v1/tarefas_template', { method: 'POST', body: JSON.stringify(tmplBody) }, token)
  const tmpl = Array.isArray(tmplData) ? tmplData[0] : tmplData
  if (!tmpl?.id) throw new Error('Erro ao criar template')

  for (const data of datas) {
    await sbFetch(
      '/rest/v1/tarefas_execucao',
      {
        method: 'POST',
        body: JSON.stringify({
          template_id: tmpl.id, projeto_id, usuario_id,
          empresa_id, grupo_id, data, status: 'pendente',
        }),
      },
      token
    )
  }
  return tmpl
}

export async function syncComoToCalendar({ grupo_id, empresa_id, projeto_id, criado_por, responsavel_id, texto, data_prazo }, token) {
  const tmplBody = {
    grupo_id, empresa_id, projeto_id, criado_por,
    usuario_responsavel_id: responsavel_id,
    titulo: texto, tipo: 'pontual', data_pontual: data_prazo, ativo: true,
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
