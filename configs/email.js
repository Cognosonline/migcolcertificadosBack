import { Resend } from 'resend';

const resend = new Resend('re_K38qgxhK_59y91U2W89N1BXJry3rqFFZf');

/*(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['delivered@resend.dev'],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();*/

const sendEmail = async (email) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: 'manuel.mejia9604@outlook.es',
    subject: 'Cambio de contraseña',
    html: '<a href="http://localhost:3000/resetPass">Recuperar</a>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

export {
  sendEmail
}