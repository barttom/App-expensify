import React from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {ReimbursementAccount} from '@src/types/onyx';
import type {FormValues} from '@src/types/onyx/Form';
import type * as OnyxCommon from '@src/types/onyx/OnyxCommon';

type PhoneNumberBusinessOnyxProps = {
    /** Reimbursement account from ONYX */
    reimbursementAccount: OnyxEntry<ReimbursementAccount>;
};

type PhoneNumberBusinessProps = PhoneNumberBusinessOnyxProps & SubStepProps;

const companyPhoneNumberKey = CONST.BANK_ACCOUNT.BUSINESS_INFO_STEP.INPUT_KEY.COMPANY_PHONE;

const validate = (values: FormValues): OnyxCommon.Errors => {
    const errors = ValidationUtils.getFieldRequiredErrors(values, [companyPhoneNumberKey]);

    if (values.companyPhone && !ValidationUtils.isValidUSPhone(values.companyPhone, true)) {
        errors.companyPhone = 'bankAccount.error.phoneNumber';
    }

    return errors;
};

function PhoneNumberBusiness({reimbursementAccount, onNext, isEditing}: PhoneNumberBusinessProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const defaultCompanyPhoneNumber = reimbursementAccount?.achData?.companyPhone ?? '';

    return (
        // @ts-expect-error TODO: Remove this once FormProvider (https://github.com/Expensify/App/issues/31972) is migrated to TypeScript
        <FormProvider
            formID={ONYXKEYS.REIMBURSEMENT_ACCOUNT}
            submitButtonText={isEditing ? translate('common.confirm') : translate('common.next')}
            validate={validate}
            onSubmit={onNext}
            style={[styles.mh5, styles.flexGrow1]}
            submitButtonStyles={[styles.pb5, styles.mb0]}
        >
            <Text style={styles.textHeadline}>{translate('businessInfoStep.enterYourCompanysPhoneNumber')}</Text>
            <InputWrapper
                // @ts-expect-error TODO: Remove this once InputWrapper (https://github.com/Expensify/App/issues/31972) is migrated to TypeScript
                InputComponent={TextInput}
                inputID={companyPhoneNumberKey}
                label={translate('common.phoneNumber')}
                aria-label={translate('common.phoneNumber')}
                role={CONST.ROLE.PRESENTATION}
                containerStyles={[styles.mt4]}
                inputMode={CONST.INPUT_MODE.TEL}
                placeholder={translate('common.phoneNumberPlaceholder')}
                defaultValue={defaultCompanyPhoneNumber}
                shouldSaveDraft
            />
        </FormProvider>
    );
}

PhoneNumberBusiness.displayName = 'PhoneNumberBusiness';

export default withOnyx<PhoneNumberBusinessProps, PhoneNumberBusinessOnyxProps>({
    reimbursementAccount: {
        key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
    },
})(PhoneNumberBusiness);