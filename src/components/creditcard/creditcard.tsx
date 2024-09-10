import CreditCardSpending from "../charts/pie/creditcard"

export default function CreditCardPayoff({spendData, info}){

    return(
        <>
                <CreditCardSpending  spendData={spendData} info={info}/>
        </>
    )
}