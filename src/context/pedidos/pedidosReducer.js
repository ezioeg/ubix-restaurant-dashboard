import {
  SELECCIONAR_PRODUCTO,
  OBTENER_CLIENTE,
  OBTENER_RESTAURANTE,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case SELECCIONAR_PRODUCTO:
      return {
        ...state,
        platoinfo: action.payload,
      };

    case OBTENER_CLIENTE:
      return {
        ...state,
        clienteinfo: action.payload,
      };

    case OBTENER_RESTAURANTE:
      return {
        ...state,
        restauranteinfo: action.payload,
      };

    default:
      return state;
  }
};
