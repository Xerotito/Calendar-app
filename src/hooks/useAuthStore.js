/* 
Usamos un custom hook en vez de un thunk, realiza todas las interacciones con auth del store
 */

import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api"
import { OnLogoutCalendar, clearErrorMessage, onChecking, onLogin, onLogout } from "../store"


export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector(state => state.auth) //Accedemos al store (slice/auth)
    const dispatch = useDispatch()                                          //Para despachar acciones del store (slice/auth)

    //° Logueo de usuario --------------------------------------------------------------------------------------------------
    const startLogin = async ({ email, password }) => {
        dispatch(onChecking())
        try {
            /* Axios enviamos por método post a BASE_URL/auth el body { email,password }  */
            const { data } = await calendarApi.post('/auth', { email, password })
            /* log response 
            console.log(data) */
            /* Almacenamos en localStorage */
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime()) /* Representación de la fecha actual con un entero */
            dispatch( onLogin({ name: data.name, uid: data.uid }) )         /* Set en store name, uid */
        } catch (error) {
            console.log(error)
            dispatch( onLogout('Credenciales incorrectas') )
            setTimeout( () => { dispatch(clearErrorMessage()) }, 10 )       /* limpiamos el errorMessage luego de unos segundos  */
        }
    }

    //° Registro nuevo usuario ----------------------------------------------------------------------------------------------
    const startRegister = async ({ name, email, password }) => {
        dispatch( onChecking() )
        try {
            /* Axios enviamos por método post a BASE_URL/new el body { name, email, password }  */
            const { data } = await calendarApi.post('/auth/new', { name, email, password })
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime())
            dispatch( onLogin({ name: data.name, uid: data.uid }) )
        } catch (error) {
            /* Si no hay error.response significaría que no se puedo realizar la conexión a la bd */
            error.response
                ? dispatch( onLogout(error.response.data?.msg || 'Error al enviar la solicitud revise los campos') )
                : dispatch( onLogout('Error en la conexión a la base de datos') )
        }
    }

    //° Renovación de token ----------------------------------------------------------------------------------------------------
    const checkAuthToken = async () => {
        const token = localStorage.getItem("token")
        if (!token) return dispatch( onLogout() ) /* Token expirado o null */
        
        try {
            /* Axios enviamos por método GET a BASE_URL/auth/renew (envía ultimo token y lo renueva)*/
            const { data } = await calendarApi.get("auth/renew")
            localStorage.setItem("token", data.token)
            dispatch( onLogin({ name:data.name, uid:data.uid }) )
        } catch (error) {                        /* Lo mas probable es que si hay error sea por que el token expiro */
            localStorage.clear()
            dispatch( onLogout() )
        }
    }

    //° Logout de usuario ----------------------------------------------------------------------------------------------------
    const startLogout = () => {
        localStorage.clear()
        dispatch( OnLogoutCalendar() )
        dispatch( onLogout() )
    }

    return {

        //*Propriedades
        errorMessage,
        status,
        user,

        //*Métodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }
}