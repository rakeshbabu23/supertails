import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'react-native-elements';

const LocationPermissionModal = ({visible, onClose, onGoToSettings}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <Icon
              name="location-off"
              size={24}
              color="#000"
              style={styles.headerIcon}
            />
            <Text style={styles.headerText}>Enable location permission</Text>
          </View>

          <Text style={styles.descriptionText}>
            Please enable location permissions for a better experience
          </Text>

          <View style={styles.divider} />

          <View style={styles.stepsContainer}>
            {/* Step 1 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <Text style={styles.stepIconText}>📱</Text>
              </View>
              <View style={styles.stepConnector}>
                <View style={styles.connectorLine} />
              </View>
              <Text style={styles.stepText}>Choose "Supertails"</Text>
            </View>

            {/* Step 2 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <Icon name="location-on" size={20} color="#fff" />
              </View>
              <View style={styles.stepConnector}>
                <View style={styles.connectorLine} />
              </View>
              <Text style={styles.stepText}>Go to location</Text>
            </View>

            {/* Step 3 */}
            <View style={styles.stepRow}>
              <View style={styles.stepIconContainer}>
                <Icon name="touch-app" size={20} color="#fff" />
              </View>
              <View style={styles.stepConnector}>
                {/* No connector for last item */}
              </View>
              <Text style={styles.stepText}>Click on "While using app"</Text>
            </View>
          </View>

          <Button
            title="Go to settings"
            buttonStyle={styles.settingsButton}
            titleStyle={styles.settingsButtonText}
            onPress={onGoToSettings}
          />
        </View>
      </View>
    </Modal>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 15,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepIconText: {
    fontSize: 18,
  },
  stepConnector: {
    height: 40,
    width: 20,
    alignItems: 'center',
    marginTop: 30,
    position: 'absolute',
    left: 18,
    top: 0,
    zIndex: 1,
  },
  connectorLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#8BC34A',
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
    paddingTop: 8,
  },
  settingsButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    width: '100%',
    padding: 12,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationPermissionModal;
