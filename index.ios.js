import React from 'react';
import {
  NativeModules,
  requireNativeComponent,
  StyleSheet,
  View,
} from 'react-native';

const { func, number, string, bool, oneOf } = React.PropTypes;

const SketchManager = NativeModules.RNSketchManager || {};

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: 200,
  },
});

export default class Sketch extends React.Component {

  static propTypes = {
    fillColor: string,
    onChange: func,
    onReset: func,
    clearButtonHidden: bool,
    onClearPlaceholder: func,
    strokeColor: string,
    strokeThickness: number,
    style: View.propTypes.style,
    imageType: oneOf(['jpg', 'png'])
  };

  static defaultProps = {
    fillColor: '#ffffff',
    onChange: () => {},
    onReset: () => {},
    clearButtonHidden: false,
    strokeColor: '#000000',
    strokeThickness: 1,
    style: null,
    imageType: 'jpg'
  };

  saveImage(image) {
    if (typeof image !== 'string') {
      return Promise.reject('You need to provide a valid base64 encoded image.');
    }

    return SketchManager.saveImage(src, this.props.imageType);
  }

  clear() {
    return SketchManager.clear();
  }

  render() {
    return (
      <RNSketch
        {...this.props}
        style={[styles.base, this.props.style]}
      />
    );
  }

}

const RNSketch = requireNativeComponent('RNSketch', Sketch);
