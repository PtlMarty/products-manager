// TODO: create a function that takes an order object and returns a pdf document

import { Order, OrderItem, Product, Shop, Supplier } from "@prisma/client";
import {
  Document,
  Font,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Register font
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v27/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  text: {
    marginBottom: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

type ExtendedOrder = Order & { shop: Shop };
type ExtendedOrderItem = OrderItem & { product: Product };

const OrderDocument = ({
  order,
  orderItems,
  supplier,
}: {
  order: ExtendedOrder;
  orderItems: ExtendedOrderItem[];
  supplier: Supplier;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>Order Details</Text>
        <Text style={styles.text}>Shop Name: {order.shop.name}</Text>
        <Text style={styles.text}>Order ID: {order.id}</Text>
        <Text style={styles.text}>
          Order Date: {new Date(order.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.text}>Status: {order.status}</Text>
        <Text style={styles.text}>
          Total: ${Number(order.totalAmount).toFixed(2)}
        </Text>
        <Text style={styles.text}>Supplier: {supplier.name}</Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Item</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Quantity</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Price</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Total</Text>
            </View>
          </View>
          {orderItems.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.product.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${Number(item.product.price).toFixed(2)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  ${(item.quantity * Number(item.product.price)).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export const createOrderPdf = async (
  order: ExtendedOrder,
  orderItems: ExtendedOrderItem[],
  supplier: Supplier
) => {
  try {
    const doc = (
      <OrderDocument
        order={order}
        orderItems={orderItems}
        supplier={supplier}
      />
    );
    return await pdf(doc).toBlob();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to generate PDF: " + error.message);
    }
    throw new Error("Failed to generate PDF: Unknown error");
  }
};
