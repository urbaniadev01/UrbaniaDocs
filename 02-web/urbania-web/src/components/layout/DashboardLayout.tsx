import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router'
import { useAuthStore } from '@/stores/auth.store'
import { silentRefresh, getMe } from '@/features/auth/api/auth.service'
import { FullPageLoader } from '@/components/shared/FullPageLoader'
import { DashboardShell } from '@/components/layout/DashboardShell'

export function DashboardLayout() {
  const { setUser, clearSession } = useAuthStore()
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function bootstrap() {
      try {
        await silentRefresh()
        const user = await getMe()

        if (user.role !== 'admin') {
          clearSession()
          navigate('/login', { replace: true })
          return
        }

        setUser(user)
        setReady(true)
      } catch {
        clearSession()
        navigate('/login', { replace: true })
      }
    }

    bootstrap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ready) return <FullPageLoader />
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  )
}
