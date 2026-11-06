import { AppProvider, useApp } from './context/AppContext'
import AppShell from './components/layout/AppShell'
import LandingStep from './screens/LandingStep'
import QuizStep from './screens/QuizStep'
import CameraStep from './screens/CameraStep'
import ScanStep from './screens/ScanStep'
import ResultStep from './screens/ResultStep'
import CatalogStep from './screens/CatalogStep'

function Router() {
  const { state } = useApp()
  switch (state.step) {
    case 1:
      return <LandingStep />
    case 2:
      return <QuizStep />
    case 3:
      return <CameraStep />
    case 4:
      return <ScanStep />
    case 5:
      return <ResultStep />
    case 6:
      return <CatalogStep />
    default:
      return <LandingStep />
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <Router />
      </AppShell>
    </AppProvider>
  )
}