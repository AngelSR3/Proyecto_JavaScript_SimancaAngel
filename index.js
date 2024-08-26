const API_URL = 'https://66c707e9732bf1b79fa50ea9.mockapi.io/api/v1/resources';
let editResourceId = null;

// Función para obtener y mostrar los recursos
function fetchAndDisplayResources() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        displayResources(data);
    })
    .catch(error => console.error('Error:', error));
}

// Manejar el envío del formulario de nuevo recurso
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const genres = Array.from(document.querySelectorAll('#form input[name="genero"]:checked')).map(cb => cb.value);
    const platforms = Array.from(document.querySelectorAll('#form input[name="plataforma"]:checked')).map(cb => cb.value);
    const status = document.getElementById('estado').value;
    const format = document.getElementById('format').value;
    const date = document.getElementById('fecha').value;
    const rating = document.querySelector('#form input[name="rating"]:checked').value;
    const review = document.getElementById('review').value;

    const newResource = {
        name,
        genres,
        platforms,
        status,
        format,
        date,
        rating,
        review
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newResource)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Recurso añadido exitosamente!');
        document.getElementById('form').reset(); // Limpiar formulario
        fetchAndDisplayResources(); // Mostrar los recursos actualizados
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Función para mostrar los recursos en la lista
function displayResources(resources) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    
    resources.forEach(resource => {
        const item = document.createElement('div');
        item.className = 'recurso-item';
        item.innerHTML = `
        <h3>${resource.name}</h3>
        <p><strong>Género:</strong> ${resource.genres.join(', ')}</p>
        <p><strong>Plataforma:</strong> ${resource.platforms.join(', ')}</p>
        <p><strong>Estado:</strong> ${resource.status}</p>
        <p><strong>Formato:</strong> ${resource.format}</p>
        <p><strong>Fecha de Terminación:</strong> ${resource.date}</p>
        <p><strong>Valoración:</strong> ${'★'.repeat(resource.rating)}</p>
        <p><strong>Reseña:</strong> ${resource.review}</p>
        <button onclick='showEditForm(${JSON.stringify(resource)})'>Editar</button>
        `;
        lista.appendChild(item);
    });
}

// mostrar el formulario de edición
function showEditForm(resource) {
    document.getElementById('edit-form-container').style.display = 'block';
    document.getElementById('form').style.display = 'none';

    document.getElementById('edit-name').value = resource.name;
    setCheckboxValues('edit', resource.genres, 'genero');
    setCheckboxValues('edit', resource.platforms, 'plataforma');
    document.getElementById('edit-status').value = resource.status;
    document.getElementById('edit-format').value = resource.format;
    document.getElementById('edit-date').value = resource.date;
    document.querySelector(`input[name="rating"][value="${resource.rating}"]`).checked = true;
    document.getElementById('edit-review').value = resource.review;

    editResourceId = resource.id; // Guardar el ID del recurso para la edición
}

// Función para ocultar el formulario de edición
function hideEditForm() {
    document.getElementById('edit-form-container').style.display = 'none';
    document.getElementById('form').style.display = 'block';
}

// Función para establecer los valores de los checkboxes
function setCheckboxValues(prefix, values, name) {
    // Obtener todos los checkboxes
    const checkboxes = document.querySelectorAll(`#${prefix}-form input[name="${name}"]`);

    // Marcar o desmarcar los checkboxes según los valores
    checkboxes.forEach(checkbox => {
        checkbox.checked = values.includes(checkbox.value);
    });
}

// Manejar el envío del formulario de edición
document.getElementById('edit-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Recopilación de datos del formulario de edición
    const name = document.getElementById('edit-name').value;
    const genres = Array.from(document.querySelectorAll('#edit-form input[name="genero"]:checked')).map(cb => cb.value);
    const platforms = Array.from(document.querySelectorAll('#edit-form input[name="plataforma"]:checked')).map(cb => cb.value);
    const status = document.getElementById('edit-status').value;
    const format = document.getElementById('edit-format').value;
    const date = document.getElementById('edit-date').value;
    const rating = document.querySelector('#edit-form input[name="rating"]:checked').value;
    const review = document.getElementById('edit-review').value;
    const updatedData = {
        name,
        genres,
        platforms,
        status,
        format,
        date,
        rating,
        review
    };

    fetch(`${API_URL}/${editResourceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Recurso editado exitosamente!');
        hideEditForm();
        fetchAndDisplayResources(); // Mostrar los recursos actualizados
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Manejar el botón de cancelar en el formulario de edición
document.getElementById('cancel-edit').addEventListener('click', function() {
    hideEditForm();
});

// Inicializar la vista
fetchAndDisplayResources();