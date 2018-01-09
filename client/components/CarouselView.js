/**
 * MainActivity component
 * @flow
 */

import React, { Component } from 'react';
import Carousel from 'react-native-snap-carousel';
import styles from '../styles';
import { View, Text, Dimensions } from 'react-native';

export default class CarouselView extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height
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
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height
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