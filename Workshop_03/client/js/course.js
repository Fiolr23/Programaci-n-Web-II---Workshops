// CREAR CURSO
function createCourse() {
    const name = document.getElementById("name").value;
    const code = document.getElementById("code").value;
    const descripcion = document.getElementById("descripcion").value;
    const profesorId = document.getElementById("profesorId").value;
    //Peticion HTTP 
    fetch("http://localhost:3001/course", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, code, descripcion, profesorId })
    })
    .then(response => response.json())
    //recibe el curso creado y lo muestra en pantalla
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
  fetch("http://localhost:3001/course")
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
      //recorre todos los cursos
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
window.onload = getCourses;


// ELIMINAR CURSO
function deleteCourse(id) {
  if (!confirm("¿Eliminar curso?")) return;
  fetch(`http://localhost:3001/course/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    getCourses(); // refresca la lista
  })
  .catch(error => console.log("Error:", error));
}

// IR A EDITAR
function goEdit(id) {
    //guarda el id y redirige a la página editar
    localStorage.setItem("editCourseId", id);
    window.location.href = "edit_course.html";
}

// ACTUALIZAR CURSO
function updateCourse() {
  //obtiene el id guardado
  const id = localStorage.getItem("editCourseId");
  const name = document.getElementById("name").value;
  const code = document.getElementById("code").value;
  const descripcion = document.getElementById("descripcion").value;
  const profesorId = document.getElementById("profesorId").value;

  fetch(`http://localhost:3001/course/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, code, descripcion, profesorId })
  })
  .then(res => res.json())
  .then(() => {
    alert("Curso actualizado");
    window.location.href = "list_courses.html";
  })
  .catch(err => console.log(err));
}

//Función para que se muestren los datos en la pantalla de editar cursos
function cargarCursoParaEditar() {
  const id = localStorage.getItem("editCourseId");
  if (!id) {
    alert("No hay ID del curso");
    return;
  }
  fetch(`http://localhost:3001/course?id=${id}`)
    .then(res => res.json())
    .then(course => {
      console.log("CURSO:", course);

      document.getElementById("name").value = course.name;
      document.getElementById("code").value = course.code;
      document.getElementById("descripcion").value = course.descripcion;
      document.getElementById("profesorId").value = course.profesorId;
    })
    .catch(err => console.log(err));
}
