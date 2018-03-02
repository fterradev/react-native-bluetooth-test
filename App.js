import React, { Component } from 'react';
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

export default class App extends Component {
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
            <Input placeholder="Message" />
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

const styles = {
  Content: {
    padding: '5%',
    paddingLeft: '20%',
    paddingRight: '20%'
  },
  
  Button: {
    margin: 10
  }
};