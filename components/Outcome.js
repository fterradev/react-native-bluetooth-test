import React, { Component } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

class Outcome extends Component {
  state = {
    bounceValue: new Animated.Value(0.1)
  };

  componentDidMount() {
    const { bounceValue } = this.state;
    Animated.timing(bounceValue, { toValue: 1, duration: 1000 }).start();
  }

  render() {
    const { outcome } = this.props;
    const { bounceValue } = this.state;

    return (
      <Animated.Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          transform: [{ scale: bounceValue }]
        }}
      >
        {outcome}
      </Animated.Text>
    );
  }
}

Outcome.propTypes = {
  outcome: PropTypes.string.isRequired
};

export default Outcome;
