import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/Ui/InputField";
import SelectField from "../../components/Ui/SelectField";
import TextareaField from "../../components/Ui/TextareaField";
import Button from "../../components/Ui/Button";

const CreateInvoice = ({ existingInvoice, onSave }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [formData, setFormData] = useState(
    existingInvoice || {
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      billFrom: {
        businessName: user?.businessName || "",
        email: user?.email || "",
        address: user?.address || "",
        phone: user?.phone || "",
      },
      billTo: { clientName: "", email: "", address: "", phone: "" },
      items: [{ name: "", quantity: 1, unitPrice: 0, taxPercent: 0 }],
      notes: "",
      paymentTerms: "Net 15",
    }
  );

  const [loading, setLoading] = useState(false);
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(
    !existingInvoice
  );

  useEffect(() => {
    const aiData = location.state?.aiData;

    if (aiData) {
      setFormData((prev) => ({
        ...prev,
        billTo: {
          clientName: aiData.clientName || "",
          email: aiData.email || "",
          address: aiData.address || "",
          phone: "",
        },
        items: aiData.items || [
          { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
        ],
      }));
    }

    if (existingInvoice) {
      setFormData({
        ...existingInvoice,
        invoiceDate: moment(existingInvoice.invoiceDate).format("YYYY-MM-DD"),
        dueDate: moment(existingInvoice.dueDate).format("YYYY-MM-DD"),
      });
    } else {
      const generateNewInvoiceNumber = async () => {
        setIsGeneratingNumber(true);
        try {
          const response = await axiosInstance.get(
            API_PATHS.INVOICE.GET_ALL_INVOICES
          );
          const invoices = response.data;
          let maxNum = 0;
          invoices.forEach((inv) => {
            const num = parseInt(inv.invoiceNumber.split("-")[1]);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          });

          const newInvoiceNumber = `INV-${String(maxNum + 1).padStart(3, "0")}`;
          setFormData((prev) => ({ ...prev, invoiceNumber: newInvoiceNumber }));
        } catch (err) {
          console.error("Failed to generate invoice number", err);
          setFormData((prev) => ({
            ...prev,
            invoiceNumber: `INV-${Date.now().toString().slice(-5)}`,
          }));
        }
        setIsGeneratingNumber(false);
      };

      generateNewInvoiceNumber();
    }
  }, [existingInvoice]);

  const handleInputChange = (e, section, index) => {
    const { name, value } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
    } else if (index !== undefined) {
      const newItems = [...formData.items];
      newItems[index] = { ...newItems[index], [name]: value };
      setFormData((prev) => ({ ...prev, items: newItems }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const { subtotal, taxTotal, total } = (() => {
    let subtotal = 0,
      taxTotal = 0;

    formData.items.forEach((item) => {
      const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
      subtotal += itemTotal;
      taxTotal += itemTotal * ((item.taxPercent || 0) / 100);
    });
    return { subtotal, taxTotal, total: subtotal + taxTotal };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const itemsWithTotal = formData.items.map((item) => ({
      ...item,
      total:
        (item.quantity || 0) *
        (item.unitPrice || 0) *
        (1 + (item.taxPercent || 0) / 100),
    }));

    const finalFormData = {
      ...formData,
      items: itemsWithTotal,
      subtotal,
      taxTotal,
      total,
    };

    if (onSave) {
      await onSave(finalFormData);
    } else {
      try {
        await axiosInstance.post(API_PATHS.INVOICE.CREATE, finalFormData);
        toast.success("Invoice created successfully!");
        navigate("/invoices");
      } catch (error) {
        toast.error("Failed to create invoice.");
        console.error(error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="mb-4 sm:mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl text-gray-900">
              {existingInvoice ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-light">
              {existingInvoice
                ? "Update your invoice details"
                : "Create a new invoice for your client"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || isGeneratingNumber}
            className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 h-11 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading || isGeneratingNumber ? (
              <Loader2 className="w-[18px] h-[18px] mr-2 animate-spin" />
            ) : null}
            {loading
              ? "Saving..."
              : existingInvoice
              ? "Save Changes"
              : "Save Invoice"}
          </button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
            <div className="py-4 px-4 sm:py-7 sm:px-8 space-y-6 sm:space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.invoiceNumber}
                    placeholder={isGeneratingNumber ? "Generating..." : ""}
                    className="w-full h-11 pl-3 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <InputField
                  label="Invoice Date"
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
              <div className="py-4 px-4 sm:py-7 sm:px-8 space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-lg sm:text-xl text-gray-900">
                    Bill From
                  </h4>
                  <p className="text-sm text-gray-500 mt-1.5 text-light">
                    Your business information
                  </p>
                </div>
                <div className="space-y-5 sm:space-y-6">
                  <InputField
                    label="Business Name"
                    name="businessName"
                    type="text"
                    value={formData.billFrom.businessName}
                    onChange={(e) => handleInputChange(e, "billFrom")}
                    placeholder="Your Company LLC"
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.billFrom.email}
                    onChange={(e) => handleInputChange(e, "billFrom")}
                    placeholder="you@company.com"
                  />
                  <TextareaField
                    label="Address"
                    name="address"
                    value={formData.billFrom.address}
                    onChange={(e) => handleInputChange(e, "billFrom")}
                    placeholder="123 Main St, Anytown, India"
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={formData.billFrom.phone}
                    onChange={(e) => handleInputChange(e, "billFrom")}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
              <div className="py-4 px-4 sm:py-7 sm:px-8 space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-lg sm:text-xl text-gray-900">Bill To</h4>
                  <p className="text-sm text-gray-500 mt-1.5 text-light">
                    Client information
                  </p>
                </div>
                <div className="space-y-5 sm:space-y-6">
                  <InputField
                    label="Client Name"
                    name="clientName"
                    type="text"
                    value={formData.billTo.clientName}
                    onChange={(e) => handleInputChange(e, "billTo")}
                    placeholder="Client Company"
                  />
                  <InputField
                    label="Client Email"
                    name="email"
                    type="email"
                    value={formData.billTo.email}
                    onChange={(e) => handleInputChange(e, "billTo")}
                    placeholder="client@company.com"
                  />
                  <TextareaField
                    label="Client Address"
                    name="address"
                    value={formData.billTo.address}
                    onChange={(e) => handleInputChange(e, "billTo")}
                    placeholder="456 Client St, City, Country"
                  />
                  <InputField
                    label="Client Phone"
                    name="phone"
                    type="tel"
                    value={formData.billTo.phone}
                    onChange={(e) => handleInputChange(e, "billTo")}
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
            <div className="py-4 px-4 sm:py-7 sm:px-8">
              <div className="mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl text-gray-900">Items</h4>
                <p className="text-sm text-gray-500 mt-1.5 text-light">
                  Add items or services to your invoice
                </p>
              </div>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="space-y-4">
                      <InputField
                        label="Item Name"
                        name="name"
                        type="text"
                        value={item.name}
                        onChange={(e) => handleInputChange(e, null, index)}
                        placeholder="Product or Service"
                      />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <InputField
                          label="Quantity"
                          name="quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleInputChange(e, null, index)}
                          placeholder="1"
                        />
                        <InputField
                          label="Unit Price"
                          name="unitPrice"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleInputChange(e, null, index)}
                          placeholder="0.00"
                        />
                        <InputField
                          label="Tax (%)"
                          name="taxPercent"
                          type="number"
                          value={item.taxPercent}
                          onChange={(e) => handleInputChange(e, null, index)}
                          placeholder="0"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total
                          </label>
                          <div className="w-full h-11 px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm flex items-center">
                            $
                            {(
                              (item.quantity || 0) *
                              (item.unitPrice || 0) *
                              (1 + (item.taxPercent || 0) / 100)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="inline-flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1.5" />
                          Remove Item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center justify-center px-4 py-2.5 h-11 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <Plus className="w-[18px] h-[18px] mr-2" />
                Add Item
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
              <div className="py-4 px-4 sm:py-7 sm:px-8 space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-lg sm:text-xl text-gray-900">
                    Notes & Terms
                  </h4>
                  <p className="text-sm text-gray-500 mt-1.5 text-light">
                    Additional information
                  </p>
                </div>
                <div className="space-y-5 sm:space-y-6">
                  <TextareaField
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes or instructions"
                  />
                  <SelectField
                    label="Payment Terms"
                    name="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    options={["Net 15", "Net 30", "Net 60", "Due on receipt"]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-sm shadow-gray-100 overflow-hidden">
              <div className="py-4 px-4 sm:py-7 sm:px-8 flex flex-col justify-center h-full">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium">${taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
