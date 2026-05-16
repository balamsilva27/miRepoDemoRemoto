export interface Group {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Student {
  id: number
  name: string
  email: string | null
  group_id: number
  group_name?: string
  created_at: string
  updated_at: string
}

export type AttendanceStatus = 'present' | 'absent' | 'late'

export interface Attendance {
  id: number
  student_id: number
  student_name?: string
  date: string
  status: AttendanceStatus
  created_at: string
}

export interface AttendanceRecord {
  student_id: number
  date: string
  status: string
}

export interface GroupStats {
  id: number
  name: string
  student_count: number
  present_count: number
  total_records: number
}

export interface TotalStats {
  total_groups: number
  total_students: number
  present_count: number
  total_records: number
}

declare global {
  interface Window {
    electronAPI: {
      groups: {
        getAll: () => Promise<Group[]>
        create: (data: { name: string; description?: string }) => Promise<any>
        update: (data: { id: number; name: string; description?: string }) => Promise<any>
        delete: (id: number) => Promise<any>
      }
      students: {
        getAll: (groupId?: number) => Promise<Student[]>
        create: (data: { name: string; email?: string; group_id: number }) => Promise<any>
        update: (data: { id: number; name: string; email?: string; group_id: number }) => Promise<any>
        delete: (id: number) => Promise<any>
      }
      attendance: {
        getByGroupDate: (groupId: number, date: string) => Promise<Attendance[]>
        save: (data: { student_id: number; date: string; status: string }) => Promise<any>
        saveBatch: (records: AttendanceRecord[]) => Promise<any>
        getStats: () => Promise<{ groups: GroupStats[]; totals: TotalStats }>
      }
    }
  }
}

export {}