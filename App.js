import React, { Component } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
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
  Text,
  Picker,
  Icon
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BluetoothCP from 'react-native-bluetooth-cross-platform';

const Move = ({ name, disabled, color='white', buttonStyle={} }) => (
  <Button disabled={disabled} style={[styles.move, {...buttonStyle}]}>
    <FontAwesome name={name} size={30} color={color} />
  </Button>
);

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
            <Title>Rock-Paper-Scissors</Title>
          </Body>
          <Right />
        </Header>
        <Content style={styles.Content}>
          <View
            fixedLabel
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={[styles.label]}>Network: </Text>
            <Picker
              style={styles.block}
              mode="dropdown"
              selectedValue={this.state.networkKind}
              onValueChange={this.changeNetwork}
            >
              <Picker.Item label="WIFI-BT" value="WIFI-BT" />
              <Picker.Item label="WIFI" value="WIFI" />
              <Picker.Item label="BT" value="BT" />
              <Picker.Item label="Disabled" value={0} />
            </Picker>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.rowContainer}>
              <Text style={[styles.label]}>Opponent: </Text>
              <Text style={[styles.textValue]}>Hello</Text>
            </View>
            <View style={styles.rowContainer}>
              <Move
                name="hand-rock-o"
                disabled
                buttonStyle={{backgroundColor: 'purple'}}
              />
            </View>
          </View>
          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.rowContainer}>
              <Text style={{textAlign: 'center'}}>You</Text>
            </View>
            <View style={styles.rowContainer}>
              <Move name="hand-rock-o" />
              <Move name="hand-paper-o" />
              <Move name="hand-scissors-o" />
            </View>
          </View>
        </Content>
        <Footer>
          <FooterTab style={{flex: 1, flexDirection: 'row'}}>
            <Button full>
              <Text style={[styles.label]}>Wins: </Text>
              <Text style={[styles.textValue]}>Hello</Text>
            </Button>
            <Button full>
            <Text style={[styles.label]}>Losses: </Text>
              <Text style={[styles.textValue]}>Hello</Text>
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

  label: {
    flex: 1,
    textAlign: 'right',
    margin: 10
  },

  textValue: {
    flex: 1,
    margin: 10
  },

  Button: {
    alignSelf: 'flex-end'
  },

  block: {
    flex: 1,
    margin: 10
  },

  rowContainer: {
    flex: 1,
    flexDirection: 'row'
  },

  move: {
    flex: 1,
    margin: 10,
    height: 80,
    justifyContent: 'center'
  }
});
