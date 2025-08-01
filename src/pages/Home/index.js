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

const {width} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user] = useState({});
  const [featuredProducts, setProduct] = useState([
    {
      id: 1,
      nama_kamar: 'Kamar Deluxe Single',
      harga: 300000,
      deskripsi: 'Kamar nyaman dengan kasur single, AC, TV, dan WiFi gratis. Cocok untuk 1 orang.',
      foto_kamar: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&q=80',
      fasilitas: ['AC', 'TV', 'WiFi', 'Kamar Mandi Dalam'],
      kapasitas: 1,
      status: 'tersedia'
    },
    {
      id: 2,
      nama_kamar: 'Kamar Deluxe Double',
      harga: 450000,
      deskripsi: 'Kamar luas dengan kasur double, AC, TV, meja kerja, dan WiFi gratis. Ideal untuk pasangan.',
      foto_kamar: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&h=200&fit=crop&q=80',
      fasilitas: ['AC', 'TV', 'WiFi', 'Meja Kerja', 'Kamar Mandi Dalam'],
      kapasitas: 2,
      status: 'tersedia'
    },
    {
      id: 3,
      nama_kamar: 'Kamar Standard',
      harga: 250000,
      deskripsi: 'Kamar sederhana dengan fasilitas lengkap. Hemat namun tetap nyaman.',
      foto_kamar: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&h=200&fit=crop&q=80',
      fasilitas: ['AC', 'WiFi', 'Kamar Mandi Dalam'],
      kapasitas: 1,
      status: 'tersedia'
    },
    {
      id: 4,
      nama_kamar: 'Kamar Suite',
      harga: 800000,
      deskripsi: 'Kamar mewah dengan ruang tamu terpisah, balkon, dan pemandangan kota.',
      foto_kamar: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop&q=80',
      fasilitas: ['AC', 'TV LED', 'WiFi', 'Balkon', 'Kulkas', 'Sofa', 'Kamar Mandi Dalam'],
      kapasitas: 2,
      status: 'tersedia'
    },
  ]);

  const navigateToDetail = product => {
    navigation.navigate('ProdukDetail', {product});
  };

  const getKamar = () => {
    axios
      .post(apiURL + 'listdata', {
        modul: 'kamar',
      })
      .then(res => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch(error => {
        console.log('Error fetching rooms:', error);
        // Tetap gunakan data dummy jika API gagal
      });
  };

  const formatPrice = (price) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(price)}/malam`;
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getKamar();
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
          <Text style={styles.sectionTitle}>Kamar Tersedia</Text>
          <Text style={styles.sectionSubtitle}>Pilih kamar sesuai kebutuhan Anda</Text>
        </View>

        <View style={styles.productsGrid}>
          {featuredProducts.map(product => (
            <TouchableOpacity
              key={product.id_kamar || product.id}
              style={styles.productCard}
              onPress={() => navigateToDetail(product)}>
              <View style={styles.cardContent}>
                <FastImage
                  source={{
                    uri: product.foto_kamar || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&q=80',
                  }}
                  style={styles.productImage}
                  resizeMode="cover"
                  priority={FastImage.priority.normal}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.nama_kamar || product.nama_jasa}
                  </Text>
                  <Text style={styles.productPrice}>
                    {formatPrice(product.harga)}
                  </Text>
                  {product.kapasitas && (
                    <Text style={styles.capacityText}>
                      Kapasitas: {product.kapasitas} orang
                    </Text>
                  )}
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {product.status === 'tersedia' ? 'Tersedia' : 'Penuh'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 200,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontFamily: fonts.secondary[700],
    fontSize: 12,
    color: colors.primary,
    marginBottom: 5,
    lineHeight: 16,
  },
  productPrice: {
    fontFamily: fonts.secondary[600],
    fontSize: 11,
    color: '#e74c3c',
    marginBottom: 3,
  },
  capacityText: {
    fontFamily: fonts.secondary[400],
    fontSize: 10,
    color: '#666',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#27ae60',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: fonts.secondary[600],
    fontSize: 8,
    color: 'white',
  },
});