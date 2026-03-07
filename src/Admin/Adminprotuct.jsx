import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function Adminprotuct() {

    const person=localStorage.getItem('authtoken')

    if(person === 'admin'){
        return <Outlet/>
    }else{
        return <Navigate to={'/'} replace/>
    }

  return (
    <div>
      
    </div>
  )
}

export default Adminprotuct
