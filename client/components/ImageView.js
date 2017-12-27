/**
 * ImageView component
 * @flow
 */

import React, { Component } from 'react';
import styles from '../styles';
import { View, Text } from 'react-native';

export default class ImageView extends Component<{}> {
    constructor(props) {
        super();
    }
    render() {
        return (
            <View style={styles.heroContainer}>
                {this.props.image.data ?  (
                    <View style={styles.imageView}>
                        {this.props.loading && <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        </View>}
                        <Image
                            style={styles.imageComponent}
                            source={{uri: this.props.image.data}} />
                    </View>
                ) : (
                    <View style={styles.introView}>
                        <View style={styles.introViewInner}>
                            <Text style={styles.modalTitle}>caption generator</Text>
                            <Text>1) choose an image</Text>
                            <Text>2) process the image</Text>
                            <Text>3) tap a caption to copy it</Text>
                            <Text style={styles.modalText}>4) profit</Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}
