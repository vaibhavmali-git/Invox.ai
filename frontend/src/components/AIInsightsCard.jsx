import { useState, useEffectEvent, useEffect } from "react";
import { Lightbulb, TrendingUp, Clock, Target } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const insightIcons = [
    { Icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
    { Icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { Icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );
        setInsights(response.data.insights || []);
      } catch (err) {
        console.error("Failed to fetch ai insights", err);
        setInsights([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const formatInsightText = (text) => {
    if (!text) return null;
    const regex = /(\$[\d,]+\.?\d*|#[\w-]+|\b\d+(?:%|\b))/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <span key={index} className="num font-bold text-slate-900">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm shadow-gray-100">
      <div className="flex items-center mb-4">
        <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />{" "}
        <h3 className="text-lg font-semibold text-slate-900">Smart Insights</h3>{" "}
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((insight, index) => {
            const { Icon, color } = insightIcons[index % insightIcons.length];
            return (
              <div key={index}>
                <div className="flex items-center">
                  <div className={`p-1 rounded-lg mr-3 shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed flex-1">
                    {formatInsightText(insight)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIInsightsCard;
