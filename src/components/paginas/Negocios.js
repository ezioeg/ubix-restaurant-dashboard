import React, { useState, useEffect, useContext } from "react";

import { FirebaseContext } from "../../firebase"; //index

import Negocio from "../ui/Negocio";

const Negocios = () => {
    // State Para alojar los datos del negocio
    const [restaurante, setRestaurante] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    // Para mostrar solo el negocio de este id
    const user = firebase.auth.currentUser;
    const restauranteID = user ? user.uid : null;

    useEffect(() => {
        const unsubscribe = firebase.db
            .collection("restaurantes")
            .doc(restauranteID)
            .onSnapshot(function (doc) {
                const restaurante = {
                    id: doc.id,
                    ...doc.data(),
                };
                console.log(restaurante);
                setRestaurante(restaurante);
            });

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db, restauranteID]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 ">Negocio</h1>
            <>
                <Negocio key={restaurante.id} restaurante={restaurante} />
            </>
        </div>
    );
};

export default Negocios;
