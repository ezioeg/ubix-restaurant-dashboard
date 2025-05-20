import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase"; //index
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

const CrearPlato = () => {
    // State para las imagenes de platos
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlimagen, setUrlimagen] = useState("");

    const { firebase } = useContext(FirebaseContext);

    // Para mostrar solo el negocio de este id
    const user = firebase.auth.currentUser;
    const restauranteID = user.uid;

    //Hook para redireccionar
    const navigate = useNavigate();

    // Validacion y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            nombre: "",
            precio: "",
            categoria: "",
            imagen: "",
            descripcion: "",
            descuentoPorcentaje: 0,
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, "El nombre debe tener al menos 3 caracteres")
                .required("El nombre es obligatorio"),
            precio: Yup.number()
                .min(0.1, "Tienes que agregar un precio")
                .required("El precio es obligatorio"),
            categoria: Yup.string().required("La categoría es obligatoria"),
            descripcion: Yup.string()
                .min(10, "La descripción debe tener al menos 10 caracteres")
                .required("La descripción es obligatoria"),
            descuentoPorcentaje: Yup.number()
                .min(0, "El mínimo es 0")
                .max(99, "El máximo es 99")
                .required("Coloque 0 si no desea descuento en este producto"),
        }),
        onSubmit: (plato) => {
            try {
                // Para crear plato a este negocio
                const user = firebase.auth.currentUser;
                const restauranteID = user.uid;
                plato.existencia = true;
                plato.imagen = urlimagen;
                // Revizar que el producto este guardando el id del negocio
                plato.restauranteId = restauranteID;
                firebase.db
                    .collection("restaurantes")
                    .doc(restauranteID)
                    .collection("productos")
                    .add(plato);

                // Redireccionar
                navigate("/menu");
            } catch (error) {
                console.log(error);
            }
        },
    });

    // Acciones sobre el proceso de la imagen
    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    };

    const handleUploadError = (error) => {
        setSubiendo(false);
        console.log(error);
    };

    // Si es upload success, busca la url por referencia y la guarda en un estado
    const handleUploadSuccess = async (nombre) => {
        setProgreso(100);
        setSubiendo(false);

        const url = await firebase.storage
            .ref(`restaurantes/${restauranteID}/productos/`)
            .child(nombre)
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
                        <div className="flex justify-center">
                            <div className="flex">
                                <h1 className="text-gray-700 font-bold md:text-2xl text-xl pt-10 pb-4">
                                    Agregar plato
                                </h1>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold mb-1">
                                Imagen
                            </label>
                            <div className="flex w-full ">
                                {/* Se almacena la imagen apenas se monta */}
                                <FileUploader
                                    accept="image/*"
                                    id="imagen"
                                    name="imagen"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref(
                                        `restaurantes/${restauranteID}/productos/`
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
                                placeholder="Nombre plato"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Precio
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="precio"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="5000"
                                    placeholder="$20"
                                    value={formik.values.precio}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.precio && formik.errors.precio && (
                                <div
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                    role="alert"
                                >
                                    {/* <p className="font-bold">Error:</p> */}
                                    <p>{formik.errors.precio}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1">
                                <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                    Descuento (%)
                                </label>
                                <input
                                    className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                    id="descuentoPorcentaje"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="99"
                                    placeholder="0"
                                    value={formik.values.descuentoPorcentaje}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.descuentoPorcentaje &&
                                formik.errors.descuentoPorcentaje && (
                                    <div
                                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
                                        role="alert"
                                    >
                                        {/* <p className="font-bold">Error:</p> */}
                                        <p>
                                            {formik.errors.descuentoPorcentaje}
                                        </p>
                                    </div>
                                )}
                        </div>

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Categoría
                            </label>
                            <select
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="categoria"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">--Seleccione--</option>
                                <option value="ofertas y promociones">
                                    Ofertas y promociones
                                </option>
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
                        {formik.touched.categoria && formik.errors.categoria && (
                            <div
                                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
                                role="alert"
                            >
                                {/* <p className="font-bold">Error:</p> */}
                                <p>{formik.errors.categoria}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 mt-5 mx-7">
                            <label className="uppercase md:text-sm text-xs text-gray-700 text-light font-semibold">
                                Descripción
                            </label>
                            <textarea
                                className="py-2 px-3 rounded-lg border-2 border-gray-500 mt-1 focus:outline-none focus:border-orange-500"
                                id="descripcion"
                                placeholder="Descripción Plato"
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

                        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
                            <button
                                type="submit"
                                className="w-auto bg-gray-600 hover:bg-gray-700 rounded-lg shadow-xl font-medium text-white px-4 py-2 focus:outline-none"
                            >
                                Agregar plato
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CrearPlato;
