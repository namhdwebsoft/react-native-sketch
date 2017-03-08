import React from 'react';
import {
    NativeModules,
    requireNativeComponent,
    StyleSheet,
    View,
} from 'react-native';
import UnDoable from './UnDoable';

const { func, number, string, bool, oneOf } = React.PropTypes;

const SketchManager = NativeModules.RNSketchManager || {},
    styles = StyleSheet.create( {
        base: {
            flex: 1,
            height: 200,
        },
    } );


export default class Sketch extends React.Component {
    static propTypes = {
        onChange: func,
        onReset: func,
        clearButtonHidden: bool,
        onClearPlaceholder: func,
        strokeColor: string,
        strokeThickness: number,
        style: View.propTypes.style,
        imageType: oneOf( [ 'jpg', 'png' ] )
    };

    static defaultProps = {
        onChange: () => {},
        onReset: () => {},
        clearButtonHidden: false,
        strokeColor: '#000000',
        strokeThickness: 1,
        style: null,
        imageType: 'jpg'
    };


    constructor( props ) {
        super( props );
        this.onReset = this.onReset.bind( this );
        this.onUpdate = this.onUpdate.bind( this );
        this.history = UnDoable.new( '' )
    }

    onReset() {
        this.props.onUpdate( null );
        this.props.onReset();
    }

    onUpdate( e ) {
        const image = e.nativeEvent.image
        if ( image ) {
            this.props.onUpdate( image );
            this.history = this.history.setState( image );
        } else {
            this.onReset();
        }
    }

    setImage( image ) {
        if ( typeof image !== 'string' ) {
            return Promise.reject( 'You need to provide a valid base64 encoded image.' );
        }
        this.history = this.history.setState( image );
        return Promise.resolve( SketchManager.setImage( image ) ).then( () => image );
    }

    undo( howManyTimes = 1 ) {
        console.log( JSON.stringify( this.history ) )
        this.history = this.history.revert( howManyTimes );
        console.log( JSON.stringify( this.history ) )

        if ( this.history.getState() == null || this.history.getState() == '' ) {
            this.setImage( this.history.getState() );
        } else {
            this.clear();
        }

        this.undo();
    }

    redo( howManyTimes = 1 ) {
        this.history = this.history.jump( howManyTimes );
        this.setImage( this.history.getState() );
        this.undo();
    }

    saveImage( image ) {
        if ( typeof image !== 'string' ) {
            return Promise.reject( 'You need to provide a valid base64 encoded image.' );
        }
        this.history = this.history.clearHistory();
        return SketchManager.saveImage( src, this.props.imageType );
    }

    clear() {
        this.history = this.history.clearHistory();
        return SketchManager.clear();
    }

    render() {
        return (
            <RNSketch
        {...this.props}
        onChange={this.onUpdate}
        style={[styles.base, this.props.style]}
      />
        );
    }

}

const RNSketch = requireNativeComponent( 'RNSketch', Sketch );
