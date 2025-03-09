import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/ui/Header';
import SearchInput from '../components/ui/Input';
import {normalize} from '../utils/helper';
import {useLocation} from '../context/LocationContext';
import {
  getUserLocationFromIP,
  getPlacePredictions,
  getPlaceDetails,
  reverseGeocode,
} from '../services/googlePlacesService';
import LocationPermissionBanner from '../components/LocationBanner';
import Geolocation from '@react-native-community/geolocation';
import { checkLocationPermission } from '../services/locationService';

const {width} = Dimensions.get('window');

const Address = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const {hasLocationPermission} = useLocation();

  useEffect(() => {
    initializeUserLocation();
  }, []);

  const initializeUserLocation = async () => {
    const location = await getUserLocationFromIP();
    if (location) {
      setUserLocation(location);
    }
  };

  const handleCurrentLocation = async () => {
    const granted = await checkLocationPermission();
    if (!granted) {
      return;
    }
    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude, longitude} = position.coords;
          const result = await fetchAddressFromCoordinates(latitude, longitude);

          if (result?.formattedAddress) {
            // Split address components for better display
            const addressParts = result.formattedAddress.split(',');
            const mainText = addressParts[0];
            const secondaryText = addressParts.slice(1).join(',').trim();

            navigation.navigate('ConfirmLocation', {
              latitude,
              longitude,
              address: result.formattedAddress,
              placeName: mainText,
              secondaryAddress: secondaryText,
              placeId: `${latitude},${longitude}`,
            });
          } else {
            // If we can't get the address, make another attempt with reverse geocoding
            const retryResult = await reverseGeocode(latitude, longitude);
            if (retryResult?.formattedAddress) {
              const addressParts = retryResult.formattedAddress.split(',');
              const mainText = addressParts[0];
              const secondaryText = addressParts.slice(1).join(',').trim();

              navigation.navigate('ConfirmLocation', {
                latitude,
                longitude,
                address: retryResult.formattedAddress,
                placeName: mainText,
                secondaryAddress: secondaryText,
                placeId: `${latitude},${longitude}`,
              });
            } else {
              Alert.alert(
                'Address Not Found',
                'Unable to fetch address details for your location. Please try searching for a location instead.',
              );
            }
          }
        } catch (error) {
          console.error('Error getting current location:', error);
          Alert.alert(
            'Location Error',
            'Unable to get address details for your location. Please try again or search for a location.',
          );
        } finally {
          setLoading(false);
        }
      },
      error => {
        console.error('Geolocation error:', error);
        setLoading(false);
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          default:
            errorMessage = 'Error getting location';
        }
        Alert.alert('Location Error', errorMessage);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      },
    );
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const result = await reverseGeocode(latitude, longitude);
      if (!result) {
        throw new Error('No address found');
      }
      return result;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const handleSearch = useCallback(
    async text => {
      setSearchText(text);
      if (text.length > 2) {
        setLoading(true);
        const predictions = await getPlacePredictions(text, userLocation);
        setSearchResults(predictions);
        setLoading(false);
      } else {
        setSearchResults([]);
      }
    },
    [userLocation],
  );

  const handleSelectPlace = async place => {
    try {
      setLoading(true);
      const placeDetails = await getPlaceDetails(place.place_id);

      if (placeDetails?.latitude && placeDetails?.longitude) {
        // Format the address for better display
        const mainText =
          place.structured_formatting?.main_text ||
          placeDetails.address.split(',')[0];

        navigation.navigate('ConfirmLocation', {
          latitude: placeDetails.latitude,
          longitude: placeDetails.longitude,
          // Use structured address for better readability
          address: placeDetails.address,
          // Add place name for the location title
          placeName: mainText,
          placeId: place.place_id,
        });
      } else {
        Alert.alert(
          'Error',
          'Unable to get location details. Please try another location.',
        );
      }
    } catch (error) {
      console.error('Error selecting place:', error);
      Alert.alert('Error', 'Unable to get location details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({item}) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectPlace(item)}>
      <View style={styles.locationIconContainer}>
        <Ionicons name="location-outline" size={normalize(22)} color="#333" />
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultName}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        <Text style={styles.resultAddress}>
          {item.structured_formatting?.secondary_text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Header
        title="Add address"
        onBackPress={() => navigation.goBack()}
        showBack={true}
      />
      {!hasLocationPermission && <LocationPermissionBanner />}
      <View style={styles.content}>
        <SearchInput
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search for area, street name..."
          showIcon={true}
          containerStyle={styles.inputWrapperContainer}
        />

        {hasLocationPermission && (
          <TouchableOpacity
            style={styles.currentLocationButton}
            onPress={handleCurrentLocation}>
            <View style={styles.currentLocationIconContainer}>
              <Ionicons
                name="locate-outline"
                size={normalize(20)}
                color="#EF6C00"
              />
              <Text style={styles.currentLocationText}>
                Use current location
              </Text>
            </View>
            <View>
              <Ionicons
                name="chevron-forward-outline"
                size={normalize(20)}
                color="#000"
              />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.resultsContainer}>
          {loading ? (
            <ActivityIndicator style={styles.loader} color="#EF6C00" size={"large"} />
          ) : (
            searchResults.length > 0 && (
              <>
                <Text style={styles.resultsTitle}>SEARCH RESULTS</Text>
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={item => item.place_id}
                  contentContainerStyle={styles.resultsList}
                  showsVerticalScrollIndicator={false}
                />
              </>
            )
          )}
        </View>
      </View>

      <Pressable
        style={styles.manualContainer}
        onPress={() => navigation.navigate('ManualAddress')}>
        <Ionicons name="add-outline" size={normalize(20)} color="#EF6C00" />
        <Text style={styles.manualText}>Add address manually</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFDFC',
  },
  content: {
    flex: 1,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: normalize(16),
    marginTop: normalize(16),
  },
  resultsTitle: {
    fontSize: normalize(15),
    letterSpacing:normalize(3),
    color: '#757575',
    marginBottom: normalize(12),
    fontFamily:'GothamRoundedMedium',
  },
  resultsList: {
    paddingBottom: normalize(60),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
  },
  locationIconContainer: {
    marginRight: normalize(12),
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: normalize(17),
    color: 'rgba(27, 40, 27, 1)',
    marginBottom: normalize(4),
    fontFamily:'GothamRoundedMedium',
  },
  resultAddress: {
    fontSize: normalize(15),
    color: 'rgba(20, 46, 21, 0.62)',
    fontFamily:'GothamRoundedRegular',
  },
  manualContainer: {
    height: normalize(56),
    width: width,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    gap: normalize(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -normalize(2)},
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    zIndex: 1,
  },
  manualText: {
    fontSize: normalize(18),
    color: '#EF6C00',
    fontFamily:'GothamRoundedMedium',
  },
  inputWrapperContainer: {
    height: normalize(48),
    paddingHorizontal: normalize(12),
    marginHorizontal: normalize(16),
    marginVertical: normalize(16),
  },
  loader: {
    marginTop: normalize(20),
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  currentLocationIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentLocationText: {
    marginLeft: normalize(12),
    fontSize: normalize(18),
    color: '#EF6C00',
    fontFamily:'GothamRoundedMedium',
  },
});
