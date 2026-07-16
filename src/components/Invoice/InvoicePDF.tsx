// components/pdf/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoicePDFProps {
  invoice: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    lineItems: InvoiceLineItem[];
  };
  client: { name: string; email: string; phone?: string };
  project: { title: string };
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 9, color: '#6b6b6b', marginBottom: 2 },
  row: { flexDirection: 'row', borderBottom: '1 solid #e5e5e5', paddingVertical: 6 },
  cell: { flex: 2 },
  cellRight: { flex: 1, textAlign: 'right' },
  bold: { fontFamily: 'Helvetica-Bold' },
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export function InvoicePDF({ invoice, client, project }: InvoicePDFProps) {
  const subtotal = invoice.lineItems.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice #INV-{invoice.invoiceNumber}</Text>
          <View>
            <Text>Issued: {formatDate(invoice.issueDate)}</Text>
            <Text>Due: {formatDate(invoice.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View>
            <Text style={styles.label}>BILL TO</Text>
            <Text>{client.name}</Text>
            <Text>{client.email}</Text>
            {client.phone ? <Text>{client.phone}</Text> : null}
          </View>
          <View>
            <Text style={styles.label}>PROJECT</Text>
            <Text>{project.title}</Text>
          </View>
        </View>

        <View>
          <View style={[styles.row, styles.bold]}>
            <Text style={styles.cell}>Description</Text>
            <Text style={styles.cellRight}>Qty</Text>
            <Text style={styles.cellRight}>Rate</Text>
            <Text style={styles.cellRight}>Amount</Text>
          </View>
          {invoice.lineItems.map((item, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cell}>{item.description}</Text>
              <Text style={styles.cellRight}>{item.quantity}</Text>
              <Text style={styles.cellRight}>${item.price.toFixed(2)}</Text>
              <Text style={styles.cellRight}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: 12 }}>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text style={styles.bold}>Total: ${invoice.amount.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}