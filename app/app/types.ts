export type RouteStatus = "idle" | "evaluating" | "eliminated" | "winner";

export type EngineState =
 | "input"
 | "analyzing"
 | "result"
 | "checkout"
 | "executing"
 | "success";

export type PriorityOption = "cheapest" | "fastest" | "balanced" | "safest";

export type CurrencyCode =
 | "NGN"
 | "USD"
 | "GHS"
 | "KES"
 | "ZAR"
 | "GBP"
 | "EUR";

export interface CountryOption {
 country: string;
 code: string;
 currency: CurrencyCode;
}

export interface PaymentRoute {
 id: string;
 name: string;
 fee: string;
 time: string;
 status: RouteStatus;
 reason?: string;
}
