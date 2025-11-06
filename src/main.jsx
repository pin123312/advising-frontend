import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from "./context/UserContext.jsx"; 
import './index.css'

import App from './App.jsx'
import Signup from './Signup.jsx'
import Userlist from './Userlist.jsx'

createRoot(document.getElementById('root')).render(
  <>
  <UserProvider>
    <App />
  </UserProvider>
   {/* <Signup/> */}
   {/* <Userlist/> */}
  </>
)
