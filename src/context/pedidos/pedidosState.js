import React, { useReducer } from "react";

import PedidoReducer from "./pedidosReducer";
import PedidoContext from "./pedidosContext";

// Mover a firebaseState
import firebase from "../../firebase"; // index

import {
    SELECCIONAR_PRODUCTO,
    OBTENER_CLIENTE,
    OBTENER_RESTAURANTE,
} from "../types";

const PedidoState = (props) => {
    const initialState = {
        platoinfo: null, // []
        clienteinfo: null,
        restauranteinfo: null,
        origendestinoinfo: [],
    };

    //useReducer con dispatch para ejecutar las funciones
    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    const seleccionarPlato = (plato) => {
        console.log(plato);
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: plato,
        });
    };

    // Mover a firebaseState
    const obtenerClienteInfo = (ordenclienteid) => {
        // console.log(ordenclienteid)
        firebase.db
            .collection("clientes")
            .doc(ordenclienteid)
            .onSnapshot(function (doc) {
                const clienteInfo = {
                    ...doc.data(),
                };

                // console.log(clienteInfo.coordinates.latitude);
                // console.log(clienteInfo.coordinates.longitude);

                dispatch({
                    type: OBTENER_CLIENTE,
                    payload: clienteInfo,
                });
            });
    };

    // Mover a firebaseState
    const obtenerRestauranteInfo = (ordenrestauranteid) => {
        // console.log(ordenrestauranteid);
        firebase.db
            .collection("restaurantes")
            .doc(ordenrestauranteid)
            .onSnapshot(function (doc) {
                const restauranteInfo = {
                    ...doc.data(),
                };

                // console.log(restauranteInfo.coordinates.latitude);
                // console.log(restauranteInfo.coordinates.longitude);

                dispatch({
                    type: OBTENER_RESTAURANTE,
                    payload: restauranteInfo,
                });
            });
    };

    return (
        <PedidoContext.Provider
            value={{
                platoinfo: state.platoinfo,
                clienteinfo: state.clienteinfo, // Principalmente para extraer las coordenadas
                restauranteinfo: state.restauranteinfo, // Principalmente para extraer las coordenadas
                seleccionarPlato,
                obtenerClienteInfo,
                obtenerRestauranteInfo,
            }}
        >
            {props.children}
        </PedidoContext.Provider>
    );
};

export default PedidoState;
