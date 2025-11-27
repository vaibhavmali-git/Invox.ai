import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { Plus, Trash2 } from "lucide-react";
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

  const handleInputChange = (e, section, index) => {};

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { name: "", quantity: 1, unitPrice: 0, taxPercent: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {};

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
  };

  return (
    <form onSubmit={handleSubmit} className="num">
      <div className="">
        <h2 className="">
          {existingInvoice ? "Edit Invoice" : "Create Invoice"}
        </h2>
        <Button type="submit" isLoading={loading || isGeneratingNumber}>
          {existingInvoice ? "Save Changes" : "Save Invoice"}
        </Button>
      </div>

      <div className="">
        <div className="">
          <InputField
            label="InvoiceNumber"
            name="invoiceNumber"
            readOnly
            value={formData.invoiceNumber}
            placeholder={isGeneratingNumber ? "Generating..." : ""}
            disabled
          />
          <InputField
            label="InvoiceDate"
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

      <div className="">
        <div className="">
          <h3>Bill From</h3>
          <InputField
            label="Business Name"
            name="businessName"
            value={formData.billFrom.businessName}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.billFrom.email}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <TextareaField
            label="Address"
            name="address"
            value={formData.billFrom.address}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.billFrom.phone}
            onChange={(e) => handleInputChange(e, "billFrom")}
          />
        </div>
        <div className="">
          <h3 className="">Bill To</h3>
          <InputField
            label="Client Name"
            name="clientName"
            value={formData.billTo.clientName}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
          <InputField
            label="Client Email"
            name="email"
            type="email"
            value={formData.billTo.clientEmail}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
           <TextareaField
            label="Client Address"
            name="address"
            value={formData.billTo.clientAddress}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
           <InputField
            label="Client Phone"
            name="phone"
            type="phone"
            value={formData.billTo.phone}
            onChange={(e) => handleInputChange(e, "billTo")}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
