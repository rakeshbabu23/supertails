import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import Header from '../components/ui/Header';
import SearchInput from '../components/ui/Input';
import Button from '../components/ui/Button';
import {normalize} from '../utils/helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import { saveAddress} from '../services/addressService';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const {width} = Dimensions.get('window');

const ConfirmLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {latitude, longitude, address, placeName} = route.params || {};

  const isValidLocation =
    latitude && longitude && typeof latitude === 'number' && typeof longitude === 'number';

  useEffect(() => {
    if (!isValidLocation) {
      Alert.alert(
        'Error',
        'Invalid location coordinates. Please try selecting the location again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }
  }, [isValidLocation, navigation]);

  const [formData, setFormData] = useState({
    houseNo: '',
    buildingName: '',
    landmark: '',
    receiverName: '',
    receiverPhone: '',
    petName: '',
    addressType: 'home',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateFormField = useCallback(
    (field, value) => {
      setFormData(prev => ({...prev, [field]: value}));
      // Only clear errors if they exist
      if (errors[field]) {
        setErrors(prev => ({...prev, [field]: ''}));
      }
    },
    [errors],
  );
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.houseNo.trim()) {
      newErrors.houseNo = 'House/Flat No. is required';
    }
    
    if (!formData.receiverName.trim()) {
      newErrors.receiverName = "Receiver's name is required";
    }
    
    if (!formData.receiverPhone.trim()) {
      newErrors.receiverPhone = "Receiver's phone number is required";
    } else if (!/^\d{10}$/.test(formData.receiverPhone)) {
      newErrors.receiverPhone = "Please enter a valid 10-digit phone number";
    }
    
    if (!isValidLocation) {
      newErrors.location = 'Please select a valid location';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      // Scroll to first error (optional enhancement)
      return;
    }

    setLoading(true);
    try {
      const addressData = {
        type: formData.addressType,
        ...formData,
      };

      const savedAddress = await saveAddress(addressData);
      
      // Show success message
      Alert.alert('Success', 'Address saved successfully', [
        { text: 'OK', onPress: () => navigation.navigate('Home', {newAddress: savedAddress}) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address. Please try again.');
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render input with validation error
  const renderInput = (
    placeholder,
    field,
    icon,
    keyboardType = 'default',
    maxLength,
    required = false
  ) => (
    <View style={styles.inputWrapper}>
      <SearchInput
        placeholder={required ? `${placeholder} *` : placeholder}
        showIcon={true}
        iconName={icon}
        value={formData[field]}
        onChangeText={text => updateFormField(field, text)}
        inputStyle={styles.input}
        containerStyle={[
          styles.inputContainer,
        ]}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Confirm Location"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isValidLocation ? (
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}>
              <Marker
                coordinate={{ latitude, longitude }}>
                <MaterialIcons
                  name="location-on"
                  size={normalize(36)}
                  color="#EF6C00"
                />
              </Marker>
            </MapView>
          </View>
        ) : (
          <View style={[styles.mapContainer, styles.mapError]}>
            <Text style={styles.errorText}>Unable to load map</Text>
          </View>
        )}

        <View style={styles.locationContainer}>
          <View style={styles.markerContainer}>
            <MaterialIcons
              name="location-on"
              size={normalize(24)}
              color="#EF6C00"
            />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>
              {placeName || 'Selected Location'}
            </Text>
            <Text style={styles.locationAddress} numberOfLines={2}>{address}</Text>
          </View>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </View>

        {errors.location && (
          <Text style={[styles.errorText, styles.generalError]}>{errors.location}</Text>
        )}

        <Text style={styles.sectionTitle}>Enter complete address</Text>

        <View style={styles.inputWrapperContainer}>
          {renderInput('House No./Flat No.', 'houseNo', 'home-outline', 'default', 20, true)}
          {renderInput('Building name', 'buildingName', 'business-outline')}
          {renderInput('Landmark', 'landmark', 'location-outline')}
        </View>

        <Text style={styles.sectionTitle}>Save address as</Text>

        <View style={styles.addressTypeContainer}>
          {['home', 'office', 'others'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.addressTypeButton,
                formData.addressType === type && styles.selectedAddressType,
              ]}
              onPress={() => updateFormField('addressType', type)}>
              <MaterialIcons
                name={
                  type === 'home'
                    ? 'home'
                    : type === 'office'
                    ? 'business'
                    : 'location-on'
                }
                size={normalize(16)}
                color={formData.addressType === type ? '#EF6C00' : '#666'}
              />
              <Text
                style={[
                  styles.addressTypeText,
                  formData.addressType === type &&
                    styles.selectedAddressTypeText,
                ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputWrapperContainer}>
          {renderInput("Receiver's name", 'receiverName', 'person-outline', 'default', 50, true)}
          {renderInput(
            "Receiver's phone number",
            'receiverPhone',
            'call-outline',
            'phone-pad',
            10,
            true
          )}
          {renderInput("Pet's name", 'petName', 'paw-outline')}
        </View>

        <Button
          title={loading ? 'Saving...' : 'Save address'}
          buttonStyle={styles.saveButton}
          textStyle={styles.saveButtonText}
          onPress={handleSaveAddress}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

export default ConfirmLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: normalize(20),
  },
  mapContainer: {
    width: width,
    height: normalize(200),
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    backgroundColor: '#fff',
    marginBottom: normalize(10),
  },
  markerContainer: {
    marginRight: normalize(10),
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    fontSize: normalize(16),
    color: '#000',
    marginBottom: normalize(4),
    fontFamily: 'GothamRoundedMedium',
  },
  locationAddress: {
    fontSize: normalize(12),
    color: '#666',
    lineHeight: normalize(18),
    fontFamily: 'GothamRoundedRegular',
  },
  changeButton: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(20),
    backgroundColor: '#FFEEE6',
    borderRadius: normalize(8),
  },
  changeButtonText: {
    color: '#EF6C00',
    fontSize: normalize(14),
    fontFamily:'GothamRoundedMedium',
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontFamily: 'GothamRoundedMedium',
    marginHorizontal: normalize(16),
    marginVertical: normalize(12),
  },
  inputWrapper: {
    marginBottom: normalize(16),
  },
  input: {
    height: normalize(52),
    borderColor: '#EEEEEE',
    borderRadius: normalize(16),
    paddingLeft: normalize(8),
    flex: 1,
  },
  inputContainer: {
    height: normalize(52),
    paddingHorizontal: normalize(12),
    flex: 1,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: normalize(16),
  },
  addressTypeContainer: {
    flexDirection: 'row',
   // justifyContent: 'space-between',
    marginHorizontal: normalize(16),
    marginBottom: normalize(20),
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(14 ),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
   // flex: 1,
    marginHorizontal: normalize(4),
  },
  selectedAddressType: {
    borderColor: '#EF6C00',
    backgroundColor: '#FFF5EB',
  },
  addressTypeText: {
    fontSize: normalize(14),
    color: '#666',
    marginLeft: normalize(6),
    fontFamily: 'GothamRoundedRegular',
  },
  selectedAddressTypeText: {
    color: '#EF6C00',
    fontFamily: 'GothamRoundedMedium',
  },
  saveButton: {
    width: '90%',
    height: normalize(48),
    alignSelf: 'center',
    marginTop: normalize(16),
    marginBottom: normalize(30),
    backgroundColor: '#EF6C00',
    borderRadius: normalize(10),
  },
  inputWrapperContainer: {
    marginHorizontal: normalize(16),
  },
  errorText: {
    color: '#FF0000',
    fontSize: normalize(12),
    fontFamily: 'GothamRoundedRegular',
    marginTop: normalize(4),
    marginLeft: normalize(4),
  },
  generalError: {
    marginHorizontal: normalize(16),
    marginBottom: normalize(8),
  },
  mapError: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: normalize(18),
    fontFamily: 'GothamRoundedMedium',
  },
});
