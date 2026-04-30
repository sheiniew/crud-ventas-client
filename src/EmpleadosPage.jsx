import { useEffect, useState } from "react";
import {
    getEmpleados,
    getEmpleadosInhabilitados,
    crearEmpleado,
    actualizarEmpleado,
    inhabilitarEmpleado,
    reactivarEmpleado
} from "./api/empleados";
import Loading from "./Loading";
import ConfirmModal from "./utils/ConfirmModal";
import { useNavigate } from "react-router-dom";
import "./component.css";

export default function EmpleadosPage() {
    const [empleados, setEmpleados] = useState([]);
    const [empleadosInhabilitados, setEmpleadosInhabilitados] = useState([]);
    const [form, setForm] = useState({ nombre: "", cargo: "", correo: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
    const [accionModal, setAccionModal] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [verInhabilitados, setVerInhabilitados] = useState(false);
    const navigate = useNavigate();

    const isFormValid =
        form.nombre.trim() !== "" &&
        form.cargo.trim() !== "" &&
        form.correo.trim() !== "";

    const empleadosFiltrados = empleados.filter((e) =>
        `${e.nombre} ${e.cargo} ${e.correo}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    const inhabilitadosFiltrados = empleadosInhabilitados.filter((e) =>
        `${e.nombre} ${e.cargo} ${e.correo}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    const cargar = async () => {
        setLoading(true);
        try {
            const data = await getEmpleados();
            setEmpleados(data);
            const dataInhabilitados = await getEmpleadosInhabilitados();
            setEmpleadosInhabilitados(dataInhabilitados);
        } catch (error) {
            alert("Error al cargar empleados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const guardar = async () => {
        if (editId) {
            await actualizarEmpleado(editId, form);
            setEditId(null);
        } else {
            await crearEmpleado(form);
        }

        setForm({ nombre: "", cargo: "", correo: "" });
        cargar();
    };

    const confirmarInhabilitar = (empleado) => {
        setEmpleadoAEliminar(empleado);
        setAccionModal("inhabilitar");
        setModalOpen(true);
    };

    const confirmarReactivar = (empleado) => {
        setEmpleadoAEliminar(empleado);
        setAccionModal("reactivar");
        setModalOpen(true);
    };

    const handleConfirmar = async () => {
        if (!empleadoAEliminar) return;

        if (accionModal === "inhabilitar") {
            await inhabilitarEmpleado(empleadoAEliminar.id_empleado);
        } else if (accionModal === "reactivar") {
            await reactivarEmpleado(empleadoAEliminar.id_empleado);
        }

        cargar();
        setModalOpen(false);
        setEmpleadoAEliminar(null);
        setAccionModal(null);
    };

    return (
        <div>
            <h2>Empleados</h2>

            <input placeholder="Nombre"
                value={form.nombre}
                required
                onChange={e => setForm({ ...form, nombre: e.target.value })} />

            <input placeholder="Cargo"
                value={form.cargo}
                required
                onChange={e => setForm({ ...form, cargo: e.target.value })} />

            <input placeholder="Correo"
                value={form.correo}
                required
                onChange={e => setForm({ ...form, correo: e.target.value })} />

            <button onClick={guardar} disabled={!isFormValid}>
                {editId ? "Actualizar" : "Crear"}
            </button>
            {editId && (
                <button
                    onClick={() => {
                        setEditId(null);
                        setForm({ nombre: "", cargo: "", correo: "" });
                    }}
                    style={{marginLeft: "10px"}}
                >
                    Cancelar
                </button>
            )}

            <div className="filter-bar" style={{ marginTop: "15px" }}>
                <div className="filter-label">Filtrar:</div>
                <input
                    placeholder="Buscar empleado..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <button
                    className="secondary"
                    onClick={() => setVerInhabilitados(!verInhabilitados)}
                >
                    {verInhabilitados
                        ? "Ver activos"
                        : "Ver inhabilitados"}
                </button>
            </div>

            {loading ? (
                <Loading />

            ) : (
                <div>
                    {!verInhabilitados ? (
                        <div className="list">
                            {empleadosFiltrados.length === 0 ? (
                                <div className="empty">
                                    <p >
                                        No hay empleados activos
                                    </p>
                                </div>
                            ) : (
                                empleadosFiltrados.map((e) => (
                                    <div
                                        className="row"
                                        key={e.id_empleado}
                                        onClick={() => navigate(`/empleado/${e.id_empleado}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="id">Id: {e.id_empleado}</div>

                                        <div className="info">
                                            <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                                                {e.nombre}
                                            </div>
                                            <div className="muted">
                                                {e.cargo} - {e.correo}
                                            </div>
                                        </div>

                                        <div className="actions">
                                            <button
                                                className="secondary"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    setEditId(e.id_empleado);
                                                    setForm(e);
                                                }}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                className="danger"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    confirmarInhabilitar(e);
                                                }}
                                            >
                                                Inhabilitar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="list">
                            {inhabilitadosFiltrados.length === 0 ? (
                                <div className="empty">
                                    <p>
                                        No hay empleados inhabilitados
                                    </p>
                                </div>
                            ) : (
                                inhabilitadosFiltrados.map((e) => (
                                    <div
                                        className="row inactive"
                                        key={e.id_empleado}
                                        onClick={() => navigate(`/empleado/${e.id_empleado}`)}
                                        style={{ cursor: "pointer", opacity: 0.7 }}
                                    >
                                        <div className="id">Id: {e.id_empleado}</div>

                                        <div className="info">
                                            <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                                                {e.nombre}
                                            </div>
                                            <div className="muted">
                                                {e.cargo} - {e.correo}
                                            </div>
                                        </div>

                                        <div className="actions">
                                            <button
                                                className="danger"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    confirmarReactivar(e);
                                                }}
                                            >
                                                Reactivar
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmar}
                title={
                    accionModal === "inhabilitar"
                        ? "Inhabilitar empleado"
                        : "Reactivar empleado"
                }
                message={
                    accionModal === "inhabilitar"
                        ? `¿Estas seguro de inhabilitar a ${empleadoAEliminar?.nombre}?`
                        : `¿Deseas reactivar a ${empleadoAEliminar?.nombre}?`
                }
                confirmText={
                    accionModal === "inhabilitar"
                        ? "Inhabilitar"
                        : "Reactivar"
                }
            />
        </div>
    );
}
