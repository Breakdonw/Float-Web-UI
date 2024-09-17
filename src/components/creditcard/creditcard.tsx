import CreditCardSpending from "../charts/pie/creditcard"

export default function CreditCardPayoff({spendData, info}){
    console.log(spendData)
    return(
        <>

                <CreditCardSpending  spendData={spendData} info={info}/>
        </>
    )
}