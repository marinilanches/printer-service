const admin = require("firebase-admin");
const serviceAccount = require("./firebaseKey.json");

// Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ESC/POS (impressora térmica)
const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const device = new escpos.USB();
const printer = new escpos.Printer(device);

// 🔥 ESCUTA PEDIDOS EM TEMPO REAL
db.collection("pedidos")
  .where("status", "==", "NOVO")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === "added") {
        const pedido = change.doc.data();

        printPedido(pedido);

        // atualiza status para não imprimir duas vezes
        change.doc.ref.update({
          status: "IMPRESSO"
        });
      }
    });
  });

// 🖨️ FUNÇÃO DE IMPRESSÃO
function printPedido(pedido) {
  device.open(() => {
    printer
      .font("a")
      .align("ct")
      .size(1, 1)
      .text("🍔 NOVO PEDIDO")
      .text("------------------------")
      .align("lt");

    pedido.itens.forEach(item => {
      printer.text(
        `${item.quantidade}x ${item.nome} - R$ ${item.valorUnitario}`
      );
    });

    printer
      .text("------------------------")
      .text(`TOTAL: R$ ${pedido.valorTotal}`)
      .text(`Mesa: ${pedido.mesaId || "Delivery"}`)
      .text(new Date().toLocaleString())
      .cut()
      .close();
  });
}