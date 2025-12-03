import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import {
  Loader2,
  FileText,
  Plus,
  BanknoteArrowUp,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Button from "../../components/Ui/Button";
import AIInsightsCard from "../../components/AIInsightsCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalUnpaid: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.INVOICE.GET_ALL_INVOICES
        );
        const invoices = response.data;

        const totalInvoices = invoices.length;

        const totalPaid = invoices
          .filter((inv) => inv.status === "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);

        const totalUnpaid = invoices
          .filter((inv) => inv.status !== "Paid")
          .reduce((acc, inv) => acc + inv.total, 0);

        setStats({ totalInvoices, totalPaid, totalUnpaid });

        setRecentInvoices(
          invoices
            .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsData = [
    {
      icon: FileText,
      label: "Total Invoices",
      value: stats.totalInvoices,
      color: "red",
    },
    {
      icon: BanknoteArrowUp,
      label: "Total Paid",
      value: `${stats.totalPaid.toFixed(2)}`,
      color: "emerald",
    },
    {
      icon: Clock3,
      label: "Total Unpaid",
      value: `${stats.totalUnpaid.toFixed(2)}`,
      color: "red",
    },
  ];

  const colorClasses = {
    red: { bg: "bg-red-100", text: "text-red-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl  text-gray-900">Overview</h2>
        <p className="text-sm text-gray-600 mt-1 font-light">
          A quick overview of business finances.
        </p>
      </div>

      {/* stats cards  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white border border-slate-200 rounded-lg p-6">
        {statsData.map((stat, index) => (
          <div key={index}>
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-12 h-12
                 border border-gray-200 rounded-[50%] flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 `} />
              </div>

              <div className="ml-4 min-w-0 space-y-1">
                <div className="text-sm  text-gray-500 truncate">
                  {stat.label}
                </div>
                <div className="text-3xl text-gray-900 wrap-break-word ">
                  {stat.label === "Total Invoices"
                    ? stat.value
                    : `$${stat.value}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ai insights card  */}
      <AIInsightsCard />

      {/* Recent invoices  */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Invoices
          </h2>
          <button
            onClick={() => navigate("/invoices")}
            className="text-sm text-amber-800 hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.billTo.clientName}
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">
                        #{invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 ">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 ">
                      {moment(invoice.dueDate).format("MMM D, YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 border border-gray-200 shadow-sm shadow-gray-100">
              <FileText className="w-6 h-6 text-gray-800" />
            </div>
            <h3 className="text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              You haven't created any invoices yet. Get started by creating your
              first one.
            </p>
            <Button
              onClick={() => navigate("/invoices/new")}
              icon={Plus}
              size="small"
            >
              Create Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
