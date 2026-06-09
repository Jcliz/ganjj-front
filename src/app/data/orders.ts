export const ORDER_STEPS = [
  "Pedido realizado",
  "Pagamento confirmado",
  "Preparando envio",
  "Enviado",
  "Em entrega",
  "Entregue",
] as const;

export type OrderStep = typeof ORDER_STEPS[number];
