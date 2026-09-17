export const formatAriary = (amount: number): string =>{
    return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0
    }).format(amount);
};