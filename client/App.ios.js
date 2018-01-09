/**
 * MainActivity component
 * @flow
 */

import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import MainActivity from './components/MainActivity';
import NavigationView  from './components/NavigationView';
import HeaderView from './components/HeaderView';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import styles from './styles';
import {
    StyleSheet,
    NavigatorIOS,
    View,
    Text,
    StatusBar
} from 'react-native';

export default class App extends Component<{}> {
    constructor(props) {
        super();
        this.state = {
            uri: null,
            image: {
                data: null,
                fileName: null,
                type: null
            },
            captions: [],
            labels: [],
            appLoading: false,
            captionsLoading: false,
            selectedCaption: 0,
            modalVisible: false,
            drawerOpen: false,
            store: []
        }
    }
    componentWillMount() {
        this.setState({
            store: require('./mock/mock_data.js')
        })
    }
    setActiveItem = (item) => {
        let image = {
            data: item.data,
            fileName: item.fileName,
            type: 'img/jpg'
        };
        this.setState({
            image,
            captions: item.captions,
            labels: item.labels,
            selectedCaption: 0
        });
        this.forceUpdate();
    }
    processImagePickerResponse(response) {
        console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        }
        else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        }
        else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        }
        else {
            let image = {
                type: response.type,
                fileName: response.fileName,
                data: `data:image/jpeg;base64,${response.data}`
            };
            this.setState({image});
        }
    }
    generateCaptions(index) {
        this.setState({
            captionsLoading: true,
            selectedCaption: index
        });
        fetch('http://192.168.0.5:3001/api/v1/captions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                label: this.state.labels[index]
            })
        })
        .then((raw) => raw.json())
        .then((response) => {
            this.setState({
                captionsLoading: false,
                captions: response.captions
            });
        })
        .catch((error)=> console.warn('network error', error));
    }
    onActionSelected = () => {
        if (this.state.drawerOpen) {
            this.refs['DRAWER'].closeDrawer();
        }  else {
            this.refs['DRAWER'].openDrawer();
        }
    }
    onPressCaptionItem = (item) => {
        console.log('caption pressed', item);
    }
    render() {
        return (
            <DrawerLayout
                ref={'DRAWER'}
                drawerWidth={200}
                drawerPosition={DrawerLayout.positions.Left}
                drawerBackgroundColor={'#841584'}
                onDrawerOpen={(state) => this.setState({drawerOpen: true})}
                onDrawerClose={(state) => this.setState({drawerOpen: false})}
                renderNavigationView={() => {
                    return <NavigationView
                                setActiveItem={(item) => this.setActiveItem(item)}
                                store={this.state.store}
                                image={this.state.image} />
            }}>
            <StatusBar backgroundColor={"#841584"} barStyle={"light-content"} />
            <HeaderView />
            <MainActivity
                captions={this.state.captions}
                selectedCaption={this.state.selectedCaption}
                labels={this.state.labels}
                image={this.state.image}
                captionsLoading={this.state.captionsLoading}
                appLoading={this.state.appLoading}
                generateCaptions={(index) => this.generateCaptions(index)}
                onActionSelected={()=> this.onActionSelected()}
                processImagePickerResponse = {(response) => this.processImagePickerResponse(response)}
                onPressCaptionItem={(item) => this.onPressCaptionItem(item)} />
            </DrawerLayout>
        );
    }
}
