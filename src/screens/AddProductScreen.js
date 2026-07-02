import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Animated,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddProductScreen({ navigation }) {
  const [formData, setFormData] = useState({ name: '', category: 'Vegetables', price: '', stock: '', unit: 'kg', description: '' });
  const [loading, setLoading] = useState(false);
  const [isOrganic, setIsOrganic] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stock) { alert('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Product added successfully!');
      navigation.goBack();
    } catch (error) { alert('Failed to add product'); }
    finally { setLoading(false); }
  };

  const categories = [
    { value: 'Vegetables', icon: '🥬', gradient: ['#00C853', '#00E676'] },
    { value: 'Fruits', icon: '🍎', gradient: ['#FF6B6B', '#EE5A24'] },
    { value: 'Grains', icon: '🌾', gradient: ['#F39C12', '#E67E22'] },
    { value: 'Dairy', icon: '🥛', gradient: ['#74B9FF', '#0984E3'] },
  ];

  const InputField = ({ icon, label, value, onChangeText, ...props }) => (
    <View style={s.inputWrapper}>
      <Icon name={icon} size={20} color="#2E7D32" style={s.inputIcon} />
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        style={s.input}
        textColor="#1A1C1A"
        underlineColor="transparent"
        activeUnderlineColor="#2E7D32"
        theme={{ colors: { onSurfaceVariant: '#9E9E9E', onSurface: '#1A1C1A' } }}
        {...props}
      />
    </View>
  );

  return (
    <View style={s.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Add Produce</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {/* Image Upload */}
            <TouchableOpacity activeOpacity={0.7} style={s.imageUpload}>
              <View style={s.imageUploadInner}>
                <View style={s.cameraCircle}>
                  <Icon name="camera-plus" size={32} color="#2E7D32" />
                </View>
                <Text style={s.imageUploadText}>Add Product Photo</Text>
                <Text style={s.imageUploadSub}>High quality images sell faster</Text>
              </View>
            </TouchableOpacity>

            {/* Form Card */}
            <View style={s.formCard}>
              <Text style={s.sectionLabel}>BASIC INFORMATION</Text>
              <InputField icon="tag-outline" label="Product Name" value={formData.name} onChangeText={t => updateFormData('name', t)} />

              {/* Category Grid */}
              <Text style={s.label}>Category</Text>
              <View style={s.catGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity key={cat.value} activeOpacity={0.7} onPress={() => updateFormData('category', cat.value)}
                    style={[s.catChip, formData.category === cat.value && { borderColor: cat.gradient[0] }]}>
                    {formData.category === cat.value ? (
                      <LinearGradient colors={cat.gradient} style={s.catChipGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                        <Text style={s.catIcon}>{cat.icon}</Text>
                        <Text style={s.catTextActive}>{cat.value}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.catChipInner}>
                        <Text style={s.catIcon}>{cat.icon}</Text>
                        <Text style={s.catText}>{cat.value}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.divider} />
              <Text style={s.sectionLabel}>PRICING & STOCK</Text>

              {/* Price Row */}
              <View style={s.row}>
                <View style={[s.inputWrapper, { flex: 1, marginRight: 12 }]}>
                  <Text style={s.currencySymbol}>₹</Text>
                  <TextInput label="Price" value={formData.price} onChangeText={t => updateFormData('price', t)} style={s.input} keyboardType="numeric" textColor="#1A1C1A" underlineColor="transparent" activeUnderlineColor="#2E7D32" theme={{ colors: { onSurfaceVariant: '#9E9E9E', onSurface: '#1A1C1A' } }} />
                </View>
                <View style={[s.inputWrapper, { width: 110 }]}>
                  <TextInput label="Unit" value={formData.unit} onChangeText={t => updateFormData('unit', t)} style={s.input} textColor="#1A1C1A" underlineColor="transparent" activeUnderlineColor="#2E7D32" theme={{ colors: { onSurfaceVariant: '#9E9E9E', onSurface: '#1A1C1A' } }} />
                </View>
              </View>

              <InputField icon="package-variant" label="Available Stock" value={formData.stock} onChangeText={t => updateFormData('stock', t)} keyboardType="numeric" />
              
              <View style={s.divider} />
              <Text style={s.sectionLabel}>ADDITIONAL DETAILS</Text>
              
              <InputField icon="text-box-outline" label="Description" value={formData.description} onChangeText={t => updateFormData('description', t)} multiline numberOfLines={3} />

              {/* Organic Toggle */}
              <TouchableOpacity activeOpacity={0.9} onPress={() => setIsOrganic(!isOrganic)} style={[s.organicRow, isOrganic && s.organicRowActive]}>
                <View style={s.organicLeft}>
                  <View style={[s.organicIconBg, { backgroundColor: isOrganic ? '#E8F5E9' : '#F5F5F5' }]}>
                    <Icon name="leaf" size={22} color={isOrganic ? '#2E7D32' : '#9E9E9E'} />
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={[s.organicText, isOrganic && s.organicTextActive]}>Certified Organic</Text>
                    <Text style={s.organicSub}>Grown without synthetic pesticides</Text>
                  </View>
                </View>
                <View style={[s.toggle, isOrganic && s.toggleActive]}>
                  <View style={[s.toggleDot, isOrganic && s.toggleDotActive]} />
                </View>
              </TouchableOpacity>

              {/* Submit */}
              <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.8} style={s.submitBtnWrapper}>
                <LinearGradient colors={['#2E7D32', '#43A047']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.submitBtn}>
                  {loading ? (
                    <Text style={s.submitText}>Publishing...</Text>
                  ) : (
                    <>
                      <Icon name="check-decagram" size={24} color="#FFFFFF" style={{ marginRight: 10 }} />
                      <Text style={s.submitText}>Publish Produce</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1A1C1A', letterSpacing: -0.5 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  imageUpload: { marginBottom: 24, borderRadius: 32, backgroundColor: '#FFFFFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, overflow: 'hidden' },
  imageUploadInner: { height: 200, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F0F0F0', borderStyle: 'dashed', borderRadius: 32, margin: 8 },
  cameraCircle: { width: 64, height: 64, borderRadius: 22, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  imageUploadText: { color: '#1A1C1A', fontSize: 17, fontWeight: '800' },
  imageUploadSub: { color: '#9E9E9E', fontSize: 13, marginTop: 4, fontWeight: '500' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, elevation: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '900', color: '#BDBDBD', letterSpacing: 1.5, marginBottom: 20, marginTop: 10 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAF9', borderRadius: 18, marginBottom: 16, borderWidth: 1, borderColor: '#F0F0F0', paddingLeft: 16 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, backgroundColor: 'transparent', fontSize: 16, height: 56 },
  currencySymbol: { fontSize: 20, fontWeight: '800', color: '#2E7D32', marginRight: 4 },
  label: { fontSize: 14, color: '#5C635C', marginBottom: 12, marginLeft: 4, fontWeight: '700' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  catChip: { width: '48%', marginRight: '2%', marginBottom: 10, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  catChipGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 18 },
  catChipInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, backgroundColor: '#F9FAF9', borderRadius: 18 },
  catIcon: { fontSize: 20, marginRight: 8 },
  catText: { fontSize: 14, color: '#9E9E9E', fontWeight: '700' },
  catTextActive: { fontSize: 14, color: '#FFFFFF', fontWeight: '800' },
  row: { flexDirection: 'row' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 24 },
  organicRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, backgroundColor: '#F9FAF9', borderRadius: 20, marginBottom: 28, borderWidth: 1, borderColor: '#F0F0F0' },
  organicRowActive: { borderColor: '#C8E6C9', backgroundColor: '#F1F8F1' },
  organicLeft: { flexDirection: 'row', alignItems: 'center' },
  organicIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  organicText: { fontSize: 16, color: '#5C635C', fontWeight: '800' },
  organicTextActive: { color: '#2E7D32' },
  organicSub: { fontSize: 11, color: '#9E9E9E', marginTop: 2, fontWeight: '500' },
  toggle: { width: 50, height: 28, borderRadius: 15, backgroundColor: '#E0E0E0', justifyContent: 'center', paddingHorizontal: 3 },
  toggleActive: { backgroundColor: '#43A047' },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', elevation: 2 },
  toggleDotActive: { alignSelf: 'flex-end' },
  submitBtnWrapper: { marginTop: 10 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 20, elevation: 8, shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  submitText: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
});
