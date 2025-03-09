import {Dimensions,Platform} from 'react-native';
export const normalize = size => {
  const {width, height} = Dimensions.get('window');

  const scale = width / 375;
  const newSize = size * scale;
  return Math.round(Platform.OS === 'ios' ? newSize : newSize - 2);
};
