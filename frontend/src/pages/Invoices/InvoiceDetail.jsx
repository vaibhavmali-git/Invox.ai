import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  Loader2,
  Edit,
  Printer,
  AlertCircle,
  Mail,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import CreateInvoice from "./CreateInvoice";
import Button from "../../components/Ui/Button";
import ReminderModal from "../../components/invoices/ReminderModal";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_INVOICE_BY_ID(id)
        );
        setInvoice(response.data)
      } catch (err) {
        toast.error("Failed to fetch invoice.")
        console.error(err)
      } finally{
        setLoading(false)
      }
    };

    fetchInvoice();
  }, [id]);

  const handleUpdate = async (formData) => {};

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if(!invoice){
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600"/>
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Invoice Not Found</h3>
        <p className="text-slate-500 mb-6 max-w-md">The invoice you are looking for does not exist or could not be loaded.</p>
        <Button onClick={()=>navigate('/invoices')}>Back to all Invoices</Button>
      </div>
    )
  }

  return <div>InvoiceDetail</div>;
};

export default InvoiceDetail;
