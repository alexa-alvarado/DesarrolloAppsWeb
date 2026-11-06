<script setup>
import { ref, nextTick } from 'vue';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import JsBarcode from 'jsbarcode';

const EMPRESA = 'ESCUELA DE TECNOLOGIAS';
const LEMA = 'Universidad Autónoma de Chiapas';

const barcode = ref(null);
const mensaje = ref('');
const tarjeta = ref(null);

const formulario = ref({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: null,
    rfc: ''
});

const generarTarjeta = async () => {
    const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, rfc } = formulario.value;

    if (!nombre.trim() || !apellidoPaterno.trim() || !apellidoMaterno.trim() || !fechaNacimiento || !rfc.trim()) {
        mensaje.value = 'Completa todos los campos para generar la tarjeta.';
        return;
    }

    mensaje.value = '';
    const rfcLimpio = rfc.trim().toUpperCase();

    tarjeta.value = {
        nombre: nombre.trim().toUpperCase(),
        apellidos: `${apellidoPaterno.trim()} ${apellidoMaterno.trim()}`.toUpperCase(),
        fechaNacimiento,
        rfc: rfcLimpio
    };

    await nextTick();

    try {
        JsBarcode(barcode.value, rfcLimpio, {
            format: 'CODE128',
            width: 1.5,
            height: 48,
            displayValue: true,
            fontSize: 11,
            margin: 2
        });
    } catch (e) {
        mensaje.value = 'El RFC contiene caracteres no válidos para el código de barras.';
    }
};
</script>

<template>
    <div class="empleado-page">
        <div class="panel formulario-panel">
            <h2>GENERAR EL RFC DE UNA PERSONA</h2>

            <form @submit.prevent="generarTarjeta">
                <div class="campo">
                    <label>Nombre(s):</label>
                    <InputText v-model="formulario.nombre" placeholder="Ej. Susana" fluid />
                </div>

                <div class="campo">
                    <label>Apellido Paterno:</label>
                    <InputText v-model="formulario.apellidoPaterno" placeholder="Ej. Rojas" fluid />
                </div>

                <div class="campo">
                    <label>Apellido Materno:</label>
                    <InputText v-model="formulario.apellidoMaterno" placeholder="Ej. Merida" fluid />
                </div>

                <div class="campo">
                    <label>Fecha Nacimiento:</label>
                    <DatePicker
                        v-model="formulario.fechaNacimiento"
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/aaaa"
                        showIcon
                        fluid
                    />
                </div>

                <div class="campo">
                    <label>RFC:</label>
                    <InputText
                        v-model="formulario.rfc"
                        placeholder="Ej. ROMS920822MCSRRS09"
                        maxlength="18"
                        fluid
                    />
                </div>

                <p v-if="mensaje" class="mensaje-error">{{ mensaje }}</p>

                <Button type="submit" label="GENERAR" severity="success" class="boton-generar" />
            </form>
        </div>

        <div class="panel tarjeta-panel">
            <h2>TARJETA DIGITAL</h2>

            <div class="tarjeta">
                <!-- Banner superior con curvatura fluida SVG -->
                <div class="header-banner">
                    <svg class="header-bg" viewBox="0 0 300 130" preserveAspectRatio="none">
                        <path fill="#07304b" d="M0,0 L300,0 L300,105 Q150,130 0,105 Z"></path>
                        <path fill="#0874b9" opacity="0.35" d="M0,0 L300,0 L300,115 Q150,140 0,115 Z"></path>
                    </svg>

                    <div class="encabezado">
                        <i class="pi pi-building logo"></i>
                        <div class="info-empresa">
                            <strong>{{ EMPRESA }}</strong>
                            <small>{{ LEMA }}</small>
                        </div>
                    </div>
                </div>

                <!-- Avatar superpuesto proporcionalmente -->
                <div class="avatar-wrapper">
                    <div class="avatar">
                        <i class="pi pi-user"></i>
                    </div>
                </div>

                <!-- Cuerpo con tipografía clara y contrastada -->
                <div class="cuerpo-tarjeta">
                    <div class="datos">
                        <h3 class="nombre">{{ tarjeta?.nombre || 'NOMBRE' }}</h3>
                        <h4 class="apellidos">{{ tarjeta?.apellidos || 'APELLIDOS' }}</h4>
                        <span class="badge-cargo">Empleado/a</span>
                        <div class="identificador-box">
                            <span class="label-id">ID / RFC</span>
                            <span class="valor-id">{{ tarjeta?.rfc || 'XXXXXXXXXXXXXXXXXX' }}</span>
                        </div>
                    </div>

                    <div class="codigo-barras">
                        <svg ref="barcode"></svg>
                    </div>
                </div>

                <div class="barra-pie"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.empleado-page {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(300px, 1fr);
    gap: 1.5rem;
    align-items: start;
}

.panel {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
}

.panel h2 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 1rem;
}

.campo {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.1rem;
}

.campo label {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.boton-generar {
    width: 45%;
    margin-top: 0.4rem;
}

.mensaje-error {
    color: #dc2626;
    font-size: 0.85rem;
}

.tarjeta-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tarjeta-panel h2 {
    align-self: flex-start;
}

/* ---- Tarjeta Rediseñada ---- */
.tarjeta {
    position: relative;
    width: 290px;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(7, 48, 75, 0.15);
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e8f0;
}

.header-banner {
    position: relative;
    height: 110px;
    width: 100%;
}

.header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.encabezado {
    position: relative;
    z-index: 2;
    padding: 1rem 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: white;
}

.encabezado .logo {
    font-size: 1.8rem;
    color: #38bdf8;
}

.info-empresa strong {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.2;
}

.info-empresa small {
    display: block;
    font-size: 0.58rem;
    opacity: 0.85;
}

.avatar-wrapper {
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    margin-top: -45px;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #f8fafc;
    border: 4px solid #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0874b9;
    font-size: 2.8rem;
}

.cuerpo-tarjeta {
    padding: 0.75rem 1.2rem 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
}

.datos {
    text-align: center;
    width: 100%;
}

.nombre {
    margin: 0;
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.2px;
}

.apellidos {
    margin: 0.1rem 0 0.5rem;
    color: #334155;
    font-size: 0.95rem;
    font-weight: 600;
}

.badge-cargo {
    display: inline-block;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 0.2rem 0.75rem;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.6rem;
}

.identificador-box {
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    padding: 0.4rem 0.6rem;
    border-radius: 8px;
    margin-top: 0.2rem;
}

.label-id {
    font-size: 0.6rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.valor-id {
    font-size: 0.82rem;
    font-weight: 700;
    color: #07304b;
    font-family: monospace;
}

.codigo-barras {
    width: 100%;
    display: flex;
    justify-content: center;
    background: #ffffff;
    padding: 0.2rem 0;
}

.codigo-barras svg {
    max-width: 100%;
    height: auto;
}

.barra-pie {
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #07304b 0%, #0874b9 100%);
}

@media (max-width: 850px) {
    .empleado-page {
        grid-template-columns: 1fr;
    }
}
</style>