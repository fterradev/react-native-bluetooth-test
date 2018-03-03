import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
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
    BluetoothCP.advertise('BT');
    BluetoothCP.browse('BT');
    BluetoothCP.addPeerDetectedListener((peer) => {
      confirm(`Connect to ${JSON.stringify(peer)}?`) &&
      BluetoothCP.inviteUser(peer.id);
    });
    BluetoothCP.addInviteListener((peer) => {
      confirm(`Accept invitation from ${JSON.stringify(peer)}?`) &&
      BluetoothCP.acceptInvitation(peer.id);
    });
    BluetoothCP.addConnectedListener((peer) => {
      alert(`Peer ${JSON.stringify(peer)} has connected.`);
    });
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
