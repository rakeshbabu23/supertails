import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {normalize} from '../utils/helper';
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from '../services/enhancedAddressService';
import {useLocation} from '../context/LocationContext';
import Header from '../components/ui/Header';

const {width} = Dimensions.get('window');

const ADDRESS_TYPES = {
  Home: 'home',
  Office: 'office',
  Other: 'other',
};


const AddressCard = ({address, onEdit, onDelete, onSetDefault}) => {
  const {
    id,
    receiverName,
    houseNo,
    buildingName,
    locality,
    city,
    state,
    pincode,
    addressType,
    isDefault,
  } = address;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Text style={styles.addressType}>{addressType}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => onEdit(address)}
            style={styles.editButton}>
            <Ionicons name="create-outline" size={normalize(20)} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(id)}
            style={styles.deleteButton}>
            <Ionicons
              name="trash-outline"
              size={normalize(20)}
              color="#FF3B30"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.receiverName}>{receiverName}</Text>

{houseNo || buildingName ? (
  <Text style={styles.addressText}>
    {houseNo}
    {buildingName ? `, ${buildingName}` : ''}
  </Text>
) : null}

{locality || city ? (
  <Text style={styles.addressText}>
    {locality ? `${locality}, ` : ''}{city}
  </Text>
) : null}

{state || pincode ? (
  <Text style={styles.addressText}>
    {state}{pincode ? ` - ${pincode}` : ''}
  </Text>
) : null}


      {!isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => onSetDefault(id)}>
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const AddressManagement = ({navigation}) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const {hasLocationPermission} = useLocation();
  useEffect(() => {
    loadAddresses();

    const unsubscribe = navigation.addListener('focus', () => {
      loadAddresses();
    });

    return unsubscribe;
  }, [navigation]);

  const loadAddresses = async () => {
    try {
      const loadedAddresses = await getAddresses();
      setAddresses(loadedAddresses);
    } catch (error) {
      Alert.alert('Error', 'Failed to load addresses');
    }
  };

  const handleAddNew = () => {
    if (hasLocationPermission) {
      navigation.navigate('MapScreen');
    } else {
      navigation.navigate('Address');
    }
  };

  const handleEdit = address => {
    navigation.navigate('AddNewAddress', {address});
  };

  const handleDelete = async addressId => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(addressId);
              await loadAddresses();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ],
    );
  };

  const handleSetDefault = async addressId => {
    try {
      await setDefaultAddress(addressId);
      await loadAddresses();
    } catch (error) {
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const filteredAddresses = selectedType
    ? addresses.filter(addr => addr.addressType === selectedType)
    : addresses;

  const renderTypeFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          !selectedType && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedType(null)}>
        <Text
          style={[styles.filterText, !selectedType && styles.filterTextActive]}>
          All
        </Text>
      </TouchableOpacity>
      {Object.values(ADDRESS_TYPES).map(type => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterButton,
            selectedType === type && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedType(type)}>
          <Text
            style={[
              styles.filterText,
              selectedType === type && styles.filterTextActive,
            ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F5F6FB" barStyle="dark-content" />

      {/* Header */}
      <Header
        title="Add address"
        onBackPress={() => navigation.goBack()}
        showBack={true}
      />

      <View style={styles.contentContainer}>
        {renderTypeFilter()}

        <FlatList
          data={filteredAddresses}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <AddressCard
              address={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="location-outline"
                size={normalize(50)}
                color="#ccc"
              />
              <Text style={styles.emptyText}>No addresses found</Text>
              <Text style={styles.emptySubText}>
                Add a new address to make checkout faster
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <Container style={styles.buttonContainer}>
        <Button
          title="Add New Address"
          onPress={handleAddNew}
          buttonStyle={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </Container>
    </SafeAreaView>
  );
};

export default AddressManagement;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    backgroundColor: '#F5F6FB',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    
  },
  backButton: {
    padding: normalize(8),
  },
  title: {
    fontSize: normalize(18),
    fontFamily:'GothamRoundedMedium',
    color: '#000',
  },
  emptyView: {
    width: normalize(40),
  },
  contentContainer: {
    flex: 1,
    padding: normalize(16),
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: normalize(15),
  },
  filterButton: {
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(8),
    marginRight: normalize(10),
    borderRadius: normalize(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: '#Ef6c00',
    borderColor: '#Ef6c00',
  },
  filterText: {
    color: '#666',
    fontFamily:'GothamRoundedMedium',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily:'GothamRoundedBold',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: normalize(80),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(15),
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: normalize(18),
    marginRight: normalize(5),
  },
  addressType: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginRight: normalize(8),
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    borderRadius: normalize(12),
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontFamily:'GothamRoundedMedium',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: normalize(15),
    padding: normalize(5),
  },
  deleteButton: {
    padding: normalize(5),
  },
  receiverName: {
    fontSize: normalize(16),
    fontWeight: '500',
    marginBottom: normalize(5),
    color: '#333',
    fontFamily:'GothamRoundedMedium',
  },
  addressText: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: normalize(2),
    fontFamily:'GothamRoundedRegular',
  },
  setDefaultButton: {
    marginTop: normalize(10),
    padding: normalize(8),
    borderRadius: normalize(6),
    backgroundColor: '#F5F6FB',
    alignItems: 'center',
  },
  setDefaultText: {
    color: '#Ef6c00',
    fontSize: normalize(14),
    fontFamily:'GothamRoundedMedium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(50),
  },
  emptyText: {
    fontSize: normalize(18),
    fontWeight: '500',
    color: '#333',
    marginTop: normalize(12),
    marginBottom: normalize(8),
    fontFamily:'GothamRoundedMedium',
  },
  emptySubText: {
    fontSize: normalize(14),
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: normalize(30),
    fontFamily:'GothamRoundedMedium',
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
  addButton: {
    width: width - normalize(32),
    height: normalize(48),
    backgroundColor: '#Ef6c00',
  },
  addButtonText:{
    color:'#fff',
    fontFamily:'GothamRoundedMedium',
  }
});


