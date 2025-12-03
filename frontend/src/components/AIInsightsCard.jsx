import { useState, useEffect } from "react";
import { TrendingUp, Clock, Target, AlertTriangle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const AIInsightsCard = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const insightIcons = [
    {
      Icon: Target,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-200",
    },
    {
      Icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      Icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  ];

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.AI.GET_DASHBOARD_SUMMARY
        );
        setInsights(response.data.insights || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch ai insights", err);

        const status = err?.response?.status;

        if (status === 429) {
          setError(
            "You’ve reached the AI usage limit. Please try again shortly."
          );
        } else if (status === 500) {
          setError(
            "AI insights are temporarily unavailable. Please try again later."
          );
        } else {
          setError("Unable to load AI insights right now.");
        }

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
          <span key={index} className="font-bold text-gray-900">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xl text-gray-900">Smart Insights</h3>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {!isLoading && error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* No Insights */}
      {!isLoading && !error && insights.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-lg text-sm">
          No insights available right now.
        </div>
      )}

      {/* Insights Grid */}
      {!isLoading && !error && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => {
            const { Icon, color, bg, border } =
              insightIcons[index % insightIcons.length];

            return (
              <div
                key={index}
                className={`bg-white border ${border} rounded-lg p-5`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`${bg} p-2 border ${border} rounded-lg shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1 -mt-1">
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
