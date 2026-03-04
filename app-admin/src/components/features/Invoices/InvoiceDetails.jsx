import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Card from '../../common/Card/Card';
import StatusBadge from '../../common/StatusBadge/StatusBadge';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InvoiceDetails = ({ invoice }) => {
  const getStatusColor = (status) => {
    const colors = {
      paid: 'success',
      unpaid: 'warning',
      overdue: 'danger',
      cancelled: 'default',
      refunded: 'default',
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Invoice Header */}
      <Card style={styles.section}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>
              Issued: {formatDate(invoice.issueDate)}
            </Text>
          </View>
          <StatusBadge
            status={invoice.status}
            variant={getStatusColor(invoice.status)}
            size="lg"
          />
        </View>
      </Card>

      {/* Company & Customer Info */}
      <Card style={styles.section}>
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>From</Text>
            <Text style={styles.companyName}>{invoice.company?.name}</Text>
            <Text style={styles.companyDetail}>{invoice.company?.address}</Text>
            <Text style={styles.companyDetail}>{invoice.company?.email}</Text>
            <Text style={styles.companyDetail}>{invoice.company?.phone}</Text>
            <Text style={styles.companyDetail}>Tax ID: {invoice.company?.taxId}</Text>
          </View>
          
          <View style={styles.infoColumn}>
            <Text style={styles.infoTitle}>To</Text>
            <Text style={styles.customerName}>{invoice.customer?.name}</Text>
            <Text style={styles.customerDetail}>{invoice.customer?.address}</Text>
            <Text style={styles.customerDetail}>{invoice.customer?.email}</Text>
            {invoice.customer?.phone && (
              <Text style={styles.customerDetail}>{invoice.customer?.phone}</Text>
            )}
          </View>
        </View>
      </Card>

      {/* Invoice Details */}
      <Card style={styles.section}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Issue Date</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.issueDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Payment Terms</Text>
            <Text style={styles.detailValue}>Net 30</Text>
          </View>
        </View>
      </Card>

      {/* Invoice Items */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        
        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={[styles.headerCell, { flex: 3 }]}>Description</Text>
          <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Qty</Text>
          <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>Price</Text>
          <Text style={[styles.headerCell, { flex: 1, textAlign: 'right' }]}>Total</Text>
        </View>

        {/* Items */}
        {invoice.items?.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={{ flex: 3 }}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              {item.sku && (
                <Text style={styles.itemSku}>SKU: {item.sku}</Text>
              )}
            </View>
            <Text style={[styles.itemCell, { flex: 1, textAlign: 'center' }]}>
              {item.quantity}
            </Text>
            <Text style={[styles.itemCell, { flex: 1, textAlign: 'right' }]}>
              ${item.unitPrice.toFixed(2)}
            </Text>
            <Text style={[styles.itemCell, { flex: 1, textAlign: 'right' }]}>
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>${invoice.subtotal?.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax ({invoice.taxRate || 10}%):</Text>
            <Text style={styles.summaryValue}>${invoice.tax?.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${invoice.total?.toFixed(2)}</Text>
          </View>
        </View>
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notes}>{invoice.notes}</Text>
        </Card>
      )}

      {/* Payment Information */}
      {invoice.status === 'paid' && invoice.paidAt && (
        <Card style={styles.section}>
          <View style={styles.paymentInfo}>
            <Icon name="check-circle" size={24} color={colors.success[500]} />
            <View style={styles.paymentDetails}>
              <Text style={styles.paidText}>Paid on {formatDate(invoice.paidAt)}</Text>
              {invoice.paymentMethod && (
                <Text style={styles.paymentMethod}>
                  via {invoice.paymentMethod.replace('_', ' ').toUpperCase()}
                </Text>
              )}
            </View>
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  invoiceDate: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  infoColumn: {
    flex: 1,
  },
  infoTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray[700],
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  companyName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: 2,
  },
  customerName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
    marginBottom: 2,
  },
  customerDetail: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  itemsHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    marginBottom: spacing.sm,
  },
  headerCell: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.gray[600],
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  itemDescription: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  itemSku: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginTop: 2,
  },
  itemCell: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  summary: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  totalRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
  },
  totalValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary[600],
  },
  notes: {
    fontSize: typography.sizes.md,
    color: colors.gray[700],
    fontStyle: 'italic',
    lineHeight: 20,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetails: {
    marginLeft: spacing.md,
  },
  paidText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.success[700],
  },
  paymentMethod: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
});

export default InvoiceDetails;