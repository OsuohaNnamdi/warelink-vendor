import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333333'
  },
  subHeader: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666'
  },
  companyInfo: {
    fontSize: 10,
    marginBottom: 5
  },
  orderInfo: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 5
  },
  title: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333333',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 10,
    marginBottom: 5,
    color: '#333333'
  },
  tableHeader: {
    backgroundColor: '#2980b9',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    padding: 5
  },
  tableRow: {
    fontSize: 10,
    padding: 5,
    borderBottom: '1px solid #EEEEEE'
  },
  summaryRow: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'right'
  },
  footer: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 30,
    color: '#666666'
  }
});

// Create Document Component
const InvoiceDocument = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>INVOICE</Text>
        <Text style={styles.subHeader}>Order #{order.id}</Text>
        
        {/* Company Info */}
        <Text style={styles.companyInfo}>Your Company Name</Text>
        <Text style={styles.companyInfo}>yourwebsite.com</Text>
        <Text style={styles.companyInfo}>contact@yourcompany.com</Text>
        
        {/* Order Info */}
        <Text style={styles.orderInfo}>
          Date: {new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Text style={styles.orderInfo}>Status: {order.status.toUpperCase()}</Text>
        <Text style={styles.orderInfo}>Payment: {order.payment_info}</Text>
        
        {/* Customer Info */}
        <Text style={styles.title}>BILL TO:</Text>
        <Text style={styles.text}>
          {order.customer_details.firstname} {order.customer_details.lastname}
        </Text>
        <Text style={styles.text}>{order.customer_details.email}</Text>
        
        {/* Shipping Address */}
        <Text style={{...styles.title, marginTop: 10}}>SHIPPING ADDRESS:</Text>
        <Text style={styles.text}>{order.address.addressLine1}</Text>
        <Text style={styles.text}>
          {order.address.city}, {order.address.state}
        </Text>
        <Text style={styles.text}>{order.address.phone}</Text>
        
        {/* Items Table */}
        <View style={{ marginTop: 20 }}>
          {/* Table Header */}
          <View style={{ flexDirection: 'row', borderBottom: '1px solid #2980b9' }}>
            <Text style={{...styles.tableHeader, width: '50%'}}>Description</Text>
            <Text style={{...styles.tableHeader, width: '15%', textAlign: 'right'}}>Unit Price</Text>
            <Text style={{...styles.tableHeader, width: '15%', textAlign: 'right'}}>Qty</Text>
            <Text style={{...styles.tableHeader, width: '20%', textAlign: 'right'}}>Total</Text>
          </View>
          
          {/* Table Rows */}
          {order.order_items.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', borderBottom: '1px solid #EEEEEE' }}>
              <Text style={{...styles.tableRow, width: '50%'}}>{item.product.name}</Text>
              <Text style={{...styles.tableRow, width: '15%', textAlign: 'right'}}>
                ₦{Number(item.product.price).toLocaleString()}
              </Text>
              <Text style={{...styles.tableRow, width: '15%', textAlign: 'right'}}>
                {item.quantity}
              </Text>
              <Text style={{...styles.tableRow, width: '20%', textAlign: 'right'}}>
                ₦{Number(item.total).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Summary */}
        <View style={{ marginTop: 20 }}>
          <Text style={styles.summaryRow}>
            Subtotal: ₦{Number(order.total_price).toLocaleString()}
          </Text>
          <Text style={styles.summaryRow}>
            Shipping: ₦0.00
          </Text>
          <Text style={{...styles.summaryRow, fontWeight: 'bold', fontSize: 12}}>
            Total: ₦{Number(order.total_price).toLocaleString()}
          </Text>
        </View>
        
        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business!
        </Text>
      </View>
    </Page>
  </Document>
);

// PDF Download Component
export const InvoiceGenerator = ({ order }) => {
  return (
    <PDFDownloadLink 
      document={<InvoiceDocument order={order} />} 
      fileName={`invoice_${order.id}.pdf`}
    >
      {({ loading }) => (
        <button className="btn btn-secondary" disabled={loading}>
          {loading ? 'Generating invoice...' : 'Download Invoice'}
        </button>
      )}
    </PDFDownloadLink>
  );
};