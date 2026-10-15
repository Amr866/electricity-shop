"use client";

import React, { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ThermalReceipt } from "@/components/order/ThermalReceipt";
import { FileText, Receipt } from "lucide-react";

interface OrderViewTabsProps {
  order: any;
  formalInvoiceContent: React.ReactNode;
}

export function OrderViewTabs({ order, formalInvoiceContent }: OrderViewTabsProps) {
  const [activeView, setActiveView] = useState<"formal" | "thermal">("thermal");

  const thermalOrder = {
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.address,
    totalAmount: order.totalAmount,
    subtotalAmount: order.subtotal,
    shippingCost: order.shippingCost,
    discountAmount: order.discount,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    paymentMethod: order.paymentMethod,
    shippingMethod: order.shippingMethod,
    items: order.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      product: {
        name: item.product?.name || item.name || "کالای برقی",
      },
    })),
  };

  return (
    <div className="space-y-4">
      {/* Switcher Bar (Hidden in Print) */}
      <div className="flex items-center justify-center print:hidden pt-2">
        <SegmentedControl
          value={activeView}
          onChange={(val) => setActiveView(val as "formal" | "thermal")}
          options={[
            {
              value: "thermal",
              label: "رسید چاپی حرارتی",
              icon: Receipt,
            },
            {
              value: "formal",
              label: "فاکتور رسمی A4",
              icon: FileText,
            },
          ]}
          className="w-full max-w-xs"
        />
      </div>

      {/* View Content */}
      <div className="transition-all duration-300">
        {activeView === "thermal" ? (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <ThermalReceipt order={thermalOrder} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {formalInvoiceContent}
          </div>
        )}
      </div>
    </div>
  );
}
