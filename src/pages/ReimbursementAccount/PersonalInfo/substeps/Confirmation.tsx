import React, {useMemo} from 'react';
import {ScrollView, View} from 'react-native';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import Button from '@components/Button';
import DotIndicatorMessage from '@components/DotIndicatorMessage';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/Text';
import TextLink from '@components/TextLink';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ErrorUtils from '@libs/ErrorUtils';
import getSubstepValues from '@pages/ReimbursementAccount/utils/getSubstepValues';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {ReimbursementAccount, ReimbursementAccountForm} from '@src/types/onyx';

type ConfirmationOnyxProps = {
    /** Reimbursement account from ONYX */
    reimbursementAccount: OnyxEntry<ReimbursementAccount>;

    /** The draft values of the bank account being setup */
    reimbursementAccountDraft: OnyxEntry<ReimbursementAccountForm>;
};

type ConfirmationProps = ConfirmationOnyxProps & SubStepProps;

const PERSONAL_INFO_STEP_KEYS = CONST.BANK_ACCOUNT.PERSONAL_INFO_STEP.INPUT_KEY;

function Confirmation({reimbursementAccount, reimbursementAccountDraft, onNext, onMove}: ConfirmationProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const isLoading = reimbursementAccount?.isLoading ?? false;
    const values = useMemo(() => getSubstepValues(PERSONAL_INFO_STEP_KEYS, reimbursementAccountDraft, reimbursementAccount), [reimbursementAccount, reimbursementAccountDraft]);
    const error = ErrorUtils.getLatestErrorMessage(reimbursementAccount ?? {});

    return (
        <ScreenWrapper
            testID={Confirmation.displayName}
            style={[styles.pt5]}
        >
            <ScrollView contentContainerStyle={styles.flexGrow1}>
                <Text style={[styles.textHeadline, styles.ph5, styles.mb3]}>{translate('personalInfoStep.letsDoubleCheck')}</Text>
                <MenuItemWithTopDescription
                    description={translate('personalInfoStep.legalName')}
                    title={`${values[PERSONAL_INFO_STEP_KEYS.FIRST_NAME]} ${values[PERSONAL_INFO_STEP_KEYS.LAST_NAME]}`}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(0);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('common.dob')}
                    title={values[PERSONAL_INFO_STEP_KEYS.DOB]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(1);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('personalInfoStep.last4SSN')}
                    title={values[PERSONAL_INFO_STEP_KEYS.SSN_LAST_4]}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(2);
                    }}
                />
                <MenuItemWithTopDescription
                    description={translate('personalInfoStep.address')}
                    title={`${values[PERSONAL_INFO_STEP_KEYS.STREET]}, ${values[PERSONAL_INFO_STEP_KEYS.CITY]}, ${values[PERSONAL_INFO_STEP_KEYS.STATE]} ${
                        values[PERSONAL_INFO_STEP_KEYS.ZIP_CODE]
                    }`}
                    shouldShowRightIcon
                    onPress={() => {
                        onMove(3);
                    }}
                />

                <Text style={[styles.mt3, styles.ph5, styles.textMicroSupporting]}>
                    {`${translate('personalInfoStep.byAddingThisBankAccount')} `}
                    <TextLink
                        href={CONST.ONFIDO_FACIAL_SCAN_POLICY_URL}
                        style={[styles.textMicro]}
                    >
                        {translate('onfidoStep.facialScan')}
                    </TextLink>
                    {', '}
                    <TextLink
                        href={CONST.ONFIDO_PRIVACY_POLICY_URL}
                        style={[styles.textMicro]}
                    >
                        {translate('common.privacy')}
                    </TextLink>
                    {` ${translate('common.and')} `}
                    <TextLink
                        href={CONST.ONFIDO_TERMS_OF_SERVICE_URL}
                        style={[styles.textMicro]}
                    >
                        {translate('common.termsOfService')}
                    </TextLink>
                </Text>
                <View style={[styles.ph5, styles.mtAuto]}>
                    {error.length > 0 && (
                        <DotIndicatorMessage
                            textStyles={[styles.formError]}
                            type="error"
                            messages={{error}}
                        />
                    )}
                    <Button
                        success
                        isLoading={isLoading}
                        style={[styles.w100, styles.mt2, styles.pb5]}
                        onPress={onNext}
                        text={translate('common.confirm')}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

Confirmation.displayName = 'Confirmation';

export default withOnyx<ConfirmationProps, ConfirmationOnyxProps>({
    reimbursementAccount: {
        key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
    },
    reimbursementAccountDraft: {
        key: ONYXKEYS.FORMS.REIMBURSEMENT_ACCOUNT_FORM_DRAFT,
    },
})(Confirmation);