export const Currencies = [
    { value: "USD", label: "$ Dollar", locale: "en-US" },
    { value: "EUR", label: "€ Euro", locale: "de-DE" },
    { value: "JPY", label: "\u{1F4B4} Yen", locale: "ja-JP" },
    { value: "GBP", label: "£ Pound", locale: "en-GB" },
]


export type Currency = (typeof Currencies)[0]