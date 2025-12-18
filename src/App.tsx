import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { DonationsProvider } from './context/DonationsContext'
import { AuthProvider } from './context/AuthContext'
import { OrganizationPostsProvider } from './context/OrganizationPostsContext'

function App() {
  return (
    <AuthProvider>
      <DonationsProvider>
        <OrganizationPostsProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </OrganizationPostsProvider>
      </DonationsProvider>
    </AuthProvider>
  )
}

export default App

