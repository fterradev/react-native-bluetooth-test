import React, { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity, View } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Item,
  Input,
  Picker
} from 'native-base';
import BluetoothCP from 'react-native-bluetooth-cross-platform';

export default class App extends Component {
  state = {
    networkKind: 'WIFI-BT'
  };

  componentDidMount() {
    const { networkKind } = this.state;
    BluetoothCP.advertise(networkKind);
    BluetoothCP.browse(networkKind);
    BluetoothCP.addPeerDetectedListener(peer => {
      Alert.alert(
        'Peer Detected',
        `Connect to ${JSON.stringify(peer)}?`,
        [
          { text: 'Cancel', onPress: null, style: 'cancel' },
          { text: 'OK', onPress: () => BluetoothCP.inviteUser(peer.id) }
        ],
        { cancelable: false }
      );
    });
    BluetoothCP.addInviteListener(peer => {
      Alert.alert(
        'Invitation',
        `Accept invitation from ${JSON.stringify(peer)}?`,
        [
          { text: 'Cancel', onPress: null, style: 'cancel' },
          { text: 'OK', onPress: () => BluetoothCP.acceptInvitation(peer.id) }
        ],
        { cancelable: false }
      );
    });
    BluetoothCP.addConnectedListener(peer => {
      alert(`Peer ${JSON.stringify(peer)} has connected.`);
      this.setState({ connected: true });
    });
    BluetoothCP.addPeerLostListener(peer => {
      alert(`Peer ${JSON.stringify(peer)} has disconnected.`);
      this.setState({ connected: false });
    });
    /*
    Alert.alert(
      'Test title',
      `Test!`,
      [
        {text: 'Cancel', onPress: null, style: 'cancel'},
        {text: 'OK', onPress: () => true},
      ],
      { cancelable: false }
    );
    */
  }

  changeNetwork = itemValue => {
    this.setState(
      {
        networkKind: itemValue || null
      },
      () => {
        const { networkKind } = this.state;
        BluetoothCP.stopAdvertising();
        BluetoothCP.stopBrowsing();
        if (networkKind !== null) {
          BluetoothCP.advertise(networkKind);
          BluetoothCP.browse(networkKind);
        }
      }
    );
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>
        <Content style={styles.Content}>
          <Picker
            style={styles.block}
            placeholder="Network"
            mode="dropdown"
            selectedValue={this.state.networkKind}
            onValueChange={this.changeNetwork}
          >
            <Picker.Item label="WIFI-BT" value="WIFI-BT" />
            <Picker.Item label="WIFI" value="WIFI" />
            <Picker.Item label="BT" value="BT" />
            <Picker.Item label="Disabled" value={0} />
          </Picker>
          <View style={{ flex: 1 }}>
            <View style={styles.movesContainer}>
              <TouchableOpacity style={styles.move}>
                <Text>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.move}>
                <Text>2</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  Content: {
    flex: 1,
    padding: '5%'
  },

  Button: {
    alignSelf: 'flex-end'
  },

  block: {
    margin: 10
  },

  movesContainer: {
    flex: 1,
    flexDirection: 'row'
  },

  move: {
    flex: 1,
    backgroundColor: 'lightpink',
    margin: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
