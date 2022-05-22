import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuthStatus'
import SimpleExplore from '../pages/Simple Explore'
import Spinner from './Spinner'

const PrivateExploreRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()

  if (checkingStatus) {
    return <Spinner />
  }

  return loggedIn ? <Outlet /> : <SimpleExplore />//<Navigate to='/sign-in' />
}

export default PrivateExploreRoute
