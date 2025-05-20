import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";

import Login from "./components/paginas/Login";
import SidebarLogin from "./components/ui/SidebarLogin";
import Sidebar from "./components/ui/Sidebar";
import PoliticasPrivacidad from "./components/paginas/PoliticasPrivacidad";
import Soporte from "./components/paginas/Soporte";
import Negocios from "./components/paginas/Negocios";
import Menu from "./components/paginas/Menu";
import CrearPlato from "./components/paginas/CrearPlato";
import EditarNegocio from "./components/paginas/EditarNegocio";
import EditarPlato from "./components/paginas/EditarPlato";
import OrdenesGenerales from "./components/paginas/OrdenesGenerales";
import Pagos from "./components/paginas/Pagos";

import firebase, { FirebaseContext } from "./firebase"; // Desde el index. Y aqui se utilizan para envolver toda la app con firebase
import PedidoState from "./context/pedidos/pedidosState";

function App() {
    const [isSinged, setIsSinged] = useState(false);

    useEffect(() => {
        try {
            firebase.auth.onAuthStateChanged((user) => {
                user ? setIsSinged(true) : setIsSinged(false);
            });
        } catch (error) {
            console.log("error de login:", error);
        }
    }, []);

    return (
        <>
            <PedidoState>
                <FirebaseContext.Provider value={{ firebase }}>
                    {!isSinged ? (
                        <div className="md:flex min-h-screen">
                            <SidebarLogin />
                            <div className="md:w-3/5 xl:w-4/5">
                                <Routes>
                                    <Route exact path="/" element={<Login />} />
                                    <Route
                                        exact
                                        path="/politicas-privacidad"
                                        element={<PoliticasPrivacidad />}
                                    />
                                    <Route
                                        exact
                                        path="/soporte"
                                        element={<Soporte />}
                                    />
                                </Routes>
                            </div>
                        </div>
                    ) : (
                        <div className="md:flex min-h-screen">
                            <Sidebar />
                            <div className="md:w-3/5 xl:w-4/5">
                                <Routes>
                                    <Route
                                        exact
                                        path="/"
                                        element={<Negocios />}
                                    />
                                    <Route
                                        path="/editar-negocio"
                                        element={<EditarNegocio />}
                                    />
                                    <Route path="/menu" element={<Menu />} />
                                    <Route
                                        path="/crear-plato"
                                        element={<CrearPlato />}
                                    />
                                    <Route
                                        path="/editar-plato"
                                        element={<EditarPlato />}
                                    />
                                    <Route
                                        path="/ordenes"
                                        element={<OrdenesGenerales />}
                                    />
                                    <Route path="/pagos" element={<Pagos />} />
                                </Routes>
                            </div>
                        </div>
                    )}
                </FirebaseContext.Provider>
            </PedidoState>
        </>
    );
}

export default App;
