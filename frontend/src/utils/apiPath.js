export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register" /* Register new user (POST) */,
    LOGIN: "/api/auth/login" /* Login user and return JWT token (POST) */,
    GET_PROFILE: "/api/auth/me" /* Get logged-in user profile (GET) */,
    UPDATE_PROFILE: "/api/auth/me" /* Update user profile (PUT) */,
  },
  INVOICE: {
    CREATE: "/api/invoices/" /* Create new invoice (POST) */,
    GET_ALL_INVOICES: "/api/invoices/" /* Get all invoices for logged-in user (GET) */,
    GET_INVOICE_BY_ID: (id) => `/api/invoices/${id}` /* Get single invoice by ID (GET) */,
    UPDATE_INVOICE: (id) => `/api/invoices/${id}` /* Update invoice by ID (PUT) */,
    DELETE_INVOICE: (id) => `/api/invoices/${id}` /* Delete invoice by ID (DELETE) */,
  },
  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-text" /* Parse invoice data from text using AI (POST) */,
    GENERATE_REMINDER: "/api/ai/generate-reminder" /* Generate reminder email for invoice (POST) */,
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary" /* Get AI-generated dashboard insights (GET) */,
  },
};