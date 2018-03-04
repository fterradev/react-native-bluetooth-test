import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
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
  Input
} from 'native-base';
import BluetoothCP from 'react-native-bluetooth-cross-platform';

export default class App extends Component {
  componentDidMount() {
    BluetoothCP.advertise('WIFI-BT');
    BluetoothCP.browse('WIFI-BT');
    BluetoothCP.addPeerDetectedListener((peer) => {
      Alert.alert(
        'Peer Detected',
        `Connect to ${JSON.stringify(peer)}?`,
        [
          {text: 'Cancel', onPress: null, style: 'cancel'},
          {text: 'OK', onPress: () => BluetoothCP.inviteUser(peer.id)},
        ],
        { cancelable: false }
      );
    });
    BluetoothCP.addInviteListener((peer) => {
      Alert.alert(
        'Invitation',
        `Accept invitation from ${JSON.stringify(peer)}?`,
        [
          {text: 'Cancel', onPress: null, style: 'cancel'},
          {text: 'OK', onPress: () => BluetoothCP.acceptInvitation(peer.id)},
        ],
        { cancelable: false }
      );
    });
    BluetoothCP.addConnectedListener((peer) => {
      alert(`Peer ${JSON.stringify(peer)} has connected.`);
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
          <Text>This is Content Section</Text>
          <Item rounded>
            <Input placeholder="Message" multiline numberOfLines={4} />
          </Item>
          <Button style={styles.Button}>
            <Text>Send</Text>
          </Button>
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
    margin: 10,
    alignSelf: 'flex-end'
  }
});
