import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';

import FloatingLabelInputField from './FloatingLabelInputField'
import { Colors, Font } from '../Provider/Colorsfont';

const inputAccessoryViewID = 'OTPInput'

export default class OTPInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            codeDigOne: '',
            codeDigOneFocus: false,
            codeDigTwo: '',
            codeDigTwoFocus: false,
            codeDigThree: '',
            codeDigThreeFocus: false,
            codeDigFour: '',
            codeDigFourFocus: false,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.reset !== prevProps.reset && this.props.reset) {

            this.setState({
                codeDigOne: '',
                codeDigTwo: '',
                codeDigThree: '',
                codeDigFour: '',
            });
        }
    }

    componentDidMount() {

        if (this.fieldCodeDigOne) {
            this.fieldCodeDigOne.focus()
        }

    }

    getCode = () => {
        const { codeDigOne, codeDigTwo, codeDigThree, codeDigFour } = this.state
        // console.log(codeDigOne + codeDigTwo + codeDigThree + codeDigFour)
        return codeDigOne + codeDigTwo + codeDigThree + codeDigFour
    }

    render() {
        const { codeDigOne, codeDigTwo, codeDigThree, codeDigFour } = this.state
        const { onComplete } = this.props

        return (
            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", width: '100%', }}>

                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigOne = ref}
                    hideLabel={true}
                    onParentPress={() => { if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus() }}
                    value={codeDigOne}
                    inputContainer={{
                        borderColor: this.state.codeDigOne != '' ? Colors.Theme : Colors.lightGrey,

                    }}
                    autoCapitalize={'none'}
                    placeholder={''}
                    caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length <= 1) this.setState({ codeDigOne: text }, () => {
                            if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        })
                    }}
                    onFocus={(event) => {
                        this.setState({ codeDigOne: '', codeDigTwo: '', codeDigThree: '', codeDigFour: '', codeDigOneFocus: true })
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigOne: '' })
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigTwo = ref}
                    onParentPress={() => { if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus() }}
                    value={codeDigTwo}
                    hideLabel={true}
                    inputContainer={{
                        borderColor: this.state.codeDigTwo != '' ? Colors.Theme : Colors.lightGrey,

                    }}
                    autoCapitalize={'none'}
                    placeholder={''}
                    caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length < 2) this.setState({ codeDigTwo: text }, () => {
                            // if(onComplete && typeof onComplete == 'function') onComplete(this.getCode())
                            if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        })
                    }}
                    onFocus={() => {
                        if (codeDigOne == '') if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
                        this.setState({ codeDigTwo: '', codeDigThree: '', codeDigFour: '', })
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigTwo: '' })
                            if (this.fieldCodeDigOne) this.fieldCodeDigOne.focus()
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigThree = ref}
                    onParentPress={() => { if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus() }}
                    value={codeDigThree}
                    hideLabel={true}
                    inputContainer={{
                        borderColor: this.state.codeDigThree != '' ? Colors.Theme : Colors.lightGrey
                    }}
                    autoCapitalize={'none'}
                    placeholder={''}
                    caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length < 2) this.setState({ codeDigThree: text }, () => {
                            if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus()
                        })
                    }}
                    onFocus={() => {
                        if (codeDigTwo == '') if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        this.setState({ codeDigThree: '', codeDigFour: '' })
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigThree: '' })
                            if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID}
                />
                <FloatingLabelInputField
                    fieldRef={ref => this.fieldCodeDigFour = ref}
                    onParentPress={() => { if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus() }}
                    value={codeDigFour}
                    hideLabel={true}
                    inputContainer={{
                        borderColor: this.state.codeDigFour != '' ? Colors.Theme : Colors.lightGrey
                    }}
                    autoCapitalize={'none'}
                    placeholder={''}
                    caretHidden={true}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        if (text.length < 2) this.setState({ codeDigFour: text }, () => {
                            if (this.fieldCodeDigFour) {
                                Keyboard.dismiss()
                                onComplete(this.getCode())
                            }
                        })
                    }}
                    onFocus={() => {
                        if (codeDigTwo == '') if (this.fieldCodeDigTwo) this.fieldCodeDigTwo.focus()
                        this.setState({ codeDigFour: '' })
                    }}
                    onKeyPress={(event) => {
                        if (event.key == 'Backspace') {
                            this.setState({ codeDigFour: '' })
                            if (this.fieldCodeDigThree) this.fieldCodeDigThree.focus()
                        } else if (/^[0-9]/g.test(event.key)) {
                            // if (this.fieldCodeDigFour) this.fieldCodeDigFour.focus()
                        }
                    }}
                    inputAccessoryViewID={inputAccessoryViewID} />
            </View>

        )
    }
}

const styles = StyleSheet.create({

});