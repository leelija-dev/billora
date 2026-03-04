import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { billingAPI } from '../../services/api';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import StatusBadge from '../../components/common/StatusBadge/StatusBadge';
import Modal from '../../components/common/Modal/Modal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const [subRes, plansRes, paymentsRes] = await Promise.all([
        billingAPI.subscription(),
        billingAPI.plans(),
        billingAPI.payments({ pageSize: 10 }),
      ]);

      setSubscription(subRes.data);
      setPlans(plansRes.data);
      setPayments(paymentsRes.data.results || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      await billingAPI.upgrade(selectedPlan);
      Alert.alert('Success', 'Subscription upgraded successfully');
      setShowChangePlanModal(false);
      fetchBillingData();
    } catch (error) {
      Alert.alert('Error', 'Failed to upgrade subscription');
    }
  };

  const handleCancel = async () => {
    try {
      await billingAPI.cancel();
      Alert.alert(
        'Subscription Cancelled',
        'Your subscription has been cancelled. You will have access until the end of your billing period.'
      );
      setShowCancelModal(false);
      fetchBillingData();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel subscription');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'past_due': return 'warning';
      case 'canceled': return 'danger';
      case 'incomplete': return 'warning';
      default: return 'default';
    }
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Billing</Text>
        <Text style={styles.subtitle}>Manage your subscription and payments</Text>
      </View>

      {/* Current Subscription */}
      <Card style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <View>
            <Text style={styles.subscriptionPlan}>
              {subscription?.plan || 'Free'} Plan
            </Text>
            <Text style={styles.subscriptionPrice}>
              ${subscription?.amount || 0}/{subscription?.interval || 'month'}
            </Text>
          </View>
          <StatusBadge
            status={subscription?.status || 'active'}
            variant={getStatusBadgeVariant(subscription?.status)}
          />
        </View>

        <View style={styles.subscriptionDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Period:</Text>
            <Text style={styles.detailValue}>
              {formatDate(subscription?.currentPeriodStart)} - {formatDate(subscription?.currentPeriodEnd)}
            </Text>
          </View>
          {subscription?.cancelAtPeriodEnd && (
            <View style={styles.cancellationWarning}>
              <Icon name="alert" size={20} color={colors.warning[500]} />
              <Text style={styles.warningText}>
                Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.subscriptionActions}>
          <Button
            title="Change Plan"
            onPress={() => setShowChangePlanModal(true)}
            variant="outline"
            size="sm"
            style={styles.subscriptionAction}
          />
          {!subscription?.cancelAtPeriodEnd ? (
            <Button
              title="Cancel Subscription"
              onPress={() => setShowCancelModal(true)}
              variant="outline"
              size="sm"
              style={styles.subscriptionAction}
            />
          ) : (
            <Button
              title="Reactivate"
              onPress={() => Alert.alert('Coming Soon', 'Reactivation will be available soon!')}
              variant="outline"
              size="sm"
              style={styles.subscriptionAction}
            />
          )}
        </View>
      </Card>

      {/* Payment Method */}
      {subscription?.paymentMethod && (
        <Card style={styles.paymentMethodCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodRow}>
            <View style={styles.paymentMethodInfo}>
              <Icon name="credit-card" size={24} color={colors.gray[600]} />
              <View style={styles.paymentMethodDetails}>
                <Text style={styles.paymentMethodType}>
                  {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                </Text>
                <Text style={styles.paymentMethodExpiry}>
                  Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                </Text>
              </View>
            </View>
            <Button
              title="Update"
              variant="outline"
              size="sm"
              onPress={() => Alert.alert('Coming Soon', 'Payment method update coming soon!')}
            />
          </View>
        </Card>
      )}

      {/* Payment History */}
      <Card style={styles.paymentHistoryCard}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        
        {payments.length === 0 ? (
          <Text style={styles.emptyText}>No payment history</Text>
        ) : (
          payments.map((payment, index) => (
            <View key={index} style={styles.paymentRow}>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentDate}>
                  {new Date(payment.date).toLocaleDateString()}
                </Text>
                <Text style={styles.paymentDescription}>{payment.description}</Text>
              </View>
              <View style={styles.paymentMeta}>
                <Text style={styles.paymentAmount}>${payment.amount.toFixed(2)}</Text>
                <StatusBadge
                  status={payment.status}
                  variant={
                    payment.status === 'succeeded' ? 'success' :
                    payment.status === 'pending' ? 'warning' : 'danger'
                  }
                  size="sm"
                />
              </View>
            </View>
          ))
        )}
      </Card>

      {/* Change Plan Modal */}
      <Modal
        isVisible={showChangePlanModal}
        onClose={() => {
          setShowChangePlanModal(false);
          setSelectedPlan(null);
        }}
        title="Change Plan"
      >
        <ScrollView style={styles.modalContent}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planOption,
                selectedPlan === plan.id && styles.selectedPlan,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  ${plan.price}/{plan.interval}
                </Text>
              </View>
              <View style={styles.planFeatures}>
                {plan.features?.map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Icon
                      name="check-circle"
                      size={16}
                      color={colors.success[500]}
                    />
                    <Text style={styles.featureText}>{feature.name}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => {
                setShowChangePlanModal(false);
                setSelectedPlan(null);
              }}
              style={styles.modalButton}
            />
            <Button
              title="Upgrade"
              onPress={handleUpgrade}
              disabled={!selectedPlan}
              style={styles.modalButton}
            />
          </View>
        </ScrollView>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isVisible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
      >
        <View style={styles.modalContent}>
          <View style={styles.warningIcon}>
            <Icon name="alert-circle" size={48} color={colors.warning[500]} />
          </View>
          <Text style={styles.cancelTitle}>Are you sure?</Text>
          <Text style={styles.cancelDescription}>
            Your subscription will be cancelled and you'll lose access to premium features at the end of your billing period.
          </Text>
          
          <View style={styles.modalActions}>
            <Button
              title="Keep Subscription"
              variant="outline"
              onPress={() => setShowCancelModal(false)}
              style={styles.modalButton}
            />
            <Button
              title="Cancel Anyway"
              variant="danger"
              onPress={handleCancel}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  subscriptionCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  subscriptionPlan: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
  },
  subscriptionPrice: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    marginTop: 2,
  },
  subscriptionDetails: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  detailLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray[900],
  },
  cancellationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning[50],
    padding: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  warningText: {
    fontSize: typography.sizes.sm,
    color: colors.warning[700],
    marginLeft: spacing.sm,
    flex: 1,
  },
  subscriptionActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  subscriptionAction: {
    flex: 1,
  },
  paymentMethodCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: spacing.md,
  },
  paymentMethodType: {
    fontSize: typography.sizes.md,
    color: colors.gray[900],
  },
  paymentMethodExpiry: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
  },
  paymentHistoryCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  paymentInfo: {
    flex: 1,
  },
  paymentDate: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.gray[900],
  },
  paymentDescription: {
    fontSize: typography.sizes.xs,
    color: colors.gray[600],
    marginTop: 2,
  },
  paymentMeta: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
    marginBottom: 2,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.gray[500],
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  modalContent: {
    maxHeight: 500,
  },
  planOption: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  selectedPlan: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  planName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray[900],
  },
  planPrice: {
    fontSize: typography.sizes.md,
    color: colors.primary[600],
    fontWeight: typography.weights.medium,
  },
  planFeatures: {
    gap: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featureText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
  warningIcon: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cancelTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cancelDescription: {
    fontSize: typography.sizes.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
});

export default Billing;