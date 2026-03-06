export const ORDERS = [
  { id: "DD-1042", customer: "Alex Rivera", item: "Burger Combo", amount: 18.99, status: "delivered" },
  { id: "DD-1043", customer: "Sam Chen", item: "Pizza Margherita", amount: 24.50, status: "delivered" },
  { id: "DD-1044", customer: "Jordan Kim", item: "Pad Thai", amount: 15.75, status: "missing_items" },
  { id: "DD-1045", customer: "Taylor Park", item: "Sushi Roll Set", amount: 32.00, status: "delivered" },
  { id: "DD-1046", customer: "Morgan Lee", item: "Chicken Tacos x3", amount: 21.30, status: "wrong_order" },
  { id: "DD-1047", customer: "Casey Wong", item: "Caesar Salad", amount: 12.99, status: "delivered" },
  { id: "DD-1048", customer: "Riley Patel", item: "Ramen Bowl", amount: 17.50, status: "late_delivery" },
  { id: "DD-1049", customer: "Quinn Davis", item: "Steak & Fries", amount: 28.75, status: "delivered" },
  { id: "DD-1050", customer: "Avery Moore", item: "Veggie Wrap", amount: 11.25, status: "missing_items" },
  { id: "DD-1051", customer: "Blake Turner", item: "BBQ Ribs", amount: 34.99, status: "delivered" },
];

export const STATUS_COLORS = {
  delivered: "#75f5cb",
  missing_items: "#ffd166",
  wrong_order: "#ff897d",
  late_delivery: "#ffad60",
};

export const STATUS_LABELS = {
  delivered: "Delivered",
  missing_items: "Missing Items",
  wrong_order: "Wrong Order",
  late_delivery: "Late Delivery",
};
