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

const OUTCOME_WIN = 'You Win!';
const OUTCOME_LOSE = 'You Lose!';
const OUTCOME_DRAW = 'Draw!';

const Move = ({
  name,
  disabled = false,
  color = 'white',
  style = {},
  onPress = undefined,
  ...props
}) => {
  return (
    <Button
      disabled={disabled}
      style={
        Array.isArray(style)
          ? [styles.move, ...style]
          : [styles.move, typeof style === 'object' ? { ...style } : style]
      }
      onPress={onPress}
      {...props}
    >
      <FontAwesome name={name} size={30} color={color} />
    </Button>
  );
};

Move.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  style: PropTypes.any,
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
    opponent: 'Friend',
    outcome: 'Draw!',
    wins: 1,
    losses: 2,
    draws: 3,
    userMove: null,
    opponentMove: null,
    peerId: null
  };

  componentDidMount() {
    //console.log('styles.selectedMove: ', styles.selectedMove.constructor.name);
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
    BluetoothCP.addReceivedMessageListener(({ message }) => {
      this.setState({
        opponentMove: message
      });
      this.endTurn();
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

  tryEndTurn = () => {
    const { userMove, opponentMove } = this.state;
    let outcome = OUTCOME_DRAW;
    if (userMove && opponentMove) {
      switch (userMove) {
        case 'hand-rock-o':
          switch (opponentMove) {
            case 'hand-paper-o':
              outcome = OUTCOME_LOSE;
              break;
            case 'hand-scissors-o':
              outcome = OUTCOME_WIN;
              break;
          }
          break;
        case 'hand-paper-o':
          switch (opponentMove) {
            case 'hand-rock-o':
              outcome = OUTCOME_WIN;
              break;
            case 'hand-scissors-o':
              outcome = OUTCOME_LOSE;
              break;
          }
          break;
        case 'hand-scissors-o':
          switch (opponentMove) {
            case 'hand-rock-o':
              outcome = OUTCOME_LOSE;
              break;
            case 'hand-paper-o':
              outcome = OUTCOME_WIN;
              break;
          }
      }
    }
  };

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

  componentWillUpdate() {}

  render() {
    const {
      connected,
      opponent,
      peerId,
      userMove,
      outcome,
      wins,
      losses,
      draws
    } = this.state;
    const moveDisabled = userMove !== null;
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
          <View style={{ flex: 14 }}>
            {connected && (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 5,
                    backgroundColor: 'powderblue',
                    padding: 10
                  }}
                >
                  <View style={styles.rowContainer}>
                    <Text>Opponent: {opponent}</Text>
                  </View>
                  <View style={[styles.rowContainer, { flex: 2 }]}>
                    {userMove && (
                      <Move
                        name="hand-rock-o"
                        isOpponents
                        disabled
                        style={{ backgroundColor: 'purple' }}
                      />
                    )}
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
                  {outcome && <Outcome outcome={outcome} />}
                </View>
                <View
                  style={{
                    flex: 5,
                    backgroundColor: 'powderblue',
                    padding: 10
                  }}
                >
                  <View style={styles.rowContainer}>
                    <Text>You</Text>
                  </View>
                  <View
                    style={[
                      styles.rowContainer,
                      { flex: 2, alignItems: 'stretch' }
                    ]}
                  >
                    {['hand-rock-o', 'hand-paper-o', 'hand-scissors-o'].map(
                      move => (
                        <Move
                          key={move}
                          name={move}
                          onPress={() =>
                            this.setState(
                              {
                                userMove: move
                              },
                              () => {
                                //BluetoothCP.sendMessage(move, peerId);
                              }
                            )
                          }
                          disabled={moveDisabled}
                          style={move === userMove ? styles.selectedMove : {}}
                        />
                      )
                    )}
                  </View>
                </View>
              </View>
            )}
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
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: 'auto'
  },

  selectedMove: {
    backgroundColor: 'green'
  },

  nonSelectedMove: {
    backgroundColor: 'gray'
  }
});
