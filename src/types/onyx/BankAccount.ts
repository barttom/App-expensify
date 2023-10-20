import CONST from '../../CONST';
import AccountData from './AccountData';
import * as OnyxCommon from './OnyxCommon';

type BankAccount = {
    /** The bank account type */
    accountType?: typeof CONST.PAYMENT_METHODS.BANK_ACCOUNT;

    /** string like 'Account ending in XXXX' */
    description?: string;

    isDefault?: boolean;

    /** Date when the 3 micro amounts for validation were supposed to reach the bank account. */
    validateCodeExpectedDate?: string;

    /** string like 'bankAccount-{<bankAccountID>}' where <bankAccountID> is the bankAccountID */
    key?: string;

    /** Alias for bankAccountID */
    methodID?: number;

    /** Alias for addressName */
    title?: string;

    /** All data related to the bank account */
    accountData?: AccountData;

    /** Any additional error message to show */
    errors?: OnyxCommon.Errors;

    /** Indicates the type of change made to the bank account that hasn't been synced with the server yet  */
    pendingAction?: OnyxCommon.PendingAction;
};

export default BankAccount;
export type {AdditionalData, AccountData};
