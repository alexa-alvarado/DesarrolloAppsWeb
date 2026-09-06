const botonActualizar = document.getElementById('btn-actualizar');

const urlBanderaMX = 'img/MX.jpg';
const urlBanderaUS = 'img/EU.jpg';
const urlBanderaJP = 'img/JPN.jpg';

function colocarBanderas() {
    document.querySelectorAll('.bandera-mx').forEach(img => img.src = urlBanderaMX);
    document.querySelectorAll('.bandera-us').forEach(img => img.src = urlBanderaUS);
    document.querySelectorAll('.bandera-jp').forEach(img => img.src = urlBanderaJP);
}

async function consultarTipoDeCambio() {
    try {
        const respuesta = await fetch('https://api.exchangerate-api.com/v4/latest/MXN');
        const datos = await respuesta.json();
        const tasaUSD = datos.rates.USD;
        const tasaJPY = datos.rates.JPY;
        const tarjetas = document.querySelectorAll('.tarjeta');

        tarjetas.forEach(tarjeta => {
            const precioMXN = parseFloat(tarjeta.getAttribute('data-mxn'));
            const precioUSD = precioMXN * tasaUSD;
            const precioJPY = precioMXN * tasaJPY;

            tarjeta.querySelector('.val-mxn').textContent = precioMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 });
            tarjeta.querySelector('.val-usd').textContent = precioUSD.toFixed(2);
            tarjeta.querySelector('.val-jpy').textContent = Math.round(precioJPY).toLocaleString('es-MX');
        });

        console.log("Precios actualizados mediante API REST correctamente.");
    } catch (error) {
        console.error("Error al conectar con la API de divisas:", error);
        alert("No se pudo conectar con el servicio de tipo de cambio.");
    }
}

window.addEventListener('DOMContentLoaded', colocarBanderas);
window.addEventListener('DOMContentLoaded', consultarTipoDeCambio);

botonActualizar.addEventListener('click', consultarTipoDeCambio);