import {BalanceByLocationStock} from 'transactions/defs';
import {TAccount, Accounts} from 'accounts/defs';
import _ from 'lodash';

export const getAccountOptions = ({stocks, accounts}: {stocks: BalanceByLocationStock[]; accounts: Accounts}) => {
    return _.uniqBy(
        _.sortBy(
            stocks
                .filter((sh) => sh.quantity !== 0)
                .map((sh) => {
                    const account = accounts.find((a) => a.id === sh.money_location_id) as TAccount;

                    return {
                        ...account,
                        value: String(sh.money_location_id),
                        label: account?.name ?? '',
                    };
                }),
            'label',
        ),
        'value',
    );
};
