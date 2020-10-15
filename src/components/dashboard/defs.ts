import {BalanceByLocationStock} from 'components/transactions/types';
import {Account} from 'types';

export type CashAccount = Account & {total: number};
export type BrokerageAccount = CashAccount & {costBasis: number; stocks: BalanceByLocationStock[]};
