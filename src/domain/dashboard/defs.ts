import {BalanceByLocationStock} from 'components/transactions/types';
import {Account} from 'domain/accounts/defs';

export type CashAccount = Account & {total: number};
export type BrokerageAccount = CashAccount & {costBasis: number; stocks: BalanceByLocationStock[]};
