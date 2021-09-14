import React from 'react';
import {
    View, ScrollView, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import lodashGet from 'lodash/get';
import _ from 'underscore';
import styles from '../../styles/styles';
import ONYXKEYS from '../../ONYXKEYS';
import HeaderWithCloseButton from '../../components/HeaderWithCloseButton';
import Navigation from '../../libs/Navigation/Navigation';
import ScreenWrapper from '../../components/ScreenWrapper';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import withWindowDimensions, {windowDimensionsPropTypes} from '../../components/withWindowDimensions';
import compose from '../../libs/compose';
import Text from '../../components/Text';
import Button from '../../components/Button';
import variables from '../../styles/variables';
import themeDefault from '../../styles/themes/default';
import ROUTES from '../../ROUTES';
import CONST from '../../CONST';
import Permissions from '../../libs/Permissions';
import HeroCardWebImage from '../../../assets/images/cascading-cards-web.svg';
import HeroCardMobileImage from '../../../assets/images/cascading-cards-mobile.svg';
import BankAccount from '../../libs/models/BankAccount';
import {openSignedInLink} from '../../libs/actions/App';
import {setWorkspaceIDForReimbursementAccount} from '../../libs/actions/BankAccounts';

const propTypes = {
    /* Onyx Props */

    /** Beta features list */
    betas: PropTypes.arrayOf(PropTypes.string).isRequired,

    /** The details about the user that is signed in */
    user: PropTypes.shape({
        /** Whether or not the user has public domain */
        isFromPublicDomain: PropTypes.bool,

        /** Whether the user is using Expensify Card */
        isUsingExpensifyCard: PropTypes.bool,
    }),

    /** URL Route params */
    route: PropTypes.shape({
        /** Params from the URL path */
        params: PropTypes.shape({
            /** policyID passed via route: /workspace/:policyID/people */
            policyID: PropTypes.string,
        }),
    }).isRequired,

    /** Bank account currently in setup */
    reimbursementAccount: PropTypes.shape({
        /** Additional data */
        achData: PropTypes.shape({
            /** Bank account state */
            state: PropTypes.string,
        }),

        /** Whether we are loading this bank account */
        loading: PropTypes.bool,
    }),

    /** Draft of bank account currently in setup */
    // eslint-disable-next-line react/forbid-prop-types
    reimbursementAccountDraft: PropTypes.object,

    ...withLocalizePropTypes,
    ...windowDimensionsPropTypes,
};

const defaultProps = {
    user: {
        isFromPublicDomain: false,
        isUsingExpensifyCard: false,
    },
    reimbursementAccount: {
        loading: false,
    },
    reimbursementAccountDraft: {},
};

const WorkspaceCardPage = ({
    betas,
    user,
    translate,
    route,
    isSmallScreenWidth,
    isMediumScreenWidth,
    reimbursementAccount,
    reimbursementAccountDraft,
}) => {
    const achState = lodashGet(reimbursementAccount, 'achData.state', '');
    const shouldFinishSetup = !_.isEmpty(reimbursementAccountDraft)
        || achState === BankAccount.STATE.SETUP
        || achState === BankAccount.STATE.VERIFYING
        || achState === BankAccount.STATE.PENDING
        || achState === BankAccount.STATE.OPEN;
    let buttonText;

    const openBankSetupModal = () => {
        setWorkspaceIDForReimbursementAccount(route.params.policyID);
        Navigation.navigate(ROUTES.getBankAccountRoute());
    };

    if (user.isFromPublicDomain) {
        buttonText = translate('workspace.card.addEmail');
    } else if (user.isUsingExpensifyCard) {
        buttonText = translate('workspace.card.manageCards');
    } else if (shouldFinishSetup) {
        buttonText = translate('workspace.card.finishSetup');
        openBankSetupModal();
    } else {
        buttonText = translate('workspace.card.getStarted');
    }

    const onPress = () => {
        if (user.isFromPublicDomain) {
            openSignedInLink(CONST.ADD_SECONDARY_LOGIN_URL);
        } else if (user.isUsingExpensifyCard) {
            openSignedInLink(CONST.MANAGE_CARDS_URL);
        } else {
            openBankSetupModal();
        }
    };

    if (!Permissions.canUseFreePlan(betas)) {
        console.debug('Not showing workspace card page because user is not on free plan beta');
        return <Navigation.DismissModal />;
    }

    return (
        <ScreenWrapper style={[styles.defaultModalContainer]}>
            <HeaderWithCloseButton
                title={translate('workspace.common.card')}
                onCloseButtonPress={() => Navigation.dismissModal()}
                onBackButtonPress={() => Navigation.goBack()}
                shouldShowBackButton={isSmallScreenWidth}
                shouldShowInboxCallButton
                inboxCallTaskID="WorkspaceCompanyCards"
            />
            <ScrollView style={[styles.settingsPageBackground]}>
                <View style={styles.pageWrapper}>
                    <View style={[
                        styles.mb3,
                        styles.flexRow,
                        styles.workspaceCard,
                        isSmallScreenWidth && styles.workspaceCardMobile,
                        isMediumScreenWidth && styles.workspaceCardMediumScreen,
                    ]}
                    >
                        {isSmallScreenWidth || isMediumScreenWidth
                            ? (
                                <HeroCardMobileImage
                                    style={StyleSheet.flatten([
                                        styles.fullscreenCard,
                                        isSmallScreenWidth && styles.fullscreenCardMobile,
                                        isMediumScreenWidth && styles.fullscreenCardMediumScreen,
                                    ])}
                                />
                            )
                            : (
                                <HeroCardWebImage
                                    style={StyleSheet.flatten([styles.fullscreenCard, styles.fullscreenCardWeb])}
                                />
                            )}

                        <View style={[
                            styles.fullscreenCard,
                            styles.workspaceCardContent,
                            isSmallScreenWidth && styles.p5,
                            isMediumScreenWidth && styles.workspaceCardContentMediumScreen,
                        ]}
                        >
                            <View
                                style={[
                                    styles.flexGrow1,
                                    styles.justifyContentEnd,
                                    styles.alignItemsStart,
                                    !isSmallScreenWidth && styles.w50,
                                    isMediumScreenWidth && styles.w100,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.workspaceCardMainText,
                                        styles.mb5,
                                    ]}
                                    color={themeDefault.textReversed}
                                >
                                    {user.isUsingExpensifyCard
                                        ? translate('workspace.card.cardReadyTagline')
                                        : translate('workspace.card.tagline')}
                                </Text>
                                <Text
                                    fontSize={variables.fontSizeLarge}
                                    color={themeDefault.textReversed}
                                    style={[styles.mb8]}
                                >
                                    {user.isFromPublicDomain
                                        ? translate('workspace.card.publicCopy')
                                        : translate('workspace.card.privateCopy')}
                                </Text>
                                <Button
                                    style={[
                                        styles.alignSelfStart,
                                        styles.workspaceCardCTA,
                                        isSmallScreenWidth ? styles.wAuto : {},
                                    ]}
                                    textStyles={
                                        !isSmallScreenWidth ? [styles.pr5, styles.pl5] : []
                                    }
                                    onPress={onPress}
                                    success
                                    large
                                    text={buttonText}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

WorkspaceCardPage.propTypes = propTypes;
WorkspaceCardPage.defaultProps = defaultProps;
WorkspaceCardPage.displayName = 'WorkspaceCardPage';

export default compose(
    withLocalize,
    withWindowDimensions,
    withOnyx({
        user: {
            key: ONYXKEYS.USER,
        },
        reimbursementAccount: {
            key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
        },
        reimbursementAccountDraft: {
            key: ONYXKEYS.REIMBURSEMENT_ACCOUNT_DRAFT,
        },
        betas: {
            key: ONYXKEYS.BETAS,
        },
    }),
)(WorkspaceCardPage);
