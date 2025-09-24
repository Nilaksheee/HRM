import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import api from '../api/api';
import { setCredentials } from '../redux/store';
import LinearGradient from 'react-native-linear-gradient';
import HomeScreen from '../screens/HomeScreen';
import axios from "axios";


const LoginScreen = () => {
  const [email, setEmail] = useState('nilaksheesingh1@gmail.com');
  const [password, setPassword] = useState('Vrs@123');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();



  

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post(
          'https://3gxqzdsp-2000.inc1.devtunnels.ms/api/v1/auth/token',
          { email, password }
        );
        const data = response.data;

        if (data.message === 'Login successful') {
          Alert.alert('Success', 'Login Successful');

          dispatch(
            setCredentials({
              access: data.access,
              refresh: data.refresh,
              user: response.data.user,   
            })
          );

          navigation.navigate('Home'); 
        } else {
          Alert.alert('Login Failed', data.message || 'Invalid credentials');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Something went wrong');
      }
    } else {
      Alert.alert('Error', 'Email and password are required');
    }
  };

  const handleSendOtp = async () => {
    if (!forgotEmail) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      const response = await api.post(
        '/password-management/forgot',
        { email: forgotEmail }
      );

      if (response.data.success) {
        Alert.alert('Success', 'OTP has been sent to your email');
        setForgotModalVisible(false);
        navigation.navigate('OtpVerification', { email: forgotEmail });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <LinearGradient colors={['#000000', '#0d1b2a', '#1a237e']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require('../image/vrsiisLogo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to your account</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Icon
              name="mail-outline"
              size={20}
              color="#1a237e"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#1a237e"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#1a237e"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => setForgotModalVisible(true)}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            © 2025 VRS Intelligent Innovative System Pvt. Ltd.
          </Text>
        </ScrollView>

        {/* Forgot Password Modal */}
        {forgotModalVisible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Forgot Password</Text>

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#999"
                style={styles.modalInput}
                keyboardType="email-address"
                autoCapitalize="none"
                value={forgotEmail}
                onChangeText={setForgotEmail}
              />

              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSendOtp}
              ><Text style={styles.modalButtonText}>Send OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setForgotModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
  },
  eyeIcon: {
    padding: 5,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    color: '#ffeb3b',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1a237e',
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
  footer: {
    fontSize: 12,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#1a237e',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCloseButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a237e',
  },
  modalCloseText: {
    textAlign: 'center',
    color: '#1a237e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});