import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Container = ({children,style}) => {
  return (
    <View  style={[styles.container,style]}>
      {children}
    </View>
  )


}

export default Container

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#F5F6FB',
        flexDirection:'column',
        justifyContent:'center',
       // alignItems:'center'
    }
})