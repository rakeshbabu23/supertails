import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/ui/Button';
import {normalize} from '../utils/helper';
import Container from '../components/ui/Container';
import Header from '../components/ui/Header';
import SearchInput from '../components/ui/Input';
import {useNavigation, useRoute} from '@react-navigation/native';
import LocationPermissionBanner from '../components/LocationBanner';
import {getCurrentLocation} from '../services/locationService';
import {getPlaceDetails, reverseGeocode} from '../services/googlePlacesService';
import {useLocation} from '../context/LocationContext';

const INITIAL_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [region, setRegion] = useState(INITIAL_REGION);
  const [address, setAddress] = useState('');
  const {hasLocationPermission} = useLocation();
  const mapRef = useRef(null);

  useEffect(() => {
    handleInitialLocation();
  }, []);

  const handleInitialLocation = async () => {
    const {initialLocation, placeId, fromCurrentLocation, fromSearch} =
      route.params || {};

    if (fromCurrentLocation && initialLocation) {
      setRegion({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setAddress('Current Location');
      fetchAddressFromCoordinates(
        initialLocation.latitude,
        initialLocation.longitude,
      );
    } else if (fromSearch && placeId) {
      setLoading(true);
      try {
        const details = await getPlaceDetails(placeId);
        if (details) {
          setRegion({
            latitude: details.latitude,
            longitude: details.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setAddress(details.address);
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    setAddressLoading(true);
    try {
      const result = await reverseGeocode(latitude, longitude);
      if (result) {
        setAddress(result.formattedAddress);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleLocationReceived = location => {
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setAddress('');
    fetchAddressFromCoordinates(location.latitude, location.longitude);
  };

  const handleSearch = async () => {
    navigation.navigate('Address');
  };

  const handleRegionChangeComplete = newRegion => {
    // This gets triggered when the user stops dragging the map
    fetchAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      handleLocationReceived(location);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleConfirmLocation = () => {
    navigation.navigate('ConfirmLocation', {
      latitude: region.latitude,
      longitude: region.longitude,
      address: address,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#EF6C00" />
      </View>
    );
  }

  return (
    <Container style={styles.container}>
      <Header
        title="Select delivery location"
        onBackPress={() => navigation.goBack()}
        showBack={true}
      />
      

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}>
        </MapView>
        <View style={styles.searchWrapper}>
        <Pressable style={styles.searchContainer} onPress={handleSearch}>
          <SearchInput
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
            placeholder="Search area, street, name..."
            canEdit={false}
          />

          {!hasLocationPermission && (
            <LocationPermissionBanner
              onLocationReceived={handleLocationReceived}
              bannerContainerStyles={styles.bannerContainerStyles}
              onPress={() => {}}
            />
          )}
        </Pressable>
      </View>

        <View style={styles.fixedMarkerContainer}>
          <View style={styles.customMarker}>
            <View style={styles.markerPin}>
             
              <View
              style={{
                backgroundColor: '#7E953C',
                borderRadius: normalize(20),
                padding: normalize(8),
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              ></View>
            </View>
            <View style={styles.markerShadow} />
          </View>
        </View>

        <View style={styles.mapTooltip}>
          <Text style={styles.tooltipTitle}>Order will be delivered here</Text>
          <Text style={styles.tooltipSubtitle}>
            Move the map to change location
          </Text>
        </View>

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}>
          <Icon name="my-location" size={normalize(18)} color="#EF6C00" />
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>
      </View>

      <Container style={styles.footerContainer}>
        <View style={styles.locationRow}>
          <Icon name="location-on" size={normalize(24)} color="#EF6C00" />
          <View style={styles.locationTextContainer}>
            {addressLoading ? (
              <View style={styles.addressLoadingContainer}>
                <ActivityIndicator size="small" color="#EF6C00" />
                <Text style={[styles.locationAddress, styles.loadingText]}>
                  Fetching address...
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.locationTitle}>
                  {address ? address.split(',')[0] : 'Select Location'}
                </Text>
                <Text style={styles.locationAddress} numberOfLines={2}>
                  {address || 'Move map to select location'}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Address')}
            style={styles.changeButton}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Confirm location"
          buttonStyle={[
            styles.confirmButton,
            !address && styles.confirmButtonDisabled,
          ]}
          textStyle={styles.confirmButtonText}
          onPress={handleConfirmLocation}
          disabled={!address}
        />
      </Container>
    </Container>
  );
};
export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fixedMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -15}, {translateY: -30}],
    zIndex: 5, 
    pointerEvents: 'none', 
  },
  input: {
    height: normalize(48),
    borderColor: '#EEEEEE',
    borderRadius: normalize(16),
    paddingLeft: normalize(8),
  },
  inputContainer: {
    height: normalize(48),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(16),
  },
  searchWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
  },
  searchContainer: {
    width: '100%',
    maxWidth: normalize(343),
    borderRadius: normalize(24),
    overflow: 'hidden',
    backgroundColor: '#FFF6F7',
  },
  searchResultsContainer: {
    backgroundColor: '#fff',
    borderRadius: normalize(8),
    marginHorizontal: normalize(12),
    marginTop: normalize(4),
    elevation: 3,
    maxHeight: normalize(200),
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    marginLeft: normalize(8),
    fontSize: normalize(14),
    color: '#333',
  },
  bannerContainerStyles: {
    borderTopRightRadius: normalize(0),
    borderTopLeftRadius: normalize(0),
    borderBottomRightRadius: normalize(16),
    borderBottomLeftRadius: normalize(16),
  },
  customMarker: {
    alignItems: 'center',
  },
  markerPin: {
    backgroundColor: '#E7F9B1',
    borderRadius: normalize(22),
    padding: normalize(15),
    elevation: 5,
    shadowColor: '#E7F9B1',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerShadow: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    marginTop: normalize(2),
    shadowColor: '#E7F9B1',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mapTooltip: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -normalize(100),
    marginTop: -normalize(80),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: normalize(6),
    padding: normalize(8),
    width: normalize(200),
    alignItems: 'center',
  },
  tooltipTitle: {
    color: '#fff',
    fontSize: normalize(14),
    fontFamily:'GothamRoundedMedium',
  },
  tooltipSubtitle: {
    color: '#fff',
    fontSize: normalize(12),
    marginTop: normalize(2),
    fontFamily:'GothamRoundedRegular',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: normalize(16),
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(10),
    elevation: 3,
    shadowColor: '#EF6C00',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth:1,
    borderColor:'#EF6C00'
  },
  currentLocationText: {
    marginLeft: normalize(8),
    fontSize: normalize(14),
    color: '#333',
    fontFamily:'GothamRoundedMedium',
  },
  footerContainer: {
    padding: normalize(16),
    backgroundColor: '#fff',

    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: normalize(16),
  },
  locationTextContainer: {
    marginLeft: normalize(12),
    flex: 1,
  },
  locationTitle: {
    fontSize: normalize(16),
    color: '#212121',
    marginBottom: normalize(4),
    fontFamily:'GothamRoundedBold',
  },
  locationAddress: {
    fontSize: normalize(14),
    color: '#757575',
    lineHeight: normalize(20),
    fontFamily:'GothamRoundedMedium',
  },
  addressLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
  },
  loadingText: {
    color: '#EF6C00',
    fontFamily:'GothamRoundedMedium',
  },
  changeButton: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(20),
    backgroundColor: '#FFEEE6',
    borderRadius: normalize(8),
  },
  changeText: {
    color: '#EF6C00',
    fontSize: normalize(14),
    fontFamily:'GothamRoundedMedium',
  },
  confirmButton: {
    width: '100%',
    height: normalize(48),
    backgroundColor: '#EF6C00',
    borderRadius: normalize(8),
  },
  confirmButtonDisabled: {
    backgroundColor: '#FFE5CC',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontFamily:'GothamRoundedBold',
  },
});
