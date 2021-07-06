/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const Home = () => {
  const navigation = useNavigation();
  const onHostStreamingPressed = () => {
    navigation.navigate('HostStreaming');
  };
  const onJoinStreamingPressed = () => {
    navigation.navigate('WatchStreaming');
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Test LiveStreaming</Text>
      <TouchableOpacity
        onPress={onHostStreamingPressed}
        style={{
          padding: 5,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text>Host Streaming</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onJoinStreamingPressed}
        style={{
          padding: 5,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text>Join Streaming</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
