import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'

const AdminManagementView = () => {
  const [open, setOpen] = useState(true)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} onToggle={toggleDrawer} isAdmin={true} />
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          open ? 'ml-60' : 'ml-16'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default AdminManagementView
