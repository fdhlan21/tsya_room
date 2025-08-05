import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, fonts} from '../../utils';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {apiURL, webURL} from '../../utils/localStorage';
import { Icon } from 'react-native-elements';

const {width} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user] = useState({});

  const menuItems = [
    {
      id: 1,
      title: 'Kamar',
      subtitle: 'Booking kamar hotel',
      iconName: 'bed',
      color: ['#FF6B6B', '#FF8E8E'],
      route: 'PesanKamar',
      useImage: false
    },
    {
      id: 2,
      title: 'Tiket Pesawat',
      subtitle: 'Pesan tiket pesawat',
      iconName: 'airplane',
      color: ['#4ECDC4', '#6FE7DE'],
      route: 'TiketPesawat',
      useImage: false
    },
    {
      id: 3,
      title: 'Tiket Kereta Api',
      subtitle: 'Pesan tiket kereta',
      iconName: 'train',
      color: ['#45B7D1', '#7CC8E0'],
      route: 'TiketKereta',
      useImage: false
    },
    {
      id: 4,
      title: 'Whoosh',
      subtitle: 'Kereta cepat Whoosh',
      iconName: require('../../assets/icon_whoosh.png'),
      color: ['#96CEB4', '#B5D8C7'],
      route: 'Whoosh',
      useImage: true
    }
  ];

  const handleMenuPress = (item) => {
    // Navigate ke screen yang sesuai
    navigation.navigate(item.route);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      // Bisa tambahkan logic lain jika diperlukan
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.primary, '#FEFAE0']}
        style={styles.headerGradient}
        start={{x: 0, y: 0}}
        end={{x: 0.9, y: 1}}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>SELAMAT DATANG,</Text>
            <Text style={styles.greetingText}>TSYA ROOMS</Text>
          </View>
          <FastImage
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Menu Layanan</Text>
          <Text style={styles.sectionSubtitle}>Pilih layanan yang Anda butuhkan</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleMenuPress(item)}>
              <LinearGradient
                colors={item.color}
                style={styles.menuGradient}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <View style={styles.menuContent}>
                  <View style={styles.iconContainer}>
                    {item.useImage ? (
                      <FastImage
                        source={item.iconName}
                        style={styles.menuIcon}
                        resizeMode="contain"
                        tintColor={colors.primary}
                      />
                    ) : (
                      <Icon 
                        type='ionicon'
                        name={item.iconName} 
                        size={40} 
                        color={colors.primary} 
                      />
                    )}
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Kenapa Pilih Kami?</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Harga terjangkau dan transparan</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Booking mudah dan cepat</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Customer service 24/7</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✓</Text>
              <Text style={styles.infoText}>Pembayaran aman dan terpercaya</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerGradient: {
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    top: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  greetingText: {
    fontFamily: fonts.secondary[600],
    fontSize: 15,
    color: 'white',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 20,
    color: colors.primary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: '#666',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  menuCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuGradient: {
    padding: 1,
  },
  menuContent: {
    backgroundColor: 'white',
    margin: 1,
    borderRadius: 9,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  menuIcon: {
    width: 70,
    height: 70,
    top:-1,
    tintColor:colors.primary

  },
  menuTextContainer: {
    alignItems: 'center',
  },
  menuTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 14,
    color: colors.primary,
    marginBottom: 3,
    textAlign: 'center',
  },
  menuSubtitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoList: {
    // gap tidak didukung di React Native, menggunakan marginBottom
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoBullet: {
    fontSize: 14,
    color: '#27ae60',
    marginRight: 10,
    fontWeight: 'bold',
  },
  infoText: {
    fontFamily: fonts.secondary[400],
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
});