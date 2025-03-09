import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import LocationPermissionBanner from '../components/LocationBanner';
import Header from '../components/ui/Header';
import Container from '../components/ui/Container';
import SearchInput from '../components/ui/Input';
import {useState} from 'react';
import {normalize} from '../utils/helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/ui/Button';
import {useNavigation} from '@react-navigation/native';
import {saveAddress} from '../services/addressService';
import {useLocation} from '../context/LocationContext';
import {GOOGLE_API_KEY} from '@env';
import {fetchLocationDataByPincode} from '../services/googlePlacesService';
const ManualAddress = ({route}) => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    pincode: '',
    city: '',
    state: '',
    houseNo: '',
    buildingNo: '',
    receiverName: '',
    receiverPhone: '',
    petName: '',
    isDefault: false,
  });
  const [defaultAddress, setDefaultAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const {hasLocationPermission} = useLocation();

  const handlePincodeChange = async pincode => {
    if (pincode.length !== 6) return;

    setIsLoadingLocation(true);

    try {
      const locationData = await fetchLocationDataByPincode(pincode);

      if (locationData) {
        const {city, state} = locationData;

        // Update form data with fetched city and state
        if (city || state) {
          setFormData(prevData => ({
            ...prevData,
            city: city || prevData.city,
            state: state || prevData.state,
          }));

          // Clear any errors for these fields
          setErrors(prev => ({
            ...prev,
            city: null,
            state: null,
          }));
        }
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: null}));
    }

    if (field === 'pincode' && value.length === 6) {
      handlePincodeChange(value);
    }
  };

  const toggleDefaultAddress = () => {
    setFormData(prevData => ({
      ...prevData,
      isDefault: !prevData.isDefault,
    }));
    setDefaultAddress(!defaultAddress);
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = 'Enter a valid 6-digit pincode';

    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.houseNo) newErrors.houseNo = 'House/Flat no. is required';
    if (!formData.receiverName) newErrors.receiverName = 'Name is required';

    if (!formData.receiverPhone)
      newErrors.receiverPhone = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.receiverPhone))
      newErrors.receiverPhone = 'Enter a valid 10-digit mobile number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const addressData = {
        ...formData,
        isDefault: defaultAddress,
      };

      await saveAddress(addressData);

      // Navigate to Home screen
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to save address. Please try again.');
      console.error('Save address error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Add address"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {!hasLocationPermission && <LocationPermissionBanner />}

        <Text style={styles.sectionTitle}>Address</Text>

        <Container style={styles.formContainer}>
          <SearchInput
            placeholder="Pincode*"
            showIcon={false}
            value={formData.pincode}
            onChangeText={text => handleChange('pincode', text)}
            inputStyle={styles.input}
            containerStyle={[
              styles.inputContainer,
              errors.pincode && styles.inputError,
            ]}
            keyboardType="numeric"
            maxLength={6}
          />
          {errors.pincode && (
            <Text style={styles.errorText}>{errors.pincode}</Text>
          )}

          <View style={styles.rowContainer}>
            <View style={styles.halfWidth}>
              <SearchInput
                placeholder="City*"
                showIcon={false}
                value={formData.city}
                onChangeText={text => handleChange('city', text)}
                inputStyle={styles.input}
                containerStyle={[
                  styles.halfInputContainer,
                  errors.city && styles.inputError,
                ]}
                editable={!isLoadingLocation}
              />
              {errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}
              {isLoadingLocation && formData.pincode.length === 6 && (
                <Text style={styles.helperText}>Loading city...</Text>
              )}
            </View>

            <View style={styles.halfWidth}>
              <SearchInput
                placeholder="State*"
                showIcon={false}
                value={formData.state}
                onChangeText={text => handleChange('state', text)}
                inputStyle={styles.input}
                containerStyle={[
                  styles.halfInputContainer,
                  errors.state && styles.inputError,
                ]}
                editable={!isLoadingLocation}
              />
              {errors.state && (
                <Text style={styles.errorText}>{errors.state}</Text>
              )}
              {isLoadingLocation && formData.pincode.length === 6 && (
                <Text style={styles.helperText}>Loading state...</Text>
              )}
            </View>
          </View>

          <SearchInput
            placeholder="House/Flat no.*"
            showIcon={false}
            value={formData.houseNo}
            onChangeText={text => handleChange('houseNo', text)}
            inputStyle={styles.input}
            containerStyle={[
              styles.inputContainer,
              errors.houseNo && styles.inputError,
            ]}
          />
          {errors.houseNo && (
            <Text style={styles.errorText}>{errors.houseNo}</Text>
          )}

          <SearchInput
            placeholder="Building no."
            showIcon={false}
            value={formData.buildingNo}
            onChangeText={text => handleChange('buildingNo', text)}
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
          />
        </Container>

        <Text style={styles.sectionTitle}>Receiver's details</Text>

        <Container style={styles.formContainer}>
          <SearchInput
            placeholder="Your name*"
            showIcon={false}
            value={formData.receiverName}
            onChangeText={text => handleChange('receiverName', text)}
            inputStyle={styles.input}
            containerStyle={[
              styles.inputContainer,
              errors.receiverName && styles.inputError,
            ]}
          />
          {errors.receiverName && (
            <Text style={styles.errorText}>{errors.receiverName}</Text>
          )}

          <SearchInput
            placeholder="Your mobile no.*"
            showIcon={false}
            value={formData.receiverPhone}
            onChangeText={text => handleChange('receiverPhone', text)}
            inputStyle={styles.input}
            containerStyle={[
              styles.inputContainer,
              errors.receiverPhone && styles.inputError,
            ]}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {errors.receiverPhone && (
            <Text style={styles.errorText}>{errors.receiverPhone}</Text>
          )}

          <SearchInput
            placeholder="Your pet's name"
            showIcon={false}
            value={formData.petName}
            onChangeText={text => handleChange('petName', text)}
            inputStyle={styles.input}
            containerStyle={styles.inputContainer}
          />
        </Container>

        <Container style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={toggleDefaultAddress}>
            <View
              style={[
                styles.checkbox,
                defaultAddress && styles.checkboxChecked,
              ]}>
              {defaultAddress && (
                <Ionicons name="checkmark" size={normalize(16)} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Set as default address</Text>
          </TouchableOpacity>

          <Button
            title={isSubmitting ? 'Saving...' : 'Confirm location'}
            buttonStyle={{
              width: normalize(343),
              height: normalize(48),
            }}
            textStyle={styles.confirmButtonText}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </Container>
      </ScrollView>
    </View>
  );
};

export default ManualAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  helperText: {
    color: '#666',
    fontSize: normalize(12),
    marginTop: normalize(4),
    fontFamily: 'GothamRoundedMedium',
  },

  formContainer: {
    padding: normalize(10),
    backgroundColor: '#FAFAFA',
    borderRadius: normalize(16),
    marginHorizontal: normalize(10),
    marginBottom: normalize(20),
    elevation: 2,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginHorizontal: normalize(16),
    marginVertical: normalize(12),
    fontFamily: 'GothamRoundedMedium',
  },
  input: {
    height: normalize(52),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(16),
  },
  inputContainer: {
    height: normalize(52),
    marginVertical: normalize(10),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  halfInputContainer: {
    width: '100%',
    marginBottom: normalize(12),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: normalize(16),
    marginVertical: normalize(16),
  },
  checkbox: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(4),
    borderWidth: 1,
    borderColor: '#000',
    // backgroundColor: defaultAddress => defaultAddress ? '#FF7A00' : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(8),
  },
  checkboxLabel: {
    fontSize: normalize(14),
    fontFamily: 'GothamRoundedMedium',
  },
  confirmButton: {
    backgroundColor: '#FF7A00',
    height: normalize(50),
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: normalize(16),
    marginBottom: normalize(20),
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontFamily: 'GothamRoundedBold',
  },
  bottomContiner: {
    width: '100%',
    backgroundColor: '#F5F6FB',
    flex: 1,
    elevation: 2,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: normalize(20),
    // position:'absolute',
    // bottom:0
  },
  // inputError: {
  //   borderColor: 'red',
  //   borderWidth: 1,
  // },
  errorText: {
    color: 'red',
    fontSize: normalize(12),
    marginVertical: normalize(2),
    marginLeft: normalize(8),
    fontFamily: 'GothamRoundedLight',
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  bottomContainer: {
    marginBottom: normalize(20),
  },
});
