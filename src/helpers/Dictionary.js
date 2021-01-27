export const DIC = {
    COMMITED: 'commited',
    CONNECTED: 'connected',
    OPEN_PRODUCT: 'open_product',
    CLOSE_PRODUCT: 'close_product',
    ACTIVATE_QR_READER: 'activate_qr_reader',
    SET_OFFERING_PROGRESS: 'set_offering_progress',
    GET_OFFERING_PROGRESS: 'get_offering_progress',
    UPDATE_OFFERING_DATA: 'update_offering_data',
    LOAD_OFFERING_BACKUP: 'load_offering_backup',
    RESET_OFFERING_DATA: 'reset_offering_data',
    NAV: {
        CONTROL: 'navigationControl',
        DEF: 'default_view',
        COMMIT: 'commit_to_buy',
        REDEEM: 'redeem',
    },
    SHOW_MODAL: 'show_modal',
    ALL_VOUCHER_SETS: 'all_voucher_sets'
}

// CONTROL strings are used to execute commands related to Context
export const CONTROL = {
    UPDATE_LOCATION: 'updateLocation',
    UPDATE_AFFORDANCES: 'updateAffordances',
}

// ROUTE strings are used to navigate to url
export const ROUTE = {
    Home: '/',
    Connect: '/connect',
    ConnectToMetamask: '/connect-to-metamask',
    ShowQR: '/show-qr-code',
    NewOffer: '/new-offer',
    Activity: '/activity',
    ActivityVouchers: '/activity-vouchers',
    VoucherDetails: '/voucher',
    CodeScanner: '/code-scanner',
    Default: '/default',
    PARAMS: {
        ID: '/:id',
    },
    VoucherQRCode: '/qr'
}

// affordances list
export const AFFMAP = {
    BACK_BUTTON: 'back-button',
    QR_CODE_READER: 'qr-code-reader',
    WALLET_CONNECTION: 'wallet-connection',
}

// ROUTE strings are used in NewOffer for input fields
export const NAME = {
    CATEGORY: 'category',
    IMAGE: 'image',
    SELECTED_FILE: 'selected_file',
    TITLE: 'title',
    QUANTITY: 'quantity',
    CONDITION: 'condition',
    DESCRIPTION: 'description',
    PRICE_C: 'price_currency',
    PRICE: 'price',
    PRICE_SUFFIX: 'price_suffix',
    SELLER_DEPOSIT_C: 'seller_deposit_currency',
    SELLER_DEPOSIT: 'seller_deposit',
    SELLER_SUFFIX: 'seller_suffix',
    BUYER_DEPOSIT: 'buyer_deposit',
    BUYER_SUFFIX: 'buyer_suffix',
    DATE_START: 'start_date',
    DATE_END: 'end_date'
}

export const MODAL_TYPES = {
    GENERIC_ERROR: 'generic_error'
};

export const CURRENCY = {
    ETH: 'ETH',
    BSN: 'BSN',
}

// this is a placeholder object
export const STATUS = {
    OFFERED: 'voucher_status_offered',
    COMMITED: 'voucher_status_commited',
    REDEEMED: 'voucher_status_redeemed',
    COMPLAINED: 'voucher_status_complained',
    REFUNDED: 'voucher_status_refunded',
    CANCELLED: 'voucher_status_cancelled',
    FINALIZED: 'voucher_status_finalized',
}

export const ROLE = {
    BUYER: 'BUYER',
    SELLER: 'SELLER',
}

const populateOfferFlowScenario = () => {
    let object = {}

    Object.entries(ROLE).forEach(role => {
        object[role[0]] = {}
    
        Object.entries(STATUS).forEach(status => {
            object[role[0]][status[1]] = `${role[1]}:${status[1]}`
        })
    })

    return object
}

export const OFFER_FLOW_SCENARIO = populateOfferFlowScenario()



