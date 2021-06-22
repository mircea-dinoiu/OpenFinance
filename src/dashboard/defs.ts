import {BalanceByLocationStock} from 'transactions/defs';
import {TAccount} from 'accounts/defs';

export type CashAccount = TAccount & {total: number; totalCompare: number};
export type BrokerageAccount = CashAccount & {costBasis: number; stocks: BalanceByLocationStock[]};
