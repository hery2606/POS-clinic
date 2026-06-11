"use client";

import { posClient } from "@/api/posClient";
import { type TokenizerResponse, type PaymentStatusResponse } from "../types/payment.types";

export const paymentService = {
  generateSnapToken: async (transactionId: string): Promise<TokenizerResponse> => {
    const payload = { transactionId };
    const response = await posClient.post<TokenizerResponse>('/api/payment/tokenizer', payload);
    return response.data;
  },

  checkStatus: async (transactionId: string): Promise<PaymentStatusResponse> => {
    const response = await posClient.get<PaymentStatusResponse>(`/api/payment/status/${transactionId}`);
    return response.data;
  }
};