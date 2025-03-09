import { StyleSheet, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import React from 'react';
import { normalize } from '../../utils/helper';


const Button = ({
  title = 'Button',
  onPress, 
  buttonStyle,
  textStyle,
  disabled = false,
  size = 'medium',
  fullWidth = false,
}) => {

  
  const textSizeStyles = {
    small: styles.textSmall,
    large: styles.textLarge,
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabledButton,
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.buttonText,
          textSizeStyles[size] || {},
          disabled && styles.disabledText,
          textStyle,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

Dimensions.addEventListener('change', () => {
  const { width } = Dimensions.get('window');
  scale = width / 375;
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EF6c00',
    // paddingVertical: normalize(12),
    // paddingHorizontal: normalize(24),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonSmall: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(6),
  },
  buttonLarge: {
    paddingVertical: normalize(16),
    paddingHorizontal: normalize(32),
    borderRadius: normalize(10),
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: normalize(16),
    fontWeight: '600',
    
  },
  textSmall: {
    fontSize: normalize(14),
  },
  textLarge: {
    fontSize: normalize(18),
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: '#757575',
  },
});