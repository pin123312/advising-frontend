import { useState } from 'react'
import Signin from './Signin.jsx';
import Signup from './Signup.jsx';
import Landing from './Landing.jsx';
import Announcement from './Announcement.jsx';
import Appointments from './Appointments.jsx';
import NewAppointment from './NewAppointment.jsx';
import Lecturers from './Lecturers.jsx';
import Message from './Message.jsx';
import Setting from './Setting.jsx';
import RootLayout from './layout/RootLayout.jsx';
import ProtectedRoute from "./layout/ProtectedRoute.jsx";

import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';



function App() {  
  const [count, setCount] = useState(0)

  const router = createBrowserRouter(
    createRoutesFromElements(
       <Route path='/' element={<RootLayout/>}>
          <Route index element={<Signin/>}/>
          <Route path='signup' element={<Signup/>}/>
          <Route path='landing' element={<ProtectedRoute><Landing/></ProtectedRoute>}/>
          <Route path='announcement' element={<ProtectedRoute><Announcement/></ProtectedRoute>}/>
          <Route path='appointments' element={<ProtectedRoute><Appointments/></ProtectedRoute>}/>
          <Route path='appointments/book' element={<ProtectedRoute><NewAppointment/></ProtectedRoute>}/>
          <Route path='lecturers' element={<ProtectedRoute><Lecturers/></ProtectedRoute>}/>
          <Route path='message' element={<ProtectedRoute><Message/></ProtectedRoute>}/>
          <Route path='setting' element={<ProtectedRoute><Setting/></ProtectedRoute>}/>
      </Route>
    )
  )

  return (
    <>
    
      <RouterProvider router={router}/>
      {/* <Landing/>
      <Announcement/> */}
    
  
    </>
  )
}

export default App
