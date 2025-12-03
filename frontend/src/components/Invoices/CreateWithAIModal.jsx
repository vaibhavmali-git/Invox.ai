import { useState } from "react";
import { Sparkles, Text, X  } from "lucide-react";
import Button from "../Ui/Button";
import TextareaField from "../Ui/TextareaField";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateWithAIModal = ({ isOpen, onClose }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please paste some text to generate invoice.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.PARSE_INVOICE_TEXT,
        { text }
      );
      const invoiceData = response.data;

      toast.success("Invoice data extracted successfully!");
      onClose();

      /* navigate to create invoice page with the parsed data*/
      navigate("/invoices/new", { state: { aiData: invoiceData } });
    } catch (err) {
      toast.error("Failed to generate invoice from text.");
      console.error("AI parsing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-50 transition-opacity backdrop-blur-[3px]"
          onClick={onClose}
        ></div>

        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative text-left transform transition-all border  border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900 flex items-center">
              <Sparkles className="w-5 h-5 text-gray-800 mr-2 bg-white" /> Create Invoice
              with AI
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 -mt-2"
            >
              <X  className="w-4 h-4"/>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-light">
              Paste any text that contains invoice details (like client name,
              items, quantities, and prices) and the AI will attempt to create
              an invoice from it.
            </p>
            <TextareaField
              name="invoiceText"
              label="Paste Invoice Text Here"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              placeholder="e.g., 'Invoice for ClientCorp: 2 hours of design work at $150/hr and 1 logo for $800'"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} isLoading={isLoading}>
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWithAIModal;
