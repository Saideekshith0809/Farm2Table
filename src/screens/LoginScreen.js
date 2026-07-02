import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Text, SegmentedButtons } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation, onLogin }) {
  const [userType, setUserType] = useState('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const logoScale = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(50)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(formSlide, { toValue: 0, duration: 800, delay: 300, useNativeDriver: true }),
      Animated.timing(formOpacity, { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
    ]).start();

    // Floating orbs animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim1, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatingAnim1, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim2, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatingAnim2, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await loginUser(email, password);
      await AsyncStorage.setItem('userToken', response.token);
      
      let role = 'buyer';
      if (response.user.role === 'trainer' || response.user.role === 'farmer') role = 'farmer';
      else if (response.user.role === 'delivery') role = 'delivery';
      
      await AsyncStorage.setItem('userType', role);
      await AsyncStorage.setItem('userEmail', response.user.email);
      await AsyncStorage.setItem('userName', response.user.name);
      onLogin(role);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const orb1TranslateY = floatingAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -30] });
  const orb2TranslateY = floatingAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 20] });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F7F0', '#F8FAF8']} style={StyleSheet.absoluteFill} />
      {/* Subtle Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: orb1TranslateY }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateY: orb2TranslateY }] }]} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoCircle}>
              <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.logoGradient}>
                <Text style={styles.logoEmoji}>🌾</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Farm2Table</Text>
            <Text style={styles.subtitle}>Fresh from Farm to Your Table</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.formContainer, { opacity: formOpacity, transform: [{ translateY: formSlide }] }]}>
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

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Icon name="email-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#9E9E9E"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  textColor="#1A1C1A"
                  underlineColor="transparent"
                  activeUnderlineColor="#2E7D32"
                  theme={{ colors: { onSurfaceVariant: '#9E9E9E' } }}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color="#2E7D32" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#9E9E9E"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  textColor="#1A1C1A"
                  underlineColor="transparent"
                  activeUnderlineColor="#2E7D32"
                  theme={{ colors: { onSurfaceVariant: '#9E9E9E' } }}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      color="#9E9E9E"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color="#D32F2F" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#2E7D32', '#43A047']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {loading ? (
                    <Text style={styles.loginButtonText}>Signing in...</Text>
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Sign In</Text>
                      <Icon name="arrow-right" size={20} color="#FFFFFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
              <Text style={styles.registerText}>
                Don't have an account? <Text style={styles.registerHighlight}>Create one</Text>
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
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 60 },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.4 },
  orb1: { width: 250, height: 250, backgroundColor: '#E8F5E9', top: -50, right: -80 },
  orb2: { width: 200, height: 200, backgroundColor: '#F1F8E9', bottom: 100, left: -60 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', marginBottom: 16, backgroundColor: '#FFFFFF', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  logoGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoEmoji: { fontSize: 50 },
  title: { fontSize: 36, fontWeight: '800', color: '#1A1C1A', letterSpacing: -1 },
  subtitle: { fontSize: 15, color: '#5C635C', marginTop: 6, letterSpacing: 0.3 },
  formContainer: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  toggleContainer: { flexDirection: 'row', borderRadius: 16, backgroundColor: '#F5F5F5', padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12 },
  toggleActive: { backgroundColor: '#2E7D32', elevation: 2 },
  toggleText: { marginLeft: 6, fontSize: 14, fontWeight: '700', color: '#5C635C' },
  toggleTextActive: { color: '#FFFFFF' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF8',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#EEEEEE',
    paddingLeft: 14,
  },
  inputIcon: { marginRight: 4 },
  input: { flex: 1, backgroundColor: 'transparent', fontSize: 15, height: 52 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  errorText: { color: '#D32F2F', marginLeft: 8, fontSize: 13 },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  loginButtonText: { fontSize: 17, fontWeight: '800', color: '#FFFFFF', marginRight: 8 },
  forgotPassword: { alignItems: 'center', marginTop: 16 },
  forgotText: { color: '#9E9E9E', fontSize: 13, fontWeight: '500' },
  registerLink: { alignItems: 'center', marginTop: 28 },
  registerText: { color: '#5C635C', fontSize: 14 },
  registerHighlight: { color: '#2E7D32', fontWeight: '800' },
});
