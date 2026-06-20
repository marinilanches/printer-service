const escpos = require("escpos");
escpos.USB = require("escpos-usb");

module.exports = function print(pedido) {

  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    device.open(() => {

      printer
        .align("ct")
        .text("🍔 NOVO PEDIDO")
        .text("--------------------")
        .align("lt");

      pedido.itens.forEach(item => {
        printer.text(`${item.quantidade}x ${item.nome}`);
      });

      printer
        .text("--------------------")
        .text(`TOTAL: R$ ${pedido.valorTotal}`)
        .cut()
        .close();
    });

  } catch (err) {
    console.error("Erro na impressora:", err);
  }
};