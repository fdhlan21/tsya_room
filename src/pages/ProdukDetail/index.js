import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, fonts} from '../../utils';
import {MyHeader} from '../../components';
import {ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {apiURL, webURL} from '../../utils/localStorage';
import axios from 'axios';

export default function ProdukDetail({navigation, route}) {
  // Get room data from navigation params
  const {product} = route.params || {
    product: {
      id: 1,
      nama_kamar: 'Kamar Deluxe Single',
      harga: 300000,
      deskripsi: 'Kamar nyaman dengan kasur single, AC, TV, dan WiFi gratis. Cocok untuk 1 orang.',
      foto_kamar: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      fasilitas: ['AC', 'TV', 'WiFi', 'Kamar Mandi Dalam'],
      kapasitas: 1,
      status: 'tersedia'
    },
  };

  const handleBookNow = () => {
    navigation.navigate('CheckOut', {product}); // Kirim room data ke Checkout
  };

  const [comp, setComp] = useState({});
  const [loading, setLoading] = useState(true);
  
  const getCompany = () => {
    axios.post(apiURL + 'company')
      .then(res => {
        console.log(res.data);
        setComp(res.data);
      })
      .catch(error => {
        console.log('Error fetching company:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Set timeout untuk menghindari loading terlalu lama
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    getCompany();

    return () => clearTimeout(timer);
  }, []);

  const openWhatsApp = () => {
    const message = `Halo, saya tertarik dengan ${
      product.nama_kamar
    } (Rp ${new Intl.NumberFormat('id-ID').format(product.harga)}/malam). Bisa dibantu untuk reservasi?`;
    const newLocal = Linking.openURL(
      `whatsapp://send?phone=${comp.tlp}&text=${encodeURIComponent(message)}`,
    );
    console.log(
      `whatsapp://send?phone=${comp.tlp}&text=${encodeURIComponent(message)}`,
    );
  };

  const formatPrice = (price) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(price)}/malam`;
  };

  const renderFasilitas = () => {
    if (!product.fasilitas || !Array.isArray(product.fasilitas)) return null;
    
    return (
      <View style={styles.facilitiesContainer}>
        {product.fasilitas.map((fasilitas, index) => (
          <View key={index} style={styles.facilityItem}>
            <Icon name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.facilityText}>{fasilitas}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Detail Kamar" onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Room Image */}
        <View style={styles.imageContainer}>
          <FastImage
            source={{
              uri: product.foto_kamar || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&q=80',
            }}
            style={styles.productImage}
            resizeMode="cover"
            priority={FastImage.priority.high}
          />
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, 
            product.status === 'tersedia' ? styles.availableBadge : styles.unavailableBadge]}>
            <Text style={styles.statusText}>
              {product.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
            </Text>
          </View>
        </View>

        {/* Room Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.nama_kamar}</Text>
          <Text style={styles.productPrice}>
            {formatPrice(product.harga)}
          </Text>

          {/* Capacity Info */}
          <View style={styles.capacityContainer}>
            <Icon name="people" size={20} color={colors.primary} />
            <Text style={styles.capacityText}>
              Kapasitas: {product.kapasitas} orang
            </Text>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi Kamar</Text>
            <Text style={styles.productDescription}>
              {product.deskripsi || product.keterangan || 'Tidak ada deskripsi tersedia.'}
            </Text>
          </View>

          {/* Facilities Section */}
          {product.fasilitas && product.fasilitas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              {renderFasilitas()}
            </View>
          )}

          {/* Room Rules Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ketentuan Kamar</Text>
            <View style={styles.rulesContainer}>
              <View style={styles.ruleItem}>
                <Icon name="time" size={16} color={colors.dark} />
                <Text style={styles.ruleText}>Check-in: 14:00 - 23:00</Text>
              </View>
              <View style={styles.ruleItem}>
                <Icon name="time" size={16} color={colors.dark} />
                <Text style={styles.ruleText}>Check-out: Sebelum 12:00</Text>
              </View>
              <View style={styles.ruleItem}>
                <Icon name="ban" size={16} color={colors.dark} />
                <Text style={styles.ruleText}>Dilarang merokok di dalam kamar</Text>
              </View>
              <View style={styles.ruleItem}>
                <Icon name="card" size={16} color={colors.dark} />
                <Text style={styles.ruleText}>Wajib menunjukkan identitas saat check-in</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.helpButton} onPress={openWhatsApp}>
          <Icon name="chatbubble-ellipses" size={20} color={colors.primary} />
          <Text style={styles.helpButtonText}>Tanya</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bookButton, product.status !== 'tersedia' && styles.disabledButton]} 
          onPress={handleBookNow}
          disabled={product.status !== 'tersedia'}>
          <Text style={styles.bookButtonText}>
            {product.status === 'tersedia' ? 'Pesan Sekarang' : 'Tidak Tersedia'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.white,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
  },
  statusBadge: {
    position: 'absolute',
    top: 30,
    right: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableBadge: {
    backgroundColor: '#27ae60',
  },
  unavailableBadge: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    fontFamily: fonts.secondary[600],
    fontSize: 12,
    color: 'white',
  },
  infoContainer: {
    padding: 20,
    paddingTop: 0,
  },
  productName: {
    fontFamily: fonts.secondary[700],
    fontSize: 24,
    color: colors.dark,
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: fonts.secondary[600],
    fontSize: 22,
    color: colors.primary,
    marginBottom: 15,
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  capacityText: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 18,
    color: colors.dark,
    marginBottom: 12,
  },
  productDescription: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: colors.dark,
    lineHeight: 22,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  facilityText: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
  },
  rulesContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    fontFamily: fonts.secondary[400],
    fontSize: 13,
    color: colors.dark,
    marginLeft: 8,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  helpButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    marginRight: 10,
  },
  helpButtonText: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  bookButton: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  bookButtonText: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    color: colors.white,
  },
});