"use strict";
/**
 * comment generator application
 * https://github.com/facebook/react-native
 * @flow
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ImagePicker = require("react-native-image-picker");
const NavigationView_js_1 = require("./components/NavigationView.js");
const styles_1 = require("./styles");
const react_native_1 = require("react-native");
require('./utils/network-logger.js')();
// const icon = require('./assets/menu-icon.svg');
const instructions = react_native_1.Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
class App extends React.Component {
    constructor(props) {
        super(props);
        this.asyncPurgeStore = (key) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield react_native_1.AsyncStorage.removeItem((key, error) => {
                    if (error) {
                        console.warn('purge store error', error);
                    }
                    else {
                        this.forceUpdate();
                    }
                });
            }
            catch (error) {
                console.warn('purge store error', error);
            }
        });
        this.asycnMultiGet = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield react_native_1.AsyncStorage.getAllKeys((error, keys) => {
                    react_native_1.AsyncStorage.multiGet(keys, (error, stores) => {
                        store = stores.map((store) => {
                            return JSON.parse(store[1]);
                        });
                        this.setState({ store });
                    });
                    if (keys.length >= 5) {
                        this.asyncPurgeStore(keys[5]);
                    }
                });
            }
            catch (error) {
                console.warn('async multi get error', error);
            }
        });
        this.asyncStoreData = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield react_native_1.AsyncStorage.setItem(this.state.image.fileName, JSON.stringify({
                    timestamp: new Date().getTime(),
                    data: this.state.image.data,
                    fileName: this.state.image.fileName,
                    type: this.state.image.imagetype,
                    captions: this.state.captions,
                    labels: this.state.labels
                }));
            }
            catch (error) {
                console.warn('error saving data', error);
            }
        });
        this.setActiveItem = (item) => {
            let image = {
                data: item.data,
                fileName: item.fileName,
                type: 'img/jpg'
                //@TODO get actual image type
            };
            this.setState({
                image,
                captions: item.captions,
                labels: item.labels
            });
        };
        this._onActionSelected = () => {
            if (this.state.drawrOpen) {
                this.refs['DRAWER'].closeDrawr();
            }
            else {
                this.refs['DRAWER'].openDrawer();
            }
        };
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
            drawrOpen: false,
            store: []
        };
        this.pickerOptions = {
            title: 'Photo Picker',
            takePhotoButtonTitle: 'Take Photo...',
            chooseFromLibraryButtonTitle: 'Choose from Library...',
            maxWidth: 500,
            maxHeight: 500,
            aspectX: 2,
            aspectY: 1,
            storageOptions: {
                skipBackup: true
            }
        };
    }
    componentWillMount() {
        // AsyncStorage.clear((error)=> {
        //     console.log(error);
        // });
        this.asycnMultiGet();
    }
    componentDidMount() {
        console.log('component did mount');
    }
    componentWillUnmount() {
        console.log('component will unmount');
    }
    setSelectedImage(imgData) {
        console.log('pressed', imgData);
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
            this.setState({ image });
        }
    }
    loadCameraPhoto() {
        ImagePicker.launchCamera(this.pickerOptions, (response) => this.processImagePickerResponse(response));
    }
    loadLibraryPhoto() {
        ImagePicker.launchImageLibrary(this.pickerOptions, (response) => this.processImagePickerResponse(response));
    }
    showImagePicker() {
        ImagePicker.showImagePicker(this.pickerOptions, (response) => this.processImagePickerResponse(response));
    }
    processImage() {
        this.setState({ appLoading: true });
        fetch('http://192.168.0.7:3001/api/v1/process', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.state.image.fileName,
                type: this.state.image.type,
                dataURL: this.state.image.data
            })
        })
            .then((raw) => raw.json())
            .then((json) => {
            this.setState({
                appLoading: false,
                captions: json.captions,
                labels: json.labels
            }, () => {
                this.asyncStoreData()
                    .then(() => this.asycnMultiGet());
            });
        })
            .catch((error) => console.warn('network error', error));
    }
    generateCaptions(index) {
        this.setState({
            captionsLoading: true,
            selectedCaption: index
        });
        fetch('http://192.168.0.7:3001/api/v1/captions', {
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
            .catch((error) => console.warn('network error', error));
    }
    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    _onPressCaptionItem(id) {
        this.state.captions.forEach((item) => {
            if (id === item.id) {
                react_native_1.Clipboard.setString(this.state.captions[id].text);
                react_native_1.ToastAndroid.show('Copied!', react_native_1.ToastAndroid.SHORT);
            }
        });
    }
    render() {
        return (React.createElement(react_native_1.DrawerLayoutAndroid, { ref: 'DRAWER', drawerWidth: 200, drawerPosition: react_native_1.DrawerLayoutAndroid.positions.Left, drawerBackgroundColor: '#841584', onDrawerOpen: (state) => this.setState({ drawrOpen: true }), onDrawerClose: (state) => this.setState({ drawrOpen: false }), renderNavigationView: () => {
                return React.createElement(NavigationView_js_1.default, { setActiveItem: (item) => this.setActiveItem(item), store: this.state.store, image: this.state.image });
            } },
            React.createElement(react_native_1.View, { style: styles_1.default.container },
                React.createElement(react_native_1.Modal, { animationType: "slide", transparent: true, visible: this.state.modalVisible, onRequestClose: () => { alert("Modal has been closed."); } },
                    React.createElement(react_native_1.View, { style: styles_1.default.modalView },
                        React.createElement(react_native_1.View, { style: styles_1.default.modalViewInner },
                            React.createElement(react_native_1.View, null,
                                React.createElement(react_native_1.Text, { style: styles_1.default.modalTitle }, "caption generator"),
                                React.createElement(react_native_1.Text, null, "1) choose an image"),
                                React.createElement(react_native_1.Text, null, "2) process the image"),
                                React.createElement(react_native_1.Text, null, "3) tap a caption to copy it"),
                                React.createElement(react_native_1.Text, { style: styles_1.default.modalText }, "4) profit"),
                                React.createElement(react_native_1.Button, { onPress: () => this.setModalVisible(!this.state.modalVisible), style: [styles_1.default.button], title: "Got It!", color: "#841584", accessibilityLabel: "close modal" }))))),
                React.createElement(react_native_1.View, { style: styles_1.default.heroContainer },
                    React.createElement(react_native_1.StatusBar, { backgroundColor: "#841584", barStyle: "light-content" }),
                    React.createElement(react_native_1.ToolbarAndroid, { style: styles_1.default.toolbarAndroid, titleColor: "#fff", actions: [{ title: 'Photos', show: 'always' }], onActionSelected: () => this._onActionSelected(), title: "cgen" }),
                    this.state.image.data ? (React.createElement(react_native_1.View, { style: styles_1.default.imageView },
                        this.state.appLoading && React.createElement(react_native_1.View, { style: styles_1.default.loadingOverlay },
                            React.createElement(react_native_1.ActivityIndicator, { size: "large", color: "#fff" })),
                        React.createElement(react_native_1.Image, { style: styles_1.default.imageComponent, source: { uri: this.state.image.data } }))) : (React.createElement(react_native_1.View, { style: styles_1.default.introView },
                        React.createElement(react_native_1.View, { style: styles_1.default.introViewInner },
                            React.createElement(react_native_1.Text, { style: styles_1.default.modalTitle }, "caption generator"),
                            React.createElement(react_native_1.Text, null, "1) choose an image"),
                            React.createElement(react_native_1.Text, null, "2) process the image"),
                            React.createElement(react_native_1.Text, null, "3) tap a caption to copy it"),
                            React.createElement(react_native_1.Text, { style: styles_1.default.modalText }, "4) profit"))))),
                React.createElement(react_native_1.View, null,
                    !!this.state.labels && React.createElement(react_native_1.View, { style: styles_1.default.labelView }, !!this.state.labels && this.state.labels.map((label, i) => (React.createElement(react_native_1.Text, { key: i, style: styles_1.default.labelText, onPress: () => this.generateCaptions(i), style: [styles_1.default.labelText, this.state.selectedCaption === i ? styles_1.default.labelTextActive : null] }, label)))),
                    !!this.state.captions.length && React.createElement(react_native_1.View, { style: styles_1.default.captionView }, !!this.state.captionsLoading ? (React.createElement(react_native_1.ActivityIndicator, { size: "small", color: "#841584" })) : (React.createElement(react_native_1.FlatList, { data: this.state.captions, extraData: this.state, keyExtractor: (item) => item.id, onPressItem: (item) => this._onPressCaptionItem(item.id), renderItem: ({ item }) => (React.createElement(react_native_1.Text, { onPress: () => this._onPressCaptionItem(item.id), style: styles_1.default.caption }, item.text)) })))),
                React.createElement(react_native_1.View, { style: styles_1.default.toolbarView },
                    React.createElement(react_native_1.View, { style: styles_1.default.row },
                        React.createElement(react_native_1.Button, { style: styles_1.default.button, _onPress: () => this.setModalVisible(true), title: "Show Modal", color: "#841584", accessibilityLabel: "show modal dialog" }),
                        React.createElement(react_native_1.Button, { style: styles_1.default.button, onPress: () => this.loadLibraryPhoto(), title: "Library Photos", color: "#841584", accessibilityLabel: "load photos from library" })),
                    React.createElement(react_native_1.View, { style: styles_1.default.row },
                        React.createElement(react_native_1.Button, { style: styles_1.default.button, onPress: () => this.loadCameraPhoto(), title: "Camera Photos", color: "#841584", accessibilityLabel: "load photos from camera" }),
                        React.createElement(react_native_1.Button, { style: styles_1.default.button, onPress: () => this.showImagePicker(), title: "Show Picker", color: "#841584", accessibilityLabel: "show image picker" }),
                        React.createElement(react_native_1.Button, { style: styles_1.default.button, onPress: () => this.processImage(), title: "Process Image", color: "#841584", accessibilityLabel: "process current image" }))))));
    }
}
exports.default = App;
react_native_1.AppRegistry.registerComponent('cgen', () => App);
//# sourceMappingURL=index.js.map