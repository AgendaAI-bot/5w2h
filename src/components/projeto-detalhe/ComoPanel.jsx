import { SidePanel } from '../layout/SidePanel'

export function ComoPanel({ isOpen, onClose, como, usuarios, allComos, onSave, onDelete }) {
  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      como={como}
      usuarios={usuarios}
      allComos={allComos}
      onSave={onSave}
      onDelete={onDelete}
    />
  )
}
