import request from "request";
import 'dotenv/config';
import { getTimeStamp } from "../utils/utils.js";
import ngrok from "ngrok";

export const intitiateSTKPush= async(req,res)=>{
    try{
        const {amount,phone, OrderID}= req.body;
        const url= "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth= "Bearer " + req.safaricom_access_token;

        const timeStamp=getTimeStamp();

        //shortcode + pass_key + timeStamp
        const password=new Buffer.from(process.env.BUSINESS_SHORTCODE + process.env.PASS_KEY + timeStamp).toString("base64");

        //create callback url
        // const callback_url=await ngrok.connect(process.env.PORT);
        // const api= ngrok.getApi();
        // await api.listTunnels();

        request(
            {
                url: url,
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                json: {
                    "BusinessShortCode": process.env.BUSINESS_SHORTCODE,
                    "Password": password,
                    "Timestamp": timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": amount,
                    "PartyA": phone,
                    "PartyB": process.env.BUSINESS_SHORTCODE,
                    "PhoneNumber": phone,
                    "CallBackURL": process.env.BaseURL,
                    "AccountReference": "Tenzi Market",
                    "TransactionDesc": "Paid Online"
                }
            },
            function (e,response,body)
            {
                if(e)
                {
                    console.error(e);
                    res.status(503).send({
                        message: "Error with stk push",
                        error: e
                    })
                }
                else{
                    res.status(200).json(body);
                }
            }
        )

    }
    catch(error)
    {
        console.error("Error while trying to create LipaNaMpesa details",error)
        res.status(503).send({
            message:"Something went wrong while trying to create LipaNaMpesa details. Contact admin",
            error : error
        })
    }
}

export const stkPushCallback= async(req,res)=>{
    try{
        const {OrderID}= req.params;

        //callback details
        const {
            MerchantRequestID,
            CheckoutRequestID,
            ResultCode,
            ResultDesc,
            CallbackMetadata
        }= req.body.Body.stkCallback;

        const meta= Object.values(await CallbackMetadata.Item);
        const PhoneNumber=meta.find(o=>o.Name === 'PhoneNumber').Value.toString();
        const Amount= meta.find(o=> o.Name === 'Amount').Value.toString();
        const MpesaReceiptNumber= meta.find(o=> o.Name === 'MpesaReceiptNumber').Value.toString();
        const TransactionDate=meta.find(o=>o.Name === 'TransactionDate').Value.toString();

        console.log("_".repeat(20), "OUTPUT IN THE CALLBACK ", "-".repeat(20));
        console.log(`Order_Id: ${OrderID}, MerchantRequestId: ${MerchantRequestID}, CheckoutRequestId: ${CheckoutRequestID},
            ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}, PhoneNumber: ${PhoneNumber}, Amount: ${Amount},
            MpesaReceiptNumber: ${MpesaReceiptNumber}, TransactionDate: ${TransactionDate}`);

        res.json(true);    
        

    }
    catch(err){
        console.error("Error occured while trying to update LipaNaMpesa details from the callback", err);
        res.status(503).send({
            message: "Something went wrong with the callback",
            error:err.message
        })
    }
}

export const confirmpayment= async(req,res)=>{
    try{
        const url=process.env.confirmPayment;
        const auth= req.safaricom_access_token;

        const timeStamp= getTimeStamp();
        const password=new Buffer.from(process.env.BUSINESS_SHORTCODE + process.env.PASS_KEY + timeStamp).toString("base64");

        request(
            {
                url: url,
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                json: {
                    "BusinessShortCode": process.env.BUSINESS_SHORTCODE,
                    "Password": password,
                    "Timestamp": timeStamp,
                    "CheckoutRequestID": req.params.CheckoutRequestID
                }
            },
            function (error,response, body){
                if (error)
                {
                    console.log(error);
                    res.status(503).send({
                        message: "Something went wrong while confirming payment. Contact admin",
                        error: error
                    });
                }
                 else
                 {
                    res.status(200).json(body);
                }
            }
        )
    }
    catch(err)
    {
        console.error("An error occured while creating lipa na mpesa details ", err);
        res.status(503).send({
            message: "Something went wrong while trying to create lipa na mpesa details",
            error: err
        })
    }

}