import {BalanceByLocationStock} from 'transactions/defs';
import {Account} from 'accounts/defs';

export type CashAccount = Account & {total: number};
export type BrokerageAccount = CashAccount & {costBasis: number; stocks: BalanceByLocationStock[]};
