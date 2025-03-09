import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

const Header = ({ 
  title = 'Header', 
  onBackPress, 
  rightIcon, 
  onRightPress,
  showBack = true,
  containerStyle 
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            onPress={onBackPress} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IonIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      
      <View >
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity 
            onPress={onRightPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IonIcons name={rightIcon} size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: Platform.OS === 'ios' ? 44 : 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    width: '100%',
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    color: '#000',
    fontFamily:'GothamRoundedMedium',
  },
  backButton: {
    padding: 4,
  }
});