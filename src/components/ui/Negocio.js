import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { FirebaseContext } from "../../firebase"; //index

import Mapa from "../ui/Mapa";

// Para los Modales
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const Negocio = ({ restaurante }) => {
    const [visibleMapa, setVisibleMapa] = useState(false);

    // abierto ref para acceder al valor directamente
    const abiertoRef = useRef(restaurante.abierto);

    // Context de firebase para cambios en la base de datos
    const { firebase } = useContext(FirebaseContext);

    const {
        id,
        nombre,
        imagen,
        negocioTipo,
        descripcion,
        abierto,
        categorias,
        // tasa,
        descuentoGeneral,
        apertura,
        cierre,
    } = restaurante;

    ///modificar el estado del negocio en firebase
    const actualizarAbierto = () => {
        const abierto = abiertoRef.current.value === "true";

        try {
            firebase.db.collection("restaurantes").doc(id).update({ abierto });
        } catch (error) {
            console.log(error);
        }
    };

    function showMapa() {
        setVisibleMapa(true);
    }

    function hideMapa() {
        setVisibleMapa(false);
    }

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-xl bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12">
                        <div className="flex justify-center">
                            <img
                                src={imagen}
                                alt="imagen negocio"
                                className="rounded-md h-50"
                            />
                        </div>
                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-4/4">
                                <span className="block text-gray-800 mb-2">
                                    {" "}
                                    Abierto
                                </span>
                                <select
                                    className="bg-white shadow appearance-none border rounded w-full py-2 px-2 leading-tight focus:outline-none"
                                    value={abierto}
                                    ref={abiertoRef}
                                    onChange={() => actualizarAbierto()}
                                >
                                    <option value="true"> Si</option>
                                    <option value="false"> No</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-5/12 xl:w-5/12 pl-5 pt-4">
                        <p className="font-bold text-2xl text-orange-600 mb-2">
                            {" "}
                            {nombre}
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Tipo de negocio: {""}
                            <span className="text-gray-600">{negocioTipo}</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Descripción: {""}
                            <span className="text-gray-600">{descripcion}</span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Categoría: {""}
                            <span className="text-gray-600">{categorias}</span>
                        </p>

                        {/* <p className="text-gray-700 font-bold mb-2">
                                Tasa dólar:
                                <span className="text-gray-600"> {tasa} BsS</span>
                        </p> */}

                        <p className="text-gray-700 font-bold mb-2">
                            Descuento General:
                            <span className="text-gray-600">
                                {" "}
                                {descuentoGeneral}%
                            </span>
                        </p>

                        <p className="text-gray-700 font-bold mb-2">
                            Horario:
                            {apertura >= "12:00" ? (
                                <span className="text-gray-600 pl-1">
                                    {apertura} pm - {cierre} pm
                                </span>
                            ) : (
                                <span className="text-gray-600 pl-1">
                                    {apertura} am - {cierre} pm
                                </span>
                            )}
                        </p>

                        <Link
                            className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 text-white text-sm uppercase font-bold rounded"
                            to="/editar-negocio"
                        >
                            Editar
                        </Link>

                        <button
                            type="button"
                            className="bg-orange-800 hover:bg-orange-700 inline-block mb-5 p-2 ml-2 text-white text-sm uppercase font-bold rounded"
                            onClick={() => {
                                showMapa();
                            }}
                        >
                            Mapa
                        </button>
                    </div>

                    {/* Modales */}

                    <div>
                        <Rodal
                            visible={visibleMapa}
                            onClose={() => hideMapa()}
                            width={450}
                            height={350}
                        >
                            <p className="block text-white bg-gray-800 font-bold mt-5  text-center p-1">
                                UBICACIÓN
                            </p>
                            <div className="w-full h-full">
                                <Mapa />
                            </div>
                        </Rodal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Negocio;
