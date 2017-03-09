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
        imageType: oneOf( [ 'jpg', 'png' ] ),
        onRedoChange: func
    };

    static defaultProps = {
        onChange: () => {},
        onReset: () => {},
        onRedoChange: () => {},
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
            this.props.onRedoChange( false );
        } else {
            this.onReset();
        }
    }

    setImage( image, set = true ) {
        if ( typeof image !== 'string' ) {
            return Promise.reject( 'You need to provide a valid base64 encoded image.' );
        }
        if ( set ) {
            this.history = this.history.setState( image );
            this.props.onRedoChange( false );
        }

        return Promise.resolve( SketchManager.setImage( image ) ).then( () => image );
    }

    undo( howManyTimes = 1 ) {

        this.history = this.history.revert( howManyTimes );

        if ( this.history.getHistory().length == 0 ) {
            this.clear();
        } else {
            this.setImage( this.history.getState(), false );
            this.props.onRedoChange( true );
        }
    }

    redo( howManyTimes = 1 ) {
        this.history = this.history.jump( howManyTimes );
        this.setImage( this.history.getState(), false );
        if ( this.history.getFuture().length > 0 ) {
            this.props.onRedoChange( true );
        } else {
            this.props.onRedoChange( false );
        }
    }

    saveImage( image ) {
        if ( typeof image !== 'string' ) {
            return Promise.reject( 'You need to provide a valid base64 encoded image.' );
        }
        this.history = this.history.clearHistory();
        return SketchManager.saveImage( image, this.props.imageType );
    }

    saveCurImage() {
        return this.saveImage( this.history.getState() );
    }

    clear() {
        this.history = this.history.clearHistory();
        this.props.onRedoChange( false );
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
