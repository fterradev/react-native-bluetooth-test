import React, { Component } from 'react';
import { Animated } from 'react-native';
import PropTypes from 'prop-types';

class Outcome extends Component {
  state = {
    bounceValue: new Animated.Value(0.1),
    fadeOutValue: new Animated.Value(1)
  };

  componentDidMount() {
    const { bounceValue, fadeOutValue } = this.state;
    Animated.sequence([
      Animated.spring(bounceValue, { toValue: 1, speed: 10 }),
      Animated.timing(fadeOutValue, { toValue: 0, timing: 0.5 })
    ]).start(this.props.callback);
  }

  render() {
    const { outcome } = this.props;
    const { bounceValue, fadeOutValue } = this.state;

    return (
      <Animated.Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          transform: [{ scale: bounceValue }],
          opacity: fadeOutValue
        }}
      >
        {outcome}
      </Animated.Text>
    );
  }
}

Outcome.propTypes = {
  outcome: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};

export default Outcome;
