const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterProvider = createProvider(BaileysProvider);

    const flowPrincipal = addKeyword(['hola cid'])
        .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
        .addAnswer('¿De qué empresa te comunicas?', { capture: true }, async (ctx) => {
            const empresa = ctx.body;
            const telefono = ctx.from;
        })
        .addAnswer('¿Cuál es tu nombre?', { capture: true }, async (ctx) => {
            const contacto = ctx.body;
        })
        .addAnswer('¿Cuál es tu correo electrónico?', { capture: true }, async (ctx) => {
            const correo = ctx.body;
        })
        .addAnswer('¿Podrías describir el problema?', { capture: true }, async (ctx) => {
            const descripcion = ctx.body;
        })
        .addAnswer('¿Cuál es el impacto del problema?', { capture: true }, async (ctx) => {
            const impacto = ctx.body;
        })
        .addAnswer('¿En qué software ocurrió el problema? (windows, mac, linux, ios, android)', { capture: true }, async (ctx) => {
            const so = ctx.body;
        })
        .addAnswer('¿Cuál es el tipo de dispositivo? (desktop, tablet, celular)', { capture: true }, async (ctx) => {
            const dispositivo = ctx.body;
        })
        .addAnswer('¿Cuál es la prioridad del problema? (baja, media, alta)', { capture: true }, async (ctx, { flowDynamic }) => {
            const prioridad = ctx.body;
        })
        .addAnswer(`
            - Empresa: ${empresa}
            - Nombre: ${nombre}
            - Correo: ${correo}
            - Teléfono: ${telefono}
            - Descripción del problema: ${descripcion}
            - Impacto: ${impacto}
            - Software: ${software}
            - Dispositivo: ${dispositivo}
            - Prioridad: ${prioridad}`);

    const adapterFlow = createFlow([flowPrincipal]);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
