import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {colors, fonts} from '../../utils';
import {MyButton, MyHeader, MyInput, MyRadio} from '../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {apiURL, getData, webURL} from '../../utils/localStorage';
import axios from 'axios';

export default function Checkout({navigation, route}) {
  const {product} = route.params;
  const [user, setUser] = useState({});
  const [nights, setNights] = useState(1); // Ubah dari quantity ke nights
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('bank');
  const [selectedBank, setSelectedBank] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber] = useState(
    `ROOM-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  const banks = ['BCA', 'BRI', 'BNI', 'Mandiri'];
  const eWallets = ['OVO', 'DANA', 'ShopeePay', 'Gopay'];
  const totalPrice = product.harga * nights;

  useEffect(() => {
    getData('user').then(u => setUser(u));
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setCheckInDate(formatDate(today));
    setCheckOutDate(formatDate(tomorrow));
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const saveTransactionToStorage = async () => {
    try {
      let kirim = {
        fid_jasa: product.id_jasa || product.id, // Support both API and dummy data
        nama_kamar: product.nama_kamar,
        jumlah_malam: nights,
        tanggal_checkin: checkInDate,
        tanggal_checkout: checkOutDate,
        nama_tamu: guestName,
        telepon_tamu: guestPhone,
        total: totalPrice,
        pembayaran: selectedBank,
        fid_customer: user.id_customer,
        bukti_transaksi: paymentProof,
        status_booking: 'pending',
      };

      // Tetap menggunakan endpoint yang sama untuk kompatibilitas backend
      axios.post(apiURL + 'insert_transaksi', kirim).then(res => {
        console.log(res.data);
        setOrderConfirmed(true);
      });
      console.log('Berhasil menyimpan booking kamar', kirim);
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const selectImageSource = () => {
    Alert.alert('Upload Bukti Transfer', 'Pilih sumber gambar', [
      {text: 'Gallery', onPress: () => handleImageSelection('library')},
      {text: 'Kamera', onPress: () => handleImageSelection('camera')},
      {text: 'Batal', style: 'cancel'},
    ]);
  };

  const handleImageSelection = source => {
    const imagePicker = source === 'camera' ? launchCamera : launchImageLibrary;

    imagePicker(
      {
        includeBase64: true,
        mediaType: 'photo',
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          console.log(response.assets[0]);
          setPaymentProof(
            `data:${response.assets[0].type};base64, ${response.assets[0].base64}`,
          );
        }
      },
    );
  };

  const confirmPayment = async () => {
    if (!guestName.trim()) {
      Alert.alert('Error', 'Harap isi nama tamu');
      return;
    }
    if (!guestPhone.trim()) {
      Alert.alert('Error', 'Harap isi nomor telepon tamu');
      return;
    }
    if (!paymentProof) {
      Alert.alert('Error', 'Harap upload bukti transfer terlebih dahulu');
      return;
    }

    try {
      await saveTransactionToStorage();
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan booking');
      console.error(error);
    }
  };

  const openWhatsApp = () => {
    const message = `Halo, saya memiliki pertanyaan tentang booking kamar ${product.nama_kamar} dengan nomor pesanan #${orderNumber}`;
    Linking.openURL(
      `whatsapp://send?phone=6281234567890&text=${encodeURIComponent(message)}`,
    );
  };

  if (orderConfirmed) {
    return (
      <View style={styles.container}>
        <MyHeader
          title="Konfirmasi Booking"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.confirmationContainer}>
          <Icon
            name="checkmark-circle"
            size={80}
            color="#4BB543"
            style={styles.successIcon}
          />
          <Text style={styles.confirmationTitle}>
            Booking Sedang Diverifikasi
          </Text>
          <Text style={styles.orderNumber}>Nomor Booking: #{orderNumber}</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Kamar: {product.nama_kamar}</Text>
            <Text style={styles.summaryText}>Jumlah Malam: {nights}</Text>
            <Text style={styles.summaryText}>Check-in: {checkInDate}</Text>
            <Text style={styles.summaryText}>Check-out: {checkOutDate}</Text>
            <Text style={styles.summaryText}>Nama Tamu: {guestName}</Text>
            <Text style={styles.summaryText}>
              Total: Rp {totalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <MyButton
              title="Kembali ke Beranda"
              type="outline"
              onPress={() => navigation.navigate('Home')}
              style={styles.homeButton}
            />
            <MyButton
              title="Hubungi CS"
              onPress={openWhatsApp}
              style={styles.helpButton}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MyHeader title="Booking Kamar" onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Detail Kamar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Kamar</Text>
          <View style={styles.productContainer}>
            <FastImage
              source={{
                uri: product.foto_kamar || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop&q=80',
              }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.nama_kamar}</Text>
              <Text style={styles.productPrice}>
                Rp {new Intl.NumberFormat('id-ID').format(product.harga)}/malam
              </Text>
              <Text style={styles.capacityText}>
                Kapasitas: {product.kapasitas} orang
              </Text>
              <View style={styles.nightsContainer}>
                <TouchableOpacity
                  onPress={() => setNights(Math.max(1, nights - 1))}>
                  <Icon name="remove-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.nightsText}>{nights} malam</Text>
                <TouchableOpacity onPress={() => setNights(nights + 1)}>
                  <Icon name="add-circle" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Data Tamu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Tamu</Text>
          <MyInput
            label="Nama Lengkap Tamu"
            placeholder="Masukkan nama lengkap"
            value={guestName}
            onChangeText={setGuestName}
            iconname="person"
          />
          <MyInput
            label="Nomor Telepon"
            placeholder="Masukkan nomor telepon"
            value={guestPhone}
            onChangeText={setGuestPhone}
            iconname="call"
            keyboardType="phone-pad"
          />
        </View>

        {/* Tanggal Booking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tanggal Menginap</Text>
          <View style={styles.dateContainer}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Check-in</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Icon name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateText}>{checkInDate}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Check-out</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Icon name="calendar" size={20} color={colors.primary} />
                <Text style={styles.dateText}>{checkOutDate}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.noteText}>
            Check-in: 14:00 - 23:00 | Check-out: Sebelum 12:00
          </Text>
        </View>

        {/* Total Pembayaran */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Pembayaran</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {product.nama_kamar} x {nights} malam
            </Text>
            <Text style={styles.summaryValue}>
              Rp {totalPrice.toLocaleString()}
            </Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Pembayaran:</Text>
            <Text style={styles.totalPrice}>
              Rp {totalPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Metode Pembayaran */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <View style={styles.paymentOptions}>
            <MyRadio
              label="Transfer Bank"
              selected={selectedPayment === 'bank'}
              onPress={() => setSelectedPayment('bank')}
            />
            {selectedPayment === 'bank' && (
              <View style={styles.bankOptions}>
                {banks.map(bank => (
                  <TouchableOpacity
                    key={bank}
                    style={[
                      styles.bankOption,
                      selectedBank === bank && styles.selectedBank,
                    ]}
                    onPress={() => setSelectedBank(bank)}>
                    <Text
                      style={
                        selectedBank === bank
                          ? styles.selectedBankText
                          : styles.bankText
                      }>
                      {bank}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <MyRadio
              label="E-Wallet"
              selected={selectedPayment === 'ewallet'}
              onPress={() => setSelectedPayment('ewallet')}
            />
            {selectedPayment === 'ewallet' && (
              <View style={styles.bankOptions}>
                {eWallets.map(wallet => (
                  <TouchableOpacity
                    key={wallet}
                    style={[
                      styles.bankOption,
                      selectedBank === wallet && styles.selectedBank,
                    ]}
                    onPress={() => setSelectedBank(wallet)}>
                    <Text
                      style={
                        selectedBank === wallet
                          ? styles.selectedBankText
                          : styles.bankText
                      }>
                      {wallet}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Upload Bukti Transfer */}
        {selectedBank !== '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Bukti Transfer</Text>
            {paymentProof ? (
              <View>
                <Image source={{uri: paymentProof}} style={styles.proofImage} />
                <MyButton
                  title="Ganti Bukti"
                  type="outline"
                  onPress={selectImageSource}
                  style={styles.changeProofButton}
                />
              </View>
            ) : (
              <MyButton
                title="Upload Bukti Transfer"
                type="outline"
                icon="camera"
                onPress={selectImageSource}
                style={styles.uploadButton}
              />
            )}
            <Text style={styles.noteText}>
              Pastikan bukti transfer jelas terbaca dan sesuai dengan nominal
              pembayaran
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Tombol Konfirmasi */}
      {selectedBank !== '' && paymentProof && (
        <View style={styles.footer}>
          <MyButton
            title="Konfirmasi Booking"
            onPress={confirmPayment}
            style={styles.confirmButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 18,
    color: colors.dark,
    marginBottom: 15,
  },
  productContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    color: colors.dark,
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  capacityText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    color: colors.gray,
    marginBottom: 10,
  },
  nightsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nightsText: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    marginHorizontal: 15,
    color: colors.dark,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  dateLabel: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  dateText: {
    fontFamily: fonts.secondary[500],
    fontSize: 14,
    color: colors.dark,
    marginLeft: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontFamily: fonts.secondary[500],
    fontSize: 14,
    color: colors.dark,
  },
  summaryValue: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.dark,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    color: colors.dark,
  },
  totalPrice: {
    fontFamily: fonts.secondary[700],
    fontSize: 18,
    color: colors.primary,
  },
  paymentOptions: {
    marginLeft: 10,
  },
  bankOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 30,
    marginBottom: 15,
    marginTop: 10,
  },
  bankOption: {
    padding: 12,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  selectedBank: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  bankText: {
    fontFamily: fonts.secondary[500],
    fontSize: 14,
    color: colors.dark,
  },
  selectedBankText: {
    fontFamily: fonts.secondary[600],
    fontSize: 14,
    color: colors.white,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButton: {
    marginBottom: 15,
  },
  changeProofButton: {
    width: 200,
    alignSelf: 'center',
  },
  noteText: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    color: colors.gray,
    textAlign: 'center',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    width: '100%',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  successIcon: {
    marginBottom: 20,
  },
  confirmationTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 22,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    color: colors.primary,
    marginBottom: 30,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
  },
  summaryText: {
    fontFamily: fonts.secondary[600],
    fontSize: 16,
    color: colors.dark,
    marginBottom: 8,
  },
  actionButtons: {
    width: '100%',
  },
  homeButton: {
    marginBottom: 15,
  },
  helpButton: {
    backgroundColor: colors.primary,
  },
});