import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  groups: {
    getAll: () => ipcRenderer.invoke('groups:get-all'),
    create: (data: { name: string; description?: string }) => ipcRenderer.invoke('groups:create', data),
    update: (data: { id: number; name: string; description?: string }) => ipcRenderer.invoke('groups:update', data),
    delete: (id: number) => ipcRenderer.invoke('groups:delete', id)
  },
  students: {
    getAll: (groupId?: number) => ipcRenderer.invoke('students:get-all', groupId),
    create: (data: { name: string; email?: string; group_id: number }) => ipcRenderer.invoke('students:create', data),
    update: (data: { id: number; name: string; email?: string; group_id: number }) => ipcRenderer.invoke('students:update', data),
    delete: (id: number) => ipcRenderer.invoke('students:delete', id)
  },
  attendance: {
    getByGroupDate: (groupId: number, date: string) => ipcRenderer.invoke('attendance:get-by-group-date', groupId, date),
    save: (data: { student_id: number; date: string; status: string }) => ipcRenderer.invoke('attendance:save', data),
    saveBatch: (records: { student_id: number; date: string; status: string }[]) => ipcRenderer.invoke('attendance:save-batch', records),
    getStats: () => ipcRenderer.invoke('attendance:get-stats')
  }
})