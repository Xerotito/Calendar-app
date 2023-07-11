import { useAuthStore } from "../../hooks/useAuthStore"

export const Navbar = () => {

    const { user, startLogout } = useAuthStore()

    return (
        <div className="navbar navbar-dark bg-dark mb-4 px-4">
            <span className="navbar-brand">
                <i className="fa-solid fa-user">
                    <i className="fa ms-2">{ user.name }</i>
                </i>
                &nbsp;
            </span>
            <button 
                className = "btn btn-outline-danger"
                onClick   = { startLogout }
            >
                <i className="fas fa-sign-out-alt"></i>                
                &nbsp;
                <span>Salir</span>
            </button>
        </div>
    )
}
    
