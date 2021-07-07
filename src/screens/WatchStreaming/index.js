/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RtcEngine, {
  RtcRemoteView,
  VideoRenderMode,
  ChannelProfile,
  ClientRole,
} from 'react-native-agora';
import {dimensions, liveStreamingProperties} from '../../constants';

let agoraEngine;
const WatchStreaming = () => {
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    initStreaming();
  }, []);

  //! init streaming
  const initStreaming = async () => {
    agoraEngine = await RtcEngine.create(liveStreamingProperties.appId);
    // agoraEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await agoraEngine.setClientRole(ClientRole.Audience);
    await agoraEngine.enableVideo();

    console.log('init thanh cong', agoraEngine);
    //? listening events
    agoraEngine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid);
    });

    //* when local user join channel success
    agoraEngine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log(`Audiance Join channel success ${uid} ${channel}`);
      setJoinSuccess(true);
    });
    //* when local user leave channel
    agoraEngine.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      setJoinSuccess(false);
    });
    agoraEngine.addListener('Error', error => {
      console.log('error', error);
    });
  };

  const onStartStreamPressed = async () => {
    // setLoading(true);

    await agoraEngine.joinChannel(
      liveStreamingProperties.token,
      liveStreamingProperties.channelName,
      null,
      1,
    );
    console.log('engina started');

    // setLoading(false);
  };

  const onLeaveChannel = () => {
    agoraEngine.leaveChannel();
  };
  const renderButtonStartStream = () => {
    return loading ? (
      <ActivityIndicator size="small" color="black" />
    ) : (
      <TouchableOpacity
        onPress={onStartStreamPressed}
        style={{
          padding: 5,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text>Join Stream</Text>
      </TouchableOpacity>
    );
  };

  const renderLocalView = () => {
    return (
      <RtcRemoteView.SurfaceView
        style={{width: dimensions.width, height: dimensions.height - 200}}
        channelId={liveStreamingProperties.channelName}
        uid={131231}
      />
    );
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {joinSuccess ? renderLocalView() : renderButtonStartStream()}
      <TouchableOpacity
        onPress={onLeaveChannel}
        style={{
          padding: 5,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          marginTop: 20,
        }}>
        <Text>Leave Channel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WatchStreaming;

const styles = StyleSheet.create({});
