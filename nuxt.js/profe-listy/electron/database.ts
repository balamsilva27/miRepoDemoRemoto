import path from 'path'
import fs from 'fs'
import { app } from 'electron'

interface Group {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

interface Student {
  id: number
  name: string
  email: string | null
  group_id: number | null
  group_name: string | null | undefined
  created_at: string
  updated_at: string
}

interface Attendance {
  id: number
  student_id: number
  date: string
  status: 'present' | 'absent' | 'late'
  created_at: string
}

interface Database {
  groups: Group[]
  students: Student[]
  attendances: Attendance[]
  nextGroupId: number
  nextStudentId: number
  nextAttendanceId: number
}

let db: Database = {
  groups: [],
  students: [],
  attendances: [],
  nextGroupId: 1,
  nextStudentId: 1,
  nextAttendanceId: 1
}

function getDbPath(): string {
  return path.join(app.getPath('userData'), 'attendance-data.json')
}

export async function initDatabase(): Promise<void> {
  const dbPath = getDbPath()

  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf-8')
    db = JSON.parse(data)
  } else {
    saveDatabase()
  }

  console.log('Database initialized successfully')
}

export function saveDatabase(): void {
  const dbPath = getDbPath()
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8')
}

export function getDatabase(): Database {
  return db
}

export function getGroups(): Group[] {
  return db.groups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function createGroup(name: string, description?: string): Group {
  const now = new Date().toISOString()
  const group: Group = {
    id: db.nextGroupId++,
    name,
    description: description || null,
    created_at: now,
    updated_at: now
  }
  db.groups.push(group)
  saveDatabase()
  return group
}

export function updateGroup(id: number, name: string, description?: string): boolean {
  const group = db.groups.find(g => g.id === id)
  if (!group) return false
  group.name = name
  group.description = description || null
  group.updated_at = new Date().toISOString()
  saveDatabase()
  return true
}

export function deleteGroup(id: number): boolean {
  const index = db.groups.findIndex(g => g.id === id)
  if (index === -1) return false
  db.groups.splice(index, 1)
  db.students = db.students.filter(s => s.group_id !== id)
  db.attendances = db.attendances.filter(a => {
    const student = db.students.find(s => s.id === a.student_id)
    return student !== undefined
  })
  saveDatabase()
  return true
}

export function getStudents(groupId?: number): (Student & { group_name: string | null | undefined })[] {
  let students = db.students.map(s => {
    const group = db.groups.find(g => g.id === s.group_id)
    return { ...s, group_name: group?.name || null }
  })

  if (groupId) {
    students = students.filter(s => s.group_id === groupId)
  }

  return students.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function createStudent(name: string, email?: string, group_id?: number): Student {
  const now = new Date().toISOString()
  const student = {
    id: db.nextStudentId++,
    name,
    email: email || null,
    group_id: group_id || null,
    group_name: undefined as string | null | undefined,
    created_at: now,
    updated_at: now
  }
  db.students.push(student)
  saveDatabase()
  return student
}

export function updateStudent(id: number, name: string, email?: string, group_id?: number): boolean {
  const student = db.students.find(s => s.id === id)
  if (!student) return false
  student.name = name
  student.email = email || null
  student.group_id = group_id || null
  student.updated_at = new Date().toISOString()
  saveDatabase()
  return true
}

export function deleteStudent(id: number): boolean {
  const index = db.students.findIndex(s => s.id === id)
  if (index === -1) return false
  db.students.splice(index, 1)
  db.attendances = db.attendances.filter(a => a.student_id !== id)
  saveDatabase()
  return true
}

export function getAttendancesByGroupDate(groupId: number, date: string): (Attendance & { student_name: string })[] {
  return db.attendances
    .filter(a => {
      const student = db.students.find(s => s.id === a.student_id)
      return student?.group_id === groupId && a.date === date
    })
    .map(a => {
      const student = db.students.find(s => s.id === a.student_id)!
      return { ...a, student_name: student.name }
    })
}

export function saveAttendanceBatch(records: { student_id: number; date: string; status: string }[]): void {
  for (const record of records) {
    const existing = db.attendances.find(
      a => a.student_id === record.student_id && a.date === record.date
    )
    if (existing) {
      existing.status = record.status as 'present' | 'absent' | 'late'
    } else {
      db.attendances.push({
        id: db.nextAttendanceId++,
        student_id: record.student_id,
        date: record.date,
        status: record.status as 'present' | 'absent' | 'late',
        created_at: new Date().toISOString()
      })
    }
  }
  saveDatabase()
}

export function getStats(): { groups: any[]; totals: any } {
  const groupsData = db.groups.map(g => {
    const groupStudents = db.students.filter(s => s.group_id === g.id)
    const studentIds = groupStudents.map(s => s.id)
    const groupAttendances = db.attendances.filter(a => studentIds.includes(a.student_id))

    return {
      id: g.id,
      name: g.name,
      student_count: groupStudents.length,
      present_count: groupAttendances.filter(a => a.status === 'present' || a.status === 'late').length,
      total_records: groupAttendances.length
    }
  })

  const totals = {
    total_groups: db.groups.length,
    total_students: db.students.length,
    present_count: db.attendances.filter(a => a.status === 'present' || a.status === 'late').length,
    total_records: db.attendances.length
  }

  return { groups: groupsData, totals }
}