import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [userType, setUserType] = useState('buyer');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', farmName: '', farmLocation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const updateFormData = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    setError('');
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (userType === 'farmer' && (!formData.farmName || !formData.farmLocation)) {
      setError('Please provide farm details');
      return;
    }
    setLoading(true);
    try {
      const { registerUser } = require('../services/api');
      let role = 'student';
      if (userType === 'farmer') role = 'trainer';
      else if (userType === 'delivery') role = 'delivery';
      
      const payload = {
        name: formData.name, email: formData.email, password: formData.password,
        role: role,
      };
      await registerUser(payload);
      alert('Registration successful! Please login.');
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputRow = ({ icon, placeholder, value, onChangeText, ...props }) => (
    <View style={styles.inputWrapper}>
      <Icon name={icon} size={20} color="#69F0AE" style={styles.inputIcon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        textColor="#fff"
        underlineColor="transparent"
        activeUnderlineColor="#00C853"
        theme={{ colors: { onSurfaceVariant: 'rgba(255,255,255,0.4)' } }}
        {...props}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      {/* Subtle Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: orb1TranslateY }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateY: orb2TranslateY }] }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#2E7D32" />
          </TouchableOpacity>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.pageTitle}>Create{'\n'}Account</Text>
            <Text style={styles.pageSubtitle}>Join the farm-fresh revolution</Text>

            <View style={styles.formCard}>
              {/* User Type Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleBtn, userType === 'buyer' && styles.toggleActive]}
                  onPress={() => setUserType('buyer')}
                >
                  <Icon name="cart" size={18} color={userType === 'buyer' ? '#FFFFFF' : '#2E7D32'} />
                  <Text style={[styles.toggleText, userType === 'buyer' && styles.toggleTextActive]}>Buyer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, userType === 'farmer' && styles.toggleActive]}
                  onPress={() => setUserType('farmer')}
                >
                  <Icon name="sprout" size={18} color={userType === 'farmer' ? '#FFFFFF' : '#2E7D32'} />
                  <Text style={[styles.toggleText, userType === 'farmer' && styles.toggleTextActive]}>Farmer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, userType === 'delivery' && styles.toggleActive]}
                  onPress={() => setUserType('delivery')}
                >
                  <Icon name="truck-delivery" size={18} color={userType === 'delivery' ? '#FFFFFF' : '#2E7D32'} />
                  <Text style={[styles.toggleText, userType === 'delivery' && styles.toggleTextActive]}>Delivery</Text>
                </TouchableOpacity>
              </View>

              <InputRow icon="account-outline" placeholder="Full Name" value={formData.name} onChangeText={t => updateFormData('name', t)} />
              <InputRow icon="email-outline" placeholder="Email address" value={formData.email} onChangeText={t => updateFormData('email', t)} keyboardType="email-address" autoCapitalize="none" />
              <InputRow icon="phone-outline" placeholder="Phone Number" value={formData.phone} onChangeText={t => updateFormData('phone', t)} keyboardType="phone-pad" />

              {userType === 'farmer' && (
                <>
                  <InputRow icon="barn" placeholder="Farm Name" value={formData.farmName} onChangeText={t => updateFormData('farmName', t)} />
                  <InputRow icon="map-marker-outline" placeholder="Farm Location" value={formData.farmLocation} onChangeText={t => updateFormData('farmLocation', t)} />
                </>
              )}

              <InputRow icon="lock-outline" placeholder="Password" value={formData.password} onChangeText={t => updateFormData('password', t)} secureTextEntry />
              <InputRow icon="lock-check-outline" placeholder="Confirm Password" value={formData.confirmPassword} onChangeText={t => updateFormData('confirmPassword', t)} secureTextEntry />

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#D32F2F" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#2E7D32', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerButton}
                >
                  <Text style={styles.registerButtonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
                  {!loading && <Icon name="arrow-right" size={20} color="#FFFFFF" />}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  scrollContainer: { flexGrow: 1, padding: 24, paddingTop: 60 },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  orb1: { width: 200, height: 200, backgroundColor: '#E8F5E9', top: -40, right: -60 },
  orb2: { width: 160, height: 160, backgroundColor: '#F1F8E9', bottom: 50, left: -40 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, marginBottom: 24 },
  pageTitle: { fontSize: 38, fontWeight: '800', color: '#1A1C1A', lineHeight: 46, letterSpacing: -1 },
  pageSubtitle: { fontSize: 15, color: '#5C635C', marginTop: 8, marginBottom: 32, letterSpacing: 0.3 },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)', elevation: 8, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  toggleContainer: { flexDirection: 'row', borderRadius: 16, backgroundColor: '#F5F5F5', padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  toggleActive: { backgroundColor: '#2E7D32', elevation: 2 },
  toggleText: { marginLeft: 6, fontSize: 14, fontWeight: '700', color: '#5C635C' },
  toggleTextActive: { color: '#FFFFFF' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAF8', borderRadius: 16, marginBottom: 14, borderWidth: 1.5, borderColor: '#EEEEEE', paddingLeft: 14 },
  inputIcon: { marginRight: 4 },
  input: { flex: 1, backgroundColor: 'transparent', fontSize: 14, height: 50 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  errorText: { color: '#D32F2F', marginLeft: 8, fontSize: 13 },
  registerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, marginTop: 8, elevation: 4, shadowColor: '#2E7D32', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  registerButtonText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginRight: 8 },
  loginLink: { alignItems: 'center', marginTop: 28, marginBottom: 40 },
  loginText: { color: '#5C635C', fontSize: 14 },
  loginHighlight: { color: '#2E7D32', fontWeight: '800' },
});
