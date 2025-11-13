import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('medisync_user')
      if(raw) setUser(JSON.parse(raw))
    }catch(e){/* ignore */}
  },[])

  const login = (u)=>{
    setUser(u)
    try{ localStorage.setItem('medisync_user', JSON.stringify(u)) }catch(e){}
  }
  const logout = ()=>{
    setUser(null)
    try{ localStorage.removeItem('medisync_user') }catch(e){}
  }

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
