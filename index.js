require('dotenv').config()
const fs = require('fs');

const axios = require('axios').default;

const rippleAccountId = process.env.RIPPLE_ACCOUNT_ID;
const githubId = process.env.GITHUB_ID;
const rippleBaseUrl = `https://rxprod.wc.wallet.ripplex.io/accounts/${githubId}`;
const rippleBalanceUrl = `${rippleBaseUrl}/balance`;
// const ripplePaymentUrl = `${rippleBaseUrl}/pay`;
const ripplePaymentUrl = `https://ripplex.io/portal/ilp/hermes/accounts/b69liu/pay`;
const ripplexToken = process.env.RIPPLEX_TOKEN;

const rafikiPaymentPointer = process.env.RAFIKI_PAYMENT_POINTER;
const rafikiBalanceUrl = `https://rafiki.money/api//users/me/balance`;
const rafikiPaymentUrl = `https://rafiki.money/api//payments/peer`;
const rafikiToken = process.env.RAFIKI_TOKEN;

async function getBalance(url, token){
    try{
        const response = await axios.get(url,{headers: {
            Accept: "application/json",
            authorization: `Bearer ${token}`
        }})
    
        if(response.data){
            return response.data;
        }
    }catch(error){
        console.log(error);
    }
}

async function sendMoneyFromRippleToRifiki(paymentUrl, paymentPointer, amount, token){
    try{
        const response = await axios.post(paymentUrl, {
            amount,
            destinationPaymentPointer: paymentPointer
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                authorization: `Bearer ${token}`
            }
        });
        if(response.data){
            return response.data;
        }else{
            console.log(response);
        }
    }catch(error){
        console.log(error);
    }
}

async function sendMoneyFromRifikiToRipple(paymentUrl, paymentPointer, amount, token){
    try{
        const response = await axios.post(paymentUrl, {
            accountId: 1210,
            amount,
            receiverPaymentPointer: paymentPointer,
            type: "spsp"
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                authorization: `Bearer ${token}`
            }
        });
        if(response.data){
            return response.data;
        }else{
            console.log(response);
        }
    }catch(error){
        console.log(error);
    }
}


async function main(){
    await getBalance(rippleBalanceUrl, ripplexToken).then((result) => {
        console.log("Ripple Balance:",result);
    });
    // await getBalance(rafikiBalanceUrl, rafikiToken).then((result) => {
    //     console.log("Rafiki Balance:",result);
    // });
    const payresult = await sendMoneyFromRippleToRifiki(ripplePaymentUrl, rafikiPaymentPointer, "100000000", ripplexToken);
    console.log(payresult)
    // sendMoneyFromRifikiToRipple(rafikiPaymentUrl, rippleAccountId, "1000000", rafikiToken).then((result) => {
    //     console.log("sendMoneyFromRifikiToRipple result:",result);
    // });;

}

main();