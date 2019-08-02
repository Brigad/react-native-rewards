import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import posed from 'react-native-pose';
import {
  generateConfettiItems,
  generateConfettiInitialTranslations,
  generateConfettiAnimations,
} from './confetti';
import { generateEmojiItems } from './emoji';

const confecttiCount = 40;
const SpringAnim = posed.View({
  clicked: {
    y: 5,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 2,
      useNativeDriver: true,
    },
  },
  punished: {
    x: 5,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 2,
      useNativeDriver: true,
    },
  },
  rest: {
    x: 0,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 2,
      useNativeDriver: true,
    },
  },
});
class RewardsComponent extends Component {
  state = {
    translations: generateConfettiInitialTranslations(confecttiCount, 0),
    state: null,
  };

  constructor(props) {
    super(props);
    this.containerRef = createRef();
  }

  get animationParams() {
    const {
      initialSpeed,
      spread,
      deacceleration,
      rotationXSpeed,
      rotationYSpeed,
      rotationZSpeed,
    } = this.props;
    const params = {
      initialSpeed,
      spread,
      deacceleration,
      rotationXSpeed,
      rotationYSpeed,
      rotationZSpeed,
    };
    return params;
  }

  async rest() {
    setTimeout(() => {
      this.setState({ state: 'rest' });
      this.props.onRest();
    }, 100);
  }

  async punishMe() {
    this.setState({ state: 'punished' });
    this.rest();
  }

  UNSAFE_componentWillReceiveProps(props) {
    const newState = props.state;
    const { state } = this.props;
    if (state === newState) {
      return;
    }
    switch (newState) {
      case 'reward':
        this.rewardMe();
        break;
      case 'punish':
        this.rewardMe();
        break;
      default:
    }
  }

  translations = generateConfettiInitialTranslations(confecttiCount);

  async rewardMe() {
    this.setState({ state: 'clicked' });
    generateConfettiAnimations(this.translations, this.animationParams);
    this.rest();
  }

  items = null;

  render() {
    const { children, animationType, colors, emojis } = this.props;
    const { state } = this.state;
    if (!this.items) {
      switch (animationType) {
        case 'confetti':
          this.items = generateConfettiItems(
            this.translations,
            confecttiCount,
            colors,
          );
          break;
        case 'emoji':
          this.items = generateEmojiItems(
            this.translations,
            confecttiCount,
            emojis,
          );
          break;
        default:
          this.items = generateConfettiItems(
            this.translations,
            confecttiCount,
            colors,
          );
      }
    }

    return (
      <View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {this.items}
        </View>
        <SpringAnim pose={state}>{children}</SpringAnim>
      </View>
    );
  }
}
RewardsComponent.propTypes = {
  children: PropTypes.element.isRequired,
  initialSpeed: PropTypes.number,
  spread: PropTypes.number,
  deacceleration: PropTypes.number,
  rotationXSpeed: PropTypes.number,
  rotationYSpeed: PropTypes.number,
  rotationZSpeed: PropTypes.number,
  particiesCount: PropTypes.number,
  colors: PropTypes.array,
  emojis: PropTypes.array,
  animationType: PropTypes.oneOf(['confetti', 'emoji']),
  state: PropTypes.oneOf(['rest', 'reward', 'punish']),
  onRest: PropTypes.func,
};

RewardsComponent.defaultProps = {
  initialSpeed: 1,
  spread: 1,
  deacceleration: 1,
  rotationXSpeed: 5,
  rotationYSpeed: 5,
  rotationZSpeed: 5,
  particiesCount: 20,
  colors: ['#A45BF1', '#25C6F6', '#72F753', '#F76C88', '#F5F770'],
  emojis: ['👍', '😊', '🎉'],
  animationType: 'confetti',
  state: 'rest',
  onRest: () => {},
};
export default RewardsComponent;
