/*  
Entrada de la aplicación dependerá si estamos autenticados o no el componente y ruta que mostremos. 
*/

import { Navigate, Route, Routes } from "react-router-dom"

import { LoginPage } from "../auth/pages"
import { CalendarPage } from "../calendar/pages"
import { useAuthStore } from "../hooks"
import { useEffect } from "react"


export const AppRouter = () => {

    const { status, checkAuthToken } = useAuthStore()
    // const authStatus = 'not-authenticated'

    /* Llamamos a la fn que checkea si hay token en localStorage, si hay lo renueva  */
    useEffect( () => { checkAuthToken() }, [] )
    
    if (status === 'checking') return <h3>Cargando....</h3>
    
    return (
        <Routes>
            {
                status === 'not-authenticated'
                    ? (
                        <>
                            <Route path="/auth/*" element={<LoginPage />} />
                            <Route path="/*" element={<Navigate to="/auth/login" />} />
                        </>
                    )
                    : (
                        <>
                            <Route path="/" element={<CalendarPage />} />
                            <Route path="/*" element={<Navigate to="/" />} />
                        </>
                    )
            }

            {/* Rutas desconocidas sin autentificación*/ }
        </Routes>
    )

}
