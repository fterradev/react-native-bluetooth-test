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
import Outcome from './components/Outcome';
import BluetoothCP from 'react-native-bluetooth-cross-platform';
import PropTypes from 'prop-types';

const Move = ({
  name,
  disabled = false,
  color = 'white',
  buttonStyle = {}
}) => (
  <Button disabled={disabled} style={[styles.move, { ...buttonStyle }]}>
    <FontAwesome name={name} size={30} color={color} />
  </Button>
);

Move.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  buttonStyle: PropTypes.object
};

const OutcomeCount = ({ title, count }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Text style={{ fontSize: 13, color: '#3F51B5' }}>
      {title}: {count}
    </Text>
  </View>
);

OutcomeCount.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};

export default class App extends Component {
  /*
  state = {
    networkKind: 'WIFI-BT',
    connected: false,
    opponent: '',
    outcome: '',
    wins: 0,
    losses: 0,
    draws: 0
  };
  */
  state = {
    networkKind: 'WIFI-BT',
    connected: true,
    opponent: 'Amigão',
    outcome: 'Draw!',
    wins: 1,
    losses: 2,
    draws: 3
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
      this.setState({
        connected: true,
        opponent: peer.displayName
      });
    });
    BluetoothCP.addPeerLostListener(peer => {
      alert(`Peer ${JSON.stringify(peer)} has disconnected.`);
      this.setState({
        connected: false,
        opponent: ''
      });
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
    const {
      connected,
      opponent,
      outcome,
      wins,
      losses,
      draws
    } = this.state;
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
              <Text>Opponent: {opponent}</Text>
            </View>
            <View style={styles.rowContainer}>
              <Move
                name="hand-rock-o"
                disabled
                buttonStyle={{ backgroundColor: 'purple' }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              marginTop: 20,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Outcome outcome={outcome} />
          </View>
          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={styles.rowContainer}>
              <Text>You</Text>
            </View>
            <View style={styles.rowContainer}>
              <Move name="hand-rock-o" />
              <Move name="hand-paper-o" />
              <Move name="hand-scissors-o" />
            </View>
          </View>
        </Content>
        <Footer>
          <FooterTab
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <OutcomeCount title="Wins" count={wins} />
            <OutcomeCount title="Losses" count={losses} />
            <OutcomeCount title="Draws" count={draws} />
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
