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
  // Get product data and type from navigation params
  const {product, menuType} = route.params || {};
  
  const [comp, setComp] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Define configuration for each menu type
  const menuConfig = {
    kamar: {
      headerTitle: 'Detail Kamar',
      checkoutRoute: 'CheckOut',
      bookButtonText: 'Pesan Sekarang',
      priceUnit: '/malam',
      whatsappMessage: 'kamar',
      statusField: 'status',
      defaultProduct: {
        id: 1,
        nama_kamar: 'Kamar Deluxe Single',
        harga: 300000,
        deskripsi: 'Kamar nyaman dengan kasur single, AC, TV, dan WiFi gratis. Cocok untuk 1 orang.',
        foto_kamar: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        fasilitas: ['AC', 'TV', 'WiFi', 'Kamar Mandi Dalam'],
        kapasitas: 1,
        status: 'tersedia'
      }
    },
    pesawat: {
      headerTitle: 'Detail Tiket Pesawat',
      checkoutRoute: 'CheckOutPesawat',
      bookButtonText: 'Pesan Tiket',
      priceUnit: '/orang',
      whatsappMessage: 'tiket pesawat',
      statusField: 'ketersediaan',
      defaultProduct: {
        id: 1,
        maskapai: 'Garuda Indonesia',
        rute: 'Jakarta - Bali',
        harga: 1500000,
        deskripsi: 'Penerbangan langsung Jakarta ke Bali dengan layanan premium',
        foto_pesawat: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
        fasilitas: ['Bagasi 20kg', 'Makanan', 'Entertainment', 'WiFi'],
        durasi: '2 jam 30 menit',
        ketersediaan: 'tersedia',
        tanggal_berangkat: '2024-12-15',
        jam_berangkat: '08:00',
        jam_tiba: '10:30'
      }
    },
    kereta: {
      headerTitle: 'Detail Tiket Kereta',
      checkoutRoute: 'CheckOutKereta',
      bookButtonText: 'Pesan Tiket',
      priceUnit: '/orang',
      whatsappMessage: 'tiket kereta api',
      statusField: 'ketersediaan',
      defaultProduct: {
        id: 1,
        nama_kereta: 'Argo Bromo Anggrek',
        rute: 'Jakarta - Surabaya',
        harga: 350000,
        deskripsi: 'Kereta eksekutif dengan fasilitas lengkap dan nyaman',
        foto_kereta: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        fasilitas: ['AC', 'Makanan', 'Selimut', 'Bantal'],
        durasi: '8 jam',
        ketersediaan: 'tersedia',
        tanggal_berangkat: '2024-12-15',
        jam_berangkat: '20:00',
        jam_tiba: '04:00'
      }
    },
    whoosh: {
      headerTitle: 'Detail Tiket Whoosh',
      checkoutRoute: 'CheckOutWhoosh',
      bookButtonText: 'Pesan Tiket',
      priceUnit: '/orang',
      whatsappMessage: 'tiket kereta cepat Whoosh',
      statusField: 'ketersediaan',
      defaultProduct: {
        id: 1,
        nama_kereta: 'Whoosh High Speed',
        rute: 'Jakarta - Bandung',
        harga: 250000,
        deskripsi: 'Kereta cepat terbaru menghubungkan Jakarta dan Bandung dalam waktu singkat',
        foto_kereta: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
        fasilitas: ['AC', 'WiFi Gratis', 'Kursi Ergonomis', 'Colokan Listrik'],
        durasi: '40 menit',
        ketersediaan: 'tersedia',
        tanggal_berangkat: '2024-12-15',
        jam_berangkat: '07:00',
        jam_tiba: '07:40'
      }
    }
  };

  // Get current config based on menu type
  const currentConfig = menuConfig[menuType] || menuConfig.kamar;
  const currentProduct = product || currentConfig.defaultProduct;

  const handleBookNow = () => {
    navigation.navigate(currentConfig.checkoutRoute, {product: currentProduct, menuType});
  };

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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    getCompany();

    return () => clearTimeout(timer);
  }, []);

  const openWhatsApp = () => {
    const productName = getProductName();
    const message = `Halo, saya tertarik dengan ${productName} (${formatPrice(currentProduct.harga)}). Bisa dibantu untuk reservasi?`;
    const newLocal = Linking.openURL(
      `whatsapp://send?phone=${comp.tlp}&text=${encodeURIComponent(message)}`,
    );
  };

  const formatPrice = (price) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(price)}${currentConfig.priceUnit}`;
  };

  const getProductName = () => {
    switch(menuType) {
      case 'kamar': return currentProduct.nama_kamar;
      case 'pesawat': return `${currentProduct.maskapai} - ${currentProduct.rute}`;
      case 'kereta': return `${currentProduct.nama_kereta} - ${currentProduct.rute}`;
      case 'whoosh': return `${currentProduct.nama_kereta} - ${currentProduct.rute}`;
      default: return currentProduct.nama_kamar || 'Produk';
    }
  };

  const getProductImage = () => {
    switch(menuType) {
      case 'kamar': return currentProduct.foto_kamar;
      case 'pesawat': return currentProduct.foto_pesawat;
      case 'kereta': 
      case 'whoosh': return currentProduct.foto_kereta;
      default: return currentProduct.foto_kamar;
    }
  };

  const getProductDescription = () => {
    return currentProduct.deskripsi || currentProduct.keterangan || 'Tidak ada deskripsi tersedia.';
  };

  const renderFasilitas = () => {
    if (!currentProduct.fasilitas || !Array.isArray(currentProduct.fasilitas)) return null;
    
    return (
      <View style={styles.facilitiesContainer}>
        {currentProduct.fasilitas.map((fasilitas, index) => (
          <View key={index} style={styles.facilityItem}>
            <Icon name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.facilityText}>{fasilitas}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCapacityInfo = () => {
    if (menuType === 'kamar') {
      return (
        <View style={styles.capacityContainer}>
          <Icon name="people" size={20} color={colors.primary} />
          <Text style={styles.capacityText}>
            Kapasitas: {currentProduct.kapasitas} orang
          </Text>
        </View>
      );
    }
    
    if (menuType === 'pesawat' || menuType === 'kereta' || menuType === 'whoosh') {
      return (
        <View style={styles.capacityContainer}>
          <Icon name="time" size={20} color={colors.primary} />
          <Text style={styles.capacityText}>
            Durasi Perjalanan: {currentProduct.durasi}
          </Text>
        </View>
      );
    }
    
    return null;
  };

  const renderScheduleInfo = () => {
    if (menuType === 'pesawat' || menuType === 'kereta' || menuType === 'whoosh') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jadwal Keberangkatan</Text>
          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleItem}>
              <Icon name="calendar" size={16} color={colors.primary} />
              <Text style={styles.scheduleText}>
                Tanggal: {currentProduct.tanggal_berangkat}
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <Icon name="airplane" size={16} color={colors.primary} />
              <Text style={styles.scheduleText}>
                Berangkat: {currentProduct.jam_berangkat}
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <Icon name="location" size={16} color={colors.primary} />
              <Text style={styles.scheduleText}>
                Tiba: {currentProduct.jam_tiba}
              </Text>
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderRules = () => {
    if (menuType === 'kamar') {
      return (
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
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ketentuan Perjalanan</Text>
        <View style={styles.rulesContainer}>
          <View style={styles.ruleItem}>
            <Icon name="card" size={16} color={colors.dark} />
            <Text style={styles.ruleText}>Wajib membawa identitas diri yang valid</Text>
          </View>
          <View style={styles.ruleItem}>
            <Icon name="time" size={16} color={colors.dark} />
            <Text style={styles.ruleText}>Hadir 30 menit sebelum keberangkatan</Text>
          </View>
          <View style={styles.ruleItem}>
            <Icon name="ban" size={16} color={colors.dark} />
            <Text style={styles.ruleText}>Dilarang membawa barang berbahaya</Text>
          </View>
          <View style={styles.ruleItem}>
            <Icon name="ticket" size={16} color={colors.dark} />
            <Text style={styles.ruleText}>Tiket tidak dapat direfund</Text>
          </View>
        </View>
      </View>
    );
  };

  const isAvailable = () => {
    const statusField = currentConfig.statusField;
    return currentProduct[statusField] === 'tersedia';
  };

  return (
    <View style={styles.container}>
      <MyHeader title={currentConfig.headerTitle} onPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <FastImage
            source={{
              uri: getProductImage() || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&q=80',
            }}
            style={styles.productImage}
            resizeMode="cover"
            priority={FastImage.priority.high}
          />
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, 
            isAvailable() ? styles.availableBadge : styles.unavailableBadge]}>
            <Text style={styles.statusText}>
              {isAvailable() ? 'Tersedia' : 'Tidak Tersedia'}
            </Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{getProductName()}</Text>
          <Text style={styles.productPrice}>
            {formatPrice(currentProduct.harga)}
          </Text>

          {/* Capacity/Duration Info */}
          {renderCapacityInfo()}

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.productDescription}>
              {getProductDescription()}
            </Text>
          </View>

          {/* Schedule Info for Transportation */}
          {renderScheduleInfo()}

          {/* Facilities Section */}
          {currentProduct.fasilitas && currentProduct.fasilitas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              {renderFasilitas()}
            </View>
          )}

          {/* Rules Section */}
          {renderRules()}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.helpButton} onPress={openWhatsApp}>
          <Icon name="chatbubble-ellipses" size={20} color={colors.primary} />
          <Text style={styles.helpButtonText}>Tanya</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.bookButton, !isAvailable() && styles.disabledButton]} 
          onPress={handleBookNow}
          disabled={!isAvailable()}>
          <Text style={styles.bookButtonText}>
            {isAvailable() ? currentConfig.bookButtonText : 'Tidak Tersedia'}
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
  scheduleContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    fontFamily: fonts.secondary[500],
    fontSize: 14,
    color: colors.dark,
    marginLeft: 8,
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