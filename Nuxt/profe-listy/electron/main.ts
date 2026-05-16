import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import * as db from './database'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(async () => {
  await db.initDatabase()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('groups:get-all', async () => {
  return db.getGroups()
})

ipcMain.handle('groups:create', async (_, data: { name: string; description?: string }) => {
  return db.createGroup(data.name, data.description)
})

ipcMain.handle('groups:update', async (_, data: { id: number; name: string; description?: string }) => {
  db.updateGroup(data.id, data.name, data.description)
  return { success: true }
})

ipcMain.handle('groups:delete', async (_, id: number) => {
  db.deleteGroup(id)
  return { success: true }
})

ipcMain.handle('students:get-all', async (_, groupId?: number) => {
  return db.getStudents(groupId)
})

ipcMain.handle('students:create', async (_, data: { name: string; email?: string; group_id: number }) => {
  return db.createStudent(data.name, data.email, data.group_id)
})

ipcMain.handle('students:update', async (_, data: { id: number; name: string; email?: string; group_id: number }) => {
  db.updateStudent(data.id, data.name, data.email, data.group_id)
  return { success: true }
})

ipcMain.handle('students:delete', async (_, id: number) => {
  db.deleteStudent(id)
  return { success: true }
})

ipcMain.handle('attendance:get-by-group-date', async (_, groupId: number, date: string) => {
  return db.getAttendancesByGroupDate(groupId, date)
})

ipcMain.handle('attendance:save-batch', async (_, records: { student_id: number; date: string; status: string }[]) => {
  db.saveAttendanceBatch(records)
  return { success: true }
})

ipcMain.handle('attendance:get-stats', async () => {
  return db.getStats()
})