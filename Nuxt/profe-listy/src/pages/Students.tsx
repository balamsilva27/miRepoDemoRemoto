import { useState, useEffect } from 'react'
import type { Student, Group } from '../types'
import './Pages.css'

function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [filterGroupId, setFilterGroupId] = useState<number | undefined>()
  const [formData, setFormData] = useState({ name: '', email: '', group_id: 0 })

  useEffect(() => {
    loadGroups()
    loadStudents()
  }, [filterGroupId])

  const loadGroups = async () => {
    const data = await window.electronAPI.groups.getAll()
    setGroups(data)
  }

  const loadStudents = async () => {
    setLoading(true)
    try {
      const data = await window.electronAPI.students.getAll(filterGroupId)
      setStudents(data)
    } catch (error) {
      console.error('Failed to load students:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingStudent) {
        await window.electronAPI.students.update({ id: editingStudent.id, ...formData })
      } else {
        await window.electronAPI.students.create(formData)
      }
      setShowModal(false)
      setEditingStudent(null)
      setFormData({ name: '', email: '', group_id: 0 })
      loadStudents()
    } catch (error) {
      console.error('Failed to save student:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este alumno?')) {
      try {
        await window.electronAPI.students.delete(id)
        loadStudents()
      } catch (error) {
        console.error('Failed to delete student:', error)
      }
    }
  }

  const openEditModal = (student: Student) => {
    setEditingStudent(student)
    setFormData({ name: student.name, email: student.email || '', group_id: student.group_id })
    setShowModal(true)
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Alumnos</h1>
        <button className="btn btn-primary" onClick={() => { setEditingStudent(null); setFormData({ name: '', email: '', group_id: groups[0]?.id || 0 }); setShowModal(true) }}>
          + Agregar Alumno
        </button>
      </div>

      <div className="filters">
        <label>Filtrar por grupo:</label>
        <select value={filterGroupId || ''} onChange={e => setFilterGroupId(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">Todos los grupos</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Grupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email || '-'}</td>
                <td>{student.group_name || '-'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEditModal(student)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p className="empty">No hay alumnos registrados</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingStudent ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
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
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Grupo</label>
                <select
                  value={formData.group_id}
                  onChange={e => setFormData({ ...formData, group_id: Number(e.target.value) })}
                  required
                >
                  <option value={0}>Seleccionar grupo</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
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

export default Students