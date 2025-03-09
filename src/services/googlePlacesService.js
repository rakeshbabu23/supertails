
import { GOOGLE_API_KEY } from '@env';

export const getUserLocationFromIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      lat: data.latitude,
      lng: data.longitude,
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return null;
  }
};

export const getPlacePredictions = async (searchText, userLocation = null) => {
  try {
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      searchText,
    )}&key=${GOOGLE_API_KEY}`;

    if (userLocation) {
      url += `&location=${userLocation.lat},${userLocation.lng}&radius=50000`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return [];
  }
};

export const getPlaceDetails = async placeId => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_API_KEY}`,
    );
    const data = await response.json();

    if (data.result) {
      const {geometry, formatted_address} = data.result;
      return {
        latitude: geometry.location.lat,
        longitude: geometry.location.lng,
        address: formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`,
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return {
        formattedAddress: data.results[0].formatted_address,
        addressComponents: data.results[0].address_components,
      };
    }
    return null;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

// locationService.js - Pure function for API call
export const fetchLocationDataByPincode = async (pincode) => {
  if (pincode.length !== 6) return null;

  try {
    // Using Google's Geocoding API to get location data from pincode
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&components=country:IN&key=${GOOGLE_API_KEY}`,
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Extract city and state from results
      let city = '';
      let state = '';

      const addressComponents = data.results[0].address_components;

      for (const component of addressComponents) {
        if (
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_2')
        ) {
          city = component.long_name;
        }

        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
      }

      return { city, state };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
};


