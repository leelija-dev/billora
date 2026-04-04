"use client";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const orderId = params.get("order_id");

  return (
    <div>
      <h1>Payment Success ✅</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
}