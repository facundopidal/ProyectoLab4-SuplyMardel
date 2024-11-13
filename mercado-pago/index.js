import express from 'express';
import { MercadoPagoConfig, Preference, MerchantOrder } from 'mercadopago';
import cors from 'cors'

const app = express();
const PORT = 3003;



// Configura el cliente de MercadoPago con el Access Token
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-4202869293381708-110815-773c915b5e1b2f20d2d7c180c8456f98-2086871000', // Reemplaza con tu token real
});

app.use(express.json());

app.use(cors());

// Endpoint para crear una preferencia de pago
app.post("/create_preference", async (req, res) => {
  console.log("Datos recibidos en req", req.body);
  const mpItems = []
  
  for (let i = 0; i < req.body.length; i++) {
    const { name, quantity, price, description } = req.body[i];
    mpItems.push({
      title: name,
      quantity: quantity,
      unit_price: price,
      description: description
    })
    // Validación básica
    if (!name || !quantity || !price || !description) {
      return res.status(400).json({ error: 'Faltan datos: nombre, cantidad o precio.' });
    }
  }

  // Crea una instancia de Preference con el cliente configurado
  const preference = new Preference(client);

  try {
    // Crea la preferencia de pago
    const response = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: "http://localhost:4200/successful-purchase",  // URL cuando el pago es exitoso
          failure: "http://localhost:4200/failure",  // URL cuando el pago falla
          pending: "http://localhost:4200/pending",   // URL cuando el pago está pendiente
        },
        payer: {
          first_name: "Juan",
          last_name: "Perez",
          email: "test_user_12345@testuser.com",
          identification: {
              type: "ID",
              number: 1
          }
      },
        auto_return: "approved",
        notification_url: "https://lcvt5tbh-8000.brs.devtunnels.ms/notifications", // URL para recibir notificaciones de Mercado Pago
      }
    });

    // Imprime la respuesta completa para depuración
    console.log("Respuesta de Mercado Pago completa:", JSON.stringify(response, null, 2));

    // Verificamos si la respuesta contiene las propiedades necesarias
    if (response.id && response.init_point) {
      res.status(200).json({
        id: response.id,
        init_point: response.init_point, // URL para redirigir al checkout
      });
    } else {
      console.error("La respuesta no contiene los datos esperados:", response);
      res.status(500).json({
        error: "Error en la creación de la preferencia. Datos faltantes en la respuesta.",
        response: response.body ? response.body : "Respuesta inesperada",
      });
    }
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/merchant-order/:id", async(req,res) => {
  console.log(req.params.id)
  const order = new MerchantOrder(client)
  console.log(order)
  
  try {
    order.get({ merchantOrderId: req.params.id}).then(response => {
      console.log(response)
      res.json(response)
    })
    
  } catch (error) {
    console.log(error)
  }
})


// Endpoint para recibir notificaciones de Mercado Pago
app.post("/notifications", (req, res) => {
  // Mercado Pago enviará información sobre el estado del pago aquí
  console.log("req: ",req)
  const paymentInfo = req.body;

  console.log("Notificación de Mercado Pago:", paymentInfo);

  // Dependiendo del estado del pago, puedes tomar diferentes acciones
  if (paymentInfo.status === "approved") {
    console.log("Pago aprobado:", paymentInfo);
    // Aquí puedes actualizar el estado de la compra en tu base de datos, por ejemplo
  } else if (paymentInfo.status === "pending") {
    console.log("Pago pendiente:", paymentInfo);
    // Aquí puedes manejar los pagos pendientes
  } else if (paymentInfo.status === "rejected") {
    console.log("Pago rechazado:", paymentInfo);
    // Aquí puedes manejar los pagos rechazados
  }


  // Responde a Mercado Pago para confirmar que recibiste la notificación
  res.status(200).send('ok');
});




// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
