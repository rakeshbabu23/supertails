import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './ui/Button';
import {normalize} from '../utils/helper';
import {checkLocationPermission} from '../services/locationService';

const {width} = Dimensions.get('window');

const LocationPermissionBanner = ({
  onEnablePress,
  bannerContainerStyles,
  onLocationReceived,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleEnablePress = async () => {
    try {
      const granted = await checkLocationPermission();
      if (granted) {
        onEnablePress && onEnablePress();
      } else {
        // If permission is denied, show the settings modal
        setShowSettingsModal(true);
      }
    } catch (error) {
      // If there's an error or permission was previously denied, show settings modal
      setShowSettingsModal(true);
    }
  };

  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openSettings();
    } else {
      Linking.openSettings();
    }
    setShowSettingsModal(false);
  };

  return (
    <>
      <View style={[styles.container, bannerContainerStyles]}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={24} color="#000" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Enable location permission</Text>
          <Text style={styles.subtitle}>
            Your precise location helps us deliver on time
          </Text>
        </View>
        <Button
          title="Enable"
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
          onPress={handleEnablePress}
        />
      </View>

      <Modal
        visible={showSettingsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettingsModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Ionicons
                name="location-outline"
                size={normalize(24)}
                color="#000"
              />
              <Text style={styles.modalTitle}>Enable location permission</Text>
            </View>

            {/* Modal Description */}
            <Text style={styles.modalSubtitle}>
              Please enable location permissions for a better experience
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Steps with Progress Indicators and Tracking Bars */}
            <View style={styles.stepsContainer}>
              {/* Progress Track (adds a background track for the entire progress) */}
              <View style={styles.progressTrackContainer}>
                <View style={styles.progressTrack} />
              </View>

              {/* Step 1 */}
              <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                  <Ionicons name="phone-portrait-outline" size={normalize(20)} color="#FFF" />
                </View>
                <Text style={styles.stepText}>Choose "Supertails"</Text>
              </View>

              {/* Step 2 */}
              <View style={styles.stepRow}>
                <View style={styles.stepIconContainer}>
                  <Ionicons name="location" size={normalize(20)} color="#FFF" />
                </View>
                <Text style={styles.stepText}>Go to location</Text>
              </View>

              {/* Step 3 */}
              <View style={styles.stepRow}>
                <View style={styles.stepIconContainer}>
                  <Ionicons
                    name="finger-print"
                    size={normalize(20)}
                    color="#FFF"
                  />
                </View>
                <Text style={styles.stepText}>Click on "While using app"</Text>
              </View>
            </View>

            {/* Go to Settings Button */}
            <Button
              title="Go to settings"
              buttonStyle={styles.settingsButton}
              textStyle={styles.settingsButtonText}
              onPress={handleOpenSettings}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LocationPermissionBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF6F7',
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(14),
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginRight: normalize(5),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: normalize(16),
    color: '#000',
    marginBottom: 4,
    fontFamily:'GothamRoundedMedium',
  },
  subtitle: {
    fontSize: normalize(12),
    color: '#666',
    fontFamily:'GothamRoundedRegular',
  },
  button: {
    backgroundColor: '#EF6C00',
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: normalize(16),
    fontFamily:'GothamRoundedMedium',
  },

  // New Modal styles matching the screenshot
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFF',
    borderRadius: normalize(16),
    padding: normalize(20),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  modalTitle: {
    fontSize: normalize(18),
    fontFamily:'GothamRoundedMedium',
    color: '#333',
    marginLeft: normalize(8),
  },
  modalSubtitle: {
    fontSize: normalize(14),
    color: '#666',
    marginBottom: normalize(5),
    fontFamily:'GothamRoundedRegular',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: normalize(15),
  },
  stepsContainer: {
    width: '100%',
    marginBottom: normalize(20),
    paddingLeft: normalize(10),
    position: 'relative',
  },
  // Tracking bar container that runs behind the steps
  progressTrackContainer: {
    position: 'absolute',
    left: normalize(28),
    top: normalize(18),
    bottom: normalize(18),
    width: normalize(2),
    zIndex: 1,
  },
  progressTrack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8BC34A',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(25),
    position: 'relative',
    zIndex: 2,
  },
  stepIconContainer: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
    zIndex: 3,
  },
  stepIconText: {
    fontSize: normalize(18),
    fontFamily:'GothamRoundedMedium',
  },
  stepText: {
    fontSize: normalize(16),
    color: '#000',
    flex: 1,
    fontFamily:'GothamRoundedRegular',
  },
  settingsButton: {
    backgroundColor: '#EF6c00',
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
    width: '100%',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontFamily:'GothamRoundedMedium',
  },
});
