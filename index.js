const { db } = require("./firebase");
const queue = require("./queue");
const { printOrder } = require("./printer");
const { playNotification } = require("./sound");

console.log("🖨️ Printer-service iniciado...");

// 🔥 ESCUTA PEDIDOS EM TEMPO REAL
db.collection("pedidos")
  .where("status", "==", "NOVO")
  .onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const pedido = {
          id: change.doc.id,
          ...change.doc.data()
        };

        console.log("📥 Novo pedido:", pedido.id);

        // 🔔 som
        playNotification();

        // 📦 fila de impressão
        queue.add(async () => {
          await printOrder(pedido);

          // 🔄 atualiza status automaticamente
          await db.collection("pedidos").doc(pedido.id).update({
            status: "PREPARANDO",
            updatedAt: Date.now()
          });
        });
      }
    });
  });

// 🔁 RECONEXÃO AUTOMÁTICA
process.on("uncaughtException", (err) => {
  console.log("⚠️ erro:", err);
  console.log("🔄 reiniciando listener...");
});