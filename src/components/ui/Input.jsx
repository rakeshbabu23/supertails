import { StyleSheet, View, TextInput, Dimensions, Platform } from 'react-native';
import React from 'react';
import  Ionicons  from 'react-native-vector-icons/Ionicons'; 
import { normalize } from '../../utils/helper';

const SearchInput = ({
    iconName='search',
    showIcon=true,
  placeholder = 'Search area, street, name...',
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  onBlur,
  containerStyle,
  inputStyle,
  canEdit=true
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
        {showIcon&&
      <View style={styles.searchIconContainer}>
        <Ionicons name={iconName} size={normalize(20)} color="#9E9E9E" />
      </View>
}
      
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"  
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        editable={canEdit}
      />
    </View>
  );
};

export default SearchInput;


const styles = StyleSheet.create({
  container: {
    width:  normalize(343), 
    height:normalize(48),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16), 
    borderWidth: 1,
    borderColor: '#EEEEEE',
    paddingVertical: normalize(Platform.OS === 'ios' ? 12 : 8),
    //paddingHorizontal: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.05,
    shadowRadius: normalize(3),
    elevation: normalize(2),
    //marginVertical: normalize(8),
  },
  searchIconContainer: {
    marginRight: normalize(4),
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
    color: '#212121',
    padding: 0, 
    fontFamily: 'GothamRoundedRegular',
  }
});