const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal');
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const MockAdapter = require('@bot-whatsapp/database/mock');
const axios = require('axios');

const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterProvider = createProvider(BaileysProvider);

    const flowGeneral = addKeyword(['menu', 'opciones', 'menu cid', 'cid', 'ver menu', 'ver menú', 'ver opciones'])
        .addAnswer([
            'Bienvenido al bot 🤖 de *Centro Integral De Diseño*',
            '- Tienes *problemas* y quieres generar un reporte? --> envía: *reporte*',
            '- Estás interesado en los cursos? --> envía *Cursos*',
            '- Solicitar *factuta* 🧾 --> envía *factura*'
        ]);

    const flowFactura = addKeyword(['factura'])
        .addAnswer(
            'Hola 👋, te pediré unos datos para enviarte la factura!🧾'
        )
        .addAnswer(
            ['¿Cuál es tu constancia de situación fiscal?', 'Puedes enviarla en una imágen o con mensaje'],
            {
                capture: true,
            }
        )
        .addAnswer(
            '¿A qué correo te gustaría que te enviaramos tu factura?🧾',
            {
                capture: true
            }
        )
        .addAnswer(
            'Gracias! Pronto te enviaremos tu factura.'
        )

    const flowPrincipal = addKeyword(['reporte'])
        .addAnswer(
            ['Hola 👋, sentimos que estés teniendo problemas, pero intentaremos resolverlo.', 'A continuación haremos unas preguntas ❔ para recaudar información de tu problema y atenderlo de la mejor manera.🧐']
        )
        .addAnswer(
            '¿De qué empresa te estás comunicando?🏭',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ empresa: ctx.body });
                await state.update({ telefono: ctx.from });
            }
        )
        .addAnswer(
            '👷¿Cuál es tu nombre?👷‍♀️',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ contacto: ctx.body });
            }
        )
        .addAnswer(
            '¿Cuál es tu correo?📭',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ correo: ctx.body });
            }
        )
        .addAnswer(
            '¿Qué problemas tienes?✍️',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ descripcion: ctx.body });
            }
        )
        .addAnswer(
            '¿Nos puedes contar como te está afectando el problema?📈',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ impacto: ctx.body });
            }
        )
        .addAnswer(
            '💻¿En qué software estás encontrando el problema el problema? (windows, mac, linux, android, ios, no aplica)',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ so: ctx.body });
            }
        )
        .addAnswer(
            '¿En qué tipo de dispositivo encontró el problema?📱 (Desktop, tablet, celular, no aplica)',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ dispositivo: ctx.body });
            }
        )
        .addAnswer(
            '¿Cuál prioridad describiría mejor el problema?🚦 (Baja, media, alta)',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ prioridad: ctx.body });
            }
        )
        .addAnswer(
            '¿Tiene alguna información adicional que nos ayude a tener un mejor panorama 🌄 del problema?🗣️',
            {
                capture: true,
            },
            async (ctx, { state }) => {
                await state.update({ adicional: ctx.body });
                const myState = state.getMyState();

                const report = {
                    empresa: myState.empresa,
                    telefono: myState.telefono,
                    contacto: myState.contacto,
                    correo: myState.correo,
                    descripcion: myState.descripcion,
                    impacto: myState.impacto,
                    so: myState.so,
                    dispositivo: myState.dispositivo,
                    prioridad: myState.prioridad,
                    adicional: myState.adicional
                };
                console.log(report);
                await state.update({ resp: 'Pronto nos comunicaremos contigo' });
                /*
                try {
                    const response = await axios.post('http://localhost:4321/api/reportwhatsapp', report);
                    const ticketId = response.data.id;
                    await state.update({ resp: `Listo🤖, tu número de ticket es ${ticketId}` });
                } catch (error) {
                    console.error('Error al enviar el reporte:', error);
                    await state.update({ resp: `Listo🤖, tu número de ticket es ${ticketId}` });
                }*/
            }
        )
        .addAnswer(
            'Hemos recibido tu reporte!',
            null,
            async (ctx, { flowDynamic, state }) => {
                const resp = state.get('resp');
                await flowDynamic(`${resp}`);
            }
        );

    const adapterFlow = createFlow([flowGeneral, flowPrincipal, flowFactura]);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    QRPortalWeb();
};

main();
