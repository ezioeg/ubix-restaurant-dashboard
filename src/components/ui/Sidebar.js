import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../../firebase"; //index

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import aviso from "../../sounds/r2d2_sms.mp3";

const Sidebar = () => {
    const [ordenesEntrantes, setOrdenesEntrantes] = useState([]);
    // Context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext);

    // Para mostrar solo el negocio de este id
    const user = firebase.auth.currentUser;
    const restauranteID = user.uid;

    const customId = "custom-id-yes";

    const notify = () =>
        toast.error("Ordenes sin verificar!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            toastId: customId,
        });

    const tono = new Audio(aviso);

    const playSound = (audioFile) => {
        audioFile.play();
    };

    useEffect(() => {
        // Para saber el numero de ordenes entrantes
        const unsubscribe = firebase.db
            .collection("restaurantes")
            .doc(restauranteID)
            .collection("ordenes")
            .where("verificado", "==", false)
            .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
        };
    }, [firebase.db, restauranteID]); // firebase.db

    useEffect(() => {
        if (ordenesEntrantes.length > 0) {
            playSound(tono);
            notify();
        } // eslint-disable-next-line
    }, [ordenesEntrantes]); //notificationAudio

    function manejarSnapshot(snapshot) {
        const ordenesEntrantes = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        setOrdenesEntrantes(ordenesEntrantes);
    }

    //Hook para redireccionar
    const navigate = useNavigate();
    return (
        <div className="md:w-2/5 xl:w-1/5 bg-gray-800 rounded p-3 shadow-lg">
            <div className="flex items-center space-x-4 p-2 mb-5">
                <img
                    className="h-12 rounded-full"
                    src={require("../../assets/favicon.ico")}
                    alt=""
                />
                <div>
                    <h4 className="font-semibold text-lg uppercase text-white font-poppins tracking-wide">
                        Ubix Negocio
                    </h4>
                </div>
            </div>
            <ul className="space-y-2 text-sm">
                <li>
                    <NavLink
                        exact="true"
                        to="/"
                        className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
                    >
                        {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
                        <span className="">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </span>
                        <span>{user.email.toUpperCase()}</span>
                        {/* </a> */}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        exact="true"
                        to="/menu"
                        className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
                    >
                        {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
                        <span className="">
                            <svg
                                className="fill-current h-5 w-5 "
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2
                        2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0
                        00-2-2h-1V1m-1 11h-5v5h5v-5z"
                                ></path>
                            </svg>
                        </span>
                        <span>Menú</span>
                        {/* </a> */}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        exact="true"
                        to="/ordenes"
                        className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
                    >
                        {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
                        <span className="">
                            <svg
                                className="h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                ></path>
                            </svg>
                        </span>
                        <span>
                            Ordenes{" "}
                            <span className="bg-red-600 rounded p-1 flex-row justify-center items-center text-xs">
                                {ordenesEntrantes.length}
                            </span>
                        </span>
                        {/* </a> */}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        exact="true"
                        to="/pagos"
                        className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
                    >
                        {/* <a
              href="/#"
              className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
            > */}
                        <span className="">
                            <svg
                                className="fill-current h-5 w-5 "
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 13H7v5h5v2H5V10h2v1h5v2M8
                        4v2H4V4h4m2-2H2v6h8V2m10 9v2h-4v-2h4m2-2h-8v6h8V9m-2
                        9v2h-4v-2h4m2-2h-8v6h8v-6z"
                                ></path>
                            </svg>
                        </span>
                        <span>Pago</span>
                        {/* </a> */}
                    </NavLink>
                </li>
                <li
                    onClick={() => {
                        firebase.auth.signOut();
                        navigate("/");
                    }}
                >
                    <a
                        href="/"
                        className="flex items-center space-x-3 text-gray-400 hover:text-gray-800 p-2 rounded-md font-medium text-base hover:bg-orange-500"
                    >
                        <span className="">
                            <svg
                                className="h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </span>
                        <span>Cerrar sesión</span>
                    </a>
                </li>
            </ul>

            <div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </div>
    );
};

export default Sidebar;
