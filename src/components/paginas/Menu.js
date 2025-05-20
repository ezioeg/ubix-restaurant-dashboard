import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase"; //index

import Plato from "../ui/Plato";

const Menu = () => {
    // State para alojar los datos de los platos
    const [platos, setPlatos] = useState([]);
    const [q, setQ] = useState("");
    const { firebase } = useContext(FirebaseContext);

    // Para mostrar solo los platos de este negocio
    const user = firebase.auth.currentUser;
    const restauranteID = user.uid;

    useEffect(() => {
        const unsubscribe = firebase.db
            .collection("restaurantes")
            .doc(restauranteID)
            .collection("productos")
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db, restauranteID]);

    function manejarSnapshot(snapshot) {
        const platos = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });

        // almacenar los platos en el estado
        setPlatos(platos);
    }

    function search(rows) {
        return rows.filter(
            (row) =>
                row.nombre.toString().toLowerCase().indexOf(q.toLowerCase()) >
                    -1 ||
                row.descripcion
                    .toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1 ||
                row.categoria
                    .toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1 ||
                row.precio.toString().toLowerCase().indexOf(q.toLowerCase()) >
                    -1
        );
    }

    return (
        <>
            {" "}
            <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-800 ">Menú </h1>
                <h1 className="text-sm font-bold text-red-600 mb-4">
                    (Para editar platos presiona click a la foto)
                </h1>
                <Link
                    className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white uppercase font-bold rounded"
                    to="/crear-plato"
                >
                    {" "}
                    Agregar Plato
                </Link>

                <div className="h-12 px-2 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none">
                    <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                        <input
                            type="text"
                            className="flex-shrink flex-grow flex-auto leading-normal tracking-wide w-px border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none  lg:text-md text-gray-800"
                            placeholder="Buscar plato"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>
                </div>

                <div className=" my-3">
                    <div className="flex flex-wrap">
                        {search(platos)
                            .sort(function (a, b) {
                                // Ordena por nombre
                                return a.nombre.localeCompare(b.nombre);
                            })
                            .map((plato) => (
                                <Plato key={plato.id} plato={plato} />
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Menu;
