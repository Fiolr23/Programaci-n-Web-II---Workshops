// Verificar si hay token al cargar cualquier página
if (!sessionStorage.getItem("token")) {
  alert("Debe iniciar sesión");
  window.location.href = "login.html";
}

// Todas las peticiones incluyen el header Authorization
// con el token guardado en sessionStorage.
// Esto permite acceder a rutas protegidas del backend.

// CARGAR PROFESORES
function loadProfesores() {

  fetch("http://localhost:3001/profesor", {
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
  .then(res => res.json())
  .then(data => {

    const select = document.getElementById("profesorId");

    if (!select) return;

    select.innerHTML = "<option value=''>Seleccione un profesor</option>";

    data.forEach(profesor => {
      select.innerHTML += `
        <option value="${profesor._id}">
          ${profesor.name} ${profesor.apellido}
        </option>
      `;
    });

  })
  .catch(err => console.log(err));
}

// CREAR CURSO
function createCourse() {

    const name = document.getElementById("name").value;
    const code = document.getElementById("code").value;
    const descripcion = document.getElementById("descripcion").value;
    const profesorId = document.getElementById("profesorId").value;

    fetch("http://localhost:3001/course", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify({ name, code, descripcion, profesorId })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result").innerHTML =
          `<p>
            <b>${data.name}</b><br>
            Código: ${data.code}<br>
            Descripción: ${data.descripcion}<br>
            Profesor: ${data.profesorId}
          </p>`;
    })
    .catch(error => console.log("Error:", error));
}

// LISTAR CURSOS
function getCourses() {

  fetch("http://localhost:3001/course", {
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
    .then(response => response.json())
    .then(data => {

      let result = `
        <table border="1" cellpadding="8">
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Descripción</th>
            <th>Profesor ID</th>
            <th>Acciones</th>
          </tr>
      `;

      data.forEach(course => {
        result += `
          <tr>
            <td>${course.name}</td>
            <td>${course.code}</td>
            <td>${course.descripcion}</td>
            <td>${course.profesorId}</td>
            <td>
              <button onclick="goEdit('${course._id}')">Editar</button>
              <button onclick="deleteCourse('${course._id}')">Eliminar</button>
            </td>
          </tr>
        `;
      });

      result += `</table>`;

      document.getElementById("result").innerHTML = result;
    })
    .catch(error => console.log("Error:", error));
}

// ELIMINAR CURSO
function deleteCourse(id) {

  if (!confirm("¿Eliminar curso?")) return;

  fetch(`http://localhost:3001/course/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
  .then(() => {
    getCourses();
  })
  .catch(error => console.log("Error:", error));
}

// IR A EDITAR
function goEdit(id) {
    localStorage.setItem("editCourseId", id);
    window.location.href = "edit_course.html";
}

// ACTUALIZAR CURSO
function updateCourse() {

  const id = localStorage.getItem("editCourseId");

  const name = document.getElementById("name").value;
  const code = document.getElementById("code").value;
  const descripcion = document.getElementById("descripcion").value;
  const profesorId = document.getElementById("profesorId").value;

  fetch(`http://localhost:3001/course/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    },
    body: JSON.stringify({ name, code, descripcion, profesorId })
  })
  .then(res => res.json())
  .then(() => {
    alert("Curso actualizado");
    window.location.href = "list_courses.html";
  })
  .catch(err => console.log(err));
}

// CARGAR CURSO PARA EDITAR
function cargarCursoParaEditar() {

  const id = localStorage.getItem("editCourseId");

  if (!id) {
    alert("No hay ID del curso");
    return;
  }

  fetch(`http://localhost:3001/course?id=${id}`, {
    headers: {
      "Authorization": "Bearer " + sessionStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(course => {

      document.getElementById("name").value = course.name;
      document.getElementById("code").value = course.code;
      document.getElementById("descripcion").value = course.descripcion;

      // Cargar profesores y luego seleccionar el correcto
      loadProfesores();

      setTimeout(() => {
        document.getElementById("profesorId").value = course.profesorId;
      }, 300);

    })
    .catch(err => console.log(err));
}

// WINDOW ONLOAD
window.onload = function() {

  if (document.getElementById("profesorId")) {
    loadProfesores();
  }

  if (document.getElementById("result")) {
    getCourses();
  }

};