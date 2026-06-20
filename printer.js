const escpos = require("escpos");
escpos.USB = require("escpos-usb");

function printOrder(pedido) {
  return new Promise((resolve, reject) => {
    try {
      const device = new escpos.USB();
      const printer = new escpos.Printer(device);

      device.open(() => {
        printer
          .font("a")
          .align("ct")
          .size(1, 1)
          .text("🍔 NOVO PEDIDO")
          .text("----------------------")
          .text(`Mesa: ${pedido.numeroMesa}`)
          .text(`Status: ${pedido.status}`)
          .text("----------------------");

        pedido.itens.forEach((item) => {
          printer.text(
            `${item.quantidade}x ${item.nome} - R$ ${item.valorUnitario}`
          );
        });

        printer
          .text("----------------------")
          .text(`TOTAL: R$ ${pedido.valorTotal}`)
          .cut()
          .close();

        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { printOrder };