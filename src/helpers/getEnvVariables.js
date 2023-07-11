//Exportamos nuestras variables de entorno (esta forma es propia de vite VITE_API_URL)
export const getEnvVariables = () => {
    // import.meta.env
    return { 
        VITE_API_URL: import.meta.env.VITE_API_URL,
        ...import.meta.env 
    }
}