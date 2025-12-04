import React, { useEffect, useState, useMemo, useRef } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  Loader2,
  Trash2,
  Edit,
  Search,
  FileText,
  Plus,
  AlertCircle,
  Sparkles,
  Mail,
} from "lucide-react";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Ui/Button";
import CreateWithAIModal from "../../components/Invoices/CreateWithAIModal";
import ReminderModal from "../../components/Invoices/ReminderModal";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [statusFilter, setStatusFilter] = useState("All");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();

      const len = searchInputRef.current.value.length;
      searchInputRef.current.setSelectionRange(len, len);
    }
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        setInvoices(
          response.data.sort(
            (a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)
          )
        );
      } catch (err) {
        setError("Failed to fetch invoices,");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));
        setInvoices(invoices.filter((invoice) => invoice._id !== id));
      } catch (err) {
        setError("Failed to delete the invoice");
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (invoice) => {
    setStatusChangeLoading(invoice._id);
    try {
      const newStatus = invoice.status === "Paid" ? "Unpaid" : "Paid";
      const updatedInvoice = { ...invoice, status: newStatus };
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(invoice._id),
        updatedInvoice
      );

      setInvoices(
        invoices.map((inv) => (inv._id === invoice._id ? response.data : inv))
      );
    } catch (err) {
      setError("Failed to update invoice status.");
      console.error(err);
    } finally {
      setStatusChangeLoading(null);
    }
  };

  const handleOpenReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderModalOpen(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(
        (invoice) => statusFilter === "All" || invoice.status === statusFilter
      )
      .filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.billTo.clientName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
  }, [invoices, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] w-full gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
        <p className="text-sm text-slate-800 font-medium">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreateWithAIModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-gray-900">All Invoices</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all your invoices in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsAiModalOpen(true)}
            icon={Sparkles}
          >
            Create with AI
          </Button>
          <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
            Create Invoice
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="py-5 pt-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by invoice # or client..."
                className="w-full h-11 pl-10 pr-4 p-4 border border-slate-200 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-100 text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative flex-shrink-0">
              <select
                className="
                  appearance-none 
                  w-full sm:w-auto h-11 
                  px-4 pr-8 
                  border border-gray-200 
                  rounded-lg 
                  bg-white 
                  text-sm text-gray-900 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-red-100
                    "
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.086l3.71-3.855a.75.75 0 111.08 1.04l-4.24 4.41a.75.75 0 01-1.08 0l-4.24-4.41a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 border border-gray-200 shadow-sm shadow-gray-100">
              <FileText className="w-8 h-8 text-gray-800" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2 ">No invoices found</h3>
            <p className="text-gray-500 mb-6 max-w-md text-sm">
              Your search or filter criteria did not match any invoices. Try
              adjusting your search.
            </p>
            {invoices.length === 0 && (
              <Button onClick={() => navigate("/invoices/new")} icon={Plus}>
                Create First Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="w-[90vw] md:w-auto overflow-x-auto border border-gray-200 rounded-lg my-3">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-slate-50">
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer "
                    >
                      {invoice.invoiceNumber}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm  text-gray-600 cursor-pointer"
                    >
                      {invoice.billTo.clientName}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm  text-gray-600 cursor-pointer "
                    >
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="px-6 py-4 whitespace-nowrap text-sm  text-gray-600 cursor-pointer "
                    >
                      {moment(invoice.dueDate).format("MMM D YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : invoice.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div
                        className="flex items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => handleStatusChange(invoice)}
                          isLoading={statusChangeLoading === invoice._id}
                        >
                          {invoice.status === "Paid"
                            ? "Mark Unpaid"
                            : "Mark Paid"}
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => navigate(`/invoices/${invoice._id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => handleDelete(invoice._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                        {invoice.status !== "Paid" && (
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleOpenReminderModal(invoice._id)}
                            title="Generate Reminder"
                          >
                            <Mail className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInvoices;
