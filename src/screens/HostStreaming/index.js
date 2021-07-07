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
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  FlatList,
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
let streamId;
let listChatGlobal = [];
const HostStreaming = () => {
  const [peerIds, setPeerIds] = useState([]);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [listChat, setListChat] = useState([]);
  const [textChat, setTextChat] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    listChatGlobal = [];
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
    agoraEngine.addListener(
      'JoinChannelSuccess',
      async (channel, uid, elapsed) => {
        console.log(`Join channel success ${uid} ${channel}`);
        streamId = await agoraEngine.createDataStream(true, true);
        setJoinSuccess(true);
      },
    );
    //* when local user leave channel
    agoraEngine.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      setJoinSuccess(false);
      setPeerIds([]);
    });
    agoraEngine.addListener('Error', error => {
      console.log('error', error);
    });
    agoraEngine.addListener('StreamMessageError', error => {
      console.log('error', error);
    });
    agoraEngine.addListener('StreamMessage', (uid, streamId, data) => {
      changeDataListChat(uid, data);
      console.log(`co tin nhan moi tu ${uid}, ${streamId}, ${data}`);
    });
  };
  const changeDataListChat = (uid, text) => {
    listChatGlobal.unshift({uid, text});
    setListChat([...listChatGlobal]);
  };
  const onStartStreamPressed = async () => {
    // setLoading(true);

    await agoraEngine.joinChannel(
      liveStreamingProperties.token,
      liveStreamingProperties.channelName,
      null,
      131231,
    );
    console.log('engina started');

    // setLoading(false);
  };

  const onSendMessagePressed = async () => {
    await agoraEngine.sendStreamMessage(streamId, textChat);
    changeDataListChat(2, textChat);
    setTextChat('');
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
          marginBottom: 20,
        }}>
        <Text>Start Stream</Text>
      </TouchableOpacity>
    );
  };

  const renderLocalView = () => {
    return (
      <RtcLocalView.SurfaceView
        style={{width: dimensions.width, height: dimensions.height - 100}}
        channelId={liveStreamingProperties.channelName}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
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
      {joinSuccess ? (
        <View style={{flex: 1, position: 'relative'}}>
          {renderLocalView()}
          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
            }}>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                flexDirection: 'column',
                width: '100%',
              }}>
              <FlatList
                data={listChat}
                inverted
                keyExtractor={(_, index) => index.toString()}
                style={{height: dimensions.height * 0.4}}
                contentContainerStyle={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  paddingHorizontal: 10,
                }}
                renderItem={({item}) => (
                  <View style={{flexDirection: 'row', paddingVertical: 5}}>
                    <Text style={{color: 'white', fontSize: 15}}>
                      {item.uid === 1 ? 'Dung Pham' : 'Toi'}:
                    </Text>
                    <Text style={{color: 'white'}}>{item.text}</Text>
                  </View>
                )}
              />

              <View style={{flexDirection: 'row'}}>
                <TextInput
                  value={textChat}
                  onChangeText={text => setTextChat(text)}
                  placeholder="Nhap chat"
                  style={{
                    backgroundColor: 'white',
                    width: '90%',
                    paddingHorizontal: 10,
                  }}
                />
                <TouchableOpacity
                  onPress={onSendMessagePressed}
                  style={{
                    backgroundColor: 'blue',
                    width: '10%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white'}}>Send</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      ) : (
        renderButtonStartStream()
      )}
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
