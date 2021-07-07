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
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import RtcEngine, {
  RtcRemoteView,
  VideoRenderMode,
  ChannelProfile,
  DataStreamConfig,
  ClientRole,
} from 'react-native-agora';
import {dimensions, liveStreamingProperties} from '../../constants';

let agoraEngine;
let streamId;
let listChatGlobal = [];
const WatchStreaming = () => {
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textChat, setTextChat] = useState('');
  const [listChat, setListChat] = useState([]);
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
    agoraEngine.addListener(
      'JoinChannelSuccess',
      async (channel, uid, elapsed) => {
        streamId = await agoraEngine.createDataStream(true, true);
        console.log(`Audiance Join channel success ${uid} ${channel}`);
        setJoinSuccess(true);
      },
    );
    //* when local user leave channel
    agoraEngine.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      setJoinSuccess(false);
    });
    agoraEngine.addListener('Error', error => {
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
      1,
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
        <Text>Join Stream</Text>
      </TouchableOpacity>
    );
  };

  const renderLocalView = () => {
    return (
      <RtcRemoteView.SurfaceView
        style={{width: dimensions.width, height: dimensions.height - 100}}
        channelId={liveStreamingProperties.channelName}
        uid={131231}
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
                keyExtractor={(_, index) => index.toString()}
                style={{height: dimensions.height * 0.4}}
                inverted
                contentContainerStyle={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  paddingHorizontal: 10,
                }}
                renderItem={({item}) => (
                  <View style={{flexDirection: 'row', paddingVertical: 5}}>
                    <Text style={{color: 'white', fontSize: 15}}>
                      {item.uid !== 131231 ? 'Toi' : 'MiCheal Pham'}:
                    </Text>
                    <Text style={{color: 'white'}}>{item.text}</Text>
                  </View>
                )}
              />

              <View style={{flexDirection: 'row'}}>
                <TextInput
                  placeholder="Nhap chat"
                  value={textChat}
                  onChangeText={text => setTextChat(text)}
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

export default WatchStreaming;

const styles = StyleSheet.create({});
