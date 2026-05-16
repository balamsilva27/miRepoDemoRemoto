import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Groups from './pages/Groups'
import Students from './pages/Students'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="groups" element={<Groups />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App