import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { GroupStats, TotalStats } from '../types'
import './Pages.css'

function Dashboard() {
  const [groupStats, setGroupStats] = useState<GroupStats[]>([])
  const [totalStats, setTotalStats] = useState<TotalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await window.electronAPI.attendance.getStats()
      setGroupStats(data.groups)
      setTotalStats(data.totals)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
    setLoading(false)
  }

  const getAttendancePercentage = (stats: GroupStats) => {
    if (!stats.total_records || stats.total_records === 0) return 0
    return Math.round((stats.present_count / stats.total_records) * 100)
  }

  const chartData = groupStats.map(g => ({
    name: g.name.length > 15 ? g.name.substring(0, 15) + '...' : g.name,
    porcentaje: getAttendancePercentage(g),
    estudiantes: g.student_count
  }))

  const getBarColor = (porcentaje: number) => {
    if (porcentaje >= 80) return '#22c55e'
    if (porcentaje >= 60) return '#f59e0b'
    return '#ef4444'
  }

  if (loading) return <div className="loading">Cargando...</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalStats?.total_groups || 0}</div>
          <div className="stat-label">Grupos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalStats?.total_students || 0}</div>
          <div className="stat-label">Alumnos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {totalStats?.total_records && totalStats.total_records > 0
              ? Math.round(((totalStats?.present_count || 0) / totalStats.total_records) * 100)
              : 0}%
          </div>
          <div className="stat-label">Asistencia Global</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Porcentaje de Asistencia por Grupo</h2>
        {chartData.length === 0 ? (
          <p className="empty">No hay datos de asistencia</p>
        ) : (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Asistencia']} />
                <Bar dataKey="porcentaje" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.porcentaje)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Detalle por Grupo</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Alumnos</th>
              <th>Registros</th>
              <th>Asistencia</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {groupStats.map(stats => (
              <tr key={stats.id}>
                <td>{stats.name}</td>
                <td>{stats.student_count}</td>
                <td>{stats.total_records}</td>
                <td>{stats.present_count}</td>
                <td>
                  <span className={`badge ${getBarColor(getAttendancePercentage(stats))}`}>
                    {getAttendancePercentage(stats)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {groupStats.length === 0 && <p className="empty">No hay grupos registrados</p>}
      </div>
    </div>
  )
}

export default Dashboard