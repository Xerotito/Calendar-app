//* CustomHook que maneja todo lo relacionado al uiSlice del store.

import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal } from "../store"


//Dispatch de acciones del uiStore
export const useUIStore = () => {
    const dispatch = useDispatch()
    const { isDateModalOpen } = useSelector(state => state.ui)

    const openDateModal = () => dispatch( onOpenDateModal() )

    const closeDateModal = () => dispatch( onCloseDateModal() )

    return {
        //*Propiedades
        isDateModalOpen,

        //*Métodos
        openDateModal,
        closeDateModal
    }
}
