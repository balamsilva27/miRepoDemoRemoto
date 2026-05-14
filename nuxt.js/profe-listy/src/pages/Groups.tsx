import { useState, useEffect } from 'react'
import type { Group } from '../types'
import './Pages.css'

function Groups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [studentCounts, setStudentCounts] = useState<Record<number, number>>({})

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setLoading(true)
    try {
      const data = await window.electronAPI.groups.getAll()
      setGroups(data)
      const counts: Record<number, number> = {}
      for (const group of data) {
        const students = await window.electronAPI.students.getAll(group.id)
        counts[group.id] = students.length
      }
      setStudentCounts(counts)
    } catch (error) {
      console.error('Failed to load groups:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingGroup) {
        await window.electronAPI.groups.update({ id: editingGroup.id, ...formData })
      } else {
        await window.electronAPI.groups.create(formData)
      }
      setShowModal(false)
      setEditingGroup(null)
      setFormData({ name: '', description: '' })
      loadGroups()
    } catch (error) {
      console.error('Failed to save group:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este grupo?')) {
      try {
        await window.electronAPI.groups.delete(id)
        loadGroups()
      } catch (error) {
        console.error('Failed to delete group:', error)
      }
    }
  }

  const openEditModal = (group: Group) => {
    setEditingGroup(group)
    setFormData({ name: group.name, description: group.description || '' })
    setShowModal(true)
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Grupos</h1>
        <button className="btn btn-primary" onClick={() => { setEditingGroup(null); setFormData({ name: '', description: '' }); setShowModal(true) }}>
          + Agregar Grupo
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Alumnos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <tr key={group.id}>
                <td>{group.name}</td>
                <td>{group.description || '-'}</td>
                <td>{studentCounts[group.id] || 0}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEditModal(group)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(group.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groups.length === 0 && <p className="empty">No hay grupos registrados</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingGroup ? 'Editar Grupo' : 'Nuevo Grupo'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups