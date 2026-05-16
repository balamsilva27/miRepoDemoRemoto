import { useState, useEffect } from 'react'
import type { Group, Student, AttendanceStatus } from '../types'
import './Pages.css'

interface StudentAttendance extends Student {
  status: AttendanceStatus | ''
}

function Attendance() {
  const [groups, setGroups] = useState<Group[]>([])
  const [students, setStudents] = useState<StudentAttendance[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  useEffect(() => {
    if (selectedGroupId) {
      loadStudents()
    }
  }, [selectedGroupId, selectedDate])

  const loadGroups = async () => {
    const data = await window.electronAPI.groups.getAll()
    setGroups(data)
    if (data.length > 0 && !selectedGroupId) {
      setSelectedGroupId(data[0].id)
    }
  }

  const loadStudents = async () => {
    if (!selectedGroupId) return
    setLoading(true)
    try {
      const allStudents = await window.electronAPI.students.getAll(selectedGroupId)
      const existingRecords = await window.electronAPI.attendance.getByGroupDate(selectedGroupId, selectedDate)

      const studentMap: Record<number, string> = {}
      existingRecords.forEach((r: any) => {
        studentMap[r.student_id] = r.status
      })

      setStudents(allStudents.map(s => ({
        ...s,
        status: (studentMap[s.id] as AttendanceStatus) || ''
      })))
    } catch (error) {
      console.error('Failed to load students:', error)
    }
    setLoading(false)
  }

  const setStudentStatus = (studentId: number, status: AttendanceStatus) => {
    setStudents(prev =>
      prev.map(s => s.id === studentId ? { ...s, status } : s)
    )
  }

  const handleSave = async () => {
    const records = students
      .filter(s => s.status)
      .map(s => ({ student_id: s.id, date: selectedDate, status: s.status as string }))

    if (records.length === 0) {
      alert('Marca al menos un alumno')
      return
    }

    setSaving(true)
    try {
      await window.electronAPI.attendance.saveBatch(records)
      alert('Asistencia guardada correctamente')
    } catch (error) {
      console.error('Failed to save attendance:', error)
      alert('Error al guardar asistencia')
    }
    setSaving(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#22c55e'
      case 'absent': return '#ef4444'
      case 'late': return '#f59e0b'
      default: return '#e2e8f0'
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tomar Asistencia</h1>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Grupo:</label>
          <select value={selectedGroupId || ''} onChange={e => setSelectedGroupId(Number(e.target.value))}>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Fecha:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <>
          <div className="card">
            {students.length === 0 ? (
              <p className="empty">No hay alumnos en este grupo</p>
            ) : (
              <div className="attendance-list">
                {students.map(student => (
                  <div key={student.id} className="attendance-item">
                    <span className="student-name">{student.name}</span>
                    <div className="status-buttons">
                      <button
                        type="button"
                        className={`status-btn present ${student.status === 'present' ? 'active' : ''}`}
                        style={{ backgroundColor: student.status === 'present' ? '#22c55e' : getStatusColor('present') }}
                        onClick={() => setStudentStatus(student.id, 'present')}
                      >
                        Presente
                      </button>
                      <button
                        type="button"
                        className={`status-btn absent ${student.status === 'absent' ? 'active' : ''}`}
                        style={{ backgroundColor: student.status === 'absent' ? '#ef4444' : getStatusColor('absent') }}
                        onClick={() => setStudentStatus(student.id, 'absent')}
                      >
                        Ausente
                      </button>
                      <button
                        type="button"
                        className={`status-btn late ${student.status === 'late' ? 'active' : ''}`}
                        style={{ backgroundColor: student.status === 'late' ? '#f59e0b' : getStatusColor('late') }}
                        onClick={() => setStudentStatus(student.id, 'late')}
                      >
                        Tarde
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {students.length > 0 && (
            <button className="btn btn-primary btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Asistencia'}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Attendance