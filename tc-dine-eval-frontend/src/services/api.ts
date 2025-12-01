import axios from "axios";

const trimmedBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const API_BASE_URL = trimmedBase
  ? trimmedBase.replace(/\/+$/, "")
  : "";

export const hasRemoteBackend = Boolean(API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 10_000
});



