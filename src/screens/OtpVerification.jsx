import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';

const OtpVerification = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');




  const handleVerifyOtp = async()=>{
    if(!otp){
      Alert.alert('Error','Please enter OTP');
      return;
    }

    try{
      const response = await axios.post('https://yourapi.com/api/v1/auth/verify-otp',{email,otp});

      if(response.data.success){
        Alert.alert('Success','OTP Verified! You can now reset your Password.');
        navigation.navigate('ResetPassword',{email});
      }else{
        Alert.alert('Error',response.data.message || 'Invalid OTP');
      }
    }catch(error){
      console.error('OTP Verify Error:',error);
      Alert.alert('Error','Something went wrong')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        style={styles.input}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerification;
