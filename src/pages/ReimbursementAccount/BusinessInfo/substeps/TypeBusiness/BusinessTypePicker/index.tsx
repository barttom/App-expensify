import React, {useState} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {View} from 'react-native';
import FormHelpMessage from '@components/FormHelpMessage';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import BusinessTypeSelectorModal from './BusinessTypeSelectorModal';
import type {IncorporationType} from './types';

type BusinessTypePickerProps = {
    /** Error text to display */
    errorText: string;

    /** State to display */
    value: string;

    /** Callback to call when the input changes */
    onInputChange: (value: string) => void;

    /** Label to display on field */
    label: string;

    /** Any additional styles to apply */
    wrapperStyle: StyleProp<ViewStyle>;

    /**  Callback to call when the picker modal is dismissed */
    onBlur: () => void;
};

function BusinessTypePicker({errorText = '', value, wrapperStyle, onInputChange, label, onBlur}: BusinessTypePickerProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const [isPickerVisible, setIsPickerVisible] = useState(false);

    const showPickerModal = () => {
        setIsPickerVisible(true);
    };

    const hidePickerModal = (shouldBlur = true) => {
        if (shouldBlur) {
            onBlur();
        }
        setIsPickerVisible(false);
    };

    const updateBusinessTypeInput = (businessType: {value: string}) => {
        if (businessType.value !== value) {
            onInputChange(businessType.value);
        }
        // If the user selects any state, call the hidePickerModal function with shouldBlur = false
        // to prevent the onBlur function from being called.
        hidePickerModal(false);
    };

    const title = value ? translate(`businessInfoStep.incorporationType.${value as IncorporationType}`) : '';
    const descStyle = title.length === 0 ? styles.textNormal : null;

    return (
        <View>
            <MenuItemWithTopDescription
                shouldShowRightIcon
                title={title}
                description={label || translate('common.state')}
                descriptionTextStyle={descStyle}
                onPress={showPickerModal}
                wrapperStyle={wrapperStyle}
            />
            <View style={styles.ml5}>
                <FormHelpMessage message={errorText} />
            </View>
            <BusinessTypeSelectorModal
                isVisible={isPickerVisible}
                currentBusinessType={value}
                onClose={hidePickerModal}
                onBusinessTypeSelected={updateBusinessTypeInput}
                label={label}
            />
        </View>
    );
}

BusinessTypePicker.displayName = 'BusinessTypePicker';

export default BusinessTypePicker;
