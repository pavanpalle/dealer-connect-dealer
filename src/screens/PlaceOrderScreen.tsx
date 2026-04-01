import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { PRODUCTS, BULK_TIERS, formatCurrency, getTier, effPrice, tierColor } from '../data/mockData';
import AppBar from '../components/AppBar';
import Card from '../components/Card';
import { Product, Order } from '../types';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'milk', label: 'Milk' },
  { key: 'dairy', label: 'Dairy' },
  { key: 'drinks', label: 'Drinks' },
];

const PRODUCT_EMOJI: Record<string, string> = {
  milk: '\u{1F95B}', ghee: '\u{1F9C8}', curd: '\u{1F95B}',
  butter: '\u{1F9C8}', drink: '\u{1F379}',
};

export default function PlaceOrderScreen() {
  const navigation = useNavigation();
  const { dealer } = useAuth();
  const { addOrder, orders } = useOrders();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<Record<string, number>>({});
  const [category, setCategory] = useState('all');
  const [notes, setNotes] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  const filteredProducts = useMemo(() => {
    if (category === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === category);
  }, [category]);

  const setQty = (productId: string, qty: number) => {
    setItems(prev => ({ ...prev, [productId]: Math.max(0, qty) }));
  };

  const selectedProducts = useMemo(() => {
    return PRODUCTS.filter(p => (items[p.id] || 0) > 0);
  }, [items]);

  const cartSummary = useMemo(() => {
    let total = 0, savings = 0, count = 0;
    PRODUCTS.forEach(p => {
      const q = items[p.id] || 0;
      if (!q) return;
      count++;
      const ep = effPrice(p.id, q);
      total += ep * q + Math.round(ep * q * p.gst / 100);
      savings += (p.price - ep) * q;
    });
    return { total, savings, count };
  }, [items]);

  const reviewSummary = useMemo(() => {
    let sub = 0, gst = 0, sav = 0;
    selectedProducts.forEach(p => {
      const q = items[p.id] || 0;
      const ep = effPrice(p.id, q);
      const lt = Math.round(ep * q * 100) / 100;
      const gstA = Math.round(lt * p.gst / 100);
      const savd = Math.round((p.price - ep) * q * 100) / 100;
      sub += lt; gst += gstA; sav += savd;
    });
    return { sub, gst, grand: Math.round((sub + gst) * 100) / 100, sav };
  }, [selectedProducts, items]);

  const handlePlaceOrder = () => {
    if (!dealer) return;
    const orderId = `ORD-${4822 + orders.length}`;
    const invNo = `INV-2026-0${822 + orders.length}`;
    const orderItems = selectedProducts.map(p => {
      const q = items[p.id] || 0;
      const ep = effPrice(p.id, q);
      const lt = Math.round(ep * q * 100) / 100;
      return { id: p.id, name: p.name, sku: p.sku, qty: q, price: ep, gst: p.gst, total: lt };
    });
    const now = new Date();
    const hh = now.getHours() % 12 || 12;
    const mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : '' + now.getMinutes();
    const ap = now.getHours() >= 12 ? 'PM' : 'AM';
    const newOrder: Order = {
      id: orderId, did: dealer.id, dealer: dealer.name,
      loc: dealer.loc, route: dealer.route, status: 'pending',
      items: orderItems, sub: reviewSummary.sub, gstAmt: reviewSummary.gst, grand: reviewSummary.grand,
      date: '31 Mar', time: `${hh}:${mm} ${ap}`,
      vehicle: '', driver: '', inv: invNo, paid: false, pay: '',
    };
    addOrder(newOrder);
    setNewOrderId(orderId);
    setOrderPlaced(true);
    setTimeout(() => { navigation.goBack(); }, 3000);
  };

  const renderStepBar = () => (
    <View style={styles.stepBar}>
      {[1, 2, 3].map((s, i) => (
        <React.Fragment key={s}>
          <View style={styles.stepWrap}>
            <View style={[styles.stepNum, step > s && styles.stepDone, step === s && styles.stepActive]}>
              <Text style={[styles.stepNumText, step >= s && styles.stepNumTextActive]}>{s}</Text>
            </View>
            <Text style={[styles.stepLabel, step > s && styles.stepLabelDone, step === s && styles.stepLabelActive]}>
              {['Products', 'Review', 'Confirm'][i]}
            </Text>
          </View>
          {i < 2 && <View style={[styles.stepLine, step > s + 1 && styles.stepLineDone]} />}
        </React.Fragment>
      ))}
    </View>
  );

  const renderProductRow = (p: Product) => {
    const q = items[p.id] || 0;
    const tier = getTier(p.id, q);
    const ep = effPrice(p.id, q);
    const hasDis = tier && tier.disc > 0;
    const tc = hasDis ? tierColor(tier.disc) : Colors.ink;
    const tiers = BULK_TIERS[p.id];

    return (
      <View key={p.id} style={[styles.productRow, hasDis && { backgroundColor: tc + '08' }]}>
        <View style={styles.productHeader}>
          <View style={[styles.productIcon, { backgroundColor: p.bg }]}>
            <Text style={{ fontSize: 16 }}>{PRODUCT_EMOJI[p.icon] || '\u{1F4E6}'}</Text>
          </View>
          <View style={styles.productInfo}>
            <View style={styles.productNameRow}>
              <Text style={styles.productName}>{p.name}</Text>
              {hasDis && (
                <View style={[styles.discBadge, { backgroundColor: tc }]}>
                  <Text style={styles.discBadgeText}>{tier.disc}% OFF</Text>
                </View>
              )}
            </View>
            <Text style={styles.productSku}>{p.sku} {'\u00b7'} Case/{tiers[1].min} {'\u00b7'} MRP {'\u20b9'}{p.mrp}</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.productPrice, { color: hasDis ? tc : Colors.ink }]}>{'\u20b9'}{ep.toFixed(2)}</Text>
              {hasDis && <Text style={styles.oldPrice}>{'\u20b9'}{p.price}</Text>}
              {hasDis && <Text style={[styles.tierLabelText, { color: tc }]}>{tier.lbl}</Text>}
            </View>
          </View>
        </View>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(p.id, q - 1)}>
            <Text style={styles.qtyBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{q}</Text>
          <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnPlus]} onPress={() => setQty(p.id, q + 1)}>
            <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tierChips}>
          {tiers.map(t => {
            const isActive = q >= t.min && tier && tier.lbl === t.lbl;
            const cc = tierColor(t.disc);
            return (
              <TouchableOpacity key={t.lbl} style={[styles.tierChip, { backgroundColor: isActive ? cc : Colors.surface2, borderColor: isActive ? cc : Colors.border }]} onPress={() => setQty(p.id, t.min)}>
                <Text style={[styles.tierChipText, { color: isActive ? '#fff' : Colors.ink3 }]}>
                  {t.disc ? `${t.disc}% (${t.min}+)` : 'Base'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.tierProgressBar}>
          {tiers.map((t, i) => {
            const lit = q > 0 && tier && tiers.indexOf(tier) >= i;
            return <View key={i} style={[styles.tierProgressSeg, { backgroundColor: lit ? tierColor(t.disc) : Colors.border }]} />;
          })}
        </View>
      </View>
    );
  };

  if (step === 3 || orderPlaced) {
    return (
      <View style={styles.container}>
        <AppBar title="Place Order" onBack={() => navigation.goBack()} />
        {renderStepBar()}
        <View style={styles.confirmContainer}>
          <View style={[styles.confirmIcon, { backgroundColor: orderPlaced ? Colors.greenLight : Colors.amberLight }]}>
            <Text style={{ fontSize: 32 }}>{orderPlaced ? '\u2713' : '\u23F3'}</Text>
          </View>
          <Text style={styles.confirmTitle}>{orderPlaced ? 'Order Placed!' : 'Placing Order\u2026'}</Text>
          <Text style={styles.confirmSub}>
            {orderPlaced
              ? `#${newOrderId} \u00b7 ${formatCurrency(reviewSummary.grand)}\n${selectedProducts.length} products \u00b7 Sent to SSR \u2713`
              : 'Sending to SSR Enterprises'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="Place Order" onBack={() => navigation.goBack()} />
      {renderStepBar()}
      {step === 1 && (
        <>
          <View style={styles.catTabs}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.key} style={[styles.catTab, category === cat.key && styles.catTabActive]} onPress={() => setCategory(cat.key)}>
                <Text style={[styles.catTabText, category === cat.key && styles.catTabTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.legendStrip}>
            <Text style={styles.legendLabel}>Bulk tiers:</Text>
            {[['Half Case', '3-5%', Colors.green], ['Full Case', '6-8%', Colors.blue], ['Bulk', '10-12%', Colors.purple]].map(([lbl, disc, col]) => (
              <View key={String(lbl)} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: String(col) }]} />
                <Text style={styles.legendText}>{String(lbl)} <Text style={[styles.legendDisc, { color: String(col) }]}>{String(disc)}</Text></Text>
              </View>
            ))}
          </View>
          <ScrollView style={styles.scrollContent}>
            <Card style={{ margin: 14, marginTop: 12 }}>
              {filteredProducts.map(p => renderProductRow(p))}
            </Card>
            <View style={{ height: 80 }} />
          </ScrollView>
          {cartSummary.count > 0 && (
            <View style={styles.cartBar}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartCount}>{cartSummary.count} item{cartSummary.count > 1 ? 's' : ''} selected</Text>
                <Text style={styles.cartTotal}>{formatCurrency(cartSummary.total)}</Text>
                {cartSummary.savings > 0 && <Text style={styles.cartSavings}>{'\u2714'} Saving {formatCurrency(cartSummary.savings)} on bulk</Text>}
              </View>
              <TouchableOpacity style={styles.reviewBtn} onPress={() => setStep(2)} activeOpacity={0.8}>
                <Text style={styles.reviewBtnText}>Review {'\u2192'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {step === 2 && (
        <ScrollView style={styles.scrollContent}>
          <View style={{ padding: 14 }}>
            {reviewSummary.sav > 0 && (
              <View style={styles.savingsBanner}>
                <View style={styles.savingsIcon}><Text style={{ fontSize: 16 }}>{'\u{1F3F7}'}</Text></View>
                <View>
                  <Text style={styles.savingsTitle}>You're saving {formatCurrency(reviewSummary.sav)}!</Text>
                  <Text style={styles.savingsSub}>Bulk case pricing applied</Text>
                </View>
              </View>
            )}
            <Text style={styles.sectionLabel}>YOUR ORDER</Text>
            <Card style={{ marginBottom: 14 }}>
              {selectedProducts.map(p => {
                const q = items[p.id] || 0;
                const ep = effPrice(p.id, q);
                const lt = Math.round(ep * q * 100) / 100;
                const savd = Math.round((p.price - ep) * q * 100) / 100;
                const tier = getTier(p.id, q);
                return (
                  <View key={p.id} style={styles.reviewItem}>
                    <View style={styles.reviewItemHeader}>
                      <View style={[styles.productIcon, { backgroundColor: p.bg, width: 30, height: 30 }]}>
                        <Text style={{ fontSize: 14 }}>{PRODUCT_EMOJI[p.icon] || '\u{1F4E6}'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewItemName}>{p.name}</Text>
                        <Text style={styles.reviewItemMeta}>
                          {'\u20b9'}{ep.toFixed(2)} {'\u00d7'} {q} {p.unit}
                          {tier && tier.disc > 0 ? ` \u00b7 ${tier.lbl} ${tier.disc}% off` : ''}
                          {` \u00b7 GST ${p.gst}%`}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.reviewItemTotal}>{formatCurrency(lt)}</Text>
                        {savd > 0 && <Text style={styles.reviewItemSaving}>{'\u2212'}{formatCurrency(savd)}</Text>}
                      </View>
                    </View>
                  </View>
                );
              })}
              <View style={styles.summarySection}>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{formatCurrency(reviewSummary.sub)}</Text></View>
                {reviewSummary.sav > 0 && <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: Colors.green }]}>Bulk Savings</Text><Text style={[styles.summaryValue, { color: Colors.green }]}>{'\u2212'}{formatCurrency(reviewSummary.sav)}</Text></View>}
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>GST</Text><Text style={styles.summaryValue}>{formatCurrency(reviewSummary.gst)}</Text></View>
                <View style={[styles.summaryRow, styles.grandTotalRow]}><Text style={styles.grandLabel}>Grand Total</Text><Text style={styles.grandValue}>{formatCurrency(reviewSummary.grand)}</Text></View>
              </View>
            </Card>
            <Text style={styles.sectionLabel}>DELIVERY ADDRESS</Text>
            <Card style={{ padding: 12, paddingHorizontal: 14, marginBottom: 14 }}>
              <Text style={styles.addrName}>{dealer?.name}</Text>
              <Text style={styles.addrText}>{dealer?.addr}</Text>
            </Card>
            <Text style={styles.sectionLabel}>NOTES (optional)</Text>
            <TextInput style={styles.notesInput} value={notes} onChangeText={setNotes} placeholder="Delivery instructions\u2026" placeholderTextColor={Colors.ink4} multiline numberOfLines={2} />
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setStep(1)}><Text style={styles.editBtnText}>{'\u2190'} Edit</Text></TouchableOpacity>
              <TouchableOpacity style={styles.placeBtn} onPress={() => { setStep(3); setTimeout(handlePlaceOrder, 1400); }} activeOpacity={0.8}><Text style={styles.placeBtnText}>{'\u2713'} Place Order</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  stepBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 11, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: 4 },
  stepWrap: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  stepNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border },
  stepDone: { backgroundColor: Colors.green, borderColor: Colors.green },
  stepActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  stepNumText: { fontSize: 11, fontWeight: '800', color: Colors.ink4 },
  stepNumTextActive: { color: '#fff' },
  stepLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink4, flex: 1 },
  stepLabelDone: { color: Colors.green },
  stepLabelActive: { color: Colors.blue },
  stepLine: { height: 2, backgroundColor: Colors.border, borderRadius: 2, width: 20 },
  stepLineDone: { backgroundColor: Colors.green },
  catTabs: { flexDirection: 'row', gap: 7, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  catTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  catTabActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  catTabText: { fontSize: 12, fontWeight: '700', color: Colors.ink3 },
  catTabTextActive: { color: '#fff' },
  legendStrip: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: Colors.surface2, borderBottomWidth: 1, borderBottomColor: Colors.border },
  legendLabel: { fontSize: 9, fontWeight: '700', color: Colors.ink3 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 9, color: Colors.ink3 },
  legendDisc: { fontWeight: '700' },
  scrollContent: { flex: 1 },
  productRow: { padding: 13, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  productHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  productIcon: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  productInfo: { flex: 1 },
  productNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 1 },
  productName: { fontSize: 13, fontWeight: '700' },
  discBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
  discBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  productSku: { fontSize: 10, color: Colors.ink4, marginBottom: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  productPrice: { fontSize: 15, fontWeight: '800' },
  oldPrice: { fontSize: 10, color: Colors.ink4, textDecorationLine: 'line-through' },
  tierLabelText: { fontSize: 10, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, alignSelf: 'flex-start' },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  qtyBtnPlus: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: Colors.ink2 },
  qtyValue: { fontSize: 16, fontWeight: '800', width: 40, textAlign: 'center' },
  tierChips: { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  tierChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  tierChipText: { fontSize: 9, fontWeight: '700' },
  tierProgressBar: { flexDirection: 'row', gap: 2, marginTop: 6 },
  tierProgressSeg: { flex: 1, height: 3, borderRadius: 2 },
  cartBar: { backgroundColor: Colors.surface, borderTopWidth: 2, borderTopColor: Colors.blue, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartInfo: { flex: 1 },
  cartCount: { fontSize: 10, color: Colors.ink3, fontWeight: '600' },
  cartTotal: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  cartSavings: { fontSize: 10, fontWeight: '700', color: Colors.green },
  reviewBtn: { backgroundColor: Colors.blue, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14 },
  reviewBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  savingsBanner: { backgroundColor: Colors.greenLight, borderWidth: 1, borderColor: '#A7E3D0', borderRadius: 11, padding: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  savingsIcon: { width: 34, height: 34, backgroundColor: Colors.green, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  savingsTitle: { fontSize: 13, fontWeight: '800', color: Colors.green },
  savingsSub: { fontSize: 11, color: Colors.green, marginTop: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.ink3, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8 },
  reviewItem: { padding: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  reviewItemHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewItemName: { fontSize: 13, fontWeight: '700' },
  reviewItemMeta: { fontSize: 10, color: Colors.ink3, marginTop: 2 },
  reviewItemTotal: { fontSize: 14, fontWeight: '800' },
  reviewItemSaving: { fontSize: 10, fontWeight: '700', color: Colors.green, marginTop: 1 },
  summarySection: { backgroundColor: Colors.surface2, padding: 12, paddingHorizontal: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryLabel: { fontSize: 11, color: Colors.ink3, fontWeight: '600' },
  summaryValue: { fontSize: 12, fontWeight: '700' },
  grandTotalRow: { paddingTop: 10, marginTop: 5, borderTopWidth: 1.5, borderTopColor: Colors.border, marginBottom: 0 },
  grandLabel: { fontSize: 14, fontWeight: '800' },
  grandValue: { fontSize: 18, fontWeight: '800', color: Colors.blue },
  addrName: { fontSize: 13, fontWeight: '700' },
  addrText: { fontSize: 11, color: Colors.ink3, marginTop: 4, lineHeight: 17 },
  notesInput: { backgroundColor: Colors.surface2, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, padding: 11, paddingHorizontal: 13, fontSize: 14, fontWeight: '500', color: Colors.ink, marginBottom: 14, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  editBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.blue, borderRadius: 12, padding: 13, alignItems: 'center' },
  editBtnText: { fontSize: 14, fontWeight: '700', color: Colors.blue },
  placeBtn: { flex: 2, backgroundColor: Colors.blue, borderRadius: 12, padding: 13, alignItems: 'center' },
  placeBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  confirmContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  confirmIcon: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  confirmTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  confirmSub: { fontSize: 12, color: Colors.ink3, marginTop: 8, lineHeight: 20, textAlign: 'center' },
});
