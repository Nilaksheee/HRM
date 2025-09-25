
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginScreen from '../screens/LoginScreen';
import { useNavigation } from '@react-navigation/native';


const themes = {
  white: {
    gradient: ['#ffffff', '#f8f9fa'],
    companyColor: '#222',
    taglineColor: '#555',
    footerColor: '#777',
  },
  black: {
    gradient: ['#000000', '#1a1a1a'],
    companyColor: '#ffffff',
    taglineColor: '#bbbbbb',
    footerColor: '#999',
  },
  darkBlue: {
    gradient: ['#0f2027', '#203a43', '#2c5364'],
    companyColor: '#ffffff',
    taglineColor: '#cfd9df',
    footerColor: '#b0c4de',
  },
};





const SplashScreen = ({ theme = 'darkBlue' }) => {
  const colors = themes[theme] || themes.darkBlue;
  const navigation = useNavigation();


  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate(LoginScreen);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);


  return (
    <LinearGradient colors={colors.gradient} style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoWrapper}>
        <Image
          source={require('../image/vrsiisLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.companyName, { color: colors.companyColor }]}>
        Vrsiis Private Limited
      </Text>
      <Text style={[styles.tagline, { color: colors.taglineColor }]}>
        Innovating the Future 
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.footerColor }]}>
          © 2025 Vrsiis Pvt. Ltd.
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 10, 
   },
  logo: {
    width: 110,
    height: 110,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});
