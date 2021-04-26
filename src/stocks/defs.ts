export enum StockType {
    CUSTOM = 'custom',
    MUTUAL_FUND = 'mf',
    ETF = 'etf',
    STOCK = 'stock',
    CRYPTO = 'crypto',
}

export type TStock = {id: number; price: number; symbol: string; currency_id: number; type: StockType};
