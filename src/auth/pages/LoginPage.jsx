import "./LoginPage.css"
import { useEffect } from "react"

import Swal from "sweetalert2"
import { useAuthStore, useForm } from "../../hooks"


const loginFormFields = {
    loginEmail   : '',
    loginPassword: '',
}

const registerFormFields = {
    registerName     : '',
    registerEmail    : '',
    registerPassword : '',
    registerPassword2: ''
}

export const LoginPage = () => {

    /* custom hook (símil thunk) que interactúa con el store (auth slice) */
    const { startLogin, startRegister, errorMessage } = useAuthStore()

    const { loginEmail, loginPassword, onInputChange: onLoginInputChange }     = useForm(loginFormFields)
    const { registerName, registerEmail, registerPassword, registerPassword2, onInputChange: onRegisterInputChange } = useForm(registerFormFields)

    const loginSubmit = (event) => {
        event.preventDefault()
        startLogin({ email:loginEmail, password:loginPassword })
    }

    const registerSubmit = async (event) => {
        event.preventDefault()
        if (registerPassword !== registerPassword2) {
            Swal.fire({ icon: 'error', text: 'Las contraseñas deben coincidir' })
            return
        }
        await startRegister({ name: registerName, email: registerEmail, password: registerPassword })       

    }

    /* Muestra un modal cuando hay error */
    useEffect(() => {
        if(errorMessage !== undefined) Swal.fire('Error', errorMessage, 'error')        
    }, [errorMessage])
    

    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Ingreso</h3>
                    <form onSubmit = { loginSubmit }>
                        <div className="form-group mb-2">
                            <input
                                type        = "text"
                                className   = "form-control"
                                placeholder = "Correo"
                                name        = "loginEmail"
                                value       = { loginEmail }
                                onChange    = { onLoginInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type        = "password"
                                className   = "form-control"
                                placeholder = "Contraseña"
                                name        = "loginPassword"
                                value       = { loginPassword }
                                onChange    = { onLoginInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input type="submit" className="btnSubmit" value="Login" />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Registro</h3>
                    <form onSubmit = { registerSubmit }>
                        <div className="form-group mb-2">
                            <input
                                type        = "text"
                                className   = "form-control"
                                placeholder = "Nombre"
                                name        = "registerName"
                                onChange    = { onRegisterInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type        = "email"
                                className   = "form-control"
                                placeholder = "Correo"
                                name        = "registerEmail"
                                onChange    = { onRegisterInputChange }

                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type        = "password"
                                className   = "form-control"
                                placeholder = "Contraseña"
                                name        = "registerPassword"
                                onChange    = { onRegisterInputChange }

                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type        = "password"
                                className   = "form-control"
                                placeholder = "Repita la contraseña"
                                name        = "registerPassword2"
                                onChange    = { onRegisterInputChange }

                                
                            />
                        </div>

                        <div className="d-grid gap-2">
                            <input
                                type      = "submit"
                                className = "btnSubmit"
                                value     = "Crear cuenta"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
