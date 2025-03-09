import {Dimensions, StyleSheet, Text, View, TouchableOpacity,StatusBar} from 'react-native';
import React from 'react';
import Button from '../components/ui/Button';
import {normalize} from '../utils/helper';
import {useNavigation} from '@react-navigation/native';
import Container from '../components/ui/Container';
import {useLocation} from '../context/LocationContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const {hasLocationPermission} = useLocation();

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.mainContainer}>
        {/* Address Management Card */}
        <View style={styles.addressCardContainer}>
          <TouchableOpacity 
            style={styles.addressCard}
            onPress={() => navigation.navigate('AddressManagement')}
          >
            <View style={styles.addressCardContent}>
              <View style={styles.addressIconContainer}>
                <Ionicons name="location-outline" size={normalize(24)} color="#F47B20" />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressCardTitle}>Manage Addresses</Text>
                <Text style={styles.addressCardSubtitle}>
                  View, edit or add new delivery addresses
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={normalize(20)} color="#888" />
            </View>
          </TouchableOpacity>
        </View>
        <Container style={styles.buttonContainer}>
          <Button
            title="Add Address"
            buttonStyle={{
              width: normalize(343),
              height: normalize(48),
            }}
            textStyle={{
              fontFamily:'GothamRoundedMedium',
            }}
            onPress={() => {
              if (hasLocationPermission) {
                navigation.navigate('MapScreen');
              } else {
                navigation.navigate('Address');
              }
            }}
          />
        </Container>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F6FB',
  },
  addressCardContainer: {
    padding: normalize(16),
    marginTop: normalize(20),
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: normalize(16),
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  addressCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconContainer: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: '#FFF6F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },
  addressTextContainer: {
    flex: 1,
  },
  addressCardTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#333',
    fontFamily:'GothamRoundedMedium',
    marginBottom: normalize(4),
  },
  addressCardSubtitle: {
    fontSize: normalize(12),
    color: '#666',
    fontFamily:'GothamRoundedRegular',
  },
  buttonContainer: {
    height: normalize(76),
    width: width,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});