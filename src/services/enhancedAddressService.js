import AsyncStorage from '@react-native-async-storage/async-storage';

const ADDRESSES_STORAGE_KEY = '@user_addresses';

export const saveAddress = async addressData => {
  try {
    const existingAddresses = await getAddresses();
    const newAddress = {
      ...addressData,
      id: addressData.id || Date.now().toString(),
      createdAt: addressData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: addressData.isDefault || false,
    };

    let updatedAddresses;
    
    if (addressData.id) {
      updatedAddresses = existingAddresses.map(addr => 
        addr.id === addressData.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [newAddress, ...existingAddresses];
    }

    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id,
      }));
    }

    await AsyncStorage.setItem(
      ADDRESSES_STORAGE_KEY,
      JSON.stringify(updatedAddresses),
    );

    return newAddress;
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};



export const getAddresses = async () => {
  try {
    const addresses = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error('Error getting addresses:', error);
    return [];
  }
};

export const getAddressByType = async (addressType) => {
  try {
    const addresses = await getAddresses();
    return addresses.filter(addr => addr.addressType === addressType);
  } catch (error) {
    console.error('Error getting addresses by type:', error);
    return [];
  }
};


export const setDefaultAddress = async (addressId) => {
  try {
    const addresses = await getAddresses();
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));

    await AsyncStorage.setItem(
      ADDRESSES_STORAGE_KEY,
      JSON.stringify(updatedAddresses),
    );

    return updatedAddresses.find(addr => addr.id === addressId);
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};

export const deleteAddress = async addressId => {
  try {
    const addresses = await getAddresses();
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    await AsyncStorage.setItem(
      ADDRESSES_STORAGE_KEY,
      JSON.stringify(updatedAddresses),
    );
    return updatedAddresses;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

