/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  //   RtcRemoteView,
  VideoRenderMode,
  ChannelProfile,
  ClientRole,
} from 'react-native-agora';
import {dimensions, liveStreamingProperties} from '../../constants';

let agoraEngine;
const HostStreaming = () => {
  const [peerIds, setPeerIds] = useState([]);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(() => {
        console.log('-- Init Agora');
        initStreaming();
      });
    } else {
      initStreaming();
    }
  }, []);

  //! init streaming
  const initStreaming = async () => {
    agoraEngine = await RtcEngine.create(liveStreamingProperties.appId);
    agoraEngine.enableVideo();
    agoraEngine.startPreview();

    agoraEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    agoraEngine.setClientRole(ClientRole.Broadcaster);

    console.log('init thanh cong', agoraEngine);
    //? listening events
    //* when have remote user joined channel
    agoraEngine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid);
      if (peerIds.indexOf(uid)) {
        setPeerIds([...peerIds, uid]);
      }
    });

    //* when remote user leave channel
    agoraEngine.addListener('UserOffline', (uid, reason) => {
      setPeerIds(peerIds.filter(id => id !== uid));
    });

    //* when local user join channel success
    agoraEngine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log(`Join channel success ${uid} ${channel}`);
      setJoinSuccess(true);
    });
    //* when local user leave channel
    agoraEngine.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      setJoinSuccess(false);
      setPeerIds([]);
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
      1615027627,
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
        <Text>Start Stream</Text>
      </TouchableOpacity>
    );
  };

  const renderLocalView = () => {
    return (
      <RtcLocalView.SurfaceView
        style={{width: dimensions.width, height: dimensions.height - 200}}
        channelId={liveStreamingProperties.channelName}
        renderMode={VideoRenderMode.Hidden}
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

const requestCameraAndAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
export default HostStreaming;

const styles = StyleSheet.create({});
