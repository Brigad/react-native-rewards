import React from 'react';
import { Animated } from 'react-native';

export function ConfettiItem({
  color,
  translateX,
  translateY,
  opacity,
  rotateX,
  rotateY,
  rotateZ,
}) {
  const spinX = rotateX.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '360deg'],
  });
  const spinZ = rotateZ.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '360deg'],
  });
  const spinY = rotateY.interpolate({
    inputRange: [0, 10],
    outputRange: ['0deg', '360deg'],
  });
  const itemStyle = {
    backgroundColor: color,
    height: 8,
    width: 8,
    opacity,
    transform: [
      { translateX },
      { translateY },
      { rotateX: spinX },
      { rotateY: spinY },
      { rotateZ: spinZ },
    ],
    position: 'absolute',
  };
  return <Animated.View style={itemStyle} />;
}

export function generateConfettiItems(translations, count, colors) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const { transform, opacity, rotateX, rotateZ, rotateY } = translations[i];
    const item = (
      <ConfettiItem
        key={i}
        color={colors[i % colors.length]}
        translateX={transform.x}
        translateY={transform.y}
        rotateX={rotateX}
        rotateY={rotateY}
        rotateZ={rotateZ}
        opacity={opacity}
      />
    );
    items.push(item);
  }
  return items;
}

export function generateConfettiInitialTranslations(count) {
  const translations = [];
  for (let i = 0; i < count; i++) {
    const translation = {
      transform: new Animated.ValueXY(0, 0),
      opacity: new Animated.Value(0),
      rotateX: new Animated.Value(0),
      rotateY: new Animated.Value(0),
      rotateZ: new Animated.Value(0),
    };
    translations.push(translation);
  }
  return translations;
}

export function generateConfettiAnimations(translations, params) {
  return translations.map((item, index) =>
    generateConfettiAnimation(item, index, translations.length, params),
  );
}

const degrees = 0;
const angle = (degrees * Math.PI) / 180;
const vx = Math.cos(angle);
const vy = Math.sin(angle);

function generateConfettiAnimation(
  { transform, opacity, rotateX, rotateZ, rotateY },
  params,
) {
  const {
    initialSpeed,
    spread,
    deacceleration,
    rotationXSpeed,
    rotationYSpeed,
    rotationZSpeed,
  } = params;

  const spreadSpeed = (Math.random() - 0.5) * 3 * initialSpeed * spread;
  const flySpeed = (-1.0 - Math.random() * 2) * initialSpeed;
  const xSpeed = spreadSpeed * vx + flySpeed * vy;
  const ySpeed = flySpeed * vx + flySpeed * vy;
  const upAnimation = Animated.decay(transform, {
    // coast to a stop
    velocity: { x: xSpeed, y: ySpeed }, // velocity from gesture release
    deceleration: 0.989 + (1 - deacceleration) / 100,
    useNativeDriver: true,
  });

  const duration = 2000 + Math.random() * 100;
  const downAnimation = Animated.timing(
    // Animate over time
    transform.y, // The animated value to drive
    {
      toValue: 100 + Math.random() * 100, // Animate to opacity: 1 (opaque)
      duration, // Make it take a while
      useNativeDriver: true,
    },
  );
  const disapearAnimation = Animated.timing(
    // Animate over time
    opacity, // The animated value to drive
    {
      toValue: 0, // Animate to opacity: 1 (opaque)
      duration, // Make it take a while
      useNativeDriver: true,
    },
  );
  const rotateXAnimation = Animated.timing(rotateX, {
    toValue: Math.random() * 3 * rotationXSpeed,
    duration,
    useNativeDriver: true,
  });
  const rotateYAnimation = Animated.timing(rotateY, {
    toValue: Math.random() * 3 * rotationYSpeed,
    duration,
    useNativeDriver: true,
  });
  const rotateZAnimation = Animated.timing(rotateZ, {
    toValue: Math.random() * 5 * rotationZSpeed,
    duration,
    useNativeDriver: true,
  });

  transform.setValue({ x: 0, y: 0 });
  opacity.setValue(1);
  rotateX.setValue(0);
  rotateY.setValue(0);
  rotateZ.setValue(0);

  Animated.parallel([
    Animated.sequence([
      upAnimation,
      Animated.parallel([disapearAnimation, downAnimation]),
    ]),
    rotateXAnimation,
    rotateYAnimation,
    rotateZAnimation,
  ]).start();
}
