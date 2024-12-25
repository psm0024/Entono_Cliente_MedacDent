document.addEventListener("DOMContentLoaded", () => {
    const citaForm = document.getElementById("citaForm");
    const citasTableBody = document.getElementById("citasTable").getElementsByTagName("tbody")[0];
    const modal = document.getElementById("modal");
    const cerrarModal = document.getElementById("cerrar-modal");
    const guardarCambiosBtn = document.getElementById("guardar-cambios");
    let citas = JSON.parse(localStorage.getItem("citas")) || [];
    let citaActualId = null; // Variable para almacenar el ID de la cita actual

    // Cargar citas al iniciar
    cargarCitas();

    // Evento para guardar la cita
    citaForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const dia = document.getElementById("dia").value;
        const mes = document.getElementById("mes").value;
        const anio = document.getElementById("anio").value;
        const nombre = document.getElementById("nombre").value;
        const apellidos = document.getElementById("apellidos").value;
        const dni = document.getElementById("dni").value;
        const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
        const telefono = document.getElementById("telefono").value;
        const comentarios = document.getElementById("comentarios").value;

        // Validación de datos
        if (!validarDatos(dia, mes, anio, nombre, telefono)) {
            return;
        }

        // Crear objeto cita
        const nuevaCita = {
            id: Date.now(),
            fecha: `${dia}/${mes}/${anio}`,
            nombre: nombre,
            apellidos: apellidos,
            dni: dni,
            fechaNacimiento: fechaNacimiento,
            telefono: telefono,
            comentarios: comentarios
        };

        // Almacenar cita
        citas.push(nuevaCita);
        localStorage.setItem("citas", JSON.stringify(citas));
        citaForm.reset();
        cargarCitas();
    });

    // Función para cargar citas en la tabla
    function cargarCitas() {
        citasTableBody.innerHTML = ""; // Limpiar tabla
        if (citas.length === 0) {
            citasTableBody.innerHTML = "<tr><td colspan='9'>Dato vacío</td></tr>";
            return;
        }

        citas.forEach((cita, index) => {
            const row = citasTableBody.insertRow();
            row.insertCell(0).innerText = index + 1; // Orden
            row.insertCell(1).innerText = cita.fecha;
            row.insertCell(2).innerText = cita.nombre;
            row.insertCell(3).innerText = cita.apellidos;
            row.insertCell(4).innerText = cita.dni;
            row.insertCell(5).innerText = cita.fechaNacimiento;
            row.insertCell(6).innerText = cita.telefono;
            row.insertCell(7).innerText = cita.comentarios;

            // Botones de acción
            const accionesCell = row.insertCell(8);
            const btnEliminar = document.createElement("button");
            btnEliminar.innerText = "Eliminar";
            btnEliminar.onclick = () => eliminarCita(cita.id);
            accionesCell.appendChild(btnEliminar);

            const btnModificar = document.createElement("button");
            btnModificar.innerText = "Modificar";
            btnModificar.onclick = () => abrirModal(cita);
            accionesCell.appendChild(btnModificar);
        });
    }

    // Función para validar datos
    function validarDatos(dia, mes, anio, nombre, telefono) {
        let esValido = true;
        const errorMessages = [];

        if (!/^\d{9}$/.test(telefono)) {
            errorMessages.push("El teléfono debe ser un número de 9 dígitos.");
            esValido = false;
        }
        if (!esValido) {
            alert(errorMessages.join("\n"));
        }

        return esValido;
    }

    // Función para eliminar cita
    function eliminarCita(id) {
        citas = citas.filter(cita => cita.id !== id);
        localStorage.setItem("citas", JSON.stringify(citas));
        cargarCitas();
    }

    // Función para abrir el modal de modificación
    function abrirModal(cita) {
        document.getElementById("modal-dia").value = cita.fecha.split("/")[0]; // Solo el día
        citaActualId = cita.id; // Guardar el ID de la cita actual
        modal.style.display = "block";
    }

    // Evento para cerrar el modal
    cerrarModal.onclick = () => {
        modal.style.display = "none";
    };

    // Cerrar modal al hacer clic fuera de él
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Evento para guardar cambios en el modal
    guardarCambiosBtn.onclick = () => {
        const nuevoDia = document.getElementById("modal-dia").value;
        const citaIndex = citas.findIndex(cita => cita.id === citaActualId);
        if (citaIndex !== -1) {
            citas[citaIndex].fecha = `${nuevoDia}/${citas[citaIndex].fecha.split("/")[1]}/${citas[citaIndex].fecha.split("/")[2]}`;
            localStorage.setItem("citas", JSON.stringify(citas));
            cargarCitas();
            modal.style.display = "none"; // Cerrar el modal
        }
    };
});