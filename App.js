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

const MOVE_ROCK = 'rock';
const MOVE_PAPER = 'paper';
const MOVE_SCISSORS = 'scissors';

const possibleMoves = [MOVE_ROCK, MOVE_PAPER, MOVE_SCISSORS];

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
  state = {
    networkKind: 0,
    netUnderMaintenance: false,
    netListenersStarted: false,
    connected: false,
    opponent: null,
    outcome: null,
    wins: 0,
    losses: 0,
    draws: 0,
    userMove: null,
    opponentMove: null,
    peerId: null
  };
  /*
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
  */

  componentDidMount() {
    //console.log('styles.selectedMove: ', styles.selectedMove.constructor.name);
    const { networkKind } = this.state;
    if (networkKind !== 0) {
      this.changeNetwork(networkKind);
    }
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

  determineOutcome = () => {
    const { userMove, opponentMove } = this.state;
    let outcome = OUTCOME_DRAW;
    if (userMove && opponentMove) {
      switch (userMove) {
        case MOVE_ROCK:
          switch (opponentMove) {
            case MOVE_PAPER:
              outcome = OUTCOME_LOSE;
              break;
            case MOVE_SCISSORS:
              outcome = OUTCOME_WIN;
              break;
          }
          break;
        case MOVE_PAPER:
          switch (opponentMove) {
            case MOVE_ROCK:
              outcome = OUTCOME_WIN;
              break;
            case MOVE_SCISSORS:
              outcome = OUTCOME_LOSE;
              break;
          }
          break;
        case MOVE_SCISSORS:
          switch (opponentMove) {
            case MOVE_ROCK:
              outcome = OUTCOME_LOSE;
              break;
            case MOVE_PAPER:
              outcome = OUTCOME_WIN;
              break;
          }
      }
      let outcomeCount = {};
      if (outcome === OUTCOME_WIN) {
        outcomeCount = {
          wins: this.state.wins + 1
        };
      }
      if (outcome === OUTCOME_LOSE) {
        outcomeCount = {
          losses: this.state.losses + 1
        };
      }
      if (outcome === OUTCOME_DRAW) {
        outcomeCount = {
          draws: this.state.draws + 1
        };
      }
      this.setState({
        outcome,
        ...outcomeCount
      });
    }
  };

  startNewRound = () => {
    this.setState({
      outcome: null,
      userMove: null,
      opponentMove: null
    });
  };

  netMaintenanceDelay = 1500; // milliseconds

  changeNetwork = newNetworkKind => {
    const { networkKind: curNetworkKind, netListenersStarted } = this.state;
    let delay = 0;
    if (curNetworkKind !== 0 && newNetworkKind === 0) {
      BluetoothCP.stopAdvertising();
      BluetoothCP.stopBrowsing();
      delay = netMaintenanceDelay;
      this.setState({
        netUnderMaintenance: true
      });
    }
    if (newNetworkKind !== 0) {
      BluetoothCP.advertise(newNetworkKind);
      BluetoothCP.browse(newNetworkKind);
      if (!netListenersStarted) {
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
              {
                text: 'OK',
                onPress: () => BluetoothCP.acceptInvitation(peer.id)
              }
            ],
            { cancelable: false }
          );
        });
        BluetoothCP.addConnectedListener(peer => {
          alert(`Peer ${JSON.stringify(peer)} has connected.`);
          this.setState({
            connected: true,
            peerId: peer.id,
            opponent: peer.name
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
          this.setState(
            {
              opponentMove: message
            },
            () => {
              if (this.state.userMove && this.state.opponentMove) {
                this.determineOutcome();
              }
            }
          );
        });
        this.setState({
          netListenersStarted: true
        });
      }
    }
    setTimeout(() => {
      this.setState({
        networkKind: newNetworkKind,
        netUnderMaintenance: false
      });
    }, delay);
  };

  render() {
    const {
      netUnderMaintenance,
      connected,
      opponent,
      peerId,
      userMove,
      opponentMove,
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
              enabled={!netUnderMaintenance}
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
                    {userMove &&
                      opponentMove && (
                        <Move
                          name={`hand-${opponentMove}-o`}
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
                  {outcome && (
                    <Outcome outcome={outcome} callback={this.startNewRound} />
                  )}
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
                    {possibleMoves.map(move => (
                      <Move
                        key={move}
                        name={`hand-${move}-o`}
                        onPress={() =>
                          this.setState(
                            {
                              userMove: move
                            },
                            () => {
                              BluetoothCP.sendMessage(move, peerId);
                              if (
                                this.state.userMove &&
                                this.state.opponentMove
                              ) {
                                this.determineOutcome();
                              }
                            }
                          )
                        }
                        disabled={moveDisabled}
                        style={move === userMove ? styles.selectedMove : {}}
                      />
                    ))}
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
