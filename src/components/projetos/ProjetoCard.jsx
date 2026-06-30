import { calcPct, countAtrasadas, projetoCardStatus, formatMetaValue } from '../../utils/calcUtils'
import { diasRestantes } from '../../utils/dateUtils'
import { ProgressBar } from '../ui/ProgressBar'
import { MetaItem } from './MetaItem'
import styles from './ProjetoCard.module.css'

export function ProjetoCard({ projeto, comos, metas, onClick }) {
  const emp = projeto.empresas || null
  const empCor = emp?.cor || 'var(--purple)'
  const empNome = emp?.nome || ''
  const pct = calcPct(comos)
  const total = comos.length
  const done = comos.filter(c => c.status === 'concluido').length
  const atrasadas = countAtrasadas(comos)
  const dias = diasRestantes(projeto.data_fim)
  const statusClass = projetoCardStatus(comos, projeto.data_fim)

  const diasLabel = dias === null ? null
    : dias < 0 ? `${Math.abs(dias)} dias atrasado`
    : `${dias} dias restantes`
  const diasClass = dias === null ? '' : dias < 0 ? styles.ddanger : dias <= 7 ? styles.dwarn : styles.dok

  return (
    <div className={`${styles.card} ${styles[statusClass]}`} onClick={onClick}>
      <div className={styles.header}>
        <div className={styles.cor} style={{ background: projeto.cor || 'var(--purple)' }} />
        <span className={styles.nome}>{projeto.nome}</span>
        <span className={`${styles.sbadge} ${styles['psb' + (projeto.status || 'ativo')]}`}>
          {projeto.status || 'ativo'}
        </span>
      </div>

      <div className={styles.metaRow}>
        {empNome && (
          <span className={styles.emp} style={{ background: empCor + '22', color: empCor }}>
            {empNome}
          </span>
        )}
        {projeto.data_fim && (
          <span className={styles.prazo}>Prazo: {projeto.data_fim}</span>
        )}
        {diasLabel && (
          <span className={`${styles.dias} ${diasClass}`}>{diasLabel}</span>
        )}
      </div>

      <div className={styles.progWrap}>
        <ProgressBar pct={pct} showLabel count={`${done} de ${total} atividades`} />
      </div>

      <div className={`${styles.atraso} ${atrasadas > 0 ? styles.hlate : styles.nlate}`}>
        {atrasadas > 0
          ? `⚠ ${atrasadas} de ${total} atrasadas`
          : '✓ Sem atrasos'}
      </div>

      {metas.length > 0 && (
        <>
          <hr className={styles.divider} />
          <div className={styles.metas}>
            {metas.map(m => <MetaItem key={m.id} meta={m} />)}
          </div>
        </>
      )}
    </div>
  )
}
