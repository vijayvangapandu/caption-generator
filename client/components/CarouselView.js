/**
 * Carousel component
 * @flow
 */

import React, { Component } from 'react';
import Carousel from 'react-native-snap-carousel';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
} from 'react-native';

export default class CarouselView extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: Dimensions.get('window').width
            }
        };
    }
    render() {
        return (
            <View
                style={styles.carouselView}
                onLayout={() => {
                    this.setState({
                        viewport: {
                            width: Dimensions.get('window').width
                        }
                    });
                }}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.props.captions}
                    renderItem={({item, index})=> (
                        <Text
                            onPress={() => this.props.onPressCaptionItem(item.id)}
                            style={styles.caption}>{item.text}</Text>
                    )}
                    slideStyle={[{width: this.state.viewport.width}, styles.carouselSlide]}
                    sliderWidth={this.state.viewport.width}
                    itemWidth={this.state.viewport.width}
                    inactiveSlideOpacity={0} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    carouselView: {
        paddingTop: 15
    },
    carouselSlide: {
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    caption: {
        marginBottom: 5,
        fontSize: 22,
    },
});