import CreditCardSpending from "../charts/pie/creditcard"

export default function CreditCardPayoff({spendData}){
    return(
        <>

                <CreditCardSpending  spendData={spendData} />
        </>
    )
}