import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase"; //index
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

const EditarNegocio = () => {
    // State para las imagenes de negocio
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");
    const [restauranteInfo, setRestauranteInfo] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    // Para mostrar solo el negocio de este id
    const user = firebase.auth.currentUser;
    const restauranteID = user.uid;

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
                setRestauranteInfo(restaurante);
            });

        // const unsubscribe2 = firebase.db
        // .collection("categorias")
        // .doc(restauranteID)
        // .collection("principales")
        // .onSnapshot(manejarSnapshot);

        return () => {
            // Unmouting
            unsubscribe();
            // unsubscribe2();
        };
    }, [firebase.db, restauranteID]);

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre:
                !!restauranteInfo && !!restauranteInfo.nombre
                    ? restauranteInfo.nombre
                    : "",
            categorias:
                !!restauranteInfo && !!restauranteInfo.categorias
                    ? restauranteInfo.categorias
                    : "",
            descripcion:
                !!restauranteInfo && !!restauranteInfo.descripcion
                    ? restauranteInfo.descripcion
                    : "",
            imagen:
                !!restauranteInfo && !!restauranteInfo.imagen
                    ? restauranteInfo.imagen
                    : "",
            // tasa:
            //     !!restauranteInfo && !!restauranteInfo.tasa
            //         ? restauranteInfo.tasa
            //         : "",
            descuentoGeneral:
                !!restauranteInfo && !!restauranteInfo.descuentoGeneral
                    ? restauranteInfo.descuentoGeneral
                    : 0,
            apertura:
                !!restauranteInfo && !!restauranteInfo.apertura
                    ? restauranteInfo.apertura
                    : "",
            cierre:
                !!restauranteInfo && !!restauranteInfo.cierre
                    ? restauranteInfo.cierre
                    : "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, "El nombre debe tener al menos 3 caracteres")
                .required("El nombre es obligatorio"),
            categorias: Yup.string().required("La categoría es obligatoria"),
            descripcion: Yup.string()
                .min(10, "La descripción debe tener al menos 10 caracteres")
                .required("La descripción es obligatoria"),
            // tasa: Yup.number()
            //     .min(400000, "La tasa es a partir de 400000 BsS")
            //     .required("La tasa de dolar es obligatoria"),
            descuentoGeneral: Yup.number()
                .min(0, "El mínimo es 0")
                .max(99, "El máximo es 99")
                .required("Coloque 0 si no desea hacer un descuento general"),
            apertura: Yup.string().required(
                "El horario de apertura es obligatorio"
            ),
            cierre: Yup.string().required(
                "El horario de cierre es obligatorio"
            ),
        }),
        onSubmit: (restaurante) => {
            try {
                // Para actualizar el mismo negocio
                const user = firebase.auth.currentUser;
                const restauranteID = user.uid;

                let collectionRef = firebase.db.collection("restaurantes");

                // Modifica el descuento general
                collectionRef
                    .doc(restauranteID)
                    .update({ descuentoGeneral: restaurante.descuentoGeneral });

                // Modifica el descuento en todos los productos
                collectionRef
                    .doc(restauranteID)
                    .collection("productos")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            doc.ref.update({
                                descuentoPorcentaje:
                                    restaurante.descuentoGeneral,
                            });
                        });
                    });

                restaurante.imagen = urlimagen
                    ? urlimagen
                    : restauranteInfo.imagen;
                collectionRef.doc(restauranteID).update(restaurante); // originalmente add

                // Redireccionar
                navigate("/"); // negocios
            } catch (error) {
                console.log(error);
            }
        },
    });

    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    };

    const handleUploadError = (error) => {
        setSubiendo(false);
        console.log(error);
    };

    const handleUploadSuccess = async (nombreArchivo) => {
        setProgreso(100);
        setSubiendo(false);

        // Se obtiene y se almacena la URL de destino
        const url = await firebase.storage
            .ref("restaurantes")
            .child(nombreArchivo)
            .getDownloadURL();
        console.log(url);
        setUrlimagen(url);
    };

    const handleProgress = (progreso) => {
        setProgreso(progreso);
        console.log(progreso);
    };

    return (
        <>
            <div className="flex h-full bg-gray-200 items-center justify-center">
                <div className="grid bg-white rounded-lg shadow-xl w-11/12 md:w-9/12 lg:w-1/2 px-10">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-center py-4">
                            <div className="flex bg-orange-600 rounded-full md:p-6 p-6 border-2 border-orange-600">
                                <img
                                    // className="md:object-fill "
                                    className="bg-white rounded-md h-24 w-24 shadow-xl"
                                    src={formik.values.imagen}
                                    // width="200"
                                    alt="imagen negocio"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl">
                                    Actualizar negocio
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Hora de apertura
                                </label>
                                <select
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="apertura"
                                    value={formik.values.apertura}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">--Seleccione--</option>
                                    <option value="9:00">9:00 am</option>
                                    <option value="9:30">9:30 am</option>
                                    <option value="10:00">10:00 am</option>
                                    <option value="10:30">10:30 am</option>
                                    <option value="11:00">11:00 am</option>
                                    <option value="11:30">11:30 am</option>
                                    <option value="12:00">12:00 pm</option>
                                    <option value="12:30">12:30 pm</option>
                                    <option value="13:00">01:00 pm</option>
                                    <option value="13:30">01:30 pm</option>
                                    <option value="14:00">02:00 pm</option>
                                    <option value="14:30">02:30 pm</option>
                                    <option value="15:00">03:00 pm</option>
                                </select>
                            </div>
                            {formik.touched.apertura && formik.errors.apertura && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.apertura}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Hora de cierre
                                </label>
                                <select
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="cierre"
                                    value={formik.values.cierre}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="">--Seleccione--</option>
                                    <option value="14:00">02:00 pm</option>
                                    <option value="14:30">02:30 pm</option>
                                    <option value="15:00">03:00 pm</option>
                                    <option value="15:30">03:30 pm</option>
                                    <option value="16:00">04:00 pm</option>
                                    <option value="16:30">04:30 pm</option>
                                    <option value="17:00">05:00 pm</option>
                                    <option value="17:30">05:30 pm</option>
                                    <option value="18:00">06:00 pm</option>
                                    <option value="18:30">06:30 pm</option>
                                    <option value="19:00">07:00 pm</option>
                                    <option value="19:30">07:30 pm</option>
                                    <option value="20:00">08:00 pm</option>
                                </select>
                            </div>
                            {formik.touched.cierre && formik.errors.cierre && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.cierre}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold mb-1">
                                Imagen
                            </label>
                            <div className="flex w-full ">
                                <FileUploader
                                    accept="image/*"
                                    id="imagen"
                                    name="imagen"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref(
                                        "restaurantes"
                                    )}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress}
                                />
                            </div>
                            {subiendo && (
                                <div className="h-12 relative w-full border my-5">
                                    <div
                                        className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                                        style={{ width: `${progreso}%` }}
                                    >
                                        {progreso} %
                                    </div>
                                </div>
                            )}

                            {urlimagen && (
                                <p className="bg-green-500 text-white p-3 text-center my-5">
                                    La imagen se subio correctamente
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Nombre
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="nombre"
                                type="text"
                                placeholder="Nombre negocio"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.nombre}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Categoría
                            </label>
                            <select
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="categorias"
                                value={formik.values.categorias}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">--Seleccione--</option>
                                <option value="desayuno">Desayuno</option>
                                <option value="almuerzo">Almuerzo</option>
                                <option value="cena">Cena</option>
                                <option value="comida rapida">
                                    Comida rápida
                                </option>
                                <option value="pizza">Pizza</option>
                                <option value="pollo">Pollo</option>
                                <option value="hamburguesa">Hamburguesa</option>
                                <option value="perro caliente">
                                    Perro caliente
                                </option>
                                <option value="carne y parrilla">
                                    Carne y parrilla
                                </option>
                                <option value="pasta">Pasta</option>
                                <option value="sopa">Sopa</option>
                                <option value="postre y pasteleria">
                                    Postre y Pastelería
                                </option>
                                <option value="pepito">Pepito</option>
                                <option value="poke">Poke</option>
                                <option value="chicharronera">
                                    Chicharronera
                                </option>
                                <option value="mediterranea">
                                    Mediterránea
                                </option>
                                <option value="venezolana">Venezolana</option>
                                <option value="italiana">Italiana</option>
                                <option value="japonesa">Japonesa</option>
                                <option value="mexicana">Mexicana</option>
                                <option value="americana">Americana</option>
                                <option value="china">China</option>
                                <option value="arabe">Árabe</option>
                                <option value="fusion">Fusión</option>
                                <option value="congelada">Congelada</option>
                                <option value="ensalada">Ensalada</option>
                                <option value="bebida">Bebida</option>
                            </select>
                        </div>
                        {formik.touched.categorias && formik.errors.categorias && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.categorias}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Descripción
                            </label>
                            <textarea
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="descripcion"
                                placeholder="Descripción Negocio"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>
                        {formik.touched.descripcion &&
                            formik.errors.descripcion && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.descripcion}</p>
                                </div>
                            )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Descuento General (%)
                            </label>
                            <input
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="descuentoGeneral"
                                type="number"
                                step="0.01"
                                min="0"
                                max="99"
                                placeholder="0"
                                value={formik.values.descuentoGeneral}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.descuentoGeneral &&
                            formik.errors.descuentoGeneral && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.descuentoGeneral}</p>
                                </div>
                            )}

                        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Actualizar negocio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarNegocio;
