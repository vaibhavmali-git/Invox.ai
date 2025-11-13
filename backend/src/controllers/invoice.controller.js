import Invoice from "../models/invoice.model.js";

/* @desc Create new Invoice
   @route POST /api/invoices
   @access Private */
export const createInvoice = async (req, res) => {
  try {
    const user = req.user;
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

    /* subtotal calculation */
    let subTotal = 0;
    let taxTotal = 0;

    items.forEach((item) => {
      subTotal += item.unitPrice * item.quantity;
      taxTotal +=
        (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
    });

    const total = subTotal + taxTotal;

    const invoice = new Invoice({
      user,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subTotal,
      taxTotal,
      total,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error creating invoice", error: e.message });
  }
};

/* @desc Get all invoices of logged in users
   @route GET /api/invoices
   @access Private */
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("user", "name email");
    res.json(invoices);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching invoice", error: e.message });
  }
};

/* @desc Get single invoice by Id
   @route GET /api/invoices/:id
   @access Private */
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching invoice", error: e.message });
  }
};

/* @desc Update Invoice
   @route PUT /api/invoices/:id
   @access Private */
export const updateInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
    } = req.body;

    /* recalculate totals if items changed */
    let subTotal = 0;
    let taxTotal = 0;

    if (items && items.length > 0) {
      items.forEach((item) => {
        subTotal += item.unitPrice * item.quantity;
        taxTotal +=
          (item.unitPrice * item.quantity * (item.taxPercent || 0)) / 100;
      });
    }

    const total = subTotal + taxTotal;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        invoiceNumber,
        invoiceDate,
        dueDate,
        billFrom,
        billTo,
        items,
        notes,
        paymentTerms,
        status,
        subTotal,
        taxTotal,
        total,
      },
      { new: true }
    );

    if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });

    res.json(updatedInvoice);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error updating invoice", error: e.message });
  }
};

/* @desc Delete invoice
   @route DELETE /api/invoices/:id
   @access Private */
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
     if (!invoice) return res.status(404).json({ message: "Invoice not found" });

     res.json({message:"Invoice deleted successfully"})
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error deleting invoice", error: e.message });
  }
};
