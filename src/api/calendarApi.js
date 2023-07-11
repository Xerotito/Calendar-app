/* 
Configuración axios se usa cada vez que se llama a un end-point
*/

import axios from 'axios'
import { getEnvVariables } from '../helpers/getEnvVariables'

const { VITE_API_URL } = getEnvVariables()

const calendarApi = axios.create( {
    baseURL: VITE_API_URL
} )

//# Configurar interceptores
/* Un interceptor es una configuración propia de axios es un código que se ejecuta antes de realizar una petición o de recibir una respuesta del server */
calendarApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,                       /* Arrastramos si ya teníamos otras propiedades en el header                   */
        'x-token': localStorage.getItem('token') /* En esta caso a cualquier petición hecha le agregamos el token en el header  */
    }
    return config
} )

export default calendarApi 