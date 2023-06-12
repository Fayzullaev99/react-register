import React, { createContext, useState } from 'react'


const AuthContext = createContext({})

function AuthProvider({children}) {
    const [auth,setAuth] = useState({})
    // const [persist,setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false)
  return (
    <AuthContext.Provider
        value={{auth,setAuth}}
        // value={{auth,setAuth,persist,setPersist}}
    >{children}</AuthContext.Provider>
  )
}

export {AuthProvider,AuthContext}