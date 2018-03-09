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
  style = {},
  onPress = undefined,
  ...props
}) => (
  <Button
    disabled={disabled}
    style={
      Array.isArray(style)
        ? [styles.move, ...style]
        : [styles.move, { ...style }]
    }
    onPress={onPress}
    {...props}
  >
    <FontAwesome name={name} size={30} color={color} />
  </Button>
);

Move.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  onPress: PropTypes.func
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
    draws: 3,
    userMove: null,
    opponentMove: null,
    peerId: null
  };

  componentDidMount() {
    console.log(this.appMove.style);
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
        peerId: peer.id,
        opponent: peer.displayName
      });
    });
    BluetoothCP.addPeerLostListener(peer => {
      alert(`Peer ${JSON.stringify(peer)} has disconnected.`);
      this.setState({
        connected: false,
        peerId: null,
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

  AppMove = props => (
    <Move
      {...props}
      onPress={() =>
        this.setState({
          userMove: props.name
        })
      }
    />
  );

  render() {
    const { connected, opponent, outcome, wins, losses, draws } = this.state;
    const AppMove = this.AppMove;
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
        <Content style={styles.Content} contentContainerStyle={{ flex: 1 }}>
          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'skyblue'
            }}
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
          <View style={{ flex: 5, backgroundColor: 'powderblue', padding: 10 }}>
            <View style={styles.rowContainer}>
              <Text>Opponent: {opponent}</Text>
            </View>
            <View style={[styles.rowContainer, { flex: 2 }]}>
              <Move
                name="hand-rock-o"
                disabled
                style={{ backgroundColor: 'purple' }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 4,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'skyblue'
            }}
          >
            <Outcome outcome={outcome} />
          </View>
          <View style={{ flex: 5, padding: 10, backgroundColor: 'powderblue' }}>
            <View style={styles.rowContainer}>
              <Text>You</Text>
            </View>
            <View
              style={[styles.rowContainer, { flex: 2, alignItems: 'stretch' }]}
            >
              <View
                style={[
                  styles.test,
                  { flex: 1, backgroundColor: 'red', height: undefined, alignSelf: 'stretch' }
                ]}
              >
                <Text>rrr</Text>
              </View>
              <AppMove
                name="hand-rock-o"
                style={[{ flex: 1, height: undefined }]}
                contentContainerStyle={[{ flex: 1, height: null }]}
              />
              <AppMove name="hand-paper-o" />
              <AppMove name="hand-scissors-o" />
              <Button
                ref={element => {
                  this.appMove = element;
                }}
                style={{ flex: 1, backgroundColor: 'red', height: undefined, alignSelf: 'stretch' }}
                contentContainerStyle={{ flex: 1, backgroundColor: 'red', height: undefined, alignSelf: 'stretch' }}
              >
                <Text>wwww</Text>
              </Button>
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
    padding: '5%',
    backgroundColor: '#bbb'
  },

  test: {
    height: 20,
    alignSelf: 'flex-start'
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
    justifyContent: 'center'
  }
});
