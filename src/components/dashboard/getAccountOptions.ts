import {BalanceByLocationStock} from 'components/transactions/types';
import _ from 'lodash';
import {Account, Accounts} from 'types';

export const getAccountOptions = ({stocks, accounts}: {stocks: BalanceByLocationStock[]; accounts: Accounts}) => {
    return _.uniqBy(
        _.sortBy(
            stocks
                .filter((sh) => sh.quantity !== 0)
                .map((sh) => {
                    const account = accounts.find((a) => a.id === sh.money_location_id) as Account;

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
