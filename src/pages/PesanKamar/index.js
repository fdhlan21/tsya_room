import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { colors, fonts } from '../../utils'
import {MyHeader} from '../../components';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

const {width} = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with proper spacing

export default function PesanKamar({navigation}) {
  
  const roomData = [
    {
      id: 1,
      name: 'Deluxe Room',
      price: 'Rp 350.000',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop',
      facilities: ['WiFi', 'AC', 'TV'],
      description: 'Kamar nyaman dengan pemandangan kota'
    },
    {
      id: 2,
      name: 'Superior Room',
      price: 'Rp 450.000',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
      facilities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
      description: 'Kamar luas dengan fasilitas lengkap'
    },
    {
      id: 3,
      name: 'Executive Suite',
      price: 'Rp 750.000',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop',
      facilities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
      description: 'Suite mewah dengan ruang tamu terpisah'
    },
    {
      id: 4,
      name: 'Presidential Suite',
      price: 'Rp 1.200.000',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
      facilities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi'],
      description: 'Suite premium dengan pemandangan panorama'
    }
  ];

  const handleRoomPress = (room) => {
    // Navigate to dynamic ProdukDetail with kamar type
    console.log('Room selected:', room.name);
    
    // Convert room data to match ProdukDetail expected format
    const productData = {
      id: room.id,
      nama_kamar: room.name,
      harga: parseInt(room.price.replace(/[^0-9]/g, '')), // Convert "Rp 350.000" to 350000
      deskripsi: room.description,
      foto_kamar: room.image,
      fasilitas: room.facilities,
      kapasitas: 2, // Default capacity, bisa disesuaikan
      status: 'tersedia'
    };
    
    navigation.navigate('ProdukDetail', { 
      product: productData, 
      menuType: 'kamar' 
    });
  };



  // Function to render cards in rows
  const renderRoomRow = (startIndex) => {
    const roomsInRow = roomData.slice(startIndex, startIndex + 2);
    
    return (
      <View style={styles.roomRow} key={`row-${startIndex}`}>
        {roomsInRow.map((room, index) => (
          <TouchableOpacity
            key={room.id}
            style={styles.roomCard}
            onPress={() => handleRoomPress(room)}>
            <LinearGradient
              colors={['#f8f9fa', '#ffffff']}
              style={styles.cardGradient}>
              <View style={styles.imageContainer}>
                <FastImage
                  source={{ uri: room.image }}
                  style={styles.roomImage}
                  resizeMode="cover"
                />

              </View>
              
              <View style={styles.cardContent}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomDescription}>{room.description}</Text>
                
                <View style={styles.facilitiesContainer}>
                  {room.facilities.slice(0, 3).map((facility, idx) => (
                    <View key={idx} style={styles.facilityTag}>
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
                  {room.facilities.length > 3 && (
                    <View style={styles.facilityTag}>
                      <Text style={styles.facilityText}>+{room.facilities.length - 3}</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.priceContainer}>
                  <Text style={styles.priceLabel}>Mulai dari</Text>
                  <Text style={styles.price}>{room.price}</Text>
                  <Text style={styles.priceUnit}>/malam</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MyHeader title="Kamar"/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Pilih Kamar Favorit Anda</Text>
            <Text style={styles.subtitle}>Temukan kenyamanan terbaik untuk menginap</Text>
          </View>

          <View style={styles.roomGrid}>
            {renderRoomRow(0)}
            {renderRoomRow(2)}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Fasilitas Hotel</Text>
            <View style={styles.hotelFacilities}>
              <View style={styles.facilityItem}>
                <Icon name="wifi" type="material" size={20} color={colors.primary} />
                <Text style={styles.facilityItemText}>Free WiFi</Text>
              </View>
              <View style={styles.facilityItem}>
                <Icon name="pool" type="material" size={20} color={colors.primary} />
                <Text style={styles.facilityItemText}>Swimming Pool</Text>
              </View>
              <View style={styles.facilityItem}>
                <Icon name="restaurant" type="material" size={20} color={colors.primary} />
                <Text style={styles.facilityItemText}>Restaurant</Text>
              </View>
              <View style={styles.facilityItem}>
                <Icon name="local-parking" type="material" size={20} color={colors.primary} />
                <Text style={styles.facilityItemText}>Free Parking</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    padding: 20
  },
  headerSection: {
    marginBottom: 25,
    alignItems: 'center'
  },
  title: {
    fontFamily: fonts.secondary[700],
    fontSize: 22,
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: fonts.secondary[400],
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  roomGrid: {
    marginBottom: 20
  },
  roomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  roomCard: {
    width: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    backgroundColor: 'white'
  },
  cardGradient: {
    flex: 1
  },
  imageContainer: {
    position: 'relative',
    height: 130
  },
  roomImage: {
    width: '100%',
    height: '100%'
  },

  cardContent: {
    padding: 14
  },
  roomName: {
    fontFamily: fonts.secondary[700],
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4
  },
  roomDescription: {
    fontFamily: fonts.secondary[400],
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  facilityTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4
  },
  facilityText: {
    fontSize: 10,
    color: colors.primary,
    fontFamily: fonts.secondary[500]
  },
  priceContainer: {
    alignItems: 'flex-start'
  },
  priceLabel: {
    fontSize: 10,
    color: '#999',
    fontFamily: fonts.secondary[400]
  },
  price: {
    fontSize: 16,
    fontFamily: fonts.secondary[700],
    color: '#e74c3c',
    marginTop: 2
  },
  priceUnit: {
    fontSize: 11,
    color: '#666',
    fontFamily: fonts.secondary[400]
  },
  infoSection: {
    marginTop: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 20
  },
  infoTitle: {
    fontFamily: fonts.secondary[700],
    fontSize: 18,
    color: colors.primary,
    marginBottom: 15,
    textAlign: 'center'
  },
  hotelFacilities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12
  },
  facilityItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontFamily: fonts.secondary[500]
  }
});