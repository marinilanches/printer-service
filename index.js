const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

const db = admin.firestore();

db.collection("pedidos").onSnapshot((snap) => {
  snap.docChanges().forEach(change => {
    if (change.type === "added") {
      imprimir(change.doc.data());
    }
  });
});

function imprimir(pedido) {
  console.log("🖨️ IMPRIMINDO:", pedido);
}