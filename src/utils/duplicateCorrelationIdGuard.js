

export const isCorrelationIdAlreadySent = (correlationId, account) => {
    let correlationIdMapping = new Map(JSON.parse(localStorage.getItem('correlationIdMapping')));

    if(!correlationIdMapping) {
        localStorage.setItem('correlationIdMapping', JSON.stringify(Array.from(new Map())));
        correlationIdMapping = new Map();
    }
    let idsUsedForTransactionsForTheAccount = correlationIdMapping.get(account);
    if(!idsUsedForTransactionsForTheAccount) {
        idsUsedForTransactionsForTheAccount = [];
    }

    if(idsUsedForTransactionsForTheAccount.includes(correlationId)) {
            return true;  
    } else {
        idsUsedForTransactionsForTheAccount.push(correlationId);
        correlationIdMapping.set(account, idsUsedForTransactionsForTheAccount);
        localStorage.setItem('correlationIdMapping', JSON.stringify(Array.from(correlationIdMapping)));
    }
}