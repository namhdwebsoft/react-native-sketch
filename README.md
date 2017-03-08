# react-native-sketch

[![Version](https://img.shields.io/npm/v/react-native-sketch.svg?style=flat-square)](http://npm.im/react-native-sketch)
[![Downloads](https://img.shields.io/npm/dm/react-native-sketch.svg?style=flat-square)](http://npm.im/react-native-sketch)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-1dce73.svg?style=flat-square)](https://gitter.im/jgrancher/react-native-sketch)
[![MIT License](https://img.shields.io/npm/l/react-native-sketch.svg?style=flat-square)](http://opensource.org/licenses/MIT)

*A react-native component for touch-based drawing with an ability to draw over the images.*

![Screenshots](https://cloud.githubusercontent.com/assets/5517450/15202227/ca865758-183b-11e6-8c4e-41080bc04538.jpg "Disclaimer: This is not my signature ;)")

## Getting started

Use react-native to install and link this component to your project:
```bash
$ react-native install react-native-sketch
```

## Usage

### Solid background

```javascript
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sketch from 'react-native-sketch';

const styles = StyleSheet.create({
  container: {
    padding: 20,    
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  sketch: {
    height: 250, // Height needed; Default: 200px
    marginBottom: 20,
    backgroundColor: '#ffffff', // Solid White background. Replacement for the fillColor property
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

class Signature extends Component {

  constructor(props) {
    super(props);
    this.onReset = this.onReset.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  state = {
    encodedSignatures: [],
  };

  /**
   * Do extra things after the sketch reset
   */
  onReset() {
    console.log('The drawing has been cleared!');
  }

  /**
   * The Sketch component provides a 'saveImage' function (promise),
   * so that you can save the drawing in the device and get an object
   * once the promise is resolved, containing the path of the image.
   */
  onSave() {
    this.sketch.saveImage(this.state.encodedSignature)
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }

  /**
   * On every update (touch up from the drawing),
   * you'll receive the base64 representation of the drawing as a callback.
   * So we store it in an array of all past lines in order to have an undo functionality
   */
  onUpdate(base64Image) {
    this.setState({ encodedSignatures: [ base64Image, ...this.state.encodedSignatures ] });
  }
  /**
   * Since we stored every past image we can undo through them
   */
  undo() {
        const [ first, ...encodedSignatures ] = this.state.encodedSignatures;

        this.setState( { encodedSignatures } )

        if ( encodedSignatures[ 0 ] ) {

            this.sketch.setImage( encodedSignatures[ 0 ] );

        } else {

            // Just clear the screen
            this.sketch.clear();
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.instructions}>
          Use your finger on the screen to sign.
        </Text>
        <Sketch
          strokeColor="#111111"
          strokeThickness={2}
          onReset={this.onReset}
          onUpdate={this.onUpdate}
          ref={(sketch) => { this.sketch = sketch; }}
          style={styles.sketch}
        />
        <TouchableOpacity
          disabled={!this.state.encodedSignature}
          style={styles.button}
          onPress={this.onSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }

}

export default Signature;
```

### Render over the image (transparent background) 

1. Set the transparent backgroundColor style property. 

```javascript
const styles = StyleSheet.create({
  sketch: {
    height: 250, 
    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
  }
});
  ```
2. Wrap the Sketch component into the Image component
  
```javascript
  <Image
    style={ styles.imageStyle }
    source={ {uri: imageUri} }
  >
    <Sketch
      strokeColor="#111111"
      strokeThickness={2}
      onReset={this.onReset}
      onUpdate={this.onUpdate}
      ref={(sketch) => { this.sketch = sketch; }}
      style={styles.sketch}
    />
  </Image>
 ```

## Roadmap

- [ ] Define a way for an external component to clear the current drawing.
- [ ] Improve the documentation.
- [ ] Make some tests.
- [ ] Android support (help wanted ¯\\_(ツ)_/¯).

## Notes

This component uses this [smooth freehand drawing technique](http://code.tutsplus.com/tutorials/smooth-freehand-drawing-on-ios--mobile-13164) under the hood.

## Contributing

Feel free to contribute by sending a pull request or [creating an issue](https://github.com/jgrancher/react-native-sketch/issues/new).

## License

MIT
