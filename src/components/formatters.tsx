import {grey} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {Tooltip} from 'components/Tooltip';
import {spacingSmall} from 'defs/styles';
import {useCopyTextWithConfirmation} from 'helpers/clipboardService';
import {financialNum} from 'js/utils/numbers';
import * as React from 'react';
import {HTMLAttributes, useState} from 'react';
import {useCurrencies} from 'state/currencies';
import {usePrivacyToggle} from 'state/privacyToggle';

const PrivateValue = (props: HTMLAttributes<HTMLSpanElement>) => (
    <span {...props}>▒▒▒▒</span>
);

export const formatNumericValue = (value) =>
    new Intl.NumberFormat(undefined, {minimumFractionDigits: 2}).format(
        financialNum(value),
    );

const useStyles = makeStyles({
    value: {
        cursor: 'grabbing',
    },
});

const NumericValue = ({
    currency: rawCurrency,
    showCurrency = true,
    value,
    currencyStyle = {},
}) => {
    const cls = useStyles();
    const currencies = useCurrencies();
    const currency = rawCurrency || currencies.selected.iso_code;
    const copyText = useCopyTextWithConfirmation();
    const [privacyToggle] = usePrivacyToggle();
    const [isHidden, setIsHidden] = useState(privacyToggle);
    const inner = (
        <span>
            {currency && showCurrency && (
                <span style={{color: grey[500], ...currencyStyle}}>
                    {currency}
                </span>
            )}{' '}
            <strong
                className={cls.value}
                onClick={() => {
                    copyText(value);
                }}
            >
                {isHidden && privacyToggle ? (
                    <PrivateValue
                        onMouseOver={
                            privacyToggle ? () => setIsHidden(false) : undefined
                        }
                    />
                ) : (
                    formatNumericValue(value)
                )}
            </strong>
        </span>
    );

    const found = Object.values(currencies).find(
        (each) => each.iso_code === currency,
    );
    const tooltip = [
        <div
            key={currency}
            style={{
                backgroundColor: grey[700],
                borderRadius: '3px',
                padding: `3px ${spacingSmall}`,
                margin: `0 -${spacingSmall} ${spacingSmall}`,
            }}
        >
            {currency} {formatNumericValue(value)}
        </div>,
        ...Object.entries(found ? found.rates : {}).map(
            ([rateISO, rateMulti]) => (
                <div key={rateISO}>
                    {rateISO} {formatNumericValue(value * rateMulti)}
                </div>
            ),
        ),
    ];

    return <Tooltip tooltip={tooltip}>{inner}</Tooltip>;
};

export const numericValue = (
    value: number,
    {
        currency,
        showCurrency = true,
        currencyStyle = {},
    }: {
        currency?: string;
        showCurrency?: boolean;
        currencyStyle?: {};
    } = {},
) => (
    <NumericValue
        value={value}
        currency={currency}
        showCurrency={showCurrency}
        currencyStyle={currencyStyle}
    />
);
